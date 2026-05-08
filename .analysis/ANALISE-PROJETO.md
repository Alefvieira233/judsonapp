# Judson App — Análise 360° pra virar "o melhor do Brasil"

**Data:** 2026-05-07 · **Branch:** `main` em `ada5eaa` · **Stack:** Next.js 16.2.5 + React 19.2.4 + Supabase + Tailwind 4 + PWA

> Esse documento é a síntese de 5 análises paralelas que rodaram contra o repo:
> [01-tech-stack.md](01-tech-stack.md) · [02-features.md](02-features.md) · [03-ui-ux.md](03-ui-ux.md) · [04-security-lgpd.md](04-security-lgpd.md) · [05-competition.md](05-competition.md)
>
> Eles são as fontes; aqui é onde a coisa vira plano.

---

## TL;DR — A verdade em 5 frases

1. **A fundação é boa.** Schema multi-tenant honesto, RLS hardened, TypeScript estrito sem `any`/TODO, padrão consistente de Server Actions com Zod, PWA instalável, runner de treino robusto, RPC de invite atômico. Isso já está acima da média do mercado brasileiro.
2. **Mas não pode ir live como está.** Tem **3 vulnerabilidades CRÍTICAS** (`consume_invite` aceita `p_user_id` arbitrário, SW cacheia HTML autenticado, injeção PostgREST `.or()`) e **gap LGPD que bloqueia produção** (sem aceite de termos, política incompleta, sem mecanismo self-service de exportar/excluir).
3. **Faltam features que viraram commodity** no mercado: pagamento Pix recorrente, push notifications, vídeo demonstrativo embeddado, anamnese estruturada, avaliação física com timeline, foto de progresso, chat in-app, gráficos de evolução.
4. **O visual tem fundação técnica sólida mas zero personalidade.** Framer Motion instalado e nunca usado, `confirm()` nativo na tela mais usada, botões abaixo de 44pt, splash icon que vira Arial em qualquer device sem Bebas Neue, hero genérico shadcn-com-vermelho. Hoje parece SaaS B2B; precisa parecer **produto premium do Judson Lobato**.
5. **Existem 6 gaps reais no mercado** que dão pra Judson App liderar de fato — não como "mais um FitCoach", mas como "o que os outros prometeram e não entregaram": **PWA mobile-first**, **onboarding sem fricção**, **suporte humano que funciona**, **white-label barato**, **UX feminina-friendly com mood esportivo**, e **Pix recorrente que não falha**. Esses são os pivôs estratégicos.

**Score consolidado:** Tech 6.2/10 · Features 6.0/10 · UI/UX 5.5/10 · Segurança/LGPD 5.3/10 · **Média 5.75/10**.
Com as Ondas G/H/I deste documento implementadas: **8.0/10** sem refatorar arquitetura.

---

## 1. Vermelhos críticos — antes de QUALQUER coisa

Esses 4 itens **bloqueiam ir pra produção com tráfego pago**. Tudo o resto é prioridade abaixo deles.

### 🔴 CRIT-1 — `consume_invite` aceita `p_user_id` do cliente

[`supabase/migrations/0004_consume_invite.sql:14-79`](../supabase/migrations/0004_consume_invite.sql) + [`src/app/auth/callback/route.ts:44-49`](../src/app/auth/callback/route.ts)

A função SECURITY DEFINER recebe `p_user_id` direto da Server Action sem validar contra `auth.uid()`. Qualquer authenticated user pode chamar via `supabase.rpc('consume_invite', { p_user_id: <outra_uuid>, ... })` e **sequestrar/forjar perfil** vinculando o token de uma aluna ao auth.uid de outra.

**Fix em 1 linha:** dentro da função, antes de qualquer check:
```sql
if p_user_id is null or p_user_id <> auth.uid() then
  raise exception 'user_mismatch' using errcode = 'P0005';
end if;
```
E remover `p_user_id` da assinatura, passar a usar `auth.uid()` direto. Migration `0010_consume_invite_lock_user.sql`. **1h.**

### 🔴 CRIT-2 — Service Worker cacheia HTML autenticado

[`public/sw.js:30-48`](../public/sw.js)

SW intercepta navegações HTML, faz `network-first` mas **clona e armazena no cache** toda response (incluindo `/dashboard`, `/students/<uuid>`, `/perfil`, `/feed`). Quando aluna sai (logout) ou outra pessoa abre o mesmo navegador, SW serve a versão cacheada offline — **vazando lista de alunas, peso, RPE, mensagens**. Em academia/celular emprestado vira vazamento direto.

**Fix:** parar de cachear HTML autenticado; só cachear `/offline` + assets estáticos:
```js
if (request.mode === "navigate") {
  event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_URL)));
  return;
}
```
**2h.**

### 🔴 CRIT-3 — Injeção via `.or()` PostgREST com route param não validado

[`src/app/(trainer)/students/[id]/page.tsx:123`](../src/app/(trainer)/students/[id]/page.tsx)

```ts
.or(`referrer_id.eq.${id},referred_id.eq.${id}`)
```

