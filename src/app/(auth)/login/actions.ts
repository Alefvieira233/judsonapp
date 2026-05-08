"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createAdminClient, createClient } from "@/lib/supabase/server";
import { getCurrentTenant } from "@/lib/tenant";

const loginSchema = z.object({
  email: z.string().email("Email inválido."),
  password: z.string().min(6, "Senha precisa ter pelo menos 6 caracteres."),
  next: z.string().optional(),
});

export type LoginState = { error?: string } | undefined;

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: "Email ou senha incorretos." };
  }

  redirect(parsed.data.next || "/dashboard");
}

export type ClaimState = { ok?: boolean; error?: string } | undefined;

/**
 * One-shot claim: the first authenticated user to call this on a tenant
 * without `owner_user_id` becomes the owner. Atomic via a conditional UPDATE
 * (only succeeds when owner_user_id is null). After this, the regular
 * getCurrentProfile bootstrap takes over on the next request.
 */
export async function claimTenantOwnerAction(
  _prev: ClaimState,
): Promise<ClaimState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Faça login primeiro." };

  const tenant = await getCurrentTenant();
  if (!tenant) return { error: "Tenant não identificado." };
  if (tenant.owner_user_id) return { error: "Tenant já tem dono." };

  const admin = createAdminClient();
  const { data: claimed, error } = await admin
    .from("tenants")
    .update({ owner_user_id: user.id })
    .eq("id", tenant.id)
    .is("owner_user_id", null)
    .select("id")
    .maybeSingle();

  if (error || !claimed) {
    return { error: "Não foi possível reivindicar o tenant." };
  }
  return { ok: true };
}
