import Link from "next/link";
import { FilesIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";

import { QuickStartButton, QuickStartFab } from "./quick-start-sheet";
import { WorkoutsList, type WorkoutCard } from "./workouts-list";

export async function generateMetadata() {
  const t = await getTranslations("workouts");
  return { title: t("metadata_title") };
}

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

type View = "all" | "templates" | "assigned" | "unassigned";

function parseView(raw: string | string[] | undefined): View {
  if (raw === "templates" || raw === "assigned" || raw === "unassigned") return raw;
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

  const t = await getTranslations("workouts");

  const supabase = await createClient();
  const { data } = await supabase
    .from("workouts")
    .select(
      `id, title, description, scheduled_days, active, updated_at, student_id,
       student:profiles!workouts_student_id_fkey(id, full_name),
       items:workout_items(count)`,
    )
    .eq("tenant_id", session.tenant.id)
    .order("updated_at", { ascending: false })
    .returns<WorkoutRow[]>();

  const allWorkouts = data ?? [];

  // Aggregate dominant muscle groups per workout for hero icons.
  const dominantMuscleByWorkout = new Map<string, string | null>();
  if (allWorkouts.length > 0) {
    const { data: itemsData } = await supabase
      .from("workout_items")
      .select(`workout_id, exercise:exercises(muscle_group)`)
      .in(
        "workout_id",
        allWorkouts.map((w) => w.id),
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

  const cards: WorkoutCard[] = allWorkouts.map((w) => ({
    id: w.id,
    title: w.title,
    description: w.description,
    scheduled_days: w.scheduled_days,
    active: w.active,
    updated_at: w.updated_at,
    student_id: w.student_id,
    student: w.student,
    item_count: w.items?.[0]?.count ?? 0,
    dominant_mg: dominantMuscleByWorkout.get(w.id) ?? null,
  }));

  // Quick-start data: templates highlight + last student workouts to duplicate.
  const templates = cards
    .filter((c) => !c.student_id)
    .slice(0, 12)
    .map((c) => ({
      id: c.id,
      title: c.title,
      exercise_count: c.item_count,
      dominant_muscle: c.dominant_mg,
    }));
  const studentWorkouts = cards
    .filter((c) => c.student_id && c.student?.full_name)
    .slice(0, 20)
    .map((c) => ({
      id: c.id,
      title: c.title,
      student_name: c.student?.full_name ?? "—",
    }));

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
        </div>
        <div className="hidden flex-wrap gap-2 md:flex md:flex-nowrap">
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
          <QuickStartButton
            students={students}
            templates={templates}
            studentWorkouts={studentWorkouts}
          />
        </div>
      </header>

      <WorkoutsList workouts={cards} students={students} initialView={view} />

      {/* Mobile FAB */}
      <QuickStartFab
        students={students}
        templates={templates}
        studentWorkouts={studentWorkouts}
      />
    </div>
  );
}
