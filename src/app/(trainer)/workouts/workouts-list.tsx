"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SearchIcon, UserIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { ExerciseIcon, muscleToneClass } from "@/components/exercise/exercise-icon";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { AssignTemplateButton } from "./assign-template";

const DAYS = ["D", "S", "T", "Q", "Q", "S", "S"];

export type WorkoutCard = {
  id: string;
  title: string;
  description: string | null;
  scheduled_days: number[] | null;
  active: boolean | null;
  updated_at: string | null;
  student_id: string | null;
  student: { id: string; full_name: string } | null;
  item_count: number;
  dominant_mg: string | null;
};

type View = "all" | "templates" | "assigned" | "unassigned";

export function WorkoutsList({
  workouts,
  students,
  initialView,
}: {
  workouts: WorkoutCard[];
  students: { id: string; full_name: string }[];
  initialView: View;
}) {
  const t = useTranslations("workouts");
  const [view, setView] = useState<View>(initialView);
  const [search, setSearch] = useState("");

  const counts = useMemo(() => {
    const templates = workouts.filter((w) => !w.student_id).length;
    const assigned = workouts.length - templates;
    return {
      all: workouts.length,
      templates,
      assigned,
      unassigned: templates,
    };
  }, [workouts]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return workouts.filter((w) => {
      if (view === "templates" && w.student_id) return false;
      if (view === "assigned" && !w.student_id) return false;
      if (view === "unassigned" && w.student_id) return false;
      if (!q) return true;
      const haystack = `${w.title} ${w.student?.full_name ?? ""} ${w.description ?? ""}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [workouts, view, search]);

  const tabs: { id: View; label: string; count: number }[] = [
    { id: "all", label: t("tab_all"), count: counts.all },
    { id: "templates", label: t("tab_templates"), count: counts.templates },
    { id: "assigned", label: t("tab_assigned"), count: counts.assigned },
    { id: "unassigned", label: "Sem aluna", count: counts.unassigned },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <div className="relative">
          <SearchIcon
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar título, aluna…"
            className="h-11 pl-9 text-base"
          />
        </div>

        <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
          <div className="flex gap-1 rounded-xl border border-border bg-card/30 p-1">
            {tabs.map((tab) => {
              const active = view === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setView(tab.id)}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {tab.label}
                  <span className="text-xs opacity-70 tabular-nums">
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState view={view} hasSearch={search.length > 0} />
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {filtered.map((w) => {
            const isTemplate = w.student_id == null;
            return (
              <li key={w.id}>
                <div
                  className={cn(
                    "group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-border bg-gradient-to-br p-4 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[var(--brand-primary)]/40",
                    muscleToneClass(w.dominant_mg, null),
                  )}
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-[var(--brand-primary)]/8 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                  />

                  <Link
                    href={`/workouts/${w.id}`}
                    className="relative flex items-start gap-3"
                  >
                    <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-border bg-background/60">
                      <ExerciseIcon muscleGroup={w.dominant_mg} size={6} />
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <span className="truncate font-display text-2xl leading-tight">
                        {w.title}
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                        {isTemplate ? (
                          <Badge
                            variant="outline"
                            className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
                          >
                            {t("is_template")}
                          </Badge>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full border border-[var(--brand-primary)]/30 bg-[var(--brand-primary)]/10 px-2 py-0.5 text-foreground">
                            <UserIcon className="size-3" aria-hidden />
                            <span className="truncate max-w-[10rem]">
                              {w.student?.full_name ?? t("student_removed")}
                            </span>
                          </span>
                        )}
                        <span className="tabular-nums">
                          {w.item_count === 1
                            ? t("exercise_one", { count: w.item_count })
                            : t("exercise_other", { count: w.item_count })}
                        </span>
                      </div>
                    </div>
                    {w.active === false ? (
                      <Badge variant="outline" className="shrink-0 text-muted-foreground">
                        {t("inactive")}
                      </Badge>
                    ) : null}
                  </Link>

                  <div className="relative flex items-center justify-between gap-3">
                    <DaysRow days={w.scheduled_days ?? []} />
                    {isTemplate ? (
                      <AssignTemplateButton
                        workoutId={w.id}
                        workoutTitle={w.title}
                        students={students}
                      />
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function DaysRow({ days }: { days: number[] }) {
  const set = new Set(days);
  return (
    <div className="flex gap-1">
      {DAYS.map((label, idx) => (
        <span
          key={idx}
          className={cn(
            "grid size-7 place-items-center rounded-md text-xs",
            set.has(idx)
              ? "bg-[var(--brand-primary)] text-white"
              : "bg-card text-muted-foreground",
          )}
        >
          {label}
        </span>
      ))}
    </div>
  );
}

function EmptyState({
  view,
  hasSearch,
}: {
  view: View;
  hasSearch: boolean;
}) {
  const t = useTranslations("workouts");
  if (hasSearch) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card/30 px-6 py-12 text-center">
        <h2 className="font-display text-2xl">Nada bate com a busca</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Tenta outra palavra ou limpe os filtros.
        </p>
      </div>
    );
  }
  const copy =
    view === "templates"
      ? { title: t("empty_templates_title"), body: t("empty_templates_body") }
      : view === "assigned"
        ? { title: t("empty_assigned_title"), body: t("empty_assigned_body") }
        : view === "unassigned"
          ? {
              title: "Nenhum treino sem aluna",
              body: "Todos os treinos estão atribuídos. Crie um template ou abre um treino e remove a aluna.",
            }
          : { title: t("empty_all_title"), body: t("empty_all_body") };
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card/30 px-6 py-12 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-card font-display text-xl text-foreground">
        +
      </span>
      <h2 className="font-display text-2xl">{copy.title}</h2>
      <p className="max-w-sm text-sm text-muted-foreground">{copy.body}</p>
    </div>
  );
}
