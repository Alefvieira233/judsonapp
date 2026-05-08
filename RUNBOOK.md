# Runbook operacional — Judson App

Manual passo-a-passo pra ativar cada integração externa em produção. Cada seção termina com checklist `- [ ]` pra você marcar conforme conclui.

Todas as env vars vão em **Vercel → Project → Settings → Environment Variables** (Production + Preview, exceto se notado).

---

## 1. Ativar Asaas (cobrança da aluna)

Asaas é o gateway brasileiro pra Pix/cartão/boleto. **Sem `ASAAS_API_KEY`, o fluxo cai pra cobrança manual via WhatsApp** (sem mudança de código).

### Passos

1. Criar conta em https://www.asaas.com → modo **Sandbox** primeiro pra testar.
2. Painel Asaas → **Configurações → Integrações → API** → gerar API Key.
3. Definir um secret forte pro webhook:
   ```bash
   openssl rand -hex 32
   ```
4. Setar env vars na Vercel:
   ```
   ASAAS_API_KEY=<api key do passo 2>
   ASAAS_BASE_URL=https://sandbox.asaas.com/api/v3   # prod: https://api.asaas.com/v3
   ASAAS_WEBHOOK_SECRET=<secret do passo 3>
   ```
5. Painel Asaas → **Integrações → Webhooks** → adicionar:
   - URL: `https://app.judsonlobato.com.br/api/webhooks/asaas`
   - Token: o **mesmo** valor de `ASAAS_WEBHOOK_SECRET`
   - Eventos a marcar: `PAYMENT_CONFIRMED`, `PAYMENT_RECEIVED`, `PAYMENT_OVERDUE`, `PAYMENT_DELETED`, `PAYMENT_REFUNDED`, `PAYMENT_REFUND_DENIED`, `SUBSCRIPTION_CREATED`, `SUBSCRIPTION_UPDATED`, `SUBSCRIPTION_DELETED`.
6. Validar: criar subscription teste pelo painel `/students/[id]` → confirmar webhook chegou em `Vercel Logs` filtrando por `scope=asaas-webhook`.
7. Sair do sandbox: trocar `ASAAS_BASE_URL` pra `https://api.asaas.com/v3` e `ASAAS_API_KEY` pela key de produção.

### Checklist

- [ ] Conta Asaas criada
- [ ] API Key sandbox gerada
- [ ] Webhook secret gerado (`openssl rand -hex 32`)
- [ ] 3 env vars na Vercel
- [ ] Webhook cadastrado no painel Asaas com 9 eventos
- [ ] Teste end-to-end no sandbox passou
- [ ] Migrado pra produção

---

## 2. Ativar Stripe (cobrança do PERSONAL — SaaS multi-tenant)

Stripe cobra o **personal** pelo uso do app (R$79/Starter, R$149/Pro). **Não confunde com Asaas, que cobra a aluna.** Sem `STRIPE_SECRET_KEY`, o signup self-serve cai pro modo "trial gratuito".

### Passos

1. Criar conta em https://stripe.com → modo **Test** primeiro.
2. **Products** → criar **"Judson App Starter"** com 1 Price recorring BRL R$79/mês. Copiar `price_xxx`.
3. **Products** → criar **"Judson App Pro"** com 1 Price recorring BRL R$149/mês. Copiar `price_xxx`.
4. **Developers → API Keys** → copiar `sk_test_...` (mais tarde, `sk_live_...`).
5. **Developers → Webhooks** → Add endpoint:
   - URL: `https://app.judsonlobato.com.br/api/webhooks/stripe`
   - Eventos: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`.
   - Após criar, revelar **Signing secret** (`whsec_...`) e copiar.
6. Setar env vars na Vercel:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_PRICE_STARTER=price_...   # do passo 2
   STRIPE_PRICE_PRO=price_...        # do passo 3
   NEXT_PUBLIC_SITE_URL=https://app.judsonlobato.com.br
   ```
7. Habilitar **Customer Portal** em https://dashboard.stripe.com/test/settings/billing/portal — permitir update payment method, cancel subscription, view invoice history.
8. Testar: `/criar-conta-personal` → Starter → checkout com cartão `4242 4242 4242 4242`.
9. Produção: trocar todas as 4 chaves pelas `live_`/`prod_` correspondentes.

### Checklist

- [ ] Conta Stripe criada
- [ ] Product Starter + Price BRL R$79/mês
- [ ] Product Pro + Price BRL R$149/mês
- [ ] Webhook endpoint criado com 6 eventos
- [ ] Signing secret copiado
- [ ] 5 env vars na Vercel
- [ ] Customer Portal habilitado
- [ ] Smoke test no modo test passou
- [ ] Migrado pra produção (`sk_live_`)

---

## 3. Ativar Sentry

Sem `SENTRY_DSN`, init é no-op. O logger (`src/lib/logger.ts`) auto-encaminha warn+error pro Sentry quando DSN tá presente.

