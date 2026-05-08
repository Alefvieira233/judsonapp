import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export const metadata = { title: "Conta criada" };

export default async function CreateSuccessPage({
  searchParams,
}: {
  searchParams?: Promise<{ slug?: string; trial?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const isTrial = sp.trial === "1";

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
        {isTrial ? "Trial ativado" : "Pagamento confirmado"}
      </span>
      <h1 className="font-display text-5xl leading-none md:text-7xl">
        Bem-vindo ao seu app
      </h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Mandamos um link mágico pro teu email pra entrares no painel sem senha.
        Confere a caixa de entrada (e o spam) e clica no link em até 1 hora.
      </p>
      {sp.slug ? (
        <p className="text-xs text-muted-foreground">
          Tua URL: <span className="font-mono">{sp.slug}.judsonapp.com.br</span>
        </p>
      ) : null}
      <Link href="/" className={buttonVariants({ size: "lg", variant: "outline" })}>
        Voltar pra home
      </Link>
    </main>
  );
}
