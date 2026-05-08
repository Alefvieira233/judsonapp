import Link from "next/link";
import {
  ActivityIcon,
  ArrowRightIcon,
  DumbbellIcon,
  MessageCircleIcon,
  PlusIcon,
  SparklesIcon,
  UsersIcon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { StatCard } from "@/components/ui/stat-card";
import { Surface } from "@/components/ui/surface";
import { getCurrentProfile } from "@/lib/auth";
import { startOfDay, timeAgo } from "@/lib/dates";
import { createClient } from "@/lib/supabase/server";

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

  type ActiveStudent = { id: string; full_name: string };
  type StudentLog = { student_id: string | null; completed_at: string | null };

  const [
    studentsRes,
    planSubscribersRes,
    weekLogsRes,
    postsRes,
    recentLogsRes,
    activeStudentsRes,
    studentLogsRes,
    overdueRes,
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
