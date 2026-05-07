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
    .select("exercise_id, position, sets, reps, rest_seconds, load_suggestion, notes")
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
      })),
    );
    if (itemsError) {
      console.error("[workouts.duplicate.items]", itemsError);
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

  // Replace strategy: delete existing items then insert the new ordered list.
  // Cheapest correct approach for MVP scale (typically <30 items per workout).
  const { error: deleteError } = await supabase
    .from("workout_items")
    .delete()
    .eq("workout_id", parsed.data.workout_id);

  if (deleteError) {
    console.error("[workouts.items.delete]", deleteError);
    return { error: "Não consegui salvar. Tenta de novo." };
  }

  if (parsed.data.items.length > 0) {
    const { error: insertError } = await supabase.from("workout_items").insert(
      parsed.data.items.map((it, idx) => ({
        workout_id: parsed.data.workout_id,
        exercise_id: it.exercise_id,
        position: idx,
        sets: it.sets,
        reps: it.reps,
        rest_seconds: it.rest_seconds,
        load_suggestion: it.load_suggestion,
        notes: it.notes,
      })),
    );

    if (insertError) {
      console.error("[workouts.items.insert]", insertError);
      return { error: "Não consegui salvar. Tenta de novo." };
    }
  }

  revalidatePath(`/workouts/${parsed.data.workout_id}`);
  return { ok: true };
}
