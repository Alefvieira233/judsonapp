import { NextResponse } from "next/server";

import { log } from "@/lib/logger";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type CheckResult = "ok" | "down";
type Checks = { db: CheckResult; auth: CheckResult; storage: CheckResult };

const CHECK_TIMEOUT_MS = 5_000;

/** Race a promise against a timeout. Returns "down" if the check throws or
 *  exceeds the budget — health checks must never themselves hang. */
async function withTimeout(
  name: string,
  fn: () => Promise<void>,
): Promise<CheckResult> {
  try {
    await Promise.race([
      fn(),
      new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error(`${name} check timed out`)),
          CHECK_TIMEOUT_MS,
        ),
      ),
    ]);
    return "ok";
  } catch (err) {
    log.warn(`health.check.${name} failed`, { scope: "health", check: name, error: serialize(err) });
    return "down";
  }
}

function serialize(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

/**
 * Health check for uptime monitors and post-deploy canaries.
 *
 *   200 { status: "ok",       checks: { db, auth, storage }, ... }
 *   503 { status: "down",     checks: { db, auth, storage }, ... }
 *
 * Each check has a 5s timeout. We deliberately use the admin client so
 * cookies / sessions don't interfere — we're testing infrastructure, not
 * any specific user.
 */
export async function GET() {
  const admin = createAdminClient();

  const [db, auth, storage] = await Promise.all([
    withTimeout("db", async () => {
      const { error } = await admin.from("tenants").select("id").limit(1);
      if (error) throw new Error(error.message);
    }),
    withTimeout("auth", async () => {
      // Calling getUser with an empty session must succeed (returning a null
      // user) — that proves the auth API is reachable. An exception or HTTP
      // error means GoTrue is down.
      const { error } = await admin.auth.getUser();
      // GoTrue returns AuthSessionMissingError on empty token — that's the
      // expected "no user" signal, not an outage.
      if (error && error.name !== "AuthSessionMissingError") {
        throw new Error(error.message);
      }
    }),
    withTimeout("storage", async () => {
      const { error } = await admin.storage
        .from("tenant-assets")
        .list(undefined, { limit: 1 });
      if (error) throw new Error(error.message);
    }),
  ]);

  const checks: Checks = { db, auth, storage };
  const allOk = db === "ok" && auth === "ok" && storage === "ok";

  const body = {
    status: allOk ? "ok" : "down",
    checks,
    version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "dev",
    region: process.env.VERCEL_REGION ?? "local",
    ts: new Date().toISOString(),
  };

  return NextResponse.json(body, { status: allOk ? 200 : 503 });
}
