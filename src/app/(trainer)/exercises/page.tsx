import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";

import { ExercisesView } from "./exercises-view";

export const metadata = { title: "Exercícios" };

export type ExerciseRow = {
  id: string;
  name: string;
  muscle_group: string | null;
  equipment: string | null;
  video_url: string | null;
  video_source: string | null;
  instructions: string | null;
  tenant_id: string | null;
};

type UsageRow = { exercise_id: string };

export default async function ExercisesPage() {
  const session = await getCurrentProfile();
  if (!session) return null;

  const supabase = await createClient();
  const [exRes, usageRes] = await Promise.all([
    supabase
      .from("exercises")
      .select(
        "id, name, muscle_group, equipment, video_url, video_source, instructions, tenant_id",
      )
      .or(`tenant_id.is.null,tenant_id.eq.${session.tenant.id}`)
      .order("name")
      .returns<ExerciseRow[]>(),
    // Tenant-scoped usage: how many workout_items reference each exercise
    // inside this tenant's workouts. Pulled via a join filter so the count
    // doesn't leak rows from other tenants.
    supabase
      .from("workout_items")
      .select("exercise_id, workouts!inner(tenant_id)")
      .eq("workouts.tenant_id", session.tenant.id)
      .returns<(UsageRow & { workouts: { tenant_id: string } })[]>(),
  ]);

  const usageById = new Map<string, number>();
  for (const row of usageRes.data ?? []) {
    if (!row.exercise_id) continue;
    usageById.set(row.exercise_id, (usageById.get(row.exercise_id) ?? 0) + 1);
  }

  const enriched = (exRes.data ?? []).map((ex) => ({
    ...ex,
    usage_count: usageById.get(ex.id) ?? 0,
  }));

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 md:gap-8 md:px-6 md:py-10">
      <ExercisesView tenantId={session.tenant.id} initialExercises={enriched} />
    </div>
  );
}
