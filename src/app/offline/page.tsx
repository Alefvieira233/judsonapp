import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("errors");
  return { title: t("offline_metadata_title") };
}

export default async function OfflinePage() {
  const t = await getTranslations("errors");
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
        {t("offline_eyebrow")}
      </span>
      <h1 className="font-display text-5xl leading-none">{t("offline_title")}</h1>
      <p className="max-w-sm text-sm text-muted-foreground">{t("offline_body")}</p>
    </main>
  );
}
