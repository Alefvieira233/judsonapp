import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { getCurrentStudent } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

import { AnamneseForm } from "./anamnese-form";

export const metadata = { title: "Anamnese" };

export default async function AnamnesePage() {
  const session = await getCurrentStudent();
  if (!session) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("anamneses")
    .select("*")
    .eq("student_id", session.profile.id)
    .maybeSingle();

  const initial = {
    has_heart_condition: data?.has_heart_condition ?? null,
    has_chest_pain: data?.has_chest_pain ?? null,
    has_dizziness: data?.has_dizziness ?? null,
    has_bone_or_joint_problem: data?.has_bone_or_joint_problem ?? null,
    takes_blood_pressure_meds: data?.takes_blood_pressure_meds ?? null,
    is_pregnant: data?.is_pregnant ?? null,
    smoker: data?.smoker ?? null,
    injuries: data?.injuries ?? null,
    surgeries: data?.surgeries ?? null,
    medications: data?.medications ?? null,
    allergies: data?.allergies ?? null,
    conditions: data?.conditions ?? null,
    family_history: data?.family_history ?? null,
    goals: data?.goals ?? null,
    activity_level: data?.activity_level ?? null,
    notes: data?.notes ?? null,
  };

  return (
    <section className="flex flex-1 flex-col gap-6 px-5 pb-10 pt-6">
      <Link
        href="/perfil"
        className="inline-flex w-fit items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3.5" /> Perfil
      </Link>

      <header className="flex flex-col gap-1">
        <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          Saúde · PAR-Q+
        </span>
        <h1 className="font-display text-3xl leading-tight">
          Anamnese
        </h1>
        <p className="text-sm text-muted-foreground">
          Antes de prescrever treino, o Judson precisa entender teu histórico de
          saúde. Leva uns 5 minutos. Tudo é confidencial — só tu e ele veem.
        </p>
      </header>

      <AnamneseForm
        initial={initial}
        alreadySigned={!!data?.signed_at}
      />
    </section>
  );
}
