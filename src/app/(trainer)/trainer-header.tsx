import { cn } from "@/lib/utils";

export function TrainerHeader({
  tenantName,
  userInitial,
  className,
}: {
  tenantName: string;
  userInitial: string;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex min-h-14 items-center justify-between gap-3 border-b border-border bg-background/90 px-4 pt-[env(safe-area-inset-top)] backdrop-blur supports-[backdrop-filter]:bg-background/70",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-md bg-[var(--brand-primary)] font-display text-sm text-white">
          {Array.from(tenantName)[0]?.toUpperCase()}
        </span>
        <span className="truncate font-display text-lg leading-none">
          {tenantName}
        </span>
      </div>
      <span
        className="grid size-8 shrink-0 place-items-center rounded-full border border-border bg-card font-display text-xs text-foreground"
        aria-label="Sua conta"
      >
        {userInitial.toUpperCase()}
      </span>
    </header>
  );
}
