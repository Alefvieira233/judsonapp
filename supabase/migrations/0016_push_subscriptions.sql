-- ─────────────────────────────────────────────────────────────────────────────
-- 0015_push_subscriptions.sql
--
-- Web Push subscriptions (VAPID). Each row represents a single browser/device
-- subscription endpoint registered via the Push API. A user can have many rows
-- (laptop chrome, phone PWA, etc.). Endpoints are unique globally — Mozilla /
-- Google push servers issue them.
--
-- RLS:
--   • The subscriber reads/writes their own rows.
--   • The tenant owner reads all rows in their tenant (to fan out pushes).
--   • Inserts and deletes done from server-side handlers under the user's auth
--     session — never via service-role from the browser.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.push_subscriptions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  tenant_id     uuid references public.tenants(id) on delete set null,
  endpoint      text not null unique,
  p256dh        text not null,
  auth          text not null,
  user_agent    text,
  created_at    timestamptz not null default now(),
  last_used_at  timestamptz not null default now()
);

create index if not exists push_subscriptions_user_idx
  on public.push_subscriptions (user_id);
create index if not exists push_subscriptions_tenant_idx
  on public.push_subscriptions (tenant_id);

alter table public.push_subscriptions enable row level security;

-- Subscriber sees and manages their own rows.
drop policy if exists push_subscriptions_self_read on public.push_subscriptions;
create policy push_subscriptions_self_read
  on public.push_subscriptions for select to authenticated
  using (user_id = auth.uid());

drop policy if exists push_subscriptions_self_insert on public.push_subscriptions;
create policy push_subscriptions_self_insert
  on public.push_subscriptions for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists push_subscriptions_self_update on public.push_subscriptions;
create policy push_subscriptions_self_update
  on public.push_subscriptions for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists push_subscriptions_self_delete on public.push_subscriptions;
create policy push_subscriptions_self_delete
  on public.push_subscriptions for delete to authenticated
  using (user_id = auth.uid());

-- Owner of a tenant can read every subscription in their tenant. Uses the
-- SECURITY INVOKER helpers from migration 0011 (no DEFINER on auth_role /
-- auth_tenant_id), so this policy resolves under the caller's grants.
drop policy if exists push_subscriptions_owner_read on public.push_subscriptions;
create policy push_subscriptions_owner_read
  on public.push_subscriptions for select to authenticated
  using (
    tenant_id is not null
    and tenant_id = public.auth_tenant_id()
    and public.auth_role() = 'owner'
  );

-- Owner can delete stale rows from their tenant (cleanup of expired endpoints).
drop policy if exists push_subscriptions_owner_delete on public.push_subscriptions;
create policy push_subscriptions_owner_delete
  on public.push_subscriptions for delete to authenticated
  using (
    tenant_id is not null
    and tenant_id = public.auth_tenant_id()
    and public.auth_role() = 'owner'
  );

comment on table public.push_subscriptions is
  'Web Push (VAPID) subscriptions per user/device. Created by /api/push/subscribe; consumed by server-side push fan-out.';
