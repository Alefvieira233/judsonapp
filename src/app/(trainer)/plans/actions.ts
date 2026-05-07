"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const planSchema = z.object({
  name: z.string().trim().min(2, "Nome muito curto.").max(80),
  tagline: z.string().trim().max(140).optional().or(z.literal("").transform(() => undefined)),
  description: z.string().trim().max(2000).optional().or(z.literal("").transform(() => undefined)),
  price_label: z.string().trim().max(40).optional().or(z.literal("").transform(() => undefined)),
  features: z.string().max(2000).optional().or(z.literal("").transform(() => undefined)),
  cta_label: z.string().trim().max(40).optional().or(z.literal("").transform(() => undefined)),
  highlight: z.string().optional(),
  display_order: z.string().optional(),
  active: z.string().optional(),
});

function parseFeatures(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 30);
}

export type PlanFormState = { ok?: boolean; error?: string } | undefined;

export async function createPlanAction(
  _prev: PlanFormState,
  formData: FormData,
): Promise<PlanFormState> {
  const session = await getCurrentProfile();
  if (!session || session.profile.role !== "owner") {
    return { error: "Sem permissão." };
  }
  const parsed = planSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("plans").insert({
    tenant_id: session.tenant.id,
    name: parsed.data.name,
    tagline: parsed.data.tagline ?? null,
    description: parsed.data.description ?? null,
    price_label: parsed.data.price_label ?? null,
    features: parseFeatures(parsed.data.features),
    cta_label: parsed.data.cta_label ?? "Quero esse plano",
    highlight: parsed.data.highlight === "on",
    display_order: Number.parseInt(parsed.data.display_order ?? "0", 10) || 0,
    active: parsed.data.active === "on",
  });
  if (error) {
    console.error("[plans.create]", error);
    return { error: "Não consegui criar. Tenta de novo." };
  }
  revalidatePath("/plans");
  redirect("/plans");
}

export async function updatePlanAction(
  id: string,
  _prev: PlanFormState,
  formData: FormData,
): Promise<PlanFormState> {
  const session = await getCurrentProfile();
  if (!session || session.profile.role !== "owner") {
    return { error: "Sem permissão." };
  }
  const parsed = planSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("plans")
    .update({
      name: parsed.data.name,
      tagline: parsed.data.tagline ?? null,
      description: parsed.data.description ?? null,
      price_label: parsed.data.price_label ?? null,
      features: parseFeatures(parsed.data.features),
      cta_label: parsed.data.cta_label ?? "Quero esse plano",
      highlight: parsed.data.highlight === "on",
      display_order: Number.parseInt(parsed.data.display_order ?? "0", 10) || 0,
      active: parsed.data.active === "on",
    })
    .eq("id", id)
    .eq("tenant_id", session.tenant.id);
  if (error) {
    console.error("[plans.update]", error);
    return { error: "Não consegui salvar. Tenta de novo." };
  }
  revalidatePath("/plans");
  revalidatePath(`/plans/${id}`);
  return { ok: true };
}

export async function deletePlanAction(formData: FormData): Promise<void> {
  const session = await getCurrentProfile();
  if (!session || session.profile.role !== "owner") return;
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("plans").delete().eq("id", id).eq("tenant_id", session.tenant.id);
  revalidatePath("/plans");
  redirect("/plans");
}

const assignSchema = z.object({
  student_id: z.string().uuid(),
  plan_id: z.string().uuid().nullable().or(z.literal("")),
});

export async function assignPlanToStudentAction(
  studentId: string,
  formData: FormData,
): Promise<{ ok: boolean; error?: string }> {
  const session = await getCurrentProfile();
  if (!session || session.profile.role !== "owner") {
    return { ok: false, error: "Sem permissão." };
  }
  const planId = String(formData.get("plan_id") ?? "");
  const parsed = assignSchema.safeParse({
    student_id: studentId,
    plan_id: planId === "" ? null : planId,
  });
  if (!parsed.success) {
    return { ok: false, error: "Dados inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ current_plan_id: parsed.data.plan_id || null })
    .eq("id", studentId)
    .eq("tenant_id", session.tenant.id)
    .eq("role", "student");
  if (error) {
    console.error("[plans.assign]", error);
    return { ok: false, error: "Não consegui salvar." };
  }
  revalidatePath(`/students/${studentId}`);
  revalidatePath("/dashboard");
  return { ok: true };
}
