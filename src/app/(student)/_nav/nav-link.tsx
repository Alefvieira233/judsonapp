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
        "relative flex min-h-[56px] flex-col items-center justify-center gap-1 px-1 transition-colors",
        active ? "text-foreground" : "text-muted-foreground",
      )}
    >
      {active ? (
        <span
          aria-hidden
          className="absolute top-0 h-0.5 w-10 rounded-b-full bg-[var(--brand-primary)]"
        />
      ) : null}
      <Icon className="size-5" aria-hidden />
      <span className="text-[11px] leading-none">{item.label}</span>
    </Link>
  );
}
