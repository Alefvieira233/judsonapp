"use client";

import { LogOutIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { LogoutForm } from "@/components/logout-form";
import { Separator } from "@/components/ui/separator";

import { logoutAction } from "../actions";
import { NavLink } from "./nav-link";
import { ALL_ITEMS } from "./nav-routes";

export function Sidebar({
  tenantName,
  userName,
  userInitial,
  className,
}: {
  tenantName: string;
  userName: string;
  userInitial: string;
  className?: string;
}) {
  return (
    <aside
      aria-label="Navegação"
      className={cn(
        "fixed inset-y-0 left-0 z-30 w-60 flex-col border-r border-border bg-card/40",
        className,
      )}
    >
      <div className="flex items-center gap-3 px-4 py-5">
        <span className="grid size-9 place-items-center rounded-md bg-[var(--brand-primary)] font-display text-lg text-white">
          {Array.from(tenantName)[0]?.toUpperCase()}
        </span>
        <div className="flex min-w-0 flex-col">
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Painel
          </span>
          <span className="truncate font-display text-base leading-tight">
            {tenantName}
          </span>
        </div>
      </div>

      <Separator />

      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <ul className="flex flex-col gap-1">
          {ALL_ITEMS.map((item) => (
            <li key={item.href}>
              <NavLink item={item} variant="sidebar" />
            </li>
          ))}
        </ul>
      </nav>

      <Separator />

      <div className="flex flex-col gap-2 px-2 py-3">
        <div className="flex items-center gap-3 px-3 py-1">
          <span className="grid size-7 place-items-center rounded-full bg-card font-display text-xs text-foreground">
            {userInitial.toUpperCase()}
          </span>
          <span className="truncate text-xs text-muted-foreground">
            {userName}
          </span>
        </div>
        <LogoutForm action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
          >
            <LogOutIcon className="size-4" aria-hidden />
            Sair
          </button>
        </LogoutForm>
      </div>
    </aside>
  );
}
