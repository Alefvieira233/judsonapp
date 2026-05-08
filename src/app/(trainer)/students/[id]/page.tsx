import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ActivityIcon,
  AlertTriangleIcon,
  ArrowLeftIcon,
  ClipboardCheckIcon,
  ClockIcon,
  FlameIcon,
  ListChecksIcon,
  MessageCircleIcon,
  RulerIcon,
  ChevronRightIcon,
} from "lucide-react";
import { z } from "zod";

import { LineChart, type LinePoint } from "@/components/charts/line-chart";
import { EmptyState } from "@/components/ui/empty-state";
import { StatCard } from "@/components/ui/stat-card";
import { Surface } from "@/components/ui/surface";
import { getCurrentProfile } from "@/lib/auth";
import { computeStreak, startOfDay, timeAgo } from "@/lib/dates";
import { createClient } from "@/lib/supabase/server";

const idSchema = z.string().uuid();

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

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  // Hardening (CRIT-3): UUID-validate the route param before any query — it
  // flows into PostgREST filter strings below.
  const idParse = idSchema.safeParse(rawId);
  if (!idParse.success) notFound();
  const id = idParse.data;
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
    // Replaces the previous .or(`referrer_id.eq.${id},referred_id.eq.${id}`)
    // with two typed queries — string interpolation into PostgREST filters is
    // a known injection vector. id is now zod-validated above.
    Promise.all([
      supabase
        .from("referrals")
        .select(
          `id, status, reward_label, rewarded_at, created_at, referrer_id, referred_id,
           referrer:profiles!referrals_referrer_id_fkey(id, full_name),
           referred:profiles!referrals_referred_id_fkey(id, full_name)`,
        )
        .eq("tenant_id", session.tenant.id)
        .eq("referrer_id", id)
        .order("created_at", { ascending: false })
        .returns<ReferralFromDb[]>(),
      supabase
        .from("referrals")
        .select(
          `id, status, reward_label, rewarded_at, created_at, referrer_id, referred_id,
           referrer:profiles!referrals_referrer_id_fkey(id, full_name),
           referred:profiles!referrals_referred_id_fkey(id, full_name)`,
        )
        .eq("tenant_id", session.tenant.id)
        .eq("referred_id", id)
        .order("created_at", { ascending: false })
        .returns<ReferralFromDb[]>(),
    ]).then(([asReferrer, asReferred]) => {
      // Merge with stable order (most recent first) and dedupe by id.
      const seen = new Set<string>();
      const merged: ReferralFromDb[] = [];
      for (const row of [...(asReferrer.data ?? []), ...(asReferred.data ?? [])]) {
        if (!seen.has(row.id)) {
          seen.add(row.id);
          merged.push(row);
        }
      }
      merged.sort((a, b) =>
        (b.created_at ?? "").localeCompare(a.created_at ?? ""),
      );
      return { data: merged, error: asReferrer.error ?? asReferred.error };
    }),
    supabase
      .from("profiles")
      .select("id, full_name")
      .eq("tenant_id", session.tenant.id)
      .eq("role", "student")
      .neq("id", id)
      .order("full_name")
      .returns<{ id: string; full_name: string }[]>(),
  ]);

  const [anamneseRes, lastAssessRes, photosCountRes, subRes, threadRes] = await Promise.all([
    supabase
      .from("anamneses")
      .select("signed_at, reviewed_at, has_heart_condition, has_chest_pain, has_dizziness, is_pregnant")
      .eq("tenant_id", session.tenant.id)
      .eq("student_id", id)
      .maybeSingle(),
    supabase
      .from("assessments")
      .select("id, measured_at, weight_kg, body_fat_pct")
      .eq("tenant_id", session.tenant.id)
      .eq("student_id", id)
      .order("measured_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("progress_photos")
      .select("id", { count: "exact", head: true })
      .eq("tenant_id", session.tenant.id)
      .eq("student_id", id),
    supabase
      .from("subscriptions")
      .select("id, status, current_period_end")
      .eq("tenant_id", session.tenant.id)
      .eq("student_id", id)
      .in("status", ["active", "past_due", "pending"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("chat_threads")
      .select("id")
      .eq("tenant_id", session.tenant.id)
      .eq("student_id", id)
      .maybeSingle(),
  ]);

  let unreadFromStudent = 0;
  if (threadRes.data?.id) {
    const { count } = await supabase
      .from("chat_messages")
      .select("id", { count: "exact", head: true })
      .eq("thread_id", threadRes.data.id)
      .neq("sender_id", session.profile.id)
      .is("read_at", null);
    unreadFromStudent = count ?? 0;
  }
  const anamnese = anamneseRes.data;
  const lastAssess = lastAssessRes.data;
  const photoCount = photosCountRes.count ?? 0;
  const subscription = subRes.data as {
    id: string;
    status: string;
    current_period_end: string | null;
  } | null;
  const anamneseFlags = anamnese
    ? !!(
        anamnese.has_heart_condition ||
        anamnese.has_chest_pain ||
        anamnese.has_dizziness ||
        anamnese.is_pregnant
      )
    : false;

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

  // 8-week sparkline buckets — week buckets start on Monday for stable labels.
  const todayStart = startOfDay(new Date());
  const dowOffset = (todayStart.getDay() + 6) % 7; // Monday = 0
  const thisWeekStart = new Date(todayStart.getTime() - dowOffset * 86_400_000);
  const weekBuckets: { start: Date; count: number }[] = [];
  for (let i = 7; i >= 0; i--) {
    weekBuckets.push({
      start: new Date(thisWeekStart.getTime() - i * 7 * 86_400_000),
      count: 0,
    });
  }
  const earliestWeekMs = weekBuckets[0]!.start.getTime();
  for (const log of completed) {
    if (!log.completed_at) continue;
    const t = startOfDay(log.completed_at).getTime();
    if (t < earliestWeekMs) continue;
    const idx = Math.floor((t - earliestWeekMs) / (7 * 86_400_000));
    if (idx >= 0 && idx < weekBuckets.length) {
      weekBuckets[idx]!.count += 1;
    }
  }
  const sparklinePoints: LinePoint[] = weekBuckets.map((b, i) => ({
    label: i === weekBuckets.length - 1
      ? "agora"
      : `${b.start.getDate()}/${b.start.getMonth() + 1}`,
    value: b.count,
  }));
  const hasSparklineData = sparklinePoints.some((p) => p.value > 0);

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
        <li>
          <StatCard
            icon={<ListChecksIcon className="size-3.5" />}
            label="Treinos"
            value={total.toString()}
          />
        </li>
        <li>
          <StatCard
            icon={<FlameIcon className="size-3.5" />}
            label="Streak"
            value={`${streak} ${streak === 1 ? "dia" : "dias"}`}
          />
        </li>
        <li>
          <StatCard
            icon={<ClockIcon className="size-3.5" />}
            label="Tempo total"
            value={
              totalMinutes < 60
                ? `${totalMinutes}min`
                : `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`
            }
          />
        </li>
      </ul>

      {hasSparklineData ? (
        <Surface className="flex flex-col gap-2 p-4">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Últimas 8 semanas
            </span>
            <span className="text-[10px] text-muted-foreground">
              Treinos por semana
            </span>
          </div>
          <LineChart
            points={sparklinePoints}
            area
            height={72}
            showAxis={false}
            ariaLabel="Treinos por semana nas últimas 8 semanas"
          />
        </Surface>
      ) : null}

      <Link
        href={`/students/${student.id}/chat`}
        className="flex items-center gap-3 rounded-xl border border-border bg-card/30 p-4 transition-colors hover:bg-card/60"
      >
        <span className="relative grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--brand-primary)]/15 text-[var(--brand-primary)]">
          <MessageCircleIcon className="size-5" />
          {unreadFromStudent > 0 ? (
            <span
              aria-label={`${unreadFromStudent} mensagens não lidas`}
              className="absolute -right-1 -top-1 grid min-w-[20px] place-items-center rounded-full bg-[var(--brand-primary)] px-1 text-[10px] font-bold leading-[20px] text-white shadow"
            >
              {unreadFromStudent > 9 ? "9+" : unreadFromStudent}
            </span>
          ) : null}
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Chat
          </span>
          <span className="truncate text-sm font-medium">
            {unreadFromStudent > 0
              ? `${unreadFromStudent} nova${unreadFromStudent === 1 ? "" : "s"} mensagem${unreadFromStudent === 1 ? "" : "s"}`
              : "Conversa direta"}
          </span>
        </div>
        <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
      </Link>

      <PlanPicker
        studentId={student.id}
        currentPlanId={student.current_plan_id ?? null}
        plans={plans}
      />

      {subscription ? <SubscriptionBadge subscription={subscription} /> : null}

      <section className="flex flex-col gap-2">
        <h2 className="font-display text-lg">Saúde</h2>
        <div className="grid gap-2 sm:grid-cols-3">
          <Link
            href={`/students/${student.id}/anamnese`}
            className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${
              anamneseFlags
                ? "border-[var(--brand-primary)]/40 bg-[var(--brand-primary)]/5 hover:border-[var(--brand-primary)]/60"
                : !anamnese?.signed_at
                ? "border-dashed border-border bg-card/20 hover:bg-card/40"
                : "border-border bg-card/30 hover:bg-card/60"
            }`}
          >
            <span className="grid size-9 place-items-center rounded-md bg-card text-muted-foreground">
              {anamneseFlags ? (
                <AlertTriangleIcon className="size-4 text-[var(--brand-primary)]" />
              ) : (
                <ClipboardCheckIcon className="size-4" />
              )}
            </span>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Anamnese
              </span>
              <span className="truncate text-sm font-medium">
                {!anamnese?.signed_at
                  ? "Pendente"
                  : anamneseFlags
                  ? "Atenção"
                  : anamnese.reviewed_at
                  ? "Revisada"
                  : "Pra revisar"}
              </span>
            </div>
            <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
          </Link>

          <Link
            href={`/students/${student.id}/avaliacao`}
            className="flex items-center gap-3 rounded-xl border border-border bg-card/30 p-3 transition-colors hover:bg-card/60"
          >
            <span className="grid size-9 place-items-center rounded-md bg-card text-muted-foreground">
              <RulerIcon className="size-4" />
            </span>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Avaliação
              </span>
              <span className="truncate text-sm font-medium">
                {lastAssess
                  ? `${lastAssess.weight_kg ?? "—"}kg${
                      lastAssess.body_fat_pct ? ` · ${lastAssess.body_fat_pct}%` : ""
                    }`
                  : "Sem registros"}
              </span>
            </div>
            <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
          </Link>

          <Link
            href={`/students/${student.id}/fotos`}
            className="flex items-center gap-3 rounded-xl border border-border bg-card/30 p-3 transition-colors hover:bg-card/60"
          >
            <span className="grid size-9 place-items-center rounded-md bg-card text-muted-foreground">
              <ActivityIcon className="size-4" />
            </span>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Fotos
              </span>
              <span className="truncate text-sm font-medium">
                {photoCount === 0 ? "Sem fotos" : `${photoCount} ${photoCount === 1 ? "foto" : "fotos"}`}
              </span>
            </div>
            <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
          </Link>
        </div>
      </section>

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
          <EmptyState
            title="Sem histórico"
            description="Ainda não concluiu nenhum treino."
            className="px-4 py-6"
          />
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
                    {log.completed_at ? timeAgo(log.completed_at) : ""}
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

function SubscriptionBadge({
  subscription,
}: {
  subscription: { status: string; current_period_end: string | null };
}) {
  const tone =
    subscription.status === "active"
      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500"
      : subscription.status === "past_due"
      ? "border-[var(--brand-primary)]/50 bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]"
      : "border-border bg-card/40 text-muted-foreground";
  const label =
    subscription.status === "active"
      ? "Assinatura ativa"
      : subscription.status === "past_due"
      ? "Pagamento atrasado"
      : "Aguardando 1º pagamento";
  const next = subscription.current_period_end
    ? new Date(subscription.current_period_end).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      })
    : null;
  return (
    <div
      className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2 text-xs ${tone}`}
    >
      <span className="font-medium">{label}</span>
      {next ? (
        <span className="text-muted-foreground">
          {subscription.status === "past_due" ? "venceu " : "próx. "}
          {next}
        </span>
      ) : null}
    </div>
  );
}
