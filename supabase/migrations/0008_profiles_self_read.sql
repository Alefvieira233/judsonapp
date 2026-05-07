-- ─────────────────────────────────────────────────────────────────────────────
-- 0008_profiles_self_read.sql
--
-- The hardened policy `profiles_tenant_read` requires `auth_tenant_id() =
-- tenant_id` to read a profile, but `auth_tenant_id()` itself reads from
-- profiles. On a fresh request after login, the SELECT-by-id used to detect
-- "do I already have a profile?" returns nothing because RLS blocks it,
-- causing getCurrentProfile() to attempt a duplicate INSERT and bounce the
-- user into a redirect loop.
--
-- Fix: every user can always SELECT their own row by id. The tenant-scoped
-- policy still gates reads for other profiles in the tenant.
-- ─────────────────────────────────────────────────────────────────────────────

create policy "profiles_self_read" on profiles for select to authenticated
  using (auth.uid() = id);
