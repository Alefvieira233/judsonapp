-- ─────────────────────────────────────────────────────────────────────────────
-- 0007_rls_hardening.sql — tighten RLS policies before production
--
-- The MVP shipped with permissive `USING (true)` policies (see 0001_initial.sql
-- comment "tighten when SaaS lands"). With the student PWA going live, every
-- write must be checked against tenant + role, and reads must be scoped to the
-- caller's tenant.
--
-- Helper functions read the caller's tenant_id and role from profiles. Both
-- are SECURITY DEFINER + STABLE so policies can call them without triggering
-- the policy itself recursively (auth.uid() is the same row across the
-- transaction).
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function auth_tenant_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select tenant_id from profiles where id = auth.uid()
$$;

create or replace function auth_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from profiles where id = auth.uid()
$$;

revoke execute on function auth_tenant_id() from public, anon;
revoke execute on function auth_role() from public, anon;
grant execute on function auth_tenant_id() to authenticated;
grant execute on function auth_role() to authenticated;

-- ── PROFILES ────────────────────────────────────────────────────────────────
drop policy if exists "profiles_read_all" on profiles;
drop policy if exists "profiles_update_own" on profiles;
drop policy if exists "profiles_insert_own" on profiles;

create policy "profiles_tenant_read" on profiles for select to authenticated
  using (tenant_id = auth_tenant_id());
create policy "profiles_self_insert" on profiles for insert to authenticated
  with check (auth.uid() = id);
create policy "profiles_self_update" on profiles for update to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles_owner_update" on profiles for update to authenticated
  using (tenant_id = auth_tenant_id() and auth_role() = 'owner')
  with check (tenant_id = auth_tenant_id() and auth_role() = 'owner');

-- ── EXERCISES ───────────────────────────────────────────────────────────────
drop policy if exists "exercises_read_all" on exercises;
drop policy if exists "exercises_owner_all" on exercises;

create policy "exercises_read_lib" on exercises for select to authenticated
  using (tenant_id is null or tenant_id = auth_tenant_id());
create policy "exercises_owner_write" on exercises for insert to authenticated
  with check (tenant_id = auth_tenant_id() and auth_role() = 'owner');
create policy "exercises_owner_update" on exercises for update to authenticated
  using (tenant_id = auth_tenant_id() and auth_role() = 'owner')
  with check (tenant_id = auth_tenant_id() and auth_role() = 'owner');
create policy "exercises_owner_delete" on exercises for delete to authenticated
  using (tenant_id = auth_tenant_id() and auth_role() = 'owner');

-- ── WORKOUTS ────────────────────────────────────────────────────────────────
drop policy if exists "workouts_owner_all" on workouts;

create policy "workouts_tenant_read" on workouts for select to authenticated
  using (tenant_id = auth_tenant_id());
create policy "workouts_owner_write" on workouts for insert to authenticated
  with check (tenant_id = auth_tenant_id() and auth_role() = 'owner');
create policy "workouts_owner_update" on workouts for update to authenticated
  using (tenant_id = auth_tenant_id() and auth_role() = 'owner')
  with check (tenant_id = auth_tenant_id() and auth_role() = 'owner');
create policy "workouts_owner_delete" on workouts for delete to authenticated
  using (tenant_id = auth_tenant_id() and auth_role() = 'owner');

-- ── WORKOUT_ITEMS ───────────────────────────────────────────────────────────
drop policy if exists "workout_items_owner_all" on workout_items;

create policy "workout_items_tenant_read" on workout_items for select to authenticated
  using (
    exists (
      select 1 from workouts w
      where w.id = workout_items.workout_id
        and w.tenant_id = auth_tenant_id()
    )
  );
create policy "workout_items_owner_write" on workout_items for insert to authenticated
  with check (
    auth_role() = 'owner'
    and exists (
      select 1 from workouts w
      where w.id = workout_items.workout_id
        and w.tenant_id = auth_tenant_id()
    )
  );
create policy "workout_items_owner_update" on workout_items for update to authenticated
  using (
    auth_role() = 'owner'
    and exists (
      select 1 from workouts w
      where w.id = workout_items.workout_id
        and w.tenant_id = auth_tenant_id()
    )
  )
  with check (
    auth_role() = 'owner'
    and exists (
      select 1 from workouts w
      where w.id = workout_items.workout_id
        and w.tenant_id = auth_tenant_id()
    )
  );
create policy "workout_items_owner_delete" on workout_items for delete to authenticated
  using (
    auth_role() = 'owner'
    and exists (
      select 1 from workouts w
      where w.id = workout_items.workout_id
        and w.tenant_id = auth_tenant_id()
    )
  );

-- ── WORKOUT_LOGS ────────────────────────────────────────────────────────────
drop policy if exists "workout_logs_own" on workout_logs;

create policy "workout_logs_tenant_read" on workout_logs for select to authenticated
  using (tenant_id = auth_tenant_id());
create policy "workout_logs_self_insert" on workout_logs for insert to authenticated
  with check (tenant_id = auth_tenant_id() and student_id = auth.uid());
create policy "workout_logs_self_update" on workout_logs for update to authenticated
  using (
    tenant_id = auth_tenant_id()
    and (student_id = auth.uid() or auth_role() = 'owner')
  )
  with check (
    tenant_id = auth_tenant_id()
    and (student_id = auth.uid() or auth_role() = 'owner')
  );
