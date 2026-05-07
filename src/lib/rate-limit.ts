// In-memory rate limiter. Good for single-instance deploys (Vercel serverless
// usually keeps the same warm instance for a few minutes; cold starts reset
// the bucket — that's acceptable since each cold start is essentially a new
// IP from the perspective of the attacker too).
//
// When we scale to multiple regions or want stricter guarantees, swap the
// `buckets` Map for an Upstash Redis client (same interface, three lines
// of code).

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Sweep expired buckets every 5min so the Map doesn't grow unbounded.
let lastSweep = Date.now();
const SWEEP_INTERVAL = 5 * 60 * 1000;

function sweep(now: number) {
  if (now - lastSweep < SWEEP_INTERVAL) return;
  lastSweep = now;
  for (const [k, b] of buckets) {
    if (b.resetAt < now) buckets.delete(k);
  }
}

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  resetAt: number;
};

/**
 * Allow up to `limit` requests in `windowMs` for the given key.
 * Returns ok=false when the bucket is exhausted.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const existing = buckets.get(key);
  if (!existing || existing.resetAt < now) {
    const fresh: Bucket = { count: 1, resetAt: now + windowMs };
    buckets.set(key, fresh);
    return { ok: true, remaining: limit - 1, resetAt: fresh.resetAt };
  }

  if (existing.count >= limit) {
    return { ok: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return { ok: true, remaining: limit - existing.count, resetAt: existing.resetAt };
}

export async function clientIp(): Promise<string> {
  const { headers } = await import("next/headers");
  const h = await headers();
  // Vercel / Cloudflare put the real IP in x-forwarded-for, sometimes with
  // multiple comma-separated proxies — first one is the original client.
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return h.get("x-real-ip") ?? "unknown";
}
