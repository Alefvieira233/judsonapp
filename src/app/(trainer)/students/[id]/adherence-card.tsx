import { TrendingUpIcon } from "lucide-react";

import { Surface } from "@/components/ui/surface";

/**
 * 4-week adherence chart for a single student. Each bar is one ISO week
 * (Mon-Sun) for the last 4 weeks, showing #completed vs #planned days.
 *
 * "Planned" comes from the union of `scheduled_days` across the student's
 * active workouts — same definition the push-cron uses for "tem treino hoje".
 * "Completed" is at most 1 per day (de-duped) to match planned cadence.
 */
export function AdherenceCard({
  weeks,
}: {
  weeks: Array<{ planned: number; completed: number; label: string }>;
}) {
  const totalPlanned = weeks.reduce((a, w) => a + w.planned, 0);
  const totalDone = weeks.reduce((a, w) => a + w.completed, 0);
  const pct =
    totalPlanned === 0
      ? null
      : Math.round((Math.min(totalDone, totalPlanned) / totalPlanned) * 100);

  return (
    <Surface className="flex flex-col gap-3 p-4">
      <header className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-display text-lg leading-none">
          <TrendingUpIcon className="size-4 text-[var(--brand-primary)]" />
          Aderência
        </h2>
        <span className="font-display text-2xl tabular-nums text-foreground">
          {pct === null ? "—" : `${pct}%`}
        </span>
      </header>
      <div className="flex items-end justify-between gap-2 px-1">
        {weeks.map((w, i) => {
          const ratio =
            w.planned === 0
              ? 0
              : Math.min(1, w.completed / w.planned);
          const filled = Math.round(ratio * 60);
          return (
            <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
              <span className="text-[10px] tabular-nums text-foreground">
                {w.completed}/{w.planned}
              </span>
              <div className="relative h-[60px] w-full overflow-hidden rounded-md bg-card">
                <div
                  className="absolute inset-x-0 bottom-0 bg-[var(--brand-primary)] transition-all"
                  style={{ height: `${filled}px` }}
                />
              </div>
              <span className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                {w.label}
              </span>
            </div>
          );
        })}
      </div>
      <p className="text-[11px] text-muted-foreground">
        Treinos concluídos por semana vs dias programados.
      </p>
    </Surface>
  );
}
