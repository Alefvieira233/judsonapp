"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  createPlanAction,
  updatePlanAction,
  type PlanFormState,
} from "./actions";

type PlanInput = {
  name: string;
  tagline: string;
  description: string;
  price_label: string;
  features: string[];
  cta_label: string;
  highlight: boolean;
  display_order: number;
  active: boolean;
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? "Salvando…" : label}
    </Button>
  );
}

export function PlanForm({
  initial,
  planId,
}: {
  initial?: Partial<PlanInput>;
  planId?: string;
}) {
  const action = planId
    ? updatePlanAction.bind(null, planId)
    : createPlanAction;
  const [state, formAction] = useActionState<PlanFormState, FormData>(
    action,
    undefined,
  );

  useEffect(() => {
    if (state?.ok) toast.success("Plano salvo");
    if (state?.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="name" label="Nome" required defaultValue={initial?.name ?? ""} />
        <Field
          id="price_label"
          label="Preço (texto livre)"
          defaultValue={initial?.price_label ?? ""}
          placeholder="R$ 299/mês"
        />
      </div>

      <Field
        id="tagline"
        label="Tagline (subtítulo)"
        defaultValue={initial?.tagline ?? ""}
        placeholder="Acompanhamento próximo, resultados consistentes"
      />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={initial?.description ?? ""}
          placeholder="Curto pitch do que esse plano entrega."
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="features">Features (uma por linha)</Label>
        <Textarea
          id="features"
          name="features"
          rows={6}
          defaultValue={initial?.features?.join("\n") ?? ""}
          placeholder={"Treino mensal personalizado\nWhatsApp ilimitado\nFoto de progresso"}
        />
        <p className="text-xs text-muted-foreground">
          Cada linha vira um bullet na vitrine pra aluna.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id="cta_label"
          label="Texto do botão"
          defaultValue={initial?.cta_label ?? ""}
          placeholder="Quero esse plano"
        />
        <Field
          id="display_order"
          label="Ordem de exibição"
          type="number"
          defaultValue={initial?.display_order?.toString() ?? "0"}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="active"
            defaultChecked={initial?.active ?? true}
            className="size-4 accent-[var(--brand-primary)]"
          />
          Plano ativo (aluna vê em /planos)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="highlight"
            defaultChecked={initial?.highlight ?? false}
            className="size-4 accent-[var(--brand-primary)]"
          />
          Destacar como &quot;mais popular&quot;
        </label>
      </div>

      {state?.error ? (
        <p
          role="alert"
          className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {state.error}
        </p>
      ) : null}

      <div className="flex justify-end pt-2">
        <SubmitButton label={planId ? "Salvar mudanças" : "Criar plano"} />
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  defaultValue,
  placeholder,
  required,
  type,
}: {
  id: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={id}
        type={type ?? "text"}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}
