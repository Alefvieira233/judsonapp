# Judson App

PWA branded para o personal trainer Judson Lobato — cliente-zero do futuro SaaS de white-label fitness.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript estrito · Tailwind 4 · Supabase (Postgres + Auth + Storage) · PWA · framer-motion · zod.

## Desenvolvimento

```bash
npm install
npm run dev          # http://localhost:3000
npm run lint
npm run build
npm run icons        # regenera ícones PWA
```

`.env.local` com:

```
NEXT_PUBLIC_SUPABASE_URL=https://ymepyisibjraxtrnxpwc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=…
SUPABASE_SERVICE_ROLE_KEY=…
```

## Estrutura

- `src/app/(auth)/login` — login do personal (email + senha)
- `src/app/(trainer)` — painel do personal (dashboard, alunas, treinos, exercícios, comunidade, ajustes)
- `src/app/invite/[token]` — landing pública do convite, dispara magic link
- `src/app/auth/callback` — Route Handler que troca o `code` OTP por sessão e consome o invite via RPC `consume_invite`
- `src/app/welcome` — landing pós-onboarding da aluna
- `src/lib/supabase` — clientes server / browser / middleware
- `supabase/migrations` — schema versionado em SQL

## Setup operacional

### 1. Aplicar migrations

Via MCP Supabase (preferido) ou `supabase db push`. As migrations estão em ordem em `supabase/migrations/`.

### 2. Customizar email do magic link

A aluna recebe um email do Supabase quando aceita o convite. Por default está em inglês — precisa ser trocado pra PT-BR com a marca Judson antes do beta com pessoas reais.

No dashboard Supabase → **Authentication → Email Templates → Magic Link**:

- **Subject:** `Seu link pra entrar no app do Judson`
- **Body (HTML):** header com `#DC2626`, copy "Oi! Clica no botão abaixo pra entrar no app do Judson Lobato. O link vale 1 hora.", botão CTA "Entrar no app" com `href="{{ .ConfirmationURL }}"`, footer "Se não foi você, ignora esse email."
- Manter `{{ .ConfirmationURL }}` como href do CTA — Supabase substitui no envio.

### 3. Site URL e Redirect URLs

No dashboard Supabase → **Authentication → URL Configuration**:

- **Site URL:** `http://localhost:3000` em dev, `https://app.judsonlobato.com.br` em produção
- **Redirect URLs allowlist:** incluir `http://localhost:3000/auth/callback` e `https://app.judsonlobato.com.br/auth/callback`

### 4. Bootstrap do owner

Criar o usuário do Judson em **Authentication → Users**. No primeiro login em `/login`, `lib/auth.ts` cria o profile com `role=owner` automaticamente.

## Onboarding de aluna (fluxo end-to-end)

1. Owner abre `/students` → clica "Convidar aluna" → opcionalmente preenche nome/email/telefone → gera link.
2. Owner manda o link no WhatsApp da aluna (botão pronto na UI).
3. Aluna abre `/invite/<token>`, vê a marca, preenche nome+email → recebe magic link.
4. Aluna clica no email → cai em `/auth/callback?code=…&invite=…&name=…`.
5. Callback troca o code por sessão + chama RPC `consume_invite` que atomicamente trava o invite, cria o profile (role=student) e marca `used_at`.
6. Aluna pousa em `/welcome`.

Erros do RPC (`P0002` not found, `P0003` already used, `P0004` expired) viram redirect pra `/invite/<token>?error=…` com mensagem visível.

## Deploy

A definir na Fase 4 (Vercel + Cloudflare DNS + domínio `app.judsonlobato.com.br`).
