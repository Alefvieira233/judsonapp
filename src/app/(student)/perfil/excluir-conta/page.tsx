import Link from "next/link";
import { ArrowLeftIcon, AlertTriangleIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { getCurrentStudent } from "@/lib/auth";

import { deleteOwnAccountAction } from "./actions";

export async function generateMetadata() {
  const t = await getTranslations("deleteAccount");
  return { title: t("metadata_title") };
}

export default async function DeleteAccountPage() {
  const session = await getCurrentStudent();
  if (!session) return null;
  const t = await getTranslations("deleteAccount");
  const trainerFirst = session.tenant.name.split(" ")[0] ?? session.tenant.name;

  return (
    <section className="flex flex-1 flex-col gap-6 px-5 pb-8 pt-8">
      <Link
        href="/perfil"
        className="inline-flex w-fit items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3.5" /> {t("back_to_profile")}
      </Link>

      <header className="flex flex-col gap-2">
        <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          {t("eyebrow")}
        </span>
        <h1 className="font-display text-3xl leading-tight">{t("title")}</h1>
      </header>

      <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
        <AlertTriangleIcon
          className="mt-0.5 size-5 shrink-0 text-destructive"
          aria-hidden
        />
        <div className="flex flex-col gap-1.5 text-muted-foreground">
          <p className="text-foreground">{t("permanent")}</p>
          <p>{t("on_confirm")}</p>
          <ul className="list-disc pl-5">
            <li>{t("bullet_anonymize")}</li>
            <li>{t("bullet_posts")}</li>
            <li>{t("bullet_history")}</li>
            <li>{t("bullet_logout")}</li>
          </ul>
          <p className="pt-2">{t("reentry", { trainer: trainerFirst })}</p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        {t.rich("before_delete", {
          export: (chunks) => (
            <Link
              href="/perfil/dados"
              className="text-foreground underline-offset-2 hover:underline"
            >
              {chunks}
            </Link>
          ),
        })}
      </p>

      <form action={deleteOwnAccountAction} className="flex flex-col gap-3">
        <Button
          type="submit"
          variant="destructive"
          size="lg"
          className="w-full"
        >
          {t("confirm")}
        </Button>
        <Link
          href="/perfil"
          className="text-center text-xs text-muted-foreground hover:text-foreground"
        >
          {t("cancel")}
        </Link>
      </form>
    </section>
  );
}
