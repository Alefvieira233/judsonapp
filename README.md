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

## Login recorrente

- **Personal** (Judson): `/login` com email + senha
- **Aluna**: `/aluna/entrar` com email só (magic link). `shouldCreateUser:false` — só quem já tem profile (foi convidada uma vez) consegue entrar; novas alunas precisam de invite

## Deploy de produção

### Pré-requisitos

- Repo no GitHub (já existe: `Alefvieira233/judsonapp`)
- Conta Vercel (free tier serve)
- Domínio registrado — `judsonlobato.com.br` ou similar (Registro.br ~R$40/ano)
- Cloudflare account (free tier serve)

### Passos

**1. Vercel — conectar repo**
1. https://vercel.com/new → Import Git Repository → seleciona `Alefvieira233/judsonapp`
2. Framework: **Next.js** (auto-detect)
3. Root directory: `./`
4. Build command e output: defaults (`next build`, `.next`)

**2. Vercel — env vars**
Em Settings → Environment Variables, adicionar (Production + Preview):
```
NEXT_PUBLIC_SUPABASE_URL=https://ymepyisibjraxtrnxpwc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<copiar de .env.local>
SUPABASE_SERVICE_ROLE_KEY=<copiar de .env.local>
```
⚠ `SUPABASE_SERVICE_ROLE_KEY` é **secret** — confere que tá marcada como sensitive e que NÃO é `NEXT_PUBLIC_`.

**3. Deploy inicial**
- Push pra `main` ou click em "Deploy" no Vercel
- Vai gerar URL tipo `judsonapp-abc.vercel.app` — testa rápido (login, /home, etc)

**4. Domínio custom**
1. Vercel → Settings → Domains → Add → `app.judsonlobato.com.br`
2. Vercel mostra um CNAME de target — copia
3. Cloudflare → DNS → Add Record:
   - Type: `CNAME`
   - Name: `app`
   - Target: o que Vercel deu
   - Proxy: **DNS only** (cinza, não laranja — Vercel já tem CDN)
4. Espera 1-5min DNS propagar
5. Vercel marca o domínio como **Valid Configuration** automaticamente

**5. Atualizar Supabase pra prod**
Em Supabase → **Authentication → URL Configuration**:
- Site URL: `https://app.judsonlobato.com.br`
- Redirect URLs allowlist: adicionar `https://app.judsonlobato.com.br/auth/callback` (mantém o de localhost também pra dev)

**6. Smoke test em produção**
- Abre `https://app.judsonlobato.com.br/login`
- Loga como Judson
- Cria invite pra um email teste
- Confere que o magic link no email aponta pra domínio de produção

**7. Health check**
- `https://app.judsonlobato.com.br/api/health` deve retornar `{"status":"ok"}`
- Configurar UptimeRobot (free) pra pingar a cada 5min

### Pós-deploy

- HSTS preload já tá ativo via `next.config.ts`
- Service worker registra automaticamente em produção (`pwa-register.tsx`)
- Splash screens iOS funcionam em PWA instalada (Safari ≥ 16.4)

## Comandos úteis

```bash
npm run dev              # dev (Turbopack default; --webpack se travar no Windows)
npm run dev -- --webpack # dev com webpack legado (mais estável no Windows com slow disk)
npm run build            # build de produção
npm start                # rodar build localmente (testa SW)
npm run lint
npm run icons            # regenera ícones PWA + splash screens
```

