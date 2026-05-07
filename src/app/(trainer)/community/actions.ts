"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const createSchema = z.object({
  content: z.string().trim().min(1, "Escreva alguma coisa.").max(2000),
  media_url: z
    .string()
    .trim()
    .url("URL inválida.")
    .max(500)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  pinned: z.string().optional(),
});

export type PostState = { ok?: boolean; error?: string } | undefined;

export async function createPostAction(
  _prev: PostState,
  formData: FormData,
): Promise<PostState> {
  const session = await getCurrentProfile();
  if (!session || session.profile.role !== "owner") {
    return { error: "Sem permissão." };
  }

  const parsed = createSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("community_posts").insert({
    tenant_id: session.tenant.id,
    author_id: session.profile.id,
    content: parsed.data.content,
    media_url: parsed.data.media_url ?? null,
    pinned: parsed.data.pinned === "on",
  });

  if (error) {
    console.error("[community.create]", error);
    return { error: "Não consegui publicar. Tenta de novo." };
  }

  revalidatePath("/community");
  return { ok: true };
}

export async function togglePinAction(formData: FormData): Promise<void> {
  const session = await getCurrentProfile();
  if (!session || session.profile.role !== "owner") return;

  const id = String(formData.get("id") ?? "");
  const pinned = formData.get("pinned") === "true";
  if (!id) return;

  const supabase = await createClient();
  await supabase
    .from("community_posts")
    .update({ pinned: !pinned })
    .eq("id", id)
    .eq("tenant_id", session.tenant.id);

  revalidatePath("/community");
}

export async function deletePostAction(formData: FormData): Promise<void> {
  const session = await getCurrentProfile();
  if (!session || session.profile.role !== "owner") return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  await supabase
    .from("community_posts")
    .delete()
    .eq("id", id)
    .eq("tenant_id", session.tenant.id);

  revalidatePath("/community");
}
