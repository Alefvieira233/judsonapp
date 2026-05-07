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

export default async function ExercisesPage() {
  const session = await getCurrentProfile();
  if (!session) return null;

  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("exercises")
    .select(
      "id, name, muscle_group, equipment, video_url, video_source, instructions, tenant_id",
    )
    .or(`tenant_id.is.null,tenant_id.eq.${session.tenant.id}`)
    .order("name")
    .returns<ExerciseRow[]>();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 md:gap-8 md:px-6 md:py-10">
      <ExercisesView
        tenantId={session.tenant.id}
        initialExercises={rows ?? []}
      />
    </div>
  );
}
