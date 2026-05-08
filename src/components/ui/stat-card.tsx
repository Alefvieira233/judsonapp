import * as React from "react";
import { ArrowDownRightIcon, ArrowUpRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type StatCardProps = {
  icon?: React.ReactNode;
  label: string;
  value: React.ReactNode;
  hint?: string;
  trend?: { value: string; positive?: boolean };
  accent?: "primary" | "muted";
  className?: string;
};

/**
 * Replaces the duplicated `Stat` / `KpiCard` components in
 * /home, /perfil, /students/[id], /dashboard. Single visual contract:
 *   icon + label tiny uppercase  →  font-display tabular-nums value  →  hint.
 *
 * `accent='primary'` highlights the brand red tone (KPIs needing attention,
 * subscribed plan, etc). `accent='muted'` is the default neutral surface.
 */
export function StatCard({
  icon,
  label,
  value,
  hint,
  trend,
  accent = "muted",
  className,
}: StatCardProps) {
  return (
    <div
      data-slot="stat-card"
      data-accent={accent}
      className={cn(
        "flex flex-col gap-2 rounded-2xl border p-4",
        accent === "primary"
          ? "border-[var(--brand-primary)]/30 bg-gradient-to-br from-[var(--brand-primary)]/15 via-card/40 to-card/40"
          : "border-border bg-card/40",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {icon}
          {label}
        </span>
        {trend ? (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-[10px] font-medium tabular-nums",
              trend.positive
                ? "text-[var(--brand-primary)]"
                : "text-muted-foreground",
            )}
          >
            {trend.positive ? (
              <ArrowUpRightIcon className="size-3" aria-hidden />
            ) : (
              <ArrowDownRightIcon className="size-3" aria-hidden />
            )}
            {trend.value}
          </span>
        ) : null}
      </div>
      <span className="font-display text-2xl leading-none tabular-nums">
        {value}
      </span>
      {hint ? (
        <span className="text-[11px] text-muted-foreground">{hint}</span>
      ) : null}
    </div>
  );
}
