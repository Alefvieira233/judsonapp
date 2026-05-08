# Análise técnica — Judson App

**Data:** 2026-05-07
**Escopo:** stack, arquitetura, build/perf, qualidade de código, dívida técnica e observabilidade.
**Branch analisada:** `main` (último commit `ada5eaa`).
**Ignorado:** `design.md/`, `node_modules/`, `.next/`, `.git/`.

---

## TL;DR — Notas por área

| Área | Nota | 1-linha |
|---|---|---|
| 1. Stack & dependências | **6.0/10** | Bases certas, mas `lucide-react@1.14.0` é versão errada (deveria ser >=0.300.x), `framer-motion` e `@base-ui/react` declarados e nunca importados — overhead de install e potencial confusão. |
| 2. Arquitetura | **8.0/10** | Route groups bem desenhados, RSC-first sólido, RLS multi-tenant honesto. Falta `proxy.ts` cobrindo redirect role-based, falta runtime explícito, falta data layer (`server-only`). |
| 3. Build & performance | **5.5/10** | `next.config.ts` quase vazio — sem `images`, sem `experimental.optimizePackageImports`, sem `cacheComponents`, sem CSP. Sem `<Image>` em quase nada. SW custom em vez de Workbox. |
| 4. Qualidade de código | **7.5/10** | TS strict, sem `any`, sem `@ts-ignore`, sem TODOs. Padrão de erro consistente. Falha: zero testes, zero `server-only`, helpers `startOfDay/computeStreak/timeAgo` duplicados em 3+ páginas. |
| 5. Dívida técnica | **6.5/10** | Pouca dívida explícita, mas comentários "MVP scale" indicando atalhos conscientes (rate-limit em memória, replace-strategy em workout_items, types regenerados). |
| 6. Observabilidade | **3.5/10** | `console.error` espalhado, sem Sentry, sem Vercel Analytics, sem Speed Insights, `/api/health` é raso. Para "melhor app do Brasil" isso é lacuna grande. |

**Nota global ponderada: 6.2/10** — fundação sólida pra MVP, mas longe do "alto nível técnico" que o dono quer.

---

## 1. Stack & dependências (6.0/10)

### 1.1 Versões em uso (`package.json`)

```
next            16.2.5     ✓ atual (16.x é a linha vigente)
react           19.2.4     ✓ atual
react-dom       19.2.4     ✓ atual
@supabase/ssr   0.10.2     ✓ atual
@supabase/supabase-js  2.105.3  ✓ atual
@tailwindcss/postcss  ^4   ✓ atual (Tailwind 4)
typescript      ^5         ✓ atual
zod             4.4.3      ✓ atual (v4 mudou bastante; ok)
sonner          2.0.7      ✓ atual
next-themes     0.4.6      ✓ atual mas ver nota abaixo
shadcn          4.7.0      ✓ recente
sharp           0.34.5     ✓ atual
```

Tudo no estado da arte. Próximas três precisam atenção:

### 1.2 Problemas críticos de dependência

#### 🔴 `lucide-react@^1.14.0` é a versão ERRADA
Linha `package.json:24`. Lucide React jamais teve versão `1.x` — a linha estável é `0.x` (atualmente `0.460+`). O que `npm install` resolveu foi um pacote homônimo ou uma versão fork muito antiga. Confirmado em `node_modules/lucide-react/package.json` (`"version": "1.14.0"`). Isso significa:

- Você está pegando ícones de ~2020/2021. Componentes novos (`SparklesIcon`, `GiftIcon`, etc. usados em `src/app/(student)/home/page.tsx`) podem estar funcionando por coincidência (se o pacote tem nomes parecidos), mas há risco de:
  - Ícones com bugs ou aparência inconsistente.
  - Falta de `aria-hidden` por default em versões recentes.
  - Tamanho de bundle inflado (lucide moderno é tree-shakeable de fábrica).
- `eslint-config-next` 16.2.5 marca `lucide-react` na lista oficial de pacotes auto-otimizados pelo `experimental.optimizePackageImports` ([next docs/01-app/03-api-reference/05-config/01-next-config-js/optimizePackageImports.md:23]). Você está perdendo essa otimização.

**Ação:** trocar pra `lucide-react@^0.460.0` (ou a release atual no momento do upgrade). Esforço: S. Risco: M (precisa testar todos os ícones renderizados — você usa em ~42 arquivos).

#### 🔴 `framer-motion@^12.38.0` declarada mas nunca importada
Grep `from "framer-motion"` em `src/` retorna **zero matches**. A dependência está pesando ~70KB gzipped no install (tipos + esm), zero bytes em runtime porque o tree-shaker remove. Mas:
- Confunde quem lê `package.json` (sugere que existem animações framer-motion).
- Memória do projeto inclui "Framer Motion" como parte da identidade.

**Ação:** ou remove com `npm uninstall framer-motion`, ou começa a usar de fato (animações de transição entre estados do `WorkoutRunner`, micro-interações no `dashboard`, lista de comments otimista no feed). Esforço: S (pra remover) / M (pra usar).

