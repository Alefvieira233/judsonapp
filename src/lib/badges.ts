import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { startOfDay } from "@/lib/dates";
import { log } from "@/lib/logger";
import type { Database, Json } from "@/types/database";

export type BadgeKey =
  | "first-workout"
  | "streak-3"
  | "streak-7"
  | "streak-30"
  | "10-workouts"
  | "50-workouts"
  | "100-workouts"
  | "first-week-3x"
  | "pr-load"
  | "pr-load-10";

export type BadgeDef = {
  key: BadgeKey;
  title: string;
  description: string;
  icon: string;
  condition: string;
};

export const BADGES: BadgeDef[] = [
  {
    key: "first-workout",
    title: "Primeiro treino",
    description: "Tu começou. Esse é o passo mais difícil.",
    icon: "🎯",
    condition: "Concluir o primeiro treino.",
  },
  {
    key: "streak-3",
    title: "Bola de neve",
    description: "Três dias seguidos. Já virou hábito em formação.",
    icon: "🔥",
    condition: "Treinar 3 dias seguidos.",
  },
  {
    key: "streak-7",
    title: "Semana de fogo",
    description: "Sete dias. Muita gente nunca chega aqui.",
    icon: "⚡",
    condition: "Treinar 7 dias seguidos.",
  },
  {
    key: "streak-30",
    title: "Mês de constância",
    description: "30 dias seguidos. Tu virou outra pessoa.",
    icon: "👑",
    condition: "Treinar 30 dias seguidos.",
  },
  {
    key: "10-workouts",
    title: "Dezena",
    description: "10 treinos no mural. Tá de boa.",
    icon: "💪",
    condition: "Concluir 10 treinos.",
  },
  {
    key: "50-workouts",
    title: "Cinquentão",
    description: "50 treinos. Aqui já virou estilo de vida.",
    icon: "🏅",
    condition: "Concluir 50 treinos.",
  },
  {
    key: "100-workouts",
    title: "Centena",
    description: "100 treinos. Olha o que tu já construiu.",
    icon: "🏆",
    condition: "Concluir 100 treinos.",
  },
  {
    key: "first-week-3x",
    title: "Estreia forte",
    description: "Três treinos na primeira semana — isso é compromisso.",
    icon: "🚀",
    condition: "Concluir 3 treinos nos primeiros 7 dias.",
  },
  {
    key: "pr-load",
    title: "Recorde quebrado",
    description: "Tu superou tua maior carga em algum exercício.",
    icon: "📈",
    condition: "Quebrar carga máxima de qualquer exercício pela primeira vez.",
  },
  {
    key: "pr-load-10",
    title: "Forjada no ferro",
    description: "Dez recordes de carga. Tu virou outro nível de força.",
    icon: "🏋️",
    condition: "Acumular 10 recordes de carga.",
  },
];

export const BADGE_BY_KEY: Record<BadgeKey, BadgeDef> = BADGES.reduce(
  (acc, b) => {
    acc[b.key] = b;
    return acc;
  },
  {} as Record<BadgeKey, BadgeDef>,
);

type SB = SupabaseClient<Database>;

type LogRow = { completed_at: string };

function streakFromDates(completed: Date[]): number {
  if (completed.length === 0) return 0;
  const days = new Set(completed.map((d) => startOfDay(d).getTime()));
  const today = startOfDay(new Date()).getTime();
  let cursor = today;
  if (!days.has(cursor)) {
    cursor = cursor - 86_400_000;
    if (!days.has(cursor)) return 0;
  }
  let streak = 0;
  while (days.has(cursor)) {
    streak += 1;
    cursor = cursor - 86_400_000;
  }
  return streak;
}

function joinedWithinDays(joinedAt: Date, days: number): Date {
  return new Date(joinedAt.getTime() + days * 86_400_000);
}

/**
 * Evaluates which badges should be unlocked for the user given their current
 * workout history, then upserts them. Idempotent via the unique constraint
 * (user_id, badge_key) — repeated calls are no-ops after the first unlock.
 *
 * Returns ONLY the badges that became newly unlocked in this call. The runner
 * uses that list to celebrate; subsequent completions of the same workout
 * never resurface a previously-earned badge.
 */
