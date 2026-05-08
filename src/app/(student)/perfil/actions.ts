"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getCurrentStudent } from "@/lib/auth";
import { log } from "@/lib/logger";
import { createAdminClient, createClient } from "@/lib/supabase/server";

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
    log.error("perfil.update", error, { scope: "perfil" });
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

const ALLOWED_AVATAR_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_AVATAR_BYTES = 3 * 1024 * 1024;

export type UploadAvatarState =
  | { ok: true; url: string }
  | { ok: false; error: string }
  | undefined;

export async function uploadAvatarAction(
  _prev: UploadAvatarState,
  formData: FormData,
): Promise<UploadAvatarState> {
  const session = await getCurrentStudent();
  if (!session) return { ok: false, error: "Sessão expirada." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Escolhe uma imagem." };
  }
  if (file.size > MAX_AVATAR_BYTES) {
    return { ok: false, error: "Imagem grande demais (máx 3 MB)." };
  }
  if (!ALLOWED_AVATAR_MIME.has(file.type)) {
    return { ok: false, error: "Formato não suportado. Use JPG, PNG ou WebP." };
  }

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  // Cache-bust query so the browser refreshes when the same path is overwritten.
  const path = `${session.profile.id}/avatar.${ext}`;

  const admin = createAdminClient();
  const { error: uploadErr } = await admin.storage
    .from("avatars")
    .upload(path, file, {
      contentType: file.type,
      upsert: true,
      cacheControl: "no-cache",
    });
  if (uploadErr) {
    log.error("perfil.uploadAvatar.storage", uploadErr, { scope: "perfil" });
    return { ok: false, error: "Não consegui salvar a foto. Tenta de novo." };
  }

  const { data: pub } = admin.storage.from("avatars").getPublicUrl(path);
  const versioned = `${pub.publicUrl}?v=${Date.now()}`;

  const { error: updErr } = await admin
    .from("profiles")
    .update({ avatar_url: versioned })
    .eq("id", session.profile.id);
  if (updErr) {
    log.error("perfil.uploadAvatar.profile", updErr, { scope: "perfil" });
    return { ok: false, error: "Foto enviada, mas não consegui atualizar o perfil." };
  }

  revalidatePath("/perfil");
  revalidatePath("/perfil/editar");
  revalidatePath("/home");
  return { ok: true, url: versioned };
}
