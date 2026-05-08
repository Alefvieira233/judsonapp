import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { verifyWebhookSignature } from "@/lib/asaas";
import { createAdminClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database";

export const dynamic = "force-dynamic";

const payloadSchema = z.object({
  id: z.string().optional(),
  event: z.string(),
  payment: z
    .object({
      id: z.string(),
      subscription: z.string().nullable().optional(),
      customer: z.string().optional(),
      value: z.number().optional(),
      netValue: z.number().optional(),
      status: z.string().optional(),
      dueDate: z.string().optional(),
      paymentDate: z.string().nullable().optional(),
      invoiceUrl: z.string().nullable().optional(),
    })
    .optional(),
});

type Update = {
  status?: "active" | "past_due" | "canceled" | "pending";
  started_at?: string;
  current_period_end?: string;
  canceled_at?: string;
};

function classifyEvent(eventType: string): Update | null {
  // Mapping conservador: só mexemos em status quando o evento é inequívoco.
  // Qualquer outro evento entra no audit log mas não muda subscription.
  if (eventType.startsWith("PAYMENT_CONFIRMED") || eventType.startsWith("PAYMENT_RECEIVED")) {
    return { status: "active", started_at: new Date().toISOString() };
  }
  if (eventType.startsWith("PAYMENT_OVERDUE")) {
    return { status: "past_due" };
  }
  if (eventType.startsWith("SUBSCRIPTION_CANCELLED") || eventType.startsWith("PAYMENT_REFUNDED")) {
    return { status: "canceled", canceled_at: new Date().toISOString() };
  }
  return null;
}

export async function POST(req: NextRequest) {
  const headerToken = req.headers.get("asaas-access-token");
  if (!verifyWebhookSignature(headerToken, process.env.ASAAS_WEBHOOK_SECRET)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const parsed = payloadSchema.safeParse(raw);
  if (!parsed.success) {
    console.error("[asaas.webhook] schema mismatch", parsed.error.issues);
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  const payload = parsed.data;
  // Asaas geralmente envia um id único por evento. Quando ausente, derivamos
  // de paymentId+evento — manter idempotência mesmo em reentregas.
  const providerEventId =
    payload.id ?? (payload.payment ? `${payload.event}:${payload.payment.id}` : null);
  if (!providerEventId) {
    return NextResponse.json({ error: "missing event id" }, { status: 400 });
  }

  const admin = createAdminClient();

  let subscriptionId: string | null = null;
  let tenantId: string | null = null;
  if (payload.payment?.subscription) {
    const { data: sub } = await admin
      .from("subscriptions")
      .select("id, tenant_id")
      .eq("provider", "asaas")
      .eq("provider_subscription_id", payload.payment.subscription)
      .maybeSingle();
    if (sub) {
      subscriptionId = sub.id;
      tenantId = sub.tenant_id;
    }
  }

  const { error: insertErr } = await admin.from("payment_events").insert({
    tenant_id: tenantId,
    subscription_id: subscriptionId,
    provider: "asaas",
    provider_event_id: providerEventId,
    event_type: payload.event,
    amount_cents: payload.payment?.value
      ? Math.round(payload.payment.value * 100)
      : null,
    status: payload.payment?.status ?? null,
    raw: payload as unknown as Json,
  });

  if (insertErr) {
    // Conflito no unique = reentrega do mesmo evento. Idempotente: 200.
    if (insertErr.code === "23505") {
      return NextResponse.json({ ok: true, idempotent: true });
    }
    console.error("[asaas.webhook] insert failed", insertErr);
    return NextResponse.json({ error: "insert failed" }, { status: 500 });
  }

  if (subscriptionId) {
    const update = classifyEvent(payload.event);
    if (update) {
      const { data: updated, error: updateErr } = await admin
        .from("subscriptions")
        .update(update)
        .eq("id", subscriptionId)
        .select("id, student_id, plan_id, status, tenant_id")
        .single();
      if (updateErr) {
        console.error("[asaas.webhook] subscription update", updateErr);
      } else if (updated && updated.status === "active" && updated.plan_id) {
        // Espelha plano corrente no profile pra a vitrine /planos refletir.
        const { error: profileErr } = await admin
          .from("profiles")
          .update({ current_plan_id: updated.plan_id })
          .eq("id", updated.student_id)
          .eq("tenant_id", updated.tenant_id);
        if (profileErr) {
          console.error("[asaas.webhook] profile sync", profileErr);
        }
      }
    }
  }

  return NextResponse.json({ ok: true });
}
