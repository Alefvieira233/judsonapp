import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { startOfDay } from "@/lib/dates";
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
  | "pr-load";

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
    // TODO: depende de tracking de PR de carga por exercício; placeholder.
    title: "Recorde quebrado",
    description: "Tu superou tua maior carga em algum exercício.",
    icon: "📈",
    condition: "Quebrar recorde de carga (em breve).",
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
  const [{ data: logs }, { data: alreadyEarned }] = await Promise.all([
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
  ]);

  const completedDates = (logs ?? []).map((l) => new Date(l.completed_at));
  const total = completedDates.length;
  const streak = streakFromDates(completedDates);
  const earnedSet = new Set((alreadyEarned ?? []).map((r) => r.badge_key));

  const candidates: BadgeKey[] = [];

  if (total >= 1) candidates.push("first-workout");
  if (total >= 10) candidates.push("10-workouts");
  if (total >= 50) candidates.push("50-workouts");
  if (total >= 100) candidates.push("100-workouts");
  if (streak >= 3) candidates.push("streak-3");
  if (streak >= 7) candidates.push("streak-7");
  if (streak >= 30) candidates.push("streak-30");

  if (joinedAt) {
    const cutoff = joinedWithinDays(joinedAt, 7).getTime();
    const inFirstWeek = completedDates.filter(
      (d) => d.getTime() <= cutoff,
    ).length;
    if (inFirstWeek >= 3) candidates.push("first-week-3x");
  }

  const toUnlock = candidates.filter((k) => !earnedSet.has(k));
  if (toUnlock.length === 0) return [];

  const metadata: Json = { streak, total };
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
    console.error("[badges.evaluate]", error);
    return [];
  }

  const insertedKeys = new Set((inserted ?? []).map((r) => r.badge_key));
  return BADGES.filter((b) => insertedKeys.has(b.key));
}
