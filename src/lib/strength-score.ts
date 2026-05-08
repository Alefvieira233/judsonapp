import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

/**
 * Strength Score por grupo muscular, 0-100.
 *
 * Fórmula (proxy simples, não-ML, transparente):
 *   raw   = volume_30d (kg total) * (1 + 0.05 * sessions_30d)
 *   score = clamp(round(100 * raw / target[grupo]), 0, 100)
 *
 * volume_30d   = Σ (load_kg * reps_done) nos últimos 30 dias para esse grupo.
 * sessions_30d = nº de dias distintos com pelo menos 1 set logado nesse grupo.
 * target       = referência empírica de tonelagem mensal pra atingir 100. Os
 *                números abaixo são chutes informados (Fitbod usa um modelo
 *                proprietário; nós optamos por thresholds explícitos pra ser
 *                auditável). Tunáveis sem migration.
 *
 * Quando mode='seconds' (prancha etc.), reps_done = segundos. Tratamos como
 * "volume" multiplicando por uma carga implícita de 1 — o tempo já é a
 * progressão. Não normalizamos por bodyweight: viraria modelo próprio.
 */

export type MuscleGroup = "peito" | "costas" | "perna" | "ombro" | "braço" | "core";

const MUSCLE_TARGETS: Record<MuscleGroup, number> = {
  peito: 8000,
  costas: 9000,
  perna: 14000,
  ombro: 5000,
  braço: 4500,
  core: 1500,
};

export const MUSCLE_LABELS: Record<MuscleGroup, string> = {
  peito: "Peito",
  costas: "Costas",
  perna: "Pernas",
  ombro: "Ombros",
  braço: "Braços",
  core: "Core",
};

export const MUSCLE_ORDER: MuscleGroup[] = [
  "peito",
  "costas",
  "perna",
  "ombro",
  "braço",
  "core",
];

type SB = SupabaseClient<Database>;

type LogRow = {
  load_kg: number | null;
  reps_done: number | null;
  workout_log: { completed_at: string | null; student_id: string | null } | null;
  workout_item: { exercise: { muscle_group: string | null } | null } | null;
};

function normalizeMuscle(raw: string | null | undefined): MuscleGroup | null {
  if (!raw) return null;
  const t = raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

  if (t.includes("peito") || t.includes("chest")) return "peito";
  if (t.includes("cost") || t.includes("back") || t.includes("dors")) return "costas";
  if (
    t.includes("perna") ||
    t.includes("leg") ||
    t.includes("quad") ||
    t.includes("posterior") ||
    t.includes("gluteo") ||
    t.includes("panturr")
  )
    return "perna";
  if (t.includes("ombro") || t.includes("shoulder") || t.includes("delto")) return "ombro";
  if (
    t.includes("braco") ||
    t.includes("biceps") ||
    t.includes("triceps") ||
    t.includes("arm") ||
    t.includes("antebra")
  )
    return "braço";
  if (
    t.includes("core") ||
    t.includes("abdom") ||
    t.includes("abs") ||
    t.includes("lombar")
  )
    return "core";
  return null;
}

export type StrengthScores = Record<MuscleGroup, number>;

export async function computeStrengthScoreByMuscle({
  userId,
  supabase,
}: {
  userId: string;
  supabase: SB;
}): Promise<StrengthScores> {
  const since = new Date(Date.now() - 30 * 86_400_000).toISOString();

  const { data, error } = await supabase
    .from("exercise_logs")
    .select(
      `load_kg, reps_done,
       workout_log:workout_logs!inner(completed_at, student_id),
       workout_item:workout_items!inner(exercise:exercises(muscle_group))`,
    )
    .eq("workout_log.student_id", userId)
    .not("workout_log.completed_at", "is", null)
    .gte("workout_log.completed_at", since)
    .returns<LogRow[]>();

  const empty: StrengthScores = {
    peito: 0,
    costas: 0,
    perna: 0,
    ombro: 0,
    braço: 0,
    core: 0,
  };

  if (error || !data) {
    if (error) console.error("[strength-score]", error);
    return empty;
  }

  // Acumula volume e dias distintos por grupo. Set de "yyyy-mm-dd" é
  // O(1) por log e não precisa ordenar.
  const volume: Record<MuscleGroup, number> = { ...empty };
  const days: Record<MuscleGroup, Set<string>> = {
    peito: new Set(),
    costas: new Set(),
    perna: new Set(),
    ombro: new Set(),
    braço: new Set(),
    core: new Set(),
  };

  for (const row of data) {
    const muscle = normalizeMuscle(row.workout_item?.exercise?.muscle_group);
    if (!muscle) continue;
    const reps = row.reps_done ?? 0;
    const load = row.load_kg ?? 0;
    // Bodyweight ou tempo (load=0): conta reps como volume mínimo pra não zerar.
    const contribution = load > 0 ? load * reps : reps;
    volume[muscle] += contribution;
    const day = row.workout_log?.completed_at?.slice(0, 10);
    if (day) days[muscle].add(day);
  }

  const scores: StrengthScores = { ...empty };
  for (const muscle of MUSCLE_ORDER) {
    const v = volume[muscle];
    const sessions = days[muscle].size;
    const raw = v * (1 + 0.05 * sessions);
    const score = Math.round((100 * raw) / MUSCLE_TARGETS[muscle]);
    scores[muscle] = Math.max(0, Math.min(100, score));
  }

  return scores;
}