export async function evaluateBadges({
  userId,
  tenantId,
  joinedAt,
  supabase,
}: {
  userId: string;
  tenantId: string;
  joinedAt: Date | null;
  supabase: SB;
}): Promise<BadgeDef[]> {
  const [{ data: logs }, { data: alreadyEarned }, { count: prCount }] =
    await Promise.all([
      supabase
        .from("workout_logs")
        .select("completed_at")
        .eq("student_id", userId)
        .not("completed_at", "is", null)
        .order("completed_at", { ascending: false })
        .returns<LogRow[]>(),
      supabase
        .from("badges_earned")
        .select("badge_key")
        .eq("user_id", userId)
        .returns<{ badge_key: string }[]>(),
      supabase
        .from("personal_records")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId),
    ]);

  const completedDates = (logs ?? []).map((l) => new Date(l.completed_at));
  const total = completedDates.length;
  const streak = streakFromDates(completedDates);
  const earnedSet = new Set((alreadyEarned ?? []).map((r) => r.badge_key));
  const totalPRs = prCount ?? 0;

  const candidates: BadgeKey[] = [];

  if (total >= 1) candidates.push("first-workout");
  if (total >= 10) candidates.push("10-workouts");
  if (total >= 50) candidates.push("50-workouts");
  if (total >= 100) candidates.push("100-workouts");
  if (streak >= 3) candidates.push("streak-3");
  if (streak >= 7) candidates.push("streak-7");
  if (streak >= 30) candidates.push("streak-30");
  if (totalPRs >= 1) candidates.push("pr-load");
  if (totalPRs >= 10) candidates.push("pr-load-10");

  if (joinedAt) {
    const cutoff = joinedWithinDays(joinedAt, 7).getTime();
    const inFirstWeek = completedDates.filter(
      (d) => d.getTime() <= cutoff,
    ).length;
    if (inFirstWeek >= 3) candidates.push("first-week-3x");
  }

  const toUnlock = candidates.filter((k) => !earnedSet.has(k));
  if (toUnlock.length === 0) return [];

  const metadata: Json = { streak, total, totalPRs };
  const rows = toUnlock.map((badge_key) => ({
    user_id: userId,
    tenant_id: tenantId,
    badge_key,
    metadata,
  }));

  // ON CONFLICT DO NOTHING via upsert — protects against the race where the
  // student fires two completes back-to-back (won't dupe). PostgREST upsert
  // needs the conflict target to match the unique index.
  const { data: inserted, error } = await supabase
    .from("badges_earned")
    .upsert(rows, { onConflict: "user_id,badge_key", ignoreDuplicates: true })
    .select("badge_key")
    .returns<{ badge_key: string }[]>();

  if (error) {
    log.error("badges.evaluate", error, { scope: "badges" });
    return [];
  }

  const insertedKeys = new Set((inserted ?? []).map((r) => r.badge_key));
  return BADGES.filter((b) => insertedKeys.has(b.key));
}

/**
 * Detecta se a série recém-logada é PR (Personal Record) de carga pra esse
 * workout_item. PR = load_kg estritamente maior que o máximo já registrado
 * pra esse item, com pelo menos 1 log anterior > 0 (sem isso, a primeira
 * série de qualquer exercício seria sempre "PR" — barulho).
 *
 * Se for PR, insere em personal_records e retorna { isPR: true, ... }.
 * Idempotente o suficiente: se a aluna desfizer e refazer a mesma série,
 * a comparação contra o histórico já considera o registro anterior.
 */
export async function detectAndRecordPR({
  supabase,
  userId,
  tenantId,
  workoutItemId,
  newLoadKg,
}: {
  supabase: SB;
  userId: string;
  tenantId: string;
  workoutItemId: string;
  newLoadKg: number;
}): Promise<{
  isPR: boolean;
  newMax?: number;
  prevMax?: number;
  exerciseName?: string;
}> {
  if (!Number.isFinite(newLoadKg) || newLoadKg <= 0) {
    return { isPR: false };
  }

  const { data: itemMeta } = await supabase
    .from("workout_items")
    .select(
      `id,
       workout:workouts!inner(student_id),
       exercise:exercises(name)`,
    )
    .eq("id", workoutItemId)
    .maybeSingle<{
      id: string;
      workout: { student_id: string | null } | null;
      exercise: { name: string | null } | null;
    }>();

  // Tenant + ownership: o workout_item tem que pertencer a essa aluna.
  if (!itemMeta || itemMeta.workout?.student_id !== userId) {
    return { isPR: false };
  }

  const exerciseName = itemMeta.exercise?.name ?? "Exercício";

  const { data: history } = await supabase
    .from("exercise_logs")
    .select("load_kg, created_at")
    .eq("workout_item_id", workoutItemId)
    .not("load_kg", "is", null)
    .gt("load_kg", 0)
    .order("created_at", { ascending: false })
    .limit(200)
    .returns<{ load_kg: number | null; created_at: string | null }[]>();

  const prior = (history ?? [])
    .map((r) => r.load_kg ?? 0)
    .filter((v) => v > 0);

  // Sem histórico anterior > 0 → não consideramos PR (1ª carga registrada).
  if (prior.length < 1) return { isPR: false };

  // O log atual já está em `prior` porque foi inserido antes desta call.
  // Comparamos newLoadKg contra o segundo maior — ou seja, máximo prévio
  // ignorando a entrada mais recente que matche newLoadKg.
  const sortedDesc = [...prior].sort((a, b) => b - a);
  const idxNew = sortedDesc.indexOf(newLoadKg);
  const previousMax =
    idxNew === 0
      ? sortedDesc[1] ?? 0
      : sortedDesc[0] ?? 0;

  if (!(newLoadKg > previousMax) || previousMax <= 0) {
    return { isPR: false };
  }

  const { error } = await supabase.from("personal_records").insert({
    tenant_id: tenantId,
    user_id: userId,
    workout_item_id: workoutItemId,
    exercise_name: exerciseName,
    prev_max: previousMax,
    new_max: newLoadKg,
  });

  if (error) {
    log.error("pr.insert", error, { scope: "badges" });
    return { isPR: false };
  }

  return {
    isPR: true,
    newMax: newLoadKg,
    prevMax: previousMax,
    exerciseName,
  };
}
