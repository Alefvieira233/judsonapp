"use client";

import Link from "next/link";
import { useEffect } from "react";

// Last-resort fallback for errors that escape every other error boundary —
// including ones thrown in the root layout. Required by Next 16 production
// checklist (02-guides/production-checklist.md). Forwards to Sentry when
// configured. No nested layouts here; the file replaces <html> entirely.

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Defer the Sentry import so we don't pull it into bundles that don't
    // need it. This file ships in every page error path.
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      import("@sentry/nextjs").then((Sentry) => Sentry.captureException(error));
    }
  }, [error]);

  return (
    <html lang="pt-BR">
      <body className="dark min-h-screen bg-[#0A0A0A] text-[#FAFAFA] antialiased">
        <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-6 px-6 py-16 text-center">
          <span className="grid size-16 place-items-center rounded-2xl bg-[#DC2626] text-3xl">
            !
          </span>
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-3xl">Algo deu errado</h1>
            <p className="text-sm text-zinc-400">
              Não conseguimos carregar essa parte agora. Tenta novamente — se
              persistir, manda esse código pro suporte:
            </p>
            {error.digest ? (
              <code className="mx-auto rounded bg-white/5 px-2 py-1 text-xs text-zinc-300">
                {error.digest}
              </code>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={reset}
              className="inline-flex h-12 min-w-[200px] items-center justify-center rounded-lg bg-[#DC2626] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#B91C1C] active:scale-[0.98]"
            >
              Tentar de novo
            </button>
            <Link
              href="/"
              className="text-xs text-zinc-400 underline-offset-4 hover:text-zinc-200 hover:underline"
            >
              Voltar pra home
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
