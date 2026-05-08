"use server";

import { z } from "zod";

import { getCurrentProfile } from "@/lib/auth";
import { isPushEnabled, sendPushToUser, type PushPayload } from "@/lib/push";
import { createAdminClient } from "@/lib/supabase/server";

const reminderSchema = z.object({
  studentId: z.string().uuid(),
  message: z.string().trim().min(2).max(140),
});

export type PushActionResult =
  | { ok: true; sent: number; gone: number; failed: number }
  | { ok: false; error: string };

export async function pushReminderToStudent(
  input: z.infer<typeof reminderSchema>,
): Promise<PushActionResult> {
  const session = await getCurrentProfile();
  if (!session || session.profile.role !== "owner") {
    return { ok: false, error: "Sem permissão." };
  }
  if (!isPushEnabled()) {
    return { ok: false, error: "Push não configurado no servidor." };
  }
  const parsed = reminderSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const admin = createAdminClient();
  const { data: student } = await admin
    .from("profiles")
    .select("id, tenant_id, full_name")
    .eq("id", parsed.data.studentId)
    .eq("tenant_id", session.tenant.id)
    .eq("role", "student")
    .maybeSingle();
  if (!student) return { ok: false, error: "Aluna não encontrada." };

  const payload: PushPayload = {
    title: session.tenant.name,
    body: parsed.data.message,
    url: "/home",
    tag: `reminder-${student.id}`,
  };
  const stats = await sendPushToUser({ userId: student.id, payload });
  return { ok: true, ...stats };
}

type CronResult = { sent: number; gone: number; failed: number; targeted: number };

function startOfTodayIso(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export async function notifyTrainingDayCron(): Promise<CronResult> {
  if (!isPushEnabled()) return { sent: 0, gone: 0, failed: 0, targeted: 0 };
  const admin = createAdminClient();
  const dow = new Date().getDay();
  const todayStart = startOfTodayIso();

  const { data: workouts } = await admin
    .from("workouts")
    .select("student_id, tenant_id, title")
    .eq("active", true)
    .contains("scheduled_days", [dow]);
  if (!workouts || workouts.length === 0) {
    return { sent: 0, gone: 0, failed: 0, targeted: 0 };
  }

  const byStudent = new Map<string, { tenantId: string | null; title: string }>();
  for (const w of workouts) {
    if (!w.student_id) continue;
    if (!byStudent.has(w.student_id)) {
      byStudent.set(w.student_id, { tenantId: w.tenant_id, title: w.title });
    }
  }

  const studentIds = Array.from(byStudent.keys());
  if (studentIds.length === 0) {
    return { sent: 0, gone: 0, failed: 0, targeted: 0 };
  }

  const { data: doneToday } = await admin
    .from("workout_logs")
    .select("student_id")
    .in("student_id", studentIds)
    .gte("completed_at", todayStart);
  const doneSet = new Set((doneToday ?? []).map((l) => l.student_id).filter(Boolean));

  const tenantIds = Array.from(
    new Set(Array.from(byStudent.values()).map((v) => v.tenantId).filter((v): v is string => !!v)),
  );
  const tenantNames = new Map<string, string>();
  if (tenantIds.length > 0) {
    const { data: tenants } = await admin
      .from("tenants")
      .select("id, name")
      .in("id", tenantIds);
    for (const t of tenants ?? []) tenantNames.set(t.id, t.name);
  }

  let totalSent = 0;
  let totalGone = 0;
  let totalFailed = 0;
  let targeted = 0;
  for (const [studentId, info] of byStudent) {
    if (doneSet.has(studentId)) continue;
    targeted += 1;
    const tenantName = info.tenantId ? tenantNames.get(info.tenantId) ?? "Treino" : "Treino";
    const stats = await sendPushToUser({
      userId: studentId,
      payload: {
        title: tenantName,
        body: "Tem treino hoje 💪",
        url: "/treinos",
        tag: `training-day-${studentId}`,
      },
    });
    totalSent += stats.sent;
    totalGone += stats.gone;
    totalFailed += stats.failed;
  }
  return { sent: totalSent, gone: totalGone, failed: totalFailed, targeted };
}

export async function notifyInactiveStudentsCron(): Promise<CronResult> {
  if (!isPushEnabled()) return { sent: 0, gone: 0, failed: 0, targeted: 0 };
  const admin = createAdminClient();

  const { data: students } = await admin
    .from("profiles")
    .select("id, tenant_id")
    .eq("role", "student")
    .eq("active", true);
  if (!students || students.length === 0) {
    return { sent: 0, gone: 0, failed: 0, targeted: 0 };
  }

  const tenantIds = Array.from(
    new Set(students.map((s) => s.tenant_id).filter((v): v is string => !!v)),
  );
  const tenantNames = new Map<string, string>();
  if (tenantIds.length > 0) {
    const { data: tenants } = await admin
      .from("tenants")
      .select("id, name")
      .in("id", tenantIds);
    for (const t of tenants ?? []) tenantNames.set(t.id, t.name);
  }

  const now = Date.now();
  let totalSent = 0;
  let totalGone = 0;
  let totalFailed = 0;
  let targeted = 0;
  for (const student of students) {
    const { data: lastLog } = await admin
      .from("workout_logs")
      .select("completed_at")
      .eq("student_id", student.id)
      .not("completed_at", "is", null)
      .order("completed_at", { ascending: false })
      .limit(1)
      .maybeSingle<{ completed_at: string | null }>();
    if (!lastLog?.completed_at) continue;
    const days = Math.floor((now - new Date(lastLog.completed_at).getTime()) / 86_400_000);
    if (days < 3) continue;
    targeted += 1;
    const tenantName = student.tenant_id
      ? tenantNames.get(student.tenant_id) ?? "Judson"
      : "Judson";
    const stats = await sendPushToUser({
      userId: student.id,
      payload: {
        title: tenantName,
        body: `Faz ${days} dias sem treinar. Bora?`,
        url: "/treinos",
        tag: `inactive-${student.id}`,
      },
    });
    totalSent += stats.sent;
    totalGone += stats.gone;
    totalFailed += stats.failed;
  }
  return { sent: totalSent, gone: totalGone, failed: totalFailed, targeted };
}
