"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const reactSchema = z.object({
  post_id: z.string().uuid(),
  reaction: z.enum(["like"]).default("like"),
});

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
