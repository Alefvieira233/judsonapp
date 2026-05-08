"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getCurrentProfile } from "@/lib/auth";
import { log } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";

function detectVideoSource(url: string): "youtube" | "instagram" | "other" {
  if (/youtu\.be|youtube\.com/i.test(url)) return "youtube";
  if (/instagram\.com\/(reel|p|tv)/i.test(url)) return "instagram";
  return "other";
}

const exerciseSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2, "Nome muito curto.").max(80),
  muscle_group: z
    .string()
    .trim()
    .max(40)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  equipment: z
    .string()
    .trim()
    .max(40)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  video_url: z
    .string()
    .trim()
    .url("URL inválida.")
    .max(500)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  instructions: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export type ExerciseState = { ok?: boolean; error?: string } | undefined;

export async function saveExerciseAction(
  _prev: ExerciseState,
  formData: FormData,
): Promise<ExerciseState> {
  const session = await getCurrentProfile();
  if (!session || session.profile.role !== "owner") {
    return { error: "Sem permissão." };
  }

  const parsed = exerciseSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const payload = {
    tenant_id: session.tenant.id,
    name: parsed.data.name,
    muscle_group: parsed.data.muscle_group?.toLowerCase() ?? null,
    equipment: parsed.data.equipment?.toLowerCase() ?? null,
    video_url: parsed.data.video_url ?? null,
    video_source: parsed.data.video_url ? detectVideoSource(parsed.data.video_url) : null,
    instructions: parsed.data.instructions ?? null,
    is_owner_video: !!parsed.data.video_url,
  };

  if (parsed.data.id) {
    const { error } = await supabase
      .from("exercises")
      .update(payload)
      .eq("id", parsed.data.id)
      .eq("tenant_id", session.tenant.id);

    if (error) {
      log.error("exercises.update", error, { scope: "exercises" });
      return { error: "Não consegui salvar. Tenta de novo." };
    }
  } else {
    const { error } = await supabase.from("exercises").insert(payload);
    if (error) {
      log.error("exercises.create", error, { scope: "exercises" });
      return { error: "Não consegui criar. Tenta de novo." };
    }
  }

  revalidatePath("/exercises");
  return { ok: true };
}

export async function deleteExerciseAction(formData: FormData): Promise<void> {
  const session = await getCurrentProfile();
  if (!session || session.profile.role !== "owner") return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  const { error } = await supabase
    .from("exercises")
    .delete()
    .eq("id", id)
    .eq("tenant_id", session.tenant.id);

  if (error) log.error("exercises.delete", error, { scope: "exercises" });
  revalidatePath("/exercises");
}
