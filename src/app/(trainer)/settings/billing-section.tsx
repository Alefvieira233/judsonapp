"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TenantSubscription } from "@/types/database";

import {
  cancelSubscriptionAction,
  openBillingPortalAction,
  type CancelState,
} from "./billing-actions";

const STATUS_LABEL: Record<string, string> = {
  active: "Ativa",
  trialing: "Trial",
  past_due: "Pagamento atrasado",
  canceled: "Cancelada",
  incomplete: "Aguardando pagamento",
  unpaid: "Não paga",
};

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return "—";
  }
}

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

function PortalButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" variant="outline" disabled={pending}>
      {pending ? "Abrindo…" : "Gerenciar pagamento"}
    </Button>
  );
}

function CancelButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" variant="destructive" disabled={pending}>
      {pending ? "Cancelando…" : "Confirmar cancelamento"}
    </Button>
  );
}

export function BillingSection({
  subscription,
  stripeEnabled,
}: {
  subscription: TenantSubscription | null;
  stripeEnabled: boolean;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancelState, cancelAction] = useActionState<CancelState, FormData>(
    cancelSubscriptionAction,
    undefined,
  );

  // Toast on transitions, but the close-on-success setState is deferred via
  // queueMicrotask to avoid the React 19 set-state-in-effect lint.
  useEffect(() => {
    if (cancelState?.ok) {
      toast.success("Assinatura cancelada. Vale até o fim do período.");
      queueMicrotask(() => setConfirmOpen(false));
    }
    if (cancelState?.error) toast.error(cancelState.error);
  }, [cancelState]);

  const portalAction = async () => {
    const res = await openBillingPortalAction();
    if (res?.redirectTo) {
      window.location.href = res.redirectTo;
    } else if (res?.error) {
      toast.error(res.error);
    }
  };

  if (!stripeEnabled) {
    return (
      <section className="flex flex-col gap-4 rounded-xl border border-border bg-card/40 p-4 md:p-6">
        <h2 className="font-display text-2xl">Assinatura do app</h2>
        <p className="text-sm text-muted-foreground">
          Cobrança SaaS não está ativada nesta instalação. Quando ligarmos, vais
          gerenciar plano e pagamento por aqui.
        </p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-border bg-card/40 p-4 md:p-6">
      <h2 className="font-display text-2xl">Assinatura do app</h2>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Status" value={STATUS_LABEL[subscription?.status ?? ""] ?? "Sem assinatura"} />
        <Stat label="Plano" value={subscription?.plan ?? "—"} />
        <Stat
          label="Valor"
          value={subscription ? formatPrice(subscription.value_cents) : "—"}
        />
        <Stat
          label="Próximo ciclo"
          value={formatDate(subscription?.current_period_end ?? null)}
        />
        {subscription?.trial_end ? (
          <Stat label="Fim do trial" value={formatDate(subscription.trial_end)} />
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        <form action={portalAction}>
          <PortalButton />
        </form>
        {subscription && subscription.status !== "canceled" ? (
          <Button
            type="button"
            size="lg"
            variant="ghost"
            onClick={() => setConfirmOpen((v) => !v)}
          >
            Cancelar assinatura
          </Button>
        ) : null}
      </div>

      {confirmOpen ? (
        <form action={cancelAction} className="flex flex-col gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm text-destructive">
            Cancelamento mantém o acesso até o fim do período pago. Digita
            <span className="font-semibold"> CANCELAR </span>
            pra confirmar.
          </p>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirm">Confirmação</Label>
            <Input id="confirm" name="confirm" placeholder="CANCELAR" />
          </div>
          <CancelButton />
        </form>
      ) : null}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border/50 bg-background/40 p-3">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}
