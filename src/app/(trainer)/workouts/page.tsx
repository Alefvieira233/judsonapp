import Link from "next/link";
import { FilesIcon, PlusIcon, UserIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { ExerciseIcon, muscleToneClass } from "@/components/exercise/exercise-icon";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";

import { AssignTemplateButton } from "./assign-template";

export async function generateMetadata() {
  const t = await getTranslations("workouts");
  return { title: t("metadata_title") };
}

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

type ItemMuscleRow = {
  workout_id: string;
  exercise: { muscle_group: string | null } | null;
};

function parseView(raw: string | string[] | undefined): View {
  if (raw === "templates" || raw === "assigned") return raw;
  return "all";
}

function summarize(
  count: number,
  view: View,
  t: (key: string, params?: Record<string, number>) => string,
): string {
  if (count === 0) {
    if (view === "templates") return t("summary_empty_templates");
    if (view === "assigned") return t("summary_empty_assigned");
    return t("summary_empty_all");
  }
  if (view === "templates") {
    return count === 1
      ? t("summary_template_one_view", { count })
      : t("summary_template_other_view", { count });
  }
  if (view === "assigned") {
    return count === 1
      ? t("summary_count_one_view", { count })
      : t("summary_count_other_view", { count });
  }
  return count === 1
    ? t("summary_count_one_total", { count })
    : t("summary_count_other_total", { count });
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

  const t = await getTranslations("workouts");

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

  // Aggregate dominant muscle groups per workout for hero icons.
  const dominantMuscleByWorkout = new Map<string, string | null>();
  if (workouts.length > 0) {
    const { data: itemsData } = await supabase
      .from("workout_items")
      .select(`workout_id, exercise:exercises(muscle_group)`)
      .in(
        "workout_id",
        workouts.map((w) => w.id),
      )
      .returns<ItemMuscleRow[]>();
    const counts = new Map<string, Map<string, number>>();
    for (const row of itemsData ?? []) {
      const mg = row.exercise?.muscle_group;
      if (!mg) continue;
      const inner = counts.get(row.workout_id) ?? new Map();
      inner.set(mg, (inner.get(mg) ?? 0) + 1);
      counts.set(row.workout_id, inner);
    }
    for (const [workoutId, inner] of counts) {
      const sorted = [...inner.entries()].sort((a, b) => b[1] - a[1]);
      dominantMuscleByWorkout.set(workoutId, sorted[0]?.[0] ?? null);
    }
  }

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
            {t("eyebrow")}
          </span>
          <h1 className="font-display text-4xl leading-none md:text-5xl">
            {t("title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {summarize(workouts.length, view, t)}
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
            <FilesIcon className="size-4" aria-hidden /> {t("new_template")}
          </Link>
          <Link
            href="/workouts/new"
            className={buttonVariants({ size: "lg", className: "w-full md:w-auto" })}
          >
            <PlusIcon className="size-4" aria-hidden /> {t("new_workout")}
          </Link>
        </div>
      </header>

      <ViewTabs current={view} />

      {workouts.length === 0 ? (
        <EmptyState view={view} />
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {workouts.map((w) => {
            const isTemplate = w.student_id == null;
            const dominantMg = dominantMuscleByWorkout.get(w.id) ?? null;
            const itemCount = w.items?.[0]?.count ?? 0;
            return (
              <li key={w.id}>
                <div
                  className={`group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-border bg-gradient-to-br p-4 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[var(--brand-primary)]/40 ${muscleToneClass(dominantMg, null)}`}
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-[var(--brand-primary)]/8 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                  />

                  <Link
                    href={`/workouts/${w.id}`}
                    className="relative flex items-start gap-3"
                  >
                    <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-border bg-background/60">
                      <ExerciseIcon muscleGroup={dominantMg} size={6} />
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <span className="truncate font-display text-2xl leading-tight">
                        {w.title}
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                        {isTemplate ? (
                          <Badge
                            variant="outline"
                            className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
                          >
                            {t("is_template")}
                          </Badge>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full border border-[var(--brand-primary)]/30 bg-[var(--brand-primary)]/10 px-2 py-0.5 text-foreground">
                            <UserIcon className="size-3" aria-hidden />
                            <span className="truncate max-w-[10rem]">
                              {w.student?.full_name ?? t("student_removed")}
                            </span>
                          </span>
                        )}
                        <span className="tabular-nums">
                          {itemCount === 1
                            ? t("exercise_one", { count: itemCount })
                            : t("exercise_other", { count: itemCount })}
                        </span>
                      </div>
                    </div>
                    {w.active === false ? (
                      <Badge variant="outline" className="shrink-0 text-muted-foreground">
                        {t("inactive")}
                      </Badge>
                    ) : null}
                  </Link>

                  <div className="relative flex items-center justify-between gap-3">
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

async function ViewTabs({ current }: { current: View }) {
  const t = await getTranslations("workouts");
  const items: { id: View; label: string }[] = [
    { id: "all", label: t("tab_all") },
    { id: "templates", label: t("tab_templates") },
    { id: "assigned", label: t("tab_assigned") },
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

async function EmptyState({ view }: { view: View }) {
  const t = await getTranslations("workouts");
  const copy =
    view === "templates"
      ? { title: t("empty_templates_title"), body: t("empty_templates_body") }
      : view === "assigned"
        ? { title: t("empty_assigned_title"), body: t("empty_assigned_body") }
        : { title: t("empty_all_title"), body: t("empty_all_body") };
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