create policy "workout_logs_owner_delete" on workout_logs for delete to authenticated
  using (tenant_id = auth_tenant_id() and auth_role() = 'owner');

-- ── EXERCISE_LOGS ───────────────────────────────────────────────────────────
drop policy if exists "exercise_logs_own" on exercise_logs;

create policy "exercise_logs_tenant_read" on exercise_logs for select to authenticated
  using (
    exists (
      select 1 from workout_logs wl
      where wl.id = exercise_logs.workout_log_id
        and wl.tenant_id = auth_tenant_id()
    )
  );
create policy "exercise_logs_self_insert" on exercise_logs for insert to authenticated
  with check (
    exists (
      select 1 from workout_logs wl
      where wl.id = exercise_logs.workout_log_id
        and wl.tenant_id = auth_tenant_id()
        and (wl.student_id = auth.uid() or auth_role() = 'owner')
    )
  );
create policy "exercise_logs_self_update" on exercise_logs for update to authenticated
  using (
    exists (
      select 1 from workout_logs wl
      where wl.id = exercise_logs.workout_log_id
        and wl.tenant_id = auth_tenant_id()
        and (wl.student_id = auth.uid() or auth_role() = 'owner')
    )
  );
create policy "exercise_logs_self_delete" on exercise_logs for delete to authenticated
  using (
    exists (
      select 1 from workout_logs wl
      where wl.id = exercise_logs.workout_log_id
        and wl.tenant_id = auth_tenant_id()
        and (wl.student_id = auth.uid() or auth_role() = 'owner')
    )
  );

-- ── COMMUNITY_POSTS ─────────────────────────────────────────────────────────
drop policy if exists "community_posts_read" on community_posts;
drop policy if exists "community_posts_write" on community_posts;

create policy "community_posts_tenant_read" on community_posts for select to authenticated
  using (tenant_id = auth_tenant_id());
create policy "community_posts_owner_write" on community_posts for insert to authenticated
  with check (
    tenant_id = auth_tenant_id()
    and auth_role() = 'owner'
    and author_id = auth.uid()
  );
create policy "community_posts_owner_update" on community_posts for update to authenticated
  using (tenant_id = auth_tenant_id() and auth_role() = 'owner')
  with check (tenant_id = auth_tenant_id() and auth_role() = 'owner');
create policy "community_posts_owner_delete" on community_posts for delete to authenticated
  using (tenant_id = auth_tenant_id() and auth_role() = 'owner');

-- ── COMMUNITY_REACTIONS ─────────────────────────────────────────────────────
drop policy if exists "community_reactions_all" on community_reactions;

create policy "community_reactions_tenant_read" on community_reactions for select to authenticated
  using (
    exists (
      select 1 from community_posts p
      where p.id = community_reactions.post_id
        and p.tenant_id = auth_tenant_id()
    )
  );
create policy "community_reactions_self_write" on community_reactions for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from community_posts p
      where p.id = community_reactions.post_id
        and p.tenant_id = auth_tenant_id()
    )
  );
create policy "community_reactions_self_delete" on community_reactions for delete to authenticated
  using (user_id = auth.uid());

-- ── COMMUNITY_COMMENTS ──────────────────────────────────────────────────────
drop policy if exists "community_comments_all" on community_comments;

create policy "community_comments_tenant_read" on community_comments for select to authenticated
  using (
    exists (
      select 1 from community_posts p
      where p.id = community_comments.post_id
        and p.tenant_id = auth_tenant_id()
    )
  );
create policy "community_comments_self_write" on community_comments for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from community_posts p
      where p.id = community_comments.post_id
        and p.tenant_id = auth_tenant_id()
    )
  );
create policy "community_comments_self_update" on community_comments for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "community_comments_self_delete" on community_comments for delete to authenticated
  using (user_id = auth.uid() or auth_role() = 'owner');

-- ── TESTIMONIALS ────────────────────────────────────────────────────────────
drop policy if exists "testimonials_write_auth" on testimonials;

create policy "testimonials_owner_write" on testimonials for insert to authenticated
  with check (tenant_id = auth_tenant_id() and auth_role() = 'owner');
create policy "testimonials_owner_update" on testimonials for update to authenticated
  using (tenant_id = auth_tenant_id() and auth_role() = 'owner')
  with check (tenant_id = auth_tenant_id() and auth_role() = 'owner');
create policy "testimonials_owner_delete" on testimonials for delete to authenticated
  using (tenant_id = auth_tenant_id() and auth_role() = 'owner');

-- ── INVITES ─────────────────────────────────────────────────────────────────
drop policy if exists "invites_owner_all" on invites;

create policy "invites_tenant_read" on invites for select to authenticated
  using (tenant_id = auth_tenant_id());
create policy "invites_owner_write" on invites for insert to authenticated
  with check (tenant_id = auth_tenant_id() and auth_role() = 'owner');
create policy "invites_owner_update" on invites for update to authenticated
  using (tenant_id = auth_tenant_id() and auth_role() = 'owner')
  with check (tenant_id = auth_tenant_id() and auth_role() = 'owner');
create policy "invites_owner_delete" on invites for delete to authenticated
  using (tenant_id = auth_tenant_id() and auth_role() = 'owner');
-- The "invites_read_token" policy stays (anon can SELECT to validate the token
-- before signing in via /invite/[token]).
