"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ScaleIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { createAssessmentAction } from "./actions";

/**
 * Tiny "weigh-only" sheet for the trainer's weekly check-in. Skips every
 * other field — useful when Judson is at the gym with the scale and the
 * aluna in front of him.
 */
export function QuickWeighButton({ studentId }: { studentId: string }) {
  const [open, setOpen] = useState(false);
  const [weight, setWeight] = useState("");
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const submit = () => {
    const trimmed = weight.trim().replace(",", ".");
    const parsed = Number(trimmed);
    if (!trimmed || !Number.isFinite(parsed) || parsed <= 0 || parsed > 500) {
      toast.error("Peso inválido.");
      return;
    }
    startTransition(async () => {
      const fd = new FormData();
      fd.set("student_id", studentId);
      fd.set("weight_kg", trimmed);
      const res = await createAssessmentAction(undefined, fd);
      if (res?.ok) {
        toast.success("Peso registrado.");
        setOpen(false);
        setWeight("");
        router.refresh();
      } else if (res?.ok === false) {
        toast.error(res.error);
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/40 px-3 py-2 text-sm text-foreground transition-colors hover:bg-card/70"
      >
        <ScaleIcon className="size-4 text-[var(--brand-primary)]" />
        Só pesar agora
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="rounded-t-2xl border-border bg-card pb-[calc(env(safe-area-inset-bottom)+1.5rem)] sm:max-w-sm sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:rounded-2xl"
        >
          <SheetHeader>
            <SheetTitle className="font-display text-2xl">Pesar agora</SheetTitle>
            <SheetDescription>
              Salva uma avaliação só com o peso. Os outros campos ficam vazios.
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-4 px-4 pb-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="qw-weight">Peso (kg)</Label>
              <Input
                id="qw-weight"
                type="text"
                inputMode="decimal"
                autoFocus
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="65.4"
                className="h-12 text-center font-display text-2xl tabular-nums"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button size="lg" onClick={submit} disabled={pending}>
                {pending ? "Salvando…" : "Registrar"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
