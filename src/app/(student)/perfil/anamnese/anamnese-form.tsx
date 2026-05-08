"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { CheckCircle2Icon } from "lucide-react";
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

const PARQ = [
  { key: "has_heart_condition", label: "Tem ou já teve problema cardíaco diagnosticado por médico?" },
  { key: "has_chest_pain", label: "Sente dor no peito ao fazer atividade física?" },
  { key: "has_dizziness", label: "Já teve tontura ou perda de consciência durante exercício?" },
  { key: "has_bone_or_joint_problem", label: "Tem algum problema ósseo, articular ou muscular que pode piorar com exercício?" },
  { key: "takes_blood_pressure_meds", label: "Toma medicação pra pressão arterial ou problema cardíaco?" },
  { key: "is_pregnant", label: "Está grávida ou suspeita estar?" },
  { key: "smoker", label: "Fuma atualmente?" },
] as const;

const ACTIVITY = [
  { value: "sedentaria", label: "Sedentária — pouca ou nenhuma atividade" },
  { value: "leve", label: "Leve — caminhada algumas vezes na semana" },
  { value: "moderada", label: "Moderada — treino regular 3-4×/semana" },
  { value: "intensa", label: "Intensa — treino quase diário" },
] as const;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? "Salvando…" : "Salvar e enviar pro Judson"}
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
          Não
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
          Sim
        </button>
      </div>
    </fieldset>
  );
}

export function AnamneseForm({
  initial,
  alreadySigned,
}: {
  initial: Initial;
  alreadySigned: boolean;
}) {
  const router = useRouter();
  const [state, formAction] = useActionState<SaveAnamneseState, FormData>(
    async (prev, fd) => {
      const next = await saveAnamneseAction(prev, fd);
      if (next?.ok) {
        toast.success("Anamnese salva. O Judson já consegue ver.");
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
            Você já preencheu antes. Pode atualizar quando quiser — alteração
            avisa o Judson automaticamente.
          </span>
        </div>
      ) : null}

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl">Saúde — PAR-Q+</h2>
        <p className="text-xs text-muted-foreground">
          Responde com sinceridade. Nada disso bloqueia teu cadastro — serve pro
          Judson prescrever treino seguro pra ti.
        </p>
        {PARQ.map((q) => (
          <YesNo
            key={q.key}
            name={q.key as keyof Initial}
            label={q.label}
            initial={initial[q.key as keyof Initial] as boolean | null}
          />
        ))}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl">Histórico</h2>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="injuries">Lesões anteriores</Label>
          <Textarea
            id="injuries"
            name="injuries"
            rows={2}
            defaultValue={initial.injuries ?? ""}
            placeholder="Ex: ruptura LCA em 2022, dor lombar crônica"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="surgeries">Cirurgias</Label>
          <Textarea
            id="surgeries"
            name="surgeries"
            rows={2}
            defaultValue={initial.surgeries ?? ""}
            placeholder="Ex: cesárea em 2023, hérnia de disco em 2020"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="medications">Medicamentos em uso</Label>
          <Textarea
            id="medications"
            name="medications"
            rows={2}
            defaultValue={initial.medications ?? ""}
            placeholder="Lista o que toma e a dose, se souber"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="allergies">Alergias</Label>
          <Textarea
            id="allergies"
            name="allergies"
            rows={2}
            defaultValue={initial.allergies ?? ""}
            placeholder="Ex: alergia a látex, glúten, frutos do mar"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="conditions">Condições crônicas</Label>
          <Textarea
            id="conditions"
            name="conditions"
            rows={2}
            defaultValue={initial.conditions ?? ""}
            placeholder="Ex: hipertensão controlada, diabetes tipo 2"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="family_history">Histórico familiar</Label>
          <Textarea
            id="family_history"
            name="family_history"
            rows={2}
            defaultValue={initial.family_history ?? ""}
            placeholder="Pais ou irmãos com problemas cardíacos, diabetes, AVC"
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-2xl">Objetivo e rotina</h2>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="goals">Teu objetivo principal</Label>
          <Textarea
            id="goals"
            name="goals"
            rows={2}
            defaultValue={initial.goals ?? ""}
            placeholder="Ex: emagrecer 8kg, ganhar massa muscular, voltar a correr"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="activity_level">Nível de atividade atual</Label>
          <select
            id="activity_level"
            name="activity_level"
            defaultValue={initial.activity_level ?? ""}
            className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm"
          >
            <option value="">Selecione…</option>
            {ACTIVITY.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="notes">Outras observações</Label>
          <Textarea
            id="notes"
            name="notes"
            rows={3}
            defaultValue={initial.notes ?? ""}
            placeholder="Qualquer coisa que tu acha que o Judson precisa saber"
          />
        </div>
      </section>

      <SubmitButton />
    </form>
  );
}
