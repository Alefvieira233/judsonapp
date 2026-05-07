import type { CSSProperties } from "react";

import { createClient } from "@/lib/supabase/server";
import type { Tenant } from "@/types/database";

/**
 * MVP anchor: single tenant resolved from this slug. When multi-tenant lands,
 * resolve from request host (`tenants.custom_domain`) or subdomain
 * (`<slug>.app.fitcoach.com.br`).
 */
export const DEFAULT_TENANT_SLUG = "judsonlobato";

export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tenants")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("[tenant] getTenantBySlug error:", error);
    return null;
  }
  return data;
}

export async function getCurrentTenant(): Promise<Tenant | null> {
  return getTenantBySlug(DEFAULT_TENANT_SLUG);
}

/**
 * Returns inline CSS variable overrides for the brand atoms.
 * Apply to `<html style={brandStyleVars(tenant)}>` in tenant-aware layouts
 * once the SaaS goes multi-tenant. The MVP CSS already matches Judson,
 * so this is effectively a no-op for the cliente-zero — but it future-proofs
 * the markup for when other tenants run on the same codebase.
 */
export function brandStyleVars(
  tenant: Pick<Tenant, "brand_color" | "brand_color_dark"> | null,
): CSSProperties {
  const style: Record<string, string> = {};
  if (tenant?.brand_color) style["--brand-primary"] = tenant.brand_color;
  if (tenant?.brand_color_dark)
    style["--brand-primary-dark"] = tenant.brand_color_dark;
  return style as CSSProperties;
}
