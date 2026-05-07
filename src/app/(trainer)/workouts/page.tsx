import Link from "next/link";
import { PlusIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";

export const metadata = { title: "Treinos" };

const DAYS = ["D", "S", "T", "Q", "Q", "S", "S"];

type WorkoutRow = {
  id: string;
  title: string;
  description: string | null;
  scheduled_days: number[] | null;
  active: boolean | null;
  updated_at: string | null;
  student: { id: string; full_name: string } | null;
  items: { count: number }[];
};

export default async function WorkoutsPage() {
  const session = await getCurrentProfile();
  if (!session) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("workouts")
    .select(
      `id, title, description, scheduled_days, active, updated_at,
       student:profiles!workouts_student_id_fkey(id, full_name),
       items:workout_items(count)`,
    )
    .eq("tenant_id", session.tenant.id)
    .order("updated_at", { ascending: false })
    .returns<WorkoutRow[]>();

  const workouts = data ?? [];

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6 md:gap-8 md:px-6 md:py-10">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Painel
          </span>
          <h1 className="font-display text-4xl leading-none md:text-5xl">
            Treinos
          </h1>
          <p className="text-sm text-muted-foreground">
            {workouts.length === 0
              ? "Crie o primeiro treino e atribua a uma aluna."
              : `${workouts.length} treino${workouts.length === 1 ? "" : "s"} cadastrado${workouts.length === 1 ? "" : "s"}.`}
          </p>
        </div>
        <Link
          href="/workouts/new"
          className={buttonVariants({ size: "lg", className: "w-full md:w-auto" })}
        >
          <PlusIcon className="size-4" aria-hidden /> Novo treino
        </Link>
      </header>

      {workouts.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="flex flex-col gap-3">
          {workouts.map((w) => (
            <li key={w.id}>
              <Link
                href={`/workouts/${w.id}`}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card/40 p-4 transition-colors hover:bg-card"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="truncate font-display text-2xl leading-tight">
                      {w.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {w.student?.full_name ?? "Sem aluna atribuída"} ·{" "}
                      {w.items?.[0]?.count ?? 0} exercícios
                    </span>
                  </div>
                  {w.active === false ? (
                    <Badge variant="outline" className="text-muted-foreground">
                      Inativo
                    </Badge>
                  ) : null}
                </div>
                <DaysRow days={w.scheduled_days ?? []} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function DaysRow({ days }: { days: number[] }) {
  const set = new Set(days);
  return (
    <div className="flex gap-1">
      {DAYS.map((label, idx) => (
        <span
          key={idx}
          className={`grid size-7 place-items-center rounded-md text-xs ${
            set.has(idx)
              ? "bg-[var(--brand-primary)] text-white"
              : "bg-card text-muted-foreground"
          }`}
        >
          {label}
        </span>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card/30 px-6 py-12 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-card font-display text-xl text-foreground">
        +
      </span>
      <h2 className="font-display text-2xl">Primeiro treino</h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        Define um título e qual aluna vai executar. Você arrasta os exercícios na
        ordem que quiser.
      </p>
    </div>
  );
}
