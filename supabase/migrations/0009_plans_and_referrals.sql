-- ─────────────────────────────────────────────────────────────────────────────
-- 0009_plans_and_referrals.sql
--
-- Adds the two business primitives that move the app from "treino tracker"
-- to commercial product:
--   1. Plans — owner cadastra os planos/consultorias que vende; aluna escolhe.
--   2. Referrals — aluna indica amigas e ganha bônus.
--
-- Multi-tenant ready (every row carries tenant_id). Pricing is a free-text
-- label (Brazilian PIX-only flow doesn't need cents/cycles structured yet).
-- ─────────────────────────────────────────────────────────────────────────────

-- ── PLANS ───────────────────────────────────────────────────────────────────
create table plans (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade,
  name text not null,
  tagline text,
  description text,
  price_label text,
  features text[] default '{}',
  cta_label text default 'Quero esse plano',
  highlight boolean default false,
  display_order int default 0,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_plans_tenant on plans(tenant_id, display_order);

create trigger set_timestamp_plans before update on plans
  for each row execute procedure trigger_set_timestamp();

alter table plans enable row level security;

create policy "plans_read" on plans for select to authenticated
  using (
    tenant_id = auth_tenant_id()
    and (active = true or auth_role() = 'owner')
  );
create policy "plans_owner_write" on plans for insert to authenticated
  with check (tenant_id = auth_tenant_id() and auth_role() = 'owner');
create policy "plans_owner_update" on plans for update to authenticated
  using (tenant_id = auth_tenant_id() and auth_role() = 'owner')
  with check (tenant_id = auth_tenant_id() and auth_role() = 'owner');
create policy "plans_owner_delete" on plans for delete to authenticated
  using (tenant_id = auth_tenant_id() and auth_role() = 'owner');

-- ── PROFILE columns: current_plan + referral_code ──────────────────────────
alter table profiles
  add column current_plan_id uuid references plans(id) on delete set null,
  add column referral_code text unique;

-- Backfill codes for existing profiles
update profiles
  set referral_code = encode(gen_random_bytes(4), 'hex')
  where referral_code is null;

create or replace function set_referral_code()
returns trigger
language plpgsql
as $$
begin
  if new.referral_code is null then
    new.referral_code := encode(gen_random_bytes(4), 'hex');
  end if;
  return new;
end;
$$;

create trigger trigger_set_referral_code before insert on profiles
  for each row execute procedure set_referral_code();

create index idx_profiles_referral_code on profiles(referral_code);

-- ── REFERRALS ──────────────────────────────────────────────────────────────
create table referrals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade,
  referrer_id uuid references profiles(id) on delete cascade,
  referred_id uuid references profiles(id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'active', 'rewarded')),
  reward_label text,
  rewarded_at timestamptz,
  notes text,
  created_at timestamptz default now()
);

create unique index idx_referrals_referred on referrals(referred_id);
create index idx_referrals_referrer on referrals(referrer_id);
create index idx_referrals_tenant on referrals(tenant_id);

alter table referrals enable row level security;

-- Aluna lê suas próprias indicações (como referrer ou referred); owner lê tudo.
create policy "referrals_read" on referrals for select to authenticated
  using (
    tenant_id = auth_tenant_id()
    and (
      referrer_id = auth.uid()
      or referred_id = auth.uid()
      or auth_role() = 'owner'
    )
  );
create policy "referrals_owner_write" on referrals for insert to authenticated
  with check (tenant_id = auth_tenant_id() and auth_role() = 'owner');
create policy "referrals_owner_update" on referrals for update to authenticated
  using (tenant_id = auth_tenant_id() and auth_role() = 'owner')
  with check (tenant_id = auth_tenant_id() and auth_role() = 'owner');
create policy "referrals_owner_delete" on referrals for delete to authenticated
  using (tenant_id = auth_tenant_id() and auth_role() = 'owner');

-- ── SEED — Judson tenant ───────────────────────────────────────────────────
insert into plans (tenant_id, name, tagline, description, price_label, features, highlight, display_order)
select
  t.id, p.name, p.tagline, p.description, p.price_label, p.features, p.highlight, p.display_order
from tenants t, (values
  (
    'Treino + Comunidade',
    'Pra quem treina sozinha mas quer estrutura',
    'Treino mensal montado pelo Judson, comunidade exclusiva e suporte pelo WhatsApp.',
    'R$ 99/mês',
    ARRAY[
      'Treino mensal personalizado',
      'Acesso à comunidade da equipe',
      'Suporte por WhatsApp em horário comercial'
    ],
    false,
    1
  ),
  (
    'Consultoria Premium',
    'Acompanhamento próximo, resultados consistentes',
    'Tudo do plano básico + revisão quinzenal + ajuste fino de carga e técnica + foto de progresso mensal.',
    'R$ 299/mês',
    ARRAY[
      'Tudo do Treino + Comunidade',
      'Revisão quinzenal do treino',
      'Ajuste de carga em tempo real',
      'Foto de progresso mensal comentada',
      'WhatsApp ilimitado'
    ],
    true,
    2
  ),
  (
    'VIP Total',
    'O nível mais alto de acompanhamento',
    'Pra quem quer evolução máxima e atenção total. Inclui sessões de avaliação presencial em Macapá ou online.',
    'R$ 499/mês',
    ARRAY[
      'Tudo da Consultoria Premium',
      'Avaliação presencial mensal (Macapá) ou online',
      'Plano nutricional sugerido',
      'Resposta no WhatsApp em até 1h em dias úteis',
      'Foto + vídeo de progresso comentado'
    ],
    false,
    3
  )
) as p(name, tagline, description, price_label, features, highlight, display_order)
where t.slug = 'judsonlobato';
