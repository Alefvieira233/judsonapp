-- ─────────────────────────────────────────────────────────────────────────────
-- 0021_personal_records.sql
--
-- Personal records (PR) por exercício. Uma row por PR — diferente de
-- badges_earned (unique por user_id+badge_key, destrava 1x). Aqui queremos
-- guardar a trilha completa de "quando bateu o quê", inclusive pra alimentar
-- feed na home e o evaluateBadges decidir entre pr-load (1º PR) e pr-load-10
-- (10 PRs totais).
--
-- workout_item_id é a referência do exercício prescrito num treino específico.
-- Snapshotamos exercise_name pra não quebrar quando o owner remover um item
-- depois (FK SET NULL). achieved_at = quando a série foi logada.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.personal_records (
  id              uuid primary key default gen_random_uuid(),
  tenant_id       uuid not null references public.tenants(id) on delete cascade,
  user_id         uuid not null references public.profiles(id) on delete cascade,
  workout_item_id uuid references public.workout_items(id) on delete set null,
  exercise_name   text not null,
  prev_max        numeric(6,2) not null default 0,
  new_max         numeric(6,2) not null,
  achieved_at     timestamptz not null default now(),
  created_at      timestamptz not null default now()
);

create index if not exists personal_records_user_idx
  on public.personal_records (user_id, achieved_at desc);

create index if not exists personal_records_tenant_idx
  on public.personal_records (tenant_id, achieved_at desc);

create index if not exists personal_records_user_item_idx
  on public.personal_records (user_id, workout_item_id);

alter table public.personal_records enable row level security;

drop policy if exists personal_records_owner_or_self_read on public.personal_records;
create policy personal_records_owner_or_self_read
  on public.personal_records for select to authenticated
  using (
    tenant_id = public.auth_tenant_id()
    and (user_id = auth.uid() or public.auth_role() = 'owner')
  );

drop policy if exists personal_records_self_insert on public.personal_records;
create policy personal_records_self_insert
  on public.personal_records for insert to authenticated
  with check (
    tenant_id = public.auth_tenant_id()
    and user_id = auth.uid()
  );

comment on table public.personal_records is
  'Histórico de PRs (Personal Records) de carga por exercício. Uma row por PR — alimenta feed na home e a contagem usada por badges pr-load / pr-load-10.';
