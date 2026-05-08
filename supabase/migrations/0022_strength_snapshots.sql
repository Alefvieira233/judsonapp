-- ─────────────────────────────────────────────────────────────────────────────
-- 0022_strength_snapshots.sql
--
-- Snapshot diário do strength score por grupo muscular. computeStrengthScore
-- retorna o score atual (volume rolling 30d); pra ver evolução precisamos
-- salvar 1 row/dia. Cron diário roda às 4h UTC e faz upsert idempotente.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.strength_snapshots (
  id               uuid primary key default gen_random_uuid(),
  tenant_id        uuid not null references public.tenants(id) on delete cascade,
  user_id          uuid not null references public.profiles(id) on delete cascade,
  snapshot_date    date not null,
  score_chest      smallint not null default 0,
  score_back       smallint not null default 0,
  score_legs       smallint not null default 0,
  score_shoulders  smallint not null default 0,
  score_arms       smallint not null default 0,
  score_core       smallint not null default 0,
  created_at       timestamptz not null default now(),

  constraint strength_snapshots_user_date_uq unique (user_id, snapshot_date)
);

create index if not exists strength_snapshots_user_idx
  on public.strength_snapshots (user_id, snapshot_date desc);

create index if not exists strength_snapshots_tenant_idx
  on public.strength_snapshots (tenant_id, snapshot_date desc);

alter table public.strength_snapshots enable row level security;

drop policy if exists strength_snapshots_owner_or_self_read on public.strength_snapshots;
create policy strength_snapshots_owner_or_self_read
  on public.strength_snapshots for select to authenticated
  using (
    tenant_id = public.auth_tenant_id()
    and (user_id = auth.uid() or public.auth_role() = 'owner')
  );

comment on table public.strength_snapshots is
  'Snapshot diário do strength score por grupo muscular. Populated pelo cron /api/cron/strength-snapshot (4h UTC). Idempotente via unique (user_id, snapshot_date).';
