import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { getCurrentStudent } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

import { WorkoutRunner, type RunnerItem, type RunnerWorkout } from "./runner";

export const metadata = { title: "Treino" };

type ItemRow = {
  id: string;
  position: number;
  sets: number;
  reps: string;
  rest_seconds: number | null;
  load_suggestion: string | null;
  notes: string | null;
  exercise: { id: string; name: string; muscle_group: string | null } | null;
};

type LastLogRow = {
  set_number: number | null;
  reps_done: number | null;
  load_kg: number | null;
  workout_item_id: string | null;
  workout_log: { completed_at: string | null } | null;
};

export default async function StudentWorkoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getCurrentStudent();
  if (!session) return null;

  const supabase = await createClient();

  const [workoutRes, itemsRes] = await Promise.all([
    supabase
      .from("workouts")
      .select("id, title, description, scheduled_days, active, student_id")
      .eq("id", id)
      .eq("tenant_id", session.tenant.id)
      .eq("student_id", session.profile.id)
      .maybeSingle(),
    supabase
      .from("workout_items")
      .select(
        `id, position, sets, reps, rest_seconds, load_suggestion, notes,
         exercise:exercises(id, name, muscle_group)`,
      )
      .eq("workout_id", id)
      .order("position")
      .returns<ItemRow[]>(),
  ]);

  const workout = workoutRes.data;
  if (!workout) notFound();

  const items = itemsRes.data ?? [];
  const itemIds = items.map((i) => i.id);

  // Fetch the last completed set per item to suggest load on the next run.
  const lastLoadByItem = new Map<string, { reps: number | null; load: number | null }>();
  if (itemIds.length > 0) {
    const { data: lastLogs } = await supabase
      .from("exercise_logs")
      .select(
        `set_number, reps_done, load_kg, workout_item_id,
         workout_log:workout_logs!inner(completed_at)`,
      )
      .in("workout_item_id", itemIds)
      .order("created_at", { ascending: false })
      .returns<LastLogRow[]>();

    for (const log of lastLogs ?? []) {
      if (!log.workout_log?.completed_at) continue;
      if (!log.workout_item_id) continue;
      if (!lastLoadByItem.has(log.workout_item_id)) {
        lastLoadByItem.set(log.workout_item_id, {
          reps: log.reps_done,
          load: log.load_kg,
        });
      }
    }
  }

  const runnerItems: RunnerItem[] = items.map((it) => ({
    id: it.id,
    position: it.position,
    sets: it.sets,
    reps: it.reps,
    rest_seconds: it.rest_seconds ?? 60,
    load_suggestion: it.load_suggestion,
    notes: it.notes,
    exercise_name: it.exercise?.name ?? "Exercício removido",
    muscle_group: it.exercise?.muscle_group ?? null,
    last_load: lastLoadByItem.get(it.id)?.load ?? null,
    last_reps: lastLoadByItem.get(it.id)?.reps ?? null,
  }));

  const runnerWorkout: RunnerWorkout = {
    id: workout.id,
    title: workout.title,
    description: workout.description,
  };

  return (
    <div className="flex flex-1 flex-col gap-4 px-5 pb-8 pt-6">
      <Link
        href="/treinos"
        className="inline-flex w-fit items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3.5" /> Treinos
      </Link>

      <WorkoutRunner workout={runnerWorkout} items={runnerItems} />
    </div>
  );
}
