import { buttonVariants } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 px-6 py-16 text-center">
      <header className="flex flex-col items-center gap-4">
        <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
          CREF 002133-G/AP
        </span>
        <h1 className="font-display text-6xl leading-none text-foreground sm:text-8xl">
          Judson Lobato
        </h1>
        <p className="max-w-md text-base text-muted-foreground">
          Personal trainer há 16 anos. Atleta e técnico de natação.
          <br />
          <span className="text-foreground">Faz o teu que eu faço o meu.</span>
        </p>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row">
        <a href="/login" className={buttonVariants({ size: "lg" })}>
          Acessar painel
        </a>
        <a
          href="https://instagram.com/judsonlobato"
          target="_blank"
          rel="noreferrer"
          className={buttonVariants({ size: "lg", variant: "outline" })}
        >
          @judsonlobato
        </a>
      </div>

      <footer className="text-xs text-muted-foreground">
        Macapá — AP · A partir de R$ 300/mês
      </footer>
    </main>
  );
}
