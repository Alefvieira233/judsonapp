-- ─────────────────────────────────────────────────────────────────────────────
-- 0005_lock_consume_invite.sql — restrict RPC to authenticated callers only
--
-- Supabase auto-grants EXECUTE on new public-schema functions to `anon`,
-- `authenticated`, `postgres` and `service_role`. The `revoke all on function
-- ... from public` in 0004 does NOT remove these explicit grants. We want only
-- authenticated users (the aluna who just exchanged her OTP) to be able to
-- redeem an invite — anon must not.
-- ─────────────────────────────────────────────────────────────────────────────

revoke execute on function public.consume_invite(text, uuid, text, text) from anon;
