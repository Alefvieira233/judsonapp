"use client";

import { useState } from "react";
import { UserPlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { cloneWorkoutToStudentAction } from "./actions";

type Student = { id: string; full_name: string };

export function AssignTemplateButton({
  workoutId,
  workoutTitle,
  students,
}: {
  workoutId: string;
  workoutTitle: string;
  students: Student[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-2"
      >
        <UserPlusIcon className="size-4" aria-hidden /> Atribuir
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[92dvh] overflow-y-auto rounded-t-2xl border-border bg-card pb-[calc(env(safe-area-inset-bottom)+1.5rem)] sm:max-w-md sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:rounded-2xl"
        >
          <SheetHeader>
            <SheetTitle className="font-display text-2xl">
              Atribuir template
            </SheetTitle>
            <SheetDescription>
              Cria uma cópia de <span className="font-medium text-foreground">{workoutTitle}</span> pra aluna escolhida. O template original fica intacto.
            </SheetDescription>
          </SheetHeader>

          <form action={cloneWorkoutToStudentAction} className="flex flex-col gap-4 px-4 pb-2">
            <input type="hidden" name="id" value={workoutId} />
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`student-${workoutId}`}>Aluna</Label>
              {students.length === 0 ? (
                <p className="rounded-md border border-border bg-background/40 px-3 py-2 text-sm text-muted-foreground">
                  Cadastre uma aluna ativa primeiro.
                </p>
              ) : (
                <select
                  id={`student-${workoutId}`}
                  name="student_id"
                  required
                  defaultValue=""
                  className="h-10 rounded-lg border border-input bg-background px-3 text-base"
                >
                  <option value="" disabled>
                    Escolhe a aluna…
                  </option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.full_name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" size="lg" disabled={students.length === 0}>
                Atribuir e abrir
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
