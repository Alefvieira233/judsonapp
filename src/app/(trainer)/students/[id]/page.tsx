import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ActivityIcon,
  AlertTriangleIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
  ClipboardCheckIcon,
  ClockIcon,
  FlameIcon,
  ListChecksIcon,
  MessageCircleIcon,
  PhoneIcon,
  RulerIcon,
} from "lucide-react";
import { z } from "zod";

import { LineChart, type LinePoint } from "@/components/charts/line-chart";
import { EmptyState } from "@/components/ui/empty-state";
import { StatCard } from "@/components/ui/stat-card";
import { Surface } from "@/components/ui/surface";
import { getCurrentProfile } from "@/lib/auth";
import { computeStreak, startOfDay, timeAgo } from "@/lib/dates";
import { isPushEnabled } from "@/lib/push";
import { createClient } from "@/lib/supabase/server";

const idSchema = z.string().uuid();

import { ActivityTimeline, type TimelineItem } from "./activity-timeline";
import { AdherenceCard } from "./adherence-card";
import { AssignWorkoutShortcut } from "./assign-workout-shortcut";
import { EditStudentForm } from "./edit-form";
import { PlanPicker } from "./plan-picker";
import { PushReminderButton } from "./push-reminder-button";
import { ReferralsBlock } from "./referrals-block";
import { SectionNav } from "./section-nav";

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

type StudentWorkoutRow = {
  id: string;
  scheduled_days: number[] | null;
  active: boolean | null;
};

type PhotoRow = { id: string; created_at: string };

type CommentRow = {
  id: string;
  created_at: string | null;
  content: string;
};

