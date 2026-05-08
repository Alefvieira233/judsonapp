# Judson App

PWA branded para o personal trainer **Judson Lobato** — cliente-zero do FitCoach SaaS multi-tenant. A mesma codebase pode hospedar N personais via subdomínio (`{tenant}.judsonapp.com.br`) ou domínio custom (`app.personaldoseucliente.com.br`); o cliente-zero roda em modo single-tenant até `MULTI_TENANT_ENABLED=true`.

Schema é multi-tenant desde a 0001 (toda tabela de domínio carrega `tenant_id`), RLS hardened, autenticação via Supabase Auth, billing dual (Asaas pra cobrar a aluna em Pix/cartão, Stripe pra cobrar o personal pela mensalidade SaaS), PWA instalável e gamificação com badges + leaderboard.

## Stack

Next.js 16.2.5 (App Router) · React 19.2.4 · TypeScript estrito · Tailwind 4 · Supabase (Postgres + Auth + Storage + Realtime) · framer-motion · zod · next-intl (PT-BR + ES) · Vitest + Playwright · Sentry · Upstash Redis (rate-limit) · web-push (VAPID) · Asaas + Stripe.

## Features

**Core**
- Onboarding via invite atômico (RPC `consume_invite` com lock por user) → magic link → `/welcome`.
- Painel do personal: dashboard com charts, alunas, treinos com templates, exercícios, comunidade.
- App da aluna (PWA): home com hero/streak, heatmap 7/90 dias, treinos, feed, perfil, equipe.
- Runner de treino com timer, registro de carga/RPE, confete na conclusão.

**Anamnese e Avaliação**
- PAR-Q+ estruturado, avaliação física com timeline, fotos de progresso (bucket privado).

**Social**
- Feed multimídia (vídeo embed YouTube/Instagram/Vimeo, foto, texto) com 5 reactions.
- Chat in-app 1:1 via Supabase Realtime.
- Story compartilhável (OG image gerada via `next/og`).
- Comments em posts.

**Gamificação**
- Badges (catálogo + `evaluateBadges` idempotente em `src/lib/badges.ts`).
- Personal records (PR) por exercício.
- Strength score por grupo muscular (volume rolling 30d) + snapshots diários.
- Leaderboard mensal.
- Streak de treinos.

**Billing**
- Asaas (Pix/cartão recorrente) — cobrança da aluna pelo personal. Webhook assinado.
- Stripe — cobrança do personal pelo SaaS (planos R$79/Starter, R$149/Pro). Checkout + Customer Portal + webhook.

**LGPD**
- Aceite versionado de Termos/Privacidade na primeira sessão (tabela `consents`).
- Cookie banner one-time.
- Export e deleção self-service de dados.
- Audit trail em ações sensíveis.

**Observabilidade**
- Logger estruturado JSON (`src/lib/logger.ts`) com `requestId`/`tenantId`/`scope`.
- Sentry (auto-forward de warn+error).
- Health check em `/api/health`.
- CSP nonced + HSTS preload + headers OWASP em `src/proxy.ts`.

**i18n**
- next-intl com PT-BR (default) e ES. Strings em `messages/`.

**PWA**
- Service Worker com offline fallback (sem cache de HTML autenticado).
- Splash screens iOS, ícones gerados via `npm run icons`.
- Push notifications (Web Push + VAPID, sem Firebase).

## Estrutura de rotas

