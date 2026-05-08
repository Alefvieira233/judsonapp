"use client";

import { useState, useTransition } from "react";
import { BellRingIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

import { pushReminderToStudent } from "../../_actions/push";

const SUGGESTIONS = [
  "Tem treino hoje 💪",
  "Bora? Tô esperando teu check-in.",
  "Lembra de mandar a foto de progresso 📸",
];

export function PushReminderButton({
  studentId,
  studentName,
}: {
  studentId: string;
  studentName: string;
}) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(SUGGESTIONS[0] ?? "");
  const [pending, startTransition] = useTransition();

  const submit = () => {
    const trimmed = message.trim();
    if (trimmed.length < 2) {
      toast.error("Mensagem muito curta.");
      return;
    }
    startTransition(async () => {
      const res = await pushReminderToStudent({
        studentId,
        message: trimmed,
      });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      if (res.sent === 0) {
        toast(
          res.gone > 0
            ? "Aluna não tem mais push ativo nesse dispositivo."
            : "Push não chegou — talvez ela ainda não tenha autorizado.",
        );
      } else {
        toast.success(`Push enviado pra ${studentName}.`);
      }
      setOpen(false);
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex flex-1 flex-col items-center gap-1.5 rounded-xl border border-border bg-card/30 p-3 text-xs transition-colors hover:bg-card/60"
      >
        <BellRingIcon className="size-5 text-[var(--brand-primary)]" />
        <span className="font-medium text-foreground">Push</span>
        <span className="text-[10px] text-muted-foreground">Notificação</span>
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[92dvh] overflow-y-auto rounded-t-2xl border-border bg-card pb-[calc(env(safe-area-inset-bottom)+1.5rem)] sm:max-w-md sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:rounded-2xl"
        >
          <SheetHeader>
            <SheetTitle className="font-display text-2xl">
              Mandar push
            </SheetTitle>
            <SheetDescription>
              Cai como notificação no celular de {studentName}. Se ela não
              autorizou push, nada chega.
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-4 px-4 pb-2">
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setMessage(s)}
                  className="rounded-full border border-border bg-background/40 px-3 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="push-msg">Mensagem (até 140)</Label>
              <Textarea
                id="push-msg"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={140}
                placeholder="Tem treino hoje 💪"
              />
              <span className="text-[11px] text-muted-foreground tabular-nums">
                {message.length}/140
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button size="lg" onClick={submit} disabled={pending}>
                {pending ? "Enviando…" : "Enviar push"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
