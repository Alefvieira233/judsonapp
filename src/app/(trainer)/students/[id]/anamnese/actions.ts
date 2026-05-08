"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getCurrentProfile } from "@/lib/auth";
import { log } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";

const reviewSchema = z.object({
  student_id: z.string().uuid(),
});

export async function markAnamneseReviewedAction(
  input: { student_id: string },
): Promise<{ ok: boolean; error?: string }> {
  const session = await getCurrentProfile();
  if (!session || session.profile.role !== "owner") {
    return { ok: false, error: "Sem permissão." };
  }
  const parsed = reviewSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Dados inválidos." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("anamneses")
    .update({ reviewed_at: new Date().toISOString() })
    .eq("tenant_id", session.tenant.id)
    .eq("student_id", parsed.data.student_id);

  if (error) {
    log.error("anamnese.review", error, { scope: "anamnese" });
    return { ok: false, error: "Não consegui marcar." };
  }
  revalidatePath(`/students/${parsed.data.student_id}`);
  revalidatePath(`/students/${parsed.data.student_id}/anamnese`);
  return { ok: true };
}
