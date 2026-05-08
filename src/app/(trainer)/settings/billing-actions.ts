"use server";

import { headers } from "next/headers";
import { z } from "zod";

import { logAction } from "@/lib/audit";
import { getCurrentProfile } from "@/lib/auth";
import { rateLimitAsync } from "@/lib/rate-limit";
import {
  cancelSubscriptionAtPeriodEnd,
  createBillingPortalSession,
  isStripeEnabled,
} from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/server";

async function siteUrl(): Promise<string> {
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

export type PortalState =
  | { error?: string; redirectTo?: string }
  | undefined;

export async function openBillingPortalAction(): Promise<PortalState> {
  const session = await getCurrentProfile();
  if (!session || session.profile.role !== "owner") {
    return { error: "Sem permissão." };
  }
  if (!isStripeEnabled()) {
    return { error: "Cobrança não configurada nesta instalação." };
  }
  const customerId = session.tenant.stripe_customer_id;
  if (!customerId) return { error: "Sem cobrança ativa pra abrir." };

  const rl = await rateLimitAsync(`billingPortal:${session.profile.id}`, 5, 60_000);
  if (!rl.ok) return { error: "Aguarda um momento e tenta de novo." };

  try {
    const portal = await createBillingPortalSession({
      customerId,
      returnUrl: `${await siteUrl()}/settings`,
    });
    return { redirectTo: portal.url };
  } catch (err) {
    console.error("[settings.billing] portal", err);
    return { error: "Não conseguimos abrir o portal." };
  }
}

const cancelSchema = z.object({
  confirm: z.string(),
});

export type CancelState = { ok?: boolean; error?: string } | undefined;

export async function cancelSubscriptionAction(
  _prev: CancelState,
  formData: FormData,
): Promise<CancelState> {
  const session = await getCurrentProfile();
  if (!session || session.profile.role !== "owner") {
    return { error: "Sem permissão." };
  }
  const parsed = cancelSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success || parsed.data.confirm !== "CANCELAR") {
    return { error: "Digite CANCELAR pra confirmar." };
  }
  if (!isStripeEnabled()) return { error: "Cobrança não configurada." };

  const admin = createAdminClient();
  const { data: sub } = await admin
    .from("tenant_subscriptions")
    .select("stripe_subscription_id")
    .eq("tenant_id", session.tenant.id)
    .maybeSingle();

  if (!sub?.stripe_subscription_id) {
    return { error: "Sem assinatura ativa." };
  }

  try {
    await cancelSubscriptionAtPeriodEnd(sub.stripe_subscription_id);
  } catch (err) {
    console.error("[settings.billing] cancel", err);
    return { error: "Falha no cancelamento." };
  }

  await logAction({
    tenantId: session.tenant.id,
    actorId: session.profile.id,
    action: "subscription.canceled",
    targetType: "tenant_subscription",
    targetId: sub.stripe_subscription_id,
  });

  return { ok: true };
}
