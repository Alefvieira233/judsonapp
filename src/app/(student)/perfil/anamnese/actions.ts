"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getCurrentStudent } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const yesNoOptional = z
  .union([z.literal("on"), z.literal("off"), z.literal("")])
  .optional()
  .transform((v) => (v === "on" ? true : v === "off" ? false : null));

const anamneseSchema = z.object({
  has_heart_condition: yesNoOptional,
  has_chest_pain: yesNoOptional,
  has_dizziness: yesNoOptional,
  has_bone_or_joint_problem: yesNoOptional,
  takes_blood_pressure_meds: yesNoOptional,
  is_pregnant: yesNoOptional,
  smoker: yesNoOptional,
  injuries: z.string().trim().max(2000).optional().or(z.literal("").transform(() => undefined)),
  surgeries: z.string().trim().max(2000).optional().or(z.literal("").transform(() => undefined)),
  medications: z.string().trim().max(2000).optional().or(z.literal("").transform(() => undefined)),
  allergies: z.string().trim().max(2000).optional().or(z.literal("").transform(() => undefined)),
  conditions: z.string().trim().max(2000).optional().or(z.literal("").transform(() => undefined)),
  family_history: z.string().trim().max(2000).optional().or(z.literal("").transform(() => undefined)),
  goals: z.string().trim().max(2000).optional().or(z.literal("").transform(() => undefined)),
  activity_level: z
    .enum(["sedentaria", "leve", "moderada", "intensa"])
    .optional()
    .or(z.literal("").transform(() => undefined)),
  notes: z.string().trim().max(2000).optional().or(z.literal("").transform(() => undefined)),
});

export type SaveAnamneseState =
  | { ok: true }
  | { ok: false; error: string }
  | undefined;

export async function saveAnamneseAction(
  _prev: SaveAnamneseState,
  formData: FormData,
): Promise<SaveAnamneseState> {
  const session = await getCurrentStudent();
  if (!session) return { ok: false, error: "Sessão expirada." };

  const raw = Object.fromEntries(formData);
  const parsed = anamneseSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("anamneses")
    .upsert(
      {
        tenant_id: session.tenant.id,
        student_id: session.profile.id,
        has_heart_condition: parsed.data.has_heart_condition,
        has_chest_pain: parsed.data.has_chest_pain,
        has_dizziness: parsed.data.has_dizziness,
        has_bone_or_joint_problem: parsed.data.has_bone_or_joint_problem,
        takes_blood_pressure_meds: parsed.data.takes_blood_pressure_meds,
        is_pregnant: parsed.data.is_pregnant,
        smoker: parsed.data.smoker,
        injuries: parsed.data.injuries ?? null,
        surgeries: parsed.data.surgeries ?? null,
        medications: parsed.data.medications ?? null,
        allergies: parsed.data.allergies ?? null,
        conditions: parsed.data.conditions ?? null,
        family_history: parsed.data.family_history ?? null,
        goals: parsed.data.goals ?? null,
        activity_level: parsed.data.activity_level ?? null,
        notes: parsed.data.notes ?? null,
        signed_at: new Date().toISOString(),
      },
      { onConflict: "tenant_id,student_id" },
    );

  if (error) {
    console.error("[anamnese.save]", error);
    return { ok: false, error: "Não consegui salvar." };
  }

  revalidatePath("/perfil");
  revalidatePath("/perfil/anamnese");
  revalidatePath(`/students/${session.profile.id}`);
  return { ok: true };
}
