import Link from "next/link";
import {
  CalendarDaysIcon,
  DumbbellIcon,
  FlameIcon,
  GiftIcon,
  MessageCircleIcon,
  SparklesIcon,
  TrendingUpIcon,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { getCurrentStudent } from "@/lib/auth";
import { computeStreak, startOfDay } from "@/lib/dates";
import { createClient } from "@/lib/supabase/server";

import { Heatmap7Days } from "./heatmap-7-days";
import { HeroStreak } from "./hero-streak";

export const metadata = { title: "Hoje" };

const WEEKDAY_LABELS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
const MS_PER_DAY = 86_400_000;

type WorkoutRow = {
  id: string;
  title: string;
  description: string | null;
  scheduled_days: number[] | null;
  items: { count: number }[];
};

type PlanRow = {
  name: string;
  price_label: string | null;
  highlight: boolean | null;
};

function firstName(full: string): string {
  return full.split(" ")[0] ?? full;
}

function greeting(now: Date): string {
  const hour = now.getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

function pickTodayWorkout(
  workouts: WorkoutRow[],
  todayDow: number,
): WorkoutRow | null {
  const scheduled = workouts.find((w) => w.scheduled_days?.includes(todayDow));
  if (scheduled) return scheduled;
  return workouts[0] ?? null;
}

function buildLast7Days(completed: Date[]): boolean[] {
  const today = startOfDay(new Date()).getTime();
  const set = new Set(completed.map((d) => startOfDay(d).getTime()));
  return Array.from({ length: 7 }, (_, i) => set.has(today - i * MS_PER_DAY));
}

export default async function StudentHomePage() {
  const session = await getCurrentStudent();
  if (!session) return null;
  const { profile, tenant } = session;

  const supabase = await createClient();
  const now = new Date();
  const todayDow = now.getDay();

  const [workoutsRes, plansRes, logsRes] = await Promise.all([
    supabase
      .from("workouts")
      .select(
        `id, title, description, scheduled_days,
         items:workout_items(count)`,
      )
      .eq("tenant_id", tenant.id)
      .eq("student_id", profile.id)
      .eq("active", true)
      .order("updated_at", { ascending: false })
      .returns<WorkoutRow[]>(),
    profile.current_plan_id
      ? supabase
          .from("plans")
          .select("name, price_label, highlight")
          .eq("id", profile.current_plan_id)
          .maybeSingle<PlanRow>()
      : Promise.resolve({ data: null }),
    supabase
      .from("workout_logs")
      .select("completed_at")
      .eq("student_id", profile.id)
      .not("completed_at", "is", null)
      .order("completed_at", { ascending: false })
      .limit(60)
      .returns<{ completed_at: string }[]>(),
  ]);

  const workouts = workoutsRes.data ?? [];
  const today = pickTodayWorkout(workouts, todayDow);
  const todayIsScheduled = !!today?.scheduled_days?.includes(todayDow);
  const upcoming = workouts.filter((w) => w.id !== today?.id).slice(0, 3);
  const todayItemCount = today?.items?.[0]?.count ?? 0;
  const plan = plansRes.data;
  const completedDates = (logsRes.data ?? [])
    .map((l) => l.completed_at)
    .filter((v): v is string => !!v)
    .map((s) => new Date(s));
  const streak = computeStreak(completedDates);
  const totalCompleted = completedDates.length;
  const last7 = buildLast7Days(completedDates);

  const heroCtaHref = today ? `/treinos/${today.id}` : "/treinos";
  const heroCtaLabel = today
    ? todayIsScheduled
      ? "Iniciar treino de hoje"
      : "Iniciar próximo treino"
    : "Ver todos os treinos";

  return (
    <section className="flex flex-1 flex-col gap-7 px-5 pb-8 pt-6">
      <header className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-[var(--brand-primary)]/20 via-card/40 to-card/30 px-5 pb-6 pt-7">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-[var(--brand-primary)]/30 blur-3xl"
        />
        <div className="relative flex flex-col gap-5">
          <HeroStreak
            greeting={greeting(now)}
            firstName={firstName(profile.full_name)}
            streak={streak}
          />

          <div className="flex flex-wrap items-center justify-center gap-2">
            <Stat
              icon={<FlameIcon className="size-3.5" />}
              label="streak"
              value={`${streak}d`}
            />
            <Stat
              icon={<TrendingUpIcon className="size-3.5" />}
              label="treinos"
              value={totalCompleted.toString()}
            />
            {plan ? (
              <Stat
                icon={<SparklesIcon className="size-3.5" />}
                label="plano"
                value={plan.name.split(" ")[0] ?? "—"}
                highlight
              />
            ) : null}
          </div>

          <Link
            href={heroCtaHref}
            className={buttonVariants({
              size: "lg",
              className: "w-full",
            })}
          >
            <DumbbellIcon className="size-4" /> {heroCtaLabel}
          </Link>
        </div>
      </header>

      <section
        aria-label="Últimos 7 dias"
        className="flex flex-col gap-3 rounded-2xl border border-border bg-card/30 p-4"
      >
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            Últimos 7 dias
          </span>
          <span className="text-[11px] tabular-nums text-muted-foreground">
            {last7.filter(Boolean).length}/7
          </span>
        </div>
        <Heatmap7Days days={last7} todayDow={todayDow} />
      </section>

      {today ? (
        <Link
          href={`/treinos/${today.id}`}
          className="group flex flex-col gap-3 overflow-hidden rounded-2xl border border-[var(--brand-primary)]/30 bg-gradient-to-br from-[var(--brand-primary)]/10 via-card/50 to-card/40 p-5 transition-colors hover:border-[var(--brand-primary)]/50"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[var(--brand-primary)]">
              {todayIsScheduled ? "Treino de hoje" : "Próximo treino"}
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {todayItemCount} {todayItemCount === 1 ? "exercício" : "exercícios"}
            </span>
          </div>
          <p className="font-display text-3xl leading-tight">{today.title}</p>
          {today.description ? (
            <p className="text-sm text-muted-foreground">{today.description}</p>
          ) : null}
          <span className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors group-hover:text-[var(--brand-primary)]">
            <DumbbellIcon className="size-4" /> Iniciar treino →
          </span>
        </Link>
      ) : (
        <EmptyToday tenantFirstName={firstName(tenant.name)} />
      )}

      {upcoming.length > 0 ? (
        <section className="flex flex-col gap-3">
          <h2 className="font-display text-xl">Outros treinos</h2>
          <ul className="flex flex-col gap-2">
            {upcoming.map((w) => (
              <li key={w.id}>
                <Link
                  href={`/treinos/${w.id}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card/30 p-4 transition-colors hover:bg-card/60"
                >
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate font-display text-lg leading-tight">
                      {w.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {w.items?.[0]?.count ?? 0} exercícios
                      {w.scheduled_days && w.scheduled_days.length > 0
                        ? ` · ${formatDays(w.scheduled_days)}`
                        : ""}
                    </span>
                  </div>
                  <CalendarDaysIcon
                    className="size-4 shrink-0 text-muted-foreground"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/planos"
          className={`group flex flex-col gap-1 rounded-2xl border p-4 transition-colors ${
            plan
              ? "border-border bg-card/30 hover:bg-card/60"
              : "border-[var(--brand-primary)]/30 bg-gradient-to-br from-[var(--brand-primary)]/10 to-card/40 hover:border-[var(--brand-primary)]/60"
          }`}
        >
          <div className="flex items-center gap-2">
            <SparklesIcon className="size-4 text-[var(--brand-primary)]" />
            <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              {plan ? "Seu plano" : "Conheça os planos"}
            </span>
          </div>
          <span className="font-display text-xl leading-tight">
            {plan?.name ?? "Evoluir o acompanhamento"}
          </span>
          <span className="text-xs text-muted-foreground">
            {plan?.price_label ?? "A partir de R$ 99/mês"}
          </span>
        </Link>

        <Link
          href="/perfil"
          className="group flex flex-col gap-1 rounded-2xl border border-border bg-card/30 p-4 transition-colors hover:bg-card/60"
        >
          <div className="flex items-center gap-2">
            <GiftIcon className="size-4 text-[var(--brand-primary)]" />
            <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              Indique uma amiga
            </span>
          </div>
          <span className="font-display text-xl leading-tight">
            Ganhe bônus
          </span>
          <span className="text-xs text-muted-foreground">
            Cada amiga que entra na equipe vira benefício pra você.
          </span>
        </Link>
      </section>

      <Link
        href="/feed"
        className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card/30 p-4 text-sm transition-colors hover:bg-card/60"
      >
        <div className="flex flex-col gap-0.5">
          <span className="font-display text-lg">Comunidade</span>
          <span className="text-xs text-muted-foreground">
            Recados e bastidores da equipe Judson.
          </span>
        </div>
        <MessageCircleIcon
          className="size-5 shrink-0 text-muted-foreground"
          aria-hidden
        />
      </Link>
    </section>
  );
}

function Stat({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs ${
        highlight
          ? "border-[var(--brand-primary)]/40 bg-[var(--brand-primary)]/10 text-foreground"
          : "border-border bg-card/40 text-muted-foreground"
      }`}
    >
      {icon}
      <span className="font-medium tabular-nums text-foreground">{value}</span>
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}

function EmptyToday({ tenantFirstName }: { tenantFirstName: string }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-border bg-card/20 p-5 text-center">
      <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
        Hoje
      </span>
      <p className="font-display text-3xl leading-tight">Sem treino agendado</p>
      <p className="text-sm text-muted-foreground">
        {tenantFirstName} ainda não montou treino pra hoje. Aproveita pra dar
        uma olhada no que tá rolando na comunidade.
      </p>
      <Link
        href="/feed"
        className={buttonVariants({
          variant: "outline",
          size: "lg",
          className: "mt-2 w-full",
        })}
      >
        Abrir comunidade
      </Link>
    </div>
  );
}

function formatDays(days: number[]): string {
  if (days.length === 7) return "todos os dias";
  return days
    .map((d) => WEEKDAY_LABELS[d]?.slice(0, 3))
    .filter(Boolean)
    .join(", ");
}
