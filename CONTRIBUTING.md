# Contribuindo — Judson App

Guia pra você (ou alguém novo) abrir o repo amanhã e mexer com confiança.

## Setup local

1. **Pré-requisitos**: Node 20+, npm 10+, git. No Windows, Powershell ou WSL — ambos funcionam, mas o dev script tem um quirk com Turbopack (passo 4).

2. **Clonar**:
   ```bash
   git clone https://github.com/Alefvieira233/judsonapp.git
   cd judsonapp
   npm install
   ```

3. **Env vars**: `cp .env.example .env.local`. Mínimo: 3 chaves Supabase. Resto degrada (ver `.env.example` pros comentários).

4. **Rodar**:
   ```bash
   npm run dev                  # Turbopack default
   # No Windows com Sentry: Turbopack pode travar — use:
   npm run dev -- --webpack
   ```

5. **Bootstrap**: criar usuário do owner em **Supabase → Auth → Users**. Primeiro login em `/login` cria o profile com `role=owner` automático via `lib/auth.ts`.

6. **Testes**:
   ```bash
   npm run test                 # vitest unit
   npm run e2e                  # playwright (sobe dev sozinho)
   ```

## Stack (versões pinned)

| Camada | Pacote | Versão |
|---|---|---|
| Framework | `next` | `16.2.5` |
| UI | `react` / `react-dom` | `19.2.4` |
| Type system | `typescript` | `^5` |
| Styling | `tailwindcss` + `@tailwindcss/postcss` | `^4` |
| Auth + DB | `@supabase/supabase-js` + `@supabase/ssr` | `^2.105.3` / `^0.10.2` |
| Validation | `zod` | `^4.4.3` |
| Motion | `framer-motion` | `^12.38.0` |
| i18n | `next-intl` | `^4.11.0` |
| Rate limit | `@upstash/ratelimit` + `@upstash/redis` | `^2.0.5` / `^1.36.0` |
| Observability | `@sentry/nextjs` | `^10.52.0` |
| Push | `web-push` | `^3.6.7` |
| Testing | `vitest` + `@playwright/test` | `^4.1.5` / `^1.59.1` |

## Convenções de código

### TypeScript
- **Estrito**. Zero `any`, `@ts-ignore`, ou `TODO` no main. Se precisar de escape hatch, use `unknown` + narrowing.
- `import "server-only"` no topo de toda lib que toca service role / segredos.
- `z.string().uuid()` em qualquer route param antes de interpolar em query.

### Server Actions
Padrão obrigatório (defesa em profundidade):

```ts
"use server";
import "server-only";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getCurrentProfile } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase/server";
import { log } from "@/lib/logger";

const Schema = z.object({ id: z.string().uuid(), name: z.string().min(1).max(80) });

export async function updateThing(input: unknown) {
  const session = await getCurrentProfile();
  if (session.profile.role !== "owner") throw new Error("forbidden");

  const parsed = Schema.parse(input);

  const supabase = await createServerClient();
  const { error } = await supabase
    .from("things")
    .update({ name: parsed.name })
    .eq("id", parsed.id)
    .eq("tenant_id", session.tenant.id);  // defesa em profundidade

  if (error) {
    log.error("things.update failed", { id: parsed.id, error: error.message });
    throw error;
  }

  revalidatePath("/dashboard");
}
```

Os 5 elementos obrigatórios:
1. `getCurrentProfile()` retorna sessão + role + tenant.
2. **Role check** explícito (`owner` / `student`).
3. **Zod parse** antes de qualquer fetch.
4. `.eq("tenant_id", session.tenant.id)` mesmo com RLS — defesa em profundidade contra regressão futura.
5. `log.error()` em falha, `revalidatePath()` em sucesso.

### React / hooks
- **Não** use `setState` em `useEffect` simples — gera double-render e race conditions. Prefira:
  - Server action wrapper (`useActionState` / `<form action={...}>`)
  - `useSyncExternalStore` pra subscriptions
  - `use()` pra promises
- **Não** comente o óbvio. Comentários só pra explicar **por que**, nunca **o que**.
- Touch target mínimo **44pt** em qualquer interativo (mobile-first).

### Estilo
- Brand color: **`#DC2626`** (red-600).
- Display font: **Bebas Neue** (`var(--font-bebas)`).
- Body font: **Inter** (`var(--font-inter)`).
- **Dark-only**. Sem light mode toggle pro cliente-zero.
- Componentes primitivos em `src/components/ui/` (Button, Card, Sheet, Dialog, etc — base shadcn-style).

## Como adicionar uma rota nova

