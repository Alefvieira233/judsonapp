import Link from "next/link";
import { FilesIcon, PlusIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";

import { AssignTemplateButton } from "./assign-template";

export const metadata = { title: "Treinos" };

const DAYS = ["D", "S", "T", "Q", "Q", "S", "S"];

type View = "all" | "templates" | "assigned";

type WorkoutRow = {
  id: string;
  title: string;
  description: string | null;
  scheduled_days: number[] | null;
  active: boolean | null;
  updated_at: string | null;
  student_id: string | null;
  student: { id: string; full_name: string } | null;
  items: { count: number }[];
};

function parseView(raw: string | string[] | undefined): View {
  if (raw === "templates" || raw === "assigned") return raw;
  return "all";
}

export default async function WorkoutsPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string | string[] }>;
}) {
  const session = await getCurrentProfile();
  if (!session) return null;

  const sp = await searchParams;
  const view = parseView(sp.view);

  const supabase = await createClient();
  let query = supabase
    .from("workouts")
    .select(
      `id, title, description, scheduled_days, active, updated_at, student_id,
       student:profiles!workouts_student_id_fkey(id, full_name),
       items:workout_items(count)`,
    )
    .eq("tenant_id", session.tenant.id);

  if (view === "templates") query = query.is("student_id", null);
  if (view === "assigned") query = query.not("student_id", "is", null);

  const { data } = await query
    .order("updated_at", { ascending: false })
    .returns<WorkoutRow[]>();

  const workouts = data ?? [];

  const { data: studentsData } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("tenant_id", session.tenant.id)
    .eq("role", "student")
    .eq("active", true)
    .order("full_name");
  const students = studentsData ?? [];

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
              ? view === "templates"
                ? "Nenhum template ainda. Crie um pra reusar entre alunas."
                : view === "assigned"
                  ? "Nenhum treino atribuído ainda."
                  : "Crie o primeiro treino e atribua a uma aluna."
              : `${workouts.length} ${view === "templates" ? "template" : "treino"}${workouts.length === 1 ? "" : "s"} ${view === "all" ? "no total" : "nessa visão"}.`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 md:flex-nowrap">
          <Link
            href="/workouts/new?template=1"
            className={buttonVariants({
              size: "lg",
              variant: "outline",
              className: "w-full md:w-auto",
            })}
          >
            <FilesIcon className="size-4" aria-hidden /> Novo template
          </Link>
          <Link
            href="/workouts/new"
            className={buttonVariants({ size: "lg", className: "w-full md:w-auto" })}
          >
            <PlusIcon className="size-4" aria-hidden /> Novo treino
          </Link>
        </div>
      </header>

      <ViewTabs current={view} />

      {workouts.length === 0 ? (
        <EmptyState view={view} />
      ) : (
        <ul className="flex flex-col gap-3">
          {workouts.map((w) => {
            const isTemplate = w.student_id == null;
            return (
              <li key={w.id}>
                <div className="flex flex-col gap-3 rounded-xl border border-border bg-card/40 p-4 transition-colors hover:bg-card">
                  <Link
                    href={`/workouts/${w.id}`}
                    className="flex items-start justify-between gap-3"
                  >
                    <div className="flex min-w-0 flex-col gap-1">
                      <span className="truncate font-display text-2xl leading-tight">
                        {w.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {isTemplate ? (
                          <Badge variant="outline" className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                            Template
                          </Badge>
                        ) : (
                          <>{w.student?.full_name ?? "Aluna removida"}</>
                        )}
                        <span className="ml-2">
                          {w.items?.[0]?.count ?? 0} exercícios
                        </span>
                      </span>
                    </div>
                    {w.active === false ? (
                      <Badge variant="outline" className="text-muted-foreground">
                        Inativo
                      </Badge>
                    ) : null}
                  </Link>
                  <div className="flex items-center justify-between gap-3">
                    <DaysRow days={w.scheduled_days ?? []} />
                    {isTemplate ? (
                      <AssignTemplateButton
                        workoutId={w.id}
                        workoutTitle={w.title}
                        students={students}
                      />
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function ViewTabs({ current }: { current: View }) {
  const items: { id: View; label: string }[] = [
    { id: "all", label: "Todos" },
    { id: "templates", label: "Templates" },
    { id: "assigned", label: "Atribuídos" },
  ];
  return (
    <nav className="flex gap-1 rounded-xl border border-border bg-card/30 p-1">
      {items.map((it) => {
        const active = it.id === current;
        const href = it.id === "all" ? "/workouts" : `/workouts?view=${it.id}`;
        return (
          <Link
            key={it.id}
            href={href}
            className={`flex-1 rounded-lg px-3 py-2 text-center text-sm transition-colors ${
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {it.label}
          </Link>
        );
      })}
    </nav>
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

function EmptyState({ view }: { view: View }) {
  const copy =
    view === "templates"
      ? {
          title: "Sem templates",
          body: "Crie um template (treino sem aluna) e clone pra cada aluna depois.",
        }
      : view === "assigned"
        ? {
            title: "Nada atribuído",
            body: "Quando você atribuir um template ou criar treino direto pra uma aluna, ele aparece aqui.",
          }
        : {
            title: "Primeiro treino",
            body: "Define um título e qual aluna vai executar. Você arrasta os exercícios na ordem que quiser.",
          };
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card/30 px-6 py-12 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-card font-display text-xl text-foreground">
        +
      </span>
      <h2 className="font-display text-2xl">{copy.title}</h2>
      <p className="max-w-sm text-sm text-muted-foreground">{copy.body}</p>
    </div>
  );
}