#### 🔴 `@base-ui/react@^1.4.1` declarada mas nunca importada
Mesma coisa. Zero imports em `src/`. Duas hipóteses:
- A) `components.json` aponta `style: "base-nova"` (linha 3) — o template `shadcn add` baseado em Base UI talvez peça essa dep, mas seus componentes em `src/components/ui/*` foram gerados sem usá-la (são markup nativo + class-variance-authority).
- B) Estava planejado integrar Base UI pro `Sheet` / `Dialog` mas nunca foi feito — atualmente seu `Sheet` é custom (`src/components/ui/sheet.tsx`), não vem do shadcn-base-nova.

**Ação:** decidir: ou adota Base UI (componentes a11y de qualidade) e troca o `Sheet`, `Dialog`, `Select`, `Tabs`, `DropdownMenu` pelos primitives do `@base-ui/react`, ou remove a dep. Esforço: S (remover) / L (migrar). Recomendação: **migrar pra Base UI** — os componentes dele são o que tem de melhor em a11y atualmente, e seu Sheet custom não tem focus trap robusto.

### 1.3 Bibliotecas que carregam peso real

- `canvas-confetti` (`^1.9.4`) — usado só em `src/app/(student)/treinos/[id]/runner.tsx:6` no fim do treino. Tem ~10KB. OK pelo deleite, mas considera lazy import (`const confetti = (await import("canvas-confetti")).default`) pra tirar do bundle inicial do runner.
- `@dnd-kit/*` (3 pacotes, ~50KB gz) — usado APENAS em `src/app/(trainer)/workouts/[id]/builder.tsx:13-21`. Por ser a página mais pesada do trainer-side, isso é aceitável, MAS o builder.tsx é um Client Component de 519 linhas que carrega tudo de uma vez. Fragmentar em sub-componentes lazy ajudaria.
- `tw-animate-css` — não vi uso direto, parece ser via CSS. Verifica se realmente está sendo aplicado (`globals.css:2` importa).

### 1.4 O que falta na stack

Para um app que se quer "o melhor do Brasil":

- **Sentry / PostHog / Vercel Analytics** — zero instrumentação client/server (ver §6).
- **`server-only`** package — não há proteção contra import acidental de código server num Client Component (ver §4).
- **`zod` v4 + `@hookform/resolvers`** — você usa Zod no server actions, mas no client (`student-list`, `runner`) faz validação manual com `replace(/[^0-9.,]/g, ...)`. Um schema compartilhado seria mais robusto.
- **`@tanstack/react-query` ou nada formal** — para o `WorkoutRunner` com optimistic updates, você usa `useTransition` + estado local. OK, mas se o app crescer (mais ações otimistas, sincronização background), React Query reduziria o boilerplate significativamente.
- **`drizzle-orm` ou `kysely`** — opcional, mas você está acoplado ao client Supabase com strings SQL implícitas em todo lugar (`select("id, full_name, ...")`). Drizzle dá tipos compostos sem precisar do `.returns<...>()` em cada query.

---

## 2. Arquitetura (8.0/10)

### 2.1 Route groups — bem desenhados

```
src/app/
├── (auth)/login/        # Personal trainer (email + senha)
├── (trainer)/           # Painel do personal — protegido por layout.tsx
├── (student)/           # PWA da aluna — protegido por layout.tsx
├── aluna/entrar/        # Login recorrente da aluna (magic link)
├── invite/[token]/      # Landing pública do convite
├── auth/callback/       # Route Handler OTP exchange
├── welcome/             # Landing pós-callback
├── api/health/          # Health check
├── offline/             # Fallback do SW
├── privacidade/, termos/
├── error.tsx, not-found.tsx
└── page.tsx             # Landing do domínio raiz
```

**Pontos fortes:**
- Layouts de auth-guard centralizados em `src/app/(trainer)/layout.tsx:15-17` e `src/app/(student)/layout.tsx:14-17` — redirect rule clara.
- Separação `(trainer)` vs `(student)` com URLs em PT-BR pra aluna (`/treinos`, `/feed`, `/perfil`) e EN pro painel (`/students`, `/workouts`, `/community`) — ótimo branding/UX.
- Route Handler `src/app/auth/callback/route.ts` faz exchangeCodeForSession + RPC `consume_invite` numa transação clara, com mapping de SQLSTATE → mensagem.

**Pontos fracos:**
- `src/proxy.ts` (proxy/middleware do Next 16) só faz session refresh + auth-redirect (`src/lib/supabase/middleware.ts:36-58`). Não faz role-based redirect aqui — esse trabalho é repetido no layout de cada grupo. Seria mais barato (e mais correto pra evitar flash de UI) mover a checagem de role pro proxy. Ver Next 16 docs `01-app/01-getting-started/16-proxy.md`: "Proxy is _not_ intended for slow data fetching... but for optimistic checks such as permission-based redirects".
- Sem `app/global-error.tsx` — você tem `app/error.tsx` (`src/app/error.tsx:8`) mas isso só pega errors fora do root layout. `global-error.tsx` é a rede final pra erros que quebram o próprio layout. Next 16 production checklist (`02-guides/production-checklist.md:87-88`) menciona explicitamente: "Add `app/global-error.tsx` to provide consistent, accessible fallback UI". **Falta.**
- Sem `app/global-not-found.tsx` (também experimental no canary, mas estável em breve).
- Sem `loading.tsx` na raiz e em rotas como `/aluna/entrar`, `/invite/[token]`, `/welcome`. Loading só está nos route groups (`src/app/(trainer)/dashboard/loading.tsx`, etc.).

