"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { CheckCircle2Icon, UserPlus2Icon } from "lucide-react";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  createStudentDirectAction,
  type CreateStudentState,
} from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? "Cadastrando…" : "Cadastrar aluna"}
    </Button>
  );
}

export function CreateStudentButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState<CreateStudentState, FormData>(
    createStudentDirectAction,
    undefined,
  );

  useEffect(() => {
    if (state?.ok) {
      toast.success(
        state.magic_link_sent
          ? "Aluna cadastrada — magic link enviado pro email dela."
          : "Aluna cadastrada. (Não consegui enviar o link automático — peça pra ela abrir /aluna/entrar.)",
      );
      formRef.current?.reset();
      router.refresh();
    }
  }, [state, router]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button
            type="button"
            className={buttonVariants({
              size: "lg",
              variant: "outline",
              className: "w-full md:w-auto",
            })}
          />
        }
      >
        <UserPlus2Icon className="size-4" aria-hidden /> Cadastrar
      </DialogTrigger>

      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {state?.ok ? "Aluna cadastrada" : "Cadastrar aluna"}
          </DialogTitle>
          <DialogDescription>
            {state?.ok
              ? "Pronto! Mande o link de entrada que ela recebe por email ou peça pra ela abrir /aluna/entrar."
              : "Crie a conta da aluna direto. Ela recebe um magic link no email pra entrar — sem senha."}
          </DialogDescription>
        </DialogHeader>

        {state?.ok ? (
          <SuccessView
            onClose={() => {
              setOpen(false);
            }}
          />
        ) : (
          <form
            ref={formRef}
            action={formAction}
            className="flex flex-col gap-4 pt-2"
          >
            <Field id="full_name" label="Nome completo" required autoComplete="name" />
            <Field
              id="email"
              label="Email"
              type="email"
              required
              autoComplete="email"
              placeholder="aluna@exemplo.com"
            />
            <Field
              id="phone"
              label="Telefone (opcional)"
              type="tel"
              autoComplete="tel"
              placeholder="(96) 9 9999-9999"
            />
            <Field
              id="goal"
              label="Objetivo (opcional)"
              placeholder="Hipertrofia · Voltar a correr"
            />

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="observations">Observações (opcional)</Label>
              <Textarea
                id="observations"
                name="observations"
                rows={3}
                placeholder="Lesões, restrições, preferências…"
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
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function SuccessView({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 pt-2 text-center">
      <CheckCircle2Icon className="size-12 text-[var(--brand-primary)]" />
      <p className="text-sm text-muted-foreground">
        Já adicionamos ela na sua lista. Pode editar plano, objetivo e
        observações na tela dela.
      </p>
      <Button size="lg" className="w-full" onClick={onClose}>
        Fechar
      </Button>
    </div>
  );
}

function Field({
  id,
  label,
  type,
  required,
  placeholder,
  autoComplete,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={id}
        type={type ?? "text"}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
    </div>
  );
}
