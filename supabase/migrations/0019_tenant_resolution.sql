-- Tenant resolution by host header. Tries custom_domain first, then subdomain
-- against tenants.slug. Used in request scope (lib/tenant.ts) to route a host
-- like `judson.judsonapp.com.br` or `app.judson.com` to the right tenant.
create or replace function public.resolve_tenant_by_host(p_host text)
returns uuid
language plpgsql
security invoker
stable
set search_path = public, pg_temp
as $$
declare
  v_host text;
  v_subdomain text;
  v_tenant_id uuid;
begin
  if p_host is null or length(trim(p_host)) = 0 then
    return null;
  end if;

  v_host := lower(split_part(trim(p_host), ':', 1));

  select id into v_tenant_id
  from public.tenants
  where lower(custom_domain) = v_host
    and active is not false
  limit 1;

  if v_tenant_id is not null then
    return v_tenant_id;
  end if;

  if array_length(string_to_array(v_host, '.'), 1) >= 3 then
    v_subdomain := split_part(v_host, '.', 1);
    if v_subdomain not in ('www', 'app', 'api', '') then
      select id into v_tenant_id
      from public.tenants
      where lower(slug) = v_subdomain
        and active is not false
      limit 1;
    end if;
  end if;

  return v_tenant_id;
end;
$$;

revoke all on function public.resolve_tenant_by_host(text) from public;
grant execute on function public.resolve_tenant_by_host(text) to anon, authenticated, service_role;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'tenants_custom_domain_key'
  ) then
    alter table public.tenants
      add constraint tenants_custom_domain_key unique (custom_domain);
  end if;
end$$;
