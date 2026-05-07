import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/dashboard";
  const inviteToken = url.searchParams.get("invite");
  const fullNameFromInvite = url.searchParams.get("name");

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_code", url.origin));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error("[auth.callback] exchange error", error);
    return NextResponse.redirect(new URL("/login?error=exchange_failed", url.origin));
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL("/login?error=no_user", url.origin));
  }

  // Student onboarding via invite link.
  if (inviteToken) {
    const { data: invite } = await supabase
      .from("invites")
      .select("id, tenant_id, used_at, expires_at, full_name")
      .eq("token", inviteToken)
      .maybeSingle();

    if (
      invite &&
      !invite.used_at &&
      (!invite.expires_at || new Date(invite.expires_at) > new Date())
    ) {
      // Provision the student profile if it does not exist yet.
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (!existing) {
        await supabase.from("profiles").insert({
          id: user.id,
          tenant_id: invite.tenant_id,
          role: "student",
          full_name:
            fullNameFromInvite ?? invite.full_name ?? user.email ?? "Aluna",
          email: user.email ?? null,
        });
      }

      // Mark the invite as used (idempotent).
      await supabase
        .from("invites")
        .update({ used_at: new Date().toISOString() })
        .eq("id", invite.id);
    }
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
