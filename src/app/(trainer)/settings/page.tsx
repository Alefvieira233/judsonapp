import { getTranslations } from "next-intl/server";

import { LocaleSwitcher } from "@/components/locale-switcher";
import { getCurrentProfile } from "@/lib/auth";
import { isStripeEnabled } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import type { TenantSubscription } from "@/types/database";

import { BillingSection } from "./billing-section";
import { SettingsForm } from "./settings-form";

export async function generateMetadata() {
  const t = await getTranslations("settings");
  return { title: t("metadata_title") };
}

export default async function SettingsPage() {
  const session = await getCurrentProfile();
  if (!session) return null;
  const { tenant } = session;
  const t = await getTranslations("settings");

  const supabase = await createClient();
  const { data: sub } = await supabase
    .from("tenant_subscriptions")
    .select("*")
    .eq("tenant_id", tenant.id)
    .maybeSingle();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 md:gap-8 md:px-6 md:py-10">
      <header className="flex flex-col gap-1">
        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          {t("eyebrow")}
        </span>
        <h1 className="font-display text-4xl leading-none md:text-5xl">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </header>

      <SettingsForm tenant={tenant} />

      <LanguageSection />

      <BillingSection
        subscription={sub as TenantSubscription | null}
        stripeEnabled={isStripeEnabled()}
      />
    </div>
  );
}

async function LanguageSection() {
  const tc = await getTranslations("common");
  return (
    <section className="flex flex-col gap-2 rounded-2xl border border-border bg-card/30 p-5">
      <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
        {tc("language_app")}
      </span>
      <LocaleSwitcher />
    </section>
  );
}
