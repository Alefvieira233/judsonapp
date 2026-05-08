-- ─────────────────────────────────────────────────────────────────────────────
-- 0011_consents_and_invoker_helpers.sql
--
-- Bundles two security/compliance fixes:
--   1. Adds the `consents` table required for LGPD-compliant tracking of
--      explicit Terms / Privacy acceptance (LGPD-3 in analysis/04-security-lgpd).
--   2. Switches `auth_role`, `auth_tenant_id` and `set_referral_code` away from
--      SECURITY DEFINER (advisor 0029 + function_search_path_mutable) and pins
--      their search_path to '' so they cannot be tricked by schema injection.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1) Consents ─────────────────────────────────────────────────────────────
create table if not exists public.consents (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  tenant_id       uuid references public.tenants(id) on delete set null,
  policy_version  text not null,
  terms_version   text not null,
  accepted_at     timestamptz not null default now(),
  ip              text,
  user_agent      text,
  context         text not null check (context in ('invite', 'student_login', 'owner_login', 'self_service'))
);

create index if not exists consents_user_id_idx on public.consents (user_id, accepted_at desc);
create index if not exists consents_tenant_idx  on public.consents (tenant_id, accepted_at desc);

alter table public.consents enable row level security;

-- A user reads only their own consents.
drop policy if exists consents_self_read on public.consents;
create policy consents_self_read
  on public.consents for select to authenticated
  using (user_id = auth.uid());

-- Inserts must be server-side via a service-role client (the consent log is
-- evidence — the user shouldn't be able to forge entries pretending to have
-- accepted earlier versions). The migration grants no INSERT/UPDATE/DELETE to
-- authenticated; only service_role retains full access via bypass.
revoke insert, update, delete on public.consents from authenticated, anon;

-- ── 2) Helpers: SECURITY INVOKER + pinned search_path ───────────────────────
-- auth_role and auth_tenant_id read the caller's own profile row. With RLS
-- profiles_self_read they don't need DEFINER privileges. Removing DEFINER
-- closes the advisor warning AND prevents future surprises (e.g. someone
-- accidentally extending the function to read other users' data).
alter function public.auth_role()        security invoker;
alter function public.auth_tenant_id()   security invoker;

-- set_referral_code runs in BEFORE INSERT trigger context — pin its search_path
-- so a malicious schema cannot shadow gen_random_bytes / random / encode.
alter function public.set_referral_code() set search_path = '';

comment on table public.consents is
  'LGPD audit log for Terms+Privacy acceptance. Append-only via service_role.';
