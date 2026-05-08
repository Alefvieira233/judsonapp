import "server-only";

export const STORY_WIDTH = 1080;
export const STORY_HEIGHT = 1920;

const FONT_URLS = {
  // Bebas Neue 400 (display) + Inter 700 (body fallback). Bebas is the brand
  // display face; Inter handles digits and lowercase weights cleanly.
  bebas:
    "https://fonts.gstatic.com/s/bebasneue/v14/JTUSjIg69CK48gW7PXoo9WlhyyTh89Y.woff2",
  inter:
    "https://fonts.gstatic.com/s/inter/v18/UcCo3FwrK3iLTcvneQg7Ca725JhhKnNqk4j1ebLhAm8SrXTc2dRw.woff2",
} as const;

type LoadedFont = { name: string; data: ArrayBuffer; weight: 400 | 700; style: "normal" };

/**
 * Lazy-loads brand fonts from Google. Cached per process — Next route
 * handlers reuse module state across invocations on a warm container.
 *
 * Fails open: if the network call doesn't return in time, we return an
 * empty array so satori falls back to its bundled `system-ui` shape.
 */
let cachedFonts: Promise<LoadedFont[]> | null = null;

export function loadStoryFonts(): Promise<LoadedFont[]> {
  if (cachedFonts) return cachedFonts;
  cachedFonts = (async () => {
    try {
      const [bebas, inter] = await Promise.all([
        fetchFont(FONT_URLS.bebas),
        fetchFont(FONT_URLS.inter),
      ]);
      const fonts: LoadedFont[] = [];
      if (bebas) fonts.push({ name: "Bebas Neue", data: bebas, weight: 400, style: "normal" });
      if (inter) fonts.push({ name: "Inter", data: inter, weight: 700, style: "normal" });
      return fonts;
    } catch (err) {
      // OG image route runs on the Edge runtime where `@/lib/logger` (which
      // depends on `server-only`) cannot import. Console.error is the only
      // option that still flows to Vercel Edge logs.
      console.error("[og.fonts] fallback to system-ui:", err);
      return [];
    }
  })();
  return cachedFonts;
}

async function fetchFont(url: string): Promise<ArrayBuffer | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4000);
  try {
    const res = await fetch(url, { signal: controller.signal, cache: "force-cache" });
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Brand color picker with `#DC2626` as the Judson fallback. Accepts the
 * tenant.brand_color as-is (full css hex). Used both for gradient and for
 * accent text. The `_dark` variant gives the gradient a deeper anchor.
 */
export function brandColors(input: {
  primary: string | null | undefined;
  primaryDark?: string | null | undefined;
}): { primary: string; primaryDark: string } {
  const primary = sanitizeHex(input.primary) ?? "#DC2626";
  const primaryDark = sanitizeHex(input.primaryDark) ?? "#7F1D1D";
  return { primary, primaryDark };
}

function sanitizeHex(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (/^#[0-9a-fA-F]{3,8}$/.test(trimmed)) return trimmed;
  return null;
}

export function unauthorizedResponse(): Response {
  return new Response("unauthorized", {
    status: 401,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}

export function notFoundResponse(): Response {
  return new Response("not found", {
    status: 404,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}

export const STORY_CACHE_HEADER = "public, max-age=86400, immutable";
