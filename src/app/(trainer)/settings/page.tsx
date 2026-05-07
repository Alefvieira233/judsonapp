import { getCurrentProfile } from "@/lib/auth";

import { SettingsForm } from "./settings-form";

export const metadata = { title: "Ajustes" };

export default async function SettingsPage() {
  const session = await getCurrentProfile();
  if (!session) return null;
  const { tenant } = session;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 md:gap-8 md:px-6 md:py-10">
      <header className="flex flex-col gap-1">
        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Painel
        </span>
        <h1 className="font-display text-4xl leading-none md:text-5xl">
          Ajustes
        </h1>
        <p className="text-sm text-muted-foreground">
          Sua marca e contato. Tudo aqui aparece no app das alunas.
        </p>
      </header>

      <SettingsForm tenant={tenant} />
    </div>
  );
}
