-- ─────────────────────────────────────────────────────────────────────────────
-- 0010_consume_invite_lock_user.sql — CRIT-1 fix
--
-- 0004's signature accepted p_user_id and p_email straight from the client.
-- Because the function is SECURITY DEFINER and is callable by any authenticated
-- user, an attacker could `supabase.rpc('consume_invite', { p_user_id: <other>,
-- p_email: '...' })` and claim a token bound to a different user — sequester
-- profile, impersonate, etc.
--
-- This migration replaces the function with a hardened version that takes the
-- user id and email straight from `auth.uid()` / `auth.users`. The route
-- handler is updated to match the new 2-arg signature.
-- ─────────────────────────────────────────────────────────────────────────────

-- Drop the old vulnerable signature (cannot use OR REPLACE because we change
-- the parameter list).
drop function if exists public.consume_invite(text, uuid, text, text);

create or replace function public.consume_invite(
  p_token text,
  p_name  text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_invite      record;
  v_profile_id  uuid;
  v_user_id     uuid;
  v_user_email  text;
begin
  -- Identity comes from the session — never from arguments.
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'unauthenticated' using errcode = 'P0005';
  end if;

  if p_token is null or length(p_token) < 8 then
    raise exception 'invite_invalid' using errcode = 'P0001';
  end if;

  -- Idempotent path: a profile already exists for this user; nothing to do.
  select id into v_profile_id from public.profiles where id = v_user_id;
  if v_profile_id is not null then
    return v_profile_id;
  end if;

  -- Email comes from auth.users, not from the client. Even if the route handler
  -- is compromised, the email recorded in `profiles` is the one Supabase Auth
  -- actually verified.
  select email into v_user_email from auth.users where id = v_user_id;

  -- Lock the invite to prevent two concurrent claims.
  select id, tenant_id, used_at, expires_at, full_name, email
    into v_invite
    from public.invites
   where token = p_token
   for update;

  if not found then
    raise exception 'invite_not_found' using errcode = 'P0002';
  end if;

  if v_invite.used_at is not null then
    raise exception 'invite_already_used' using errcode = 'P0003';
  end if;

  if v_invite.expires_at is not null and v_invite.expires_at < now() then
    raise exception 'invite_expired' using errcode = 'P0004';
  end if;

  -- Atomic claim: mark used + create the student profile.
  update public.invites set used_at = now() where id = v_invite.id;

  insert into public.profiles (id, tenant_id, role, full_name, email)
  values (
    v_user_id,
    v_invite.tenant_id,
    'student',
    coalesce(nullif(trim(p_name), ''), v_invite.full_name, 'Aluna'),
    coalesce(v_user_email, v_invite.email)
  )
  returning id into v_profile_id;

  return v_profile_id;
end;
$$;

revoke all on function public.consume_invite(text, text) from public;
revoke execute on function public.consume_invite(text, text) from anon;
grant execute on function public.consume_invite(text, text) to authenticated;

comment on function public.consume_invite(text, text) is
  'Atomically redeems an invite token using auth.uid() as the user identity. SECURITY DEFINER but locked: identity is the session subject, not a client-supplied parameter. CRIT-1 hardening — see analysis/04-security-lgpd.md.';
