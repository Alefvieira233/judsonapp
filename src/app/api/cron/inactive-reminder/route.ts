import { NextResponse } from "next/server";

import { notifyInactiveStudentsCron } from "@/app/(trainer)/_actions/push";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = request.headers.get("authorization") ?? "";
  return header === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const stats = await notifyInactiveStudentsCron();
  return NextResponse.json({ ok: true, ...stats });
}

export async function POST(request: Request) {
  return GET(request);
}
