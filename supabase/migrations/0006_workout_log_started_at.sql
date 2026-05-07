-- ─────────────────────────────────────────────────────────────────────────────
-- 0006_workout_log_started_at.sql
--
-- The student PWA needs to distinguish in-progress workouts from completed
-- ones. Today `completed_at` defaults to now() which makes every row look
-- finished. We split semantics:
--   - `started_at` (new, default now()) — when the aluna tapped "Iniciar"
--   - `completed_at` (existing, default removed) — null while running, set on
--     completion.
-- ─────────────────────────────────────────────────────────────────────────────

alter table workout_logs add column if not exists started_at timestamptz default now();
alter table workout_logs alter column completed_at drop default;

create index if not exists idx_logs_started on workout_logs(started_at);
