"use client";

import { useState } from "react";
import { DownloadIcon, MessageCircleIcon, Share2Icon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type ShareStoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  title: string;
  text: string;
  filename?: string;
};

async function fetchAsBlob(url: string): Promise<Blob> {
  const res = await fetch(url, { credentials: "same-origin" });
  if (!res.ok) throw new Error(`status ${res.status}`);
  return res.blob();
}

function downloadBlob(blob: Blob, filename: string) {
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}

export function ShareStoryDialog({
  open,
  onOpenChange,
  imageUrl,
  title,
  text,
  filename = "judson-story.png",
}: ShareStoryDialogProps) {
  const [busy, setBusy] = useState<"download" | "share" | null>(null);
  const [imageReady, setImageReady] = useState(false);

  const handleDownload = async () => {
    setBusy("download");
    try {
      const blob = await fetchAsBlob(imageUrl);
      downloadBlob(blob, filename);
      toast.success("Imagem salva");
    } catch (err) {
      console.error("[share-story.download]", err);
      toast.error("Não consegui baixar a imagem.");
    } finally {
      setBusy(null);
    }
  };

  const handleNativeShare = async () => {
    setBusy("share");
    try {
      const blob = await fetchAsBlob(imageUrl);
      const file = new File([blob], filename, { type: blob.type || "image/png" });
      const navigatorWithShare = navigator as Navigator & {
        canShare?: (data: ShareData) => boolean;
      };
      const data: ShareData = { title, text, files: [file] };
      if (
        typeof navigator.share === "function" &&
        navigatorWithShare.canShare?.(data)
      ) {
        await navigator.share(data);
        toast.success("Compartilhado");
      } else {
        downloadBlob(blob, filename);
        toast.message("Imagem baixada — anexa no Insta manualmente.");
      }
    } catch (err) {
      // AbortError means the user cancelled the share sheet — not an error.
      if ((err as DOMException)?.name !== "AbortError") {
        console.error("[share-story.share]", err);
        toast.error("Não consegui compartilhar.");
      }
    } finally {
      setBusy(null);
    }
  };

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(text)}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartilhar conquista</DialogTitle>
          <DialogDescription>
            Salva no celular e posta no story. O preview abaixo é a arte final.
          </DialogDescription>
        </DialogHeader>

        <div className="relative mx-auto w-full max-w-[240px] overflow-hidden rounded-xl border border-border bg-black">
          <div className="aspect-[9/16] w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={imageUrl}
              src={imageUrl}
              alt={title}
              onLoad={() => setImageReady(true)}
              className={cn(
                "h-full w-full object-cover transition-opacity duration-200",
                imageReady ? "opacity-100" : "opacity-0",
              )}
            />
            {!imageReady ? (
              <div className="absolute inset-0 grid place-items-center text-xs text-muted-foreground">
                Gerando arte…
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Button
            type="button"
            size="lg"
            onClick={handleNativeShare}
            disabled={busy !== null}
            className="w-full gap-2"
          >
            <Share2Icon className="size-4" />
            {busy === "share" ? "Abrindo…" : "Compartilhar"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handleDownload}
            disabled={busy !== null}
            className="w-full gap-2"
          >
            <DownloadIcon className="size-4" />
            {busy === "download" ? "Salvando…" : "Salvar imagem"}
          </Button>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-border bg-card text-sm font-medium transition-colors hover:bg-card/70"
          >
            <MessageCircleIcon className="size-4" /> Enviar pelo WhatsApp
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
