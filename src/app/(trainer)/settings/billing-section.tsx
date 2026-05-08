"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
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

function formatDate(iso: string | null, locale: string): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return "—";
  }
}

function formatPrice(cents: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

function PortalButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("settings");
  return (
    <Button type="submit" size="lg" variant="outline" disabled={pending}>
      {pending ? t("billing_portal_loading") : t("billing_portal")}
    </Button>
  );
}

function CancelButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("settings");
  return (
    <Button type="submit" size="lg" variant="destructive" disabled={pending}>
      {pending ? t("billing_cancelling") : t("billing_cancel_confirm")}
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
  const t = useTranslations("settings");
  const locale = useLocale();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancelState, cancelAction] = useActionState<CancelState, FormData>(
    cancelSubscriptionAction,
    undefined,
  );

  const STATUS_LABEL: Record<string, string> = {
    active: t("billing_status_active"),
    trialing: t("billing_status_trialing"),
    past_due: t("billing_status_past_due"),
    canceled: t("billing_status_canceled"),
    incomplete: t("billing_status_incomplete"),
    unpaid: t("billing_status_unpaid"),
  };

  // Toast on transitions, but the close-on-success setState is deferred via
  // queueMicrotask to avoid the React 19 set-state-in-effect lint.
  useEffect(() => {
    if (cancelState?.ok) {
      toast.success(t("billing_cancelled_toast"));
      queueMicrotask(() => setConfirmOpen(false));
    }
    if (cancelState?.error) toast.error(cancelState.error);
  }, [cancelState, t]);

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
        <h2 className="font-display text-2xl">{t("billing_title")}</h2>
        <p className="text-sm text-muted-foreground">{t("billing_disabled")}</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-border bg-card/40 p-4 md:p-6">
      <h2 className="font-display text-2xl">{t("billing_title")}</h2>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat
          label={t("billing_status")}
          value={STATUS_LABEL[subscription?.status ?? ""] ?? t("billing_no_sub")}
        />
        <Stat label={t("billing_plan")} value={subscription?.plan ?? "—"} />
        <Stat
          label={t("billing_value")}
          value={subscription ? formatPrice(subscription.value_cents, locale) : "—"}
        />
        <Stat
          label={t("billing_next")}
          value={formatDate(subscription?.current_period_end ?? null, locale)}
        />
        {subscription?.trial_end ? (
          <Stat
            label={t("billing_trial_end")}
            value={formatDate(subscription.trial_end, locale)}
          />
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
            {t("billing_cancel")}
          </Button>
        ) : null}
      </div>

      {confirmOpen ? (
        <form
          action={cancelAction}
          className="flex flex-col gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4"
        >
          <p className="text-sm text-destructive">
            {t.rich("billing_cancel_help", {
              strong: (chunks) => <span className="font-semibold"> {chunks} </span>,
            })}
          </p>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirm">{t("billing_cancel_label")}</Label>
            <Input
              id="confirm"
              name="confirm"
              placeholder={t("billing_cancel_placeholder")}
            />
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
