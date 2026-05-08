"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getCurrentProfile } from "@/lib/auth";
import { log } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";

const num = (max: number) =>
  z
    .union([z.string(), z.number(), z.null()])
    .transform((v) => {
      if (v === null) return null;
      const s = String(v).trim().replace(",", ".");
      if (s === "") return null;
      const n = Number(s);
      return Number.isFinite(n) ? n : null;
    })
    .pipe(z.number().min(0).max(max).nullable());

const createSchema = z.object({
  student_id: z.string().uuid(),
  measured_at: z.string().optional(),
  weight_kg: num(500),
  height_cm: num(250),
  body_fat_pct: num(80),
  muscle_pct: num(80),
  waist_cm: num(250),
  hip_cm: num(250),
  chest_cm: num(250),
  arm_cm: num(150),
  thigh_cm: num(150),
  calf_cm: num(150),
  notes: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export type CreateAssessmentState =
  | { ok: true }
  | { ok: false; error: string }
  | undefined;

export async function createAssessmentAction(
  _prev: CreateAssessmentState,
  formData: FormData,
): Promise<CreateAssessmentState> {
  const session = await getCurrentProfile();
  if (!session || session.profile.role !== "owner") {
    return { ok: false, error: "Sem permissão." };
  }

  const parsed = createSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("assessments").insert({
    tenant_id: session.tenant.id,
    student_id: parsed.data.student_id,
    measured_at: parsed.data.measured_at
      ? new Date(parsed.data.measured_at).toISOString()
      : new Date().toISOString(),
    measured_by: session.profile.id,
    weight_kg: parsed.data.weight_kg,
    height_cm: parsed.data.height_cm,
    body_fat_pct: parsed.data.body_fat_pct,
    muscle_pct: parsed.data.muscle_pct,
    waist_cm: parsed.data.waist_cm,
    hip_cm: parsed.data.hip_cm,
    chest_cm: parsed.data.chest_cm,
    arm_cm: parsed.data.arm_cm,
    thigh_cm: parsed.data.thigh_cm,
    calf_cm: parsed.data.calf_cm,
    notes: parsed.data.notes ?? null,
  });

  if (error) {
    log.error("assessments.create", error, { scope: "assessments" });
    return { ok: false, error: "Não consegui salvar." };
  }

  revalidatePath(`/students/${parsed.data.student_id}`);
  revalidatePath(`/students/${parsed.data.student_id}/avaliacao`);
  return { ok: true };
}

export async function deleteAssessmentAction(
  formData: FormData,
): Promise<void> {
  const session = await getCurrentProfile();
  if (!session || session.profile.role !== "owner") return;

  const id = String(formData.get("id") ?? "");
  const studentId = String(formData.get("student_id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  await supabase
    .from("assessments")
    .delete()
    .eq("id", id)
    .eq("tenant_id", session.tenant.id);

  revalidatePath(`/students/${studentId}`);
  revalidatePath(`/students/${studentId}/avaliacao`);
}
