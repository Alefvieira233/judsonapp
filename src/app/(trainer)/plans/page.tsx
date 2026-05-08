import Link from "next/link";
import { CheckIcon, PlusIcon, SparklesIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata() {
  const t = await getTranslations("trainerPlans");
  return { title: t("metadata_title") };
}

type PlanRow = {
  id: string;
  name: string;
  tagline: string | null;
  price_label: string | null;
  features: string[] | null;
  highlight: boolean | null;
  display_order: number | null;
  active: boolean | null;
  subscribers: { count: number }[];
};

export default async function PlansPage() {
  const session = await getCurrentProfile();
  if (!session) return null;
  const t = await getTranslations("trainerPlans");

  const supabase = await createClient();
  const { data } = await supabase
    .from("plans")
    .select(
      `id, name, tagline, price_label, features, highlight, display_order, active,
       subscribers:profiles!profiles_current_plan_id_fkey(count)`,
    )
    .eq("tenant_id", session.tenant.id)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true })
    .returns<PlanRow[]>();

  const plans = data ?? [];

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6 md:gap-8 md:px-6 md:py-10">
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t.rich("subtitle", {
          code: (chunks) => <span className="text-foreground">{chunks}</span>,
        })}
        trailing={
          <Link
            href="/plans/new"
            className={buttonVariants({ size: "lg", className: "w-full md:w-auto gap-2" })}
          >
            <PlusIcon className="size-4" /> {t("new_plan")}
          </Link>
        }
      />

      {plans.length === 0 ? (
        <EmptyState
          title={t("empty_title")}
          description={t("empty_body")}
          action={
            <Link
              href="/plans/new"
              className={buttonVariants({ size: "lg", className: "gap-2" })}
            >
              <PlusIcon className="size-4" /> {t("new_plan")}
            </Link>
          }
        />
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {plans.map((plan) => {
            const subscriberCount = plan.subscribers?.[0]?.count ?? 0;
            return (
              <li key={plan.id}>
                <Link
                  href={`/plans/${plan.id}`}
                  className={`flex h-full flex-col gap-3 rounded-2xl border p-5 transition-colors ${
                    plan.highlight
                      ? "border-[var(--brand-primary)]/40 bg-gradient-to-br from-[var(--brand-primary)]/10 to-card/40 hover:border-[var(--brand-primary)]/60"
                      : "border-border bg-card/40 hover:bg-card/60"
                  }`}
                >
                  <header className="flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="font-display text-2xl leading-tight">
                        {plan.name}
                      </span>
                      {plan.tagline ? (
                        <span className="text-xs text-muted-foreground">
                          {plan.tagline}
                        </span>
                      ) : null}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {plan.highlight ? (
                        <Badge variant="default" className="gap-1">
                          <SparklesIcon className="size-3" /> {t("highlight")}
                        </Badge>
                      ) : null}
                      {!plan.active ? (
                        <Badge variant="outline" className="text-muted-foreground">
                          {t("inactive")}
                        </Badge>
                      ) : null}
                    </div>
                  </header>

                  {plan.price_label ? (
                    <p className="font-display text-3xl text-[var(--brand-primary)]">
                      {plan.price_label}
                    </p>
                  ) : null}

                  {plan.features && plan.features.length > 0 ? (
                    <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
                      {plan.features.slice(0, 4).map((f, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckIcon className="mt-0.5 size-3.5 shrink-0 text-[var(--brand-primary)]" />
                          <span className="text-foreground/80">{f}</span>
                        </li>
                      ))}
                      {plan.features.length > 4 ? (
                        <li className="text-xs text-muted-foreground">
                          {t("more_features", { count: plan.features.length - 4 })}
                        </li>
                      ) : null}
                    </ul>
                  ) : null}

                  <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                    <span>
                      {subscriberCount === 1
                        ? t("subscribers_one", { count: subscriberCount })
                        : t("subscribers_other", { count: subscriberCount })}
                    </span>
                    <span>{t("edit")}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
