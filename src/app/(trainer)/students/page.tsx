import { getTranslations } from "next-intl/server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";

import { CreateStudentButton } from "./create-student-button";
import { InviteButton } from "./invite-button";
import { StudentsList, type StudentItem } from "./students-list";

export async function generateMetadata() {
  const t = await getTranslations("students");
  return { title: t("metadata_title") };
}

type ThreadRow = { id: string; student_id: string };
type UnreadRow = { thread_id: string };
type StudentRow = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  goal: string | null;
  active: boolean | null;
  joined_at: string | null;
  current_plan_id: string | null;
};
type AnamneseRow = { student_id: string; signed_at: string | null };
type WorkoutAssignRow = { student_id: string };
type LogRow = { student_id: string; completed_at: string | null };

const SEVEN_DAYS_MS = 7 * 86_400_000;

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string | string[] }>;
}) {
  const session = await getCurrentProfile();
  if (!session) return null;

  const sp = await searchParams;
  const initialView = typeof sp.view === "string" ? sp.view : undefined;

  const t = await getTranslations("students");

  const supabase = await createClient();
  const [studentsRes, threadsRes, anamneseRes, workoutAssignRes, lastLogsRes] =
    await Promise.all([
      supabase
        .from("profiles")
        .select(
          "id, full_name, email, phone, goal, active, joined_at, current_plan_id",
        )
        .eq("tenant_id", session.tenant.id)
        .eq("role", "student")
        .order("joined_at", { ascending: false })
        .returns<StudentRow[]>(),
      supabase
        .from("chat_threads")
        .select("id, student_id")
        .eq("tenant_id", session.tenant.id)
        .returns<ThreadRow[]>(),
      supabase
        .from("anamneses")
        .select("student_id, signed_at")
        .eq("tenant_id", session.tenant.id)
        .returns<AnamneseRow[]>(),
      supabase
        .from("workouts")
        .select("student_id")
        .eq("tenant_id", session.tenant.id)
        .not("student_id", "is", null)
        .returns<WorkoutAssignRow[]>(),
      // Pull the latest 1500 completed logs and reduce in-memory: avoids a
      // per-student round-trip and is small data (count ~ workouts/month).
      supabase
        .from("workout_logs")
        .select("student_id, completed_at")
        .eq("tenant_id", session.tenant.id)
        .not("completed_at", "is", null)
        .order("completed_at", { ascending: false })
        .limit(1500)
        .returns<LogRow[]>(),
    ]);

  const threads = threadsRes.data ?? [];
  const threadByStudent = new Map(threads.map((tr) => [tr.student_id, tr.id]));

  const unreadCountByThread = new Map<string, number>();
  if (threads.length > 0) {
    const threadIds = threads.map((tr) => tr.id);
    const { data: unread } = await supabase
      .from("chat_messages")
      .select("thread_id")
      .in("thread_id", threadIds)
      .is("read_at", null)
      .neq("sender_id", session.profile.id)
      .returns<UnreadRow[]>();
    for (const row of unread ?? []) {
      unreadCountByThread.set(
        row.thread_id,
        (unreadCountByThread.get(row.thread_id) ?? 0) + 1,
      );
    }
  }

  // Build "anamnese filled" set — signed_at is the marker of completion.
  const anamneseFilled = new Set<string>();
  for (const a of anamneseRes.data ?? []) {
    if (a.signed_at) anamneseFilled.add(a.student_id);
  }

  // Students with at least one assigned workout.
  const hasWorkout = new Set<string>();
  for (const w of workoutAssignRes.data ?? []) {
    if (w.student_id) hasWorkout.add(w.student_id);
  }

  // Most recent training timestamp per student.
  const lastTrainedByStudent = new Map<string, number>();
  for (const log of lastLogsRes.data ?? []) {
    if (!log.student_id || !log.completed_at) continue;
    const ts = new Date(log.completed_at).getTime();
    const prev = lastTrainedByStudent.get(log.student_id) ?? 0;
    if (ts > prev) lastTrainedByStudent.set(log.student_id, ts);
  }

  const now = new Date().getTime();
  const list: StudentItem[] = (studentsRes.data ?? []).map((s) => {
    const lastTrained = lastTrainedByStudent.get(s.id) ?? null;
    const isActive = s.active !== false;
    const atRisk =
      isActive &&
      (lastTrained === null || now - lastTrained > SEVEN_DAYS_MS);
    return {
      id: s.id,
      full_name: s.full_name,
      email: s.email,
      phone: s.phone,
      goal: s.goal,
      active: s.active,
      joined_at: s.joined_at,
      unread_count:
        unreadCountByThread.get(threadByStudent.get(s.id) ?? "") ?? 0,
      anamnese_pending: !anamneseFilled.has(s.id),
      has_workout: hasWorkout.has(s.id),
      has_paid_plan: !!s.current_plan_id,
      last_trained: lastTrained,
      at_risk: atRisk,
    };
  });

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6 md:gap-8 md:px-6 md:py-10">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {t("eyebrow")}
          </span>
          <h1 className="font-display text-4xl leading-none md:text-5xl">
            {t("title")}
          </h1>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:gap-3">
          <CreateStudentButton />
          <InviteButton />
        </div>
      </header>

      {list.length === 0 ? (
        <StudentsEmptyState />
      ) : (
        <StudentsList students={list} initialView={initialView} />
      )}
    </div>
  );
}

async function StudentsEmptyState() {
  const t = await getTranslations("students");
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card/30 px-6 py-12 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-card font-display text-xl text-foreground">
        +
      </span>
      <h2 className="font-display text-2xl">{t("empty_title")}</h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        {t.rich("empty_body", {
          register: (chunks) => (
            <span className="text-foreground">{chunks}</span>
          ),
          invite: (chunks) => (
            <span className="text-foreground">{chunks}</span>
          ),
        })}
      </p>
    </div>
  );
}
