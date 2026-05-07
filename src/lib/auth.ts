import { createClient } from "@/lib/supabase/server";
import { getCurrentTenant } from "@/lib/tenant";
import type { Profile, Tenant } from "@/types/database";

/**
 * Returns the authenticated profile for the current request.
 * Side-effect: on first login of the personal trainer, auto-provisions the
 * owner profile linked to the cliente-zero tenant. This avoids forcing the
 * user to run extra SQL after creating their auth user in Supabase.
 */
export async function getCurrentProfile(): Promise<{
  profile: Profile;
  tenant: Tenant;
} | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const tenant = await getCurrentTenant();
  if (!tenant) return null;

  const { data: existing } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (existing) return { profile: existing, tenant };

  // First sign-in: bootstrap the owner profile on the cliente-zero tenant.
  const { data: created, error } = await supabase
    .from("profiles")
    .insert({
      id: user.id,
      tenant_id: tenant.id,
      role: "owner",
      full_name: user.user_metadata?.full_name ?? tenant.name,
      email: user.email ?? null,
    })
    .select("*")
    .single();

  if (error || !created) {
    console.error("[auth] failed to provision owner profile:", error);
    return null;
  }
  return { profile: created, tenant };
}