### 2.2 Server vs Client Components — bem aplicado

42 arquivos com `"use client"` (counted via grep). 14 arquivos com `"use server"`. A divisão é coerente:
- **Páginas** (`page.tsx`) são Server Components que fazem fetch via `createClient()` de `src/lib/supabase/server.ts`.
- **Forms e interatividade** vivem em `*-form.tsx`, `*-button.tsx`, `runner.tsx`, `builder.tsx` — todos Client Components.
- **Server actions** ficam em `actions.ts` por segmento (`src/app/(trainer)/students/actions.ts`, etc.) — padrão consistente.

**Coisa que está faltando:**
- **`server-only`** import nas funções `createClient()` / `createAdminClient()` (`src/lib/supabase/server.ts`) e em `src/lib/auth.ts`. Hoje, se um dev importar `createAdminClient` num Client Component por engano, o build não detecta — pode vazar a `SUPABASE_SERVICE_ROLE_KEY` pro bundle. **Isso é defesa em profundidade.** Esforço: S, impacto: alto.
- **Runtime explícito.** Suas server actions e page handlers não declaram `export const runtime`. Default é Node.js no Next 16, OK. Mas `/api/health` (`src/app/api/health/route.ts:5`) declara `dynamic = "force-dynamic"` mas não declara `runtime = "nodejs"` (precisa do supabase-js que usa Node APIs). Funcionar funciona, mas é melhor ser explícito pra não cair em "edge by accident" em uma versão futura.
- **`unstable_cache` / `cacheLife` / `cacheTag`** — zero uso. O dashboard do trainer (`src/app/(trainer)/dashboard/page.tsx:62-98`) faz 5 queries em paralelo a cada navegação. Se tiver 50 alunas e elas treinarem todo dia, isso bate o Postgres umas 100x/min. Você poderia: (a) cachear o agregado por 30s com tag `tenant:${id}` e invalidar via `revalidateTag` quando rola um `completeWorkoutAction`. Esforço: M, impacto: alto.

### 2.3 Server Actions e modelo de dados

Padrão muito consistente em todos os actions:
1. `getCurrentProfile()` ou `getCurrentStudent()` — auth.
2. Role check (`session.profile.role !== "owner"`).
3. `z.safeParse(...)` no input.
4. Operação Supabase com filtro `.eq("tenant_id", session.tenant.id)` (defesa-em-profundidade contra tenant hijack mesmo com RLS).
5. `revalidatePath(...)` nas rotas afetadas.
6. `console.error("[scope.action]", err)` em falha.

Isso é o padrão correto. Pequenos detalhes:

- `src/app/(trainer)/students/actions.ts:148-164` — `createReferralAction` usa `createAdminClient()` pra bypass RLS. Comentário diz "owner can read tenant via auth_role" mas o admin client está sendo usado aqui mesmo assim. Confuso. Se o owner pode (RLS já deveria liberar), por que admin client? Se for pra evitar uma UPDATE RLS que checa `referrer_id` e `referred_id` simultaneamente, vale comentar mais explicitamente. Caso contrário é um uso desnecessário de service role.
- `src/app/(trainer)/students/actions.ts:265-307` — `createStudentDirectAction` chama o REST admin do Supabase via `fetch` cru em vez de usar `admin.auth.admin.createUser()` do supabase-js. Funciona, mas é mais frágil (parsing manual de status code, hard-coded URL). O método admin do supabase-js já existe.

### 2.4 Schema Supabase + RLS — sólido

`supabase/migrations/0001_initial.sql` até `0009_plans_and_referrals.sql` — 9 migrations bem organizadas, comentadas, idempotentes onde precisa. Pontos fortes:
- Multi-tenant ready de fato: toda tabela carrega `tenant_id` (linhas 56, 73, 105, 134, 170, 184).
- RLS hardening em `0007_rls_hardening.sql` com helpers `auth_tenant_id()` / `auth_role()` SECURITY DEFINER + STABLE — boa decisão.
- `0008_profiles_self_read.sql` resolve o caso clássico de "policy circular dependency" durante login (comentado em detalhe linhas 1-13).
- `0004_consume_invite.sql` faz claim atômico do invite (`select ... for update`) — é o jeito certo, evita double-claim.

