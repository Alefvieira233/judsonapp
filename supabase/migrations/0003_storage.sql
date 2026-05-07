-- ─────────────────────────────────────────────────────────────────────────────
-- 0003_storage.sql — Public bucket for tenant logos/banners
-- Only the tenant's owner can write to its own folder; anyone can read.
-- ─────────────────────────────────────────────────────────────────────────────

-- Create the bucket (public so unauthenticated PWA pages can render images).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'tenant-assets',
  'tenant-assets',
  true,
  5 * 1024 * 1024,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

-- No SELECT policy: public buckets serve direct URLs without auth, and adding
-- a broad SELECT policy would let clients LIST all files (advisor 0025).

-- Owners write only inside their own tenant folder (path = "{tenant_id}/...").
create policy "tenant_assets_owner_write"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'tenant-assets'
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role = 'owner'
      and (storage.foldername(name))[1] = p.tenant_id::text
  )
);

create policy "tenant_assets_owner_update"
on storage.objects for update
to authenticated
using (
  bucket_id = 'tenant-assets'
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role = 'owner'
      and (storage.foldername(name))[1] = p.tenant_id::text
  )
);

create policy "tenant_assets_owner_delete"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'tenant-assets'
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role = 'owner'
      and (storage.foldername(name))[1] = p.tenant_id::text
  )
);

-- Allow owners to update their tenant row (needed by the settings form).
create policy "tenants_owner_update"
on public.tenants for update
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'owner' and p.tenant_id = tenants.id
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'owner' and p.tenant_id = tenants.id
  )
);

-- Resolve the security advisor warning: pin search_path on the trigger function.
create or replace function public.trigger_set_timestamp()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
