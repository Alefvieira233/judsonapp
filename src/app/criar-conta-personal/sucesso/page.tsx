import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { buttonVariants } from "@/components/ui/button";

export async function generateMetadata() {
  const t = await getTranslations("signup");
  return { title: t("success_metadata_title") };
}

export default async function CreateSuccessPage({
  searchParams,
}: {
  searchParams?: Promise<{ slug?: string; trial?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const isTrial = sp.trial === "1";
  const t = await getTranslations("signup");

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
        {isTrial ? t("success_eyebrow_trial") : t("success_eyebrow_paid")}
      </span>
      <h1 className="font-display text-5xl leading-none md:text-7xl">
        {t("success_title")}
      </h1>
      <p className="max-w-md text-sm text-muted-foreground">{t("success_body")}</p>
      {sp.slug ? (
        <p className="text-xs text-muted-foreground">
          {t("success_url_label")}{" "}
          <span className="font-mono">{sp.slug}.judsonapp.com.br</span>
        </p>
      ) : null}
      <Link href="/" className={buttonVariants({ size: "lg", variant: "outline" })}>
        {t("success_back")}
      </Link>
    </main>
  );
}
