"use client";

import { useTransition } from "react";
import { CheckCircle2Icon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { markAnamneseReviewedAction } from "./actions";

export function ReviewButton({ studentId }: { studentId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      size="lg"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const res = await markAnamneseReviewedAction({ student_id: studentId });
          if (!res.ok) toast.error(res.error ?? "Não consegui marcar.");
          else toast.success("Anamnese revisada");
        })
      }
    >
      <CheckCircle2Icon className="size-4" />
      {pending ? "Marcando…" : "Marcar como revisada"}
    </Button>
  );
}
