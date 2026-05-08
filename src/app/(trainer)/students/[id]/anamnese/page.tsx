import { notFound } from "next/navigation";
import { AlertTriangleIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { timeAgo } from "@/lib/dates";

import { ReviewButton } from "./review-button";

export async function generateMetadata() {
  const t = await getTranslations("students");
  return { title: t("anamnese_metadata_title") };
}

const idSchema = z.string().uuid();

const PARQ_KEYS: ReadonlyArray<[string, string]> = [
  ["has_heart_condition", "parq_heart"],
  ["has_chest_pain", "parq_chest"],
  ["has_dizziness", "parq_dizziness"],
  ["has_bone_or_joint_problem", "parq_bone"],
  ["takes_blood_pressure_meds", "parq_meds"],
  ["is_pregnant", "parq_pregnant"],
  ["smoker", "parq_smoker"],
];

const ACTIVITY_LABEL_KEYS: Record<string, string> = {
  sedentaria: "activity_sedentary",
  leve: "activity_light",
  moderada: "activity_moderate",
  intensa: "activity_intense",
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
  const t = await getTranslations("students");
  const tc = await getTranslations("common");

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
    ? PARQ_KEYS.filter(
        ([k]) => (anamnese as Record<string, unknown>)[k] === true,
      )
    : [];
  const noFlags = anamnese
    ? PARQ_KEYS.filter(
        ([k]) => (anamnese as Record<string, unknown>)[k] === false,
      )
    : [];
  const unanswered = anamnese
    ? PARQ_KEYS.filter(
        ([k]) =>
          (anamnese as Record<string, unknown>)[k] === null ||
          (anamnese as Record<string, unknown>)[k] === undefined,
      )
    : [];

  const description = anamnese?.signed_at
    ? `${t("anamnese_signed_at", { when: timeAgo(anamnese.signed_at) })}${
        anamnese.reviewed_at
          ? ` · ${t("anamnese_reviewed_at", { when: timeAgo(anamnese.reviewed_at) })}`
          : ` · ${t("anamnese_not_reviewed")}`
      }`
    : undefined;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 md:px-6 md:py-10">
      <PageHeader
        eyebrow={t("anamnese_eyebrow")}
        title={student.full_name}
        description={description}
        back={{ href: `/students/${id}`, label: student.full_name }}
      />

      {!anamnese ? (
        <EmptyState
          title={t("anamnese_not_filled_title")}
          description={t.rich("anamnese_not_filled_body", {
            strong: (chunks) => <span className="text-foreground">{chunks}</span>,
          })}
        />
      ) : (
        <>
          {yesFlags.length > 0 ? (
            <section className="flex flex-col gap-2 rounded-xl border border-[var(--brand-primary)]/40 bg-[var(--brand-primary)]/5 p-4">
              <h2 className="flex items-center gap-2 font-display text-lg text-foreground">
                <AlertTriangleIcon className="size-4 text-[var(--brand-primary)]" />
                {t("anamnese_attention_title")}
              </h2>
              <ul className="flex flex-col gap-1.5 text-sm">
                {yesFlags.map(([k, lk]) => (
                  <li key={k} className="text-foreground">
                    • {t(lk)}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="flex flex-col gap-3 rounded-xl border border-border bg-card/30 p-4">
            <h2 className="font-display text-lg">{t("anamnese_full_title")}</h2>
            <ul className="flex flex-col gap-1 text-sm">
              {PARQ_KEYS.map(([k, lk]) => {
                const v = (anamnese as Record<string, unknown>)[k];
                const ans =
                  v === true ? tc("yes") : v === false ? tc("no") : "—";
                const cls =
                  v === true
                    ? "text-[var(--brand-primary)] font-semibold"
                    : v === false
                      ? "text-muted-foreground"
                      : "text-muted-foreground/60";
                return (
                  <li key={k} className="flex items-center justify-between gap-3">
                    <span className="text-foreground">{t(lk)}</span>
                    <span className={cls}>{ans}</span>
                  </li>
                );
              })}
            </ul>
            {unanswered.length > 0 ? (
              <p className="text-[11px] text-muted-foreground">
                {unanswered.length === 1
                  ? t("anamnese_unanswered_one", { count: unanswered.length })
                  : t("anamnese_unanswered_other", { count: unanswered.length })}
              </p>
            ) : null}
            <span className="text-[11px] text-muted-foreground">
              {t("anamnese_summary", { yes: yesFlags.length, no: noFlags.length })}
            </span>
          </section>

          <Section
            title={t("anamnese_history_title")}
            empty={t("anamnese_section_empty")}
            items={[
              [t("anamnese_history_injuries"), anamnese.injuries],
              [t("anamnese_history_surgeries"), anamnese.surgeries],
              [t("anamnese_history_meds"), anamnese.medications],
              [t("anamnese_history_allergies"), anamnese.allergies],
              [t("anamnese_history_conditions"), anamnese.conditions],
              [t("anamnese_history_family"), anamnese.family_history],
            ]}
          />

          <Section
            title={t("anamnese_goals_title")}
            empty={t("anamnese_section_empty")}
            items={[
              [t("anamnese_goals_objective"), anamnese.goals],
              [
                t("anamnese_goals_activity"),
                anamnese.activity_level
                  ? ACTIVITY_LABEL_KEYS[anamnese.activity_level]
                    ? t(ACTIVITY_LABEL_KEYS[anamnese.activity_level]!)
                    : anamnese.activity_level
                  : null,
              ],
              [t("anamnese_goals_notes"), anamnese.notes],
            ]}
          />

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
  empty,
  items,
}: {
  title: string;
  empty: string;
  items: ReadonlyArray<readonly [string, string | null]>;
}) {
  const filled = items.filter(([, v]) => !!v && v.trim().length > 0);
  if (filled.length === 0) {
    return (
      <section className="flex flex-col gap-2 rounded-xl border border-dashed border-border bg-card/20 p-4">
        <h2 className="font-display text-lg">{title}</h2>
        <p className="text-xs text-muted-foreground">{empty}</p>
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
