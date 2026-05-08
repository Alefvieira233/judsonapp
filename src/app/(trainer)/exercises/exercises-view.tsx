"use client";

import { useMemo, useState } from "react";
import { PlayIcon, PlusIcon, SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  ExerciseIcon,
  muscleToneClass,
} from "@/components/exercise/exercise-icon";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
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
  const t = useTranslations("exercises");
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
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("subtitle", {
          count: initialExercises.length,
          groups: muscleGroups.length,
        })}
        trailing={
          <button
            type="button"
            onClick={() => setCreating(true)}
            className={buttonVariants({ size: "lg", className: "w-full md:w-auto" })}
          >
            <PlusIcon className="size-4" aria-hidden /> {t("new_exercise")}
          </button>
        }
      />

      <div className="flex flex-col gap-3">
        <div className="relative">
          <SearchIcon
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("search_placeholder")}
            className="h-11 pl-9 text-base"
          />
        </div>

        <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
          <div className="flex gap-2">
            <Chip
              label={t("filter_all", { count: initialExercises.length })}
              active={muscle === ALL}
              onClick={() => setMuscle(ALL)}
            />
            {muscleGroups.map((m) => (
              <Chip
                key={m}
                label={m}
                muscleKey={m}
                active={muscle === m}
                onClick={() => setMuscle(m)}
              />
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title={t("empty_title")} description={t("empty_body")} />
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
  muscleKey,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  muscleKey?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm capitalize transition-colors",
        active
          ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white"
          : "border-border bg-card/40 text-muted-foreground hover:text-foreground",
      )}
    >
      {muscleKey ? (
        <ExerciseIcon
          muscleGroup={muscleKey}
          size={3}
          className={active ? "text-white" : "text-muted-foreground"}
        />
      ) : null}
      <span className="leading-none">{label}</span>
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
  const t = useTranslations("exercises");
  return (
    <button
      type="button"
      onClick={isCustom ? onEdit : undefined}
      className={cn(
        "group relative flex h-full w-full flex-col gap-3 overflow-hidden rounded-xl border border-border bg-gradient-to-br p-4 text-left transition-all duration-300 ease-out",
        muscleToneClass(exercise.muscle_group, exercise.equipment),
        isCustom && "hover:-translate-y-0.5 hover:border-[var(--brand-primary)]/40",
      )}
      disabled={!isCustom}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-[var(--brand-primary)]/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
      />

      <div className="relative flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-border bg-background/60">
          <ExerciseIcon
            muscleGroup={exercise.muscle_group}
            equipment={exercise.equipment}
            size={5}
          />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate font-display text-lg leading-tight text-foreground">
            {exercise.name}
          </span>
          <div className="flex flex-wrap items-center gap-1 text-[11px] text-muted-foreground">
            {exercise.muscle_group ? (
              <span className="capitalize">{exercise.muscle_group}</span>
            ) : null}
            {exercise.equipment ? (
              <>
                <span aria-hidden>·</span>
                <span className="capitalize">{exercise.equipment}</span>
              </>
            ) : null}
          </div>
        </div>
        {isCustom ? (
          <Badge variant="default" className="shrink-0">
            {t("badge_mine")}
          </Badge>
        ) : (
          <Badge variant="outline" className="shrink-0">
            {t("badge_library")}
          </Badge>
        )}
      </div>

      {exercise.video_url ? (
        <div className="relative flex items-center justify-end">
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card/60 px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-foreground">
            <PlayIcon className="size-3" aria-hidden /> {t("video_label")}
          </span>
        </div>
      ) : null}
    </button>
  );
}
