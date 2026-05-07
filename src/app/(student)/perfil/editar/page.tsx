import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { getCurrentStudent } from "@/lib/auth";

import { EditProfileForm } from "./edit-form";

export const metadata = { title: "Editar perfil" };

export default async function EditProfilePage() {
  const session = await getCurrentStudent();
  if (!session) return null;

  return (
    <section className="flex flex-1 flex-col gap-6 px-6 pb-8 pt-6">
      <Link
        href="/perfil"
        className="inline-flex w-fit items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3.5" /> Perfil
      </Link>

      <header className="flex flex-col gap-1">
        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Editar
        </span>
        <h1 className="font-display text-4xl leading-[0.9]">Seu perfil</h1>
      </header>

      <EditProfileForm profile={session.profile} />
    </section>
  );
}
