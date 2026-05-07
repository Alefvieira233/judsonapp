import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { brandStyleVars } from "@/lib/tenant";

export const metadata = { title: "Bem-vinda" };

export default async function WelcomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, tenant_id, tenants(name, tagline, brand_color, brand_color_dark)")
    .eq("id", user.id)
    .maybeSingle();

  const tenant = (profile as { tenants?: { name: string; tagline: string | null; brand_color: string | null; brand_color_dark: string | null } } | null)?.tenants ?? null;

  return (
    <main
      className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 bg-background px-6 py-16 text-center"
      style={tenant ? brandStyleVars(tenant) : undefined}
    >
      <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
        Bem-vinda
      </span>
      <h1 className="font-display text-5xl leading-none">
        {profile?.full_name ?? "Aluna"}
      </h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        Você entrou! O app das alunas com seus treinos e a comunidade está sendo
        finalizado. Te avisamos pelo WhatsApp assim que estiver pronto.
      </p>
      {tenant?.name ? (
        <p className="text-xs text-muted-foreground">
          {tenant.tagline ?? tenant.name}
        </p>
      ) : null}
    </main>
  );
}
