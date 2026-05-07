"use client";

import { cn } from "@/lib/utils";

import { MoreNavItem } from "./more-sheet";
import { NavLink } from "./nav-link";
import { NAV_ITEMS } from "./nav-routes";

export function BottomNav({ className }: { className?: string }) {
  return (
    <nav
      aria-label="Navegação principal"
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur supports-[backdrop-filter]:bg-card/80",
        className,
      )}
    >
      <ul className="grid grid-cols-5">
        {NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <NavLink item={item} variant="bottom" />
          </li>
        ))}
        <li>
          <MoreNavItem />
        </li>
      </ul>
    </nav>
  );
}
