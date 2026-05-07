-- ─────────────────────────────────────────────────────────────────────────────
-- 0004_consume_invite.sql — atomic invite redemption
--
-- The /auth/callback route calls this RPC right after exchanging the OTP code
-- for a session. It:
--   1. Locks the invite row (FOR UPDATE) to avoid double-claim races.
--   2. Returns idempotently if a profile already exists for the user.
--   3. Inserts a profile (role=student) and marks the invite used in one go.
--
-- Errors raised use distinct SQLSTATEs so the route handler can map them to
-- friendly messages without parsing strings.
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function consume_invite(
  p_token   text,
  p_user_id uuid,
  p_name    text,
  p_email   text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_invite      record;
  v_profile_id  uuid;
begin
  if p_token is null or length(p_token) < 8 then
    raise exception 'invite_invalid' using errcode = 'P0001';
  end if;
  if p_user_id is null then
    raise exception 'user_required' using errcode = 'P0001';
  end if;

  -- Idempotent path: a profile already exists for this user; nothing to do.
  select id into v_profile_id from profiles where id = p_user_id;
  if v_profile_id is not null then
    return v_profile_id;
  end if;

  -- Lock the invite to prevent two concurrent claims.
  select id, tenant_id, used_at, expires_at, full_name, email
    into v_invite
    from invites
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
  update invites set used_at = now() where id = v_invite.id;

  insert into profiles (id, tenant_id, role, full_name, email)
  values (
    p_user_id,
    v_invite.tenant_id,
    'student',
    coalesce(nullif(trim(p_name), ''), v_invite.full_name, 'Aluna'),
    coalesce(nullif(trim(p_email), ''), v_invite.email)
  )
  returning id into v_profile_id;

  return v_profile_id;
end;
$$;

revoke all on function consume_invite(text, uuid, text, text) from public;
grant execute on function consume_invite(text, uuid, text, text) to authenticated;

comment on function consume_invite(text, uuid, text, text) is
  'Atomically redeems an invite token: locks invite row, creates the student profile, marks invite used. Idempotent per user. Used by /auth/callback.';
