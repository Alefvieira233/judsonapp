import "server-only";

import { recordConsent } from "@/lib/consent";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { getCurrentTenant } from "@/lib/tenant";
import type { Profile, Tenant } from "@/types/database";

export type Session = { profile: Profile; tenant: Tenant };

/**
 * Returns the authenticated profile for the current request.
 * Side-effect: on first login of the personal trainer, auto-provisions the
 * owner profile linked to the cliente-zero tenant. This avoids forcing the
 * user to run extra SQL after creating their auth user in Supabase.
 */
export async function getCurrentProfile(): Promise<Session | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const tenant = await getCurrentTenant();
  if (!tenant) return null;

  const { data: existing } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (existing) return { profile: existing, tenant };

  // Defense in depth: a user that arrived via /invite carries `invite_token` in
  // user_metadata. Their profile is created by /auth/callback through the
  // consume_invite RPC. Never auto-provision an invited user as owner.
  if (user.user_metadata?.invite_token) return null;

  // First sign-in of the personal trainer: bootstrap the owner profile on the
  // cliente-zero tenant. Done via service-role client because this is a
  // privileged operation — the user has no profile yet, so RLS context based
  // on auth_tenant_id() / auth_role() can't grant them access until the row
  // exists.
  const admin = createAdminClient();
  const { data: created, error } = await admin
    .from("profiles")
    .insert({
      id: user.id,
      tenant_id: tenant.id,
      role: "owner",
      full_name: (user.user_metadata?.full_name as string | undefined) ?? tenant.name,
      email: user.email ?? null,
    })
    .select("*")
    .single();

  if (error || !created) {
    console.error("[auth] failed to provision owner profile:", error);
    return null;
  }

  // First owner login is implicit consent to the current Terms + Privacy
  // versions. The /login page links both — a checkbox would create login
  // friction for the personal trainer (1 user). Re-evaluate when SaaS launches
  // and /login is reachable by anyone.
  await recordConsent({
    userId: user.id,
    tenantId: tenant.id,
    context: "owner_login",
  });

  return { profile: created, tenant };
}

/**
 * Authenticated student session for the (student) route group. Returns null
 * if there is no auth, no profile, or the profile is not a student. Never
 * auto-provisions — student profiles are created by /auth/callback only.
 */
export async function getCurrentStudent(): Promise<Session | null> {
  const session = await getCurrentProfile();
  if (!session) return null;
  if (session.profile.role !== "student") return null;
  return session;
}
