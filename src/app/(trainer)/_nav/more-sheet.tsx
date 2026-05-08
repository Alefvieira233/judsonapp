"use client";

import { useState } from "react";
import { LogOutIcon, MoreHorizontalIcon } from "lucide-react";

import { LogoutForm } from "@/components/logout-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { logoutAction } from "../actions";
import { NavLink } from "./nav-link";
import { MORE_ITEMS } from "./nav-routes";

export function MoreNavItem() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <button
            type="button"
            className="relative flex min-h-[44px] flex-col items-center justify-center gap-1 px-1 text-muted-foreground transition-colors aria-pressed:text-foreground"
          />
        }
      >
        <MoreHorizontalIcon className="size-5" aria-hidden />
        <span className="text-[11px] leading-none">Mais</span>
      </SheetTrigger>

      <SheetContent
        side="bottom"
        className="rounded-t-2xl border-border bg-card pb-[calc(env(safe-area-inset-bottom)+1rem)]"
      >
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">Mais opções</SheetTitle>
          <SheetDescription>Configurações e sessão.</SheetDescription>
        </SheetHeader>

        <nav className="flex flex-col gap-1 px-2">
          {MORE_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              variant="sidebar"
              onSelect={() => setOpen(false)}
            />
          ))}
        </nav>

        <LogoutForm action={logoutAction} className="px-2">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
          >
            <LogOutIcon className="size-4" aria-hidden />
            Sair
          </button>
        </LogoutForm>
      </SheetContent>
    </Sheet>
  );
}
