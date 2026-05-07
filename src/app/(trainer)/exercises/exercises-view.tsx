"use client";

import { useMemo, useState } from "react";
import { PlayIcon, PlusIcon, SearchIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { ExerciseRow } from "./page";
import { ExerciseSheet } from "./exercise-sheet";

const ALL = "all";

export function ExercisesView({
  tenantId,
  initialExercises,
}: {
  tenantId: string;
  initialExercises: ExerciseRow[];
}) {
  const [search, setSearch] = useState("");
  const [muscle, setMuscle] = useState<string>(ALL);
  const [editing, setEditing] = useState<ExerciseRow | null>(null);
  const [creating, setCreating] = useState(false);

  const muscleGroups = useMemo(() => {
    const set = new Set<string>();
    for (const ex of initialExercises) {
      if (ex.muscle_group) set.add(ex.muscle_group);
    }
    return Array.from(set).sort();
  }, [initialExercises]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return initialExercises.filter((ex) => {
      if (muscle !== ALL && ex.muscle_group !== muscle) return false;
      if (!q) return true;
      return (
        ex.name.toLowerCase().includes(q) ||
        (ex.muscle_group ?? "").includes(q) ||
        (ex.equipment ?? "").includes(q)
      );
    });
  }, [initialExercises, search, muscle]);

  return (
    <>
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Painel
          </span>
          <h1 className="font-display text-4xl leading-none md:text-5xl">
            Exercícios
          </h1>
          <p className="text-sm text-muted-foreground">
            {initialExercises.length} no total — {muscleGroups.length} grupos
            musculares.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCreating(true)}
          className={buttonVariants({ size: "lg", className: "w-full md:w-auto" })}
        >
          <PlusIcon className="size-4" aria-hidden /> Novo exercício
        </button>
      </header>

      <div className="flex flex-col gap-3">
        <div className="relative">
          <SearchIcon
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, músculo ou equipamento"
            className="h-11 pl-9 text-base"
          />
        </div>

        <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
          <div className="flex gap-2">
            <Chip
              label={`Todos (${initialExercises.length})`}
              active={muscle === ALL}
              onClick={() => setMuscle(ALL)}
            />
            {muscleGroups.map((m) => (
              <Chip
                key={m}
                label={m}
                active={muscle === m}
                onClick={() => setMuscle(m)}
              />
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border bg-card/30 px-6 py-10 text-center text-sm text-muted-foreground">
          Nenhum exercício encontrado.
        </p>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((ex) => (
            <li key={ex.id}>
              <ExerciseCard
                exercise={ex}
                isCustom={ex.tenant_id === tenantId}
                onEdit={() => ex.tenant_id === tenantId && setEditing(ex)}
              />
            </li>
          ))}
        </ul>
      )}

      <ExerciseSheet
        open={creating || !!editing}
        onOpenChange={(open) => {
          if (!open) {
            setCreating(false);
            setEditing(null);
          }
        }}
        exercise={editing}
      />
    </>
  );
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-3 py-1.5 text-sm capitalize transition-colors",
        active
          ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white"
          : "border-border bg-card/40 text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}

function ExerciseCard({
  exercise,
  isCustom,
  onEdit,
}: {
  exercise: ExerciseRow;
  isCustom: boolean;
  onEdit: () => void;
}) {
  return (
    <button
      type="button"
      onClick={isCustom ? onEdit : undefined}
      className={cn(
        "flex w-full flex-col gap-3 rounded-xl border border-border bg-card/40 p-4 text-left transition-colors",
        isCustom && "hover:bg-card",
      )}
      disabled={!isCustom}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-medium leading-tight text-foreground">
          {exercise.name}
        </span>
        {isCustom ? (
          <Badge variant="default">Meu</Badge>
        ) : (
          <Badge variant="outline">Biblioteca</Badge>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        {exercise.muscle_group ? (
          <span className="capitalize">{exercise.muscle_group}</span>
        ) : null}
        {exercise.equipment ? (
          <>
            <span aria-hidden>·</span>
            <span className="capitalize">{exercise.equipment}</span>
          </>
        ) : null}
        {exercise.video_url ? (
          <span className="ml-auto inline-flex items-center gap-1 text-foreground">
            <PlayIcon className="size-3" aria-hidden /> vídeo
          </span>
        ) : null}
      </div>
    </button>
  );
}