1. Decidir o route group:
   - Owner-only? → `src/app/(trainer)/<slug>/`
   - Aluna-only? → `src/app/(student)/<slug>/`
   - Ambos? → `src/app/(shared)/<slug>/`
   - Pública? → raiz `src/app/<slug>/`
2. Criar `page.tsx` (Server Component default), `loading.tsx` (skeleton), `actions.ts` (server actions).
3. Se a rota tem `[id]`, validar com `z.string().uuid()` no top do `page.tsx`:
   ```ts
   const Params = z.object({ id: z.string().uuid() });
   export default async function Page({ params }: { params: Promise<{ id: string }> }) {
     const { id } = Params.parse(await params);
     // ...
   }
   ```
4. Adicionar link no nav apropriado (`src/app/(trainer)/_nav/` ou `src/app/(student)/_nav/`).

## Como adicionar uma migration nova

1. **Sequencial**: numerar como `00<N+1>_<descricao>.sql` (e.g. `0024_<...>.sql`). Nunca reusar número.
2. Header de 3 linhas comentando **o quê** e **por quê**.
3. Aplicar via MCP Supabase:
   ```
   mcp__claude_ai_Supabase__apply_migration
     project_id: ymepyisibjraxtrnxpwc
     name: 0024_<descricao>
     query: <conteúdo do .sql>
   ```
4. Regenerar types:
   ```
   mcp__claude_ai_Supabase__generate_typescript_types
   ```
   E colar em `src/types/database.ts` (esse arquivo é **gerado** — não edita à mão).
5. **Não retroativa**: nunca edite uma migration já aplicada. Crie uma nova.

## Como adicionar um teste

Ver **[TESTING.md](./TESTING.md)** pro fluxo completo. Resumo:

- **Unit (vitest)**: `src/lib/<name>/__tests__/<name>.test.ts`. Sem rede, sem DB. Mock Supabase via `vi.mock` (use `vi.hoisted` se precisa referenciar locals).
- **E2E (playwright)**: `e2e/<flow>.spec.ts`. Sobe dev server sozinho via `playwright.config.ts`. `test.skip(condition, "razão")` quando depende de env.

Foco unit: lógica pura (formula, parser, transformer). E2E: rotas que renderizam sem auth (landing, legal, login forms).

## Como adicionar uma string i18n

`messages/pt-BR.json` é o **canon**. `messages/es.json` precisa de paridade — sem chave faltando, sem chave a mais. Estrutura:

```json
{
  "namespace.subarea": {
    "key": "Texto"
  }
}
```

Uso no componente:
```ts
import { useTranslations } from "next-intl";

const t = useTranslations("namespace.subarea");
return <h1>{t("key")}</h1>;
```

Ao adicionar:
1. Adiciona em `pt-BR.json` primeiro.
2. Traduz em `es.json` (placeholder em PT se não souber — TODO no commit dizendo "traduzir").
3. Verificar que ambos têm a mesma quantidade de chaves: `wc -l messages/*.json`.

## Como adicionar um badge novo

1. **Catálogo** em `src/lib/badges.ts` — adicionar entry no `BADGE_CATALOG` const com `key`, `name`, `description`, `icon`, `tier`.
2. **Lógica de unlock** dentro do `evaluateBadges()` switch. Idempotente (insert ignora se `(user_id, badge_key)` já existe — UNIQUE constraint na 0015).
3. **Teste** em `src/lib/__tests__/badges.test.ts` — caso happy + idempotence (2x evaluate não duplica).
4. **Trigger**: chamar `evaluateBadges(supabase, userId, tenantId)` em qualquer lugar que muda estado relevante (workout completed, milestone hit, etc).

## Como adicionar um chart

1. Componente em `src/components/charts/<name>.tsx`. Charts atuais: `bar-chart`, `donut-chart`, `line-chart`, `sparkline`.
2. Default export client component (`"use client"` no topo).
3. Props bem tipadas — `data`, `width`, `height`, `color` (default `#DC2626`).
4. Sem libs externas pesadas (sem Recharts, sem Chart.js) — preferimos SVG manual (são <100 linhas cada).
5. Reexport em `src/components/charts/index.ts`.
6. Teste de render em `src/components/charts/__tests__/charts.test.tsx`.

## Pull Request

- Branch: `feat/<slug>` ou `fix/<slug>`.
- Commit message: estilo dos commits do repo — `feat: Onda X — <descrição>` ou `fix: <descrição>`.
- Antes de abrir PR: `npm run lint` + `npm run test`.
- Não commitar `.env.local`, `.next/`, `node_modules/`. Já estão em `.gitignore`.
- `src/types/database.ts` é gerado — só commitar quando regenerou intencionalmente.
