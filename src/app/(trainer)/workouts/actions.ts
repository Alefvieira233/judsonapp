"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const createSchema = z.object({
  title: z.string().trim().min(2, "Título muito curto.").max(80),
  student_id: z
    .string()
    .uuid("Aluna inválida.")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  description: z
    .string()
    .trim()
    .max(500)
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export type CreateWorkoutState = { error?: string } | undefined;

export async function createWorkoutAction(
  _prev: CreateWorkoutState,
  formData: FormData,
): Promise<CreateWorkoutState> {
  const session = await getCurrentProfile();
  if (!session || session.profile.role !== "owner") {
    return { error: "Sem permissão." };
  }

  const parsed = createSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("workouts")
    .insert({
      tenant_id: session.tenant.id,
      student_id: parsed.data.student_id ?? null,
      title: parsed.data.title,
      description: parsed.data.description ?? null,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("[workouts.create]", error);
    return { error: "Não consegui criar. Tenta de novo." };
  }

  revalidatePath("/workouts");
  redirect(`/workouts/${data.id}`);
}

const updateWorkoutSchema = z.object({
  id: z.string().uuid(),
  title: z.string().trim().min(2).max(80),
  description: z.string().trim().max(500).optional().nullable(),
  student_id: z.string().uuid().optional().nullable(),
  scheduled_days: z.array(z.number().int().min(0).max(6)).max(7),
  active: z.boolean(),
});

export async function updateWorkoutAction(
  input: z.infer<typeof updateWorkoutSchema>,
): Promise<{ ok?: boolean; error?: string }> {
  const session = await getCurrentProfile();
  if (!session || session.profile.role !== "owner") {
    return { error: "Sem permissão." };
  }

  const parsed = updateWorkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("workouts")
    .update({
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      student_id: parsed.data.student_id ?? null,
      scheduled_days: parsed.data.scheduled_days,
      active: parsed.data.active,
    })
    .eq("id", parsed.data.id)
    .eq("tenant_id", session.tenant.id);

  if (error) {
    console.error("[workouts.update]", error);
    return { error: "Não consegui salvar. Tenta de novo." };
  }

  revalidatePath("/workouts");
  revalidatePath(`/workouts/${parsed.data.id}`);
  return { ok: true };
}

export async function duplicateWorkoutAction(formData: FormData): Promise<void> {
  const session = await getCurrentProfile();
  if (!session || session.profile.role !== "owner") return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();

  const { data: source } = await supabase
    .from("workouts")
    .select("id, title, description, scheduled_days, student_id, active")
    .eq("id", id)
    .eq("tenant_id", session.tenant.id)
    .maybeSingle();
  if (!source) return;

  const { data: items } = await supabase
    .from("workout_items")
    .select("exercise_id, position, sets, reps, rest_seconds, load_suggestion, notes, mode")
    .eq("workout_id", id)
    .order("position");

  const { data: created, error } = await supabase
    .from("workouts")
    .insert({
      tenant_id: session.tenant.id,
      student_id: source.student_id,
      title: `${source.title} (cópia)`,
      description: source.description,
      scheduled_days: source.scheduled_days,
      active: source.active ?? true,
    })
    .select("id")
    .single();
  if (error || !created) {
    console.error("[workouts.duplicate.create]", error);
    return;
  }

  if (items && items.length > 0) {
    const { error: itemsError } = await supabase.from("workout_items").insert(
      items.map((it) => ({
        workout_id: created.id,
        exercise_id: it.exercise_id,
        position: it.position,
        sets: it.sets,
        reps: it.reps,
        rest_seconds: it.rest_seconds,
        load_suggestion: it.load_suggestion,
        notes: it.notes,
        mode: it.mode,
      })),
    );
    if (itemsError) {
      console.error("[workouts.duplicate.items]", itemsError);
    }
  }

  revalidatePath("/workouts");
  redirect(`/workouts/${created.id}`);
}

const cloneSchema = z.object({
  id: z.string().uuid(),
  student_id: z.string().uuid(),
});

export async function cloneWorkoutToStudentAction(formData: FormData): Promise<void> {
  const session = await getCurrentProfile();
  if (!session || session.profile.role !== "owner") return;

  const parsed = cloneSchema.safeParse({
    id: formData.get("id"),
    student_id: formData.get("student_id"),
  });
  if (!parsed.success) return;

  const supabase = await createClient();

  const { data: source } = await supabase
    .from("workouts")
    .select("id, title, description, scheduled_days, active")
    .eq("id", parsed.data.id)
    .eq("tenant_id", session.tenant.id)
    .maybeSingle();
  if (!source) return;

  const { data: student } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", parsed.data.student_id)
    .eq("tenant_id", session.tenant.id)
    .eq("role", "student")
    .maybeSingle();
  if (!student) return;

  const { data: items } = await supabase
    .from("workout_items")
    .select("exercise_id, position, sets, reps, rest_seconds, load_suggestion, notes, mode")
    .eq("workout_id", parsed.data.id)
    .order("position");

  const { data: created, error } = await supabase
    .from("workouts")
    .insert({
      tenant_id: session.tenant.id,
      student_id: parsed.data.student_id,
      title: source.title,
      description: source.description,
      scheduled_days: source.scheduled_days,
      active: source.active ?? true,
    })
    .select("id")
    .single();
  if (error || !created) {
    console.error("[workouts.clone.create]", error);
    return;
  }

  if (items && items.length > 0) {
    const { error: itemsError } = await supabase.from("workout_items").insert(
      items.map((it) => ({
        workout_id: created.id,
        exercise_id: it.exercise_id,
        position: it.position,
        sets: it.sets,
        reps: it.reps,
        rest_seconds: it.rest_seconds,
        load_suggestion: it.load_suggestion,
        notes: it.notes,
        mode: it.mode,
      })),
    );
    if (itemsError) {
      console.error("[workouts.clone.items]", itemsError);
    }
  }

  revalidatePath("/workouts");
  redirect(`/workouts/${created.id}`);
}

export async function deleteWorkoutAction(formData: FormData): Promise<void> {
  const session = await getCurrentProfile();
  if (!session || session.profile.role !== "owner") return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  await supabase
    .from("workouts")
    .delete()
    .eq("id", id)
    .eq("tenant_id", session.tenant.id);

  revalidatePath("/workouts");
  redirect("/workouts");
}

const itemsSchema = z.object({
  workout_id: z.string().uuid(),
  items: z
    .array(
      z.object({
        id: z.string().optional(),
        exercise_id: z.string().uuid(),
        position: z.number().int().min(0),
        sets: z.number().int().min(1).max(20),
        reps: z.string().trim().min(1).max(20),
        rest_seconds: z.number().int().min(0).max(600).nullable(),
        load_suggestion: z.string().trim().max(40).nullable(),
        notes: z.string().trim().max(200).nullable(),
        mode: z.enum(["reps", "seconds"]).default("reps"),
      }),
    )
    .max(50),
});

export async function saveWorkoutItemsAction(
  input: z.infer<typeof itemsSchema>,
): Promise<{ ok?: boolean; error?: string }> {
  const session = await getCurrentProfile();
  if (!session || session.profile.role !== "owner") {
    return { error: "Sem permissão." };
  }

  const parsed = itemsSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();

  // Verify the workout belongs to this tenant before mutating.
  const { data: workout } = await supabase
    .from("workouts")
    .select("id")
    .eq("id", parsed.data.workout_id)
    .eq("tenant_id", session.tenant.id)
    .maybeSingle();

  if (!workout) return { error: "Treino não encontrado." };

  // Stable-ID upsert strategy:
  //   1. Diff incoming items vs existing by id.
  //   2. INSERT new items (no id supplied or unknown id).
  //   3. UPDATE existing ones (preserves id → keeps last_load lookups
  //      working in runner.tsx; exercise_logs.workout_item_id stays valid).
  //   4. DELETE rows whose id is no longer in the payload.
  // Replaces the old delete-all+insert that wiped exercise_log references
  // every time a personal edited a workout.
  const { data: existing } = await supabase
    .from("workout_items")
    .select("id")
    .eq("workout_id", parsed.data.workout_id);

  const existingIds = new Set((existing ?? []).map((r) => r.id));
  const incomingIds = new Set(
    parsed.data.items
      .map((it) => it.id)
      .filter((id): id is string => !!id && existingIds.has(id)),
  );

  const toInsert = parsed.data.items
    .map((it, idx) => ({ it, idx }))
    .filter(({ it }) => !it.id || !existingIds.has(it.id))
    .map(({ it, idx }) => ({
      workout_id: parsed.data.workout_id,
      exercise_id: it.exercise_id,
      position: idx,
      sets: it.sets,
      reps: it.reps,
      rest_seconds: it.rest_seconds,
      load_suggestion: it.load_suggestion,
      notes: it.notes,
      mode: it.mode,
    }));

  const toUpdate = parsed.data.items
    .map((it, idx) => ({ it, idx }))
    .filter(({ it }) => it.id && existingIds.has(it.id));

  const toDelete = [...existingIds].filter((id) => !incomingIds.has(id));

  if (toDelete.length > 0) {
    const { error: delError } = await supabase
      .from("workout_items")
      .delete()
      .in("id", toDelete);
    if (delError) {
      console.error("[workouts.items.delete]", delError);
      return { error: "Não consegui salvar. Tenta de novo." };
    }
  }

  for (const { it, idx } of toUpdate) {
    const { error: updError } = await supabase
      .from("workout_items")
      .update({
        exercise_id: it.exercise_id,
        position: idx,
        sets: it.sets,
        reps: it.reps,
        rest_seconds: it.rest_seconds,
        load_suggestion: it.load_suggestion,
        notes: it.notes,
        mode: it.mode,
      })
      .eq("id", it.id!);
    if (updError) {
      console.error("[workouts.items.update]", updError);
      return { error: "Não consegui salvar. Tenta de novo." };
    }
  }

  if (toInsert.length > 0) {
    const { error: insError } = await supabase
      .from("workout_items")
      .insert(toInsert);
    if (insError) {
      console.error("[workouts.items.insert]", insError);
      return { error: "Não consegui salvar. Tenta de novo." };
    }
  }

  revalidatePath(`/workouts/${parsed.data.workout_id}`);
  return { ok: true };
}