`id` é parâmetro de URL não validado como UUID antes do interpolate. Atacante autenticado como owner pode acessar `/students/foo,referred_id.eq.<UUID>--/` e injetar filtros adicionais. Outras 2 ocorrências em `workouts/[id]/page.tsx:40` e `exercises/page.tsx:29` usam `session.tenant.id` (seguro hoje), mas o padrão é frágil.

**Fix:** `z.string().uuid().safeParse(id)` antes; trocar `.or()` por queries com `.eq()` + `Promise.all`. **1h.**

### 🔴 LGPD-BLOQ — Sem aceite de Termos/Privacidade no fluxo

[`src/app/invite/[token]/invite-form.tsx`](../src/app/invite/[token]/) + [`src/app/aluna/entrar/login-form.tsx`](../src/app/aluna/entrar/login-form.tsx)

Aluna preenche nome+e-mail no `/invite/<token>` **sem checkbox** "Li e aceito os Termos de Uso e a Política de Privacidade". Sem isso, **não há consentimento registrado**. ANPD entende ausência de aceite explícito como tratamento sem base legal — multa real.

**Fix:**
1. Checkbox obrigatório no `InviteForm` e no `StudentLoginForm` (primeira vez).
2. Tabela `consents (user_id, tenant_id, policy_version, terms_version, accepted_at, ip, user_agent)`.
3. Cookie banner one-time linkando política.

**3h.**

> **Esses 4 itens devem fechar antes de qualquer tráfego real (Onda G).**

---

## 2. Termos de Utilização & LGPD — o que precisa pra ficar profissional

Hoje as páginas existem ([`/termos`](../src/app/termos/page.tsx) com 78 linhas, [`/privacidade`](../src/app/privacidade/page.tsx) com 115 linhas) mas estão **incompletas** pelo padrão da Lei 13.709/18 e do que o ANPD efetivamente fiscaliza.

### 2.1 Política de Privacidade — falta

| Item | Onde adicionar | Por quê |
|---|---|---|
| **CNPJ ou CPF do controlador** + endereço físico (Macapá-AP) | seção "Quem trata os dados" | art. 9º LGPD obriga identificação completa |
| **Encarregado (DPO)** com canal escrito (e-mail formal, não só WhatsApp) | nova seção "Encarregado" | art. 41 LGPD — mesmo se for o próprio Judson |
| **Bases legais explícitas art. 7º (gerais) e art. 11 (saúde)** | seção "Por que tratamos" | sem isso, todo tratamento é juridicamente nulo |
| **Subprocessadores e transferência internacional** | "Quem mais acessa" | Vercel + Supabase usam servidores EUA → art. 33 LGPD |
| **Tempo de retenção por categoria** | "Por quanto tempo guardamos" | hoje genérico; ANPD pede granular (treinos = X anos, logs = Y meses) |
| **Direito de portabilidade ativável por canal escrito** | "Seus direitos" | hoje só WhatsApp não basta |
| **Cookies — descrição honesta** | "Cookies" | hoje promete "só essenciais" mas SW cacheia páginas autenticadas |
| **Cláusula de menores de 18** com bloqueio + consentimento parental | "Menores" | art. 14 — proibido tratar sem consentimento parental |

### 2.2 Termos de Uso — falta

| Item | Por quê |
|---|---|
| **Foro de eleição** (Macapá-AP) | comarca obrigatória pra ações |
| **Lei aplicável** (Brasil) | proteção em conflitos |
| **Limitação de responsabilidade por lesão** | app não substitui consulta médica — está no texto, mas precisa cláusula |
| **Propriedade intelectual** dos treinos prescritos (do Judson, aluna não redistribui) | proteção do know-how |
| **Licença sobre conteúdo postado** pela aluna no feed | quem é dono? quem responde se postar foto de terceiro? |
| **Política de pagamento** mesmo via Pix/WhatsApp | inadimplência → suspensão de acesso |
| **Vigência e como notificar mudanças** | obrigação de aviso prévio |

### 2.3 Mecanismos self-service (LGPD ANPD)

A política promete "pedidos pelo WhatsApp" — atende tecnicamente, **mas não cumpre prazo legal de 15 dias** se Judson estiver de férias.

- [ ] **`/perfil/exportar-dados`** — JSON com tudo de `profiles`, `workout_logs`, `exercise_logs`, `community_posts`, `community_comments`, `referrals` da aluna logada.
- [ ] **`/perfil/excluir-conta`** — soft-delete (`active=false`, anonimiza nome/e-mail com hash) preservando logs históricos do Judson.
- [ ] **Tabela `consents`** com versão de política aceita, IP, user-agent, timestamp.
- [ ] **Tabela `audit_log`** para SaaS futuro (quem leu o quê) — hoje opcional pra cliente único, **obrigatório** quando virar multi-tenant.

### 2.4 Recomendação de processo

Termos e privacidade são **documentos jurídicos**. Mesmo que eu (e o Alef) saibamos escrever, **revisão jurídica vale o investimento** quando o app vai cobrar dinheiro de pessoa real:

1. Versão técnica completa (eu posso escrever) baseada nos itens acima — **3-4h de trabalho meu**.
2. Revisão por advogado parceiro especializado em LGPD/digital — **R$ 800-2.500** uma vez.
3. Versão final com versionamento (`policy_version=1`, `terms_version=1`) gravado no aceite.

