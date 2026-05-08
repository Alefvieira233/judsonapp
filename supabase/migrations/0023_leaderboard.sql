-- Onda social: leaderboard mensal. Privacidade-first via opt-out por aluna,
-- mas default true porque a UX moderna depende de gente aparecer no ranking
-- pra ele ter sinal. View `monthly_leaderboard` é security_invoker, então
-- herda o RLS de profiles + workout_logs (cada caller só vê seu tenant).

alter table public.profiles
  add column if not exists share_in_leaderboard boolean not null default true;

create or replace view public.monthly_leaderboard
  with (security_invoker = true) as
select
  p.tenant_id,
  p.id as student_id,
  p.full_name,
  p.avatar_url,
  count(wl.id) as workouts_this_month,
  rank() over (
    partition by p.tenant_id
    order by count(wl.id) desc
  ) as position
from public.profiles p
left join public.workout_logs wl
  on wl.student_id = p.id
  and wl.completed_at >= date_trunc('month', now())
where p.role = 'student'
  and coalesce(p.active, true) = true
  and coalesce(p.share_in_leaderboard, true) = true
group by p.tenant_id, p.id, p.full_name, p.avatar_url;

comment on view public.monthly_leaderboard is
  'Ranking mensal de treinos concluídos por aluna no tenant. View, não materialized — performance OK pra dezenas de alunas e dado precisa de zero lag.';
