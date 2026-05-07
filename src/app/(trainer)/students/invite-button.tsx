"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { CheckIcon, CopyIcon, MessageCircleIcon, UserPlusIcon } from "lucide-react";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { createInviteAction, type InviteState } from "./actions";

function SubmitInvite() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? "Gerando link…" : "Gerar link de convite"}
    </Button>
  );
}

export function InviteButton() {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState<InviteState, FormData>(
    createInviteAction,
    undefined,
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <button
            type="button"
            className={buttonVariants({ size: "lg", className: "w-full md:w-auto" })}
          />
        }
      >
        <UserPlusIcon className="size-4" aria-hidden /> Convidar aluna
      </SheetTrigger>

      <SheetContent
        side="bottom"
        className="rounded-t-2xl border-border bg-card pb-[calc(env(safe-area-inset-bottom)+1.5rem)] sm:max-w-md sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:rounded-2xl"
      >
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">
            {state?.ok ? "Link pronto" : "Convidar aluna"}
          </SheetTitle>
          <SheetDescription>
            {state?.ok
              ? "Copia e manda no WhatsApp dela. O link vale por 14 dias."
              : "Os campos abaixo são opcionais — só pra deixar o convite pré-preenchido."}
          </SheetDescription>
        </SheetHeader>

        {state?.ok ? (
          <InviteSuccess url={state.url} onDone={() => setOpen(false)} />
        ) : (
          <form action={formAction} className="flex flex-col gap-4 px-4 pb-4">
            <Field id="full_name" label="Nome (opcional)" type="text" autoComplete="name" />
            <Field id="email" label="Email (opcional)" type="email" autoComplete="email" />
            <Field id="phone" label="Telefone (opcional)" type="tel" autoComplete="tel" />

            {state?.ok === false ? (
              <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {state.error}
              </p>
            ) : null}

            <SubmitInvite />
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Field({
  id,
  label,
  type,
  autoComplete,
}: {
  id: string;
  label: string;
  type: string;
  autoComplete?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} type={type} autoComplete={autoComplete} />
    </div>
  );
}

function InviteSuccess({ url, onDone }: { url: string; onDone: () => void }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copiado");
    } catch {
      toast.error("Não consegui copiar — seleciona o link manualmente.");
    }
  };

  const wpp = `https://wa.me/?text=${encodeURIComponent(
    `Oi! Te convidei pro meu app. Abre esse link pra entrar:\n\n${url}`,
  )}`;

  return (
    <div className="flex flex-col gap-4 px-4 pb-4">
      <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm">
        <span className="flex-1 truncate font-mono text-xs text-muted-foreground">
          {url}
        </span>
        <button
          type="button"
          onClick={onCopy}
          className="grid size-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
          aria-label="Copiar link"
        >
          {copied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
        </button>
      </div>

      <a
        href={wpp}
        target="_blank"
        rel="noreferrer"
        className={buttonVariants({ size: "lg", className: "w-full" })}
        onClick={() => onDone()}
      >
        <MessageCircleIcon className="size-4" aria-hidden /> Mandar via WhatsApp
      </a>

      <Button variant="ghost" size="lg" onClick={onDone}>
        Fechar
      </Button>
    </div>
  );
}