const MS_PER_DAY = 86_400_000;

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

  const [
    logsRes,
    plansRes,
    referralsRes,
    candidatesRes,
    studentWorkoutsRes,
    templatesRes,
  ] = await Promise.all([
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
    supabase
      .from("workouts")
      .select("id, scheduled_days, active")
      .eq("tenant_id", session.tenant.id)
      .eq("student_id", id)
      .returns<StudentWorkoutRow[]>(),
    // Up to 12 templates (no student) for the assign-shortcut sheet.
    supabase
      .from("workouts")
      .select(
        `id, title,
         items:workout_items(count),
         exercise_items:workout_items(exercise:exercises(muscle_group))`,
      )
      .eq("tenant_id", session.tenant.id)
      .is("student_id", null)
      .order("updated_at", { ascending: false })
      .limit(12),
  ]);

  const [
    anamneseRes,
    lastAssessRes,
    photosCountRes,
    photosRes,
    subRes,
    threadRes,
    commentsRes,
  ] = await Promise.all([
    supabase
      .from("anamneses")
      .select(
        "signed_at, reviewed_at, has_heart_condition, has_chest_pain, has_dizziness, is_pregnant",
      )
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
      .from("progress_photos")
      .select("id, created_at")
      .eq("tenant_id", session.tenant.id)
      .eq("student_id", id)
      .order("created_at", { ascending: false })
      .limit(3)
      .returns<PhotoRow[]>(),
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
    supabase
      .from("community_comments")
      .select("id, created_at, content")
      .eq("user_id", id)
      .order("created_at", { ascending: false })
      .limit(3)
      .returns<CommentRow[]>(),
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
  const studentWorkouts = studentWorkoutsRes.data ?? [];

  // Templates list — items relation gives count, exercise_items lets us pick
  // a dominant muscle group for the icon.
  type TemplateRow = {
    id: string;
    title: string;
    items: { count: number }[];
    exercise_items: { exercise: { muscle_group: string | null } | null }[];
  };
  const templates = ((templatesRes.data ?? []) as TemplateRow[]).map((t) => {
    const counts = new Map<string, number>();
    for (const ei of t.exercise_items ?? []) {
      const mg = ei.exercise?.muscle_group;
      if (!mg) continue;
      counts.set(mg, (counts.get(mg) ?? 0) + 1);
    }
    const dominant =
      [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
    return {
      id: t.id,
      title: t.title,
      exercise_count: t.items?.[0]?.count ?? 0,
      dominant_muscle: dominant,
    };
  });

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

  // 8-week sparkline buckets — week buckets start on Monday.
  const todayStart = startOfDay(new Date());
  const dowOffset = (todayStart.getDay() + 6) % 7; // Monday = 0
  const thisWeekStart = new Date(
    todayStart.getTime() - dowOffset * MS_PER_DAY,
  );
  const weekBuckets: { start: Date; count: number }[] = [];
  for (let i = 7; i >= 0; i--) {
    weekBuckets.push({
      start: new Date(thisWeekStart.getTime() - i * 7 * MS_PER_DAY),
      count: 0,
    });
  }
  const earliestWeekMs = weekBuckets[0]!.start.getTime();
  for (const log of completed) {
    if (!log.completed_at) continue;
    const t = startOfDay(log.completed_at).getTime();
    if (t < earliestWeekMs) continue;
    const idx = Math.floor((t - earliestWeekMs) / (7 * MS_PER_DAY));
    if (idx >= 0 && idx < weekBuckets.length) {
      weekBuckets[idx]!.count += 1;
    }
  }
  const sparklinePoints: LinePoint[] = weekBuckets.map((b, i) => ({
    label:
      i === weekBuckets.length - 1
        ? "agora"
        : `${b.start.getDate()}/${b.start.getMonth() + 1}`,
    value: b.count,
  }));
  const hasSparklineData = sparklinePoints.some((p) => p.value > 0);

  // 4-week adherence — for each of the last 4 ISO weeks (Mon-Sun) count the
  // distinct days completed against the planned days for that week. Planned
  // days = union of scheduled_days across the student's active workouts; we
  // multiply by 1 (one planned session/day max) so the ratio caps at 100%.
  const plannedDows = new Set<number>();
  for (const w of studentWorkouts) {
    if (w.active === false) continue;
    for (const d of w.scheduled_days ?? []) plannedDows.add(d);
  }
  type WeekStat = { planned: number; completed: number; label: string };
  const adherenceWeeks: WeekStat[] = [];
  for (let i = 3; i >= 0; i--) {
    const start = new Date(thisWeekStart.getTime() - i * 7 * MS_PER_DAY);
    const end = new Date(start.getTime() + 7 * MS_PER_DAY);
    let plannedThisWeek = 0;
    for (let d = 0; d < 7; d++) {
      const day = new Date(start.getTime() + d * MS_PER_DAY);
      // Only count planned days that have already happened (this week's
      // future days don't yet "count" against adherence).
      if (day.getTime() > todayStart.getTime()) continue;
      if (plannedDows.has(day.getDay())) plannedThisWeek += 1;
    }
    const completedDays = new Set<number>();
    for (const log of completed) {
      if (!log.completed_at) continue;
      const t = new Date(log.completed_at).getTime();
      if (t < start.getTime() || t >= end.getTime()) continue;
      completedDays.add(startOfDay(log.completed_at).getTime());
    }
    const startDay = start.getDate();
    const startMonth = start.getMonth() + 1;
    adherenceWeeks.push({
      planned: plannedThisWeek,
      completed: completedDays.size,
      label: `${startDay}/${startMonth}`,
    });
  }
  const hasAdherenceData = adherenceWeeks.some((w) => w.planned > 0);

  // Build a 5-item activity timeline from the most recent events across types.
  const timeline: TimelineItem[] = [];
  for (const log of completed.slice(0, 5)) {
    if (!log.completed_at) continue;
    timeline.push({
      id: `log-${log.id}`,
      type: "workout",
      title: `Concluiu ${log.workout?.title ?? "treino"}`,
      detail: log.duration_minutes ? `${log.duration_minutes}min` : null,
      ts: log.completed_at,
    });
  }
  for (const photo of photosRes.data ?? []) {
    timeline.push({
      id: `photo-${photo.id}`,
      type: "photo",
      title: "Subiu foto de progresso",
      ts: photo.created_at,
    });
  }
  for (const comment of commentsRes.data ?? []) {
    if (!comment.created_at) continue;
    const snippet =
      comment.content.length > 40
        ? `${comment.content.slice(0, 40)}…`
        : comment.content;
    timeline.push({
      id: `comment-${comment.id}`,
      type: "comment",
      title: "Comentou na comunidade",
      detail: snippet,
      ts: comment.created_at,
    });
  }
  if (anamnese?.signed_at) {
    timeline.push({
      id: "anamnese",
      type: "anamnese",
      title: anamnese.reviewed_at
        ? "Anamnese revisada"
        : "Anamnese preenchida",
      ts: anamnese.signed_at,
    });
  }
  timeline.sort((a, b) => (b.ts > a.ts ? 1 : a.ts > b.ts ? -1 : 0));

  const initial = (Array.from(student.full_name)[0] ?? "?").toUpperCase();
  const pushEnabled = isPushEnabled();

  // WhatsApp — strip non-digits, fall back to none.
  const phoneDigits = (student.phone ?? "").replace(/\D/g, "");
  const waHref = phoneDigits
    ? `https://wa.me/${phoneDigits.startsWith("55") ? phoneDigits : `55${phoneDigits}`}`
    : null;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 md:px-6 md:py-10">
      <Link
        href="/students"
        className="inline-flex w-fit items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3.5" /> Alunas
      </Link>

      <header
        id="overview"
        className="flex flex-col gap-4 rounded-2xl border border-border bg-gradient-to-br from-[var(--brand-primary)]/10 via-card/40 to-card/40 p-5"
      >
        <div className="flex items-start gap-4">
          <span className="grid size-16 shrink-0 place-items-center rounded-full bg-card font-display text-2xl text-foreground">
            {initial}
          </span>
          <div className="flex min-w-0 flex-1 flex-col">
            <h1 className="truncate font-display text-3xl leading-none md:text-4xl">
              {student.full_name}
            </h1>
            <span className="mt-1 text-xs text-muted-foreground">
              {student.email ?? student.phone ?? "Sem contato"}
            </span>
            {student.goal ? (
              <span className="mt-1 text-xs text-muted-foreground">
                <span className="text-foreground">Objetivo:</span> {student.goal}
              </span>
            ) : null}
          </div>
          {streak > 0 ? (
            <div className="flex flex-col items-center gap-0.5 rounded-xl border border-[var(--brand-primary)]/40 bg-[var(--brand-primary)]/10 px-3 py-2">
              <FlameIcon className="size-5 text-[var(--brand-primary)]" />
              <span className="font-display text-2xl leading-none tabular-nums text-foreground">
                {streak}
              </span>
              <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                {streak === 1 ? "dia" : "dias"}
              </span>
            </div>
          ) : null}
        </div>
      </header>

      <SectionNav />

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

      {hasAdherenceData ? <AdherenceCard weeks={adherenceWeeks} /> : null}

      {timeline.length > 0 ? <ActivityTimeline items={timeline} /> : null}

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

      {/* Comunicação */}
      <section id="comm" className="flex flex-col gap-2 scroll-mt-20">
        <h2 className="font-display text-lg">Falar com {student.full_name.split(" ")[0]}</h2>
        <div className="grid grid-cols-3 gap-2">
          <Link
            href={`/students/${student.id}/chat`}
            className="relative flex flex-1 flex-col items-center gap-1.5 rounded-xl border border-border bg-card/30 p-3 text-xs transition-colors hover:bg-card/60"
          >
            <MessageCircleIcon className="size-5 text-[var(--brand-primary)]" />
            <span className="font-medium text-foreground">Chat</span>
            <span className="text-[10px] text-muted-foreground">
              {unreadFromStudent > 0
                ? `${unreadFromStudent} nova${unreadFromStudent === 1 ? "" : "s"}`
                : "In-app"}
            </span>
            {unreadFromStudent > 0 ? (
              <span className="absolute right-2 top-2 grid min-w-[18px] place-items-center rounded-full bg-[var(--brand-primary)] px-1 text-[10px] font-bold leading-[18px] text-white shadow">
                {unreadFromStudent > 9 ? "9+" : unreadFromStudent}
              </span>
            ) : null}
          </Link>
          {waHref ? (
            <a
              href={waHref}
              target="_blank"
              rel="noreferrer"
              className="flex flex-1 flex-col items-center gap-1.5 rounded-xl border border-border bg-card/30 p-3 text-xs transition-colors hover:bg-card/60"
            >
              <PhoneIcon className="size-5 text-[var(--brand-primary)]" />
              <span className="font-medium text-foreground">WhatsApp</span>
              <span className="text-[10px] text-muted-foreground">Externo</span>
            </a>
          ) : (
            <div className="flex flex-1 flex-col items-center gap-1.5 rounded-xl border border-dashed border-border bg-card/20 p-3 text-xs opacity-50">
              <PhoneIcon className="size-5 text-muted-foreground" />
              <span className="font-medium text-muted-foreground">WhatsApp</span>
              <span className="text-[10px] text-muted-foreground">Sem nº</span>
            </div>
          )}
          {pushEnabled ? (
            <PushReminderButton
              studentId={student.id}
              studentName={student.full_name.split(" ")[0] ?? student.full_name}
            />
          ) : null}
        </div>
      </section>

      {/* Treinos */}
      <section id="training" className="flex flex-col gap-3 scroll-mt-20">
        <AssignWorkoutShortcut
          studentId={student.id}
          studentName={student.full_name}
          templates={templates}
        />
      </section>

      <PlanPicker
        studentId={student.id}
        currentPlanId={student.current_plan_id ?? null}
        plans={plans}
      />

      {subscription ? <SubscriptionBadge subscription={subscription} /> : null}

      {/* Saúde */}
      <section id="health" className="flex flex-col gap-2 scroll-mt-20">
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
                      lastAssess.body_fat_pct
                        ? ` · ${lastAssess.body_fat_pct}%`
                        : ""
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
                {photoCount === 0
                  ? "Sem fotos"
                  : `${photoCount} ${photoCount === 1 ? "foto" : "fotos"}`}
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

      {/* Histórico */}
      <section id="history" className="flex flex-col gap-3 scroll-mt-20">
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
