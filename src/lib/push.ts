import "server-only";

import webpush, { type PushSubscription as WebPushSubscription } from "web-push";

import { createAdminClient } from "@/lib/supabase/server";

export type PushPayload = {
  title: string;
  body: string;
  url?: string;
  badge?: string;
  icon?: string;
  tag?: string;
};

type StoredSubscription = {
  id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
};

let configured = false;
function ensureConfigured(): boolean {
  if (configured) return true;
  if (!isPushEnabled()) return false;
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!,
  );
  configured = true;
  return true;
}

export function isPushEnabled(): boolean {
  return Boolean(
    process.env.VAPID_SUBJECT &&
      process.env.VAPID_PUBLIC_KEY &&
      process.env.VAPID_PRIVATE_KEY,
  );
}

function toWebPush(sub: StoredSubscription): WebPushSubscription {
  return {
    endpoint: sub.endpoint,
    keys: { p256dh: sub.p256dh, auth: sub.auth },
  };
}

export type SendResult = { ok: true } | { ok: false; gone: boolean; error: string };

export async function sendPushTo({
  subscription,
  payload,
}: {
  subscription: StoredSubscription;
  payload: PushPayload;
}): Promise<SendResult> {
  if (!ensureConfigured()) {
    return { ok: false, gone: false, error: "VAPID not configured" };
  }
  try {
    await webpush.sendNotification(
      toWebPush(subscription),
      JSON.stringify(payload),
      { TTL: 60 * 60 * 24 },
    );
    return { ok: true };
  } catch (err) {
    const status =
      typeof err === "object" && err !== null && "statusCode" in err
        ? Number((err as { statusCode?: number }).statusCode)
        : 0;
    const message = err instanceof Error ? err.message : "unknown push error";
    if (status === 404 || status === 410) {
      const admin = createAdminClient();
      await admin.from("push_subscriptions").delete().eq("endpoint", subscription.endpoint);
      return { ok: false, gone: true, error: message };
    }
    console.warn("[push] send failed", { status, message });
    return { ok: false, gone: false, error: message };
  }
}

export async function sendPushToUser({
  userId,
  payload,
}: {
  userId: string;
  payload: PushPayload;
}): Promise<{ sent: number; gone: number; failed: number }> {
  if (!ensureConfigured()) return { sent: 0, gone: 0, failed: 0 };
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("push_subscriptions")
    .select("id, endpoint, p256dh, auth")
    .eq("user_id", userId);
  if (error || !data || data.length === 0) return { sent: 0, gone: 0, failed: 0 };

  let sent = 0;
  let gone = 0;
  let failed = 0;
  await Promise.all(
    data.map(async (sub) => {
      const res = await sendPushTo({ subscription: sub, payload });
      if (res.ok) {
        sent += 1;
        await admin
          .from("push_subscriptions")
          .update({ last_used_at: new Date().toISOString() })
          .eq("id", sub.id);
      } else if (res.gone) {
        gone += 1;
      } else {
        failed += 1;
      }
    }),
  );
  return { sent, gone, failed };
}
