"use client";

import Link from "next/link";
import { useSyncExternalStore, useState } from "react";

const STORAGE_KEY = "judsonapp:cookie-consent:v1";

function readDismissed(): boolean {
  try {
    return !!localStorage.getItem(STORAGE_KEY);
  } catch {
    // localStorage unavailable (Safari private mode) — fail closed: pretend
    // it's dismissed to avoid stuck UI.
    return true;
  }
}

function subscribe(cb: () => void): () => void {
  const handler = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) cb();
  };
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}

/**
 * One-time LGPD cookie/consent banner. Shows on first visit; dismisses
 * permanently in localStorage. We only use strictly-necessary cookies
 * (auth session) plus a service-worker cache of public assets, so the
 * banner is informational — no opt-in segmented categories needed.
 *
 * Uses useSyncExternalStore so the visibility comes from localStorage
 * directly (no setState-in-effect anti-pattern).
 */
export function CookieBanner() {
  const dismissed = useSyncExternalStore(
    subscribe,
    readDismissed,
    () => true, // SSR: render nothing until hydration.
  );
  const [hideLocal, setHideLocal] = useState(false);

  if (dismissed || hideLocal) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    } catch {
      // ignore — fall back to hiding locally for this session.
    }
    setHideLocal(true);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Aviso de cookies"
      className="fixed inset-x-3 bottom-3 z-50 max-w-2xl rounded-xl border border-border bg-background/95 p-4 shadow-lg backdrop-blur sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)" }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <p className="text-xs text-muted-foreground">
          Usamos cookies essenciais pra manter teu login e o cache offline do
          app.{" "}
          <Link
            href="/privacidade"
            className="text-foreground underline-offset-2 hover:underline"
          >
            Saiba mais
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-md bg-[var(--brand-primary)] px-5 text-xs font-semibold text-white transition-colors hover:opacity-90 active:scale-[0.98]"
        >
          Entendi
        </button>
      </div>
    </div>
  );
}
