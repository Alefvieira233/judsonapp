"use client";

import { useMemo, useState } from "react";
import { SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type Exercise = {
  id: string;
  name: string;
  muscle_group: string | null;
  equipment: string | null;
};

export function ExercisePicker({
  open,
  onOpenChange,
  exercises,
  excludeIds,
  onPick,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  exercises: Exercise[];
  excludeIds: string[];
  onPick: (ex: Exercise) => void;
}) {
  const [q, setQ] = useState("");

  const excluded = useMemo(() => new Set(excludeIds), [excludeIds]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return exercises
      .filter((ex) => !excluded.has(ex.id))
      .filter(
        (ex) =>
          !query ||
          ex.name.toLowerCase().includes(query) ||
          (ex.muscle_group ?? "").includes(query) ||
          (ex.equipment ?? "").includes(query),
      )
      .slice(0, 80);
  }, [exercises, excluded, q]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="flex max-h-[92dvh] flex-col overflow-hidden rounded-t-2xl border-border bg-card pb-[calc(env(safe-area-inset-bottom)+1rem)] sm:max-w-md sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:rounded-2xl"
      >
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">
            Adicionar exercício
          </SheetTitle>
          <SheetDescription>
            {exercises.length - excluded.size} disponíveis (já no treino: {excluded.size}).
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-3">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar"
              className="h-11 pl-9 text-base"
            />
          </div>
        </div>

        <ul className="flex-1 overflow-y-auto px-2 pb-2">
          {filtered.length === 0 ? (
            <li className="px-2 py-6 text-center text-sm text-muted-foreground">
              Nada encontrado.
            </li>
          ) : (
            filtered.map((ex) => (
              <li key={ex.id}>
                <button
                  type="button"
                  onClick={() => onPick(ex)}
                  className="flex w-full flex-col items-start gap-0.5 rounded-md px-3 py-3 text-left transition-colors hover:bg-card"
                >
                  <span className="font-medium text-foreground">{ex.name}</span>
                  <span className="text-xs capitalize text-muted-foreground">
                    {[ex.muscle_group, ex.equipment].filter(Boolean).join(" · ")}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
