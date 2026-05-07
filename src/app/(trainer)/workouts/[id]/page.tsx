import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";

import { WorkoutBuilder } from "./builder";

export const metadata = { title: "Treino" };

export default async function WorkoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getCurrentProfile();
  if (!session) return null;

  const supabase = await createClient();

  const [workoutRes, itemsRes, exercisesRes, studentsRes] = await Promise.all([
    supabase
      .from("workouts")
      .select("id, title, description, scheduled_days, active, student_id")
      .eq("id", id)
      .eq("tenant_id", session.tenant.id)
      .maybeSingle(),
    supabase
      .from("workout_items")
      .select(
        "id, exercise_id, position, sets, reps, rest_seconds, load_suggestion, notes, exercise:exercises(id, name, muscle_group, equipment)",
      )
      .eq("workout_id", id)
      .order("position"),
    supabase
      .from("exercises")
      .select("id, name, muscle_group, equipment")
      .or(`tenant_id.is.null,tenant_id.eq.${session.tenant.id}`)
      .order("name"),
    supabase
      .from("profiles")
      .select("id, full_name")
      .eq("tenant_id", session.tenant.id)
      .eq("role", "student")
      .order("full_name"),
  ]);

  const workout = workoutRes.data;
  if (!workout) notFound();

  type ItemRow = {
    id: string;
    exercise_id: string | null;
    position: number;
    sets: number;
    reps: string;
    rest_seconds: number | null;
    load_suggestion: string | null;
    notes: string | null;
    exercise: { id: string; name: string; muscle_group: string | null; equipment: string | null } | null;
  };

  const items = (itemsRes.data ?? []) as unknown as ItemRow[];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-6 md:gap-6 md:px-6 md:py-10">
      <Link
        href="/workouts"
        className="inline-flex w-fit items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3.5" /> Treinos
      </Link>

      <WorkoutBuilder
        workout={workout}
        items={items.map((it) => ({
          id: it.id,
          exercise_id: it.exercise_id ?? "",
          exercise_name: it.exercise?.name ?? "Exercício removido",
          muscle_group: it.exercise?.muscle_group ?? null,
          sets: it.sets,
          reps: it.reps,
          rest_seconds: it.rest_seconds,
          load_suggestion: it.load_suggestion,
          notes: it.notes,
        }))}
        students={studentsRes.data ?? []}
        exercises={exercisesRes.data ?? []}
      />
    </div>
  );
}
