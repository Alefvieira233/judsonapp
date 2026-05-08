import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { createClient } from "@/lib/supabase/server";

import { LoginForm } from "./login-form";

export async function generateMetadata() {
  const t = await getTranslations("auth");
  return { title: t("submit") };
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect(next || "/dashboard");

  const t = await getTranslations("auth");

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section className="flex w-full max-w-sm flex-col gap-8">
        <header className="flex flex-col gap-2 text-center">
          <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
            {t("trainer_eyebrow")}
          </span>
          <h1 className="font-display text-5xl leading-none">Judson Lobato</h1>
        </header>

        <LoginForm next={next} />

        <p className="text-center text-xs text-muted-foreground">
          {t("student_link")}{" "}
          <a href="/aluna/entrar" className="text-foreground underline">
            {t("student_link_cta")}
          </a>{" "}
          {t("student_link_suffix")}
        </p>

        <p className="text-center text-[11px] text-muted-foreground/80">
          {t("terms_prefix")}{" "}
          <a href="/termos" className="text-foreground/80 underline">
            {t("terms")}
          </a>{" "}
          {t("terms_and")}{" "}
          <a href="/privacidade" className="text-foreground/80 underline">
            {t("privacy")}
          </a>
          .
        </p>
      </section>
    </main>
  );
}
