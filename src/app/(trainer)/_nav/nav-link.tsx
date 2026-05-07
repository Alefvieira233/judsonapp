"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { activeSegment, type NavItem } from "./nav-routes";

type Variant = "bottom" | "sidebar";

const styles: Record<
  Variant,
  { base: string; idle: string; active: string; iconClass: string; labelClass: string }
> = {
  bottom: {
    base: "relative flex min-h-[44px] flex-col items-center justify-center gap-1 px-1 transition-colors",
    idle: "text-muted-foreground",
    active: "text-foreground",
    iconClass: "size-5",
    labelClass: "text-[11px] leading-none",
  },
  sidebar: {
    base: "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
    idle: "text-muted-foreground hover:bg-card hover:text-foreground",
    active: "bg-card text-foreground",
    iconClass: "size-4",
    labelClass: "",
  },
};

export function NavLink({
  item,
  variant,
  onSelect,
}: {
  item: NavItem;
  variant: Variant;
  onSelect?: () => void;
}) {
  const pathname = usePathname();
  const active = activeSegment(pathname) === item.segment;
  const s = styles[variant];
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onSelect}
      aria-current={active ? "page" : undefined}
      className={cn(s.base, active ? s.active : s.idle)}
    >
      {variant === "bottom" && active ? (
        <span
          aria-hidden
          className="absolute top-0 h-0.5 w-8 rounded-b-full bg-[var(--brand-primary)]"
        />
      ) : null}
      <Icon className={s.iconClass} aria-hidden />
      <span className={s.labelClass}>{item.label}</span>
    </Link>
  );
}
