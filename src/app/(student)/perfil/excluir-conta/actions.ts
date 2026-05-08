"use server";

import { redirect } from "next/navigation";

import { recordConsent } from "@/lib/consent";
import { getCurrentStudent } from "@/lib/auth";
import { createAdminClient, createClient } from "@/lib/supabase/server";

/**
 * LGPD-4 — eliminação self-service (art. 18, VI).
 *
 * Soft-delete: marca o profile inativo, anonimiza nome/email/telefone com
 * hash determinístico (mantém integridade de FKs em workout_logs etc) e
 * deleta o usuário em auth.users. Logs de treino ficam no banco como
 * dados pseudonimizados — o personal continua tendo histórico agregado.
 */
export async function deleteOwnAccountAction(): Promise<void> {
  const session = await getCurrentStudent();
  if (!session) {
    redirect("/aluna/entrar");
  }
  const { profile, tenant } = session;

  const admin = createAdminClient();
  const anonId = profile.id.replace(/-/g, "").slice(0, 8);

  // 1. Anonymize the profile row (defense: don't rely on cascade — keep the
  //    row so workout_logs, posts, comments retain referential integrity).
  await admin
    .from("profiles")
    .update({
      full_name: `Aluna #${anonId}`,
      email: null,
      phone: null,
      goal: null,
      observations: null,
      avatar_url: null,
      birthdate: null,
      active: false,
    })
    .eq("id", profile.id);

  // 2. Soft-delete community content the user wrote. Posts and comments are
  //    visible to other students; pseudonymizing the author isn't enough,
  //    we need to clear the content itself.
  await admin
    .from("community_posts")
    .update({ content: "[conteúdo removido pela autora]", media_url: null, media_type: null })
    .eq("author_id", profile.id);
  await admin
    .from("community_comments")
    .update({ content: "[comentário removido pela autora]" })
    .eq("user_id", profile.id);

  // 3. Audit log via consent context (a deletion is itself a consent action).
  await recordConsent({
    userId: profile.id,
    tenantId: tenant.id,
    context: "self_service",
  });

  // 4. Sign out current session.
  const supabase = await createClient();
  await supabase.auth.signOut();

  // 5. Delete the auth user (this also kills any active sessions).
  await admin.auth.admin.deleteUser(profile.id);

  redirect("/aluna/entrar?deleted=1");
}
