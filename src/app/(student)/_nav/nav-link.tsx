"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { activeStudentSegment, type StudentNavItem } from "./nav-routes";

export function StudentNavLink({ item }: { item: StudentNavItem }) {
  const pathname = usePathname();
  const active = activeStudentSegment(pathname) === item.segment;
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative flex min-h-[56px] flex-col items-center justify-center gap-1 px-1 transition-colors active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]/40",
        active ? "text-foreground" : "text-muted-foreground",
      )}
    >
      {active ? (
        <span
          aria-hidden
          className="absolute top-0 h-1 w-12 rounded-b-full bg-[var(--brand-primary)] shadow-[0_0_12px_rgba(220,38,38,0.6)]"
        />
      ) : null}
      <Icon
        className={cn("size-6 transition-transform", active ? "scale-110" : "")}
        // Filled-when-active pattern via stroke-width + fill on the active glyph.
        // Lucide doesn't ship paired filled variants, so we lean into stroke and
        // background fill of the indicator pill above.
        strokeWidth={active ? 2.4 : 2}
        aria-hidden
      />
      <span
        className={cn(
          "text-[11px] leading-none transition-all",
          active ? "font-semibold" : "",
        )}
      >
        {item.label}
      </span>
    </Link>
  );
}
