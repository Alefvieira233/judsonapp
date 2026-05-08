import { NextResponse, type NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";

const SUPABASE_HOST = (() => {
  try {
    return process.env.NEXT_PUBLIC_SUPABASE_URL
      ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
      : null;
  } catch {
    return null;
  }
})();

function buildCsp(nonce: string): string {
  const supabaseSrc = SUPABASE_HOST ? `https://${SUPABASE_HOST}` : "";
  const supabaseWs = SUPABASE_HOST ? `wss://${SUPABASE_HOST}` : "";
  const isDev = process.env.NODE_ENV !== "production";

  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      `'nonce-${nonce}'`,
      "'strict-dynamic'",
      // dev only — Next emits inline scripts via React Refresh that aren't
      // nonced. Don't ship 'unsafe-eval' to production.
      ...(isDev ? ["'unsafe-eval'", "'unsafe-inline'"] : []),
    ],
    "style-src": ["'self'", "'unsafe-inline'"], // Tailwind + next/font
    "img-src": [
      "'self'",
      "data:",
      "blob:",
      supabaseSrc,
      "https://i.ytimg.com",
      "https://img.youtube.com",
      "https://*.cdninstagram.com",
      "https://i.vimeocdn.com",
    ].filter(Boolean),
    "font-src": [
      "'self'",
      "data:",
      "https://fonts.gstatic.com",
      "https://fonts.googleapis.com",
    ],
    "connect-src": [
      "'self'",
      supabaseSrc,
      supabaseWs,
      // Realtime subscriptions can fan out across *.supabase.co subdomains.
      "wss://*.supabase.co",
      "https://vitals.vercel-insights.com",
      "https://va.vercel-scripts.com",
      // Sentry endpoints when configured. Use the Sentry tunnel for less FPs.
      "https://*.ingest.sentry.io",
      "https://*.ingest.us.sentry.io",
      // Asaas: status calls e fetch do checkout link.
      "https://*.asaas.com",
      // Google Fonts fetch from next/og handler (story image generation).
      "https://fonts.gstatic.com",
      "https://fonts.googleapis.com",
    ].filter(Boolean),
    "frame-src": [
      "'self'",
      "https://www.youtube.com",
      "https://www.youtube-nocookie.com",
      "https://www.instagram.com",
      "https://player.vimeo.com",
      // Asaas eventualmente embeda o checkout em iframe.
      "https://*.asaas.com",
    ],
    "frame-ancestors": ["'none'"],
    "form-action": ["'self'"],
    "base-uri": ["'self'"],
    "object-src": ["'none'"],
    "upgrade-insecure-requests": [],
  };

  return Object.entries(directives)
    .map(([k, v]) => (v.length === 0 ? k : `${k} ${v.join(" ")}`))
    .join("; ");
}

export async function proxy(request: NextRequest) {
  // Strong nonce per request (24 random bytes → base64).
  const nonce = Buffer.from(crypto.getRandomValues(new Uint8Array(24))).toString(
    "base64",
  );

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const sessionResponse = await updateSession(request);

  // updateSession can return a redirect — let it through unchanged but still
  // attach security headers below.
  const isRedirect =
    sessionResponse.headers.has("location") &&
    sessionResponse.status >= 300 &&
    sessionResponse.status < 400;

  const response = isRedirect
    ? sessionResponse
    : NextResponse.next({
        request: { headers: requestHeaders },
        // Preserve cookies set by updateSession.
      });

  if (!isRedirect) {
    sessionResponse.cookies.getAll().forEach((cookie) => {
      response.cookies.set(cookie);
    });
  }

  const csp = buildCsp(nonce);
  // Use CSP-Report-Only in dev to avoid breaking React Refresh while we tune.
  // Production enforces.
  const cspHeader =
    process.env.NODE_ENV === "production"
      ? "Content-Security-Policy"
      : "Content-Security-Policy-Report-Only";

  response.headers.set(cspHeader, csp);
  response.headers.set("x-nonce", nonce);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     *  - _next/static, _next/image, favicon, manifest, icons (static assets)
     *  - any file extension (images, fonts, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|icons|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2)$).*)",
  ],
};