### Passos

1. Criar projeto em https://sentry.io/ → tipo **Next.js**.
2. Copiar **DSN** (`https://xxx@oXXX.ingest.us.sentry.io/XXX`).
3. **Settings → Auth Tokens** → Create Token com escopo `project:write` (pra source-map upload).
4. Setar env vars na Vercel:
   ```
   NEXT_PUBLIC_SENTRY_DSN=<dsn>
   SENTRY_DSN=<mesmo dsn>
   SENTRY_AUTH_TOKEN=<token do passo 3>
   SENTRY_ORG=<slug da org>
   SENTRY_PROJECT=<slug do projeto>
   ```
5. Redeploy → verificar build logs por `Successfully uploaded source maps`.
6. Forçar erro de teste: `throw` numa server action e confirmar no Sentry.

### Checklist

- [ ] Projeto Sentry criado
- [ ] DSN copiado
- [ ] Auth token gerado
- [ ] 5 env vars na Vercel
- [ ] Source maps subindo no build
- [ ] Erro de teste apareceu no Sentry

---

## 4. Ativar Upstash Redis (rate-limit em produção)

Sem isso, `src/lib/rate-limit.ts` cai num bucket em memória que reseta a cada cold start (ineficaz em serverless).

### Passos

1. Criar conta em https://upstash.com (free tier serve).
2. **Redis → Create Database** → região `us-east-1` ou `sa-east-1` (BR mais próximo). **Tipo: Regional** (não Global, mais barato).
3. Após criar, ir na aba **REST API** → copiar `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN`.
4. Setar na Vercel:
   ```
   UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
   UPSTASH_REDIS_REST_TOKEN=...
   ```
5. Redeploy. Verificar logs: deve aparecer `rate-limit: using upstash` em vez de `using memory`.

### Checklist

- [ ] Conta Upstash criada
- [ ] Database Redis criado
- [ ] 2 env vars na Vercel
- [ ] Logs confirmam upstash em uso

---

## 5. Gerar VAPID keys + Push notifications

Web Push usa VAPID auth — **sem Firebase**. A mesma chave pública vai em 2 envs (server + browser).

### Passos

1. Localmente:
   ```bash
   npx web-push generate-vapid-keys
   ```
2. Copiar **Public Key** e **Private Key**.
3. Setar na Vercel:
   ```
   VAPID_SUBJECT=mailto:contato@judsonlobato.com.br
   VAPID_PUBLIC_KEY=<public do passo 2>
   VAPID_PRIVATE_KEY=<private do passo 2>
   NEXT_PUBLIC_VAPID_PUBLIC_KEY=<MESMA public key>
   ```
   ⚠ `NEXT_PUBLIC_VAPID_PUBLIC_KEY` é o **mesmo valor** da `VAPID_PUBLIC_KEY` — exposto ao browser pro SW poder se inscrever.
4. Redeploy.
5. Aluna abre PWA → vê banner "Receber lembretes" (`<PushOptIn>`) → confirma → fica em `push_subscriptions`.
6. Testar: trigger manual de `/api/cron/training-reminder` (passo 9 abaixo).

### Checklist

- [ ] VAPID keys geradas
- [ ] 4 env vars na Vercel (com a public key duplicada)
- [ ] Aluna teste assinou push
- [ ] Notificação chegou no celular

---

## 6. CRON_SECRET (autoriza Vercel Cron)

Os 3 endpoints `/api/cron/*` exigem header `Authorization: Bearer ${CRON_SECRET}`. Vercel Cron envia automaticamente quando a env var existe.

### Passos

1. Gerar:
   ```bash
   openssl rand -hex 32
   ```
2. Vercel → Project Settings → Environment Variables:
   ```
   CRON_SECRET=<saída do passo 1>
   ```
3. Redeploy.
4. Vercel Cron já está configurado em `vercel.json`:
   - `0 12 * * *` → `/api/cron/training-reminder` (lembrete às 9h BRT)
   - `0 17 * * *` → `/api/cron/inactive-reminder` (alunas inativas, 14h BRT)
   - `0 4 * * *` → `/api/cron/strength-snapshot` (snapshot diário, 1h BRT)
5. Verificar Vercel → **Cron Jobs** tab que estão rodando.

### Checklist

- [ ] `CRON_SECRET` gerado e setado
- [ ] 3 crons aparecem em Vercel → Cron Jobs
- [ ] Próxima execução teve 200 OK

---

## 7. Habilitar HaveIBeenPwned no Supabase

Bloqueia senhas vazadas em logins do owner. Toggle GUI, sem env var.

### Passos

1. Supabase Dashboard → **Authentication → Settings → Password Strength**.
2. Toggle **"Check for breached passwords"** ON.
3. (Opcional) Bumpar `Minimum password length` pra 12.
4. Salvar.

### Checklist

- [ ] Toggle HIBP ativado
- [ ] Tentativa de login com senha vazada (`123456`) é bloqueada

