"use client";

import Image from "next/image";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

const POSE_LABEL: Record<string, string> = {
  front: "Frente",
  side: "Lado",
  back: "Costas",
  other: "Outra",
};

export type LightboxPhoto = {
  id: string;
  url: string;
  taken_at: string;
  pose: string | null;
  weight_kg: number | null;
  notes: string | null;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function PhotoLightbox({
  photo,
  children,
}: {
  photo: LightboxPhoto;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const poseLabel = photo.pose ? POSE_LABEL[photo.pose] ?? photo.pose : null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block w-full text-left"
        aria-label="Abrir foto em tela cheia"
      >
        {children}
      </button>

      <DialogContent className="max-h-[92vh] w-full max-w-[min(92vw,28rem)] overflow-hidden p-0 sm:max-w-md">
        <DialogTitle className="sr-only">
          Foto de {formatDate(photo.taken_at)}
        </DialogTitle>
        <div className="relative aspect-[3/4] w-full bg-black">
          <Image
            src={photo.url}
            alt={`Foto ${poseLabel ?? "de progresso"}`}
            fill
            className="object-contain"
            unoptimized
            sizes="(max-width: 480px) 92vw, 28rem"
          />
        </div>
        <div className="flex flex-col gap-1 p-4">
          <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            {formatDate(photo.taken_at)}
          </span>
          <div className="flex flex-wrap items-baseline gap-2">
            {poseLabel ? (
              <span className="font-display text-lg leading-tight text-foreground">
                {poseLabel}
              </span>
            ) : null}
            {photo.weight_kg ? (
              <span className="text-sm text-muted-foreground">
                {photo.weight_kg}kg
              </span>
            ) : null}
          </div>
          {photo.notes ? (
            <p className="whitespace-pre-wrap text-xs text-muted-foreground">
              {photo.notes}
            </p>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
