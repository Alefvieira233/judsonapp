import "server-only";

import { headers } from "next/headers";

import { clientIp } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database";

type LogActionInput = {
  tenantId: string | null;
  actorId: string | null;
  action: string;
  targetType?: string | null;
  targetId?: string | null;
  metadata?: Record<string, unknown>;
};

/**
 * Server-only audit log writer. Use for sensitive actions that touch another
 * student's data or change tenant-wide state (createStudentDirectAction,
 * delete plan, delete post, etc.). Failures are swallowed and logged — audit
 * must never block the user-facing action.
 */
export async function logAction(input: LogActionInput): Promise<void> {
  try {
    const admin = createAdminClient();
    let ua: string | null = null;
    try {
      const h = await headers();
      ua = h.get("user-agent");
    } catch {
      // Outside request scope — fine, just persist null.
    }
    const ip = await clientIp().catch(() => "unknown");

    const { error } = await admin.from("audit_log").insert({
      tenant_id: input.tenantId,
      actor_user_id: input.actorId,
      action: input.action,
      target_type: input.targetType ?? null,
      target_id: input.targetId ?? null,
      metadata: (input.metadata ?? {}) as Json,
      ip,
      user_agent: ua,
    });
    if (error) console.error("[audit] insert failed:", error);
  } catch (err) {
    console.error("[audit] log failed:", err);
  }
}
