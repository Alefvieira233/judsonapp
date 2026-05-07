"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { createWorkoutAction, type CreateWorkoutState } from "../actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full md:w-auto" disabled={pending}>
      {pending ? "Criando…" : "Criar e abrir builder"}
    </Button>
  );
}

export function NewWorkoutForm({
  students,
}: {
  students: { id: string; full_name: string }[];
}) {
  const [state, formAction] = useActionState<CreateWorkoutState, FormData>(
    createWorkoutAction,
    undefined,
  );

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Título do treino</Label>
        <Input
          id="title"
          name="title"
          required
          placeholder="Treino A — peito e tríceps"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="student_id">Aluna (opcional)</Label>
        <select
          id="student_id"
          name="student_id"
          className="h-10 rounded-lg border border-input bg-transparent px-3 text-base"
          defaultValue=""
        >
          <option value="">— Nenhuma (modelo) —</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.full_name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Descrição (opcional)</Label>
        <Textarea
          id="description"
          name="description"
          rows={3}
          placeholder="Aquecimento 5min · Foco em técnica · 60-90s descanso"
        />
      </div>

      {state?.error ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      ) : null}

      <div className="flex justify-end pt-2">
        <SubmitButton />
      </div>
    </form>
  );
}
