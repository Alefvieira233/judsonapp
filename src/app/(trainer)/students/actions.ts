"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getCurrentProfile } from "@/lib/auth";
import { createAdminClient, createClient } from "@/lib/supabase/server";

const inviteSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, "Nome muito curto.")
    .max(80, "Nome muito longo.")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  email: z
    .string()
    .trim()
    .email("Email inválido.")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  phone: z
    .string()
    .trim()
    .max(20)
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export type InviteState =
  | { ok: true; url: string; token: string }
  | { ok: false; error: string }
  | undefined;

async function buildOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function createInviteAction(
  _prev: InviteState,
  formData: FormData,
): Promise<InviteState> {
  const session = await getCurrentProfile();
  if (!session) return { ok: false, error: "Sessão expirada." };
  if (session.profile.role !== "owner") {
    return { ok: false, error: "Apenas o personal pode convidar." };
  }

  const parsed = inviteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invites")
    .insert({
      tenant_id: session.tenant.id,
      full_name: parsed.data.full_name ?? null,
      email: parsed.data.email ?? null,
      phone: parsed.data.phone ?? null,
    })
    .select("token")
    .single();

  if (error || !data) {
    console.error("[students.createInvite]", error);
    return { ok: false, error: "Não consegui gerar o convite. Tenta de novo." };
  }

  const origin = await buildOrigin();
  revalidatePath("/students");
  return { ok: true, token: data.token, url: `${origin}/invite/${data.token}` };
}

const updateStudentSchema = z.object({
  id: z.string().uuid(),
  full_name: z.string().trim().min(2, "Nome muito curto.").max(80),
  goal: z.string().trim().max(200).optional().or(z.literal("").transform(() => undefined)),
  observations: z.string().trim().max(1000).optional().or(z.literal("").transform(() => undefined)),
  active: z.string().optional(),
});

export type UpdateStudentState = { ok?: boolean; error?: string } | undefined;

export async function updateStudentAction(
  _prev: UpdateStudentState,
  formData: FormData,
): Promise<UpdateStudentState> {
  const session = await getCurrentProfile();
  if (!session || session.profile.role !== "owner") {
    return { error: "Sem permissão." };
  }

  const parsed = updateStudentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.full_name,
      goal: parsed.data.goal ?? null,
      observations: parsed.data.observations ?? null,
      active: parsed.data.active === "on",
    })
    .eq("id", parsed.data.id)
    .eq("tenant_id", session.tenant.id)
    .eq("role", "student");

  if (error) {
    console.error("[students.update]", error);
    return { error: "Não consegui salvar. Tenta de novo." };
  }

  revalidatePath("/students");
  revalidatePath(`/students/${parsed.data.id}`);
  return { ok: true };
}

const referralSchema = z.object({
  referrer_id: z.string().uuid(),
  referred_id: z.string().uuid(),
});

export async function createReferralAction(
  input: { referred_id: string; referrer_id: string },
): Promise<{ ok: boolean; error?: string }> {
  const session = await getCurrentProfile();
  if (!session || session.profile.role !== "owner") {
    return { ok: false, error: "Sem permissão." };
  }
  const parsed = referralSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Dados inválidos." };
  }
  if (parsed.data.referrer_id === parsed.data.referred_id) {
    return { ok: false, error: "Aluna não pode indicar a si mesma." };
  }

  // Use admin client to bypass the read policy when checking own-tenant
  // membership of both profiles (owner can read tenant via auth_role).
  const admin = createAdminClient();
  const { error } = await admin.from("referrals").insert({
    tenant_id: session.tenant.id,
    referrer_id: parsed.data.referrer_id,
    referred_id: parsed.data.referred_id,
    status: "active",
  });
  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "Essa aluna já tem indicação registrada." };
    }
    console.error("[students.referral.create]", error);
    return { ok: false, error: "Não consegui registrar a indicação." };
  }
  revalidatePath(`/students/${parsed.data.referred_id}`);
  revalidatePath(`/students/${parsed.data.referrer_id}`);
  return { ok: true };
}

const rewardSchema = z.object({
  referral_id: z.string().uuid(),
  reward_label: z
    .string()
    .trim()
    .min(2, "Descreva o bônus.")
    .max(120),
});

export async function rewardReferralAction(
  input: z.infer<typeof rewardSchema>,
): Promise<{ ok: boolean; error?: string }> {
  const session = await getCurrentProfile();
  if (!session || session.profile.role !== "owner") {
    return { ok: false, error: "Sem permissão." };
  }
  const parsed = rewardSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("referrals")
    .update({
      status: "rewarded",
      reward_label: parsed.data.reward_label,
      rewarded_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.referral_id)
    .eq("tenant_id", session.tenant.id);
  if (error) {
    console.error("[students.referral.reward]", error);
    return { ok: false, error: "Não consegui salvar." };
  }
  revalidatePath("/students");
  return { ok: true };
}

export async function deleteReferralAction(formData: FormData): Promise<void> {
  const session = await getCurrentProfile();
  if (!session || session.profile.role !== "owner") return;
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const supabase = await createClient();
  await supabase
    .from("referrals")
    .delete()
    .eq("id", id)
    .eq("tenant_id", session.tenant.id);
  revalidatePath("/students");
}
