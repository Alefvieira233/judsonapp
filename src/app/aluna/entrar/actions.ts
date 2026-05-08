"use server";

import { headers } from "next/headers";
import { z } from "zod";

import { log } from "@/lib/logger";
import { clientIp, rateLimitAsync } from "@/lib/rate-limit";
import { createClient } from "@/lib/supabase/server";

const otpSchema = z.object({
  email: z.string().trim().email("Email inválido."),
});

export type StudentLoginState =
  | { ok: true; email: string }
  | { ok: false; error: string }
  | undefined;

async function buildOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto =
    h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function requestStudentMagicLinkAction(
  _prev: StudentLoginState,
  formData: FormData,
): Promise<StudentLoginState> {
  const parsed = otpSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  // Rate-limit: 5 magic links per hour per email + 15 per hour per IP.
  const ip = await clientIp();
  const HOUR = 60 * 60 * 1000;
  if (!(await rateLimitAsync(`student-login:email:${parsed.data.email}`, 5, HOUR)).ok) {
    return {
      ok: false,
      error: "Muitas tentativas com esse email. Aguarde uma hora pra tentar de novo.",
    };
  }
  if (!(await rateLimitAsync(`student-login:ip:${ip}`, 15, HOUR)).ok) {
    return { ok: false, error: "Muitas tentativas. Tenta de novo daqui a pouco." };
  }

  const supabase = await createClient();
  const origin = await buildOrigin();
  const redirect = new URL(`${origin}/auth/callback`);
  redirect.searchParams.set("next", "/home");

  // shouldCreateUser:false — only existing alunas can pass. New ones must use
  // the personal's invite link.
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: redirect.toString(),
    },
  });

  if (error) {
    // Generic message — don't leak whether the email exists.
    log.error("aluna.entrar.signInWithOtp", error, { scope: "aluna.entrar" });
    return {
      ok: false,
      error: "Não consegui mandar o email. Confere se é o mesmo que tu usou no convite.",
    };
  }

  return { ok: true, email: parsed.data.email };
}
