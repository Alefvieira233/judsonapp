import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { LoginForm } from "./login-form";

export const metadata = {
  title: "Entrar",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect(next || "/dashboard");

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section className="flex w-full max-w-sm flex-col gap-8">
        <header className="flex flex-col gap-2 text-center">
          <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
            Painel do personal
          </span>
          <h1 className="font-display text-5xl leading-none">Judson Lobato</h1>
        </header>

        <LoginForm next={next} />

        <p className="text-center text-xs text-muted-foreground">
          Aluna? <a href="/aluna/entrar" className="text-foreground underline">Entra por aqui</a> com teu email.
        </p>
      </section>
    </main>
  );
}
