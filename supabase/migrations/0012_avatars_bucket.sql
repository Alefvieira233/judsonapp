-- ─────────────────────────────────────────────────────────────────────────────
-- 0012_avatars_bucket.sql — H13 fix: avatars de aluna/owner com upload real.
--
-- profiles.avatar_url existe desde 0001 mas nunca foi escrita por UI nenhuma.
-- Cria bucket `avatars` público (avatares aparecem em feed/comments — não
-- são dados sensíveis) com policy de owner-folder (auth.uid() = pasta).
-- ─────────────────────────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  3 * 1024 * 1024, -- 3 MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- The user can upload/update only inside their own UUID folder. Service role
-- bypasses these as usual for server-side operations.
drop policy if exists avatars_owner_folder_insert on storage.objects;
create policy avatars_owner_folder_insert
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists avatars_owner_folder_update on storage.objects;
create policy avatars_owner_folder_update
  on storage.objects for update to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists avatars_owner_folder_delete on storage.objects;
create policy avatars_owner_folder_delete
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
-- Public reads work without policy thanks to bucket.public = true.
