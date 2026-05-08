import { NextResponse, type NextRequest } from "next/server";

import { log } from "@/lib/logger";
import { createAdminClient } from "@/lib/supabase/server";
import {
  type StripeEvent,
  verifyStripeSignature,
} from "@/lib/stripe";
import type { Json } from "@/types/database";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type SubscriptionStatus =
  | "active"
  | "past_due"
  | "canceled"
  | "trialing"
  | "incomplete"
  | "unpaid";

const STATUS_MAP: Record<string, SubscriptionStatus> = {
  active: "active",
  trialing: "trialing",
  past_due: "past_due",
  canceled: "canceled",
  unpaid: "unpaid",
  incomplete: "incomplete",
  incomplete_expired: "canceled",
};

function tenantIdFromMetadata(
  obj: Record<string, unknown> | null | undefined,
): string | null {
  if (!obj) return null;
  const meta = obj.metadata;
  if (
    meta &&
    typeof meta === "object" &&
    "tenant_id" in (meta as Record<string, unknown>)
  ) {
    const v = (meta as Record<string, unknown>).tenant_id;
    if (typeof v === "string") return v;
  }
  return null;
}

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    log.error("stripe.webhook", new Error("STRIPE_WEBHOOK_SECRET not configured"), { scope: "stripe.webhook" });
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }

  // Stripe needs the raw body for signature verification.
  const rawBody = await req.text();
  const sigHeader = req.headers.get("stripe-signature");
  if (!verifyStripeSignature(rawBody, sigHeader, secret)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  let event: StripeEvent;
  try {
    event = JSON.parse(rawBody) as StripeEvent;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Idempotency: stripe_events.event_id is the PK. Insert-on-conflict-noop.
  const { error: idemErr } = await admin.from("stripe_events").insert({
    event_id: event.id,
    type: event.type,
    payload: event as unknown as Json,
  });
  if (idemErr) {
    if (idemErr.code === "23505") {
      return NextResponse.json({ ok: true, idempotent: true });
    }
    log.error("stripe.webhook.eventInsert", idemErr, { scope: "stripe.webhook", eventId: event.id, type: event.type });
    return NextResponse.json({ error: "insert failed" }, { status: 500 });
  }

  // Audit trail of every Stripe event we processed (post-idempotency).
  // Vercel Logs picks this up as JSON; queries like `event:checkout.session.completed`
  // become trivial. Keep it info-level — it's signal, not noise.
  log.info("stripe.webhook", {
    scope: "stripe.webhook",
    event: event.type,
    eventId: event.id,
  });

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const obj = event.data.object as {
          id: string;
          customer: string | null;
          subscription: string | null;
          customer_email: string | null;
          client_reference_id: string | null;
          metadata: Record<string, string> | null;
        };
        const tenantId =
          obj.client_reference_id ?? tenantIdFromMetadata(obj) ?? null;
        if (!tenantId) {
          log.error("stripe.webhook.checkout.missingTenant", new Error("missing tenant_id"), { scope: "stripe.webhook", eventId: event.id, sessionId: obj.id });
          break;
        }

        await admin
          .from("tenant_subscriptions")
          .upsert(
            {
              tenant_id: tenantId,
              stripe_customer_id: obj.customer,
              stripe_subscription_id: obj.subscription,
              status: "active",
            },
            { onConflict: "tenant_id" },
          );

        if (obj.customer) {
          await admin
            .from("tenants")
            .update({ stripe_customer_id: obj.customer })
            .eq("id", tenantId);
        }

        // Magic link to the owner email so they can finish setting up the app.
        // Only fires when we have an email — checkouts initiated from the
        // signup flow always pass it.
        if (obj.customer_email) {
          const siteUrl =
            process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
          const { error: mlErr } = await admin.auth.admin.generateLink({
            type: "magiclink",
            email: obj.customer_email,
            options: { redirectTo: `${siteUrl}/auth/callback?next=/dashboard` },
          });
          if (mlErr) {
            log.error("stripe.webhook.magicLink", mlErr, { scope: "stripe.webhook", tenantId, email: obj.customer_email });
          }
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const obj = event.data.object as {
          id: string;
          customer: string;
          status: string;
          current_period_end: number | null;
          cancel_at_period_end: boolean;
          metadata?: Record<string, string> | null;
        };
        const status: SubscriptionStatus =
          event.type === "customer.subscription.deleted"
            ? "canceled"
            : (STATUS_MAP[obj.status] ?? "incomplete");

        const tenantId = tenantIdFromMetadata(obj);
        const periodEnd = obj.current_period_end
          ? new Date(obj.current_period_end * 1000).toISOString()
          : null;

        if (tenantId) {
          await admin
            .from("tenant_subscriptions")
            .upsert(
              {
                tenant_id: tenantId,
                stripe_customer_id: obj.customer,
                stripe_subscription_id: obj.id,
                status,
                current_period_end: periodEnd,
              },
              { onConflict: "tenant_id" },
            );
        } else {
          // Fall back to matching by stripe_subscription_id for events that
          // already exist (e.g. cancellations triggered from the portal).
          await admin
            .from("tenant_subscriptions")
            .update({
              status,
              current_period_end: periodEnd,
            })
            .eq("stripe_subscription_id", obj.id);
        }
        break;
      }

      case "invoice.payment_failed": {
        const obj = event.data.object as {
          customer: string;
          subscription: string | null;
        };
        if (obj.subscription) {
          await admin
            .from("tenant_subscriptions")
            .update({ status: "past_due" })
            .eq("stripe_subscription_id", obj.subscription);
        } else if (obj.customer) {
          await admin
            .from("tenant_subscriptions")
            .update({ status: "past_due" })
            .eq("stripe_customer_id", obj.customer);
        }
        break;
      }

      default:
        // Acknowledged but no-op — keeps Stripe from retrying.
        break;
    }
  } catch (err) {
    log.error("stripe.webhook.handler", err, { scope: "stripe.webhook", eventId: event.id, type: event.type });
    return NextResponse.json({ error: "handler failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
