-- ─────────────────────────────────────────────────────────────────────────────
-- 0025_fix_auth_helpers_definer_recursion.sql
--
-- Migration 0011 (Onda G) trocou auth_tenant_id() e auth_role() pra SECURITY
-- INVOKER pra fechar o advisor `auth_security_definer_function`. Decisão
-- formalmente correta, mas quebra esse caso de uso específico:
--
--   profiles RLS policy `profiles_tenant_read` chama auth_tenant_id().
--   auth_tenant_id() (INVOKER) faz `select tenant_id from profiles ...`
--     → dispara RLS em profiles → chama auth_tenant_id() de novo
--     → recursão infinita → "stack depth limit exceeded" (SQLSTATE 54001)
--
-- Sintoma observável: SELECT em profiles retorna vazio mesmo quando o profile
-- existe. Isso faz getCurrentProfile cair pro auto-provision, que falha com
-- duplicate key (profile já existe) e retorna null. Layout (trainer)
-- redireciona pra /login. /login vê session válida e redireciona pra
-- /dashboard. Loop infinito de redirect.
--
-- Fix: voltar pra SECURITY DEFINER (a função bypassa RLS dentro de si mesma,
-- corta a recursão) e restringir EXECUTE só a authenticated (não anon nem
-- public). O advisor é correto em geral, mas helpers RLS são exatamente o
-- caso de uso pra DEFINER.
-- ─────────────────────────────────────────────────────────────────────────────

alter function public.auth_tenant_id() security definer;
alter function public.auth_role()        security definer;

revoke execute on function public.auth_tenant_id() from public, anon;
revoke execute on function public.auth_role()        from public, anon;
grant  execute on function public.auth_tenant_id() to authenticated;
grant  execute on function public.auth_role()        to authenticated;

comment on function public.auth_tenant_id() is
  'SECURITY DEFINER: evita recursão quando policies de profiles chamam essa função. Lockada a authenticated.';

comment on function public.auth_role() is
  'SECURITY DEFINER pelo mesmo motivo de auth_tenant_id. Lockada a authenticated.';
