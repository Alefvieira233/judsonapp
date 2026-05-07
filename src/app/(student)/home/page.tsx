import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { getCurrentStudent } from "@/lib/auth";

export const metadata = { title: "Hoje" };

function firstName(full: string): string {
  return full.split(" ")[0] ?? full;
}

function greeting(now: Date): string {
  const hour = now.getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export default async function StudentHomePage() {
  const session = await getCurrentStudent();
  const profile = session?.profile;
  const tenant = session?.tenant;
  const name = profile ? firstName(profile.full_name) : "Aluna";

  return (
    <section className="flex flex-1 flex-col gap-8 px-6 pb-8 pt-10">
      <header className="flex flex-col gap-3">
        <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
          {greeting(new Date())}
        </span>
        <h1 className="font-display text-5xl leading-[0.9]">{name}</h1>
        {tenant?.tagline ? (
          <p className="text-sm text-muted-foreground">{tenant.tagline}</p>
        ) : null}
      </header>

      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card/40 p-5">
        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Treino de hoje
        </span>
        <p className="font-display text-2xl">Em construção</p>
        <p className="text-sm text-muted-foreground">
          Em breve teu treino do dia aparece aqui — com timer, registro de carga
          e um confetinho no fim. {firstName(tenant?.name ?? "Judson")} já tá
          montando.
        </p>
        <Link
          href="/treinos"
          className={buttonVariants({ size: "lg", className: "mt-2 w-full md:w-auto" })}
        >
          Ver meus treinos
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/feed"
          className="flex flex-col gap-1 rounded-2xl border border-border bg-card/40 p-4 transition-colors hover:bg-card/60"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Comunidade
          </span>
          <span className="font-display text-xl">Feed</span>
        </Link>
        <Link
          href="/perfil"
          className="flex flex-col gap-1 rounded-2xl border border-border bg-card/40 p-4 transition-colors hover:bg-card/60"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Sua conta
          </span>
          <span className="font-display text-xl">Perfil</span>
        </Link>
      </div>
    </section>
  );
}
