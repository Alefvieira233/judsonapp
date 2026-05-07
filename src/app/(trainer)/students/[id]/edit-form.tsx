"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  updateStudentAction,
  type UpdateStudentState,
} from "../actions";

type Student = {
  id: string;
  full_name: string;
  goal: string | null;
  observations: string | null;
  active: boolean;
};

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? "Salvando…" : "Salvar"}
    </Button>
  );
}

export function EditStudentForm({ student }: { student: Student }) {
  const [state, formAction] = useActionState<UpdateStudentState, FormData>(
    updateStudentAction,
    undefined,
  );

  useEffect(() => {
    if (state?.ok) toast.success("Aluna atualizada");
    if (state?.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="id" value={student.id} />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="full_name">Nome</Label>
        <Input
          id="full_name"
          name="full_name"
          defaultValue={student.full_name}
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="goal">Objetivo</Label>
        <Input
          id="goal"
          name="goal"
          defaultValue={student.goal ?? ""}
          placeholder="Ex.: Hipertrofia, perder gordura, condicionamento"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="observations">Observações</Label>
        <Textarea
          id="observations"
          name="observations"
          defaultValue={student.observations ?? ""}
          rows={4}
          placeholder="Lesões, restrições, preferências…"
        />
      </div>

      <label className="flex items-center gap-3 rounded-md border border-border bg-card/40 p-3">
        <input
          type="checkbox"
          name="active"
          defaultChecked={student.active}
          className="size-4 accent-[var(--brand-primary)]"
        />
        <span className="text-sm">
          <span className="font-medium text-foreground">Aluna ativa</span>
          <span className="block text-xs text-muted-foreground">
            Desmarque pra arquivar sem apagar histórico.
          </span>
        </span>
      </label>

      <div className="flex justify-end pt-2">
        <SaveButton />
      </div>
    </form>
  );
}
