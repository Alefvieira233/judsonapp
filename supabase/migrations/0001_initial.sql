-- ─────────────────────────────────────────────────────────────────────────────
-- 0001_initial.sql — Judson App schema (multi-tenant ready)
-- Single-tenant in the MVP, but every domain table carries `tenant_id` so the
-- jump to white-label SaaS does not require a data migration.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── TENANTS ─────────────────────────────────────────────────────────────────
create table tenants (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  bio text,
  tagline text,
  brand_color text default '#DC2626',
  brand_color_dark text default '#991B1B',
  logo_url text,
  banner_url text,
  whatsapp_number text not null,
  instagram_handle text,
  cref text,
  city text,
  consultation_price text,
  consultation_pitch text,
  custom_domain text,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_tenants_slug on tenants(slug);
create index idx_tenants_custom_domain on tenants(custom_domain);

-- ── PROFILES (owner = personal trainer, student = aluno) ────────────────────
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  tenant_id uuid references tenants(id) on delete cascade,
  role text not null check (role in ('owner', 'student')),
  full_name text not null,
  email text,
  phone text,
  avatar_url text,
  birthdate date,
  goal text,
  observations text,
  joined_at timestamptz default now(),
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_profiles_tenant on profiles(tenant_id);
create index idx_profiles_role on profiles(tenant_id, role);

-- ── EXERCISES (tenant_id NULL = biblioteca pública) ─────────────────────────
create table exercises (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade,
  name text not null,
  muscle_group text,
  equipment text,
  video_url text,
  video_source text default 'youtube',
  thumbnail_url text,
  instructions text,
  is_owner_video boolean default false,
  created_at timestamptz default now()
);

create index idx_exercises_tenant on exercises(tenant_id);
create index idx_exercises_muscle on exercises(muscle_group);

-- ── WORKOUTS ────────────────────────────────────────────────────────────────
create table workouts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade,
  student_id uuid references profiles(id) on delete cascade,
  title text not null,
  description text,
  scheduled_days int[],
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_workouts_tenant on workouts(tenant_id);
create index idx_workouts_student on workouts(student_id);

-- ── WORKOUT ITEMS ───────────────────────────────────────────────────────────
create table workout_items (
  id uuid primary key default gen_random_uuid(),
  workout_id uuid references workouts(id) on delete cascade,
  exercise_id uuid references exercises(id),
  position int not null,
  sets int not null,
  reps text not null,
  rest_seconds int default 60,
  load_suggestion text,
  notes text,
  created_at timestamptz default now()
);

create index idx_items_workout on workout_items(workout_id);

-- ── WORKOUT LOGS ────────────────────────────────────────────────────────────
create table workout_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade,
  workout_id uuid references workouts(id) on delete cascade,
  student_id uuid references profiles(id) on delete cascade,
  completed_at timestamptz default now(),
  duration_minutes int,
  rpe int check (rpe between 1 and 10),
  notes text
);

create index idx_logs_tenant on workout_logs(tenant_id);
create index idx_logs_student on workout_logs(student_id);
create index idx_logs_date on workout_logs(completed_at);

-- ── EXERCISE LOGS ───────────────────────────────────────────────────────────
create table exercise_logs (
  id uuid primary key default gen_random_uuid(),
  workout_log_id uuid references workout_logs(id) on delete cascade,
  workout_item_id uuid references workout_items(id),
  set_number int,
  reps_done int,
  load_kg numeric(5,2),
  created_at timestamptz default now()
);

create index idx_exercise_logs_workout_log on exercise_logs(workout_log_id);

-- ── COMMUNITY ───────────────────────────────────────────────────────────────
create table community_posts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade,
  author_id uuid references profiles(id),
  content text not null,
  media_url text,
  media_type text,
  pinned boolean default false,
  published_at timestamptz default now(),
  created_at timestamptz default now()
);

create index idx_posts_tenant on community_posts(tenant_id, published_at desc);

