import Image from "next/image";
import Link from "next/link";
import {
  ActivityIcon,
  ArrowRightIcon,
  BarChart3Icon,
  DumbbellIcon,
  MessageCircleIcon,
  PlusIcon,
  SparklesIcon,
  TrophyIcon,
  UsersIcon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { BarChart } from "@/components/charts/bar-chart";
import { DonutChart, type DonutSegment } from "@/components/charts/donut-chart";
import { LineChart, type LinePoint } from "@/components/charts/line-chart";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { StatCard } from "@/components/ui/stat-card";
import { Surface } from "@/components/ui/surface";
import { getCurrentProfile } from "@/lib/auth";
import { startOfDay, timeAgo } from "@/lib/dates";
import { createClient } from "@/lib/supabase/server";
import type { MonthlyLeaderboardRow } from "@/types/database";

export async function generateMetadata() {
  const t = await getTranslations("dashboard");
  return { title: t("metadata_title") };
}

type RecentLog = {
  id: string;
  completed_at: string | null;
  duration_minutes: number | null;
  workout: { title: string } | null;
  student: { full_name: string } | null;
};

function greetingKey(now: Date): "greeting_morning" | "greeting_afternoon" | "greeting_evening" {
  const hour = now.getHours();
  if (hour < 12) return "greeting_morning";
  if (hour < 18) return "greeting_afternoon";
  return "greeting_evening";
}

export default async function DashboardPage() {
  const session = await getCurrentProfile();
  if (!session) return null;
  const { profile, tenant } = session;

  const t = await getTranslations("dashboard");

  const supabase = await createClient();
  const now = new Date();
  const weekStart = new Date(startOfDay(now).getTime() - 6 * 86_400_000);

  const sevenDaysAgo = new Date(now.getTime() - 7 * 86_400_000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 86_400_000);
  const sixMonthsStart = startOfDay(
    new Date(now.getFullYear(), now.getMonth() - 5, 1),
  );

  type ActiveStudent = { id: string; full_name: string };
  type StudentLog = { student_id: string | null; completed_at: string | null };
  type ChartLog = { completed_at: string };
  type PlanRow = { id: string; name: string };
  type ProfilePlan = { current_plan_id: string | null };

  const [
    studentsRes,
    planSubscribersRes,
    weekLogsRes,
    postsRes,
    recentLogsRes,
    activeStudentsRes,
    studentLogsRes,
    overdueRes,
    dowLogsRes,
    monthlyLogsRes,
    planDistribRes,
    plansRes,
    leaderboardRes,
  ] = await Promise.all([
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("tenant_id", tenant.id)
        .eq("role", "student")
        .eq("active", true),
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("tenant_id", tenant.id)
        .eq("role", "student")
        .not("current_plan_id", "is", null),
      supabase
        .from("workout_logs")
        .select("id", { count: "exact", head: true })
        .eq("tenant_id", tenant.id)
        .not("completed_at", "is", null)
        .gte("completed_at", weekStart.toISOString()),
      supabase
        .from("community_posts")
        .select("id", { count: "exact", head: true })
        .eq("tenant_id", tenant.id),
      supabase
        .from("workout_logs")
        .select(
          `id, completed_at, duration_minutes,
           workout:workouts(title),
           student:profiles!workout_logs_student_id_fkey(full_name)`,
        )
        .eq("tenant_id", tenant.id)
        .not("completed_at", "is", null)
        .order("completed_at", { ascending: false })
        .limit(6)
        .returns<RecentLog[]>(),
      supabase
        .from("profiles")
        .select("id, full_name")
        .eq("tenant_id", tenant.id)
        .eq("role", "student")
        .eq("active", true)
        .order("full_name")
        .returns<ActiveStudent[]>(),
      supabase
        .from("workout_logs")
        .select("student_id, completed_at")
        .eq("tenant_id", tenant.id)
        .not("completed_at", "is", null)
        .order("completed_at", { ascending: false })
        .limit(2000)
        .returns<StudentLog[]>(),
      supabase
        .from("subscriptions")
        .select("id", { count: "exact", head: true })
        .eq("tenant_id", tenant.id)
        .eq("status", "past_due"),
      supabase
        .from("workout_logs")
        .select("completed_at")
        .eq("tenant_id", tenant.id)
        .not("completed_at", "is", null)
        .gte("completed_at", thirtyDaysAgo.toISOString())
        .returns<ChartLog[]>(),
      supabase
        .from("workout_logs")
        .select("completed_at")
        .eq("tenant_id", tenant.id)
        .not("completed_at", "is", null)
        .gte("completed_at", sixMonthsStart.toISOString())
        .returns<ChartLog[]>(),
      supabase
        .from("profiles")
        .select("current_plan_id")
        .eq("tenant_id", tenant.id)
        .eq("role", "student")
        .eq("active", true)
        .returns<ProfilePlan[]>(),
      supabase
        .from("plans")
        .select("id, name")
        .eq("tenant_id", tenant.id)
        .returns<PlanRow[]>(),
      supabase
        .from("monthly_leaderboard")
        .select("*")
        .order("position", { ascending: true })
        .order("full_name", { ascending: true })
        .returns<MonthlyLeaderboardRow[]>(),
    ]);

  const studentsCount = studentsRes.count ?? 0;
  const planSubscribers = planSubscribersRes.count ?? 0;
  const weekLogs = weekLogsRes.count ?? 0;
  const postsCount = postsRes.count ?? 0;
  const recent = recentLogsRes.data ?? [];
  const overdueCount = overdueRes.count ?? 0;

  // Compute "alunas em risco": active student whose most recent completed
  // workout is older than 7 days OR who never trained at all.
  const activeStudents = activeStudentsRes.data ?? [];
  const lastByStudent = new Map<string, Date>();
  for (const log of studentLogsRes.data ?? []) {
    if (!log.student_id || !log.completed_at) continue;
    const completedAt = new Date(log.completed_at);
    const prev = lastByStudent.get(log.student_id);
    if (!prev || completedAt > prev) lastByStudent.set(log.student_id, completedAt);
  }
  const atRisk = activeStudents
    .map((s) => ({
      id: s.id,
      name: s.full_name,
      lastTrained: lastByStudent.get(s.id) ?? null,
    }))
    .filter(({ lastTrained }) => !lastTrained || lastTrained < sevenDaysAgo)
    .sort((a, b) => {
      // Never-trained first, then oldest last-train.
      const aT = a.lastTrained?.getTime() ?? 0;
      const bT = b.lastTrained?.getTime() ?? 0;
      return aT - bT;
    });
  const atRiskCount = atRisk.length;

  const dowLabels = [
    t("dow_sun"),
    t("dow_mon"),
    t("dow_tue"),
    t("dow_wed"),
    t("dow_thu"),
    t("dow_fri"),
    t("dow_sat"),
  ];
  const dowCounts = [0, 0, 0, 0, 0, 0, 0];
  for (const log of dowLogsRes.data ?? []) {
    if (!log.completed_at) continue;
    const d = new Date(log.completed_at);
    dowCounts[d.getDay()] = (dowCounts[d.getDay()] ?? 0) + 1;
  }
  const dowData = dowLabels.map((label, i) => ({ label, value: dowCounts[i] ?? 0 }));

  const monthBucket = new Map<string, number>();
  const monthlyPoints: LinePoint[] = [];
  const monthLabels = [
    t("mon_jan"),
    t("mon_feb"),
    t("mon_mar"),
    t("mon_apr"),
    t("mon_may"),
    t("mon_jun"),
    t("mon_jul"),
    t("mon_aug"),
    t("mon_sep"),
    t("mon_oct"),
    t("mon_nov"),
    t("mon_dec"),
  ];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    monthBucket.set(key, 0);
    monthlyPoints.push({ label: monthLabels[d.getMonth()] ?? "", value: 0 });
  }
  for (const log of monthlyLogsRes.data ?? []) {
    if (!log.completed_at) continue;
    const d = new Date(log.completed_at);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (monthBucket.has(key)) monthBucket.set(key, (monthBucket.get(key) ?? 0) + 1);
  }
  {
    let i = 0;
    for (const v of monthBucket.values()) {
      if (monthlyPoints[i]) monthlyPoints[i]!.value = v;
      i++;
    }
  }

  const planNameById = new Map<string, string>(
    (plansRes.data ?? []).map((p) => [p.id, p.name]),
  );
  const planCounts = new Map<string, number>();
  let withoutPlan = 0;
  for (const row of planDistribRes.data ?? []) {
    if (!row.current_plan_id) {
      withoutPlan += 1;
      continue;
    }
    planCounts.set(
      row.current_plan_id,
      (planCounts.get(row.current_plan_id) ?? 0) + 1,
    );
  }
  const planSegments: DonutSegment[] = Array.from(planCounts.entries())
    .map(([id, value]) => ({
      label: planNameById.get(id) ?? "—",
      value,
    }))
    .sort((a, b) => b.value - a.value);
  if (withoutPlan > 0) {
    planSegments.push({
      label: t("chart_plans_no_plan"),
      value: withoutPlan,
      color: "rgba(148, 163, 184, 0.4)",
    });
  }

  const leaderboard = (leaderboardRes.data ?? []).filter(
    (r) => r.workouts_this_month > 0,
  );
  const monthLabelByIndex = [
    t("mon_jan"),
    t("mon_feb"),
    t("mon_mar"),
    t("mon_apr"),
    t("mon_may"),
    t("mon_jun"),
    t("mon_jul"),
    t("mon_aug"),
    t("mon_sep"),
    t("mon_oct"),
    t("mon_nov"),
    t("mon_dec"),
  ];
  const currentMonthLabel = monthLabelByIndex[now.getMonth()] ?? "";

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 md:gap-10 md:px-6 md:py-12">
      <header className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-[var(--brand-primary)]/15 via-card/40 to-card/40 p-6 md:p-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-[var(--brand-primary)]/20 blur-3xl"
        />
        <div className="relative flex flex-col gap-3">
          <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
            {t("panel_eyebrow", { greeting: t(greetingKey(now)) })}
          </span>
          <h1 className="font-display text-5xl leading-[0.9] md:text-6xl">
            {profile.full_name.split(" ")[0]}
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground md:text-base">
            {tenant.tagline ?? t("tagline_default")}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="/students"
              className={buttonVariants({ size: "lg", className: "gap-2" })}
            >
              <UsersIcon className="size-4" /> {t("see_students")}
            </Link>
            <Link
              href="/workouts/new"
              className={buttonVariants({
                size: "lg",
                variant: "outline",
                className: "gap-2",
              })}
            >
              <PlusIcon className="size-4" /> {t("new_workout")}
            </Link>
          </div>
        </div>
      </header>

      <section
        className={`grid gap-3 sm:grid-cols-2 ${
          overdueCount > 0 ? "lg:grid-cols-5" : "lg:grid-cols-4"
        }`}
      >
        <StatCard
          icon={<UsersIcon className="size-3.5" />}
          label={t("kpi_active")}
          value={studentsCount.toString()}
          accent="primary"
        />
        <StatCard
          icon={<SparklesIcon className="size-3.5" />}
          label={t("kpi_paid")}
          value={planSubscribers.toString()}
        />
        <StatCard
          icon={<DumbbellIcon className="size-3.5" />}
          label={t("kpi_week")}
          value={weekLogs.toString()}
        />
        <StatCard
          icon={<MessageCircleIcon className="size-3.5" />}
          label={atRiskCount > 0 ? t("kpi_at_risk") : t("kpi_posts")}
          value={(atRiskCount > 0 ? atRiskCount : postsCount).toString()}
          accent={atRiskCount > 0 ? "primary" : "muted"}
        />
        {overdueCount > 0 ? (
          <StatCard
            icon={<ActivityIcon className="size-3.5" />}
            label={t("kpi_overdue")}
            value={overdueCount.toString()}
            accent="primary"
          />
        ) : null}
      </section>

      {atRiskCount > 0 ? (
        <section className="flex flex-col gap-3 rounded-2xl border border-[var(--brand-primary)]/30 bg-gradient-to-br from-[var(--brand-primary)]/10 via-card/40 to-card/40 p-5">
          <header className="flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-display text-2xl">
              <ActivityIcon className="size-5 text-[var(--brand-primary)]" />
              {t("at_risk_title")}
            </h2>
            <span className="text-xs text-muted-foreground">
              {t("at_risk_summary", { count: atRiskCount })}
            </span>
          </header>
          <ul className="flex flex-col gap-1.5">
            {atRisk.slice(0, 6).map((s) => {
              const days = s.lastTrained
                ? Math.floor((now.getTime() - s.lastTrained.getTime()) / 86_400_000)
                : null;
              return (
                <li key={s.id}>
                  <Link
                    href={`/students/${s.id}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background/40 px-3 py-2.5 transition-colors hover:bg-card/60"
                  >
                    <span className="truncate text-sm font-medium">{s.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {days === null
                        ? t("at_risk_never")
                        : t("at_risk_days_ago", { count: days })}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          {atRiskCount > 6 ? (
            <p className="text-xs text-muted-foreground">
              {atRiskCount - 6 === 1
                ? t("at_risk_more_one", { count: atRiskCount - 6 })
                : t("at_risk_more_other", { count: atRiskCount - 6 })}
            </p>
          ) : null}
        </section>
      ) : null}

      <section className="flex flex-col gap-3">
        <header className="flex items-end justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <h2 className="flex items-center gap-2 font-display text-2xl">
              <BarChart3Icon className="size-5 text-[var(--brand-primary)]" />
              {t("charts_section_title")}
            </h2>
            <span className="text-xs text-muted-foreground">
              {t("charts_section_subtitle")}
            </span>
          </div>
        </header>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <Surface className="flex flex-col gap-3 p-5">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {t("chart_dow_subtitle")}
              </span>
              <h3 className="font-display text-lg leading-tight">
                {t("chart_dow_title")}
              </h3>
            </div>
            {dowData.some((d) => d.value > 0) ? (
              <BarChart data={dowData} />
            ) : (
              <p className="py-6 text-center text-xs text-muted-foreground">
                {t("chart_empty")}
              </p>
            )}
          </Surface>

          <Surface className="flex flex-col gap-3 p-5">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {t("chart_plans_subtitle")}
              </span>
              <h3 className="font-display text-lg leading-tight">
                {t("chart_plans_title")}
              </h3>
            </div>
            {planSegments.length > 0 ? (
              <DonutChart segments={planSegments} centerLabel={t("kpi_active")} />
            ) : (
              <p className="py-6 text-center text-xs text-muted-foreground">
                {t("chart_empty")}
              </p>
            )}
          </Surface>

          <Surface className="flex flex-col gap-3 p-5">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {t("chart_monthly_subtitle")}
              </span>
              <h3 className="font-display text-lg leading-tight">
                {t("chart_monthly_title")}
              </h3>
            </div>
            {monthlyPoints.some((p) => p.value > 0) ? (
              <LineChart points={monthlyPoints} area />
            ) : (
              <p className="py-6 text-center text-xs text-muted-foreground">
                {t("chart_empty")}
              </p>
            )}
          </Surface>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <header className="flex items-end justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <h2 className="flex items-center gap-2 font-display text-2xl">
              <TrophyIcon className="size-5 text-[var(--brand-primary)]" />
              Top da equipe
            </h2>
            <span className="text-xs text-muted-foreground">
              Ranking de {currentMonthLabel} · {leaderboard.length}{" "}
              {leaderboard.length === 1 ? "aluna" : "alunas"} treinando
            </span>
          </div>
        </header>
        {leaderboard.length === 0 ? (
          <EmptyState
            title="Ranking vazio este mês"
            description="Quando as alunas concluírem treinos, elas aparecem aqui automaticamente."
          />
        ) : (
          <Surface className="flex flex-col divide-y divide-border p-0">
            {leaderboard.map((row) => {
              const initial = (Array.from(row.full_name)[0] ?? "?").toUpperCase();
              return (
                <Link
                  key={row.student_id}
                  href={`/students/${row.student_id}`}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-card/60"
                >
                  <span
                    className={[
                      "grid size-9 shrink-0 place-items-center rounded-full font-display text-sm tabular-nums",
                      row.position <= 3
                        ? "bg-[var(--brand-primary)]/15 text-foreground"
                        : "bg-card text-muted-foreground",
                    ].join(" ")}
                    aria-label={`Posição ${row.position}`}
                  >
                    {row.position === 1
                      ? "🥇"
                      : row.position === 2
                        ? "🥈"
                        : row.position === 3
                          ? "🥉"
                          : `#${row.position}`}
                  </span>
                  <span className="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-[var(--brand-primary)]/80 font-display text-sm text-white">
                    {row.avatar_url ? (
                      <Image
                        src={row.avatar_url}
                        alt={row.full_name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      initial
                    )}
                  </span>
                  <span className="flex-1 truncate text-sm font-medium">
                    {row.full_name}
                  </span>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {row.workouts_this_month}{" "}
                    {row.workouts_this_month === 1 ? "treino" : "treinos"}
                  </span>
                  <ArrowRightIcon
                    className="size-3.5 shrink-0 text-muted-foreground"
                    aria-hidden
                  />
                </Link>
              );
            })}
          </Surface>
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Surface className="flex flex-col gap-3 p-5 lg:col-span-2">
          <header className="flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-display text-2xl">
              <ActivityIcon className="size-5 text-[var(--brand-primary)]" />
              {t("activity_title")}
            </h2>
            <Link
              href="/students"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              {t("see_all")} <ArrowRightIcon className="size-3" />
            </Link>
          </header>

          {recent.length === 0 ? (
            <EmptyState title={t("activity_title")} description={t("activity_empty")} />
          ) : (
            <ul className="flex flex-col divide-y divide-border">
              {recent.map((log) => (
                <li key={log.id} className="flex items-center gap-3 py-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--brand-primary)]/15 text-[var(--brand-primary)]">
                    <DumbbellIcon className="size-4" />
                  </span>
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-medium leading-tight">
                      <span className="text-foreground">
                        {log.student?.full_name ?? "—"}
                      </span>
                      <span className="text-muted-foreground">
                        {" "}{t("activity_completed")}{" "}
                      </span>
                      <span className="text-foreground">
                        {log.workout?.title ?? t("workout_removed")}
                      </span>
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {log.completed_at ? timeAgo(log.completed_at) : ""}
                      {log.duration_minutes ? ` · ${log.duration_minutes}min` : ""}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Surface>

        <div className="flex flex-col gap-3">
          <QuickLink
            href="/workouts?view=templates"
            title={t("quick_templates_title")}
            description={t("quick_templates_body")}
          />
          <QuickLink
            href="/plans"
            title={t("quick_plans_title")}
            description={t("quick_plans_body")}
          />
          <QuickLink
            href="/community"
            title={t("quick_community_title")}
            description={t("quick_community_body")}
          />
          <QuickLink
            href="/exercises"
            title={t("quick_exercises_title")}
            description={t("quick_exercises_body")}
          />
          <QuickLink
            href="/settings"
            title={t("quick_brand_title")}
            description={t("quick_brand_body")}
          />
        </div>
      </section>
    </main>
  );
}

function QuickLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-3 rounded-2xl border border-border bg-card/30 p-4 transition-colors hover:bg-card/60"
    >
      <div className="flex flex-col gap-0.5">
        <span className="font-display text-lg leading-tight">{title}</span>
        <span className="text-xs text-muted-foreground">{description}</span>
      </div>
      <ArrowRightIcon
        className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-[var(--brand-primary)]"
        aria-hidden
      />
    </Link>
  );
}
