import { CreateTenantForm } from "./create-tenant-form";

export const metadata = {
  title: "Crie teu app de personal trainer em 60 segundos",
  description:
    "Plataforma white-label pra personal trainers. Cobrança recorrente das alunas, treinos, anamnese, comunidade e tua marca.",
};

export default function CreatePersonalAccountPage({
  searchParams,
}: {
  searchParams?: Promise<{ canceled?: string }>;
}) {
  return (
    <main className="min-h-[100dvh] bg-background">
      <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-10 md:grid-cols-[1fr_minmax(320px,420px)] md:px-6 md:py-16">
        <header className="flex flex-col gap-5">
          <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
            App de personal trainer · white-label
          </span>
          <h1 className="font-display text-5xl leading-[0.9] md:text-7xl">
            Crie teu app de personal trainer em 60 segundos
          </h1>
          <p className="max-w-xl text-base text-muted-foreground">
            Tua marca, teu domínio, tua cor. Cadastra alunas, monta treinos,
            anamnese, avaliações, comunidade e cobrança no Pix/cartão. Sem
            mensalidade de plataforma cara.
          </p>
          <ul className="grid gap-2 text-sm text-foreground/90">
            <li>· R$ 79/mês — alunas ilimitadas no plano Starter</li>
            <li>· Domínio próprio, logo e cor da tua marca</li>
            <li>· Cobrança Pix/cartão/boleto pelas tuas alunas (Asaas)</li>
            <li>· Comunidade interna, anamnese, fotos e progresso</li>
            <li>· PWA — instala no celular como app nativo</li>
          </ul>
          <CanceledBanner searchParams={searchParams} />
        </header>

        <CreateTenantForm />
      </section>
    </main>
  );
}

async function CanceledBanner({
  searchParams,
}: {
  searchParams?: Promise<{ canceled?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  if (sp.canceled !== "1") return null;
  return (
    <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
      Pagamento cancelado. Pode tentar de novo quando quiser.
    </p>
  );
}