**Pontos a melhorar:**
- **Storage RLS pra `tenant-assets`** (`0003_storage.sql:21-32`) usa `(storage.foldername(name))[1] = p.tenant_id::text`. Funciona mas é frágil — se alguém upload pra path `wrongtenant/logo.png` no client, RLS bloqueia. OK, defesa correta. Mas falta SELECT policy explícita — comentário linha 18 diz "public buckets serve direct URLs without auth" — verdade pra leitura, mas se alguém faz LIST via API, não bloqueia. O bucket é `public`, então listing está cego de qualquer forma. OK na prática.
- **Falta CHECK constraint em `profiles.role`** além do existente — bom, já existe (`0001_initial.sql:37` `check (role in ('owner', 'student'))`). Mas se for SaaS futuro, vai querer mais roles (`admin`, `staff`). Já vai ser uma migration de domínio.
- **`workout_items` tem `position` não-único** — duas linhas podem ter `position=3` no mesmo `workout_id`. Não é catastrófico (você ordena por `position`), mas seria mais robusto adicionar `unique(workout_id, position)`. Embora isso brigue com a estratégia "delete + insert" em `saveWorkoutItemsAction` — fica OK do jeito atual.
- **Sem políticas de DELETE em `tenants`** — só faz sentido cascatear via FK `on delete cascade`, mas não há policy explícita protegendo. No SaaS, importante.
- **Triggers `updated_at`** existem em `tenants`, `profiles`, `workouts`, `plans` — mas faltam em `exercises`, `workout_logs`, `community_posts` (que têm `created_at` mas não `updated_at` — e nem deveriam, posts ficam imutáveis. OK).
- **Não tem função `notify`** ou `pg_notify` pra realtime. Se quiser comments em tempo real no feed, vai ter que adotar Supabase Realtime channels client-side.

### 2.5 Multi-tenant — readiness real

`src/lib/tenant.ts:11-30` resolve sempre o slug `judsonlobato`. Todo o resto do código aceita `tenant.id` como parâmetro. Pra ativar multi-tenant:
1. Mudar `getCurrentTenant()` pra resolver via `request.host` (custom_domain) ou subdomínio (`<slug>.app.fitcoach.com.br`).
2. Validar que `auth_tenant_id()` no DB bate com o tenant resolvido pelo host (defesa contra session-hijack cross-tenant).

Hoje, o código está bem perto disso. Estimativa: 1-2 dias pra fazer multi-tenant de fato.

---

## 3. Build & performance (5.5/10)

### 3.1 `next.config.ts` — quase vazio

`next.config.ts` (26 linhas) só tem security headers. Falta:

#### 🔴 `experimental.optimizePackageImports`
Lucide é otimizado por default no Next 16 (`optimizePackageImports.md:23`), mas **só se você usar a versão certa** (que você não usa, ver §1.2). Adicionar manualmente:

```ts
experimental: {
  optimizePackageImports: ["lucide-react", "@base-ui/react"],
},
```

#### 🔴 `images` config ausente
Você usa `<Image>` em **2 arquivos** (`src/app/(trainer)/settings/settings-form.tsx`, e tecnicamente `src/proxy.ts`). Quando crescer pra mostrar avatar de aluna, banner do tenant, foto de progresso — precisa configurar `images.remotePatterns` pra aceitar Supabase Storage:

```ts
images: {
  remotePatterns: [{ protocol: "https", hostname: "ymepyisibjraxtrnxpwc.supabase.co", pathname: "/storage/v1/object/public/**" }],
  formats: ["image/avif", "image/webp"],
},
```

Hoje, qualquer `<img src={tenant.logo_url}>` (você usa `<img>` direto em `settings-form.tsx`?) está bypass-ando otimização. Bug em performance latente.

#### 🟡 `cacheComponents` (Next 16 estável)
`08-caching.md:15-31` — você não usa o novo modelo de cache. É uma feature opt-in que reduz drasticamente refetch desnecessário em RSC. Pra um dashboard com 5 queries paralelas (`src/app/(trainer)/dashboard/page.tsx:62-98`), valeria experimentar. Esforço: M, impacto: M.

#### 🟡 CSP (Content-Security-Policy)
Headers em `next.config.ts:7-16` cobrem o básico (`X-Content-Type-Options`, HSTS, etc.) mas **nenhum CSP**. Comentário linha 4-6 admite: "Avoids inline-script-only CSP (Next emits inline scripts in dev)". Solução documentada em `02-guides/content-security-policy.md`: usar nonce via Proxy. Pra prod, isso fecha um vetor real (XSS, third-party injection). Esforço: M, impacto: alto pra postura de segurança.

#### 🟡 `reactCompiler`
Next 16 + React 19 suportam React Compiler (`reactCompiler: true` em `next.config.ts`). Pode dar 10-30% de ganho em re-renders sem mexer em código. Esforço: S, risco: M (compile-time bugs ainda surgem em libs que usam refs incomum), impacto: M.

#### 🟡 `transpilePackages`
Não precisa hoje, mas `@base-ui/react` (se adotar) pode precisar.

### 3.2 PWA / Service Worker — funcional mas limitado

**`public/sw.js` (67 linhas)** — service worker hand-written:
- Strategy razoável: network-first pra HTML, cache-first pra static.
- Pre-cache só de `/offline` e `/manifest.json` — ok.
- **Falta:** versionamento atrelado a build hash. `CACHE = "judsonapp-v1"` é constante — se você fizer um deploy com bug e quiser invalidar caches antigos, vai precisar editar manualmente e fazer deploy. Workbox resolve isso de fábrica via `precacheAndRoute(self.__WB_MANIFEST)`.
- **Falta:** background sync pra completar treinos offline. Hoje, se a aluna marca série offline, perde o registro. O `WorkoutRunner` (`runner.tsx:201-217`) faz o `logSetAction` direto — sem fila de sync.
- **Falta:** push notifications. Next 16 docs (`02-guides/progressive-web-apps.md:84-95`) tem guide pronto.