```
src/app/
├── (auth)/login                 # owner / personal — email + senha
├── aluna/entrar                 # aluna recorrente — magic link só
├── invite/[token]               # landing de convite + first-login
├── auth/callback                # OTP exchange + consume_invite
├── welcome                      # pós-onboarding da aluna
├── (trainer)/
│   ├── dashboard                # charts + KPIs
│   ├── students/[id]            # detalhe + métricas + plano
│   ├── workouts                 # criar/editar/duplicar treinos + templates
│   ├── exercises                # biblioteca pública + custom
│   ├── community                # feed do personal pra alunas
│   ├── plans                    # planos comerciais
│   └── settings                 # ajustes + LGPD
├── (student)/
│   ├── home                     # hero streak + heatmap + milestones
│   ├── treinos                  # lista + runner com timer
│   ├── feed                     # social
│   ├── equipe                   # leaderboard + chat
│   ├── planos                   # subscription + checkout Asaas
│   └── perfil                   # avatar + métricas + export/delete
├── (shared)/_chat               # chat compartilhado entre roles
├── criar-conta-personal         # SaaS signup (gated por MULTI_TENANT_ENABLED)
├── privacidade · termos         # legal pages
├── offline                      # SW fallback
└── api/
    ├── health                   # JSON health check
    ├── webhooks/asaas           # cobrança da aluna
    ├── webhooks/stripe          # cobrança do personal
    ├── push/{subscribe,unsubscribe}
    ├── og/story                 # OG image dinâmica do story
    └── cron/
        ├── training-reminder    # 12:00 UTC
        ├── inactive-reminder    # 17:00 UTC
        └── strength-snapshot    # 04:00 UTC
```

`src/proxy.ts` (não é `middleware.ts` por convenção do Next 16) injeta CSP nonced, request-id, e roda `updateSession` do Supabase.

## Setup local

1. **Clonar e instalar**

   ```bash
   git clone https://github.com/Alefvieira233/judsonapp.git
   cd judsonapp
   npm install
   ```

2. **Env vars** — copia `.env.example` pra `.env.local` e preenche:

   ```bash
   cp .env.example .env.local
   ```

   Mínimo pra rodar: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`. O resto degrada gracefully (sem Asaas → fluxo manual; sem Stripe → trial gratuito; sem Upstash → rate-limit em memória; sem Sentry → no-op).

3. **Supabase** — projeto já existe (`ymepyisibjraxtrnxpwc`). Aplicar migrations via MCP Supabase ou `supabase db push`.

4. **Bootstrap do owner** — criar usuário em **Auth → Users** no painel Supabase. No primeiro login em `/login`, `lib/auth.ts` cria o profile com `role=owner` automaticamente.

5. **Rodar**

   ```bash
   npm run dev              # http://localhost:3000
   # No Windows com Sentry instalado, Turbopack pode travar — use:
   npm run dev -- --webpack
   ```

6. **Gerar ícones PWA** (uma vez)

   ```bash
   npm run icons
   ```

## Migrations

23 migrations versionadas em `supabase/migrations/`:

| # | Arquivo | O que faz |
|---|---|---|
| 0001 | initial | schema multi-tenant base (tenants, profiles, exercises, workouts, logs, posts, invites) |
| 0002 | seed | tenant Judson + biblioteca pública de 50 exercícios (`tenant_id=NULL`) |
| 0003 | storage | bucket público `tenant-assets` pra logos/banners |
| 0004 | consume_invite | RPC atômico de redenção de invite |
| 0005 | lock_consume_invite | restringe RPC a `authenticated` |
| 0006 | workout_log_started_at | separa em-progresso de concluído |
| 0007 | rls_hardening | troca `USING (true)` por checks reais — pré-prod |
| 0008 | profiles_self_read | quebra recursão em `auth_tenant_id()` |
| 0009 | plans_and_referrals | planos comerciais + referrals |
| 0010 | consume_invite_lock_user | CRIT-1 fix: `p_user_id` deve = `auth.uid()` |
| 0011 | consents_and_invoker_helpers | LGPD: tabela `consents` + helpers `security invoker` |
| 0012 | avatars_bucket | bucket público `avatars` (visíveis em feed) |
| 0013 | anamnese_avaliacao_progresso | PAR-Q+, avaliação física, fotos |
| 0014 | subscriptions | billing recorrente Asaas |
| 0015 | badges_and_workout_item_mode | gamificação: catálogo + `badges_earned` |
| 0016 | push_subscriptions | endpoints Web Push (VAPID) |
| 0017 | chat | threads 1:1 + mensagens via Realtime |
| 0018 | saas_billing | `tenant_subscriptions` + `stripe_events` |
| 0019 | tenant_resolution | `resolve_tenant_by_host` pra subdomínio/custom domain |
| 0020 | stripe_events_policy_and_function_searchpath | hardening RLS + `search_path` em SECURITY DEFINER |
| 0021 | personal_records | PR por exercício |
| 0022 | strength_snapshots | snapshot diário de strength score |
| 0023 | leaderboard | view `monthly_leaderboard` (security_invoker) |

## Comandos úteis

```bash
npm run dev              # dev (Turbopack; --webpack se travar)
npm run build            # build de produção
npm start                # roda build local (testa SW)
npm run lint
npm run icons            # regenera ícones PWA + splash iOS

