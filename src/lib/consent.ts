import "server-only";

import { headers } from "next/headers";

import { createAdminClient } from "@/lib/supabase/server";
import { clientIp } from "@/lib/rate-limit";

// Bumped together whenever /termos or /privacidade changes materially.
// Keep these in sync with the page footers.
export const LGPD_POLICY_VERSION = "2026-05-07";
export const LGPD_TERMS_VERSION = "2026-05-07";

export type ConsentContext =
  | "invite"
  | "student_login"
  | "owner_login"
  | "self_service";

/**
 * Records a user's acceptance of the current Terms + Privacy versions.
 * Server-only; the table has no INSERT policy for authenticated users so
 * the entry can be trusted as evidence of consent.
 */
export async function recordConsent({
  userId,
  tenantId,
  context,
}: {
  userId: string;
  tenantId: string | null;
  context: ConsentContext;
}): Promise<void> {
  const admin = createAdminClient();
  const h = await headers();
  const ip = await clientIp();
  const ua = h.get("user-agent") ?? null;

  const { error } = await admin.from("consents").insert({
    user_id: userId,
    tenant_id: tenantId,
    policy_version: LGPD_POLICY_VERSION,
    terms_version: LGPD_TERMS_VERSION,
    ip,
    user_agent: ua,
    context,
  });

  if (error) {
    console.error("[consent.record] failed:", error);
  }
}
