"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { activeStudentSegment, type StudentNavItem } from "./nav-routes";

export function StudentNavLink({
  item,
  badge = 0,
}: {
  item: StudentNavItem;
  badge?: number;
}) {
  const pathname = usePathname();
  const active = activeStudentSegment(pathname) === item.segment;
  const Icon = item.icon;
  const showBadge = badge > 0;
  const badgeLabel = badge > 9 ? "9+" : String(badge);

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
      <span className="relative">
        <Icon
          className={cn("size-6 transition-transform", active ? "scale-110" : "")}
          strokeWidth={active ? 2.4 : 2}
          aria-hidden
        />
        {showBadge ? (
          <span
            aria-label={`${badge} mensagens não lidas`}
            className="absolute -right-2 -top-1 grid min-w-[18px] place-items-center rounded-full bg-[var(--brand-primary)] px-1 text-[10px] font-bold leading-[18px] text-white shadow"
          >
            {badgeLabel}
          </span>
        ) : null}
      </span>
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
