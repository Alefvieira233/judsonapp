"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

export function CopyButton({
  value,
  label,
  className,
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Copiado");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Não consegui copiar.");
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={label ?? "Copiar"}
      className={cn(
        "inline-flex items-center justify-center gap-1 rounded-md border border-border bg-card/40 px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-card hover:text-foreground",
        className,
      )}
    >
      {copied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
      {label ?? "Copiar"}
    </button>
  );
}