**Avaliação:** funciona pra "poder instalar". Não é PWA-grade-A.

**Recomendação concreta:** trocar `public/sw.js` por `@serwist/next` (bem mantido, sucessor moral do `next-pwa`) ou Workbox cru. Ganha versionamento automático, fallback strategies prontas, e push API.

### 3.3 Manifest

`public/manifest.json` (35 linhas) — está bem feito. Tem `id`, `scope`, `start_url`, ícones maskable. Próxima geração:
- Falta `screenshots` (form factor wide / narrow) — Chrome usa pra install prompt mais convincente.
- Falta `shortcuts` (deep links pra "Hoje", "Comunidade").
- Falta `display_override: ["standalone", "minimal-ui"]`.

Esforço S, impacto baixo mas é polimento.

### 3.4 Ícones e fonts

- `scripts/generate-icons.mjs` — bem feito, gera 4 ícones + 6 splash screens com `sharp`. Single source of truth `icon.svg`. **Falta:** ícone para Android maskable em outras densidades, ícone monocromático pra theme (Android 13+).
- Fonts via `next/font/google` (`src/app/layout.tsx:9-20`) — Bebas Neue + Inter, com `display: swap`. Padrão moderno. ✓

### 3.5 Suspense / loading.tsx / error.tsx

- 11 `loading.tsx` espalhados (todos dentro dos route groups). Bom.
- 1 `error.tsx` na raiz (`src/app/error.tsx`). Bom mas falta `global-error.tsx` (ver §2.1).
- **Sem `error.tsx` por segmento** — se uma query do dashboard quebrar, sobe direto pro root error. Ideal: `src/app/(trainer)/dashboard/error.tsx` com mensagem "esses números não carregaram, tenta de novo" sem matar a navegação inteira.

### 3.6 Bundle size (estimativa, não medi)

Páginas pesadas:
- `(trainer)/workouts/[id]/page.tsx` carrega `builder.tsx` (519 linhas) que importa `@dnd-kit/*` (~50KB gz). Aceitável para a página, **mas é o entry point** do route — se o trainer navegar via `Link` pro builder, prefetch baixa tudo.
- `(student)/treinos/[id]/page.tsx` carrega `runner.tsx` (596 linhas) + `canvas-confetti` (~10KB).

**Recomendação concreta:**
1. Lazy-import `canvas-confetti` dentro do callback de "concluir treino" (`runner.tsx:66-90`).
2. Lazy-import `@dnd-kit/*` dentro do `WorkoutBuilder` se possível (mas é o core, talvez não dê).
3. Rodar `@next/bundle-analyzer` (`02-guides/package-bundling.md`) e medir de fato.

---

## 4. Qualidade de código (7.5/10)

### 4.1 Pontos fortes

- ✅ **`tsconfig.json` strict** (linha 7). `"strict": true` ligado.
- ✅ **Zero `any`, zero `@ts-ignore`, zero `@ts-expect-error`** — grep retornou 0 matches em todo `src/`. Isso é raro e excelente.
- ✅ **Zero TODO/FIXME/HACK/XXX** — também raro.
- ✅ **Zod schemas em todos os actions**, com `safeParse` + mensagem de erro contextual.
- ✅ **Padrão consistente de erro:** `console.error("[scope.action]", err)` + return de mensagem amigável em PT-BR.
- ✅ **Comentários de "porque" em vez de "o que"** — ex: `src/lib/auth.ts:38-44` explica POR QUE usar service-role no bootstrap. `src/lib/rate-limit.ts:1-9` explica trade-off.
- ✅ **Tipos Supabase gerados** em `src/types/database.ts` (904 linhas) com aliases manuais preservados (`Tenant`, `Profile`, etc., linhas 891-903).

### 4.2 Pontos a melhorar

#### 🟡 Falta `server-only`
Já mencionei em §2.2. `src/lib/supabase/server.ts` exporta `createAdminClient()` — se um dev importar isso num Client Component, build não barra, mas o `SUPABASE_SERVICE_ROLE_KEY` viraria `undefined` no client e o erro seria runtime, não build-time. Adiciona linha:

```ts
import "server-only"; // primeiríssima linha
```

Em `server.ts` e `auth.ts`.

#### 🟡 Helpers duplicados
`startOfDay`, `computeStreak`, `formatDate`/`timeAgo` — implementados praticamente idênticos em:
- `src/app/(trainer)/dashboard/page.tsx:26-50`
- `src/app/(trainer)/students/[id]/page.tsx:40-71`
- `src/app/(student)/home/page.tsx:54-75`
- `src/app/(student)/perfil/page.tsx:44-78`
- `src/app/(student)/treinos/page.tsx:120-131`

São funções puras de data — extrai pra `src/lib/dates.ts`. Esforço: S, impacto: M (manutenção).

