"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { PenLineIcon } from "lucide-react";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { createPostAction, type PostState } from "./actions";

function PublishButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? "Publicando…" : "Publicar"}
    </Button>
  );
}

export function CreatePostSheet() {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState<PostState, FormData>(
    createPostAction,
    undefined,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) {
      toast.success("Post publicado");
      formRef.current?.reset();
      // The sheet closes as a direct consequence of the action result reaching
      // the client — there's no upstream callback to hook into when using
      // useActionState, so the effect is the correct place for this side
      // effect despite the lint heuristic.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(false);
    }
    if (state?.error) toast.error(state.error);
  }, [state]);

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
        <PenLineIcon className="size-4" aria-hidden /> Novo post
      </SheetTrigger>

      <SheetContent
        side="bottom"
        className="max-h-[92dvh] overflow-y-auto rounded-t-2xl border-border bg-card pb-[calc(env(safe-area-inset-bottom)+1.5rem)] sm:max-w-lg sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:rounded-2xl"
      >
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">Novo post</SheetTitle>
          <SheetDescription>
            Aparece no feed das alunas em ordem de publicação.
          </SheetDescription>
        </SheetHeader>

        <form
          ref={formRef}
          action={formAction}
          className="flex flex-col gap-4 px-4 pb-4"
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="content">Mensagem</Label>
            <Textarea
              id="content"
              name="content"
              required
              rows={5}
              placeholder="Bom dia, equipe! Hoje treina pesado…"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="media_url">Link de mídia (opcional)</Label>
            <Input
              id="media_url"
              name="media_url"
              type="url"
              placeholder="https://www.instagram.com/p/..."
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="pinned"
              className="size-4 accent-[var(--brand-primary)]"
            />
            Fixar no topo
          </label>

          <PublishButton />
        </form>
      </SheetContent>
    </Sheet>
  );
}
