import { NextResponse, type NextRequest } from "next/server";

import { recordConsent } from "@/lib/consent";
import { log } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";

type PostgrestErrorWithCode = { code?: string | null };

function mapInviteError(code: string | null | undefined): string {
  switch (code) {
    case "P0002":
      return "invite_not_found";
    case "P0003":
      return "invite_already_used";
    case "P0004":
      return "invite_expired";
    case "P0005":
      return "sign_in_failed";
    default:
      return "invite_failed";
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/welcome";
  const inviteToken = url.searchParams.get("invite");
  const name = url.searchParams.get("name") ?? "";

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_code", url.origin));
  }

  const supabase = await createClient();
  const { data, error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError || !data?.user) {
    log.error("auth.callback.exchange", exchangeError, { scope: "auth.callback" });
    const target = inviteToken
      ? new URL(`/invite/${inviteToken}?error=sign_in_failed`, url.origin)
      : new URL("/login?error=sign_in_failed", url.origin);
    return NextResponse.redirect(target);
  }

  if (inviteToken) {
    // RPC reads `auth.uid()` and `auth.users.email` server-side — the route
    // only forwards the token + name (display only). See migration 0010.
    const { error: rpcError } = await supabase.rpc("consume_invite", {
      p_token: inviteToken,
      p_name: name,
    });

    if (rpcError) {
      const reason = mapInviteError((rpcError as PostgrestErrorWithCode).code);
      log.error("auth.callback.consumeInvite", rpcError, { scope: "auth.callback", reason, userId: data.user.id });
      return NextResponse.redirect(
        new URL(`/invite/${inviteToken}?error=${reason}`, url.origin),
      );
    }

    // LGPD evidence: the user accepted Terms+Privacy on the /invite form a
    // few seconds ago — record it now that we know auth.uid().
    const { data: profile } = await supabase
      .from("profiles")
      .select("tenant_id")
      .eq("id", data.user.id)
      .maybeSingle();
    await recordConsent({
      userId: data.user.id,
      tenantId: profile?.tenant_id ?? null,
      context: "invite",
    });
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
