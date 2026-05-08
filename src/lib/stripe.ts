import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

const STRIPE_API_BASE = "https://api.stripe.com/v1";

export type StripeCheckoutSession = {
  id: string;
  url: string | null;
  customer: string | null;
};

export type StripeSubscription = {
  id: string;
  customer: string;
  status: string;
  current_period_end: number | null;
  cancel_at_period_end: boolean;
  items: { data: Array<{ price: { id: string; unit_amount: number | null } }> };
};

export type StripeCheckoutCompletedEvent = {
  id: string;
  type: "checkout.session.completed";
  data: {
    object: {
      id: string;
      customer: string | null;
      subscription: string | null;
      customer_email: string | null;
      client_reference_id: string | null;
      metadata: Record<string, string> | null;
    };
  };
};

export type StripeSubscriptionEvent = {
  id: string;
  type:
    | "customer.subscription.updated"
    | "customer.subscription.deleted"
    | "customer.subscription.created";
  data: {
    object: {
      id: string;
      customer: string;
      status: string;
      current_period_end: number | null;
      cancel_at_period_end: boolean;
      items?: { data: Array<{ price: { id: string; unit_amount: number | null } }> };
    };
  };
};

export type StripeInvoiceFailedEvent = {
  id: string;
  type: "invoice.payment_failed";
  data: {
    object: {
      id: string;
      customer: string;
      subscription: string | null;
    };
  };
};

export type StripeEvent =
  | StripeCheckoutCompletedEvent
  | StripeSubscriptionEvent
  | StripeInvoiceFailedEvent
  | { id: string; type: string; data: { object: Record<string, unknown> } };

export function isStripeEnabled(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

function getSecretKey(): string {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return key;
}

function encodeForm(params: Record<string, string | number | undefined>): string {
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined) continue;
    usp.append(k, String(v));
  }
  return usp.toString();
}

async function stripeFetch<T>(
  path: string,
  init: { method: "GET" | "POST" | "DELETE"; body?: string } = { method: "GET" },
): Promise<T> {
  const res = await fetch(`${STRIPE_API_BASE}${path}`, {
    method: init.method,
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Stripe-Version": "2024-06-20",
    },
    body: init.body,
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Stripe ${path} ${res.status}: ${text.slice(0, 500)}`);
  }
  return (await res.json()) as T;
}

export async function createStripeCustomer(input: {
  email: string;
  name: string;
  tenantId: string;
}): Promise<{ id: string }> {
  const body = encodeForm({
    email: input.email,
    name: input.name,
    "metadata[tenant_id]": input.tenantId,
  });
  return stripeFetch<{ id: string }>("/customers", { method: "POST", body });
}

export async function createCheckoutSessionForTenant(input: {
  tenantId: string;
  ownerEmail: string;
  customerId?: string | null;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<StripeCheckoutSession> {
  const params: Record<string, string | number | undefined> = {
    mode: "subscription",
    "line_items[0][price]": input.priceId,
    "line_items[0][quantity]": 1,
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
    client_reference_id: input.tenantId,
    "metadata[tenant_id]": input.tenantId,
    "subscription_data[metadata][tenant_id]": input.tenantId,
    allow_promotion_codes: "true",
  };
  if (input.customerId) {
    params.customer = input.customerId;
  } else {
    params.customer_email = input.ownerEmail;
  }
  return stripeFetch<StripeCheckoutSession>("/checkout/sessions", {
    method: "POST",
    body: encodeForm(params),
  });
}

export async function createBillingPortalSession(input: {
  customerId: string;
  returnUrl: string;
}): Promise<{ url: string }> {
  return stripeFetch<{ url: string }>("/billing_portal/sessions", {
    method: "POST",
    body: encodeForm({
      customer: input.customerId,
      return_url: input.returnUrl,
    }),
  });
}

export async function cancelSubscriptionAtPeriodEnd(
  subscriptionId: string,
): Promise<{ id: string; cancel_at_period_end: boolean }> {
  return stripeFetch<{ id: string; cancel_at_period_end: boolean }>(
    `/subscriptions/${subscriptionId}`,
    { method: "POST", body: encodeForm({ cancel_at_period_end: "true" }) },
  );
}

/**
 * Verifies the Stripe-Signature header against the raw request body using the
 * Stripe webhook signing secret. Implements the v1 scheme:
 *   Stripe-Signature: t=<unix>,v1=<hex hmac sha256>(,v1=...)
 * The signed payload is `${t}.${rawBody}`. Returns true on a valid v1 sig
 * within the tolerance window (default 5 minutes).
 */
export function verifyStripeSignature(
  rawBody: string,
  header: string | null | undefined,
  secret: string | null | undefined,
  toleranceSeconds = 300,
): boolean {
  if (!header || !secret) return false;

  let timestamp: number | null = null;
  const v1Sigs: string[] = [];
  for (const part of header.split(",")) {
    const [k, v] = part.split("=");
    if (!k || !v) continue;
    if (k.trim() === "t") timestamp = Number.parseInt(v, 10);
    if (k.trim() === "v1") v1Sigs.push(v.trim());
  }
  if (!timestamp || v1Sigs.length === 0) return false;

  const nowSec = Math.floor(Date.now() / 1000);
  if (Math.abs(nowSec - timestamp) > toleranceSeconds) return false;

  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`, "utf8")
    .digest("hex");
  const expectedBuf = Buffer.from(expected, "hex");

  for (const sig of v1Sigs) {
    let sigBuf: Buffer;
    try {
      sigBuf = Buffer.from(sig, "hex");
    } catch {
      continue;
    }
    if (sigBuf.length !== expectedBuf.length) continue;
    if (timingSafeEqual(sigBuf, expectedBuf)) return true;
  }
  return false;
}

export async function fetchSubscription(
  subscriptionId: string,
): Promise<StripeSubscription> {
  return stripeFetch<StripeSubscription>(`/subscriptions/${subscriptionId}`, {
    method: "GET",
  });
}
