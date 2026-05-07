import { NextResponse, type NextRequest } from "next/server";

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
    console.error("[auth.callback] exchangeCodeForSession failed:", exchangeError);
    const target = inviteToken
      ? new URL(`/invite/${inviteToken}?error=sign_in_failed`, url.origin)
      : new URL("/login?error=sign_in_failed", url.origin);
    return NextResponse.redirect(target);
  }

  if (inviteToken) {
    const { error: rpcError } = await supabase.rpc("consume_invite", {
      p_token: inviteToken,
      p_user_id: data.user.id,
      p_name: name,
      p_email: data.user.email ?? "",
    });

    if (rpcError) {
      const reason = mapInviteError((rpcError as PostgrestErrorWithCode).code);
      console.error("[auth.callback] consume_invite failed:", rpcError);
      return NextResponse.redirect(
        new URL(`/invite/${inviteToken}?error=${reason}`, url.origin),
      );
    }
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
