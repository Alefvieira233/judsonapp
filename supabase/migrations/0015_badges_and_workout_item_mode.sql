-- ─────────────────────────────────────────────────────────────────────────────
-- 0015_badges_and_workout_item_mode.sql
--
-- Gamificação:
--   • badges_earned     — uma linha por (user_id, badge_key). Catálogo das
--                         badges fica em src/lib/badges.ts (não na DB) pra
--                         iterar sem migration. Unique impede dupes — destrava
--                         só uma vez. metadata jsonb guarda contexto opcional
--                         (ex.: streak length no momento do unlock).
--   • workout_items.mode — 'reps' (default) ou 'seconds' pra exercícios de
--                         tempo (prancha, isometria). Quando mode='seconds',
--                         exercise_logs.reps_done passa a representar segundos.
--
-- RLS: aluna lê os próprios; owner lê todos do tenant. Writes via authenticated
-- (a aluna gera as próprias badges quando completa o treino, server-side).
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1) badges_earned ────────────────────────────────────────────────────────
create table if not exists public.badges_earned (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  tenant_id   uuid not null references public.tenants(id) on delete cascade,
  badge_key   text not null,
  earned_at   timestamptz not null default now(),
  metadata    jsonb not null default '{}'::jsonb,

  constraint badges_earned_user_key_uq unique (user_id, badge_key)
);

create index if not exists badges_earned_user_idx
  on public.badges_earned (user_id, earned_at desc);

create index if not exists badges_earned_tenant_idx
  on public.badges_earned (tenant_id, earned_at desc);

alter table public.badges_earned enable row level security;

drop policy if exists badges_earned_owner_or_self_read on public.badges_earned;
create policy badges_earned_owner_or_self_read
  on public.badges_earned for select to authenticated
  using (
    tenant_id = public.auth_tenant_id()
    and (user_id = auth.uid() or public.auth_role() = 'owner')
  );

-- A aluna grava apenas para si mesma. evaluateBadges roda server-side
-- com a sessão da aluna; tenant_id é checado pelo predicado.
drop policy if exists badges_earned_self_insert on public.badges_earned;
create policy badges_earned_self_insert
  on public.badges_earned for insert to authenticated
  with check (
    tenant_id = public.auth_tenant_id()
    and user_id = auth.uid()
  );

comment on table public.badges_earned is
  'Achievements unlocked by users. badge_key references catalog in src/lib/badges.ts. Idempotent via unique (user_id, badge_key).';

-- ── 2) workout_items.mode ──────────────────────────────────────────────────
alter table public.workout_items
  add column if not exists mode text not null default 'reps'
    check (mode in ('reps', 'seconds'));

comment on column public.workout_items.mode is
  'reps = série conta repetições; seconds = série conta tempo (prancha, isometria). exercise_logs.reps_done guarda segundos quando mode=seconds.';
