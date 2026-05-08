"use client";

import { useState, useSyncExternalStore } from "react";
import { XIcon } from "lucide-react";

import type { Milestone } from "@/lib/milestones";

const STORAGE_PREFIX = "milestone_seen:";

type Props = {
  milestone: Milestone;
};

function subscribeNoop(): () => void {
  return () => undefined;
}

function readSeen(key: string): boolean {
  try {
    return localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

export function MilestoneBanner({ milestone }: Props) {
  // SSR-safe gate: server snapshot returns false (not seen → show banner),
  // client snapshot reads from localStorage. Avoids the setState-in-effect
  // anti-pattern flagged by the React 19 lint rules.
  const seen = useSyncExternalStore(
    subscribeNoop,
    () => readSeen(STORAGE_PREFIX + milestone.dedupeId),
    () => false,
  );
  const [dismissed, setDismissed] = useState(false);

  if (seen || dismissed) return null;

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_PREFIX + milestone.dedupeId, "1");
    } catch {
      // ignore
    }
    setDismissed(true);
  }

  return (
    <div
      role="status"
      className="relative flex items-center gap-3 overflow-hidden rounded-2xl border border-[var(--brand-primary)]/40 bg-gradient-to-br from-[var(--brand-primary)]/20 via-[var(--brand-primary)]/10 to-card/40 px-4 py-3 pr-10"
    >
      <span aria-hidden className="text-3xl leading-none">
        {milestone.emoji}
      </span>
      <div className="flex min-w-0 flex-col">
        <span className="font-display text-lg leading-tight">{milestone.title}</span>
        <span className="text-xs text-muted-foreground">{milestone.body}</span>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Fechar"
        className="absolute right-2 top-2 grid size-7 place-items-center rounded-full text-muted-foreground hover:bg-card/60 hover:text-foreground"
      >
        <XIcon className="size-4" />
      </button>
    </div>
  );
}
