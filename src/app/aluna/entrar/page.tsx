import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

import { createClient } from "@/lib/supabase/server";

import { StudentLoginForm } from "./login-form";

export const metadata = { title: "Entrar — aluna" };

export default async function StudentLoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/welcome");

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section className="flex w-full max-w-sm flex-col gap-8">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="size-3.5" /> Voltar
        </Link>

        <header className="flex flex-col gap-2 text-center">
          <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
            App da aluna
          </span>
          <h1 className="font-display text-5xl leading-none">Entrar</h1>
        </header>

        <StudentLoginForm />

        <p className="text-center text-xs text-muted-foreground">
          Personal? <Link href="/login" className="text-foreground underline">Acessa por aqui</Link>.
        </p>

        <p className="text-center text-[11px] text-muted-foreground/80">
          Ao entrar você reafirma os{" "}
          <Link href="/termos" className="text-foreground/80 underline">Termos de Uso</Link>{" "}
          e a{" "}
          <Link href="/privacidade" className="text-foreground/80 underline">Política de Privacidade</Link>.
        </p>
      </section>
    </main>
  );
}
