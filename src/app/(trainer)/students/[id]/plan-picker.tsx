"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Label } from "@/components/ui/label";
import { assignPlanToStudentAction } from "../../plans/actions";

type PlanOption = {
  id: string;
  name: string;
  price_label: string | null;
};

export function PlanPicker({
  studentId,
  currentPlanId,
  plans,
}: {
  studentId: string;
  currentPlanId: string | null;
  plans: PlanOption[];
}) {
  const [pending, startTransition] = useTransition();

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const fd = new FormData();
    fd.set("plan_id", value);
    startTransition(async () => {
      const res = await assignPlanToStudentAction(studentId, fd);
      if (!res.ok) {
        toast.error(res.error ?? "Não consegui salvar.");
      } else {
        toast.success(value ? "Plano atribuído" : "Plano removido");
      }
    });
  };

  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-border bg-card/30 p-4">
      <Label htmlFor="plan_id" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Plano atual
      </Label>
      <select
        id="plan_id"
        value={currentPlanId ?? ""}
        onChange={onChange}
        disabled={pending}
        className="h-10 rounded-lg border border-input bg-background px-3 text-base"
      >
        <option value="">— Sem plano —</option>
        {plans.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
            {p.price_label ? ` · ${p.price_label}` : ""}
          </option>
        ))}
      </select>
      {pending ? (
        <span className="text-[11px] text-muted-foreground">Salvando…</span>
      ) : null}
    </div>
  );
}
