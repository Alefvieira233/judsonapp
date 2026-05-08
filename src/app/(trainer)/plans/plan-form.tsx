"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
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
  const tc = useTranslations("common");
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? tc("saving") : label}
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
  const t = useTranslations("trainerPlans");
  const action = planId
    ? updatePlanAction.bind(null, planId)
    : createPlanAction;
  const [state, formAction] = useActionState<PlanFormState, FormData>(
    action,
    undefined,
  );

  useEffect(() => {
    if (state?.ok) toast.success(t("form_saved"));
    if (state?.error) toast.error(state.error);
  }, [state, t]);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="name" label={t("form_name")} required defaultValue={initial?.name ?? ""} />
        <Field
          id="price_label"
          label={t("form_price")}
          defaultValue={initial?.price_label ?? ""}
          placeholder={t("form_price_placeholder")}
        />
      </div>

      <Field
        id="tagline"
        label={t("form_tagline")}
        defaultValue={initial?.tagline ?? ""}
        placeholder={t("form_tagline_placeholder")}
      />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">{t("form_description")}</Label>
        <Textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={initial?.description ?? ""}
          placeholder={t("form_description_placeholder")}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="features">{t("form_features")}</Label>
        <Textarea
          id="features"
          name="features"
          rows={6}
          defaultValue={initial?.features?.join("\n") ?? ""}
          placeholder={t("form_features_placeholder")}
        />
        <p className="text-xs text-muted-foreground">{t("form_features_help")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id="cta_label"
          label={t("form_cta_label")}
          defaultValue={initial?.cta_label ?? ""}
          placeholder={t("form_cta_placeholder")}
        />
        <Field
          id="display_order"
          label={t("form_order")}
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
          {t("form_active")}
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="highlight"
            defaultChecked={initial?.highlight ?? false}
            className="size-4 accent-[var(--brand-primary)]"
          />
          {t("form_highlight")}
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
        <SubmitButton label={planId ? t("form_save") : t("form_create")} />
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
