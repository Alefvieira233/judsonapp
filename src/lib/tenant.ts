import "server-only";

import type { CSSProperties } from "react";
import { unstable_cache } from "next/cache";
import { headers } from "next/headers";

import { createAdminClient, createClient } from "@/lib/supabase/server";
import type { Tenant } from "@/types/database";

/**
 * Cliente-zero anchor: when MULTI_TENANT_ENABLED !== "true" we always resolve
 * to this slug. Once SaaS mode flips on, host header drives resolution and
 * this only acts as a build-time / dev-offline fallback.
 */
export const DEFAULT_TENANT_SLUG = "judsonlobato";

export function isMultiTenantEnabled(): boolean {
  return process.env.MULTI_TENANT_ENABLED === "true";
}

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

const getTenantByHostCached = unstable_cache(
  async (host: string): Promise<Tenant | null> => {
    // Admin client is intentional: this runs inside unstable_cache, so it must
    // not depend on per-request cookies. The query is read-only and only
    // resolves a tenant id from a host string — no PII exposed.
    const admin = createAdminClient();
    const { data: tenantId, error: rpcError } = await admin.rpc(
      "resolve_tenant_by_host",
      { p_host: host },
    );

    if (rpcError) {
      console.error("[tenant] resolve_tenant_by_host error:", rpcError);
      return null;
    }
    if (!tenantId) return null;

    const { data: tenant, error } = await admin
      .from("tenants")
      .select("*")
      .eq("id", tenantId)
      .maybeSingle();

    if (error) {
      console.error("[tenant] tenant fetch error:", error);
      return null;
    }
    return tenant;
  },
  ["tenant-by-host"],
  {
    revalidate: 300,
    // Tag is keyed by host so updateTag(`tenant:host:${host}`) targets it.
    tags: ["tenant:host"],
  },
);

export async function getCurrentTenant(): Promise<Tenant | null> {
  // Multi-tenant off: keep the cliente-zero behavior. No host parsing needed.
  if (!isMultiTenantEnabled()) {
    return getTenantBySlug(DEFAULT_TENANT_SLUG);
  }

  let host: string | null = null;
  try {
    const h = await headers();
    host = h.get("host");
  } catch {
    // Outside request scope (build, scripts). Fall back to default slug so
    // static analysis and metadata helpers still resolve a tenant.
    return getTenantBySlug(DEFAULT_TENANT_SLUG);
  }

  if (!host) return null;
  return getTenantByHostCached(host.toLowerCase());
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
