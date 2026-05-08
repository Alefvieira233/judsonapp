"use client";

import { motion } from "framer-motion";

const WEEKDAY_SHORT = ["D", "S", "T", "Q", "Q", "S", "S"];

export type Heatmap7DaysProps = {
  /** 7 booleans, index 0 = today, index 6 = today minus 6 days. */
  days: boolean[];
  /** Day-of-week (0=Sunday..6=Saturday) for index 0 (today). */
  todayDow: number;
};

export function Heatmap7Days({ days, todayDow }: Heatmap7DaysProps) {
  const ordered = [...days].reverse();

  return (
    <div
      role="group"
      aria-label="Atividade dos últimos 7 dias"
      className="flex items-end justify-between gap-2"
    >
      {ordered.map((done, i) => {
        const offset = 6 - i;
        const isToday = offset === 0;
        const dow = (todayDow - offset + 7) % 7;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 * i, duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-1 flex-col items-center gap-1.5"
          >
            <div
              aria-label={
                isToday
                  ? done
                    ? "Hoje, treino concluído"
                    : "Hoje, sem treino"
                  : done
                    ? "Treino concluído"
                    : "Sem treino"
              }
              className={[
                "h-9 w-full rounded-md transition-colors",
                done
                  ? "bg-[var(--brand-primary)]"
                  : "bg-card/40",
                isToday
                  ? "border-2 border-[var(--brand-primary)]/80"
                  : "border border-border/60",
              ].join(" ")}
            />
            <span
              className={[
                "text-[10px] uppercase tracking-[0.2em]",
                isToday ? "text-foreground" : "text-muted-foreground",
              ].join(" ")}
            >
              {WEEKDAY_SHORT[dow]}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
