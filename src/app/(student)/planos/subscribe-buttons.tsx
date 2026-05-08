"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";

import { subscribeToPlanAction } from "./actions";

type Method = "PIX" | "CREDIT_CARD" | "BOLETO";

const METHODS: { id: Method; label: string }[] = [
  { id: "PIX", label: "Pix recorrente" },
  { id: "CREDIT_CARD", label: "Cartão" },
  { id: "BOLETO", label: "Boleto" },
];

export function SubscribeButtons({
  planId,
  highlight,
}: {
  planId: string;
  highlight: boolean;
}) {
  const [pending, start] = useTransition();
  const [busy, setBusy] = useState<Method | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handle(method: Method) {
    if (pending) return;
    setError(null);
    setBusy(method);
    start(async () => {
      const res = await subscribeToPlanAction({
        plan_id: planId,
        billing_type: method,
      });
      setBusy(null);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      // Abre numa aba nova pra a aluna não perder a sessão. Fallback se popup
      // for bloqueado: redireciona na própria aba.
      const opened = window.open(res.checkoutUrl, "_blank", "noopener,noreferrer");
      if (!opened) window.location.href = res.checkoutUrl;
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="grid gap-2 sm:grid-cols-3">
        {METHODS.map((m) => (
          <Button
            key={m.id}
            type="button"
            size="lg"
            variant={highlight && m.id === "PIX" ? "default" : "outline"}
            onClick={() => handle(m.id)}
            disabled={pending}
            className="w-full"
          >
            {busy === m.id ? "Abrindo..." : m.label}
          </Button>
        ))}
      </div>
      {error ? (
        <p className="text-xs text-[var(--brand-primary)]">{error}</p>
      ) : null}
    </div>
  );
}
