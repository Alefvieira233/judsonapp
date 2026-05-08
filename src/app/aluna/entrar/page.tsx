import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { createClient } from "@/lib/supabase/server";

import { StudentLoginForm } from "./login-form";

export async function generateMetadata() {
  const t = await getTranslations("auth");
  return { title: `${t("submit")} — ${t("student_eyebrow")}` };
}

export default async function StudentLoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/welcome");

  const t = await getTranslations("auth");
  const tc = await getTranslations("common");

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section className="flex w-full max-w-sm flex-col gap-8">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="size-3.5" /> {tc("back")}
        </Link>

        <header className="flex flex-col gap-2 text-center">
          <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
            {t("student_eyebrow")}
          </span>
          <h1 className="font-display text-5xl leading-none">
            {t("student_title")}
          </h1>
        </header>

        <StudentLoginForm />

        <p className="text-center text-xs text-muted-foreground">
          {t("trainer_link")}{" "}
          <Link href="/login" className="text-foreground underline">
            {t("trainer_link_cta")}
          </Link>
          .
        </p>

        <p className="text-center text-[11px] text-muted-foreground/80">
          {t("student_terms_prefix")}{" "}
          <Link href="/termos" className="text-foreground/80 underline">
            {t("terms")}
          </Link>{" "}
          {t("terms_and")}{" "}
          <Link href="/privacidade" className="text-foreground/80 underline">
            {t("privacy")}
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
