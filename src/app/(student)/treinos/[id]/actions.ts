"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getCurrentStudent } from "@/lib/auth";
import { type BadgeDef, evaluateBadges } from "@/lib/badges";
import { createClient } from "@/lib/supabase/server";

const startSchema = z.object({
  workout_id: z.string().uuid(),
});

export type StartState =
  | { ok: true; logId: string }
  | { ok: false; error: string }
  | undefined;

export async function startWorkoutAction(
  input: { workout_id: string },
): Promise<StartState> {
  const session = await getCurrentStudent();
  if (!session) return { ok: false, error: "Sessão expirada." };

  const parsed = startSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Dados inválidos." };
  }

  const supabase = await createClient();

  const { data: workout } = await supabase
    .from("workouts")
    .select("id, tenant_id, student_id, active")
    .eq("id", parsed.data.workout_id)
    .maybeSingle();

  if (!workout) return { ok: false, error: "Treino não encontrado." };
  if (workout.tenant_id !== session.tenant.id || workout.student_id !== session.profile.id) {
    return { ok: false, error: "Sem permissão." };
  }
  if (workout.active === false) {
    return { ok: false, error: "Esse treino está inativo." };
  }

  const { data, error } = await supabase
    .from("workout_logs")
    .insert({
      tenant_id: session.tenant.id,
      workout_id: workout.id,
      student_id: session.profile.id,
      started_at: new Date().toISOString(),
      completed_at: null,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("[treinos.start]", error);
    return { ok: false, error: "Não consegui iniciar. Tenta de novo." };
  }

  return { ok: true, logId: data.id };
}

const setSchema = z.object({
  workout_log_id: z.string().uuid(),
  workout_item_id: z.string().uuid(),
  set_number: z.number().int().min(1).max(50),
  reps_done: z.number().int().min(0).max(999).nullable(),
  load_kg: z.number().min(0).max(999).nullable(),
});

export async function logSetAction(
  input: z.infer<typeof setSchema>,
): Promise<{ ok: boolean; error?: string }> {
  const session = await getCurrentStudent();
  if (!session) return { ok: false, error: "Sessão expirada." };

  const parsed = setSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();

  // Verify the workout_log belongs to this student before logging.
  const { data: log } = await supabase
    .from("workout_logs")
    .select("id, tenant_id, student_id, completed_at")
    .eq("id", parsed.data.workout_log_id)
    .maybeSingle();
  if (!log || log.tenant_id !== session.tenant.id || log.student_id !== session.profile.id) {
    return { ok: false, error: "Sem permissão." };
  }
  if (log.completed_at) {
    return { ok: false, error: "Esse treino já foi concluído." };
  }

  // Upsert by (workout_log_id, workout_item_id, set_number) so a re-tap
  // overwrites instead of duplicating.
  const { data: existing } = await supabase
    .from("exercise_logs")
    .select("id")
    .eq("workout_log_id", parsed.data.workout_log_id)
    .eq("workout_item_id", parsed.data.workout_item_id)
    .eq("set_number", parsed.data.set_number)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("exercise_logs")
      .update({
        reps_done: parsed.data.reps_done,
        load_kg: parsed.data.load_kg,
      })
      .eq("id", existing.id);
    if (error) {
      console.error("[treinos.logSet.update]", error);
      return { ok: false, error: "Não consegui salvar a série." };
    }
  } else {
    const { error } = await supabase.from("exercise_logs").insert({
      workout_log_id: parsed.data.workout_log_id,
      workout_item_id: parsed.data.workout_item_id,
      set_number: parsed.data.set_number,
      reps_done: parsed.data.reps_done,
      load_kg: parsed.data.load_kg,
    });
    if (error) {
      console.error("[treinos.logSet.insert]", error);
      return { ok: false, error: "Não consegui salvar a série." };
    }
  }

  return { ok: true };
}

const completeSchema = z.object({
  workout_log_id: z.string().uuid(),
  duration_minutes: z.number().int().min(0).max(720).nullable(),
  rpe: z.number().int().min(1).max(10).nullable(),
  notes: z.string().trim().max(500).nullable(),
});

export type CompleteState =
  | { ok: true; newBadges: BadgeDef[] }
  | { ok: false; error: string };

export async function completeWorkoutAction(
  input: z.infer<typeof completeSchema>,
): Promise<CompleteState> {
  const session = await getCurrentStudent();
  if (!session) return { ok: false, error: "Sessão expirada." };

  const parsed = completeSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Dados inválidos." };
  }

  const supabase = await createClient();

  const { data: log } = await supabase
    .from("workout_logs")
    .select("id, tenant_id, student_id")
    .eq("id", parsed.data.workout_log_id)
    .maybeSingle();
  if (!log || log.tenant_id !== session.tenant.id || log.student_id !== session.profile.id) {
    return { ok: false, error: "Sem permissão." };
  }

  const { error } = await supabase
    .from("workout_logs")
    .update({
      completed_at: new Date().toISOString(),
      duration_minutes: parsed.data.duration_minutes,
      rpe: parsed.data.rpe,
      notes: parsed.data.notes,
    })
    .eq("id", parsed.data.workout_log_id);

  if (error) {
    console.error("[treinos.complete]", error);
    return { ok: false, error: "Não consegui concluir. Tenta de novo." };
  }

  // Avalia badges após o update — se a sessão de hoje fechou um marco
  // (10º treino, primeira semana 3x, novo streak), o runner mostra a tela
  // de celebração antes do CompletedScreen normal. Falha aqui não derruba
  // o complete: badges são bônus, não bloqueio.
  const newBadges = await evaluateBadges({
    userId: session.profile.id,
    tenantId: session.tenant.id,
    joinedAt: session.profile.joined_at ? new Date(session.profile.joined_at) : null,
    supabase,
  }).catch((err) => {
    console.error("[treinos.complete.badges]", err);
    return [] as BadgeDef[];
  });

  revalidatePath("/home");
  revalidatePath("/treinos");
  revalidatePath("/perfil");
  return { ok: true, newBadges };
}

const cancelSchema = z.object({
  workout_log_id: z.string().uuid(),
});

/**
 * Aborts a workout in progress: deletes the open workout_log and any
 * exercise_logs already recorded. Without this the cancel button left
 * "started_at without completed_at" rows behind — the runner kept
 * showing them as "treino em aberto" forever.
 */
export async function cancelWorkoutAction(
  input: z.infer<typeof cancelSchema>,
): Promise<{ ok: boolean; error?: string }> {
  const session = await getCurrentStudent();
  if (!session) return { ok: false, error: "Sessão expirada." };

  const parsed = cancelSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Dados inválidos." };

  const supabase = await createClient();
  const { data: log } = await supabase
    .from("workout_logs")
    .select("id, tenant_id, student_id, completed_at")
    .eq("id", parsed.data.workout_log_id)
    .maybeSingle();
  if (!log || log.tenant_id !== session.tenant.id || log.student_id !== session.profile.id) {
    return { ok: false, error: "Sem permissão." };
  }
  if (log.completed_at) {
    return { ok: false, error: "Esse treino já foi concluído." };
  }

  // exercise_logs FK has ON DELETE CASCADE, so deleting the log nukes
  // any sets the user already marked. That's the desired UX: cancel
  // means "throw it all away".
  const { error } = await supabase
    .from("workout_logs")
    .delete()
    .eq("id", parsed.data.workout_log_id);
  if (error) {
    console.error("[treinos.cancel]", error);
    return { ok: false, error: "Não consegui cancelar." };
  }

  revalidatePath("/home");
  revalidatePath("/treinos");
  return { ok: true };
}
