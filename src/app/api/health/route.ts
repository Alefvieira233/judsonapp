import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Health check for uptime monitors. Pings the database via the admin client
 * (so it doesn't depend on a user session). Returns:
 *   200 { status: "ok" }    — app + DB reachable
 *   503 { status: "degraded", error }  — DB unreachable
 */
export async function GET() {
  try {
    const admin = createAdminClient();
    const { error } = await admin.from("tenants").select("id").limit(1);
    if (error) {
      return NextResponse.json(
        { status: "degraded", error: error.message },
        { status: 503 },
      );
    }
    return NextResponse.json({ status: "ok", at: new Date().toISOString() });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json(
      { status: "degraded", error: message },
      { status: 503 },
    );
  }
}
