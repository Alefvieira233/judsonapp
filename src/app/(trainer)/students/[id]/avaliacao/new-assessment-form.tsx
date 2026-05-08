"use client";

import { useActionState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  createAssessmentAction,
  type CreateAssessmentState,
} from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? "Salvando…" : "Registrar avaliação"}
    </Button>
  );
}

const FIELDS: Array<{ key: string; label: string; suffix: string; step?: string }> = [
  { key: "weight_kg", label: "Peso", suffix: "kg", step: "0.1" },
  { key: "height_cm", label: "Altura", suffix: "cm", step: "0.5" },
  { key: "body_fat_pct", label: "% gordura", suffix: "%", step: "0.1" },
  { key: "muscle_pct", label: "% músculo", suffix: "%", step: "0.1" },
  { key: "waist_cm", label: "Cintura", suffix: "cm", step: "0.1" },
  { key: "hip_cm", label: "Quadril", suffix: "cm", step: "0.1" },
  { key: "chest_cm", label: "Peito", suffix: "cm", step: "0.1" },
  { key: "arm_cm", label: "Braço", suffix: "cm", step: "0.1" },
  { key: "thigh_cm", label: "Coxa", suffix: "cm", step: "0.1" },
  { key: "calf_cm", label: "Panturrilha", suffix: "cm", step: "0.1" },
];

export function NewAssessmentForm({ studentId }: { studentId: string }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState<CreateAssessmentState, FormData>(
    async (prev, fd) => {
      const next = await createAssessmentAction(prev, fd);
      if (next?.ok) {
        toast.success("Avaliação registrada");
        formRef.current?.reset();
        router.refresh();
      } else if (next?.ok === false) {
        toast.error(next.error);
      }
      return next;
    },
    undefined,
  );
  void state;

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-col gap-4 rounded-2xl border border-border bg-card/30 p-4"
    >
      <input type="hidden" name="student_id" value={studentId} />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="measured_at">Data da medida</Label>
        <Input
          id="measured_at"
          name="measured_at"
          type="datetime-local"
          defaultValue={(() => {
            const d = new Date();
            d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
            return d.toISOString().slice(0, 16);
          })()}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {FIELDS.map((f) => (
          <div key={f.key} className="flex flex-col gap-1">
            <Label htmlFor={f.key} className="text-[11px]">
              {f.label} <span className="text-muted-foreground">({f.suffix})</span>
            </Label>
            <Input
              id={f.key}
              name={f.key}
              inputMode="decimal"
              type="text"
              step={f.step}
              placeholder="—"
              className="text-center tabular-nums"
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          name="notes"
          rows={2}
          placeholder="Postura, simetria, condições especiais"
        />
      </div>

      <SubmitButton />
    </form>
  );
}
