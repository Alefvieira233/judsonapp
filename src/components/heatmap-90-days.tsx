"use client";

import { useMemo, useState } from "react";

const MS_PER_DAY = 86_400_000;
const COLUMNS = 13;
const ROWS = 7;
const CELL_COUNT = COLUMNS * ROWS; // 91

const MONTH_SHORT = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

export type Heatmap90DaysProps = {
  /**
   * Array of 91 counts. index 0 = today minus 90 days, index 90 = today.
   * Caller computes server-side from `workout_logs.completed_at`.
   */
  counts: number[];
  /** ISO date for index 90 (today). Used to label tooltips. */
  todayIso: string;
};

function colorFor(count: number): string {
  if (count <= 0) return "bg-card/40 border-border/60";
  if (count === 1) return "bg-[var(--brand-primary)]/30 border-[var(--brand-primary)]/40";
  return "bg-[var(--brand-primary)] border-[var(--brand-primary)]";
}

function formatDate(d: Date): string {
  return `${d.getDate().toString().padStart(2, "0")} ${MONTH_SHORT[d.getMonth()]}`;
}

export function Heatmap90Days({ counts, todayIso }: Heatmap90DaysProps) {
  const [hover, setHover] = useState<{ idx: number; label: string } | null>(null);
  const today = useMemo(() => new Date(todayIso), [todayIso]);

  const cells = useMemo(() => {
    const padded = Array.from({ length: CELL_COUNT }, (_, i) => counts[i] ?? 0);
    return padded.map((count, i) => {
      const offsetFromToday = CELL_COUNT - 1 - i;
      const date = new Date(today.getTime() - offsetFromToday * MS_PER_DAY);
      const label =
        count === 0
          ? `${formatDate(date)} · sem treino`
          : count === 1
            ? `${formatDate(date)} · 1 treino`
            : `${formatDate(date)} · ${count} treinos`;
      return { count, date, label, isToday: offsetFromToday === 0 };
    });
  }, [counts, today]);

  const total = counts.reduce((acc, n) => acc + (n > 0 ? 1 : 0), 0);

  return (
    <div className="flex flex-col gap-2">
      <div
        role="img"
        aria-label={`Atividade dos últimos 90 dias: ${total} dias com treino`}
        className="grid gap-[3px]"
        style={{
          gridTemplateColumns: `repeat(${COLUMNS}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
          gridAutoFlow: "column",
        }}
      >
        {cells.map((cell, i) => (
          <button
            type="button"
            key={i}
            onMouseEnter={() => setHover({ idx: i, label: cell.label })}
            onMouseLeave={() => setHover((h) => (h?.idx === i ? null : h))}
            onFocus={() => setHover({ idx: i, label: cell.label })}
            onBlur={() => setHover((h) => (h?.idx === i ? null : h))}
            aria-label={cell.label}
            className={[
              "aspect-square w-full rounded-[3px] border transition-transform",
              colorFor(cell.count),
              cell.isToday ? "ring-1 ring-[var(--brand-primary)]/80 ring-offset-1 ring-offset-background" : "",
              "hover:scale-110 focus:scale-110 focus:outline-none",
            ].join(" ")}
          />
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 text-[10px] text-muted-foreground">
        <span aria-live="polite" className="min-h-[14px] truncate">
          {hover?.label ?? `${total} dias treinando nos últimos 90`}
        </span>
        <Legend />
      </div>
    </div>
  );
}

function Legend() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] uppercase tracking-[0.2em]">menos</span>
      <span className="size-2.5 rounded-[2px] border border-border/60 bg-card/40" />
      <span className="size-2.5 rounded-[2px] border border-[var(--brand-primary)]/40 bg-[var(--brand-primary)]/30" />
      <span className="size-2.5 rounded-[2px] border border-[var(--brand-primary)] bg-[var(--brand-primary)]" />
      <span className="text-[10px] uppercase tracking-[0.2em]">mais</span>
    </div>
  );
}

/**
 * Pure helper. Used by server pages to compute the 91-cell array from a list
 * of completed_at ISO strings.
 */
export function buildLast90DaysCounts(
  completedAt: string[],
  now: Date = new Date(),
): { counts: number[]; todayIso: string } {
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayMs = todayStart.getTime();

  const counts = Array.from({ length: CELL_COUNT }, () => 0);
  for (const iso of completedAt) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) continue;
    d.setHours(0, 0, 0, 0);
    const diff = Math.round((todayMs - d.getTime()) / MS_PER_DAY);
    if (diff < 0 || diff >= CELL_COUNT) continue;
    const idx = CELL_COUNT - 1 - diff;
    counts[idx] += 1;
  }

  return { counts, todayIso: todayStart.toISOString() };
}
