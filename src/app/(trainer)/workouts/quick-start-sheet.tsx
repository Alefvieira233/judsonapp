"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CopyIcon,
  FilesIcon,
  PencilLineIcon,
  PlusIcon,
  UserIcon,
} from "lucide-react";
import { toast } from "sonner";

import { ExerciseIcon } from "@/components/exercise/exercise-icon";
import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

import { cloneWorkoutToStudentAction, duplicateForStudentAction } from "./actions";

type Student = { id: string; full_name: string };
type Template = {
  id: string;
  title: string;
  exercise_count: number;
  dominant_muscle: string | null;
};
type StudentWorkout = {
  id: string;
  title: string;
  student_name: string;
};

type Mode = "menu" | "template" | "duplicate";

export function QuickStartFab({
  students,
  templates,
  studentWorkouts,
}: {
  students: Student[];
  templates: Template[];
  studentWorkouts: StudentWorkout[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Novo treino"
        className={cn(
          // Mobile FAB
          "fixed right-4 z-30 grid size-14 place-items-center rounded-full bg-[var(--brand-primary)] text-white shadow-lg shadow-[var(--brand-primary)]/30 transition-transform active:scale-95 md:hidden",
          // Sit above bottom nav (~72px) + safe area
          "bottom-[calc(72px+env(safe-area-inset-bottom)+1rem)]",
        )}
      >
        <PlusIcon className="size-6" />
      </button>

      <QuickStartSheet
        open={open}
        onOpenChange={setOpen}
        students={students}
        templates={templates}
        studentWorkouts={studentWorkouts}
      />
    </>
  );
}

export function QuickStartButton({
  students,
  templates,
  studentWorkouts,
  className,
}: {
  students: Student[];
  templates: Template[];
  studentWorkouts: StudentWorkout[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          buttonVariants({ size: "lg" }),
          "w-full md:w-auto",
          className,
        )}
      >
        <PlusIcon className="size-4" aria-hidden /> Novo treino
      </button>
      <QuickStartSheet
        open={open}
        onOpenChange={setOpen}
        students={students}
        templates={templates}
        studentWorkouts={studentWorkouts}
      />
    </>
  );
}

