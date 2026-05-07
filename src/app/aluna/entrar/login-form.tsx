"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  requestStudentMagicLinkAction,
  type StudentLoginState,
} from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? "Enviando…" : "Receber link no email"}
    </Button>
  );
}

export function StudentLoginForm() {
  const [state, formAction] = useActionState<StudentLoginState, FormData>(
    requestStudentMagicLinkAction,
    undefined,
  );

  if (state?.ok) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card/40 p-6 text-center">
        <CheckCircle2Icon className="size-10 text-[var(--brand-primary)]" />
        <h2 className="font-display text-2xl">Confere teu email</h2>
        <p className="text-sm text-muted-foreground">
          Mandei um link pra{" "}
          <span className="text-foreground">{state.email}</span>. Abre no
          celular e clica pra entrar.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Seu email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="voce@exemplo.com"
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
        Sem senha. Você recebe um link no email — clica nele pra entrar no app.
      </p>
    </form>
  );
}
