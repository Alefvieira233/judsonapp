import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export const metadata = { title: "Página não encontrada" };

export default function NotFound() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-5 px-6 py-16 text-center">
      <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
        404
      </span>
      <h1 className="font-display text-5xl leading-[0.9]">Não encontrei</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        Esse link não existe ou foi movido.
      </p>
      <Link href="/" className={buttonVariants({ size: "lg" })}>
        Voltar pra início
      </Link>
    </main>
  );
}
