"use client";

import Image from "next/image";
import { useActionState, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { ImagePlusIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  uploadProgressPhotoAction,
  type UploadProgressPhotoState,
} from "./actions";

type Pose = "front" | "side" | "back" | "other";

function SubmitButton({ hasFile }: { hasFile: boolean }) {
  const { pending } = useFormStatus();
  const t = useTranslations("photos");
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending || !hasFile}>
      <UploadCloudIcon className="size-4" />
      {pending ? t("sending") : t("send")}
    </Button>
  );
}

export function UploadForm() {
  const t = useTranslations("photos");
  const POSES: ReadonlyArray<{ value: Pose; label: string }> = [
    { value: "front", label: t("pose_front") },
    { value: "side", label: t("pose_side") },
    { value: "back", label: t("pose_back") },
    { value: "other", label: t("pose_other") },
  ];

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pose, setPose] = useState<Pose>("front");
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const lastHandledStateRef = useRef<UploadProgressPhotoState>(undefined);

  const [state, formAction] = useActionState<UploadProgressPhotoState, FormData>(
    async (prev, fd) => {
      const next = await uploadProgressPhotoAction(prev, fd);
      // React to result here — same render cycle as the action result, no
      // setState-in-effect antipattern.
      if (next?.ok && lastHandledStateRef.current !== next) {
        toast.success(t("sent_toast"));
        setFile(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        formRef.current?.reset();
        // Keep the chosen pose so a session of "Frente/Lado/Costas" feels fast.
      } else if (next?.ok === false && lastHandledStateRef.current !== next) {
        toast.error(next.error);
      }
      lastHandledStateRef.current = next;
      return next;
    },
    undefined,
  );
  void state;

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const clearFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-col gap-4 rounded-2xl border border-border bg-card/30 p-4"
    >
      <div className="flex flex-col gap-2">
        <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          {t("new_photo")}
        </span>

        {previewUrl ? (
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-black">
            <Image
              src={previewUrl}
              alt={t("preview_alt")}
              fill
              className="object-contain"
              unoptimized
              sizes="(max-width: 640px) 100vw, 28rem"
            />
            <button
              type="button"
              onClick={clearFile}
              className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-black/70 text-white hover:bg-black/85"
              aria-label={t("remove_photo")}
            >
              <XIcon className="size-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-background/40 p-6 text-center text-muted-foreground transition-colors hover:bg-card/40"
          >
            <ImagePlusIcon className="size-6" />
            <span className="font-display text-base text-foreground">
              {t("pick_image")}
            </span>
            <span className="text-[11px]">{t("size_hint")}</span>
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          name="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={onPick}
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          {t("pose")}
        </span>
        <div className="flex flex-wrap gap-2">
          {POSES.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPose(p.value)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                pose === p.value
                  ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]/10 text-foreground"
                  : "border-border bg-background/40 text-muted-foreground hover:bg-card/40"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <input type="hidden" name="pose" value={pose} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="weight_kg">{t("weight_optional")}</Label>
          <Input
            id="weight_kg"
            name="weight_kg"
            type="number"
            inputMode="decimal"
            step="0.1"
            min="20"
            max="400"
            placeholder={t("weight_placeholder")}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="notes">{t("notes_optional")}</Label>
        <Textarea
          id="notes"
          name="notes"
          rows={2}
          placeholder={t("notes_placeholder")}
          maxLength={500}
        />
      </div>

      <SubmitButton hasFile={!!file} />
    </form>
  );
}
