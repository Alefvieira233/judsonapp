"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const tenantSchema = z.object({
  name: z.string().trim().min(2).max(80),
  bio: z.string().trim().max(1000).optional().or(z.literal("").transform(() => undefined)),
  tagline: z.string().trim().max(120).optional().or(z.literal("").transform(() => undefined)),
  whatsapp_number: z.string().trim().min(8).max(20),
  instagram_handle: z
    .string()
    .trim()
    .max(40)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  cref: z.string().trim().max(40).optional().or(z.literal("").transform(() => undefined)),
  city: z.string().trim().max(80).optional().or(z.literal("").transform(() => undefined)),
  consultation_price: z
    .string()
    .trim()
    .max(80)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  consultation_pitch: z
    .string()
    .trim()
    .max(200)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  brand_color: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, "Use formato #RRGGBB.")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  brand_color_dark: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, "Use formato #RRGGBB.")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  logo_url: z.string().trim().url().max(500).optional().or(z.literal("").transform(() => undefined)),
  banner_url: z.string().trim().url().max(500).optional().or(z.literal("").transform(() => undefined)),
});

export type TenantState = { ok?: boolean; error?: string } | undefined;

export async function updateTenantAction(
  _prev: TenantState,
  formData: FormData,
): Promise<TenantState> {
  const session = await getCurrentProfile();
  if (!session || session.profile.role !== "owner") {
    return { error: "Sem permissão." };
  }

  const parsed = tenantSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("tenants")
    .update({
      name: parsed.data.name,
      bio: parsed.data.bio ?? null,
      tagline: parsed.data.tagline ?? null,
      whatsapp_number: parsed.data.whatsapp_number,
      instagram_handle: parsed.data.instagram_handle ?? null,
      cref: parsed.data.cref ?? null,
      city: parsed.data.city ?? null,
      consultation_price: parsed.data.consultation_price ?? null,
      consultation_pitch: parsed.data.consultation_pitch ?? null,
      brand_color: parsed.data.brand_color ?? null,
      brand_color_dark: parsed.data.brand_color_dark ?? null,
      logo_url: parsed.data.logo_url ?? null,
      banner_url: parsed.data.banner_url ?? null,
    })
    .eq("id", session.tenant.id);

  if (error) {
    console.error("[settings.update]", error);
    return { error: "Não consegui salvar. Tenta de novo." };
  }

  revalidatePath("/settings");
  revalidatePath("/", "layout");
  return { ok: true };
}
