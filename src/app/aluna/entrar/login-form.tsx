"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2Icon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  requestStudentMagicLinkAction,
  type StudentLoginState,
} from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("auth");
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? t("student_submitting") : t("student_submit")}
    </Button>
  );
}

export function StudentLoginForm() {
  const t = useTranslations("auth");
  const [state, formAction] = useActionState<StudentLoginState, FormData>(
    requestStudentMagicLinkAction,
    undefined,
  );

  if (state?.ok) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card/40 p-6 text-center">
        <CheckCircle2Icon className="size-10 text-[var(--brand-primary)]" />
        <h2 className="font-display text-2xl">{t("student_check_email_title")}</h2>
        <p className="text-sm text-muted-foreground">
          {t("student_check_email_body_prefix")}{" "}
          <span className="text-foreground">{state.email}</span>
          {t("student_check_email_body_suffix")}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">{t("student_email_label")}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder={t("student_email_placeholder")}
        />
      </div>

      {state?.ok === false ? (
        <p
          role="alert"
          className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {state.error}
        </p>
      ) : null}

      <SubmitButton />

      <p className="text-center text-xs text-muted-foreground">
        {t("student_helper")}
      </p>
    </form>
  );
}
