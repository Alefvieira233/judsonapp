import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";

import { NewWorkoutForm } from "./new-form";

export const metadata = { title: "Novo treino" };

export default async function NewWorkoutPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string; student?: string }>;
}) {
  const session = await getCurrentProfile();
  if (!session) return null;

  const sp = await searchParams;
  const isTemplate = sp.template === "1";
  const prefilledStudent = !isTemplate ? sp.student ?? null : null;

  const supabase = await createClient();
  const { data: students } = isTemplate
    ? { data: [] as { id: string; full_name: string }[] }
    : await supabase
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
          {isTemplate ? "Novo template" : "Novo"}
        </span>
        <h1 className="font-display text-4xl leading-none md:text-5xl">
          {isTemplate ? "Template" : "Treino"}
        </h1>
        {isTemplate ? (
          <p className="text-sm text-muted-foreground">
            Treino sem aluna atribuída. Você clona pra cada aluna depois.
          </p>
        ) : null}
      </header>

      <NewWorkoutForm
        students={students ?? []}
        isTemplate={isTemplate}
        prefilledStudentId={prefilledStudent}
      />
    </div>
  );
}
