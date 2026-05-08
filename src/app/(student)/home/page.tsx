import Link from "next/link";
import {
  CalendarDaysIcon,
  DumbbellIcon,
  FlameIcon,
  GiftIcon,
  MessageCircleIcon,
  SparklesIcon,
  TrendingUpIcon,
  TrophyIcon,
  ZapIcon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Sparkline } from "@/components/charts";
import { buttonVariants } from "@/components/ui/button";
import { getCurrentStudent } from "@/lib/auth";
import { computeStreak, startOfDay } from "@/lib/dates";
import { evaluateMilestones } from "@/lib/milestones";
import {
  type MuscleGroup,
  MUSCLE_LABELS,
  MUSCLE_ORDER,
  computeStrengthScoreByMuscle,
} from "@/lib/strength-score";
import { createClient } from "@/lib/supabase/server";
import type { MonthlyLeaderboardRow } from "@/types/database";

import { Heatmap7Days } from "./heatmap-7-days";
import { HeroStreak } from "./hero-streak";
import { MilestoneBanner } from "./milestone-banner";
import { ShareMonthButton } from "./share-month-button";

export async function generateMetadata() {
  const t = await getTranslations("home");
  return { title: t("metadata_title") };
}

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

function greetingKey(now: Date): "greeting_morning" | "greeting_afternoon" | "greeting_evening" {
  const hour = now.getHours();
  if (hour < 12) return "greeting_morning";
  if (hour < 18) return "greeting_afternoon";
  return "greeting_evening";
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

type SnapshotRow = {
  snapshot_date: string;
  score_chest: number;
  score_back: number;
  score_legs: number;
  score_shoulders: number;
  score_arms: number;
  score_core: number;
};

type PRRow = {
  exercise_name: string;
  prev_max: number;
  new_max: number;
  achieved_at: string;
};

const SNAPSHOT_FIELD: Record<MuscleGroup, keyof SnapshotRow> = {
  peito: "score_chest",
  costas: "score_back",
  perna: "score_legs",
  ombro: "score_shoulders",
  braço: "score_arms",
  core: "score_core",
};

/**
 * Constrói a série de N dias mais recentes pra cada grupo. Preenche dias sem
 * snapshot com o último valor conhecido (forward-fill) — sparkline fica
 * estável em vez de cair pra zero quando o cron pulou um dia.
 */
function buildStrengthSeries(
  snapshots: SnapshotRow[],
  windowDays: number,
): Record<MuscleGroup, number[]> {
  const byDate = new Map<string, SnapshotRow>();
  for (const s of snapshots) byDate.set(s.snapshot_date, s);

  const today = new Date();
  const dates: string[] = [];
  for (let i = windowDays - 1; i >= 0; i--) {
    const d = new Date(today.getTime() - i * MS_PER_DAY);
    dates.push(
      `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`,
    );
  }

  const out: Record<MuscleGroup, number[]> = {
    peito: [],
    costas: [],
    perna: [],
    ombro: [],
    braço: [],
    core: [],
  };

  const last: Record<MuscleGroup, number> = {
    peito: 0,
    costas: 0,
    perna: 0,
    ombro: 0,
    braço: 0,
    core: 0,
  };

  for (const date of dates) {
    const row = byDate.get(date);
    for (const m of MUSCLE_ORDER) {
      const field = SNAPSHOT_FIELD[m];
      if (row) {
        last[m] = row[field] as number;
      }
      out[m].push(last[m]);
    }
  }
  return out;
}

function relativeDays(iso: string, now: Date): string {
  const diff = Math.floor((now.getTime() - new Date(iso).getTime()) / MS_PER_DAY);
  if (diff <= 0) return "hoje";
  if (diff === 1) return "ontem";
  return `há ${diff} dias`;
}

export default async function StudentHomePage() {
  const session = await getCurrentStudent();
  if (!session) return null;
  const { profile, tenant } = session;

  const t = await getTranslations("home");

  const supabase = await createClient();
  const now = new Date();
  const todayDow = now.getDay();

  const sparklineWindowDays = 14;
  const nowMs = now.getTime();
  const sparklineSinceIso = (() => {
    const d = new Date(nowMs - sparklineWindowDays * MS_PER_DAY);
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
  })();
  const prSinceIso = new Date(nowMs - 30 * MS_PER_DAY).toISOString();

  const [
    workoutsRes,
    plansRes,
    logsRes,
    strength,
    leaderboardRes,
    snapshotsRes,
    prsRes,
  ] = await Promise.all([
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
    computeStrengthScoreByMuscle({ userId: profile.id, supabase }),
    supabase
      .from("monthly_leaderboard")
      .select("student_id, position, workouts_this_month")
      .returns<Pick<MonthlyLeaderboardRow, "student_id" | "position" | "workouts_this_month">[]>(),
    supabase
      .from("strength_snapshots")
      .select(
        "snapshot_date, score_chest, score_back, score_legs, score_shoulders, score_arms, score_core",
      )
      .eq("user_id", profile.id)
      .gte("snapshot_date", sparklineSinceIso)
      .order("snapshot_date", { ascending: true })
      .returns<SnapshotRow[]>(),
    supabase
      .from("personal_records")
      .select("exercise_name, prev_max, new_max, achieved_at")
      .eq("user_id", profile.id)
      .gte("achieved_at", prSinceIso)
      .order("achieved_at", { ascending: false })
      .limit(5)
      .returns<PRRow[]>(),
  ]);

  const strengthSeries = buildStrengthSeries(
    snapshotsRes.data ?? [],
    sparklineWindowDays,
  );
  const recentPRs = prsRes.data ?? [];

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

  const leaderboard = leaderboardRes.data ?? [];
  const myRow = leaderboard.find((r) => r.student_id === profile.id) ?? null;
  const totalRanked = leaderboard.filter((r) => r.workouts_this_month > 0).length;
  const showRankCard =
    !!myRow && profile.share_in_leaderboard && myRow.workouts_this_month > 0 && totalRanked > 0;

  const milestone =
    evaluateMilestones({
      userId: profile.id,
      joinedAt: profile.joined_at,
      workoutsTotal: totalCompleted,
      now,
    })[0] ?? null;

  const heroCtaHref = today ? `/treinos/${today.id}` : "/treinos";
  const heroCtaLabel = today
    ? todayIsScheduled
      ? t("cta_start_today")
      : t("cta_start_next")
    : t("cta_see_all");

  return (
    <section className="flex flex-1 flex-col gap-7 px-5 pb-8 pt-6">
      {milestone ? <MilestoneBanner milestone={milestone} /> : null}

      <header className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-[var(--brand-primary)]/20 via-card/40 to-card/30 px-5 pb-6 pt-7">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-[var(--brand-primary)]/30 blur-3xl"
        />
        <div className="relative flex flex-col gap-5">
          <HeroStreak
            greeting={t(greetingKey(now))}
            firstName={firstName(profile.full_name)}
            streak={streak}
          />

          <div className="flex flex-wrap items-center justify-center gap-2">
            <Stat
              icon={<FlameIcon className="size-3.5" />}
              label={t("stat_streak")}
              value={`${streak}d`}
            />
            <Stat
              icon={<TrendingUpIcon className="size-3.5" />}
              label={t("stat_workouts")}
              value={totalCompleted.toString()}
            />
            {plan ? (
              <Stat
                icon={<SparklesIcon className="size-3.5" />}
                label={t("stat_plan")}
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

      {showRankCard && myRow ? (
        <Link
          href="/equipe"
          className="flex items-center gap-3 rounded-2xl border border-[var(--brand-primary)]/30 bg-gradient-to-br from-[var(--brand-primary)]/10 via-card/40 to-card/30 p-4 transition-colors hover:border-[var(--brand-primary)]/50"
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[var(--brand-primary)]/15 text-[var(--brand-primary)]">
            <TrophyIcon className="size-5" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              Ranking da equipe
            </span>
            <span className="font-display text-lg leading-tight">
              Tua posição: #{myRow.position} de {totalRanked}
            </span>
            <span className="text-xs text-muted-foreground">
              {myRow.workouts_this_month}{" "}
              {myRow.workouts_this_month === 1 ? "treino" : "treinos"} no mês · ver top da equipe →
            </span>
          </div>
        </Link>
      ) : null}

      <section
        aria-label={t("last7_label")}
        className="flex flex-col gap-3 rounded-2xl border border-border bg-card/30 p-4"
      >
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            {t("last7_label")}
          </span>
          <span className="text-[11px] tabular-nums text-muted-foreground">
            {last7.filter(Boolean).length}/7
          </span>
        </div>
        <Heatmap7Days days={last7} todayDow={todayDow} />
      </section>

      <section
        aria-label={t("strength_label")}
        className="flex flex-col gap-3 rounded-2xl border border-border bg-card/30 p-4"
      >
        <header className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            <ZapIcon className="size-3.5 text-[var(--brand-primary)]" />
            {t("strength_label")}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {t("strength_window")}
          </span>
        </header>
        <ul className="flex flex-col gap-2">
          {MUSCLE_ORDER.map((m) => {
            const score = strength[m];
            const series = strengthSeries[m].map((value) => ({ value }));
            return (
              <li key={m} className="flex items-center gap-3">
                <span className="w-16 shrink-0 text-xs text-muted-foreground">
                  {MUSCLE_LABELS[m]}
                </span>
                <div
                  className="h-2 flex-1 overflow-hidden rounded-full bg-card"
                  role="progressbar"
                  aria-valuenow={score}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${t("strength_label")} ${MUSCLE_LABELS[m]}`}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--brand-primary)]/60 to-[var(--brand-primary)] transition-[width] duration-500"
                    style={{ width: `${score}%` }}
                  />
                </div>
                <Sparkline
                  points={series}
                  width={60}
                  height={16}
                  ariaLabel={`Evolução ${MUSCLE_LABELS[m]} últimos ${sparklineWindowDays} dias`}
                  className="shrink-0 text-[var(--brand-primary)]"
                />
                <span className="w-10 shrink-0 text-right font-display text-sm tabular-nums">
                  {score}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      {recentPRs.length > 0 ? (
        <section
          aria-label="Recordes recentes"
          className="flex flex-col gap-3 rounded-2xl border border-border bg-card/30 p-4"
        >
          <header className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              <TrophyIcon className="size-3.5 text-[var(--brand-primary)]" />
              Recordes recentes
            </span>
            <span className="text-[10px] text-muted-foreground">últimos 30 dias</span>
          </header>
          <ul className="flex flex-col gap-2">
            {recentPRs.map((pr, i) => (
              <li
                key={`${pr.achieved_at}-${i}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/40 px-3 py-2"
              >
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-medium text-foreground">
                    {pr.exercise_name}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {pr.prev_max > 0 ? `${pr.prev_max}kg → ` : ""}
                    <span className="font-semibold text-[var(--brand-primary)]">
                      {pr.new_max}kg
                    </span>
                    {" · "}
                    {relativeDays(pr.achieved_at, now)}
                  </span>
                </div>
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--brand-primary)]/10 text-base">
                  🏆
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {today ? (
        <Link
          href={`/treinos/${today.id}`}
          className="group flex flex-col gap-3 overflow-hidden rounded-2xl border border-[var(--brand-primary)]/30 bg-gradient-to-br from-[var(--brand-primary)]/10 via-card/50 to-card/40 p-5 transition-colors hover:border-[var(--brand-primary)]/50"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[var(--brand-primary)]">
              {todayIsScheduled ? t("today_pill") : t("next_pill")}
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {todayItemCount}{" "}
              {todayItemCount === 1 ? t("exercise_one") : t("exercise_other")}
            </span>
          </div>
          <p className="font-display text-3xl leading-tight">{today.title}</p>
          {today.description ? (
            <p className="text-sm text-muted-foreground">{today.description}</p>
          ) : null}
          <span className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors group-hover:text-[var(--brand-primary)]">
            <DumbbellIcon className="size-4" /> {t("start_workout")} →
          </span>
        </Link>
      ) : (
        <EmptyToday tenantFirstName={firstName(tenant.name)} />
      )}

      {upcoming.length > 0 ? (
        <section className="flex flex-col gap-3">
          <h2 className="font-display text-xl">{t("other_workouts")}</h2>
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
                      {w.items?.[0]?.count ?? 0} {t("exercise_other")}
                      {w.scheduled_days && w.scheduled_days.length > 0
                        ? ` · ${formatDays(w.scheduled_days, t("all_days"))}`
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
              {plan ? t("plan_eyebrow_yours") : t("plan_eyebrow_explore")}
            </span>
          </div>
          <span className="font-display text-xl leading-tight">
            {plan?.name ?? t("plan_default_cta")}
          </span>
          <span className="text-xs text-muted-foreground">
            {plan?.price_label ?? t("plan_default_price")}
          </span>
        </Link>

        <Link
          href="/perfil"
          className="group flex flex-col gap-1 rounded-2xl border border-border bg-card/30 p-4 transition-colors hover:bg-card/60"
        >
          <div className="flex items-center gap-2">
            <GiftIcon className="size-4 text-[var(--brand-primary)]" />
            <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              {t("referral_eyebrow")}
            </span>
          </div>
          <span className="font-display text-xl leading-tight">
            {t("referral_title")}
          </span>
          <span className="text-xs text-muted-foreground">
            {t("referral_body")}
          </span>
        </Link>
      </section>

      <Link
        href="/feed"
        className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card/30 p-4 text-sm transition-colors hover:bg-card/60"
      >
        <div className="flex flex-col gap-0.5">
          <span className="font-display text-lg">{t("community_title")}</span>
          <span className="text-xs text-muted-foreground">
            {t("community_body")}
          </span>
        </div>
        <MessageCircleIcon
          className="size-5 shrink-0 text-muted-foreground"
          aria-hidden
        />
      </Link>

      {totalCompleted > 0 ? (
        <ShareMonthButton
          profileId={profile.id}
          studentName={profile.full_name}
          tenantName={tenant.name}
        />
      ) : null}
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

async function EmptyToday({ tenantFirstName }: { tenantFirstName: string }) {
  const t = await getTranslations("home");
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-border bg-card/20 p-5 text-center">
      <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
        {t("empty_today_eyebrow")}
      </span>
      <p className="font-display text-3xl leading-tight">
        {t("empty_today_title")}
      </p>
      <p className="text-sm text-muted-foreground">
        {t("empty_today_body", { trainer: tenantFirstName })}
      </p>
      <Link
        href="/feed"
        className={buttonVariants({
          variant: "outline",
          size: "lg",
          className: "mt-2 w-full",
        })}
      >
        {t("empty_today_cta")}
      </Link>
    </div>
  );
}

function formatDays(days: number[], allDaysLabel: string): string {
  if (days.length === 7) return allDaysLabel;
  return days
    .map((d) => WEEKDAY_LABELS[d]?.slice(0, 3))
    .filter(Boolean)
    .join(", ");
}
