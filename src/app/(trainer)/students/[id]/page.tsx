import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon, ClockIcon, FlameIcon, ListChecksIcon } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";

import { EditStudentForm } from "./edit-form";
import { PlanPicker } from "./plan-picker";
import { ReferralsBlock } from "./referrals-block";

export const metadata = { title: "Aluna" };

type LogRow = {
  id: string;
  completed_at: string | null;
  duration_minutes: number | null;
  rpe: number | null;
  workout: { title: string } | null;
};

type PlanOption = {
  id: string;
  name: string;
  price_label: string | null;
};

type ReferralFromDb = {
  id: string;
  status: string;
  reward_label: string | null;
  rewarded_at: string | null;
  created_at: string | null;
  referrer_id: string | null;
  referred_id: string | null;
  referrer: { id: string; full_name: string } | null;
  referred: { id: string; full_name: string } | null;
};

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function computeStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;
  const today = startOfDay(new Date());
  const days = new Set(dates.map((d) => startOfDay(d).getTime()));
  let cursor = today;
  if (!days.has(cursor.getTime())) {
    cursor = new Date(cursor.getTime() - 86_400_000);
    if (!days.has(cursor.getTime())) return 0;
  }
  let streak = 0;
  while (days.has(cursor.getTime())) {
    streak += 1;
    cursor = new Date(cursor.getTime() - 86_400_000);
  }
  return streak;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const days = Math.round(
    (startOfDay(new Date()).getTime() - startOfDay(d).getTime()) / 86_400_000,
  );
  if (days === 0) return "hoje";
  if (days === 1) return "ontem";
  if (days < 7) return `há ${days} dias`;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getCurrentProfile();
  if (!session) return null;

  const supabase = await createClient();
  const { data: student } = await supabase
    .from("profiles")
    .select(
      "id, full_name, email, phone, goal, observations, active, joined_at, current_plan_id, referral_code",
    )
    .eq("id", id)
    .eq("tenant_id", session.tenant.id)
    .eq("role", "student")
    .maybeSingle();

  if (!student) notFound();

  const [logsRes, plansRes, referralsRes, candidatesRes] = await Promise.all([
    supabase
      .from("workout_logs")
      .select(
        `id, completed_at, duration_minutes, rpe,
         workout:workouts(title)`,
      )
      .eq("student_id", id)
      .not("completed_at", "is", null)
      .order("completed_at", { ascending: false })
      .limit(50)
      .returns<LogRow[]>(),
    supabase
      .from("plans")
      .select("id, name, price_label")
      .eq("tenant_id", session.tenant.id)
      .eq("active", true)
      .order("display_order")
      .returns<PlanOption[]>(),
    supabase
      .from("referrals")
      .select(
        `id, status, reward_label, rewarded_at, created_at, referrer_id, referred_id,
         referrer:profiles!referrals_referrer_id_fkey(id, full_name),
         referred:profiles!referrals_referred_id_fkey(id, full_name)`,
      )
      .eq("tenant_id", session.tenant.id)
      .or(`referrer_id.eq.${id},referred_id.eq.${id}`)
      .order("created_at", { ascending: false })
      .returns<ReferralFromDb[]>(),
    supabase
      .from("profiles")
      .select("id, full_name")
      .eq("tenant_id", session.tenant.id)
      .eq("role", "student")
      .neq("id", id)
      .order("full_name")
      .returns<{ id: string; full_name: string }[]>(),
  ]);

  const logs = logsRes.data ?? [];
  const plans = plansRes.data ?? [];
  const referralsAll = referralsRes.data ?? [];
  const candidates = candidatesRes.data ?? [];

  const referredBy = referralsAll.find((r) => r.referred_id === id);
  const referrerOf = referralsAll.filter((r) => r.referrer_id === id);

  const completed = logs;
  const total = completed.length;
  const totalMinutes = completed.reduce(
    (acc, l) => acc + (l.duration_minutes ?? 0),
    0,
  );
  const streak = computeStreak(
    completed
      .map((l) => l.completed_at)
      .filter((v): v is string => !!v)
      .map((s) => new Date(s)),
  );
  const recent = completed.slice(0, 8);

  const initial = (Array.from(student.full_name)[0] ?? "?").toUpperCase();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 md:px-6 md:py-10">
      <Link
        href="/students"
        className="inline-flex w-fit items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3.5" /> Alunas
      </Link>

      <header className="flex items-center gap-4">
        <span className="grid size-16 shrink-0 place-items-center rounded-full bg-card font-display text-2xl text-foreground">
          {initial}
        </span>
        <div className="flex min-w-0 flex-col">
          <h1 className="truncate font-display text-3xl leading-none md:text-4xl">
            {student.full_name}
          </h1>
          <span className="mt-1 text-xs text-muted-foreground">
            {student.email ?? student.phone ?? "Sem contato"}
          </span>
        </div>
      </header>

      <ul className="grid grid-cols-3 gap-2">
        <Stat
          icon={<ListChecksIcon className="size-4" />}
          label="Treinos"
          value={total.toString()}
        />
        <Stat
          icon={<FlameIcon className="size-4" />}
          label="Streak"
          value={`${streak} ${streak === 1 ? "dia" : "dias"}`}
        />
        <Stat
          icon={<ClockIcon className="size-4" />}
          label="Tempo total"
          value={
            totalMinutes < 60
              ? `${totalMinutes}min`
              : `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`
          }
        />
      </ul>

      <PlanPicker
        studentId={student.id}
        currentPlanId={student.current_plan_id ?? null}
        plans={plans}
      />

      <ReferralsBlock
        studentId={student.id}
        referredBy={
          referredBy && referredBy.referrer
            ? {
                id: referredBy.id,
                status: referredBy.status,
                reward_label: referredBy.reward_label,
                rewarded_at: referredBy.rewarded_at,
                created_at: referredBy.created_at,
                who: referredBy.referrer,
              }
            : null
        }
        referrerOf={referrerOf.map((r) => ({
          id: r.id,
          status: r.status,
          reward_label: r.reward_label,
          rewarded_at: r.rewarded_at,
          created_at: r.created_at,
          who: r.referred,
        }))}
        candidates={candidates}
      />

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl">Histórico</h2>
        {recent.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-card/30 px-4 py-6 text-center text-sm text-muted-foreground">
            Ainda não concluiu nenhum treino.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {recent.map((log) => (
              <li
                key={log.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-card/30 p-3"
              >
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate text-sm font-medium leading-tight">
                    {log.workout?.title ?? "Treino removido"}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {log.completed_at ? formatDate(log.completed_at) : ""}
                    {log.duration_minutes ? ` · ${log.duration_minutes}min` : ""}
                    {log.rpe ? ` · RPE ${log.rpe}` : ""}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <EditStudentForm
        student={{
          id: student.id,
          full_name: student.full_name,
          goal: student.goal,
          observations: student.observations,
          active: student.active ?? true,
        }}
      />
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <li className="flex flex-col gap-1 rounded-xl border border-border bg-card/40 p-3">
      <span className="flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {icon} {label}
      </span>
      <span className="font-display text-2xl leading-none">{value}</span>
    </li>
  );
}
