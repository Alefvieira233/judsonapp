"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import { ImageIcon, Loader2Icon, UploadIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import type { Tenant } from "@/types/database";

import { updateTenantAction, type TenantState } from "./actions";

function SaveButton() {
  const { pending } = useFormStatus();
  const tc = useTranslations("common");
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? tc("saving") : tc("save")}
    </Button>
  );
}

export function SettingsForm({ tenant }: { tenant: Tenant }) {
  const t = useTranslations("settings");
  const [logoUrl, setLogoUrl] = useState(tenant.logo_url ?? "");
  const [bannerUrl, setBannerUrl] = useState(tenant.banner_url ?? "");

  const [state, formAction] = useActionState<TenantState, FormData>(
    updateTenantAction,
    undefined,
  );

  useEffect(() => {
    if (state?.ok) toast.success(t("saved_toast"));
    if (state?.error) toast.error(state.error);
  }, [state, t]);

  return (
    <form action={formAction} className="flex flex-col gap-8">
      {/* Hidden URLs synced from upload widgets */}
      <input type="hidden" name="logo_url" value={logoUrl} />
      <input type="hidden" name="banner_url" value={bannerUrl} />

      <Section title={t("section_brand")}>
        <ImageUpload
          tenantId={tenant.id}
          kind="logo"
          label={t("logo_label")}
          hint={t("logo_hint")}
          currentUrl={logoUrl}
          onUploaded={setLogoUrl}
        />
        <ImageUpload
          tenantId={tenant.id}
          kind="banner"
          label={t("banner_label")}
          hint={t("banner_hint")}
          currentUrl={bannerUrl}
          onUploaded={setBannerUrl}
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            id="brand_color"
            label={t("color_primary")}
            defaultValue={tenant.brand_color ?? ""}
            placeholder="#DC2626"
          />
          <Field
            id="brand_color_dark"
            label={t("color_hover")}
            defaultValue={tenant.brand_color_dark ?? ""}
            placeholder="#991B1B"
          />
        </div>
      </Section>

      <Section title={t("section_identity")}>
        <Field id="name" label={t("f_name")} required defaultValue={tenant.name} />
        <Field
          id="tagline"
          label={t("f_tagline")}
          defaultValue={tenant.tagline ?? ""}
          placeholder={t("f_tagline_placeholder")}
        />
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="bio">{t("f_bio")}</Label>
          <Textarea id="bio" name="bio" rows={4} defaultValue={tenant.bio ?? ""} />
        </div>
      </Section>

      <Section title={t("section_contact")}>
        <Field
          id="whatsapp_number"
          label={t("f_whatsapp")}
          required
          defaultValue={tenant.whatsapp_number}
          placeholder={t("f_whatsapp_placeholder")}
        />
        <Field
          id="instagram_handle"
          label={t("f_instagram")}
          defaultValue={tenant.instagram_handle ?? ""}
          placeholder={t("f_instagram_placeholder")}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field id="cref" label={t("f_cref")} defaultValue={tenant.cref ?? ""} />
          <Field id="city" label={t("f_city")} defaultValue={tenant.city ?? ""} />
        </div>
      </Section>

      <Section title={t("section_consult")}>
        <Field
          id="consultation_price"
          label={t("f_consult_price")}
          defaultValue={tenant.consultation_price ?? ""}
          placeholder={t("f_consult_price_placeholder")}
        />
        <Field
          id="consultation_pitch"
          label={t("f_consult_pitch")}
          defaultValue={tenant.consultation_pitch ?? ""}
          placeholder={t("f_consult_pitch_placeholder")}
        />
      </Section>

      <div className="sticky bottom-[calc(72px+env(safe-area-inset-bottom))] z-20 flex justify-end rounded-xl border border-border bg-background/90 p-3 backdrop-blur md:bottom-4">
        <SaveButton />
      </div>
    </form>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 rounded-xl border border-border bg-card/40 p-4 md:p-6">
      <h2 className="font-display text-2xl">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  id,
  label,
  defaultValue,
  placeholder,
  required,
}: {
  id: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={id}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

function ImageUpload({
  tenantId,
  kind,
  label,
  hint,
  currentUrl,
  onUploaded,
}: {
  tenantId: string;
  kind: "logo" | "banner";
  label: string;
  hint: string;
  currentUrl: string;
  onUploaded: (url: string) => void;
}) {
  const t = useTranslations("settings");
  const [pending, setPending] = useState(false);

  const onSelect = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("upload_too_big"));
      return;
    }
    setPending(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() ?? "png";
      const path = `${tenantId}/${kind}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from("tenant-assets")
        .upload(path, file, { upsert: true, contentType: file.type });
      if (error) throw error;
      const { data } = supabase.storage.from("tenant-assets").getPublicUrl(path);
      onUploaded(data.publicUrl);
      toast.success(t("upload_updated", { label }));
    } catch (e) {
      console.error(e);
      toast.error(t("upload_failed"));
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-3">
        <div
          className={`grid place-items-center overflow-hidden rounded-lg border border-border bg-card ${
            kind === "logo" ? "size-16" : "h-16 w-32"
          }`}
        >
          {currentUrl ? (
            <Image
              src={currentUrl}
              alt={label}
              width={kind === "logo" ? 64 : 128}
              height={64}
              className="size-full object-cover"
              unoptimized
            />
          ) : (
            <ImageIcon className="size-5 text-muted-foreground" />
          )}
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border bg-card/40 px-3 py-2 text-sm text-foreground transition-colors hover:bg-card">
          {pending ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            <UploadIcon className="size-4" />
          )}
          {pending ? t("upload_uploading") : t("upload_change")}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onSelect(file);
              e.target.value = "";
            }}
          />
        </label>
      </div>
      <p className="text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}