---

## 8. Multi-tenant signup — ativar SaaS público

Sai do modo cliente-zero e libera signup público de personais.

### Passos

1. **DNS wildcard** — registrar na Cloudflare:
   - Type: `CNAME`
   - Name: `*`
   - Target: `cname.vercel-dns.com` (ou o que Vercel der pro domínio principal)
   - Proxy: **DNS only**
2. **Vercel → Domains** → adicionar `*.judsonapp.com.br` (wildcard domain).
3. **Env vars** na Vercel:
   ```
   MULTI_TENANT_ENABLED=true
   ```
4. Redeploy. Landing pública em `/` agora vira pitch SaaS; `/criar-conta-personal` fica disponível.
5. Cada novo personal que se cadastrar vira um row em `tenants` com `slug` único; resolve via `resolve_tenant_by_host()` (migration 0019).

### Checklist

- [ ] DNS wildcard `*` configurado
- [ ] Wildcard domain adicionado na Vercel
- [ ] `MULTI_TENANT_ENABLED=true`
- [ ] Tenant teste cria → `<slug>.judsonapp.com.br` resolve

---

## 9. Custom domain pra um tenant específico

Quando um personal quer `app.personaldoseucliente.com.br` em vez de `slug.judsonapp.com.br`.

### Passos

1. Personal compra domínio (Registro.br ou Cloudflare Registrar).
2. Personal cria CNAME `app` apontando pra `cname.vercel-dns.com`.
3. Você (admin) executa SQL no Supabase:
   ```sql
   update tenants
      set custom_domain = 'app.personaldoseucliente.com.br'
    where slug = 'personalslug';
   ```
4. Vercel → Domains → adicionar o domínio custom (Vercel emite cert SSL via Let's Encrypt).
5. Verificar resolução:
   ```bash
   curl -I https://app.personaldoseucliente.com.br/api/health
   ```
   Espera `HTTP/2 200` + body `{"status":"ok"}` + tenant resolvido.
6. `resolve_tenant_by_host()` (0019) faz match contra `custom_domain` antes de tentar subdomain.

### Checklist

- [ ] CNAME do cliente apontando pra Vercel
- [ ] `tenants.custom_domain` atualizado
- [ ] Domínio adicionado na Vercel
- [ ] Cert SSL emitido (~1min)
- [ ] `/api/health` resolve no tenant correto

---

## 10. Crons ativos

Configurados em `vercel.json`. Todos exigem `CRON_SECRET` (passo 6).

| Schedule (UTC) | Path | O que faz |
|---|---|---|
| `0 12 * * *` | `/api/cron/training-reminder` | Push pra alunas com treino agendado hoje (9h BRT) |
| `0 17 * * *` | `/api/cron/inactive-reminder` | Push pra alunas sem treino há 5+ dias (14h BRT) |
| `0 4 * * *` | `/api/cron/strength-snapshot` | Salva `strength_snapshots` por aluna+grupo (1h BRT) |

Pra trigger manual em dev:
```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  http://localhost:3000/api/cron/training-reminder
```

### Checklist

- [ ] Vercel → Cron Jobs lista os 3
- [ ] Logs mostram execução diária
- [ ] Notificação chegou pra aluna teste

---

## Resumo das env vars

| Variável | Required? | Onde aparece |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Sim | client + server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sim | client + server |
| `SUPABASE_SERVICE_ROLE_KEY` | Sim | server only — **NUNCA** prefixar `NEXT_PUBLIC_` |
| `NEXT_PUBLIC_SITE_URL` | Recomendado | redirects de checkout/portal |
| `ASAAS_API_KEY` | Opcional | sem ela: cobrança manual |
| `ASAAS_BASE_URL` | Opcional | default sandbox |
| `ASAAS_WEBHOOK_SECRET` | Opcional | obrigatório se Asaas ativo |
| `STRIPE_SECRET_KEY` | Opcional | sem ela: trial gratuito |
| `STRIPE_WEBHOOK_SECRET` | Opcional | obrigatório se Stripe ativo |
| `STRIPE_PRICE_STARTER` / `_PRO` | Opcional | obrigatório se Stripe ativo |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | Recomendado | rate-limit prod |
| `NEXT_PUBLIC_SENTRY_DSN` / `SENTRY_DSN` | Opcional | observabilidade |
| `SENTRY_AUTH_TOKEN` / `_ORG` / `_PROJECT` | Opcional | source-map upload |
| `VAPID_PUBLIC_KEY` / `_PRIVATE_KEY` | Opcional | push notifications |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Opcional | mesma `VAPID_PUBLIC_KEY` |
| `VAPID_SUBJECT` | Opcional | `mailto:` do contato |
| `CRON_SECRET` | Sim se usa cron | autoriza `/api/cron/*` |
| `MULTI_TENANT_ENABLED` | Opcional | `true` pra abrir SaaS |
