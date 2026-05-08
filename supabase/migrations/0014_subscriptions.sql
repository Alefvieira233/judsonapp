-- ─────────────────────────────────────────────────────────────────────────────
-- 0014_subscriptions.sql
--
-- Adds recurring billing primitives for Pix/cartão/boleto via Asaas (provider
-- chosen because it's the de-facto API for personal trainers no Brasil; suporta
-- Pix recorrente nativo, sandbox grátis e webhook simples).
--
--   • subscriptions   — uma linha por assinatura ativa/pendente/cancelada da
--                       aluna num plano. provider/provider_subscription_id
--                       guardam o vínculo com o Asaas pra reconciliar webhooks.
--   • payment_events  — audit trail idempotente dos webhooks recebidos. Chave
--                       única em (provider, provider_event_id) garante que
--                       reentregas não dupliquem efeitos.
--   • profiles.asaas_customer_id — cache do customer id (criado on-demand).
--
-- Writes só via service_role (webhook handler usa createAdminClient). Aluna
-- e owner têm SELECT controlado por tenant_id + role. Schema multi-tenant ready.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1) profiles: cache do customer Asaas ────────────────────────────────────
alter table public.profiles
  add column if not exists asaas_customer_id text;

-- ── 2) subscriptions ────────────────────────────────────────────────────────
create table if not exists public.subscriptions (
  id                       uuid primary key default gen_random_uuid(),
  tenant_id                uuid not null references public.tenants(id) on delete cascade,
  student_id               uuid not null references public.profiles(id) on delete cascade,
  plan_id                  uuid references public.plans(id) on delete set null,
  status                   text not null default 'pending'
    check (status in ('active', 'past_due', 'canceled', 'pending')),
  provider                 text not null default 'asaas'
    check (provider in ('asaas', 'manual')),
  provider_subscription_id text,
  billing_cycle            text not null default 'monthly'
    check (billing_cycle in ('monthly', 'quarterly', 'yearly')),
  value_cents              int not null check (value_cents >= 0),
  started_at               timestamptz,
  current_period_end       timestamptz,
  canceled_at              timestamptz,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

-- Reconciliação por provider_subscription_id no webhook precisa ser O(1).
create unique index if not exists subscriptions_provider_sub_uq
  on public.subscriptions (provider, provider_subscription_id)
  where provider_subscription_id is not null;

create index if not exists subscriptions_tenant_status_idx
  on public.subscriptions (tenant_id, status);

create index if not exists subscriptions_student_idx
  on public.subscriptions (student_id, created_at desc);

drop trigger if exists set_subscriptions_updated_at on public.subscriptions;
create trigger set_subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.trigger_set_timestamp();

alter table public.subscriptions enable row level security;

-- Aluna lê só as suas; owner lê todas do tenant.
drop policy if exists subscriptions_owner_or_self_read on public.subscriptions;
create policy subscriptions_owner_or_self_read
  on public.subscriptions for select to authenticated
  using (
    tenant_id = public.auth_tenant_id()
    and (student_id = auth.uid() or public.auth_role() = 'owner')
  );

-- INSERT/UPDATE/DELETE só via service_role (webhook). Sem policy = sem acesso
-- pro role authenticated, exatamente o que queremos: aluna não forja status
-- "active" pra liberar plano sem pagar.

-- ── 3) payment_events (audit + idempotência) ────────────────────────────────
create table if not exists public.payment_events (
  id                 uuid primary key default gen_random_uuid(),
  tenant_id          uuid references public.tenants(id) on delete cascade,
  subscription_id    uuid references public.subscriptions(id) on delete set null,
  provider           text not null default 'asaas',
  provider_event_id  text not null,
  event_type         text not null,
  amount_cents       int,
  status             text,
  raw                jsonb not null,
  created_at         timestamptz not null default now()
);

-- Idempotência: reentregas do Asaas trazem o mesmo id no payload. Conflito =
-- já processado, NOOP.
create unique index if not exists payment_events_provider_evt_uq
  on public.payment_events (provider, provider_event_id);

create index if not exists payment_events_subscription_idx
  on public.payment_events (subscription_id, created_at desc);

create index if not exists payment_events_tenant_idx
  on public.payment_events (tenant_id, created_at desc);

alter table public.payment_events enable row level security;

drop policy if exists payment_events_owner_or_self_read on public.payment_events;
create policy payment_events_owner_or_self_read
  on public.payment_events for select to authenticated
  using (
    tenant_id = public.auth_tenant_id()
    and (
      public.auth_role() = 'owner'
      or subscription_id in (
        select id from public.subscriptions
        where student_id = auth.uid()
      )
    )
  );

-- Idem subscriptions: writes só via service_role.

comment on table public.subscriptions is
  'Recurring billing state mirrored from Asaas (or manual). Updated only by webhook via service_role.';
comment on table public.payment_events is
  'Idempotent audit trail for payment provider webhooks. (provider, provider_event_id) is unique.';