function QuickStartSheet({
  open,
  onOpenChange,
  students,
  templates,
  studentWorkouts,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  students: Student[];
  templates: Template[];
  studentWorkouts: StudentWorkout[];
}) {
  const [mode, setMode] = useState<Mode>("menu");

  const handleClose = (next: boolean) => {
    onOpenChange(next);
    if (!next) setTimeout(() => setMode("menu"), 200);
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent
        side="bottom"
        className="max-h-[92dvh] overflow-y-auto rounded-t-2xl border-border bg-card pb-[calc(env(safe-area-inset-bottom)+1.5rem)] sm:max-w-md sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:rounded-2xl"
      >
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">
            {mode === "menu"
              ? "Novo treino"
              : mode === "template"
                ? "Usar template"
                : "Duplicar de aluna"}
          </SheetTitle>
          <SheetDescription>
            {mode === "menu"
              ? "Escolhe o ponto de partida — em branco, template ou treino existente."
              : mode === "template"
                ? "Clona pra aluna, mantém o template intacto."
                : "Cópia integral pra outra aluna (ou ela mesma de novo)."}
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-2">
          {mode === "menu" ? (
            <Menu
              onPick={setMode}
              hasTemplates={templates.length > 0}
              hasWorkouts={studentWorkouts.length > 0}
              onClose={() => handleClose(false)}
            />
          ) : mode === "template" ? (
            <TemplateForm
              templates={templates}
              students={students}
              onBack={() => setMode("menu")}
              onDone={() => handleClose(false)}
            />
          ) : (
            <DuplicateForm
              workouts={studentWorkouts}
              students={students}
              onBack={() => setMode("menu")}
              onDone={() => handleClose(false)}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Menu({
  onPick,
  hasTemplates,
  hasWorkouts,
  onClose,
}: {
  onPick: (m: Mode) => void;
  hasTemplates: boolean;
  hasWorkouts: boolean;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col gap-2 pt-2">
      <Link
        href="/workouts/new"
        onClick={onClose}
        className="group flex items-center gap-3 rounded-xl border border-border bg-background/40 p-4 transition-colors hover:bg-card/60"
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[var(--brand-primary)]/15 text-[var(--brand-primary)]">
          <PencilLineIcon className="size-5" />
        </span>
        <div className="flex min-w-0 flex-col">
          <span className="font-medium text-foreground">Em branco</span>
          <span className="text-xs text-muted-foreground">
            Começa do zero, monta exercício por exercício.
          </span>
        </div>
      </Link>

      <button
        type="button"
        disabled={!hasTemplates}
        onClick={() => onPick("template")}
        className="group flex items-center gap-3 rounded-xl border border-border bg-background/40 p-4 text-left transition-colors enabled:hover:bg-card/60 disabled:opacity-50"
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[var(--brand-primary)]/15 text-[var(--brand-primary)]">
          <FilesIcon className="size-5" />
        </span>
        <div className="flex min-w-0 flex-col">
          <span className="font-medium text-foreground">Usar template</span>
          <span className="text-xs text-muted-foreground">
            {hasTemplates
              ? "Pega um modelo pronto e atribui pra uma aluna."
              : "Crie um template primeiro."}
          </span>
        </div>
      </button>

      <button
        type="button"
        disabled={!hasWorkouts}
        onClick={() => onPick("duplicate")}
        className="group flex items-center gap-3 rounded-xl border border-border bg-background/40 p-4 text-left transition-colors enabled:hover:bg-card/60 disabled:opacity-50"
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[var(--brand-primary)]/15 text-[var(--brand-primary)]">
          <CopyIcon className="size-5" />
        </span>
        <div className="flex min-w-0 flex-col">
          <span className="font-medium text-foreground">Duplicar de aluna</span>
          <span className="text-xs text-muted-foreground">
            {hasWorkouts
              ? "Pega um treino existente e clona pra outra aluna."
              : "Nenhum treino atribuído ainda."}
          </span>
        </div>
      </button>
    </div>
  );
}

function TemplateForm({
  templates,
  students,
  onBack,
  onDone,
}: {
  templates: Template[];
  students: Student[];
  onBack: () => void;
  onDone: () => void;
}) {
  const [pickedTemplate, setPickedTemplate] = useState<string>(
    templates[0]?.id ?? "",
  );
  const [studentId, setStudentId] = useState<string>("");
  const [pending, startTransition] = useTransition();

  const submit = () => {
    if (!pickedTemplate || !studentId) {
      toast.error("Escolhe template e aluna.");
      return;
    }
    startTransition(async () => {
      const fd = new FormData();
      fd.set("id", pickedTemplate);
      fd.set("student_id", studentId);
      try {
        await cloneWorkoutToStudentAction(fd);
        // Server action redirects on success.
        onDone();
      } catch (err) {
        // Next.js redirects throw a NEXT_REDIRECT error — let it propagate.
        throw err;
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 pt-2">
      <div className="flex flex-col gap-1.5">
        <Label>Template</Label>
        <ul className="flex max-h-64 flex-col gap-1.5 overflow-y-auto">
          {templates.map((t) => {
            const active = pickedTemplate === t.id;
            return (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => setPickedTemplate(t.id)}
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
                    <span className="truncate text-sm font-medium">{t.title}</span>
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
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="qs-student">Aluna</Label>
        <select
          id="qs-student"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="h-10 rounded-lg border border-input bg-background px-3 text-base"
          required
        >
          <option value="">Escolhe a aluna…</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.full_name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-between gap-2 pt-2">
        <Button variant="ghost" onClick={onBack}>
          Voltar
        </Button>
        <Button size="lg" onClick={submit} disabled={pending}>
          {pending ? "Clonando…" : "Atribuir e abrir"}
        </Button>
      </div>
    </div>
  );
}

function DuplicateForm({
  workouts,
  students,
  onBack,
  onDone,
}: {
  workouts: StudentWorkout[];
  students: Student[];
  onBack: () => void;
  onDone: () => void;
}) {
  const router = useRouter();
  const [pickedWorkout, setPickedWorkout] = useState<string>(
    workouts[0]?.id ?? "",
  );
  const [studentId, setStudentId] = useState<string>("");
  const [pending, startTransition] = useTransition();

  const submit = () => {
    if (!pickedWorkout || !studentId) {
      toast.error("Escolhe treino e aluna.");
      return;
    }
    startTransition(async () => {
      const fd = new FormData();
      fd.set("id", pickedWorkout);
      fd.set("student_id", studentId);
      const res = await duplicateForStudentAction(fd);
      if (res?.error) {
        toast.error(res.error);
        return;
      }
      if (res?.id) {
        onDone();
        router.push(`/workouts/${res.id}`);
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 pt-2">
      <div className="flex flex-col gap-1.5">
        <Label>Treino base</Label>
        <ul className="flex max-h-64 flex-col gap-1.5 overflow-y-auto">
          {workouts.map((w) => {
            const active = pickedWorkout === w.id;
            return (
              <li key={w.id}>
                <button
                  type="button"
                  onClick={() => setPickedWorkout(w.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border p-2.5 text-left transition-colors",
                    active
                      ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]/10"
                      : "border-border bg-background/40 hover:bg-card/60",
                  )}
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-full border border-border bg-background/60 text-xs text-muted-foreground">
                    <UserIcon className="size-4" />
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-medium">{w.title}</span>
                    <span className="truncate text-[11px] text-muted-foreground">
                      {w.student_name}
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="qs-dup-student">Atribuir pra</Label>
        <select
          id="qs-dup-student"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="h-10 rounded-lg border border-input bg-background px-3 text-base"
          required
        >
          <option value="">Escolhe a aluna…</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.full_name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-between gap-2 pt-2">
        <Button variant="ghost" onClick={onBack}>
          Voltar
        </Button>
        <Button size="lg" onClick={submit} disabled={pending}>
          {pending ? "Duplicando…" : "Duplicar e abrir"}
        </Button>
      </div>
    </div>
  );
}
