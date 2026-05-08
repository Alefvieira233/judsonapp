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

import { buttonVariants } from "@/components/ui/button";
import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Dashboard" };

type RecentLog = {
  id: string;
  completed_at: string | null;
  duration_minutes: number | null;
  workout: { title: string } | null;
  student: { full_name: string } | null;
};

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function greeting(now: Date): string {
  const hour = now.getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

function timeAgo(iso: string): string {
  const d = new Date(iso);
  const ms = Date.now() - d.getTime();
  const m = Math.floor(ms / 60_000);
  if (m < 1) return "agora";
  if (m < 60) return `${m}min atrás`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h atrás`;
  const days = Math.floor(h / 24);
  if (days === 1) return "ontem";
  if (days < 7) return `há ${days} dias`;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export default async function DashboardPage() {
  const session = await getCurrentProfile();
  if (!session) return null;
  const { profile, tenant } = session;

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
    ]);

  const studentsCount = studentsRes.count ?? 0;
  const planSubscribers = planSubscribersRes.count ?? 0;
  const weekLogs = weekLogsRes.count ?? 0;
  const postsCount = postsRes.count ?? 0;
  const recent = recentLogsRes.data ?? [];

  // Compute "alunas em risco": active student whose most recent completed
  // workout is older than 7 days OR who never trained at all.
  const activeStudents = activeStudentsRes.data ?? [];
  const lastByStudent = new Map<string, Date>();
  for (const log of studentLogsRes.data ?? []) {
    if (!log.student_id || !log.completed_at) continue;
    const t = new Date(log.completed_at);
    const prev = lastByStudent.get(log.student_id);
    if (!prev || t > prev) lastByStudent.set(log.student_id, t);
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
            {greeting(now)}, painel do personal
          </span>
          <h1 className="font-display text-5xl leading-[0.9] md:text-6xl">
            {profile.full_name.split(" ")[0]}
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground md:text-base">
            {tenant.tagline ?? "Acompanha tua equipe, monta os treinos e mantém o ritmo da galera."}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="/students"
              className={buttonVariants({ size: "lg", className: "gap-2" })}
            >
              <UsersIcon className="size-4" /> Ver alunas
            </Link>
            <Link
              href="/workouts/new"
              className={buttonVariants({
                size: "lg",
                variant: "outline",
                className: "gap-2",
              })}
            >
              <PlusIcon className="size-4" /> Novo treino
            </Link>
          </div>
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={<UsersIcon className="size-5" />}
          label="Alunas ativas"
          value={studentsCount.toString()}
          accent="primary"
        />
        <KpiCard
          icon={<SparklesIcon className="size-5" />}
          label="Em planos pagos"
          value={planSubscribers.toString()}
          accent="muted"
        />
        <KpiCard
          icon={<DumbbellIcon className="size-5" />}
          label="Treinos esta semana"
          value={weekLogs.toString()}
          accent="muted"
        />
        <KpiCard
          icon={<MessageCircleIcon className="size-5" />}
          label={atRiskCount > 0 ? "Em risco (>7d)" : "Posts publicados"}
          value={(atRiskCount > 0 ? atRiskCount : postsCount).toString()}
          accent={atRiskCount > 0 ? "primary" : "muted"}
        />
      </section>

      {atRiskCount > 0 ? (
        <section className="flex flex-col gap-3 rounded-2xl border border-[var(--brand-primary)]/30 bg-gradient-to-br from-[var(--brand-primary)]/10 via-card/40 to-card/40 p-5">
          <header className="flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-display text-2xl">
              <ActivityIcon className="size-5 text-[var(--brand-primary)]" />
              Alunas em risco
            </h2>
            <span className="text-xs text-muted-foreground">
              {atRiskCount} sem treinar há mais de 7 dias
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
                      {days === null ? "nunca treinou" : `há ${days} dias`}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          {atRiskCount > 6 ? (
            <p className="text-xs text-muted-foreground">
              + {atRiskCount - 6} aluna{atRiskCount - 6 === 1 ? "" : "s"} a mais.
            </p>
          ) : null}
        </section>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card/40 p-5 lg:col-span-2">
          <header className="flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-display text-2xl">
              <ActivityIcon className="size-5 text-[var(--brand-primary)]" />
              Última atividade
            </h2>
            <Link
              href="/students"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              Ver todas <ArrowRightIcon className="size-3" />
            </Link>
          </header>

          {recent.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card/30 px-4 py-10 text-center">
              <p className="text-sm text-muted-foreground">
                Sem treinos concluídos ainda. Quando tuas alunas começarem a
                treinar pelo app, vai aparecer aqui em tempo real.
              </p>
            </div>
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
                        {" "}concluiu{" "}
                      </span>
                      <span className="text-foreground">
                        {log.workout?.title ?? "treino removido"}
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
        </div>

        <div className="flex flex-col gap-3">
          <QuickLink
            href="/plans"
            title="Planos"
            description="Define os planos e a consultoria que oferece."
          />
          <QuickLink
            href="/community"
            title="Comunidade"
            description="Manda recado pro feed da equipe."
          />
          <QuickLink
            href="/exercises"
            title="Exercícios"
            description="Biblioteca de exercícios da tua escola."
          />
          <QuickLink
            href="/settings"
            title="Sua marca"
            description="Logo, bio, cores e contato."
          />
        </div>
      </section>
    </main>
  );
}

function KpiCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: "primary" | "muted";
}) {
  return (
    <div
      className={
        accent === "primary"
          ? "rounded-2xl border border-[var(--brand-primary)]/30 bg-gradient-to-br from-[var(--brand-primary)]/15 via-card/40 to-card/40 p-5"
          : "rounded-2xl border border-border bg-card/40 p-5"
      }
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </span>
        <span
          className={
            accent === "primary"
              ? "text-[var(--brand-primary)]"
              : "text-muted-foreground"
          }
        >
          {icon}
        </span>
      </div>
      <p className="mt-3 font-display text-4xl leading-none">{value}</p>
    </div>
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
