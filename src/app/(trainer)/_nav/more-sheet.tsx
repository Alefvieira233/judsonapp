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
} from "@/components/ui/sheet";

import { logoutAction } from "../actions";
import { NavLink } from "./nav-link";
import { MORE_ITEMS } from "./nav-routes";

// Nota: voltamos pra um botão controlado direto que chama setOpen(true).
// Trigger via `render={<button/>}` + `children` no Sheet do Base UI estava
// engolindo o onClick em alguns navegadores mobile — o "Mais" não abria.
// Estado controlado é mais previsível e mantém a mesma UX.
export function MoreNavItem() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="relative flex min-h-[44px] w-full flex-col items-center justify-center gap-1 px-1 text-muted-foreground transition-colors active:scale-95 active:text-foreground"
      >
        <MoreHorizontalIcon className="size-5" aria-hidden />
        <span className="text-[11px] leading-none">Mais</span>
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="border-border bg-card">
          <SheetHeader>
            <SheetTitle className="font-display text-2xl">
              Mais opções
            </SheetTitle>
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
    </>
  );
}
