"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

// Reactions vocabulary — keep aligned with the icons in post-card.tsx.
// Adding a new one: also bump emoji set + button row + post-card filter.
export const REACTION_KINDS = ["like", "fire", "heart", "muscle", "clap"] as const;
export type ReactionKind = (typeof REACTION_KINDS)[number];

const reactSchema = z.object({
  post_id: z.string().uuid(),
  reaction: z.enum(REACTION_KINDS).default("like"),
});

const commentSchema = z.object({
  post_id: z.string().uuid(),
  content: z.string().trim().min(1, "Escreva alguma coisa.").max(500, "Comentário longo demais."),
});

export async function addCommentAction(
  input: z.infer<typeof commentSchema>,
): Promise<{ ok: boolean; error?: string }> {
  const session = await getCurrentProfile();
  if (!session) return { ok: false, error: "Sessão expirada." };

  const parsed = commentSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();

  // Confirm the post belongs to this tenant before commenting.
  const { data: post } = await supabase
    .from("community_posts")
    .select("id")
    .eq("id", parsed.data.post_id)
    .eq("tenant_id", session.tenant.id)
    .maybeSingle();
  if (!post) return { ok: false, error: "Post não encontrado." };

  const { error } = await supabase.from("community_comments").insert({
    post_id: parsed.data.post_id,
    user_id: session.profile.id,
    content: parsed.data.content,
  });
  if (error) {
    console.error("[feed.comment.create]", error);
    return { ok: false, error: "Não consegui publicar." };
  }

  revalidatePath("/feed");
  revalidatePath("/community");
  return { ok: true };
}

export async function deleteCommentAction(
  input: { comment_id: string },
): Promise<{ ok: boolean; error?: string }> {
  const session = await getCurrentProfile();
  if (!session) return { ok: false, error: "Sessão expirada." };

  const id = input.comment_id;
  if (!id || typeof id !== "string") return { ok: false, error: "Dados inválidos." };

  const supabase = await createClient();
  // RLS allows owner OR author to delete (community_comments_self_delete).
  const { error } = await supabase.from("community_comments").delete().eq("id", id);
  if (error) {
    console.error("[feed.comment.delete]", error);
    return { ok: false, error: "Não consegui apagar." };
  }
  revalidatePath("/feed");
  revalidatePath("/community");
  return { ok: true };
}

export async function toggleReactionAction(
  input: z.infer<typeof reactSchema>,
): Promise<{ ok: boolean; reacted: boolean; error?: string }> {
  const session = await getCurrentProfile();
  if (!session) return { ok: false, reacted: false, error: "Sessão expirada." };

  const parsed = reactSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, reacted: false, error: "Dados inválidos." };
  }

  const supabase = await createClient();

  // Confirm post belongs to this tenant before reacting (defense vs ID guessing).
  const { data: post } = await supabase
    .from("community_posts")
    .select("id")
    .eq("id", parsed.data.post_id)
    .eq("tenant_id", session.tenant.id)
    .maybeSingle();
  if (!post) return { ok: false, reacted: false, error: "Post não encontrado." };

  const { data: existing } = await supabase
    .from("community_reactions")
    .select("id")
    .eq("post_id", parsed.data.post_id)
    .eq("user_id", session.profile.id)
    .eq("reaction", parsed.data.reaction)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("community_reactions")
      .delete()
      .eq("id", existing.id);
    if (error) {
      console.error("[feed.react.delete]", error);
      return { ok: false, reacted: true, error: "Não consegui salvar." };
    }
    revalidatePath("/feed");
    revalidatePath("/community");
    return { ok: true, reacted: false };
  }

  const { error } = await supabase.from("community_reactions").insert({
    post_id: parsed.data.post_id,
    user_id: session.profile.id,
    reaction: parsed.data.reaction,
  });
  if (error) {
    console.error("[feed.react.insert]", error);
    return { ok: false, reacted: false, error: "Não consegui salvar." };
  }
  revalidatePath("/feed");
  revalidatePath("/community");
  return { ok: true, reacted: true };
}