---

## 3. Ferramentas — o que falta na stack

### 3.1 Bugs latentes na stack atual (resolver primeiro)

| Item | Onde | Esforço | Por quê |
|---|---|---|---|
| **`lucide-react@1.14.0` é versão errada** — linha estável é `0.460+` | [`package.json:24`](../package.json) | S | Está rodando ícones de 2020/21 + perde tree-shaking automático do Next 16 |
| **`framer-motion` declarada e nunca importada** | [`package.json:22`](../package.json) | S/M | Ou usa de fato, ou remove (memória do projeto vai precisar atualizar) |
| **`@base-ui/react` declarada e nunca importada** | [`package.json:13`](../package.json) | S/L | **Recomendo adotar** pros primitives `Sheet`/`Dialog`/`Select` (a11y de fábrica) |
| **`saveWorkoutItemsAction` faz delete+reinsert** | [`src/app/(trainer)/workouts/actions.ts:230`](../src/app/(trainer)/workouts/actions.ts) | M | Bug latente: quebra `last_load` do runner por `workout_item_id` quando trainer edita treino |
| **`import "server-only"` ausente** | [`src/lib/supabase/server.ts`](../src/lib/supabase/server.ts), [`src/lib/auth.ts`](../src/lib/auth.ts) | S | Defesa contra vazamento da `SUPABASE_SERVICE_ROLE_KEY` pro bundle |
| **Rate-limit em memória** | [`src/lib/rate-limit.ts`](../src/lib/rate-limit.ts) | S | Cold start Vercel = limite reseta. Trocar pra Upstash Redis (mesma interface) |

### 3.2 Observabilidade — gap mais grave da stack (3.5/10)

Hoje o app tem `console.error` espalhado e **nada mais**. Pra "melhor app do Brasil" isso é inaceitável.

| Item | Esforço | Por quê |
|---|---|---|
| **Sentry** (`@sentry/nextjs`) | S (1-2h) | Errors client+server, performance traces, source maps, release tracking. Sem isso o Judson reporta bug por WhatsApp e a gente vai cego. |
| **Vercel Analytics + Speed Insights** | S (15min) | 2 packages, 2 linhas em `layout.tsx`. Free no Hobby. Core Web Vitals reais por rota. |
| **Logger estruturado JSON** (substitui `console.error`) | M | Vercel Logs faz parse de JSON e dá filtros. Correlation ID por request. |
| **Health check enriquecido** (db + storage + auth + version + region) | S | Hoje só pinga `tenants`. UptimeRobot precisa saber se Auth/Storage estão de pé. |

### 3.3 `next.config.ts` — quase vazio (5.5/10 build)

[`next.config.ts`](../next.config.ts) tem 26 linhas, só security headers básicos. Falta:

| Item | Impacto |
|---|---|
| **`experimental.optimizePackageImports`** com `lucide-react`, `@base-ui/react` | Tree-shaking automático ~30% bundle |
| **`images.remotePatterns`** apontando pro bucket Supabase | Hoje qualquer `<img>` bypassa otimização |
| **CSP com nonce via Proxy** (Next 16 docs `02-guides/content-security-policy.md`) | Fecha vetor XSS — single-line é o que falta |
| **`reactCompiler: true`** | 10-30% ganho em re-renders grátis (React 19 + Next 16 suportam) |
| **COOP / CORP em rotas de imagem do bucket** | Defesa em profundidade |

### 3.4 Testes — 🔴 ZERO

Zero `*.test.ts`, zero Vitest, zero Playwright. Pra "melhor do Brasil" é gap crítico.

**Mínimo aceitável:**
- **Vitest + @testing-library/react** — runner.tsx, builder.tsx, pwa-install-prompt.tsx
- **Playwright** — 5 fluxos: login Judson, login aluna, invite+signup, completar treino, postar comunidade
- **DB tests** — RPC `consume_invite` (race + idempotência)

Esforço: **L (semana de trabalho)**. Mas é o que separa MVP de produto sério.

### 3.5 Service Worker — funcional mas limitado (6/10 PWA)

[`public/sw.js`](../public/sw.js) é hand-written de 67 linhas. Funciona pra "instalar PWA" mas:
- Cache versionado em string constante (`CACHE = "judsonapp-v1"`) — invalidar exige edit manual
- Sem background sync pra completar treinos offline (set marcado offline = perdido)
- Sem push API

**Fix:** trocar por `@serwist/next` (sucessor moral do `next-pwa`, Workbox-based). Versionamento automático por build hash, fallback strategies prontas, push API incluída. **M, alto impacto**.

---

## 4. Aparência — UI/UX (5.5/10)

> Diagnóstico final do design-analyst: **"é um produto bem feito que parece um SaaS B2B genérico"**. Tem ossos certos, falta carne.

### 4.1 Por dimensão

