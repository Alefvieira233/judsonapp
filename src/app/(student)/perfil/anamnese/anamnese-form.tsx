"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { CheckCircle2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { saveAnamneseAction, type SaveAnamneseState } from "./actions";

type Initial = {
  has_heart_condition: boolean | null;
  has_chest_pain: boolean | null;
  has_dizziness: boolean | null;
  has_bone_or_joint_problem: boolean | null;
  takes_blood_pressure_meds: boolean | null;
  is_pregnant: boolean | null;
  smoker: boolean | null;
  injuries: string | null;
  surgeries: string | null;
  medications: string | null;
  allergies: string | null;
  conditions: string | null;
  family_history: string | null;
  goals: string | null;
  activity_level: string | null;
  notes: string | null;
};

const PARQ_KEYS = [
  { key: "has_heart_condition", labelKey: "q_heart" },
  { key: "has_chest_pain", labelKey: "q_chest" },
  { key: "has_dizziness", labelKey: "q_dizziness" },
  { key: "has_bone_or_joint_problem", labelKey: "q_bone" },
  { key: "takes_blood_pressure_meds", labelKey: "q_meds" },
  { key: "is_pregnant", labelKey: "q_pregnant" },
  { key: "smoker", labelKey: "q_smoker" },
] as const;

const ACTIVITY_VALUES = [
  { value: "sedentaria", labelKey: "activity_sedentary" },
  { value: "leve", labelKey: "activity_light" },
  { value: "moderada", labelKey: "activity_moderate" },
  { value: "intensa", labelKey: "activity_intense" },
] as const;

function SubmitButton({ trainer }: { trainer: string }) {
  const { pending } = useFormStatus();
  const t = useTranslations("anamnese");
  const tc = useTranslations("common");
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? tc("saving") : t("submit", { trainer })}
    </Button>
  );
}

function YesNo({
  name,
  label,
  initial,
}: {
  name: keyof Initial;
  label: string;
  initial: boolean | null;
}) {
  const tc = useTranslations("common");
  const [value, setValue] = useState<"on" | "off" | "">(
    initial === true ? "on" : initial === false ? "off" : "",
  );
  return (
    <fieldset className="flex flex-col gap-1.5 rounded-xl border border-border bg-card/30 p-3">
      <legend className="text-sm text-foreground">{label}</legend>
      <input type="hidden" name={name as string} value={value} />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setValue("off")}
          className={`flex-1 rounded-md border px-3 py-2 text-sm transition-colors ${
            value === "off"
              ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]/10 text-foreground"
              : "border-border bg-background/40 text-muted-foreground hover:bg-card/40"
          }`}
        >
          {tc("no")}
        </button>
        <button
          type="button"
          onClick={() => setValue("on")}
          className={`flex-1 rounded-md border px-3 py-2 text-sm transition-colors ${
            value === "on"
              ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]/10 text-foreground"
              : "border-border bg-background/40 text-muted-foreground hover:bg-card/40"
          }`}
        >
          {tc("yes")}
        </button>
      </div>
    </fieldset>
  );
}

export function AnamneseForm({
  initial,
  alreadySigned,
  trainer,
}: {
  initial: Initial;
  alreadySigned: boolean;
  trainer: string;
}) {
  const t = useTranslations("anamnese");
  const tc = useTranslations("common");
  const router = useRouter();
  const [state, formAction] = useActionState<SaveAnamneseState, FormData>(
    async (prev, fd) => {
      const next = await saveAnamneseAction(prev, fd);
      if (next?.ok) {
        toast.success(t("saved_toast", { trainer }));
        router.push("/perfil");
      } else if (next?.ok === false) {
        toast.error(next.error);
      }
      return next;
    },
    undefined,
  );
  void state;

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {alreadySigned ? (
        <div className="flex items-start gap-2 rounded-xl border border-[var(--brand-primary)]/30 bg-[var(--brand-primary)]/5 p-3 text-sm">
          <CheckCircle2Icon
            className="mt-0.5 size-4 shrink-0 text-[var(--brand-primary)]"
            aria-hidden
          />
          <span className="text-muted-foreground">
            {t("already_signed", { trainer })}
          </span>
        </div>
      ) : null}

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl">{t("section_health")}</h2>
        <p className="text-xs text-muted-foreground">
          {t("section_health_help", { trainer })}
        </p>
        {PARQ_KEYS.map((q) => (
          <YesNo
            key={q.key}
            name={q.key as keyof Initial}
            label={t(q.labelKey)}
            initial={initial[q.key as keyof Initial] as boolean | null}
          />
        ))}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl">{t("section_history")}</h2>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="injuries">{t("f_injuries")}</Label>
          <Textarea
            id="injuries"
            name="injuries"
            rows={2}
            defaultValue={initial.injuries ?? ""}
            placeholder={t("f_injuries_placeholder")}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="surgeries">{t("f_surgeries")}</Label>
          <Textarea
            id="surgeries"
            name="surgeries"
            rows={2}
            defaultValue={initial.surgeries ?? ""}
            placeholder={t("f_surgeries_placeholder")}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="medications">{t("f_meds")}</Label>
          <Textarea
            id="medications"
            name="medications"
            rows={2}
            defaultValue={initial.medications ?? ""}
            placeholder={t("f_meds_placeholder")}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="allergies">{t("f_allergies")}</Label>
          <Textarea
            id="allergies"
            name="allergies"
            rows={2}
            defaultValue={initial.allergies ?? ""}
            placeholder={t("f_allergies_placeholder")}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="conditions">{t("f_conditions")}</Label>
          <Textarea
            id="conditions"
            name="conditions"
            rows={2}
            defaultValue={initial.conditions ?? ""}
            placeholder={t("f_conditions_placeholder")}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="family_history">{t("f_family")}</Label>
          <Textarea
            id="family_history"
            name="family_history"
            rows={2}
            defaultValue={initial.family_history ?? ""}
            placeholder={t("f_family_placeholder")}
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl">{t("section_goals")}</h2>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="goals">{t("f_goals")}</Label>
          <Textarea
            id="goals"
            name="goals"
            rows={2}
            defaultValue={initial.goals ?? ""}
            placeholder={t("f_goals_placeholder")}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="activity_level">{t("f_activity")}</Label>
          <select
            id="activity_level"
            name="activity_level"
            defaultValue={initial.activity_level ?? ""}
            className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm"
          >
            <option value="">{tc("select")}</option>
            {ACTIVITY_VALUES.map((a) => (
              <option key={a.value} value={a.value}>
                {t(a.labelKey)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="notes">{t("f_notes")}</Label>
          <Textarea
            id="notes"
            name="notes"
            rows={3}
            defaultValue={initial.notes ?? ""}
            placeholder={t("f_notes_placeholder", { trainer })}
          />
        </div>
      </section>

      <SubmitButton trainer={trainer} />
    </form>
  );
}
