"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getCurrentStudent } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const updateSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, "Nome muito curto.")
    .max(80, "Nome muito longo."),
  phone: z
    .string()
    .trim()
    .max(20)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  goal: z
    .string()
    .trim()
    .max(200)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  observations: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export type UpdateProfileState =
  | { ok: true }
  | { ok: false; error: string }
  | undefined;

export async function updateStudentProfileAction(
  _prev: UpdateProfileState,
  formData: FormData,
): Promise<UpdateProfileState> {
  const session = await getCurrentStudent();
  if (!session) return { ok: false, error: "Sessão expirada." };

  const parsed = updateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.full_name,
      phone: parsed.data.phone ?? null,
      goal: parsed.data.goal ?? null,
      observations: parsed.data.observations ?? null,
    })
    .eq("id", session.profile.id)
    .eq("role", "student");

  if (error) {
    console.error("[perfil.update]", error);
    return { ok: false, error: "Não consegui salvar. Tenta de novo." };
  }

  revalidatePath("/perfil");
  revalidatePath("/perfil/editar");
  revalidatePath("/home");
  return { ok: true };
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
