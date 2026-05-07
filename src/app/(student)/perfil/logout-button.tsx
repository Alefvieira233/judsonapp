"use client";

import { useTransition } from "react";
import { LogOutIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { logoutAction } from "./actions";

export function LogoutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="lg"
      className="w-full text-muted-foreground hover:text-foreground"
      disabled={pending}
      onClick={() => startTransition(() => logoutAction())}
    >
      <LogOutIcon className="size-4" aria-hidden />
      {pending ? "Saindo…" : "Sair"}
    </Button>
  );
}
