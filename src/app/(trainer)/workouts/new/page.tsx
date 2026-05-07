import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";

import { NewWorkoutForm } from "./new-form";

export const metadata = { title: "Novo treino" };

export default async function NewWorkoutPage() {
  const session = await getCurrentProfile();
  if (!session) return null;

  const supabase = await createClient();
  const { data: students } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("tenant_id", session.tenant.id)
    .eq("role", "student")
    .eq("active", true)
    .order("full_name");

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 py-6 md:px-6 md:py-10">
      <Link
        href="/workouts"
        className="inline-flex w-fit items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3.5" /> Treinos
      </Link>

      <header className="flex flex-col gap-1">
        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Novo
        </span>
        <h1 className="font-display text-4xl leading-none md:text-5xl">
          Treino
        </h1>
      </header>

      <NewWorkoutForm students={students ?? []} />
    </div>
  );
}
