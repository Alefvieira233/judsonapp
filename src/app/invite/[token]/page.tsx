import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { brandStyleVars } from "@/lib/tenant";
import type { Tenant } from "@/types/database";

import { InviteForm } from "./invite-form";

export const metadata = { title: "Convite" };

type InviteWithTenant = {
  token: string;
  full_name: string | null;
  email: string | null;
  used_at: string | null;
  expires_at: string | null;
  tenants: Tenant | null;
};

const ERROR_COPY: Record<string, string> = {
  invite_already_used: "Esse link já foi usado. Pede um novo pro Judson.",
  invite_expired: "Esse link expirou. Pede um novo pro Judson.",
  invite_not_found: "Não encontrei esse convite.",
  invite_failed: "Algo deu errado ao validar o convite. Tenta abrir o link de novo.",
  sign_in_failed: "Não consegui te conectar. Tenta abrir o link do email mais uma vez.",
};

export default async function InvitePage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { token } = await params;
  const { error: errorCode } = await searchParams;
  const errorMessage = errorCode ? ERROR_COPY[errorCode] ?? null : null;

  const supabase = await createClient();
  const { data: invite } = await supabase
    .from("invites")
    .select(
      "token, full_name, email, used_at, expires_at, tenants(*)",
    )
    .eq("token", token)
    .maybeSingle<InviteWithTenant>();

  if (!invite || !invite.tenants) notFound();

  const tenant = invite.tenants;
  const initial = (Array.from(tenant.name)[0] ?? "?").toUpperCase();

  const expired =
    invite.expires_at && new Date(invite.expires_at) < new Date();
  const used = !!invite.used_at;
  const blocked = expired || used;

  return (
    <main
      className="flex min-h-[100dvh] flex-col items-center bg-background px-6 py-12"
      style={brandStyleVars(tenant)}
    >
      <div className="flex w-full max-w-sm flex-col gap-8">
        <header className="flex flex-col items-center gap-3 text-center">
          <span className="grid size-16 place-items-center rounded-2xl bg-[var(--brand-primary)] font-display text-2xl text-white">
            {initial}
          </span>
          <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
            Convite
          </span>
          <h1 className="font-display text-4xl leading-none">
            {tenant.name}
          </h1>
          {tenant.tagline ? (
            <p className="text-sm text-muted-foreground">{tenant.tagline}</p>
          ) : null}
        </header>

        {blocked ? (
          <div className="rounded-lg border border-border bg-card/40 p-5 text-center">
            <h2 className="font-display text-xl">
              {used ? "Link já usado" : "Link expirou"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Fala com {tenant.name.split(" ")[0]} pra ele te mandar um novo.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {errorMessage ? (
              <p
                role="alert"
                className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                {errorMessage}
              </p>
            ) : null}
            <InviteForm
              token={invite.token}
              initialName={invite.full_name ?? ""}
              initialEmail={invite.email ?? ""}
              tenantFirstName={tenant.name.split(" ")[0]}
            />
          </div>
        )}
      </div>
    </main>
  );
}
