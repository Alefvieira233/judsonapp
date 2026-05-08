"use server";

import { headers } from "next/headers";
import { z } from "zod";

import { clientIp, rateLimitAsync } from "@/lib/rate-limit";
import { createClient } from "@/lib/supabase/server";

const otpSchema = z.object({
  token: z.string().min(8),
  email: z.string().trim().email("Email inválido."),
  full_name: z.string().trim().min(2, "Diz teu nome completo."),
  // Accept-or-reject is enforced client-side via the checkbox; here we just
  // require it. The actual `consents` row is recorded inside /auth/callback
  // once we know auth.uid() (LGPD evidence is bound to the authenticated user).
  accept_terms: z.literal("1", {
    error: "Você precisa aceitar os Termos e a Política pra continuar.",
  }),
});

export type OtpState =
  | { ok: true; email: string }
  | { ok: false; error: string }
  | undefined;

async function buildOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function requestInviteOtpAction(
  _prev: OtpState,
  formData: FormData,
): Promise<OtpState> {
  const parsed = otpSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  // Rate-limit: 5 OTPs per hour per email + 10 per hour per IP.
  // Uses Upstash Redis when configured (UPSTASH_REDIS_REST_URL/TOKEN), falls
  // back to in-memory otherwise — see src/lib/rate-limit.ts.
  const ip = await clientIp();
  const HOUR = 60 * 60 * 1000;
  if (!(await rateLimitAsync(`invite:email:${parsed.data.email}`, 5, HOUR)).ok) {
    return { ok: false, error: "Muitas tentativas com esse email. Aguarde uma hora." };
  }
  if (!(await rateLimitAsync(`invite:ip:${ip}`, 10, HOUR)).ok) {
    return { ok: false, error: "Muitas tentativas. Tenta de novo daqui a uma hora." };
  }

  const supabase = await createClient();

  // Re-validate the invite at submit time to avoid race conditions.
  const { data: invite } = await supabase
    .from("invites")
    .select("id, tenant_id, used_at, expires_at")
    .eq("token", parsed.data.token)
    .maybeSingle();

  if (!invite) return { ok: false, error: "Link inválido." };
  if (invite.used_at) return { ok: false, error: "Esse link já foi usado." };
  if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
    return { ok: false, error: "Esse link expirou. Pede um novo." };
  }

  const origin = await buildOrigin();
  const redirect = new URL(`${origin}/auth/callback`);
  redirect.searchParams.set("next", "/home");
  redirect.searchParams.set("invite", parsed.data.token);
  redirect.searchParams.set("name", parsed.data.full_name);

  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: redirect.toString(),
      data: {
        full_name: parsed.data.full_name,
        invite_token: parsed.data.token,
      },
    },
  });

  if (error) {
    console.error("[invite.signInWithOtp]", error);
    return { ok: false, error: "Não consegui mandar o email. Tenta de novo." };
  }

  return { ok: true, email: parsed.data.email };
}
