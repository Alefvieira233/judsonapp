// Minimal service worker — installable PWA + small offline shell.
//
// SECURITY (CRIT-2 — see analysis/04-security-lgpd.md):
//   We DO NOT cache HTML for authenticated routes. The previous
//   network-first-with-cache strategy clones every navigation response into
//   the cache, which leaked authenticated pages (/dashboard, /students/<id>,
//   /perfil, /feed) when:
//     • the user logged out (cache survives the cookie wipe)
//     • another person opened the same browser/PWA
//     • the device was shared (academy demo, borrowed phone)
//
// New strategy:
//   - Pre-cache ONLY the offline shell + the manifest.
//   - Authenticated paths (everything except landing/legal/auth pages) go
//     network-only with /offline as fallback when offline. Never cached.
//   - Public pages (/, /termos, /privacidade, /invite/<token>, /aluna/entrar,
//     /login, /welcome) are network-first and may be cached for short-term
//     offline reads — they don't carry per-user data.
//   - Static assets (JS/CSS/fonts/images): cache-first with network fallback.
//
// We also listen for `BroadcastChannel('logout')` and wipe the cache when the
// app posts a logout event (see logoutAction wrappers).

const CACHE = "judsonapp-v2";
const OFFLINE_URL = "/offline";
const PRECACHE_URLS = [OFFLINE_URL, "/manifest.json"];

// Paths that may carry per-user data — NEVER cached.
const AUTHENTICATED_PREFIXES = [
  "/dashboard",
  "/students",
  "/workouts",
  "/exercises",
  "/plans",
  "/community",
  "/settings",
  "/home",
  "/treinos",
  "/feed",
  "/perfil",
  "/planos",
  "/auth/callback",
  "/api/",
];

function isAuthenticatedPath(pathname) {
  return AUTHENTICATED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/") || pathname.startsWith(p));
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE_URLS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const isHtml =
    request.mode === "navigate" || request.headers.get("accept")?.includes("text/html");

  if (isHtml) {
    if (isAuthenticatedPath(url.pathname)) {
      // Network-only for anything that may carry per-user data. If the network
      // fails, show the offline shell — never serve a stale authenticated page.
      event.respondWith(
        fetch(request).catch(() => caches.match(OFFLINE_URL)),
      );
      return;
    }

    // Public pages: network-first, fall back to a cached copy or offline shell.
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy)).catch(() => {});
          return response;
        })
        .catch(() => caches.match(request).then((c) => c || caches.match(OFFLINE_URL))),
    );
    return;
  }

  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    /\.(?:js|css|woff2?|png|jpg|jpeg|svg|webp|ico)$/.test(url.pathname)
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy)).catch(() => {});
            return response;
          }),
      ),
    );
  }
});

// Clear caches on logout (the app posts {type:'logout'} on a BroadcastChannel
// named 'judsonapp-auth' before redirecting). Defense in depth: even if a
// browser kept an authenticated HTML response somewhere, this wipes it.
self.addEventListener("message", (event) => {
  if (event.data?.type === "logout") {
    event.waitUntil(
      caches
        .keys()
        .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
        .then(() => caches.open(CACHE).then((c) => c.addAll(PRECACHE_URLS))),
    );
  }
});
