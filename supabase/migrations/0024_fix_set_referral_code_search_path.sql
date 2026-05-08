-- ─────────────────────────────────────────────────────────────────────────────
-- 0024_fix_set_referral_code_search_path.sql
--
-- Onda G migration 0011 fechou o advisor `function_search_path_mutable`
-- definindo `search_path=''` em `set_referral_code()` — mas a função usa
-- `gen_random_bytes()` que vive em `extensions.pgcrypto`. Sem search_path o
-- trigger BEFORE INSERT em profiles falhava com:
--   `function gen_random_bytes(integer) does not exist`  (SQLSTATE 42883)
-- Isso quebrava o auto-provision do owner em getCurrentProfile, causando
-- loop /dashboard ⇄ /login.
-- Fix: qualifica explicitamente `extensions.gen_random_bytes` e mantém o
-- search_path travado.
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.set_referral_code()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.role = 'student' and new.referral_code is null then
    new.referral_code := upper(
      substr(encode(extensions.gen_random_bytes(4), 'hex'), 1, 6)
    );
  end if;
  return new;
end;
$$;
