"use client";

import { useState } from "react";
import { Share2Icon } from "lucide-react";

import { ShareStoryDialog } from "@/components/share-story-dialog";

export function ShareMonthButton({
  profileId,
  studentName,
  tenantName,
}: {
  profileId: string;
  studentName: string;
  tenantName: string;
}) {
  const [open, setOpen] = useState(false);
  const imageUrl = `/api/og/story/monthly?profileId=${profileId}`;
  const firstName = studentName.split(" ")[0] ?? studentName;
  const text = `Resumo do mês ${firstName} 🔥 — treinando com ${tenantName}`;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card/30 p-4 text-left text-sm transition-colors hover:bg-card/60"
      >
        <div className="flex flex-col gap-0.5">
          <span className="font-display text-lg">Compartilhar o mês</span>
          <span className="text-xs text-muted-foreground">
            Gera um card pro story do Insta com tua streak e força.
          </span>
        </div>
        <Share2Icon className="size-5 shrink-0 text-muted-foreground" aria-hidden />
      </button>
      <ShareStoryDialog
        open={open}
        onOpenChange={setOpen}
        imageUrl={imageUrl}
        title="Resumo do mês"
        text={text}
        filename={`mes-${profileId}.png`}
      />
    </>
  );
}
