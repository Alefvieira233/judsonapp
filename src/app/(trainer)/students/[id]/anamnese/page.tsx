import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, AlertTriangleIcon } from "lucide-react";
import { z } from "zod";

import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { timeAgo } from "@/lib/dates";

import { ReviewButton } from "./review-button";

export const metadata = { title: "Anamnese da aluna" };

const idSchema = z.string().uuid();

const PARQ_LABELS: Record<string, string> = {
  has_heart_condition: "Problema cardíaco",
  has_chest_pain: "Dor no peito ao se exercitar",
  has_dizziness: "Tontura ou perda de consciência",
  has_bone_or_joint_problem: "Problema ósseo/articular",
  takes_blood_pressure_meds: "Medicação cardíaca/pressão",
  is_pregnant: "Gravidez",
  smoker: "Fuma",
};

const ACTIVITY_LABELS: Record<string, string> = {
  sedentaria: "Sedentária",
  leve: "Leve",
  moderada: "Moderada",
  intensa: "Intensa",
};

export default async function StudentAnamnesePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  const idParse = idSchema.safeParse(rawId);
  if (!idParse.success) notFound();
  const id = idParse.data;

  const session = await getCurrentProfile();
  if (!session) return null;

  const supabase = await createClient();
  const [studentRes, anamneseRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name")
      .eq("id", id)
      .eq("tenant_id", session.tenant.id)
      .eq("role", "student")
      .maybeSingle(),
    supabase
      .from("anamneses")
      .select("*")
      .eq("tenant_id", session.tenant.id)
      .eq("student_id", id)
      .maybeSingle(),
  ]);

  const student = studentRes.data;
  if (!student) notFound();
  const anamnese = anamneseRes.data;

  const yesFlags = anamnese
    ? Object.entries(PARQ_LABELS).filter(
        ([k]) => (anamnese as Record<string, unknown>)[k] === true,
      )
    : [];
  const noFlags = anamnese
    ? Object.entries(PARQ_LABELS).filter(
        ([k]) => (anamnese as Record<string, unknown>)[k] === false,
      )
    : [];
  const unanswered = anamnese
    ? Object.entries(PARQ_LABELS).filter(
        ([k]) => (anamnese as Record<string, unknown>)[k] === null ||
          (anamnese as Record<string, unknown>)[k] === undefined,
      )
    : [];

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 md:px-6 md:py-10">
      <Link
        href={`/students/${id}`}
        className="inline-flex w-fit items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3.5" /> {student.full_name}
      </Link>

      <header className="flex flex-col gap-1">
        <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          Anamnese · PAR-Q+
        </span>
        <h1 className="font-display text-3xl leading-tight">
          {student.full_name}
        </h1>
        {anamnese?.signed_at ? (
          <p className="text-xs text-muted-foreground">
            Assinada {timeAgo(anamnese.signed_at)}
            {anamnese.reviewed_at
              ? ` · revisada ${timeAgo(anamnese.reviewed_at)}`
              : " · ainda não revisada"}
          </p>
        ) : null}
      </header>

      {!anamnese ? (
        <div className="flex items-start gap-3 rounded-xl border border-dashed border-border bg-card/30 p-4">
          <AlertTriangleIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <div className="text-sm text-muted-foreground">
            <p className="text-foreground">Aluna ainda não preencheu.</p>
            <p>
              Pede pra ela abrir o app, ir em <span className="text-foreground">Perfil → Anamnese</span> e responder. Sem isso, qualquer prescrição é informal.
            </p>
          </div>
        </div>
      ) : (
        <>
          {yesFlags.length > 0 ? (
            <section className="flex flex-col gap-2 rounded-xl border border-[var(--brand-primary)]/40 bg-[var(--brand-primary)]/5 p-4">
              <h2 className="flex items-center gap-2 font-display text-lg text-foreground">
                <AlertTriangleIcon className="size-4 text-[var(--brand-primary)]" />
                Atenção — respondeu &quot;sim&quot;
              </h2>
              <ul className="flex flex-col gap-1.5 text-sm">
                {yesFlags.map(([k, label]) => (
                  <li key={k} className="text-foreground">
                    • {label}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="flex flex-col gap-3 rounded-xl border border-border bg-card/30 p-4">
            <h2 className="font-display text-lg">PAR-Q+ completo</h2>
            <ul className="flex flex-col gap-1 text-sm">
              {Object.entries(PARQ_LABELS).map(([k, label]) => {
                const v = (anamnese as Record<string, unknown>)[k];
                const ans =
                  v === true ? "Sim" : v === false ? "Não" : "—";
                const cls =
                  v === true
                    ? "text-[var(--brand-primary)] font-semibold"
                    : v === false
                    ? "text-muted-foreground"
                    : "text-muted-foreground/60";
                return (
                  <li key={k} className="flex items-center justify-between gap-3">
                    <span className="text-foreground">{label}</span>
                    <span className={cls}>{ans}</span>
                  </li>
                );
              })}
            </ul>
            {unanswered.length > 0 ? (
              <p className="text-[11px] text-muted-foreground">
                {unanswered.length} pergunta{unanswered.length === 1 ? "" : "s"} sem resposta — pede pra ela completar.
              </p>
            ) : null}
            <span className="text-[11px] text-muted-foreground">
              {yesFlags.length} sim · {noFlags.length} não
            </span>
          </section>

          <Section title="Histórico" items={[
            ["Lesões", anamnese.injuries],
            ["Cirurgias", anamnese.surgeries],
            ["Medicamentos", anamnese.medications],
            ["Alergias", anamnese.allergies],
            ["Condições crônicas", anamnese.conditions],
            ["Histórico familiar", anamnese.family_history],
          ]} />

          <Section title="Objetivo e rotina" items={[
            ["Objetivo", anamnese.goals],
            ["Nível de atividade", anamnese.activity_level
              ? ACTIVITY_LABELS[anamnese.activity_level] ?? anamnese.activity_level
              : null],
            ["Outras observações", anamnese.notes],
          ]} />

          {anamnese.signed_at && !anamnese.reviewed_at ? (
            <ReviewButton studentId={id} />
          ) : null}
        </>
      )}
    </div>
  );
}

function Section({
  title,
  items,
}: {
  title: string;
  items: ReadonlyArray<readonly [string, string | null]>;
}) {
  const filled = items.filter(([, v]) => !!v && v.trim().length > 0);
  if (filled.length === 0) {
    return (
      <section className="flex flex-col gap-2 rounded-xl border border-dashed border-border bg-card/20 p-4">
        <h2 className="font-display text-lg">{title}</h2>
        <p className="text-xs text-muted-foreground">Sem informações.</p>
      </section>
    );
  }
  return (
    <section className="flex flex-col gap-3 rounded-xl border border-border bg-card/30 p-4">
      <h2 className="font-display text-lg">{title}</h2>
      <dl className="flex flex-col gap-2 text-sm">
        {filled.map(([label, value]) => (
          <div key={label} className="flex flex-col gap-0.5">
            <dt className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              {label}
            </dt>
            <dd className="whitespace-pre-wrap text-foreground">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
