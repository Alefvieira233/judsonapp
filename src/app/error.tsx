"use client";

import { useEffect } from "react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app.error]", error);
  }, [error]);

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-5 px-6 py-16 text-center">
      <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
        Ops
      </span>
      <h1 className="font-display text-5xl leading-[0.9]">Algo quebrou</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        Tenta de novo. Se persistir, manda print pro Judson no WhatsApp.
      </p>
      {error.digest ? (
        <p className="font-mono text-[10px] text-muted-foreground">
          ref: {error.digest}
        </p>
      ) : null}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={reset}
          className={buttonVariants({ size: "lg" })}
        >
          Tentar de novo
        </button>
        <Link
          href="/home"
          className={buttonVariants({ variant: "ghost", size: "lg" })}
        >
          Voltar pra início
        </Link>
      </div>
    </main>
  );
}
