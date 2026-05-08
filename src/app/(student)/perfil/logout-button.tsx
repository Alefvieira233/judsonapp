"use client";

import { useTransition } from "react";
import { LogOutIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { logoutAction } from "./actions";

function notifyServiceWorkerOfLogout() {
  if (typeof navigator !== "undefined" && navigator.serviceWorker?.controller) {
    try {
      navigator.serviceWorker.controller.postMessage({ type: "logout" });
    } catch {
      // Silent — signOut still proceeds.
    }
  }
}

export function LogoutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="lg"
      className="w-full text-muted-foreground hover:text-foreground"
      disabled={pending}
      onClick={() => {
        notifyServiceWorkerOfLogout();
        startTransition(() => logoutAction());
      }}
    >
      <LogOutIcon className="size-4" aria-hidden />
      {pending ? "Saindo…" : "Sair"}
    </Button>
  );
}
