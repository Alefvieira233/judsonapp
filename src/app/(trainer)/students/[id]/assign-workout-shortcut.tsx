"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CopyIcon, FilesIcon, PencilLineIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";

import { ExerciseIcon } from "@/components/exercise/exercise-icon";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

import { duplicateForStudentAction } from "../../workouts/actions";

type Template = {
  id: string;
  title: string;
  exercise_count: number;
  dominant_muscle: string | null;
};

export function AssignWorkoutShortcut({
  studentId,
  studentName,
  templates,
}: {
  studentId: string;
  studentName: string;
  templates: Template[];
}) {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <section className="flex flex-col gap-2">
      <h2 className="font-display text-lg">Atribuir treino</h2>
      <div className="grid grid-cols-2 gap-2">
        <Link
          href={`/workouts/new?student=${studentId}`}
          className="flex flex-col items-start gap-1.5 rounded-xl border border-border bg-card/30 p-3 transition-colors hover:bg-card/60"
        >
          <span className="grid size-9 place-items-center rounded-md bg-[var(--brand-primary)]/15 text-[var(--brand-primary)]">
            <PencilLineIcon className="size-4" />
          </span>
          <span className="text-sm font-medium">Em branco</span>
          <span className="text-[11px] text-muted-foreground">
            Monta do zero, exercício por exercício.
          </span>
        </Link>
        <button
          type="button"
          disabled={templates.length === 0}
          onClick={() => setPickerOpen(true)}
          className="flex flex-col items-start gap-1.5 rounded-xl border border-border bg-card/30 p-3 text-left transition-colors enabled:hover:bg-card/60 disabled:opacity-50"
        >
          <span className="grid size-9 place-items-center rounded-md bg-[var(--brand-primary)]/15 text-[var(--brand-primary)]">
            <FilesIcon className="size-4" />
          </span>
          <span className="text-sm font-medium">Duplicar template</span>
          <span className="text-[11px] text-muted-foreground">
            {templates.length === 0
              ? "Sem templates ainda."
              : `${templates.length} ${templates.length === 1 ? "modelo pronto" : "modelos prontos"}.`}
          </span>
        </button>
      </div>

      <TemplatePickerSheet
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        templates={templates}
        studentId={studentId}
        studentName={studentName}
      />
    </section>
  );
}

function TemplatePickerSheet({
  open,
  onOpenChange,
  templates,
  studentId,
  studentName,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  templates: Template[];
  studentId: string;
  studentName: string;
}) {
  const router = useRouter();
  const [pickedId, setPickedId] = useState<string>(templates[0]?.id ?? "");
  const [pending, startTransition] = useTransition();

  const submit = () => {
    if (!pickedId) {
      toast.error("Escolhe um template.");
      return;
    }
    startTransition(async () => {
      const fd = new FormData();
      fd.set("id", pickedId);
      fd.set("student_id", studentId);
      const res = await duplicateForStudentAction(fd);
      if (res?.error) {
        toast.error(res.error);
        return;
      }
      if (res?.id) {
        onOpenChange(false);
        router.push(`/workouts/${res.id}`);
      }
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[92dvh] overflow-y-auto rounded-t-2xl border-border bg-card pb-[calc(env(safe-area-inset-bottom)+1.5rem)] sm:max-w-md sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:rounded-2xl"
      >
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">
            Atribuir template
          </SheetTitle>
          <SheetDescription>
            Vai virar treino de {studentName} (cópia integral). O template
            original fica intacto.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-4 pb-2">
          <ul className="flex max-h-72 flex-col gap-1.5 overflow-y-auto">
            {templates.map((t) => {
              const active = pickedId === t.id;
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => setPickedId(t.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg border p-2.5 text-left transition-colors",
                      active
                        ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]/10"
                        : "border-border bg-background/40 hover:bg-card/60",
                    )}
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-border bg-background/60">
                      <ExerciseIcon muscleGroup={t.dominant_muscle} size={4} />
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-sm font-medium">
                        {t.title}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {t.exercise_count}{" "}
                        {t.exercise_count === 1 ? "exercício" : "exercícios"}
                      </span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="flex justify-between gap-2 pt-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              <PlusIcon className="size-4" /> Cancelar
            </Button>
            <Button size="lg" onClick={submit} disabled={pending}>
              <CopyIcon className="size-4" />{" "}
              {pending ? "Clonando…" : "Atribuir e abrir"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
