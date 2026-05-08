import { NextResponse } from "next/server";

import { log } from "@/lib/logger";
import {
  computeStrengthScoreByMuscle,
  strengthScoresToColumns,
} from "@/lib/strength-score";
import { createAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = request.headers.get("authorization") ?? "";
  return header === `Bearer ${secret}`;
}

function todayDateString(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const snapshotDate = todayDateString();

  const { data: students, error } = await admin
    .from("profiles")
    .select("id, tenant_id")
    .eq("role", "student")
    .eq("active", true);

  if (error) {
    log.error("cron.strength-snapshot.list", error, { scope: "cron" });
    return NextResponse.json({ error: "list_failed" }, { status: 500 });
  }
  if (!students || students.length === 0) {
    return NextResponse.json({ ok: true, snapshotted: 0, snapshot_date: snapshotDate });
  }

  let snapshotted = 0;
  let failed = 0;

  for (const s of students) {
    if (!s.tenant_id) continue;
    try {
      const scores = await computeStrengthScoreByMuscle({
        userId: s.id,
        supabase: admin,
      });
      const { error: upsertErr } = await admin
        .from("strength_snapshots")
        .upsert(
          {
            tenant_id: s.tenant_id,
            user_id: s.id,
            snapshot_date: snapshotDate,
            ...strengthScoresToColumns(scores),
          },
          { onConflict: "user_id,snapshot_date" },
        );
      if (upsertErr) {
        failed += 1;
        log.error("cron.strength-snapshot.upsert", upsertErr, {
          scope: "cron",
          userId: s.id,
        });
      } else {
        snapshotted += 1;
      }
    } catch (err) {
      failed += 1;
      log.error("cron.strength-snapshot.compute", err, {
        scope: "cron",
        userId: s.id,
      });
    }
  }

  log.info("cron.strength-snapshot.done", {
    scope: "cron",
    snapshotted,
    failed,
    snapshot_date: snapshotDate,
  });

  return NextResponse.json({
    ok: true,
    snapshotted,
    failed,
    snapshot_date: snapshotDate,
  });
}

export async function POST(request: Request) {
  return GET(request);
}