#### 🟡 Validação manual no client
`src/app/(student)/treinos/[id]/runner.tsx:414` `e.target.value.replace(/[^0-9]/g, "")` — validação inline. OK pra UX, mas o action server (`logSetAction`, `actions.ts:65-71`) tem o schema Zod completo. Cliente e servidor poderiam compartilhar via `src/lib/schemas/workout.ts`.

#### 🟡 Type assertion em `welcome/page.tsx`
`src/app/welcome/page.tsx:28` —
```ts
const tenant = (profile as { tenants?: {...} } | null)?.tenants ?? null;
```
Cast manual. O Supabase types tem o tipo certo se a query for `.select("...tenants(name, ...)")` com `.returns<>`. Hoje você está fazendo o cast porque o tipo gerado retorna a join como array (`tenants: { name: ... }[]`) ou objeto único dependendo da relação. Se ajustar a query com `.returns<{ profile: Profile, tenants: Tenant }>()` fica mais limpo.

#### 🟡 Tratamento `console.warn` para auth
`src/components/pwa-install-prompt.tsx:107` `console.warn("[pwa] install prompt failed", err)` — em produção, isso vai pro DevTools do user. Idealmente vira evento de telemetria.

### 4.3 Testes — 🔴 ZERO

Sem `*.test.ts`, `*.spec.ts`, `__tests__/`, jest config, vitest config, playwright config. Zero infraestrutura de teste.

Pra "melhor app do Brasil" isso é gap crítico. Mínimo aceitável:
- **Vitest + @testing-library/react** pros componentes client críticos (`runner.tsx`, `builder.tsx`, `pwa-install-prompt.tsx`).
- **Playwright** pra 5 fluxos: login Judson, login aluna, invite + signup, completar um treino, postar na comunidade.
- **DB tests** pras RPC `consume_invite` (race + idempotência).

Next 16 docs `02-guides/testing/` tem setup pronto pra Vitest, Jest, Playwright, Cypress.

Esforço: L (semana de trabalho). Impacto: alto.

### 4.4 Lint config

`eslint.config.mjs` (22 linhas) — mínimo viável: `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`. **Falta:**
- `eslint-plugin-jsx-a11y` (recomendado por Next em `02-guides/production-checklist.md:95`).
- Regras de import order (eslint-plugin-import com groups).
- Regras de `no-console` em prod (com allowlist pra `console.error`).

Esforço: S, impacto: M.

---

## 5. Dívida técnica observável (6.5/10)

Boas notícias: pouca dívida explícita (zero TODO/FIXME). Mas há atalhos conscientes que a doc admite e que vão precisar voltar:

### 5.1 Atalhos comentados como "MVP scale"

- **`src/app/(trainer)/workouts/actions.ts:230-260`** `saveWorkoutItemsAction` — strategy de "delete + reinsert" em vez de upsert por id. Comentário linha 231 admite: "Cheapest correct approach for MVP scale (typically <30 items per workout)". Funciona, mas:
  - Perde IDs estáveis (cada save remapeia ids client-side via `crypto.randomUUID()`).
  - Cascata: `exercise_logs` referencia `workout_item_id` — se você apagar items, RLS+FK on delete cascade vai mover/quebrar histórico de carga sugerida (`runner.tsx` busca `last_load` por `workout_item_id` em `treinos/[id]/page.tsx:70-78`).
  - Em produção real isso vira bug "minha última carga sumiu depois que o personal editou o treino".
  
  **Fix:** trocar pra upsert por id estável (gerar UUID no client, persistir). Esforço: M, impacto: alto.

- **`src/lib/rate-limit.ts:1-8`** rate-limit em memória. Documentado: "Good for single-instance deploys... swap... for an Upstash Redis client (same interface, three lines of code)". Em Vercel serverless, cada instância tem seu próprio Map — limites efetivamente ineficazes em escala. Vercel free pode escalar pra 5+ instances paralelas. Limite "5 OTPs/hora/email" vira "5 × N instances". OK pra MVP, **NÃO OK** se virar SaaS de fato.

  **Fix:** Upstash Redis grátis (10k cmd/dia) + cliente `@upstash/ratelimit`. Esforço: S, impacto: alto.

### 5.2 Tipos Supabase desatualizados (potencial)

`src/types/database.ts` foi gerado contra o schema. Migration `0009_plans_and_referrals.sql` adicionou `current_plan_id`, `referral_code`, tabela `plans`, `referrals` — e o tipo reflete isso (linhas 285-470). **MAS:** se você rodou `supabase gen types` antes de aplicar `0009`, ou aplicou `0009` direto sem regenerar, o type file pode estar fora de sync. Recomendação: garantir que existe um script `npm run types:gen` que roda `supabase gen types typescript --linked > src/types/database.ts`.

### 5.3 Código morto

- **`framer-motion`, `@base-ui/react`** instalados sem uso (§1.2).
- **`src/app/(trainer)/_components/coming-soon.tsx`** e **`(student)/_components/coming-soon.tsx`** — não vou abrir mas o nome sugere placeholder. Verificar se ainda é referenciado.
- **`src/app/welcome/page.tsx:30-49`** — quase sempre redireciona, nunca renderiza. Comentário linha 21-24 admite: "should not render UI in normal flows". Mas o JSX está lá. Pode virar `redirect("/login")` no fim e remover o JSX, OU virar landing real pós-onboarding (que era a intenção original conforme README linha 32).

