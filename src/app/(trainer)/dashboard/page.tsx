import { getCurrentProfile } from "@/lib/auth";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await getCurrentProfile();
  if (!session) return null;
  const { profile, tenant } = session;

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-8 md:gap-10 md:px-6 md:py-12">
      <header className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Bem-vindo
        </span>
        <h1 className="font-display text-4xl leading-none md:text-5xl">
          {profile.full_name}
        </h1>
        <p className="text-sm text-muted-foreground md:text-base">
          {tenant.tagline ?? tenant.name}
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <KpiCard label="Alunas ativas" value="—" />
        <KpiCard label="Treinos esta semana" value="—" />
        <KpiCard label="Posts pendentes" value="—" />
      </section>

      <section className="rounded-lg border border-border bg-card/40 p-6">
        <h2 className="font-display text-2xl">Próximos passos</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>Cadastrar suas alunas em <span className="text-foreground">/students</span></li>
          <li>Montar treinos em <span className="text-foreground">/workouts</span></li>
          <li>Ajustar a biblioteca de exercícios em <span className="text-foreground">/exercises</span></li>
        </ul>
      </section>
    </main>
  );
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card/40 p-5">
      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
      <p className="mt-2 font-display text-4xl leading-none">{value}</p>
    </div>
  );
}
