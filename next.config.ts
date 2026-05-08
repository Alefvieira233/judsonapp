import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Security headers applied to every response. CSP itself is set per-request
// in src/proxy.ts (it needs a nonce that varies per response). Everything
// here is static and safe to ship via next.config.
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // Note: not setting COEP=require-corp because we serve images from Supabase
  // Storage as a third-party origin without CORP headers. Adding require-corp
  // would break those images. Same-origin is the correct middle ground.
];

const SUPABASE_HOST = (() => {
  try {
    return process.env.NEXT_PUBLIC_SUPABASE_URL
      ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
      : "ymepyisibjraxtrnxpwc.supabase.co";
  } catch {
    return "ymepyisibjraxtrnxpwc.supabase.co";
  }
})();

const nextConfig: NextConfig = {
  experimental: {
    // Aggressively tree-shake icon and primitives libraries. Safe because all
    // their components are individually-named exports.
    optimizePackageImports: [
      "lucide-react",
      "@base-ui/react",
      "framer-motion",
      "@dnd-kit/core",
      "@dnd-kit/sortable",
      "@dnd-kit/utilities",
    ],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: SUPABASE_HOST,
        pathname: "/storage/v1/object/public/**",
      },
      // YouTube/Instagram/Vimeo thumbnails for exercise videos.
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "*.cdninstagram.com" },
      { protocol: "https", hostname: "i.vimeocdn.com" },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
};

// Wrap with Sentry only if a DSN is configured. Without DSN the wrapper is a
// no-op for runtime, but the build still tries to call the Sentry CLI for
// source-map upload — guarding here keeps `next build` clean for contributors
// who haven't provisioned Sentry yet.
const sentryEnabled = !!(
  process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN
);

const baseConfig = withNextIntl(nextConfig);

export default sentryEnabled
  ? withSentryConfig(baseConfig, {
      // Only forward what's needed — Sentry SDK reads org/project/auth from env.
      silent: !process.env.CI,
      widenClientFileUpload: true,
      sourcemaps: { disable: false },
      disableLogger: true,
    })
  : baseConfig;
