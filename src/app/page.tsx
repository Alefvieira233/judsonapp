import { getTranslations } from "next-intl/server";

import { buttonVariants } from "@/components/ui/button";
import { isMultiTenantEnabled } from "@/lib/tenant";

export default async function HomePage() {
  if (isMultiTenantEnabled()) return <SaaSLanding />;
  return <ClienteZeroLanding />;
}

async function ClienteZeroLanding() {
  const t = await getTranslations("landing");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 px-6 py-16 text-center">
      <header className="flex flex-col items-center gap-4">
        <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
          {t("cref")}
        </span>
        <h1 className="font-display text-6xl leading-none text-foreground sm:text-8xl">
          Judson Lobato
        </h1>
        <p className="max-w-md text-base text-muted-foreground">
          {t("tagline")}
          <br />
          <span className="text-foreground">{t("slogan")}</span>
        </p>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row">
        <a href="/login" className={buttonVariants({ size: "lg" })}>
          {t("cta_panel")}
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

      <footer className="text-xs text-muted-foreground">{t("footer")}</footer>
    </main>
  );
}

function SaaSLanding() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 px-6 py-16 text-center">
      <header className="flex flex-col items-center gap-4">
        <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
          App de personal trainer · white-label
        </span>
        <h1 className="font-display text-6xl leading-none text-foreground sm:text-8xl">
          Teu app, tua marca
        </h1>
        <p className="max-w-md text-base text-muted-foreground">
          Cadastra alunas, monta treinos, anamnese e cobrança. Em 60 segundos,
          no teu domínio, com tua cor.
        </p>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row">
        <a
          href="/criar-conta-personal"
          className={buttonVariants({ size: "xl" })}
        >
          Criar minha conta
        </a>
        <a
          href="/login"
          className={buttonVariants({ size: "xl", variant: "outline" })}
        >
          Já tenho conta
        </a>
      </div>

      <footer className="text-xs text-muted-foreground">
        A partir de R$ 79/mês · sem fidelidade
      </footer>
    </main>
  );
}
