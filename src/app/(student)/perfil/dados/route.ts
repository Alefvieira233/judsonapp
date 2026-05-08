// LGPD-9: portabilidade de dados (art. 18, V).
// Endpoint privado (autenticado como aluna) que retorna um JSON com tudo
// que tratamos sobre a usuária. Forçamos download como attachment pra
// quando ela abrir no celular já cair direto em "salvar arquivo".

import { NextResponse } from "next/server";

import { LGPD_POLICY_VERSION, LGPD_TERMS_VERSION, recordConsent } from "@/lib/consent";
import { getCurrentStudent } from "@/lib/auth";
import { createAdminClient, createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getCurrentStudent();
  if (!session) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }
  const { profile, tenant } = session;
  const supabase = await createClient();
  const admin = createAdminClient();

  // Read everything the student can see plus consent log (admin needed).
  const [logsRes, exerciseLogsRes, postsRes, commentsRes, reactionsRes, referralsRes, plansRes, consentsRes] =
    await Promise.all([
      supabase
        .from("workout_logs")
        .select("*")
        .eq("student_id", profile.id)
        .order("started_at", { ascending: false }),
      supabase
        .from("exercise_logs")
        .select("*, workout_log:workout_logs!inner(student_id)")
        .eq("workout_log.student_id", profile.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("community_posts")
        .select("*")
        .eq("author_id", profile.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("community_comments")
        .select("*")
        .eq("user_id", profile.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("community_reactions")
        .select("*")
        .eq("user_id", profile.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("referrals")
        .select("*")
        .or(`referrer_id.eq.${profile.id},referred_id.eq.${profile.id}`)
        .order("created_at", { ascending: false }),
      profile.current_plan_id
        ? supabase
            .from("plans")
            .select("*")
            .eq("id", profile.current_plan_id)
            .maybeSingle()
        : Promise.resolve({ data: null }),
      admin
        .from("consents")
        .select("*")
        .eq("user_id", profile.id)
        .order("accepted_at", { ascending: false }),
    ]);

  const payload = {
    exported_at: new Date().toISOString(),
    policy_version: LGPD_POLICY_VERSION,
    terms_version: LGPD_TERMS_VERSION,
    controller: {
      name: tenant.name,
      tenant_slug: tenant.slug,
    },
    profile,
    consents: consentsRes.data ?? [],
    workout_logs: logsRes.data ?? [],
    exercise_logs: exerciseLogsRes.data ?? [],
    community_posts: postsRes.data ?? [],
    community_comments: commentsRes.data ?? [],
    community_reactions: reactionsRes.data ?? [],
    referrals: referralsRes.data ?? [],
    current_plan: plansRes.data,
  };

  // Audit the export request as a self-service consent action.
  await recordConsent({
    userId: profile.id,
    tenantId: tenant.id,
    context: "self_service",
  });

  const filename = `judsonapp-meus-dados-${profile.id}-${new Date().toISOString().slice(0, 10)}.json`;
  return new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": `attachment; filename="${filename}"`,
      "cache-control": "no-store",
    },
  });
}
