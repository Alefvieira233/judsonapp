import { CheckIcon, SparklesIcon } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { isAsaasEnabled } from "@/lib/asaas";
import { getCurrentStudent } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

import { SubscribeButtons } from "./subscribe-buttons";

export async function generateMetadata() {
  const t = await getTranslations("plans");
  return { title: t("metadata_title") };
}

type PlanRow = {
  id: string;
  name: string;
  tagline: string | null;
  description: string | null;
  price_label: string | null;
  features: string[] | null;
  cta_label: string | null;
  highlight: boolean | null;
  display_order: number | null;
};

type SubscriptionRow = {
  id: string;
  plan_id: string | null;
  status: string;
  current_period_end: string | null;
};

function whatsappLink(number: string, message: string): string {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

function formatNextBilling(iso: string | null, locale: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(locale, { day: "2-digit", month: "2-digit" });
}

export default async function StudentPlansPage() {
  const session = await getCurrentStudent();
  if (!session) return null;
  const { profile, tenant } = session;
  const t = await getTranslations("plans");
  const locale = await getLocale();
  const asaasEnabled = isAsaasEnabled();
  const trainerFirst = tenant.name.split(" ")[0] ?? tenant.name;

  const supabase = await createClient();
  const [plansRes, subRes] = await Promise.all([
    supabase
      .from("plans")
      .select(
        "id, name, tagline, description, price_label, features, cta_label, highlight, display_order",
      )
      .eq("tenant_id", tenant.id)
      .eq("active", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true })
      .returns<PlanRow[]>(),
    supabase
      .from("subscriptions")
      .select("id, plan_id, status, current_period_end")
      .eq("student_id", profile.id)
      .in("status", ["active", "past_due", "pending"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const plans = plansRes.data ?? [];
  const sub = subRes.data as SubscriptionRow | null;

  return (
    <section className="flex flex-1 flex-col gap-6 px-5 pb-8 pt-6">
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={
          asaasEnabled
            ? t("subtitle_payments", { trainer: trainerFirst })
            : t("subtitle_whatsapp", { trainer: trainerFirst })
        }
        back={{ href: "/perfil", label: t("back_to_profile") }}
      />

      {plans.length === 0 ? (
        <EmptyState title={t("title")} description={t("empty")} />
      ) : (
        <ul className="flex flex-col gap-3">
          {plans.map((plan) => {
            const isCurrent = profile.current_plan_id === plan.id;
            const planSub = sub && sub.plan_id === plan.id ? sub : null;
            const nextBilling = formatNextBilling(
              planSub?.current_period_end ?? null,
              locale,
            );
            const message = t("wa_message", {
              trainer: trainerFirst,
              plan: plan.name,
            });
            return (
              <li
                key={plan.id}
                className={`relative flex flex-col gap-4 overflow-hidden rounded-2xl border p-5 ${
                  plan.highlight
                    ? "border-[var(--brand-primary)]/50 bg-gradient-to-br from-[var(--brand-primary)]/15 via-card/50 to-card/40"
                    : "border-border bg-card/40"
                }`}
              >
                {plan.highlight ? (
                  <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-[var(--brand-primary)] px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-white">
                    <SparklesIcon className="size-3" /> {t("popular")}
                  </span>
                ) : null}

                <header className="flex flex-col gap-1">
                  <span className="font-display text-2xl leading-tight">
                    {plan.name}
                  </span>
                  {plan.tagline ? (
                    <span className="text-sm text-muted-foreground">
                      {plan.tagline}
                    </span>
                  ) : null}
                </header>

                {plan.price_label ? (
                  <p className="font-display text-4xl leading-none text-[var(--brand-primary)]">
                    {plan.price_label}
                  </p>
                ) : null}

                {plan.description ? (
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                ) : null}

                {plan.features && plan.features.length > 0 ? (
                  <ul className="flex flex-col gap-1.5">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckIcon className="mt-0.5 size-4 shrink-0 text-[var(--brand-primary)]" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {isCurrent ? (
                  <div className="rounded-md border border-[var(--brand-primary)]/40 bg-[var(--brand-primary)]/10 px-3 py-2 text-xs text-foreground">
                    {t("current_plan")}
                    {nextBilling ? (
                      <span className="ml-1 text-muted-foreground">
                        {" "}
                        {t("next_billing", { date: nextBilling })}
                      </span>
                    ) : null}
                  </div>
                ) : asaasEnabled ? (
                  <SubscribeButtons
                    planId={plan.id}
                    highlight={Boolean(plan.highlight)}
                  />
                ) : (
                  <a
                    href={whatsappLink(tenant.whatsapp_number, message)}
                    target="_blank"
                    rel="noreferrer"
                    className={buttonVariants({
                      size: "lg",
                      variant: plan.highlight ? "default" : "outline",
                      className: "w-full",
                    })}
                  >
                    {plan.cta_label ?? t("default_cta")}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <p className="text-center text-xs text-muted-foreground">
        {asaasEnabled
          ? t("footer_payments")
          : t("footer_whatsapp", { trainer: trainerFirst })}
      </p>
    </section>
  );
}