### 5.4 Migrations Supabase

`supabase/migrations/` tem 9 arquivos numerados sequencialmente. **Bem versionado**. Pequena observação:
- `0001_initial.sql` tem políticas permissivas que `0007_rls_hardening.sql` reverte/substitui. Isso é OK no histórico, mas se um setup novo tiver que rodar tudo, ele aplica `0001` (permissive) e depois `0007` (strict). Funciona. Em SaaS futuro, talvez consolidar 0001+0007 num único migration "production schema".

### 5.5 Inconsistências menores

- `Tenant` não tem campos `email` ou `support_email` — futuro problema de SaaS.
- `community_posts.media_type` aceita string livre — deveria ser enum (`image`, `video`, `link`, `audio`).
- `referrals.status` tem CHECK constraint (`0009:84`) — bom. Já é enum implícito.
- `exercises.video_source` tem default `'youtube'` mas comportamento detecta YouTube/Instagram/other em `actions.ts:9-13`. OK, funciona.

---

## 6. Observabilidade (3.5/10)

**Esse é o ponto mais fraco do projeto.** Pra "melhor app do Brasil" é gap inaceitável.

### 6.1 O que existe

- **`/api/health`** (`src/app/api/health/route.ts`) — pinga `tenants` table. OK pra liveness, mas não cobre:
  - Auth working (`auth.users` reachable).
  - Storage working (signed URL gen).
  - RPC working (`consume_invite` callable).
- **`console.error("[scope.action]", err)`** em todo action — vai pro stdout do Vercel Functions. Buscável via Vercel Logs UI mas:
  - Sem correlation ID por request.
  - Sem captura de stack trace estruturada.
  - Sem alerting (você só vê se for olhar manualmente).
- **`error.tsx`** mostra `error.digest` pro user copiar — bom UX, mas o digest fica preso no log do Vercel, sem ferramenta de busca decente.

### 6.2 O que falta — ordem de prioridade

#### 🔴 Sentry (ou equivalent)
Próximo nível imediato. `@sentry/nextjs` integra em 5min, captura:
- Errors client e server.
- Performance traces (TTFB, LCP, hidratação).
- Source maps automáticos.
- Release tracking via Vercel deploy.

Esforço: S (1-2h), impacto: alto.

#### 🔴 Vercel Analytics + Speed Insights
2 packages, 2 linhas de código no `layout.tsx`:
```tsx
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
```
Custo zero no Hobby tier (limite generoso). Você passa a ter Core Web Vitals reais por rota.

Esforço: S, impacto: alto.

#### 🟡 Logging estruturado
Substituir `console.error` por uma função `logger.error({ scope, action, ...meta })`. Pode ser um simples wrapper que joga JSON no stdout:
```ts
export const log = {
  error: (scope: string, meta: object) =>
    console.error(JSON.stringify({ level: "error", scope, ...meta, ts: Date.now() })),
};
```
Vercel Logs faz parse de JSON e dá filtros. Esforço: M (refactor de 14 actions).

#### 🟡 Health check enriquecido
```ts
{
  status: "ok" | "degraded",
  checks: {
    db: "ok",
    storage: "ok",
    auth: "ok",
  },
  version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7),
  region: process.env.VERCEL_REGION,
  ts: ...
}
```
Esforço: S.

#### 🟡 Rate-limit metrics
`src/lib/rate-limit.ts` retorna `{ ok, remaining, resetAt }` mas ninguém loga quando bate `ok: false`. Você não sabe se está sendo atacado ou se é falso-positivo de UX.

#### 🟡 Open Telemetry (opcional, alto valor)
Next 16 tem suporte de fábrica (`02-guides/open-telemetry.md`). Vercel tem OTel collector no Pro tier. Pra SaaS multi-tenant com troubleshooting cross-tenant, é o jeito.

---

## 7. Notas extras (não numeradas mas relevantes)

### 7.1 Acessibilidade

Análise rápida do que vi:
- Labels e `aria-label` aparecem (ex: `runner.tsx:411`, `builder.tsx:189`). ✓
- `aria-hidden` em ícones decorativos. ✓ (vi em vários lugares)
- **Falta:** focus-trap robusto nos `Sheet` e `Dialog`. Seu Sheet custom (`src/components/ui/sheet.tsx`) precisa ser auditado — Base UI resolveria de fábrica.
- **Falta:** skip link ("Pular pro conteúdo").
- Contraste — paleta com `#A3A3A3` em `bg-#0A0A0A` dá ratio ~7:1 (AAA). ✓

### 7.2 SEO

- `app/layout.tsx:22-31` `metadata` correto.
- **Falta:** `robots.ts`, `sitemap.ts`, `app/manifest.ts` (você usa `manifest.json` estático — funciona, mas perde a chance de localizar por tenant futuro).
- **Falta:** OG image dinâmica via `app/opengraph-image.tsx`. Quando um aluna mandar invite link no Insta Stories, falta preview bonito.