create table community_reactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references community_posts(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  reaction text default 'like',
  created_at timestamptz default now(),
  unique (post_id, user_id, reaction)
);

create index idx_reactions_post on community_reactions(post_id);

create table community_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references community_posts(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

create index idx_comments_post on community_comments(post_id, created_at);

-- ── TESTIMONIALS ────────────────────────────────────────────────────────────
create table testimonials (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade,
  author_name text not null,
  author_avatar_url text,
  content text not null,
  rating int check (rating between 1 and 5),
  featured boolean default false,
  created_at timestamptz default now()
);

create index idx_testimonials_tenant on testimonials(tenant_id);

-- ── INVITES (link único pra aluno entrar via /invite/[token]) ───────────────
create table invites (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade,
  token text unique not null default encode(gen_random_bytes(16), 'hex'),
  email text,
  phone text,
  full_name text,
  used_at timestamptz,
  expires_at timestamptz default (now() + interval '14 days'),
  created_at timestamptz default now()
);

create index idx_invites_token on invites(token);
create index idx_invites_tenant on invites(tenant_id);

-- ── TRIGGER: updated_at ─────────────────────────────────────────────────────
create or replace function trigger_set_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_timestamp_tenants before update on tenants
  for each row execute procedure trigger_set_timestamp();
create trigger set_timestamp_profiles before update on profiles
  for each row execute procedure trigger_set_timestamp();
create trigger set_timestamp_workouts before update on workouts
  for each row execute procedure trigger_set_timestamp();

-- ── ROW LEVEL SECURITY ──────────────────────────────────────────────────────
-- MVP: permissive policies (single tenant, trusted users). Tighten when SaaS lands.
alter table tenants            enable row level security;
alter table profiles           enable row level security;
alter table exercises          enable row level security;
alter table workouts           enable row level security;
alter table workout_items      enable row level security;
alter table workout_logs       enable row level security;
alter table exercise_logs      enable row level security;
alter table community_posts    enable row level security;
alter table community_reactions enable row level security;
alter table community_comments enable row level security;
alter table testimonials       enable row level security;
alter table invites            enable row level security;

create policy "tenants_read_all"          on tenants            for select to authenticated using (true);
create policy "tenants_read_anon"         on tenants            for select to anon          using (true);

create policy "profiles_read_all"         on profiles           for select to authenticated using (true);
create policy "profiles_update_own"       on profiles           for update to authenticated using (auth.uid() = id);
create policy "profiles_insert_own"       on profiles           for insert to authenticated with check (auth.uid() = id);

create policy "exercises_read_all"        on exercises          for select to authenticated using (true);
create policy "exercises_owner_all"       on exercises          for all    to authenticated using (true) with check (true);

create policy "workouts_owner_all"        on workouts           for all    to authenticated using (true) with check (true);
create policy "workout_items_owner_all"   on workout_items      for all    to authenticated using (true) with check (true);

create policy "workout_logs_own"          on workout_logs       for all    to authenticated using (true) with check (true);
create policy "exercise_logs_own"         on exercise_logs      for all    to authenticated using (true) with check (true);

create policy "community_posts_read"      on community_posts    for select to authenticated using (true);
create policy "community_posts_write"     on community_posts    for all    to authenticated using (true) with check (true);

create policy "community_reactions_all"   on community_reactions for all   to authenticated using (true) with check (true);
create policy "community_comments_all"    on community_comments  for all   to authenticated using (true) with check (true);

create policy "testimonials_read_anon"    on testimonials       for select to anon          using (true);
create policy "testimonials_read_auth"    on testimonials       for select to authenticated using (true);
create policy "testimonials_write_auth"   on testimonials       for all    to authenticated using (true) with check (true);

create policy "invites_read_token"        on invites            for select to anon          using (true);
create policy "invites_owner_all"         on invites            for all    to authenticated using (true) with check (true);
