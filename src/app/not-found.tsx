import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { buttonVariants } from "@/components/ui/button";

export async function generateMetadata() {
  const t = await getTranslations("errors");
  return { title: t("not_found_metadata_title") };
}

export default async function NotFound() {
  const t = await getTranslations("errors");
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-5 px-6 py-16 text-center">
      <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
        {t("not_found_eyebrow")}
      </span>
      <h1 className="font-display text-5xl leading-[0.9]">{t("not_found_title")}</h1>
      <p className="max-w-sm text-sm text-muted-foreground">{t("not_found_body")}</p>
      <Link href="/" className={buttonVariants({ size: "lg" })}>
        {t("back_home")}
      </Link>
    </main>
  );
}
