"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { requestInviteOtpAction, type OtpState } from "./actions";

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="lg"
      className="w-full"
      disabled={pending || disabled}
    >
      {pending ? "Enviando…" : "Receber link no email"}
    </Button>
  );
}

export function InviteForm({
  token,
  initialName,
  initialEmail,
  tenantFirstName,
}: {
  token: string;
  initialName: string;
  initialEmail: string;
  tenantFirstName: string;
}) {
  const [state, formAction] = useActionState<OtpState, FormData>(
    requestInviteOtpAction,
    undefined,
  );
  const [accepted, setAccepted] = useState(false);

  if (state?.ok) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card/40 p-6 text-center">
        <CheckCircle2Icon className="size-10 text-[var(--brand-primary)]" />
        <h2 className="font-display text-2xl">Quase lá</h2>
        <p className="text-sm text-muted-foreground">
          Mandei um link pra <span className="text-foreground">{state.email}</span>.
          Abre o email no celular e clica pra entrar.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="token" value={token} />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="full_name">Seu nome</Label>
        <Input
          id="full_name"
          name="full_name"
          type="text"
          autoComplete="name"
          defaultValue={initialName}
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Seu email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={initialEmail}
          required
          placeholder="voce@exemplo.com"
        />
      </div>

      <label className="flex cursor-pointer items-start gap-2.5 rounded-md border border-border bg-card/30 px-3 py-3 text-xs leading-relaxed text-muted-foreground hover:bg-card/40">
        <input
          type="checkbox"
          name="accept_terms"
          value="1"
          required
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="mt-0.5 size-4 shrink-0 accent-[var(--brand-primary)]"
        />
        <span>
          Li e aceito os{" "}
          <Link href="/termos" target="_blank" className="text-foreground underline-offset-2 hover:underline">
            Termos de Uso
          </Link>{" "}
          e a{" "}
          <Link href="/privacidade" target="_blank" className="text-foreground underline-offset-2 hover:underline">
            Política de Privacidade
          </Link>
          .
        </span>
      </label>

      {state?.ok === false ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      ) : null}

      <SubmitButton disabled={!accepted} />

      <p className="text-center text-xs text-muted-foreground">
        Sem senha. Enviamos um link no email — clica nele pra entrar no app do{" "}
        {tenantFirstName}.
      </p>
    </form>
  );
}
