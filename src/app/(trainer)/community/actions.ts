"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getCurrentProfile } from "@/lib/auth";
import { log } from "@/lib/logger";
import { createAdminClient, createClient } from "@/lib/supabase/server";

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

const editSchema = z.object({
  id: z.string().uuid(),
  content: z.string().trim().min(1, "Escreva alguma coisa.").max(2000),
  media_url: z
    .union([z.string().trim().url("URL inválida.").max(500), z.literal(""), z.null()])
    .optional(),
  media_type: z
    .union([z.enum(["image", "video", "link"]), z.literal(""), z.null()])
    .optional(),
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
    log.error("community.create", error, { scope: "community" });
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

export async function editPostAction(
  input: z.infer<typeof editSchema>,
): Promise<{ ok: boolean; error?: string }> {
  const session = await getCurrentProfile();
  if (!session || session.profile.role !== "owner") {
    return { ok: false, error: "Sem permissão." };
  }

  const parsed = editSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  // Normalize empty strings to null so we don't store "" in the column.
  const media_url = parsed.data.media_url ? parsed.data.media_url : null;
  const media_type = parsed.data.media_type ? parsed.data.media_type : null;

  const supabase = await createClient();
  const { error } = await supabase
    .from("community_posts")
    .update({
      content: parsed.data.content,
      media_url,
      media_type,
    })
    .eq("id", parsed.data.id)
    .eq("tenant_id", session.tenant.id);

  if (error) {
    log.error("community.edit", error, { scope: "community" });
    return { ok: false, error: "Não consegui salvar." };
  }

  revalidatePath("/community");
  revalidatePath("/feed");
  return { ok: true };
}

const editAnyCommentSchema = z.object({
  comment_id: z.string().uuid(),
  content: z.string().trim().min(1, "Escreva alguma coisa.").max(500, "Comentário longo demais."),
});

/**
 * Owner-only edit of any comment in the tenant's community.
 *
 * Why admin client: the `community_comments_self_update` RLS policy is
 * author-bound (`user_id = auth.uid()`), and we don't want to widen the
 * policy and risk a student editing the trainer's reply via direct PostgREST
 * call. Instead we gate at the action layer: confirm role=owner, confirm the
 * comment's post belongs to this tenant, then update via admin.
 */
export async function editCommentAsOwnerAction(
  input: z.infer<typeof editAnyCommentSchema>,
): Promise<{ ok: boolean; error?: string }> {
  const session = await getCurrentProfile();
  if (!session || session.profile.role !== "owner") {
    return { ok: false, error: "Sem permissão." };
  }

  const parsed = editAnyCommentSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const admin = createAdminClient();
  const { data: comment } = await admin
    .from("community_comments")
    .select("id, post:community_posts!inner(tenant_id)")
    .eq("id", parsed.data.comment_id)
    .maybeSingle<{ id: string; post: { tenant_id: string } | null }>();

  if (!comment || comment.post?.tenant_id !== session.tenant.id) {
    return { ok: false, error: "Comentário não encontrado." };
  }

  const { error } = await admin
    .from("community_comments")
    .update({ content: parsed.data.content })
    .eq("id", parsed.data.comment_id);

  if (error) {
    log.error("community.comment.edit_as_owner", error, { scope: "community" });
    return { ok: false, error: "Não consegui salvar." };
  }

  revalidatePath("/community");
  revalidatePath("/feed");
  return { ok: true };
}

export async function deleteCommentAction(formData: FormData): Promise<void> {
  const session = await getCurrentProfile();
  if (!session || session.profile.role !== "owner") return;

  const id = String(formData.get("comment_id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  // RLS allows owner to delete any comment in tenant.
  await supabase.from("community_comments").delete().eq("id", id);

  revalidatePath("/community");
  revalidatePath("/feed");
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
