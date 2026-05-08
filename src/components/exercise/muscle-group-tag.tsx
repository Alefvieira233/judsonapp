import { cn } from "@/lib/utils";

import { ExerciseIcon } from "./exercise-icon";

type Variant = "default" | "active";

export function MuscleGroupTag({
  muscleGroup,
  equipment,
  variant = "default",
  className,
  showIcon = true,
}: {
  muscleGroup?: string | null;
  equipment?: string | null;
  variant?: Variant;
  className?: string;
  showIcon?: boolean;
}) {
  const label = muscleGroup ?? equipment ?? null;
  if (!label) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium capitalize transition-colors",
        variant === "active"
          ? "border-[var(--brand-primary)]/30 bg-[var(--brand-primary)]/15 text-foreground"
          : "border-border bg-card/60 text-muted-foreground",
        className,
      )}
    >
      {showIcon ? (
        <ExerciseIcon
          muscleGroup={muscleGroup}
          equipment={equipment}
          size={3}
          className={cn(
            variant === "active"
              ? "text-[var(--brand-primary)]"
              : "text-muted-foreground",
          )}
        />
      ) : null}
      <span className="leading-none">{label}</span>
    </span>
  );
}
