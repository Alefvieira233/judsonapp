import Link from "next/link";
import { ArrowLeftIcon, AlertTriangleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getCurrentStudent } from "@/lib/auth";

import { deleteOwnAccountAction } from "./actions";

export const metadata = { title: "Excluir minha conta" };

export default async function DeleteAccountPage() {
  const session = await getCurrentStudent();
  if (!session) return null;

  return (
    <section className="flex flex-1 flex-col gap-6 px-5 pb-8 pt-8">
      <Link
        href="/perfil"
        className="inline-flex w-fit items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3.5" /> Perfil
      </Link>

      <header className="flex flex-col gap-2">
        <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          LGPD · art. 18, VI
        </span>
        <h1 className="font-display text-3xl leading-tight">
          Excluir minha conta
        </h1>
      </header>

      <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
        <AlertTriangleIcon
          className="mt-0.5 size-5 shrink-0 text-destructive"
          aria-hidden
        />
        <div className="flex flex-col gap-1.5 text-muted-foreground">
          <p className="text-foreground">Essa ação é permanente.</p>
          <p>
            Ao confirmar:
          </p>
          <ul className="list-disc pl-5">
            <li>Teu nome, e-mail, telefone e dados de saúde são anonimizados.</li>
            <li>Posts e comentários publicados na comunidade são removidos.</li>
            <li>Histórico de treinos é mantido pseudonimizado pro teu personal.</li>
            <li>Tu sai da sessão e perde o acesso ao app imediatamente.</li>
          </ul>
          <p className="pt-2">
            Pra entrar de novo, vais precisar de um novo convite do{" "}
            {session.tenant.name.split(" ")[0]}.
          </p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Antes de excluir, tens a opção de baixar uma cópia dos teus dados em
        JSON pelo botão{" "}
        <Link
          href="/perfil/dados"
          className="text-foreground underline-offset-2 hover:underline"
        >
          Exportar meus dados
        </Link>{" "}
        no perfil.
      </p>

      <form action={deleteOwnAccountAction} className="flex flex-col gap-3">
        <Button
          type="submit"
          variant="destructive"
          size="lg"
          className="w-full"
        >
          Excluir minha conta agora
        </Button>
        <Link
          href="/perfil"
          className="text-center text-xs text-muted-foreground hover:text-foreground"
        >
          Cancelar e voltar
        </Link>
      </form>
    </section>
  );
}