npm run test             # vitest run (44 unit tests)
npm run test:watch
npm run test:cov         # com coverage v8
npm run e2e              # playwright (14 specs, sobe dev server sozinho)
npm run e2e:ui           # interactive runner
```

## Deploy de produção

### Pré-requisitos

- Repo no GitHub (`Alefvieira233/judsonapp`)
- Conta Vercel (free tier serve)
- Domínio registrado — `judsonlobato.com.br` ou similar
- Cloudflare account (free tier serve)

### Passos

**1. Vercel — conectar repo**
1. https://vercel.com/new → Import Git Repository → `Alefvieira233/judsonapp`
2. Framework: **Next.js** (auto-detect)
3. Root: `./`
4. Defaults pra build/output

**2. Vercel — env vars**
Em Settings → Environment Variables (Production + Preview), copiar de `.env.local`. Mínimo: as 3 do Supabase. Resto: ver [RUNBOOK.md](./RUNBOOK.md) pra ativar Asaas, Stripe, Sentry, Upstash, Push, Crons.

⚠ `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `ASAAS_API_KEY` são **secrets** — marca como sensitive e jamais prefixa com `NEXT_PUBLIC_`.

**3. Domínio custom**
1. Vercel → Settings → Domains → Add → `app.judsonlobato.com.br`
2. Cloudflare → DNS → CNAME → `app` → target da Vercel → **DNS only** (cinza)
3. 1-5min de propagação

**4. Atualizar Supabase pra prod**
- Site URL: `https://app.judsonlobato.com.br`
- Redirect URLs allowlist: adicionar `https://app.judsonlobato.com.br/auth/callback`

**5. Smoke test**
- `/login` carrega
- Convidar aluna, abrir magic link, ver landing de prod
- `/api/health` → `{"status":"ok"}`
- UptimeRobot a cada 5min

**6. Pós-deploy**
- HSTS preload ativo via `next.config.ts`
- SW registra em prod via `pwa-register.tsx`
- Splash screens iOS funcionam em PWA instalada (Safari ≥ 16.4)

## Próximos passos (dependem de você, Alef)

Tudo o que precisa de credencial externa ou toggle manual está em **[RUNBOOK.md](./RUNBOOK.md)**:

- [ ] Ativar Asaas (cobrança da aluna)
- [ ] Ativar Stripe (cobrança do personal — SaaS)
- [ ] Ativar Sentry
- [ ] Ativar Upstash Redis (rate-limit prod)
- [ ] Gerar VAPID keys + push notifications
- [ ] Setar `CRON_SECRET`
- [ ] Habilitar HaveIBeenPwned no Supabase
- [ ] DNS wildcard + `MULTI_TENANT_ENABLED=true` (quando lançar SaaS)
- [ ] Trocar email template Supabase pra PT-BR + brand Judson
- [ ] Substituir senha dev → real do Judson

Pra contribuir: **[CONTRIBUTING.md](./CONTRIBUTING.md)**.
Pra rodar testes: **[TESTING.md](./TESTING.md)**.
Estado pós-implementação: **[.analysis/STATUS-FINAL.md](./.analysis/STATUS-FINAL.md)**.
