"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { editPostAction } from "./actions";

type Props = {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  post: {
    id: string;
    content: string;
    media_url: string | null;
    media_type: string | null;
  };
};

export function EditPostSheet({ open, onOpenChange, post }: Props) {
  const [content, setContent] = useState(post.content);
  const [mediaUrl, setMediaUrl] = useState(post.media_url ?? "");
  const [pending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await editPostAction({
        id: post.id,
        content: content.trim(),
        media_url: mediaUrl.trim() || null,
        // Keep existing media_type when URL stays; reset when cleared.
        media_type: mediaUrl.trim()
          ? (post.media_type as "image" | "video" | "link" | null) ?? null
          : null,
      });
      if (!res.ok) {
        toast.error(res.error ?? "Não consegui salvar.");
        return;
      }
      toast.success("Post atualizado");
      onOpenChange(false);
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[92dvh] overflow-y-auto rounded-t-2xl border-border bg-card pb-[calc(env(safe-area-inset-bottom)+1.5rem)] sm:max-w-lg sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:rounded-2xl"
      >
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">Editar post</SheetTitle>
          <SheetDescription>
            As alterações aparecem imediatamente no feed das alunas.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-4 px-4 pb-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-content">Mensagem</Label>
            <Textarea
              id="edit-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={5}
              maxLength={2000}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-media">Link de mídia (opcional)</Label>
            <Input
              id="edit-media"
              type="url"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="https://www.instagram.com/p/..."
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={pending || content.trim().length === 0}
          >
            {pending ? "Salvando…" : "Salvar"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
