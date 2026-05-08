"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { buttonVariants } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors");

  useEffect(() => {
    // Client-side error boundary: `@/lib/logger` is `server-only`, and Sentry's
    // browser SDK already auto-captures unhandled errors via `error.digest`.
    // The console.error here is a deliberate dev-mode aid + Vercel runtime log
    // breadcrumb; it stays.
    console.error("[app.error]", error);
  }, [error]);

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-5 px-6 py-16 text-center">
      <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
        {t("ops")}
      </span>
      <h1 className="font-display text-5xl leading-[0.9]">{t("broken")}</h1>
      <p className="max-w-sm text-sm text-muted-foreground">{t("broken_body")}</p>
      {error.digest ? (
        <p className="font-mono text-[10px] text-muted-foreground">
          {t("ref")} {error.digest}
        </p>
      ) : null}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={reset}
          className={buttonVariants({ size: "lg" })}
        >
          {t("retry")}
        </button>
        <Link
          href="/home"
          className={buttonVariants({ variant: "ghost", size: "lg" })}
        >
          {t("back_home")}
        </Link>
      </div>
    </main>
  );
}
