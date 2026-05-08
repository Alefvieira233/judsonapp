import * as React from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  back?: { href: string; label: string };
  trailing?: React.ReactNode;
  className?: string;
};

/**
 * Standard page header used across student and trainer routes.
 * Eyebrow uses the lighter 0.3em tracking — only hero blocks should use the
 * 0.4em variant (left as inline class for those special cases).
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  back,
  trailing,
  className,
}: PageHeaderProps) {
  return (
    <header
      data-slot="page-header"
      className={cn("flex flex-col gap-2", className)}
    >
      {back ? (
        <Link
          href={back.href}
          className="inline-flex w-fit items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="size-3.5" aria-hidden /> {back.label}
        </Link>
      ) : null}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          {eyebrow ? (
            <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              {eyebrow}
            </span>
          ) : null}
          <h1 className="font-display text-3xl leading-tight md:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {trailing ? <div className="shrink-0">{trailing}</div> : null}
      </div>
    </header>
  );
}
