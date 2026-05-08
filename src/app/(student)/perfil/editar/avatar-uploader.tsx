"use client";

import Image from "next/image";
import { useActionState, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { CameraIcon, ImagePlusIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import {
  uploadAvatarAction,
  type UploadAvatarState,
} from "../actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      <CameraIcon className="size-3.5" />
      {pending ? "Enviando…" : "Trocar foto"}
    </Button>
  );
}

export function AvatarUploader({
  initialAvatarUrl,
  initial,
}: {
  initialAvatarUrl: string | null;
  initial: string;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialAvatarUrl);
  const lastHandledStateRef = useRef<UploadAvatarState>(undefined);

  const [state, formAction] = useActionState<UploadAvatarState, FormData>(
    async (prev, fd) => {
      const next = await uploadAvatarAction(prev, fd);
      // React to the action result here — avoids the setState-in-effect
      // antipattern. Same render cycle, so the DOM is consistent.
      if (next?.ok && lastHandledStateRef.current !== next) {
        setPreviewUrl(next.url);
        toast.success("Foto atualizada");
      } else if (next?.ok === false && lastHandledStateRef.current !== next) {
        toast.error(next.error);
      }
      lastHandledStateRef.current = next;
      return next;
    },
    undefined,
  );
  // Keep state used in the JSX even if it's only for typing parity.
  void state;
  const inputRef = useRef<HTMLInputElement>(null);

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Local preview while the upload happens.
    const objUrl = URL.createObjectURL(file);
    setPreviewUrl(objUrl);
    // Auto-submit the wrapping form so the action fires.
    e.target.form?.requestSubmit();
  };

  return (
    <form action={formAction} className="flex items-center gap-4">
      <div className="relative grid size-20 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[var(--brand-primary)] font-display text-3xl text-white">
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt="Foto de perfil"
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <span>{initial}</span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <input
          ref={inputRef}
          type="file"
          name="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={onPick}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlusIcon className="size-3.5" />
          Escolher imagem
        </Button>
        <SubmitButton />
        <span className="text-[10px] text-muted-foreground">
          JPG, PNG ou WebP até 3 MB.
        </span>
      </div>
    </form>
  );
}
