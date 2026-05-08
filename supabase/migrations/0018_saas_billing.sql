-- Tenant subscriptions: charges the personal trainer for the SaaS plan.
-- Distinct from public.subscriptions, which charges the student.
create table if not exists public.tenant_subscriptions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text not null default 'trialing'
    check (status in ('active', 'past_due', 'canceled', 'trialing', 'incomplete', 'unpaid')),
  plan text not null default 'starter'
    check (plan in ('starter', 'pro', 'enterprise')),
  current_period_end timestamptz,
  trial_end timestamptz,
  value_cents integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists tenant_subscriptions_tenant_id_key
  on public.tenant_subscriptions(tenant_id);
create index if not exists idx_tenant_subscriptions_stripe_customer
  on public.tenant_subscriptions(stripe_customer_id)
  where stripe_customer_id is not null;
create index if not exists idx_tenant_subscriptions_stripe_subscription
  on public.tenant_subscriptions(stripe_subscription_id)
  where stripe_subscription_id is not null;

alter table public.tenant_subscriptions enable row level security;

drop policy if exists "owner reads own tenant subscription" on public.tenant_subscriptions;
create policy "owner reads own tenant subscription"
  on public.tenant_subscriptions
  for select
  to authenticated
  using (
    tenant_id = public.auth_tenant_id()
    and public.auth_role() = 'owner'
  );

-- Service role bypasses RLS; the Stripe webhook (admin client) is the sole writer.

alter table public.tenants
  add column if not exists stripe_customer_id text;
create index if not exists idx_tenants_stripe_customer_id
  on public.tenants(stripe_customer_id)
  where stripe_customer_id is not null;

-- Owner pin: bootstrap auth.ts only auto-provisions the owner profile when this
-- user matches. Closes the auto-provision back door (any first login).
alter table public.tenants
  add column if not exists owner_user_id uuid references auth.users(id) on delete set null;

create index if not exists idx_tenants_owner_user_id
  on public.tenants(owner_user_id)
  where owner_user_id is not null;

create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete set null,
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  target_type text,
  target_id text,
  metadata jsonb not null default '{}'::jsonb,
  ip text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_log_tenant_created_at
  on public.audit_log(tenant_id, created_at desc);
create index if not exists idx_audit_log_actor
  on public.audit_log(actor_user_id, created_at desc);

alter table public.audit_log enable row level security;

drop policy if exists "owner reads own tenant audit log" on public.audit_log;
create policy "owner reads own tenant audit log"
  on public.audit_log
  for select
  to authenticated
  using (
    tenant_id = public.auth_tenant_id()
    and public.auth_role() = 'owner'
  );

create table if not exists public.stripe_events (
  event_id text primary key,
  type text not null,
  received_at timestamptz not null default now(),
  payload jsonb not null
);

alter table public.stripe_events enable row level security;
-- No policies: service_role only.

create or replace function public.touch_tenant_subscriptions_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_tenant_subscriptions_touch on public.tenant_subscriptions;
create trigger trg_tenant_subscriptions_touch
  before update on public.tenant_subscriptions
  for each row execute function public.touch_tenant_subscriptions_updated_at();