### 7.3 Internacionalização

App é PT-BR hardcoded. Sem `next-intl` ou `next-i18next`. Pra SaaS, vira gargalo. Mas pra MVP single-tenant com personal brasileiro, OK.

### 7.4 Email templates

README linha 44-50 documenta que o email do magic link **ainda está em inglês default do Supabase**. Crítico antes do beta com pessoas reais. Já está no radar do dono — não é descoberta minha.

### 7.5 Senha dev

Memória do projeto menciona "trocar senha dev". Não vi isso no código (o que é bom — não devia estar versionada), mas vale validar que `.env.local` não foi commitada por acidente. `.gitignore` ignora `.env*` no padrão Next. ✓

---

## 8. Top 10 prioridades pra "alto nível técnico"

Ordem é minha opinião — esforço (S/M/L) × impacto (alto/médio/baixo) × risco de não fazer.

| # | Item | Esforço | Impacto | Por quê |
|---|---|---|---|---|
| 1 | **Trocar `lucide-react@1.14.0` pela versão correta `0.460.x+`** | S | Alto | Bug latente + perde tree-shaking automático do Next 16 |
| 2 | **Adicionar Sentry + Vercel Analytics + Speed Insights** | S | Alto | Você está cego em produção. Sem isso, "melhor app do Brasil" é wishful thinking |
| 3 | **Adicionar `import "server-only"` em `lib/supabase/server.ts` + `lib/auth.ts`** | S | Alto | Defesa contra vazamento da `SUPABASE_SERVICE_ROLE_KEY` pro bundle client |
| 4 | **Migrar `rate-limit.ts` pra Upstash Redis** | S | Alto | Em escala Vercel, in-memory é placebo de segurança |
| 5 | **Adicionar `experimental.optimizePackageImports`, `images.remotePatterns`, CSP nonced no `next.config.ts`** | M | Alto | Tira ~30% de KB do bundle inicial e fecha vetor XSS |
| 6 | **Configurar Vitest + Playwright e cobrir 5 fluxos críticos** | L | Alto | Zero teste hoje. Qualquer feature nova vira regressão silenciosa |
| 7 | **Refactor `saveWorkoutItemsAction` pra upsert por ID estável** | M | Alto | Bug latente: histórico de cargas perde referência quando personal edita treino |
| 8 | **Remover `framer-motion` e `@base-ui/react` ou usar de fato (sugestão: adotar Base UI pros primitives `Sheet`/`Dialog`/`Select`)** | M | Médio | Se ficar como está, vira "código morto" + a11y dos Sheet/Dialog custom é frágil |
| 9 | **Substituir `public/sw.js` por `@serwist/next` (Workbox-based) com versionamento por build hash + background sync** | M | Médio | SW atual funciona pra "instalar PWA" mas perde features modernas (push, queue offline) |
| 10 | **Criar `src/lib/dates.ts` com `startOfDay`/`computeStreak`/`timeAgo` + adicionar `app/global-error.tsx` + `error.tsx` por segmento** | S | Médio | DRY + UX de erro por seção em vez de morrer o app inteiro |

### Bônus (11-15) se sobrar fôlego

11. **`reactCompiler: true` no `next.config.ts`** — S/M, ganho de performance grátis.
12. **Logger estruturado JSON no lugar de `console.error`** — M/M.
13. **Schemas Zod compartilhados (`src/lib/schemas/`) entre client e server** — M/M.
14. **Health check enriquecido (db + storage + auth + version)** — S/M.
15. **OG image dinâmica + sitemap.ts + robots.ts** — S/M, polimento SEO.

---

## 9. Conclusão honesta

**O que está realmente bom:**
- Schema multi-tenant ready de verdade (não apenas no nome).
- Server Actions com pattern consistente e validação Zod.
- RLS hardened e bem documentado em SQL.
- TypeScript strict, zero `any`, zero TODOs.
- Comentários explicando POR QUÊ em pontos críticos.
- Magic-link flow + RPC `consume_invite` atômico.

**O que separa esse app do "alto nível":**
- Observabilidade quase zero — sem Sentry/Analytics você nunca vai saber o que está quebrando.
- Zero testes — qualquer mudança grande é roleta russa.
- Dependências mal-curadas (lucide errado, framer/base-ui não usadas).
- `next.config.ts` quase vazio — você está deixando 30%+ de performance e segurança em cima da mesa.
- Service Worker rudimentar — perde a magia de PWA real (background sync, push).
- Rate limit em memória — vai virar bug em produção quando escalar.

Com o **top 5 da lista de prioridades implementado**, esse app sai de "MVP bem feito" pra "produção sólida". Com **top 10**, fica num patamar acima da média do mercado brasileiro de fitness. "Melhor app do Brasil" precisa também de produto/UX/conteúdo, que está fora desse escopo, mas tecnicamente esse caminho leva pra lá.

---

*Análise: 2026-05-07 — Claude (Opus 4.7, 1M context). Escopo: Next 16.2.5 + React 19.2.4 + Supabase + Tailwind 4 + PWA. Branch `main` em `ada5eaa`.*