| Dimensão | Score | O que tá quebrado |
|---|---:|---|
| Sistema de design (tokens) | 7/10 | Escala tipográfica não definida — cada página inventa `text-3xl/4xl/5xl/6xl/8xl` ad-hoc; 6+ valores de `bg-card/XX` espalhados sem semântica |
| Componentes UI | 5/10 | Faltam Switch, Toggle, Progress, Alert, Stepper, RadioGroup, Slider, NumericInput, IconButton brand, EmptyState, PageHeader, StatCard (5+ duplicados ad-hoc) |
| Navegação | 6.5/10 | Bottom nav sem ícones filled no ativo; barra ativa fina demais (h-0.5); label 11px minúscula; sem badge de notificação |
| Feedback / loading | 6.5/10 | Skeletons existem mas genéricos (animate-pulse); nenhum stagger; `confirm()` nativo no runner quebra dark mode |
| **Microinterações / motion** | **2/10** | **`framer-motion` instalado, ZERO uso.** Sem page transitions, sem tap feedback, sem spring nos sheets |
| Acessibilidade | 5.5/10 | Botão default `h-8` (32px) abaixo de 44pt mínimo; bottom-nav sem focus-visible ring; sem skip link; viewport `maximumScale: 1` é hostil a baixa visão |
| Mobile-first | 7/10 | Safe-area-bottom tá, **mas safe-area-top NÃO está** em `trainer-header` — colide com notch iPhone |
| **Identidade de marca** | **4.5/10** | **Maior fraqueza.** App inteiro é "dark com vermelho" — qualquer SaaS B2B é igual. Sem foto, sem grain, sem assinatura visual, sem alma do Judson Lobato |
| PWA polish | 6/10 | Splash icon usa Bebas Neue como `font-family` no SVG — Sharp não carrega Bebas, gera "JL" em Arial Narrow. **Identidade quebra no primeiríssimo contato** |

### 4.2 Top 5 fixes brutais (ordem de impacto)

1. **Substituir `confirm()` nativo no runner por Dialog brand** — [`runner.tsx:175`](../src/app/(student)/treinos/[id]/runner.tsx). Quebra dark mode na tela mais usada. **1h.**
2. **Botões 44px+ no default + `active:scale-[0.98]` + `hover:bg-primary/90`** — [`button.tsx:22-34`](../src/components/ui/button.tsx). Toda CTA do app sofre. **30min.**
3. **Splash icon convertido para path (não fonte)** — [`public/icons/icon.svg`](../public/icons/icon.svg). Sem isso o "JL" do splash sai em Arial. **1h.**
4. **Page transitions com Framer Motion** — `template.tsx` por route group. Diferença visceral entre "site" e "app premium". **1h.**
5. **Personalidade visual do Judson** — foto B&W do Judson + grain overlay + uma linha estridente vermelha (assinatura). **1 dia + 1 sessão de fotos.**

### 4.3 Os 12 fixes priorizados completos

(Detalhe técnico em [03-ui-ux.md §9](03-ui-ux.md))

1. ~~`confirm()` → Dialog brand~~ (runner)
2. ~~Botões 44px+ + active:scale + hover bg/90~~
3. **Barra de progresso no runner** (sticky topo) — gratificação central
4. **Inputs gigantes nos sets** (`h-12 text-lg font-bold tabular-nums`) — academia em dedo molhado
5. **Componentes unificados** EmptyState, PageHeader, StatCard
6. ~~Splash icon convertido para path~~
7. ~~Page transitions Framer Motion~~
8. **Tap feedback** em todos Links/Buttons (`whileTap={{scale:0.97}}`)
9. **Hero da home com hierarquia invertida** (streak XL, nome menor) + foto/silhueta
10. **Bottom nav com ícone filled ativo** + barra ativa proeminente
11. **Safe-area-inset-top no trainer-header** + remover `viewport.maximumScale`
12. ~~Personalidade visual da marca Judson~~

### 4.4 Refs visuais a estudar

