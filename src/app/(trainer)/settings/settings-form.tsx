"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import { ImageIcon, Loader2Icon, UploadIcon } from "lucide-react";
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
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? "Salvando…" : "Salvar"}
    </Button>
  );
}

export function SettingsForm({ tenant }: { tenant: Tenant }) {
  const [logoUrl, setLogoUrl] = useState(tenant.logo_url ?? "");
  const [bannerUrl, setBannerUrl] = useState(tenant.banner_url ?? "");

  const [state, formAction] = useActionState<TenantState, FormData>(
    updateTenantAction,
    undefined,
  );

  useEffect(() => {
    if (state?.ok) toast.success("Ajustes salvos");
    if (state?.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="flex flex-col gap-8">
      {/* Hidden URLs synced from upload widgets */}
      <input type="hidden" name="logo_url" value={logoUrl} />
      <input type="hidden" name="banner_url" value={bannerUrl} />

      <Section title="Marca">
        <ImageUpload
          tenantId={tenant.id}
          kind="logo"
          label="Logo"
          hint="Quadrado (1:1), 512px+"
          currentUrl={logoUrl}
          onUploaded={setLogoUrl}
        />
        <ImageUpload
          tenantId={tenant.id}
          kind="banner"
          label="Capa"
          hint="Wide (16:9), 1200px+"
          currentUrl={bannerUrl}
          onUploaded={setBannerUrl}
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <Field id="brand_color" label="Cor primária" defaultValue={tenant.brand_color ?? ""} placeholder="#DC2626" />
          <Field
            id="brand_color_dark"
            label="Cor primária (hover)"
            defaultValue={tenant.brand_color_dark ?? ""}
            placeholder="#991B1B"
          />
        </div>
      </Section>

      <Section title="Identidade">
        <Field id="name" label="Nome" required defaultValue={tenant.name} />
        <Field id="tagline" label="Tagline" defaultValue={tenant.tagline ?? ""} placeholder="Faz o teu que eu faço o meu." />
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" name="bio" rows={4} defaultValue={tenant.bio ?? ""} />
        </div>
      </Section>

      <Section title="Contato">
        <Field
          id="whatsapp_number"
          label="WhatsApp (com DDI/DDD)"
          required
          defaultValue={tenant.whatsapp_number}
          placeholder="+5596999999999"
        />
        <Field
          id="instagram_handle"
          label="Instagram (@)"
          defaultValue={tenant.instagram_handle ?? ""}
          placeholder="judsonlobato"
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field id="cref" label="CREF" defaultValue={tenant.cref ?? ""} />
          <Field id="city" label="Cidade" defaultValue={tenant.city ?? ""} />
        </div>
      </Section>

      <Section title="Consultoria">
        <Field
          id="consultation_price"
          label="Preço (texto livre)"
          defaultValue={tenant.consultation_price ?? ""}
          placeholder="A partir de R$ 300/mês"
        />
        <Field
          id="consultation_pitch"
          label="Pitch curto"
          defaultValue={tenant.consultation_pitch ?? ""}
          placeholder="Treino + WhatsApp + comunidade exclusiva"
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
  const [pending, setPending] = useState(false);

  const onSelect = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Imagem maior que 5MB.");
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
      toast.success(`${label} atualizado`);
    } catch (e) {
      console.error(e);
      toast.error("Falha no upload.");
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
          {pending ? "Enviando…" : "Trocar"}
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
