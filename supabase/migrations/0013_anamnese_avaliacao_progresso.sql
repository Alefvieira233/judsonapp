-- ─────────────────────────────────────────────────────────────────────────────
-- 0013_anamnese_avaliacao_progresso.sql
--
-- Adds the three "must-have for Brazilian FitCoach" entities the app was
-- missing before competing with Tecnofit / MFIT / Wiki4Fit:
--   • anamneses     — PAR-Q+ structured intake form (one per student).
--                     CREF requires it before a real prescription can be made.
--   • assessments   — physical assessment timeline (peso, %BF, perímetros).
--   • progress_photos — privacy-sensitive photos in a separate private bucket
--                       with strict RLS. NEVER public.
--
-- All three are categoria sensível (LGPD art. 5/11). Policies isolate by
-- (tenant_id + student_id) and grant SELECT to the student herself + the
-- tenant owner only.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1) anamneses ────────────────────────────────────────────────────────────
create table if not exists public.anamneses (
  id           uuid primary key default gen_random_uuid(),
  tenant_id    uuid not null references public.tenants(id) on delete cascade,
  student_id   uuid not null references public.profiles(id) on delete cascade,
  -- Core PAR-Q+ inspired fields. Nullable so partially filled forms are OK.
  has_heart_condition         boolean,
  has_chest_pain              boolean,
  has_dizziness               boolean,
  has_bone_or_joint_problem   boolean,
  takes_blood_pressure_meds   boolean,
  is_pregnant                 boolean,
  smoker                      boolean,
  -- Free-text details for context the structured fields can't capture.
  injuries        text,
  surgeries       text,
  medications     text,
  allergies       text,
  conditions      text,
  family_history  text,
  goals           text,
  activity_level  text,        -- e.g. "sedentária", "moderada", "intensa"
  notes           text,
  signed_at       timestamptz, -- when the student confirmed/submitted
  reviewed_at     timestamptz, -- when the trainer reviewed and approved
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (tenant_id, student_id)
);

create index if not exists anamneses_tenant_idx on public.anamneses (tenant_id, student_id);

drop trigger if exists set_anamneses_updated_at on public.anamneses;
create trigger set_anamneses_updated_at
  before update on public.anamneses
  for each row execute function public.trigger_set_timestamp();

alter table public.anamneses enable row level security;

drop policy if exists anamneses_owner_or_self_read on public.anamneses;
create policy anamneses_owner_or_self_read
  on public.anamneses for select to authenticated
  using (
    tenant_id = public.auth_tenant_id()
    and (student_id = auth.uid() or public.auth_role() = 'owner')
  );

drop policy if exists anamneses_self_upsert on public.anamneses;
create policy anamneses_self_upsert
  on public.anamneses for insert to authenticated
  with check (
    tenant_id = public.auth_tenant_id()
    and student_id = auth.uid()
  );

drop policy if exists anamneses_self_update on public.anamneses;
create policy anamneses_self_update
  on public.anamneses for update to authenticated
  using (tenant_id = public.auth_tenant_id() and student_id = auth.uid())
  with check (tenant_id = public.auth_tenant_id() and student_id = auth.uid());

drop policy if exists anamneses_owner_review on public.anamneses;
create policy anamneses_owner_review
  on public.anamneses for update to authenticated
  using (tenant_id = public.auth_tenant_id() and public.auth_role() = 'owner')
  with check (tenant_id = public.auth_tenant_id() and public.auth_role() = 'owner');

-- ── 2) assessments (physical assessment over time) ─────────────────────────
create table if not exists public.assessments (
  id            uuid primary key default gen_random_uuid(),
  tenant_id     uuid not null references public.tenants(id) on delete cascade,
  student_id    uuid not null references public.profiles(id) on delete cascade,
  measured_at   timestamptz not null default now(),
  measured_by   uuid references public.profiles(id),
  -- All measurements optional — partial assessments are valid.
  weight_kg     numeric(5, 2),
  height_cm     numeric(5, 1),
  body_fat_pct  numeric(4, 1),
  muscle_pct    numeric(4, 1),
  -- Common circumferences in cm.
  waist_cm      numeric(5, 1),
  hip_cm        numeric(5, 1),
  chest_cm      numeric(5, 1),
  arm_cm        numeric(5, 1),
  thigh_cm      numeric(5, 1),
  calf_cm       numeric(5, 1),
  notes         text,
  created_at    timestamptz not null default now()
);

