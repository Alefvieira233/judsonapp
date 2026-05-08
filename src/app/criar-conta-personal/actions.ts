"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { z } from "zod";

import { logAction } from "@/lib/audit";
import { clientIp, rateLimitAsync } from "@/lib/rate-limit";
import {
  createCheckoutSessionForTenant,
  createStripeCustomer,
  isStripeEnabled,
} from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/server";
import { isMultiTenantEnabled } from "@/lib/tenant";

const slugRegex = /^[a-z0-9-]{3,30}$/;

const createSchema = z.object({
  name: z.string().trim().min(2).max(80),
  slug: z.string().trim().regex(slugRegex, "Use 3-30 letras minúsculas, números ou -."),
  email: z.string().email().max(120),
  phone: z
    .string()
    .trim()
    .min(8)
    .max(20)
    .regex(/^[+()\d\s-]+$/, "Telefone com DDI, ex.: +5596999999999"),
  brand_color: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, "Use formato #RRGGBB.")
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export type CreateTenantState =
  | { error?: string; field?: string; redirectTo?: string }
  | undefined;

export async function checkSlugAvailability(
  slug: string,
): Promise<{ ok: boolean; reason?: string }> {
  if (!slugRegex.test(slug)) {
    return { ok: false, reason: "3-30 letras minúsculas, números ou -." };
  }
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("tenants")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (error) return { ok: false, reason: "Falha ao validar." };
  if (data) return { ok: false, reason: "Slug já em uso." };
  return { ok: true };
}

export async function createTenantAction(
  _prev: CreateTenantState,
  formData: FormData,
): Promise<CreateTenantState> {
  const ip = await clientIp();
  const rl = await rateLimitAsync(`createTenant:${ip}`, 5, 60_000);
  if (!rl.ok) {
    return { error: "Muitas tentativas, espera alguns minutos." };
  }

  const parsed = createSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { error: issue?.message ?? "Dados inválidos.", field: issue?.path[0]?.toString() };
  }
  const data = parsed.data;

  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("tenants")
    .select("id")
    .eq("slug", data.slug)
    .maybeSingle();
  if (existing) return { error: "Slug já em uso.", field: "slug" };

  const { data: created, error: insertErr } = await admin
    .from("tenants")
    .insert({
      slug: data.slug,
      name: data.name,
      whatsapp_number: data.phone,
      brand_color: data.brand_color ?? null,
      active: true,
    })
    .select("id, slug")
    .single();

  if (insertErr || !created) {
    console.error("[createTenant] insert", insertErr);
    return { error: "Não conseguimos criar a conta. Tenta de novo." };
  }

  await logAction({
    tenantId: created.id,
    actorId: null,
    action: "tenant.created",
    targetType: "tenant",
    targetId: created.id,
    metadata: { slug: created.slug, email: data.email },
  });

  // Optimistic trial-state subscription record. The webhook flips it to
  // active on checkout.session.completed.
  await admin.from("tenant_subscriptions").insert({
    tenant_id: created.id,
    plan: "starter",
    status: isStripeEnabled() ? "incomplete" : "trialing",
    value_cents: 0,
  });

  // No Stripe configured: trial mode. Send magic link straight away so the
  // personal can finish setup without paying yet.
  if (!isStripeEnabled()) {
    const siteUrl = await currentSiteUrl();
    const { error: mlErr } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email: data.email,
      options: { redirectTo: `${siteUrl}/auth/callback?next=/dashboard` },
    });
    if (mlErr) console.error("[createTenant] magic link", mlErr);
    redirect(`/criar-conta-personal/sucesso?slug=${created.slug}&trial=1`);
  }

  // Stripe path: customer + checkout session.
  const priceId = process.env.STRIPE_PRICE_STARTER;
  if (!priceId) {
    return { error: "Cobrança não configurada. Avise o suporte." };
  }

  let customerId: string | null = null;
  try {
    const customer = await createStripeCustomer({
      email: data.email,
      name: data.name,
      tenantId: created.id,
    });
    customerId = customer.id;
    await admin
      .from("tenants")
      .update({ stripe_customer_id: customer.id })
      .eq("id", created.id);
    await admin
      .from("tenant_subscriptions")
      .update({ stripe_customer_id: customer.id })
      .eq("tenant_id", created.id);
  } catch (err) {
    console.error("[createTenant] stripe customer", err);
  }

  let checkoutUrl: string | null = null;
  try {
    const siteUrl = await currentSiteUrl();
    const session = await createCheckoutSessionForTenant({
      tenantId: created.id,
      ownerEmail: data.email,
      customerId,
      priceId,
      successUrl: `${siteUrl}/criar-conta-personal/sucesso?slug=${created.slug}`,
      cancelUrl: `${siteUrl}/criar-conta-personal?canceled=1`,
    });
    checkoutUrl = session.url;
  } catch (err) {
    console.error("[createTenant] stripe checkout", err);
    return { error: "Falha no checkout. Tenta de novo." };
  }

  if (!checkoutUrl) {
    return { error: "Stripe não retornou link de pagamento." };
  }
  redirect(checkoutUrl);
}

async function currentSiteUrl(): Promise<string> {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env) return env.replace(/\/+$/, "");
  try {
    const h = await headers();
    const host = h.get("host");
    const proto = h.get("x-forwarded-proto") ?? "https";
    if (host) return `${proto}://${host}`;
  } catch {
    // ignore
  }
  return "http://localhost:3000";
}

export async function isSelfServeEnabledAction(): Promise<boolean> {
  return isMultiTenantEnabled();
}
