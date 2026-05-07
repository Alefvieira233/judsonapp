import type { ReactNode } from "react";

export function ComingSoon({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-10 md:px-6 md:py-12">
      <header className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Em breve
        </span>
        <h1 className="font-display text-4xl leading-none md:text-5xl">{title}</h1>
        {description ? (
          <p className="text-sm text-muted-foreground md:text-base">
            {description}
          </p>
        ) : null}
      </header>
      {children}
    </main>
  );
}
