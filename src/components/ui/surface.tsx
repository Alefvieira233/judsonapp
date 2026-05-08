import * as React from "react";

import { cn } from "@/lib/utils";

type SurfaceProps = React.ComponentProps<"div"> & {
  /**
   * 1 = bg-card/40 + border-border (most pages, secondary blocks)
   * 2 = bg-card/60 + border-border/50 (denser, hover-reveal contexts)
   */
  level?: 1 | 2;
};

/**
 * Lightweight wrapper that replaces the ad-hoc
 * `rounded-2xl border border-border bg-card/40 p-4` pattern repeated across
 * student/trainer pages. Keep variants minimal — the audit found 3 effective
 * tones in real usage (dashed empty + level 1 + level 2).
 */
export function Surface({ level = 1, className, ...props }: SurfaceProps) {
  return (
    <div
      data-slot="surface"
      data-level={level}
      className={cn(
        "rounded-2xl border p-4",
        level === 1 && "border-border bg-card/40",
        level === 2 && "border-border/50 bg-card/60",
        className,
      )}
      {...props}
    />
  );
}