create index if not exists assessments_student_time_idx
  on public.assessments (student_id, measured_at desc);

alter table public.assessments enable row level security;

drop policy if exists assessments_owner_or_self_read on public.assessments;
create policy assessments_owner_or_self_read
  on public.assessments for select to authenticated
  using (
    tenant_id = public.auth_tenant_id()
    and (student_id = auth.uid() or public.auth_role() = 'owner')
  );

-- Only the owner creates/edits/deletes assessments — they're prescriptive.
drop policy if exists assessments_owner_write on public.assessments;
create policy assessments_owner_write
  on public.assessments for all to authenticated
  using (tenant_id = public.auth_tenant_id() and public.auth_role() = 'owner')
  with check (tenant_id = public.auth_tenant_id() and public.auth_role() = 'owner');

-- ── 3) progress_photos ──────────────────────────────────────────────────────
create table if not exists public.progress_photos (
  id            uuid primary key default gen_random_uuid(),
  tenant_id     uuid not null references public.tenants(id) on delete cascade,
  student_id    uuid not null references public.profiles(id) on delete cascade,
  taken_at      timestamptz not null default now(),
  storage_path  text not null,         -- bucket: progress-photos
  pose          text check (pose in ('front', 'side', 'back', 'other')),
  weight_kg     numeric(5, 2),
  notes         text,
  created_at    timestamptz not null default now()
);

create index if not exists progress_photos_student_time_idx
  on public.progress_photos (student_id, taken_at desc);

alter table public.progress_photos enable row level security;

drop policy if exists progress_photos_owner_or_self_read on public.progress_photos;
create policy progress_photos_owner_or_self_read
  on public.progress_photos for select to authenticated
  using (
    tenant_id = public.auth_tenant_id()
    and (student_id = auth.uid() or public.auth_role() = 'owner')
  );

drop policy if exists progress_photos_self_write on public.progress_photos;
create policy progress_photos_self_write
  on public.progress_photos for all to authenticated
  using (tenant_id = public.auth_tenant_id() and student_id = auth.uid())
  with check (tenant_id = public.auth_tenant_id() and student_id = auth.uid());

-- The owner can also delete photos on the student's behalf (e.g. content
-- removal request via WhatsApp).
drop policy if exists progress_photos_owner_delete on public.progress_photos;
create policy progress_photos_owner_delete
  on public.progress_photos for delete to authenticated
  using (tenant_id = public.auth_tenant_id() and public.auth_role() = 'owner');

-- ── 4) progress-photos PRIVATE bucket ──────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'progress-photos',
  'progress-photos',
  false,                    -- PRIVATE — fotos de aluna jamais públicas.
  10 * 1024 * 1024,         -- 10 MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Folder convention: <tenant_id>/<student_id>/<filename>
-- This keeps cross-tenant + cross-student isolation enforced at the path level.
drop policy if exists progress_photos_bucket_self_insert on storage.objects;
create policy progress_photos_bucket_self_insert
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'progress-photos'
    and (storage.foldername(name))[2] = auth.uid()::text
  );

drop policy if exists progress_photos_bucket_self_select on storage.objects;
create policy progress_photos_bucket_self_select
  on storage.objects for select to authenticated
  using (
    bucket_id = 'progress-photos'
    and (
      (storage.foldername(name))[2] = auth.uid()::text
      or public.auth_role() = 'owner'
    )
  );

drop policy if exists progress_photos_bucket_self_delete on storage.objects;
create policy progress_photos_bucket_self_delete
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'progress-photos'
    and (
      (storage.foldername(name))[2] = auth.uid()::text
      or public.auth_role() = 'owner'
    )
  );
