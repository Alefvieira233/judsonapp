"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "overview", label: "Visão" },
  { id: "training", label: "Treinos" },
  { id: "health", label: "Saúde" },
  { id: "comm", label: "Comunicação" },
  { id: "history", label: "Histórico" },
];

export function SectionNav() {
  const [active, setActive] = useState<string>(SECTIONS[0]!.id);

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => !!el,
    );
    if (els.length === 0) return;
    const obs = new IntersectionObserver(
      (entries) => {
        // Pick the one whose top is closest to (but past) the sticky nav.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0 && visible[0]) {
          setActive(visible[0].target.id);
        }
      },
      // Top margin matches sticky nav height (~52px) plus a little slack.
      { rootMargin: "-72px 0px -60% 0px", threshold: 0 },
    );
    for (const el of els) obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const onJump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    // Scroll using offsetTop minus sticky nav height to land below it.
    const top = el.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <nav className="sticky top-2 z-10 -mx-4 overflow-x-auto px-4 md:-mx-0 md:px-0">
      <div className="flex w-fit gap-1 rounded-full border border-border bg-background/85 p-1 backdrop-blur">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onJump(s.id)}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              active === s.id
                ? "bg-[var(--brand-primary)] text-white"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
