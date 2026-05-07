"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import type { ExerciseRow } from "./page";
import {
  deleteExerciseAction,
  saveExerciseAction,
  type ExerciseState,
} from "./actions";

const MUSCLE_OPTIONS = [
  "peito",
  "costas",
  "ombro",
  "bíceps",
  "tríceps",
  "quadríceps",
  "posterior",
  "glúteo",
  "panturrilha",
  "abdômen",
];

const EQUIPMENT_OPTIONS = [
  "barra",
  "halteres",
  "máquina",
  "polia",
  "peso corporal",
  "banco scott",
];

function SaveButton({ editing }: { editing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? "Salvando…" : editing ? "Salvar" : "Criar"}
    </Button>
  );
}

export function ExerciseSheet({
  open,
  onOpenChange,
  exercise,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exercise: ExerciseRow | null;
}) {
  const [state, formAction] = useActionState<ExerciseState, FormData>(
    saveExerciseAction,
    undefined,
  );

  useEffect(() => {
    if (state?.ok) {
      toast.success(exercise ? "Exercício atualizado" : "Exercício criado");
      onOpenChange(false);
    }
    if (state?.error) toast.error(state.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[92dvh] overflow-y-auto rounded-t-2xl border-border bg-card pb-[calc(env(safe-area-inset-bottom)+1.5rem)] sm:max-w-lg sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:rounded-2xl"
      >
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">
            {exercise ? "Editar exercício" : "Novo exercício"}
          </SheetTitle>
          <SheetDescription>
            Vídeo aceita link do YouTube ou Instagram (Reel/Post).
          </SheetDescription>
        </SheetHeader>

        <form action={formAction} className="flex flex-col gap-4 px-4 pb-4">
          {exercise ? (
            <input type="hidden" name="id" value={exercise.id} />
          ) : null}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              name="name"
              defaultValue={exercise?.name ?? ""}
              required
              placeholder="Supino reto com barra"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="muscle_group">Grupo muscular</Label>
              <Input
                id="muscle_group"
                name="muscle_group"
                list="muscle-options"
                defaultValue={exercise?.muscle_group ?? ""}
                placeholder="peito"
              />
              <datalist id="muscle-options">
                {MUSCLE_OPTIONS.map((m) => (
                  <option key={m} value={m} />
                ))}
              </datalist>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="equipment">Equipamento</Label>
              <Input
                id="equipment"
                name="equipment"
                list="equip-options"
                defaultValue={exercise?.equipment ?? ""}
                placeholder="barra"
              />
              <datalist id="equip-options">
                {EQUIPMENT_OPTIONS.map((e) => (
                  <option key={e} value={e} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="video_url">Link do vídeo (opcional)</Label>
            <Input
              id="video_url"
              name="video_url"
              type="url"
              defaultValue={exercise?.video_url ?? ""}
              placeholder="https://www.instagram.com/reel/..."
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="instructions">Instruções (opcional)</Label>
            <Textarea
              id="instructions"
              name="instructions"
              rows={3}
              defaultValue={exercise?.instructions ?? ""}
              placeholder="Postura, ritmo, foco da execução…"
            />
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            {exercise ? (
              <form action={deleteExerciseAction}>
                <input type="hidden" name="id" value={exercise.id} />
                <Button type="submit" variant="ghost" size="sm">
                  Apagar
                </Button>
              </form>
            ) : (
              <span />
            )}
            <SaveButton editing={!!exercise} />
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
