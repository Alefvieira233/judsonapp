"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getCurrentStudent } from "@/lib/auth";
import { log } from "@/lib/logger";
import { createAdminClient, createClient } from "@/lib/supabase/server";

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 10 * 1024 * 1024;

const uploadSchema = z.object({
  pose: z.enum(["front", "side", "back", "other"]),
  weight_kg: z
    .union([z.string(), z.null()])
    .transform((v) => {
      if (v === null) return null;
      const s = String(v).trim().replace(",", ".");
      if (s === "") return null;
      const n = Number(s);
      return Number.isFinite(n) ? n : null;
    })
    .pipe(z.number().min(20).max(400).nullable()),
  notes: z
    .string()
    .trim()
    .max(500)
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export type UploadProgressPhotoState =
  | { ok: true }
  | { ok: false; error: string }
  | undefined;

export async function uploadProgressPhotoAction(
  _prev: UploadProgressPhotoState,
  formData: FormData,
): Promise<UploadProgressPhotoState> {
  const session = await getCurrentStudent();
  if (!session) return { ok: false, error: "Sessão expirada." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Escolhe uma imagem." };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, error: "Imagem grande demais (máx 10 MB)." };
  }
  if (!ALLOWED_MIME.has(file.type)) {
    return { ok: false, error: "Formato não suportado. Use JPG, PNG ou WebP." };
  }

  const parsed = uploadSchema.safeParse({
    pose: formData.get("pose"),
    weight_kg: formData.get("weight_kg") ?? null,
    notes: formData.get("notes") ?? "",
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  const ext =
    file.type === "image/png"
      ? "png"
      : file.type === "image/webp"
      ? "webp"
      : "jpg";
  // Path follows the bucket convention <tenant_id>/<student_id>/<file>; the
  // bucket is private and RLS gates access on the second folder segment.
  const filename = `${Date.now()}-${parsed.data.pose}.${ext}`;
  const path = `${session.tenant.id}/${session.profile.id}/${filename}`;

  // Service role bypasses RLS — needed because the storage policy keys on
  // auth.uid() which the SSR client won't expose for privileged inserts on
  // tenant-prefixed paths inside server actions.
  const admin = createAdminClient();
  const { error: uploadErr } = await admin.storage
    .from("progress-photos")
    .upload(path, file, {
      contentType: file.type,
      upsert: false,
      cacheControl: "private, max-age=3600",
    });
  if (uploadErr) {
    log.error("progress_photos.upload.storage", uploadErr, { scope: "progress_photos" });
    return { ok: false, error: "Não consegui salvar a foto. Tenta de novo." };
  }

  const supabase = await createClient();
  const { error: insertErr } = await supabase.from("progress_photos").insert({
    tenant_id: session.tenant.id,
    student_id: session.profile.id,
    storage_path: path,
    pose: parsed.data.pose,
    weight_kg: parsed.data.weight_kg,
    notes: parsed.data.notes ?? null,
  });
  if (insertErr) {
    // Roll back the orphan storage object so we don't leak bytes when DB
    // insert fails (e.g. RLS edge cases or transient errors).
    await admin.storage.from("progress-photos").remove([path]);
    log.error("progress_photos.upload.insert", insertErr, { scope: "progress_photos" });
    return { ok: false, error: "Não consegui registrar a foto." };
  }

  revalidatePath("/perfil");
  revalidatePath("/perfil/fotos");
  revalidatePath(`/students/${session.profile.id}/fotos`);
  return { ok: true };
}

export async function deleteProgressPhotoAction(
  formData: FormData,
): Promise<void> {
  const session = await getCurrentStudent();
  if (!session) return;

  const id = String(formData.get("id") ?? "");
  if (!z.string().uuid().safeParse(id).success) return;

  const supabase = await createClient();
  // Fetch first so we can remove the storage object even if RLS would block
  // the row from being deleted (defense in depth).
  const { data: row } = await supabase
    .from("progress_photos")
    .select("id, storage_path, student_id")
    .eq("id", id)
    .maybeSingle();
  if (!row || row.student_id !== session.profile.id) return;

  const { error: delErr } = await supabase
    .from("progress_photos")
    .delete()
    .eq("id", id);
  if (delErr) {
    log.error("progress_photos.delete.db", delErr, { scope: "progress_photos" });
    return;
  }

  const admin = createAdminClient();
  const { error: rmErr } = await admin.storage
    .from("progress-photos")
    .remove([row.storage_path]);
  if (rmErr) {
    log.error("progress_photos.delete.storage", rmErr, { scope: "progress_photos" });
  }

  revalidatePath("/perfil");
  revalidatePath("/perfil/fotos");
  revalidatePath(`/students/${session.profile.id}/fotos`);
}
