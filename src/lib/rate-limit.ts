// Pluggable rate limiter:
//   - When UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN are set, uses
//     @upstash/ratelimit with a sliding-window algorithm. Shared across all
//     Vercel instances and resilient to cold starts.
//   - Otherwise falls back to an in-memory Map (fine for `npm run dev` and
//     single-instance deploys; acceptable as MVP fallback).
//
// Same signature as before, so callers don't change. Reasoning behind the
// pluggable shape: see analysis/04-security-lgpd.md ALTO-8.

import type { Ratelimit } from "@upstash/ratelimit";

type Bucket = { count: number; resetAt: number };

const memBuckets = new Map<string, Bucket>();
let lastSweep = Date.now();
const SWEEP_INTERVAL = 5 * 60 * 1000;

function memSweep(now: number) {
  if (now - lastSweep < SWEEP_INTERVAL) return;
  lastSweep = now;
  for (const [k, b] of memBuckets) {
    if (b.resetAt < now) memBuckets.delete(k);
  }
}

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  resetAt: number;
};

// Lazy Upstash client; null when not configured.
let upstash: { ratelimit: Ratelimit; cache: Map<string, Ratelimit> } | null = null;

function getUpstash() {
  if (upstash) return upstash;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  // Dynamic require keeps these out of the cold-start path when not configured.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Ratelimit } = require("@upstash/ratelimit") as typeof import("@upstash/ratelimit");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Redis } = require("@upstash/redis") as typeof import("@upstash/redis");

  const redis = new Redis({ url, token });

  // Per (limit, windowMs) signature — Upstash needs a fixed config per limiter.
  const cache = new Map<string, Ratelimit>();
  const make = (limit: number, windowMs: number) => {
    const key = `${limit}:${windowMs}`;
    let rl = cache.get(key);
    if (!rl) {
      rl = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(limit, `${windowMs} ms`),
        analytics: false,
        prefix: "judsonapp:rl",
      });
      cache.set(key, rl);
    }
    return rl;
  };

  // We expose a passthrough .ratelimit that closes over the factory.
  upstash = {
    cache,
    ratelimit: {
      // The factory is what we actually use. The public Ratelimit on the
      // wrapper is unused but typed for future imports.
    } as Ratelimit & { _factory: typeof make },
  };
  (upstash.ratelimit as unknown as { _factory: typeof make })._factory = make;
  return upstash;
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  // Sync API kept for compatibility with existing callers. Upstash is async,
  // so the sync overload uses the in-memory store; for Upstash, callers
  // should switch to rateLimitAsync (see below).
  const now = Date.now();
  memSweep(now);

  const existing = memBuckets.get(key);
  if (!existing || existing.resetAt < now) {
    const fresh: Bucket = { count: 1, resetAt: now + windowMs };
    memBuckets.set(key, fresh);
    return { ok: true, remaining: limit - 1, resetAt: fresh.resetAt };
  }

  if (existing.count >= limit) {
    return { ok: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return { ok: true, remaining: limit - existing.count, resetAt: existing.resetAt };
}

/**
 * Async rate-limit. Use this in Server Actions for production-grade limiting:
 * uses Upstash when configured, falls back to in-memory otherwise. Same
 * semantics as `rateLimit`, just awaitable.
 */
export async function rateLimitAsync(
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const u = getUpstash();
  if (!u) return rateLimit(key, limit, windowMs);

  const factory = (u.ratelimit as unknown as { _factory: (l: number, w: number) => Ratelimit })._factory;
  const limiter = factory(limit, windowMs);
  const res = await limiter.limit(key);
  return {
    ok: res.success,
    remaining: res.remaining,
    resetAt: res.reset,
  };
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
