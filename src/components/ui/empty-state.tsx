import * as React from "react";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon?: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "dashed";
  className?: string;
};

/**
 * Single source of truth for "nothing here yet" blocks. Replaces 5+ inline
 * EmptyState components found by the design audit.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  variant = "dashed",
  className,
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center gap-3 rounded-2xl border px-6 py-10 text-center",
        variant === "dashed"
          ? "border-dashed border-border bg-card/30"
          : "border-border bg-card/40",
        className,
      )}
    >
      {icon ? (
        <span
          aria-hidden
          className="grid size-10 place-items-center rounded-full bg-card text-muted-foreground"
        >
          {icon}
        </span>
      ) : null}
      <h2 className="font-display text-2xl leading-tight">{title}</h2>
      {description ? (
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      ) : null}
      {action ? <div className="mt-2 w-full sm:w-auto">{action}</div> : null}
    </div>
  );
}
