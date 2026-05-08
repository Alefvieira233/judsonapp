"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  cancelSubscription as asaasCancelSubscription,
  createCustomer,
  createSubscription,
  getFirstPayment,
  isAsaasEnabled,
  type AsaasBillingType,
  type AsaasCycle,
} from "@/lib/asaas";
import { getCurrentStudent } from "@/lib/auth";
import { log } from "@/lib/logger";
import { rateLimitAsync } from "@/lib/rate-limit";
import { createAdminClient, createClient } from "@/lib/supabase/server";

const subscribeSchema = z.object({
  plan_id: z.string().uuid(),
  billing_type: z.enum(["PIX", "CREDIT_CARD", "BOLETO"]),
});

export type SubscribeResult =
  | { ok: true; checkoutUrl: string }
  | { ok: false; error: string };

const PIX_FALLBACK = "Pagamento online ainda não está ativo — fala com o Judson pelo WhatsApp.";

/**
 * Heurística pra extrair valor numérico do price_label livre que o owner
 * cadastra ("R$ 99/mês", "R$ 299,00", "Grátis"...). Devolve { cents, cycle }.
 * Sem casamento confiável → erro amigável e operação aborta.
 */
function parsePriceLabel(
  label: string | null,
): { cents: number; cycle: AsaasCycle } | null {
  if (!label) return null;
  const lower = label.toLowerCase();
  const cycle: AsaasCycle = lower.includes("ano")
    ? "YEARLY"
    : lower.includes("trimest")
    ? "QUARTERLY"
    : "MONTHLY";
  const numeric = label.replace(/[^\d,.]/g, "").replace(/\.(?=\d{3}\b)/g, "").replace(",", ".");
  const value = Number.parseFloat(numeric);
  if (!Number.isFinite(value) || value <= 0) return null;
  return { cents: Math.round(value * 100), cycle };
}

function dueDateInDays(days: number): string {
  const d = new Date(Date.now() + days * 86_400_000);
  // Asaas espera YYYY-MM-DD.
  return d.toISOString().slice(0, 10);
}

export async function subscribeToPlanAction(
  input: { plan_id: string; billing_type: AsaasBillingType },
): Promise<SubscribeResult> {
  if (!isAsaasEnabled()) {
    return { ok: false, error: PIX_FALLBACK };
  }

  const parsed = subscribeSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Dados inválidos." };
  }

  const session = await getCurrentStudent();
  if (!session) {
    return { ok: false, error: "Sessão expirada. Entra de novo." };
  }
  const { profile, tenant } = session;

  // Limite generoso (5/min) — evita ataque de DoS contra a Asaas API.
  const rl = await rateLimitAsync(`subscribe:${profile.id}`, 5, 60_000);
  if (!rl.ok) {
    return { ok: false, error: "Muitas tentativas. Espera um instante." };
  }

  const supabase = await createClient();
  const { data: plan, error: planErr } = await supabase
    .from("plans")
    .select("id, name, price_label, active")
    .eq("id", parsed.data.plan_id)
    .eq("tenant_id", tenant.id)
    .eq("active", true)
    .maybeSingle();
  if (planErr || !plan) {
    return { ok: false, error: "Plano indisponível." };
  }

  const price = parsePriceLabel(plan.price_label);
  if (!price) {
    return { ok: false, error: "Esse plano ainda não tem preço definido pra cobrança online." };
  }

  // Asaas customer cache: cria só na primeira vez. Salvar via service_role
  // porque profiles RLS não dá UPDATE livre na própria linha pra todos os
  // campos (defesa em profundidade — não queremos que a aluna mude
  // tenant_id/role atualizando o mesmo row).
  const admin = createAdminClient();
  let customerId = profile.asaas_customer_id;
  if (!customerId) {
    try {
      const customer = await createCustomer({
        name: profile.full_name,
        email: profile.email,
        mobilePhone: profile.phone,
      });
      customerId = customer.id;
      await admin
        .from("profiles")
        .update({ asaas_customer_id: customerId })
        .eq("id", profile.id);
    } catch (err) {
      log.error("asaas.createCustomer", err, { scope: "planos" });
      return { ok: false, error: "Falha ao registrar pagamento. Tenta de novo." };
    }
  }

  let asaasSub;
  try {
    asaasSub = await createSubscription({
      customerId,
      value: price.cents / 100,
      cycle: price.cycle,
      billingType: parsed.data.billing_type,
      description: `${tenant.name} — ${plan.name}`,
      nextDueDate: dueDateInDays(3),
      externalReference: profile.id,
    });
  } catch (err) {
    log.error("asaas.createSubscription", err, { scope: "planos" });
    return { ok: false, error: "Falha ao criar assinatura. Tenta de novo." };
  }

  const { data: row, error: insertErr } = await admin
    .from("subscriptions")
    .insert({
      tenant_id: tenant.id,
      student_id: profile.id,
      plan_id: plan.id,
      status: "pending",
      provider: "asaas",
      provider_subscription_id: asaasSub.id,
      billing_cycle:
        price.cycle === "YEARLY"
          ? "yearly"
          : price.cycle === "QUARTERLY"
          ? "quarterly"
          : "monthly",
      value_cents: price.cents,
    })
    .select("id")
    .single();
  if (insertErr || !row) {
    // Fail-safe: a assinatura foi criada no Asaas mas não conseguimos
    // espelhar. Cancela lá pra não cobrar a aluna por algo que nem aparece
    // no painel.
    log.error("planos.subscriptions.insert", insertErr, { scope: "planos" });
    try {
      await asaasCancelSubscription(asaasSub.id);
    } catch (cancelErr) {
      log.error("asaas.cancel.rollback", cancelErr, { scope: "planos" });
    }
    return { ok: false, error: "Falha ao salvar assinatura. Tenta de novo." };
  }

  // Primeira fatura traz o invoiceUrl que abre o checkout (Pix QR / cartão / boleto).
  let checkoutUrl: string | null = null;
  try {
    const payment = await getFirstPayment(asaasSub.id);
    checkoutUrl = payment?.invoiceUrl ?? payment?.bankSlipUrl ?? null;
  } catch (err) {
    log.error("asaas.getFirstPayment", err, { scope: "planos" });
  }

  if (!checkoutUrl) {
    return { ok: false, error: "Falha ao gerar link de pagamento. Tenta de novo." };
  }

  revalidatePath("/planos");
  return { ok: true, checkoutUrl };
}
