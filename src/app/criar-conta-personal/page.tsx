import { getTranslations } from "next-intl/server";

import { CreateTenantForm } from "./create-tenant-form";

export async function generateMetadata() {
  const t = await getTranslations("signup");
  return {
    title: t("metadata_title"),
    description: t("metadata_description"),
  };
}

export default async function CreatePersonalAccountPage({
  searchParams,
}: {
  searchParams?: Promise<{ canceled?: string }>;
}) {
  const t = await getTranslations("signup");

  return (
    <main className="min-h-[100dvh] bg-background">
      <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-10 md:grid-cols-[1fr_minmax(320px,420px)] md:px-6 md:py-16">
        <header className="flex flex-col gap-5">
          <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
            {t("eyebrow")}
          </span>
          <h1 className="font-display text-5xl leading-[0.9] md:text-7xl">
            {t("title")}
          </h1>
          <p className="max-w-xl text-base text-muted-foreground">{t("subtitle")}</p>
          <ul className="grid gap-2 text-sm text-foreground/90">
            <li>{t("feature_1")}</li>
            <li>{t("feature_2")}</li>
            <li>{t("feature_3")}</li>
            <li>{t("feature_4")}</li>
            <li>{t("feature_5")}</li>
          </ul>
          <CanceledBanner searchParams={searchParams} />
        </header>

        <CreateTenantForm />
      </section>
    </main>
  );
}

async function CanceledBanner({
  searchParams,
}: {
  searchParams?: Promise<{ canceled?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  if (sp.canceled !== "1") return null;
  const t = await getTranslations("signup");
  return (
    <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
      {t("canceled")}
    </p>
  );
}
