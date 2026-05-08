<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version (16.2.5) has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

Notable departures: middleware is `src/proxy.ts` (not `src/middleware.ts`); `params` and `searchParams` are async (`Promise<...>`); `cookies()`/`headers()` are async; route handlers use `NextRequest`/`Response` from `next/server`.
<!-- END:nextjs-agent-rules -->

# Convenções obrigatórias

Detalhes em **CONTRIBUTING.md**. Resumo do que NÃO é negociável:

- **Zero `any` / `@ts-ignore` / `TODO`** no código que vai pra main.
- **`import "server-only"`** no topo de toda lib que toca service role / segredos.
- **Server Actions** seguem o padrão de 5 elementos: `getCurrentProfile()` → role check → `Zod.parse()` → query com `.eq("tenant_id", session.tenant.id)` (defesa em profundidade) → `revalidatePath` em sucesso, `log.error` em falha.
- **`z.string().uuid()`** em todo route param antes de interpolar em query.
- **Sem `setState` em `useEffect`** simples — use server action wrapper, `useSyncExternalStore`, ou `use()`.
- **Touch target 44pt+** em qualquer interativo (mobile-first).
- **Sem comentários óbvios** — comentário só pra explicar **por quê**, nunca **o quê**.
- **Brand**: `#DC2626` (red-600), Bebas Neue display, Inter body, dark-only.

# Quando NÃO mexer

- **`supabase/migrations/*.sql` já aplicadas** — nunca editar retroativamente. Criar nova migration `00<N+1>_*.sql`.
- **`src/types/database.ts`** — arquivo **gerado** via `mcp__claude_ai_Supabase__generate_typescript_types`. Não editar à mão.
- **`public/sw.js`** — service worker tem cuidado deliberado com cache de HTML autenticado (CRIT-2 fix). Mexer aqui sem ler `.analysis/04-security-lgpd.md` é receita pra vazar dados.
- **`src/proxy.ts`** — CSP nonced, request-id, e Supabase session. Mudança aqui afeta toda request — testar local antes.
- **`messages/pt-BR.json` e `messages/es.json`** — paridade obrigatória de chaves. PT-BR é canônico; ES segue.
- **`design.md/`** — pasta ignorada. Não mexer.

# Onde encontrar o quê

| Quero... | Olho em |
|---|---|
| Lib server (Supabase, auth, billing, push) | `src/lib/` |
| Primitive UI (Button, Card, Sheet) | `src/components/ui/` |
| Charts (bar, donut, line, sparkline) | `src/components/charts/` |
| Logger estruturado (Sentry-aware) | `src/lib/logger.ts` |
| Rate limiter (Upstash + memory fallback) | `src/lib/rate-limit.ts` |
| Stripe SDK + helpers | `src/lib/stripe.ts` |
| Asaas SDK + helpers | `src/lib/asaas.ts` |
| Push (VAPID) | `src/lib/push.ts` |
| Strength score formula | `src/lib/strength-score.ts` |
| Catálogo de badges | `src/lib/badges.ts` |
| Resolução de tenant (host → tenant_id) | `src/lib/tenant.ts` |
| Routing groups (auth/trainer/student) | `src/app/(*)/` |
| Webhooks (Asaas, Stripe) | `src/app/api/webhooks/` |
| Crons (training-reminder, etc) | `src/app/api/cron/` |
| OG image dinâmica do story | `src/app/api/og/story/` |
| i18n config | `src/i18n/routing.ts` + `src/i18n/request.ts` |
| Migrations versionadas | `supabase/migrations/` |
| Testes unit | `src/lib/__tests__/` + `src/components/charts/__tests__/` |
| E2E (Playwright) | `e2e/` |
| Análise técnica completa | `.analysis/ANALISE-PROJETO.md` (+ 5 sub-arquivos) |
| Estado pós-implementação | `.analysis/STATUS-FINAL.md` |
| Runbook operacional | `RUNBOOK.md` |