- **Whoop** — foto de atletas B&W com gradient escarlate (referência mais próxima do mood Judson)
- **Strava** — cores vivas + fotos reais
- **Centr** — densidade premium, microinterações
- **Strong / Hevy** — UX do runner (input gigante, last load badge proeminente)
- **Nike Training Club** — hero fullscreen com overlay
- **Linear** — sidebar com indicador ativo barra lateral
- **Freeletics** — celebração pós-treino tipo Duolingo (XP +50, treino #X)

---

## 5. Funções — features atuais e gaps

### 5.1 O que o app FAZ hoje (resumo)

**TRAINER (Judson, role=owner) — 10 rotas, todas funcionais:**
- Dashboard com 4 KPIs + última atividade
- Students: lista filtrada, criar direto via admin REST + magic link, criar via convite, edição parcial, plano picker, referrals block
- Workouts: builder drag-and-drop com `@dnd-kit`, edição inline, dias da semana, **duplicar treino**, apagar
- Exercises: biblioteca com chips, busca, autodetecta source de vídeo (YouTube/Instagram), instructions
- Plans: CRUD completo com tagline, preço-livre, features, badge destaque
- Community: posts com pin/unpin, **falta** ver comentários/curtidas no painel
- Settings: marca (logo+banner+cor), contato (WhatsApp+Insta+CREF), consultoria

**ALUNA (role=student) — 7 rotas, runner é o highlight:**
- Home com hero personalizado por horário, 3 stats, treino-de-hoje, atalhos
- Treinos lista com último log relativo + dias agendados
- **Runner robusto** (596 linhas): pré-carrega última carga, upsert por (log,item,set), cronômetro descanso flutuante com pause/skip, RPE 1-10, confetti com brand colors
- Feed com likes otimistas + comentários inline
- Perfil com referral_code copiável + WhatsApp share
- Editar perfil parcial (não edita avatar/birthdate/foto)
- Planos visualização + WhatsApp pré-preenchido

**Sistema:**
- Auth dois fluxos (owner senha, aluna magic link)
- Termos + Privacidade existem (mas incompletos)
- Health check
- Rate limit (em-memória)

### 5.2 Bugs latentes detectados

| # | Bug | Onde |
|---|---|---|
| 1 | **Cancel de treino deixa workout_log órfão** (started_at sem completed_at) | [`runner.tsx:175`](../src/app/(student)/treinos/[id]/runner.tsx) |
| 2 | **`saveWorkoutItemsAction` perde IDs estáveis** — `last_load` quebra quando trainer edita | [`workouts/actions.ts:230`](../src/app/(trainer)/workouts/actions.ts) |
| 3 | **Apagar treino sem confirmação visual** (form action direto) | [`builder.tsx:288-292`](../src/app/(trainer)/workouts/[id]/builder.tsx) |
| 4 | **`/welcome/page.tsx` é zumbi** — sempre redireciona, JSX nunca renderiza | [`src/app/welcome/page.tsx`](../src/app/welcome/page.tsx) |

### 5.3 Schema com colunas órfãs (sem UI)

- `profiles.avatar_url` — coluna existe, **nunca usada** (só inicial)
- `profiles.birthdate` — coluna existe, **nunca usada**
- `community_posts.media_type` — schema existe, mas só renderiza `<a>` truncado (não embeda `<img>`/`<video>`)
- `exercises.thumbnail_url` — **nunca usada**
- Tabela `testimonials` inteira tem seed + policies, **zero UI**
- Componentes `coming-soon.tsx` (em ambos route groups) — **zero imports**, dead code

### 5.4 Top 15 features que faltam — ranqueadas por impacto×esforço

| # | Feature | Esforço | Por quê | Onda |
|---|---|---|---|---|
| 1 | **Vídeo demonstrativo embeddado por exercício** | S | Schema 80% pronto (`video_url`, `video_source`, `thumbnail_url`); falta player inline no runner | I |
| 2 | **Anamnese / PAR-Q estruturado** | M | Bloqueador legal/CREF — Judson não pode prescrever sem PAR-Q nova aluna | I |
| 3 | **Avaliação física com timeline** | M | Tabelas `assessments` + `progress_photos` + gráfico de evolução. Diferencial gigantesco | I |
| 4 | **Pagamento Pix recorrente** (Asaas/Mercado Pago) | L | Destrava o modelo SaaS de verdade. Hoje toda cobrança é manual via WhatsApp | J |
| 5 | **Push notifications** (`@serwist/next` + subscriptions) | M | "Tem treino hoje", "3 dias sem treinar" — aumenta DAU 30-50% em fitness | J |
| 6 | **Player de mídia inline no feed** | S | `media_type` já existe; falta render `<img>`/`<video>` em vez de link truncado | I |
| 7 | **Chat 1:1 in-app aluna ↔ trainer** (texto + áudio) | L | Manda WhatsApp pra fora hoje. Trazer pra dentro = retenção + dado | K |
| 8 | **Avatar real com upload** | S | Schema pronto, falta UI no `/perfil/editar` + bucket | H |
| 9 | **Métricas de aderência no painel** | M | "Alunas em risco" (>7d sem treinar), % aderência. Justifica retenção em conversa de plano | I |
| 10 | **Conquistas/badges** | M | "1ª semana", "10 treinos", "30 dias seguidos". Combinado com share Insta = marketing orgânico | J |
| 11 | **Templates de treino reutilizáveis** | M | Biblioteca do trainer + clonar pra aluna. Reduz tempo de criação 70% | I |
| 12 | **Story de progresso compartilhável** | M | Card branded pra story do Insta — marketing orgânico feito pelas alunas | K |
| 13 | **Cronômetro de série (não só descanso)** | S | Adicionar `mode: reps \| seconds` + timer ativo. Diferencia | J |
| 14 | **Editar post + reações além de like** | S | Schema permite `reaction` text; faltam emojis (fire, heart, muscle, clap) | H |
| 15 | **Multi-tenant signup self-serve** | L | Página `/criar-conta-personal` cria tenant + Stripe. Pivô SaaS real | L |

---

## 6. Posicionamento competitivo — Judson vs Brasil

### 6.1 Mercado em 1 minuto

- **R$ 17 bi/ano** no fitness BR; segmento digital cresce **23%/ano**
- **64 mil empresas** ativas em fitness, **200 mil personals** cadastrados em apps
- Top 4 BR (TecnoFit, MFIT, Wiki4Fit, Vedius) compartilham **reclamações idênticas no Reclame Aqui**: suporte ruim, Pix integrado bugado, app fora do ar, cobrança indevida
- **Ninguém entrega PWA decente** — todos são app nativo. **Esse é o único diferencial técnico real do Judson App contra os 12 concorrentes BR pesquisados**
- White-label é **raro e caro**: Nexur R$ 789 + R$ 149-249/mês, Trainerize US$ 169 + add-ons. Wiki4Fit promete e é reclamado por não entregar

### 6.2 Matriz competitiva resumida (Judson App preenchido)

> Detalhe completo em [05-competition.md §3](05-competition.md). Aqui só o resumo das diferenças mais importantes.

| Feature | TecnoFit | MFIT | Wiki4Fit | Vedius | TreinoAI | Nexur | **Judson App hoje** |
|---|---|---|---|---|---|---|---|
| Cadastro por convite | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ **mais fluido (PWA)** |
| Anamnese / PAR-Q | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ **gap** |
| Avaliação física + foto progresso | ✅ | ✅ (11 protocolos) | ✅ | ✅ | ✅ | ✅ | ❌ **gap** |
| Vídeo embeddado por exercício | ✅ 600+ | ✅ 1.800 | ✅ 1.000 | ✅ 12.000 | ✅ 400 | ✅ 500 | ⚠️ **schema pronto, sem player inline** |
| Drag-drop builder | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Duplicar treino | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Periodização A/B/C | ⚠️ | ❌ | ⚠️ | ⚠️ | ✅ (única completa) | ✅ | ❌ **só dias da semana** |
| Runner com timer | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ **forte (RPE+confetti+upsert)** |
| Plano alimentar | ❌ | ❌ | ❌ | ⚠️ | ❌ | ❌ | ❌ (todos no zero) |
| Histórico + carga | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Gráficos de evolução | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ **gap** |
| Chat in-app | ✅ | ⚠️ | ✅ | ⚠️ | ⚠️ | ✅ | ❌ **só WhatsApp externo** |
| Push notifications | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ **gap crítico** |
| Pix recorrente | ✅ (com bugs) | ✅ | ⚠️ | ⚠️ | ✅ | ✅ | ❌ **manual via WhatsApp** |
| Cartão recorrente | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ **gap** |
| Gestão financeira | ✅ | ✅ | ✅ | ✅ | ✅ (recuperação automática) | ✅ | ❌ **gap** |
| Comunidade/feed | ✅ | ❌ | ✅ | ❌ | ❌ | ⚠️ | ✅ **com likes+comments** |
| Gamificação | ⚠️ | ❌ | ⚠️ | ❌ | ❌ | ✅ ranking | ⚠️ **streak cosmético** |
| Multi-tenant white-label | ❌ | ❌ | ⚠️ (queixas) | ❌ | ❌ | ✅ R$789+ | ⚠️ **schema pronto, single em prod** |
| **PWA instalável** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ ⭐ **único** |
| App nativo iOS+Android | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| LGPD impecável | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ **incompleto** |
| Suporte humano (RA) | ⚠️ ruim | ⚠️ ruim | ⚠️ ruim | ⚠️ médio | ? | ? | ⚠️ **WhatsApp Judson** |

**Tradução:** o Judson App é forte em **runner + onboarding + PWA + comunidade**; é fraco em **pagamento + push + anamnese + gráficos + chat**. Os fortes são únicos no mercado; os fracos são commodity que todos têm.

### 6.3 Os 6 pivôs estratégicos onde Judson pode LIDERAR de fato

1. **PWA mobile-first instalável de verdade** — único diferencial técnico real vs 12 concorrentes BR. Aluna recebe link no WhatsApp → instala em 1 toque → loga → treina. Sem fricção de loja.
2. **Onboarding sem fricção** — convite mágico por link (token assinado, sem senha forte, sem confirmação bloqueante).
3. **Suporte humano de verdade** — Tecnofit/MFIT/Wiki4Fit/Vedius todos com queixas idênticas no Reclame Aqui. Vira marca registrada do Judson App.
4. **White-label barato e bonito** — Trainerize US$169+, Nexur R$789+. Existe espaço pra Judson App entregar multi-tenant real por R$ 79-149/mês.
5. **UX feminina-friendly com mood esportivo** — Judson trabalha com mulheres; mood masculino+vermelho equilibra estética forte com linguagem acolhedora. Combinação rara.
6. **Pix recorrente que NÃO falha** — "Pix da Tecnofit não cobra alunos" é problema reportado em produção do líder. Janela aberta.

### 6.4 Onde NÃO faz sentido competir hoje

- **Plano alimentar completo** — só Trainerize entrega bem, custa US$ 45 extra. Postergar pra integração com nutricionista parceiro
- **AI body scan** — PersonalGO já tem 18 meses de vantagem
- **Vídeo-chamada in-app** — ninguém entrega bem; Daily.co/Twilio é caro. Falar pra usar Google Meet é OK
- **Marketplace de personals** — PersonalGO/Wellhub/Superprof dominam
- **Wearables** — Treinus diferencia mas é nicho. Postergar

---

## 7. Roadmap em ondas

> Mantendo a convenção do projeto (Ondas A-F já entregues; G em diante).

### Onda G — Pré-produção (BLOQUEIA tráfego pago) · ~3 dias

**Antes de qualquer cliente real tocar no app.**

- [ ] **CRIT-1:** `consume_invite` lock por `auth.uid()` (migration `0010`) — 1h
- [ ] **CRIT-2:** SW para de cachear HTML autenticado — 2h
- [ ] **CRIT-3:** Validar route params com Zod UUID + trocar `.or()` por queries `.eq()` — 1h
- [ ] **LGPD-BLOQ:** Checkbox de aceite Termos+Privacidade no `/invite` e `/aluna/entrar` + tabela `consents` — 3h
- [ ] **`auth_role()`/`auth_tenant_id()` → SECURITY INVOKER** + `set_referral_code` search_path — 30min
- [ ] **Habilitar HaveIBeenPwned** no Supabase Auth (1 toggle no painel)
- [ ] **`lucide-react` → versão correta `0.460.x`** + testar 42 arquivos — 2h
- [ ] **`import "server-only"`** em `lib/supabase/server.ts` + `lib/auth.ts` — 15min
- [ ] **Rate-limit Upstash Redis** (mesma interface) — 1h
- [ ] **Sentry + Vercel Analytics + Speed Insights** — 1h

**Estimativa: 12-15h. Resultado: app vai pra produção sem risco crítico.**

### Onda H — LGPD impecável + UX core · ~1 semana

- [ ] Política de privacidade completa (CNPJ, DPO, art. 7/11, transferência internacional, retenção, menores) — 3h + revisão jurídica
- [ ] Termos completos (foro, lei, IP, licença conteúdo, pagamento, vigência) — 2h + revisão
- [ ] Endpoints `/perfil/exportar-dados` (JSON) e `/perfil/excluir-conta` (soft-delete + anonimização) — 4h
- [ ] **`confirm()` → Dialog brand** no runner — 1h
- [ ] **Botões 44px+ + tap feedback** sistêmico — 1h
- [ ] **Splash icon convertido pra path** — 1h
- [ ] **Safe-area-inset-top no trainer-header + remover `viewport.maximumScale`** — 30min
- [ ] **Componentes unificados** EmptyState, PageHeader, StatCard — 3h
- [ ] **`src/lib/dates.ts`** (DRY de helpers duplicados) — 1h
- [ ] **`global-error.tsx`** + `error.tsx` por segmento — 1h
- [ ] **CSP nonced** via Proxy + `next.config.ts` `optimizePackageImports` + `images.remotePatterns` — 2h
- [ ] **Avatar com upload real** — schema pronto, faltam UI + bucket — 2h
- [ ] **Editar post + reações além de like** — 2h
- [ ] **Cookie banner one-time** — 1h

**Estimativa: ~25h trabalho + revisão jurídica externa.**

### Onda I — Features must-have · ~2 semanas

- [ ] **Vídeo demonstrativo embeddado** no runner (YouTube/Instagram embed) — 4h
- [ ] **Anamnese / PAR-Q estruturado** — tabela + fluxo na primeira sessão + link no painel — 8h
- [ ] **Avaliação física + foto progresso** — tabelas `assessments` + `progress_photos` + bucket privado + gráfico de evolução — 12h
- [ ] **Player de mídia inline no feed** (`<img>`/`<video>` baseado em `media_type`) — 2h
- [ ] **Métricas de aderência no dashboard** — % aderência, alunas em risco — 4h
- [ ] **Templates de treino reutilizáveis** — biblioteca do trainer + clonar pra aluna — 6h
- [ ] **Page transitions Framer Motion** + tap feedback global — 3h
- [ ] **Personalidade visual** — foto B&W Judson + grain + assinatura — 1 dia + sessão de fotos
- [ ] **Hero da home invertido** (streak XL) + heatmap 7 dias — 3h
- [ ] **Bottom nav com ícones filled ativos** + barra ativa proeminente — 2h
- [ ] **Inputs gigantes no runner** + barra de progresso sticky — 3h
- [ ] **Refactor `saveWorkoutItemsAction` pra upsert por ID estável** — 4h
- [ ] **Vitest + Playwright** com 5 fluxos críticos — semana

**Estimativa: ~50h. Resultado: paritário com top 4 BR + diferencial em runner+UX.**

### Onda J — Pagamento + Push + Gamificação · ~2 semanas

- [ ] **Pix recorrente via Asaas ou Mercado Pago** — webhook + tabela `subscriptions` + dashboard inadimplência — 16h
- [ ] **Cartão recorrente** mesmo provedor — 4h
- [ ] **Push notifications** via `@serwist/next` + tabela `push_subscriptions` + cron "tem treino hoje" + "3 dias sem treinar" — 12h
- [ ] **Conquistas/badges** — "1ª semana", "10 treinos", "30 dias seguidos" — 6h
- [ ] **Cronômetro de série** (`mode: reps | seconds`) — 3h
- [ ] **Streak gamificado real** + Strength Score 0-100 por grupo muscular (estilo FitBod) — 4h
- [ ] **Edge Function de cron** pra envios diários — 2h

**Estimativa: ~50h. Resultado: app cobrável de verdade + retenção via push/badges.**

### Onda K — Chat in-app + Story compartilhável · ~2 semanas

- [ ] **Chat 1:1 aluna ↔ trainer** (texto + áudio + imagem) via Supabase Realtime — 20h
- [ ] **Story de progresso compartilhável** — card branded pra Insta após treino concluído / mensal — 8h
- [ ] **Comentários e curtidas no painel do trainer** (visão completa do feed) — 4h
- [ ] **Upload de mídia em buckets privados por tenant** — 4h

**Estimativa: ~40h.**

### Onda L — Pivô SaaS multi-tenant · ~1 mês

- [ ] **Resolver tenant via `request.host`** (custom_domain ou subdomínio) — 4h
- [ ] **Página `/criar-conta-personal`** + Stripe pra cobrar o personal mensalmente — 16h
- [ ] **Onboarding self-serve** (sem auto-provision atual) — 8h
- [ ] **Domínio custom resolution** + SSL automático Vercel — 4h
- [ ] **Audit log obrigatório** (multi-tenant compliance) — 8h
- [ ] **i18n** pelo menos PT-BR + ES — 8h
- [ ] **Apps Capacitor** wrappers iOS+Android pras lojas (1 build por tenant) — 1 semana

**Estimativa: ~80-120h. Resultado: SaaS white-label real cobrável de outros personals.**

---

## 8. Resposta direta às 4 dimensões pedidas

### 🛡️ Termos de utilização

**Status:** existem, faltam ~10 itens críticos por LGPD.
**Próximo passo:** Onda H — completar política + termos + revisão jurídica + mecanismo self-service.
**Bloqueador imediato:** sem checkbox de aceite no `/invite`, **toda aluna cadastrada hoje gerou tratamento de dado sem base legal**.

### 🛠️ Ferramentas

**Status:** stack moderna mas com bugs (`lucide-react` errado, deps não usadas, rate-limit em memória, observabilidade quase zero, zero teste).
**Próximo passo:** Onda G — Sentry + Analytics + Speed Insights + corrigir lucide + Upstash + `server-only`. Onda H — `next.config.ts` completo (CSP, optimizePackageImports, images, reactCompiler).
**Para chegar a "alto nível":** + Vitest + Playwright + Workbox via `@serwist/next` + logger estruturado.

### 🎨 Aparência

**Status:** **5.5/10**. Fundação técnica sólida, identidade visual fraca (4.5/10).
**Próximo passo:** os 12 fixes ranqueados em §4.3. Top 5 são fáceis (`confirm()`, botões 44px, splash path, page transitions, tap feedback).
**Para chegar a "alto nível":** investir em **personalidade da marca Judson** — foto B&W + grain + assinatura visual. Sem isso, será sempre "shadcn-com-vermelho".

### ⚙️ Funções

**Status:** TRAINER e ALUNA têm CRUD básico funcional + runner robusto + comunidade. Mas falta o que viraram commodity no mercado.
**Próximo passo:** Onda I (vídeo embeddado, anamnese, avaliação física, métricas trainer, templates) — paritário com top 4 BR. Onda J (pagamento + push + badges) — viabiliza modelo cobrável. Onda K (chat + story).
**Para chegar a "alto nível":** Ondas I+J+K. Para virar **SaaS de fato**, Onda L.

---

## 9. Verdict honesto

O Judson App **não é mais um MVP**. É um produto bem desenhado, com decisões de arquitetura corretas (multi-tenant ready, RSC-first, RLS hardened, padrão consistente). Está num patamar acima da média de "primeiro projeto".

Mas para virar "**o melhor do Brasil**" tem que entender que:

1. **Não basta ser melhor que MVP.** Tem que ser melhor que TecnoFit (B2B consolidado), MFIT (200k personals, R$10/mês), TreinoAI (IA real). Isso significa fechar **todos** os gaps de commodity (pagamento, push, anamnese, avaliação, gráficos, chat) **e** entregar o que ninguém entrega (PWA fluido, suporte humano, white-label barato, UX feminina-esportiva, Pix que funciona).

2. **A janela é real.** Top 4 brasileiros têm reclamações idênticas no Reclame Aqui. Mercado fragmentado, suporte unanimemente ruim, ninguém faz PWA decente. **A vaga existe.**

3. **O caminho é claro mas não é curto.** Ondas G+H+I+J+K = ~150-200h de trabalho + revisão jurídica + sessão de fotos + fechar contrato com Asaas/Mercado Pago. Calendário realista: **3-4 meses de execução focada** pra chegar em paridade-com-melhores+diferenciais. Onda L (pivô SaaS) é mais 1-2 meses.

4. **Ordem importa.** Onda G primeiro (segurança+LGPD), porque sem isso o app não pode ter cliente pagante real. Depois Onda H+I em paralelo (LGPD+UX+features paritárias). Depois J (pagamento desbloqueia receita). Depois K (chat+story = viralidade). Depois L (SaaS = escalabilidade).

5. **O cliente-zero é o ativo mais valioso.** Cada bug que o Judson reportar e cada feature que ele pedir nos próximos 60 dias é mais valioso do que qualquer plano teórico. **Cobrir Onda G fast e botar ele usando** é a coisa mais importante.

---

*Análise consolidada — Claude (Opus 4.7, 1M context) — 2026-05-07.*
*Fontes: 5 análises paralelas em `.analysis/01-tech-stack.md` até `05-competition.md`.*
