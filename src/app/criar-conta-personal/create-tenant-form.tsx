"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  checkSlugAvailability,
  createTenantAction,
  type CreateTenantState,
} from "./actions";

function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 30);
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  const t = useTranslations("signup");
  return (
    <Button
      type="submit"
      size="xl"
      className="w-full"
      disabled={pending || disabled}
    >
      {pending ? t("submitting") : t("submit")}
    </Button>
  );
}

type SlugCheckResult = { slug: string; ok: boolean; reason?: string };

export function CreateTenantForm() {
  const t = useTranslations("signup");
  const [name, setName] = useState("");
  const [slugManual, setSlugManual] = useState<string | null>(null);
  const [color, setColor] = useState("#DC2626");
  const [check, setCheck] = useState<SlugCheckResult | null>(null);

  const [state, formAction] = useActionState<CreateTenantState, FormData>(
    createTenantAction,
    undefined,
  );

  // Slug derived in render — no set-state-in-effect.
  const slug = slugManual ?? slugify(name);

  // Debounced availability check: the only setState happens *async* inside
  // setTimeout, satisfying React 19's set-state-in-effect lint.
  const lastQueriedRef = useRef<string>("");
  useEffect(() => {
    if (!slug) return;
    if (lastQueriedRef.current === slug) return;
    let cancelled = false;
    const handle = setTimeout(async () => {
      lastQueriedRef.current = slug;
      const res = await checkSlugAvailability(slug);
      if (cancelled) return;
      setCheck({ slug, ok: res.ok, reason: res.reason });
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [slug]);

  // Derive UI status synchronously from name+slug+check.
  const status: SlugStatus = !slug
    ? { state: "idle" }
    : check && check.slug === slug
      ? check.ok
        ? { state: "ok" }
        : { state: "bad", reason: check.reason ?? t("slug_invalid") }
      : { state: "checking" };

  const previewStyle = useMemo<React.CSSProperties>(
    () => ({ ["--brand-primary" as string]: color }),
    [color],
  );

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card/40 p-5 md:p-6">
      <Preview name={name || t("preview_default")} color={color} style={previewStyle} />

      <form action={formAction} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">{t("f_name")}</Label>
          <Input
            id="name"
            name="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("f_name_placeholder")}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="slug">{t("f_slug")}</Label>
          <div className="flex items-center gap-2 rounded-lg border border-input bg-input/30 px-2.5">
            <span className="text-xs text-muted-foreground">
              app.judsonapp.com.br/
            </span>
            <Input
              id="slug"
              name="slug"
              required
              value={slug}
              onChange={(e) => setSlugManual(slugify(e.target.value))}
              className="border-0 bg-transparent px-0"
              placeholder={t("f_slug_placeholder")}
            />
          </div>
          <SlugHint status={status} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">{t("f_email")}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder={t("f_email_placeholder")}
            autoComplete="email"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">{t("f_phone")}</Label>
          <Input
            id="phone"
            name="phone"
            required
            placeholder={t("f_phone_placeholder")}
            inputMode="tel"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="brand_color">{t("f_color")}</Label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              id="brand_color"
              name="brand_color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-11 w-14 cursor-pointer rounded-lg border border-input bg-transparent"
              aria-label={t("f_color_aria")}
            />
            <Input
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="flex-1"
              placeholder="#DC2626"
            />
          </div>
        </div>

        {state?.error ? (
          <p
            className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            role="alert"
          >
            {state.error}
          </p>
        ) : null}

        <SubmitButton disabled={status.state === "bad"} />

        <p className="text-xs text-muted-foreground">{t("terms")}</p>
      </form>
    </div>
  );
}

type SlugStatus =
  | { state: "idle" }
  | { state: "checking" }
  | { state: "ok" }
  | { state: "bad"; reason: string };

function SlugHint({ status }: { status: SlugStatus }) {
  const t = useTranslations("signup");
  if (status.state === "idle") return null;
  if (status.state === "checking")
    return <p className="text-xs text-muted-foreground">{t("slug_checking")}</p>;
  if (status.state === "ok")
    return <p className="text-xs text-emerald-500">{t("slug_available")}</p>;
  return <p className="text-xs text-destructive">{status.reason}</p>;
}

function Preview({
  name,
  color,
  style,
}: {
  name: string;
  color: string;
  style: React.CSSProperties;
}) {
  const t = useTranslations("signup");
  return (
    <div
      className="overflow-hidden rounded-xl border border-border bg-background"
      style={style}
    >
      <div
        className="px-4 py-5 text-background"
        style={{ background: color }}
      >
        <span className="block text-[10px] uppercase tracking-[0.4em] opacity-80">
          {t("preview_label")}
        </span>
        <span className="mt-1 block font-display text-3xl leading-none">
          {name}
        </span>
      </div>
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <span className="text-xs text-muted-foreground">app.judsonapp.com.br</span>
        <span
          className="rounded-md px-3 py-1 text-xs font-medium text-background"
          style={{ background: color }}
        >
          {t("preview_enter")}
        </span>
      </div>
    </div>
  );
}
