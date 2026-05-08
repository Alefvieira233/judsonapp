import "server-only";

import { recordConsent } from "@/lib/consent";
import { log } from "@/lib/logger";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { getCurrentTenant } from "@/lib/tenant";
import type { Profile, Tenant } from "@/types/database";

export type Session = { profile: Profile; tenant: Tenant };

/**
 * Returns the authenticated profile for the current request.
 *
 * Owner provisioning rules:
 *   - If a profile already exists, return it as-is.
 *   - If `tenants.owner_user_id` matches the auth user, auto-provision the
 *     owner profile (first login of the pre-pinned owner).
 *   - Otherwise we never auto-create an owner — that closes the auto-provision
 *     back door (any first login becoming owner). Tenants with no owner pin
 *     yet must call `claimTenantOwnerAction` (one-shot, atomic).
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

  if (existing) {
    await enrichSentryUser(existing, tenant);
    return { profile: existing, tenant };
  }

  // Defense in depth: a user that arrived via /invite carries `invite_token` in
  // user_metadata. Their profile is created by /auth/callback through the
  // consume_invite RPC. Never auto-provision an invited user as owner.
  if (user.user_metadata?.invite_token) return null;

  // Bootstrap is gated by `tenants.owner_user_id`. Only the pre-pinned user
  // can become owner via auto-provision. If the pin doesn't match (or isn't
  // set yet), return null so layouts redirect to /login.
  if (tenant.owner_user_id !== user.id) return null;

  const admin = createAdminClient();
  const { data: created, error } = await admin
    .from("profiles")
    .insert({
      id: user.id,
      tenant_id: tenant.id,
      role: "owner",
      full_name:
        (user.user_metadata?.full_name as string | undefined) ?? tenant.name,
      email: user.email ?? null,
    })
    .select("*")
    .single();

  if (error || !created) {
    log.error("auth.provisionOwner", error, {
      scope: "auth",
      tenantId: tenant.id,
      userId: user.id,
    });
    return null;
  }

  // First owner login implies acceptance of the current Terms + Privacy
  // versions linked from /login.
  await recordConsent({
    userId: user.id,
    tenantId: tenant.id,
    context: "owner_login",
  });

  await enrichSentryUser(created, tenant);
  return { profile: created, tenant };
}

/**
 * Tag the current Sentry scope with the resolved user + tenant. Lazy-imports
 * @sentry/nextjs only when a DSN is configured — keeps the import out of the
 * hot path for cliente-zero / dev. Errors here are swallowed: telemetry must
 * never break auth.
 */
async function enrichSentryUser(profile: Profile, tenant: Tenant): Promise<void> {
  if (!process.env.SENTRY_DSN && !process.env.NEXT_PUBLIC_SENTRY_DSN) return;
  try {
    const Sentry = await import("@sentry/nextjs");
    Sentry.setUser({ id: profile.id });
    Sentry.setTag("tenant", tenant.slug);
    Sentry.setTag("tenantId", tenant.id);
  } catch {
    // ignore
  }
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
