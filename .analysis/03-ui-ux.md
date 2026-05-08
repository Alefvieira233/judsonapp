# Auditoria UI/UX — Judson App

**Auditor:** Claude (modo designer)
**Data:** 2026-05-07
**Stack auditada:** Next.js 16 + Tailwind 4 + shadcn (`base-nova`) + Base UI + Sonner + Lucide. Nenhuma menção real a Framer Motion (apesar de instalado).
**Concorrência mental:** TecnoFit, Pacto Soluções, Trainer App, Centr, Whoop, Strava, Nike Training Club, Freeletics.

---

## TL;DR — Score por dimensão

| Dimensão                          | Score | Comentário curto |
|-----------------------------------|:-----:|------------------|
| **Sistema de design (tokens)**    | 7/10  | Tokens limpos, mapeados a shadcn, mas radii/sombras genéricas e nenhuma escala tipográfica. |
| **Componentes UI**                | 5/10  | Cobertura básica (Button, Input, Sheet, Dialog, Toast, Skeleton); falta Switch, Toggle, Progress, Alert, Stepper, RadioGroup, Slider, NumericInput, IconButton brand. |
| **Navegação (mobile + sidebar)** | 6.5/10| Bottom nav OK e safe-area correta, mas sem ícone "ativo" preenchido, sem haptic, sem badge de notificação, label minúscula 11px. |
| **Feedback / loading / states**   | 6.5/10| Skeletons existem e são fiéis ao layout, mas todos genéricos (cinza pulsando). Nenhuma animação de stagger. `confirm()` nativo no runner é ruim. |
| **Microinterações / motion**      | 2/10  | **Framer Motion instalado mas NUNCA usado.** Zero page transitions, zero scale-on-tap, zero spring nos sheets. Só confetti no fim do treino. |
| **Acessibilidade**                | 5.5/10| `aria-current`, `aria-pressed`, `aria-hidden` e `sr-only` em uso, mas botões essenciais sem `aria-label`, contraste do `text-muted-foreground` (#A3A3A3 sobre #0A0A0A) está borderline e o accent vermelho `#DC2626` tem contraste 4.6:1 que é AA mas falha AAA. Touch targets do bottom nav (56px) OK; runner tem inputs `h-9` (36px) que não atinge 44pt. |
| **Mobile-first**                  | 7/10  | Layout responsivo, safe-area presente, sheets viram modal centrado em desktop. Mas viewport `maximumScale: 1` é hostil a baixa visão; nenhum `overscroll-behavior`; faltam pull-to-refresh visuals. |
| **Identidade visual de marca**    | 4.5/10| **Maior fraqueza.** Bebas Neue está carregada via `next/font`, mas o app inteiro é cinza-com-vermelho-mínimo. Nada que evoque "alta intensidade", "atleta", "esportivo". Sem fotografia, sem grain, sem accents de tipografia condensada além do display. Cards e listas idênticos a um SaaS B2B genérico. |
| **PWA polish**                    | 6/10  | Manifest e splashes OK em todos os tamanhos iPhone modernos. Ícone PWA (`icon.svg`) usa "JL" em **Bebas Neue como fonte do sistema** — em qualquer device sem Bebas instalado, vira Arial Narrow / Impact. Inaceitável pro splash. |

**Score global ponderado: 5.5 / 10.** Bom esqueleto, fundo dark consistente, layout mobile competente. Mas falta personalidade. Hoje o app parece um shadcn-starter pintado de vermelho — não um produto premium do Judson Lobato.

---

## 1. Sistema de design

### Pontos fortes
- `globals.css:73-117` define **brand atoms** + mapeia para **shadcn slots**. Arquitetura correta.
- Multi-tenant via CSS vars (`brandStyleVars` em `src/lib/tenant.ts:39`) é uma decisão ótima e madura.
- Sem hardcodes espalhados — apenas o `runner.tsx:71-86` (confetti) e `globals.css` têm hex.
- Tailwind 4 CSS-first via `@theme inline` está corretamente usado.

### Problemas

**1.1 Falta escala tipográfica** — `src/app/globals.css:131-135`
```css
h1, h2, h3, h4, h5, h6, .font-display {
  font-family: var(--font-display);
  letter-spacing: 0.01em;
}
```
Aplica Bebas Neue a TODA tag de heading mas não define `font-size`/`line-height`/`font-weight` por nível. Resultado: cada página inventa o seu (`text-3xl`, `text-4xl`, `text-5xl`, `text-6xl`, `text-8xl`). Ver: `home/page.tsx:139` (`text-5xl`), `dashboard/page.tsx:117` (`text-5xl md:text-6xl`), `treinos/page.tsx:47` (`text-4xl`), `aluna/entrar/page.tsx:32` (`text-5xl`). É inconsistente e quebra a hierarquia.
**Fix:** definir `--text-display-1`, `display-2`, `display-3` + classes utilitárias `.h1`, `.h2`, `.h3` e usar em vez de tamanho ad-hoc.

**1.2 Bebas Neue só pesa 400** — `src/app/layout.tsx:15-20`
Bebas Neue só existe em 400 mesmo, mas o `card.tsx:41` aplica `font-medium` no `CardTitle` (`font-medium`). Isso não tem efeito visual. **Pior**: alguns lugares chamam `font-display font-medium` (sem efeito) e outros `font-display` puro — comportamento idêntico mas leitor pensa que tem variação. Limpe.

**1.3 Letter-spacing inconsistente nos eyebrows** — em todo lugar:
- `tracking-[0.4em]` (home, welcome, login, planos, perfil header)
- `tracking-[0.3em]` (cards/seções)
- `tracking-[0.2em]` (chips menores)
- `tracking-[0.15em]` (comments)

Sem regra escrita. Padronize 2 níveis: `--tracking-eyebrow-strong: 0.4em`, `--tracking-eyebrow: 0.25em`.

**1.4 Radius sem identidade** — `src/app/globals.css:58-64` define a escala mas é proporcional simples (0.6×, 0.8×, 1×, 1.4×, 1.8×, 2.2×, 2.6×). Os `rounded-xl`, `rounded-2xl`, `rounded-3xl` ficam redondinhos demais para o mood "esportivo intenso". TecnoFit, Whoop e Freeletics usam radii 8-12px máximo. Sugestão: reduza `--radius` de `0.5rem` para `0.375rem` e use cantos vivos (radii 8/12/16) em vez de pills generosos. Fica mais "atleta", menos "wellness app".

**1.5 Nenhuma sombra/elevation no design system** — Cards usam `ring-1 ring-foreground/10` (`card.tsx:15`). Não há `--shadow-1`, `--shadow-2`. Strava e Whoop usam shadow + rim-light sutil para diferenciar superfícies. Adicione tokens.

**1.6 `--accent` é igual a `--secondary` é igual a `#262626`** — `globals.css:91, 95`. Slot vazio. Quando a marca quiser usar verde de "completed" ou amarelo de "alerta", não tem onde encaixar. Sugiro adicionar `--success: #16A34A` e `--warning: #F59E0B` nos atoms (sem usar agora, para não bagunçar, mas reserve as variáveis).

**1.7 Falta um token de "elevated surface"** — Hoje todo card usa `bg-card/40`, `bg-card/30`, `bg-card/60`. **Sete combinações diferentes** só nas páginas que abri. Crie tokens semânticos: `--surface-1` (level 0 card), `--surface-2` (hover/elevated). Hoje a hierarquia visual é só "opacidade tentando inventar profundidade".

---

## 2. Componentes UI (`src/components/ui/`)

Existem: `avatar`, `badge`, `button`, `card`, `dialog`, `dropdown-menu`, `input`, `label`, `select`, `separator`, `sheet`, `skeleton`, `sonner`, `tabs`, `textarea`. **15 componentes**.

### Faltam (sentidos no código real)
- **Switch / Toggle** — `(trainer)/settings`, `(trainer)/students` precisam ativar/desativar; hoje provavelmente é checkbox nativo ou botão custom.
- **Progress** — runner tem `doneSets/totalSets` (`runner.tsx:275`) mostrado como string. **Deveria** ter barra de progresso linear ou ring. Whoop e Nike fazem isso lindamente.
- **RadioGroup / SegmentedControl** — `runner.tsx:523-538` re-implementa botões 1-10 inline pro RPE. Devia ser `Segmented` reutilizável.
- **Slider** — RPE 1-10 também ficaria 10x mais natural com slider tátil. TecnoFit e Centr usam slider para esforço.
- **Alert / Banner** — toda mensagem de erro hoje é um `<p role="alert">` montado na mão (ex. `aluna/entrar/login-form.tsx:60-65`). Deveria ter um `<Alert variant="error">`.
- **NumericInput / Stepper** — `runner.tsx:408-427` tem `Input` com `inputMode="numeric"` e regex pra filtrar caracteres. Deveria ter `<NumericInput>` com botões − / + de incremento (típico em Strong, Hevy, FitNotes — o competidor direto pra UI de runner).
- **EmptyState** — repetido 5+ vezes no código com markup quase idêntico (home, treinos, feed, planos, perfil). Componente unificado: `<EmptyState title="…" description="…" action={…} icon={…} />`.
- **Stat / KpiCard** — duplicado em `home/page.tsx:292`, `perfil/page.tsx:352`, `dashboard/page.tsx:250`. Três variantes diferentes pro mesmo conceito.
- **Tag / Chip** — usado para "Mais popular" (planos), filtros ("Ativas/Inativas"), badges de dia da semana — implementado inline com classes diferentes em cada lugar.
- **PageHeader** — header com eyebrow + h1 + subtitle aparece em **toda** página (welcome, treinos, home, dashboard, planos, perfil…). Componente unificado.
- **IconButton brand-styled** — pause/skip/close repetem o padrão `grid size-10 place-items-center rounded-md` sem componente.

### Componentes que existem mas têm problema

**2.1 `button.tsx:23` — tamanho default `h-8` (32px) é pequeno demais para mobile**
```ts
default: "h-8 gap-1.5 px-2.5 …"
```
WCAG / Apple HIG / Material recomendam **44pt mínimo**. O `lg` (`h-9`/36px) ainda fica abaixo. **Mobile-first quebra aqui.** Sugestão:
```ts
sm: "h-9 …"
default: "h-10 …"
lg: "h-12 …"
xl: "h-14 …" // CTA principal (estilo Whoop/Strava)
```
A maioria do app usa `size="lg"` justamente fugindo do default — sintoma de tamanho default errado.

**2.2 `button.tsx:11` — `default` variant não tem hover**
```ts
default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80"
```
O hover só dispara quando o botão está dentro de `<a>`. Em `<button>` puro **não tem feedback hover**. Corrija: `hover:bg-primary/90 active:bg-primary/80 active:scale-[0.98]`.

**2.3 `button.tsx:7` — falta `active:scale`**
Para sentir tátil em mobile (haptic visual). Adicione `active:translate-y-px` já existe, mas `active:scale-[0.98]` fica mais "premium".

**2.4 `card.tsx:15` — `ring-1 ring-foreground/10` em todo card**
Todo Card tem ring branco translúcido. Nas listas (home, treinos, perfil, dashboard) **nada usa o componente `<Card>`** — usa `div + className` direto. Resultado: o `<Card>` da pasta `ui/` é praticamente código morto. Auditoria: `grep -r "from \"@/components/ui/card\"" src/` retorna **só dialogs e empty states do trainer**, nunca o app principal. Decida: ou o Card abraça o padrão real do app (border + bg-card/40 + rounded-2xl), ou abandone-o e crie um componente menor (`<Surface>`).

**2.5 `skeleton.tsx:9` — `animate-pulse` é a animação shadcn padrão**
Funciona, mas é genérica. Whoop e Centr usam **shimmer** (gradient sweep) que comunica "carregando do servidor" muito melhor que pulse. Em Tailwind 4 isso é uma `@keyframes shimmer` simples + `bg-gradient-to-r animate-[shimmer_1.5s_infinite]`. Custo baixo, ganho perceptual grande.

**2.6 `sonner.tsx:33-36` — toast usa `--popover` (cinza)**
Toda mensagem de erro/sucesso vem em cinza neutro (`--popover: var(--brand-surface)`). Sucesso devia ter borda verde, erro borda vermelha (já há `richColors` em `layout.tsx:96` mas o style sobrescreve). Verifique no browser; se `richColors` foi anulado, libere os tokens de cor por estado.

**2.7 `dialog.tsx:56` — `max-w-sm` em desktop**
Dialog cabe 384px no desktop, e a animação é `zoom-in-95` + `fade-in-0`. Funciona mas é genérica shadcn. Em produto premium (Linear, Notion, Vercel) o dialog tem **spring** (overshoot leve). Você tem Framer Motion instalado e não usa.

**2.8 `sheet.tsx` — sem drag-to-dismiss em mobile**
Bottom sheets se abrem e fecham só por click no overlay ou X. Em iOS / Android nativo o usuário arrasta pra baixo. Hoje impossível. Considere `vaul` (drawer-only) ou implemente com Framer Motion + drag handle visível no topo (linha de 4×40 cinza). Hoje **não tem drag handle visível** nos bottom sheets.

---

## 3. Layout e navegação

**3.1 Bottom nav: visual fraco** — `(student)/_nav/nav-link.tsx:20-31` e `(trainer)/_nav/nav-link.tsx:46-63`
- Sem **ícone preenchido** quando ativo. Apple e Material orientam: idle = outline, active = filled. Lucide tem versões filled (`HomeIcon` outline + você implementa ou usa pares). Hoje só muda a cor do label e aparece uma barrinha em cima.
- A barrinha ativa em `nav-link.tsx:27` (`h-0.5 w-10`) é **muito sutil** e fica cortada em cima da `border-t` do container — quase invisível.
- Texto label `text-[11px]` (linha 31) é minúsculo, abaixo do legível pra alguns usuários.
- Sem badge de notificação (e o feed/comunidade vai precisar — "3 posts novos").

**3.2 Trainer bottom nav tem 5 colunas com botão "Mais"** — `(trainer)/_nav/bottom-nav.tsx:18`
Funciona, mas **se aberto numa tela larga** (usuário com tablet vertical), o sidebar e o bottom-nav coexistem confusamente. Já mitigado com `md:hidden`/`md:flex`, mas melhore o break: `md:` vira sidebar entre 768-1024px que é agressivo. Tablets em portrait (iPad mini ~768) deveriam ainda ter bottom nav. Use `lg:` ou `xl:`.

**3.3 Sidebar trainer não tem indicador ativo proeminente** — `_nav/sidebar.tsx:47-55`
NavLink ativo só fica `bg-card text-foreground` (`nav-link.tsx:26`). Sem barra lateral à esquerda no item ativo (padrão Linear, Notion, Vercel). Adicione `before:absolute before:left-0 before:top-1 before:bottom-1 before:w-0.5 before:bg-[var(--brand-primary)] before:rounded-r` na variant `sidebar`.

**3.4 Trainer header mobile vazio** — `trainer-header.tsx:12-34`
Logo + nome do tenant + iniciais do user. Sem hamburguer pra abrir sidebar (não há sidebar em mobile, OK), sem search global, sem notificações. Fica visualmente vazio. Sugestões: adicione um campo de busca global ou um botão de ação contextual por página (ex.: "+ Nova aluna" na página de students).

**3.5 Sem "back" consistente** — Páginas detalhe do treino (`treinos/[id]/page.tsx:114-119`) e planos (`planos/page.tsx:48-53`) implementam o link "← Treinos" inline. Em produto polido isso é uma `<PageHeader.Back href="/treinos">` reusable + ícone consistente. Hoje cada página decide tamanho do ícone (`size-3.5`) e cor própria.

**3.6 `(student)/welcome/page.tsx:30-50` é uma página fantasma** — Layout claro que normalmente faz redirect. Tirando o redirect, mostra mensagem "App está sendo finalizado" — confunde. Ou redirecione **sempre** ou faça uma página real. Hoje é zumbi.

---

## 4. Páginas críticas — review

### 4.1 `src/app/(student)/home/page.tsx`

**Pontos fortes:**
- Hero com gradient + blur orb (linhas 130-134) — sinal de atenção visual.
- Stats "Streak / Total / Plano" como pills (linha 146-165) — direto ao ponto.
- Card "Treino de hoje" destacado (linhas 170-192) com gradiente vermelho — boa hierarquia.
- Empty state amigável quando não há treino.

**Problemas:**
- **Hero genérico-shadcn-show-and-tell.** Nenhuma foto do Judson, nenhum ícone esportivo, nenhuma forma geométrica que evoque movimento. Compare com Nike Training Club: foto fullscreen com overlay gradient. Aqui poderia ser uma foto B&W do Judson ou do ginásio com overlay. Custo: 1 foto.
- Quando a aluna abre o app de manhã, o que ela quer ver é **um número grande** (streak, dia X de Y) — hoje o nome dela ocupa o display 5xl mas o streak fica num pill de 12px. Inverta a hierarquia: streak XL + nome menor.
- **Faltam shortcuts de ação** no hero: "Iniciar treino de hoje" deveria ser um botão grande embaixo do nome. Hoje precisa rolar e clicar no card.
- **Linha 273-287** card "Comunidade" no fim da home tem o mesmo peso visual que cards 234-271 (planos, indicações). Decisão: ou agrupa todos em "Mais", ou cria uma seção "Próximos passos".
- Nenhum gráfico/visualização de progresso. Strava/Whoop sempre mostram pelo menos uma curva ou heatmap de 7 dias. Você tem `completedDates` na linha 120, perfeito pra renderizar uma stripe de 7 dias com bolinhas preenchidas.

### 4.2 `src/app/(student)/treinos/[id]/runner.tsx`

**Esta é a tela MAIS importante do app** — onde a aluna passa 45min. Reflito mais aqui.

**Pontos fortes:**
- Confetti no fim (`runner.tsx:66-90`) é um toque brand-aware (cores da marca).
- Sticky CTA "Concluir treino" (linha 345) — boa decisão.
- Set marca optimisticamente, salva no servidor — UX certa.
- Rest overlay (linha 458-490) na cor do brand.

**Problemas críticos:**

**4.2.1 — `confirm()` nativo (linha 175)**
```ts
if (!confirm("Cancelar treino? …")) return;
```
**Inaceitável em 2026.** Quebra dark mode (mostra um modal cinza-claro do iOS). Use o `Dialog` do projeto ou um sheet de confirmação.

**4.2.2 — Sem barra de progresso** (linha 274-275)
```ts
<p className="text-xs text-muted-foreground">
  {doneSets}/{totalSets} séries · {items.length} exercícios
</p>
```
Mostra como string. Numa ferramenta concorrente (Strong, Hevy, Centr) isso é uma **barra de progresso linear** no topo, sticky com a header. Custo: trivial. Ganho: enorme percepção de avanço.

**4.2.3 — Inputs de set são pequenos demais** (linha 416, 426)
`h-9 max-w-[64px]` e `h-9 max-w-[88px]` para reps e kg. **Em dedo molhado de academia com luva**, isso é frustrante. Touch target deveria ser 48-56px de altura. E o número devia ser BIG e centrado tipo display de calculadora. Inspire-se em Strong (input gigante, bold, monoespaçado).

**4.2.4 — Botão de check (linha 428) é o único bem dimensionado** (`size-10`).
Mas falta haptic-like animation. Marcou o set → devia ter um `scale: 1 → 1.15 → 1` + check spring. Hoje só muda cor.

**4.2.5 — Rest overlay (linha 458) bloqueia 1/3 inferior**
Ele empilha COM o sticky CTA "Concluir treino" (linha 345). Veja: rest está em `bottom-[calc(140px+...)]` e CTA em `bottom-[calc(76px+...)]`. Se o rest aparece, o usuário vê 2 elementos flutuantes empilhados perto do bottom nav. Visual confuso. Decisão: **rest deve substituir o CTA** durante o descanso (ou ficar topo, sticky em bottom-only após o nav). Inspire-se em Hevy: durante rest, o card de rest VIRA o CTA primário, com countdown grande no centro.

**4.2.6 — Rest sem som / sem haptic / sem fim claro**
Quando acaba, o overlay simplesmente desaparece. Sem toast ("Bora!"), sem som (mesmo que silencioso por default). Na competição (Centr, Freeletics) sempre tem toque + texto motivacional.

**4.2.7 — RPE 1-10 grid (linha 523-538)**
Botões 10 colunas em `grid-cols-10`, cada um `h-10`. Em iPhone SE (320px useful), são botões de 28px. **Quebra touch target.** Use slider ou agrupe em 3 zonas (leve / médio / pesado).

**4.2.8 — Falta histórico imediato do exercício**
A aluna está no exercício "Supino reto". Ela quer ver "última vez 3×8 com 20kg". Hoje aparece em `text-xs` cinza linha 306-312 misturado com outras infos. **Eleve isso**: pequeno banner "Última: 3×8 · 20kg · há 4 dias" com background sutil + ícone. Strong, Hevy, RP Hypertrophy fazem isso o tempo todo.

### 4.3 `src/app/(trainer)/dashboard/page.tsx`

**Pontos fortes:**
- Hero com gradient + blur orb consistente com home da aluna.
- KPIs em 4 cards (linha 144-169) — padrão sólido.
- Última atividade com timeline + iconinhos (linha 194-220) — bom.

**Problemas:**
- **KPIs sem trend** — só número. Compare com TecnoFit / Pacto: mostram "Alunas ativas: 18 ↑ 3 essa semana" com seta verde. Hoje é só "18". Sem dimensão temporal, é estático.
- **Sem gráfico** de "treinos por dia da semana" ou "alunas mais ativas". Tem dados pra isso (já busca os últimos 6 logs); poderia plotar últimas 4 semanas como barras. **A página inteira não tem 1 chart.** Para personal manager, isso é pobre.
- **QuickLinks (linha 224-244)** repetem o padrão card+título+desc 4 vezes em coluna. Em desktop ficaria melhor como icon-buttons grandes em grade 2×2 (estilo Linear sidebar shortcuts).
- **Activity items (linha 196-219)** não têm avatar da aluna — só um ícone de halter genérico. Aluna+avatar(iniciais) deixaria pessoal.

### 4.4 `src/app/aluna/entrar/page.tsx` + `login-form.tsx`

**Pontos fortes:**
- Header centrado, eyebrow + título display + form simples.
- Estado de sucesso ("Confere teu email") com check icon — feedback OK.

**Problemas:**
- **Visual genérico shadcn login.** Nada que diga "Judson". Adicione: foto/silhueta sutil ao fundo, ou uma marca d'água "JL" gigante esmaecida atrás do card.
- **Sem benefícios listados** — login pra que? "Hoje você acompanha treinos, comunidade…" Lista 3 features.
- **Erro inline** (`login-form.tsx:60`) é um div com border destructive — ok, mas não anima entrada. Use Framer Motion para slide-in.
- Botão "Receber link no email" é `size="lg"` (`h-9` = 36px) — pequeno pra CTA principal de uma tela cheia. Devia ser `h-12` ou `h-14`.

### 4.5 `src/app/welcome/page.tsx`
Já comentado em §3.6 — é página fantasma de redirect. Se ela jamais renderiza, remova o JSX (`redirect` quebra a renderização). Se renderiza em casos de borda, faça uma tela de boas-vindas REAL (logo, animação, frase do Judson).

### 4.6 `src/app/(student)/perfil/page.tsx`

**Pontos fortes:**
- Header com avatar quadrado vermelho com inicial (linha 143) — consistente com brand.
- Stats em 3 cards, cards de plano, indicação, histórico, ações finais. Estrutura completa.
- Card de "Indique uma amiga" (linha 209-287) tem hierarquia interna correta (título + descrição + código copiável + CTA WA + lista de indicações).

**Problemas:**
- **Avatar quadrado 16×16** (`size-16`) com inicial em Bebas — bom. Mas o app inteiro (sidebar trainer, trainer header, students list) usa **círculos/quadrados misturados** sem regra. Decisão: ou todo avatar é quadrado-rounded-2xl, ou todo é círculo. Não os dois.
- Stats cards (linha 159-179) repetem o componente local `Stat` que existe em `home/page.tsx:292` com signature diferente. **Duplique não.** Componentize.
- Lista de histórico (linha 302-321) só mostra `título · data · duração · RPE`. Sem ícone, sem expand. Em apps premium isso vira um card com mini-progress bar do treino e tap pra ver detalhe.

---

## 5. Microinterações e motion

**SCORE 2/10** porque `framer-motion` consta no `package.json:22` mas `grep -r "framer-motion\|motion\." src/` retorna **zero matches**. Está instalado e não usado.

### O que está faltando (pequenas vitórias visuais):
- **Page transitions** — `<motion.div initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} />` entre rotas. Custo: 30 linhas. Ganho: app deixa de parecer "site" e vira "app".
- **Stagger nas listas** — Cards entrando em série (delay de 30ms cada). Sentido em treinos, alunas, posts do feed.
- **Spring nos sheets/dialogs** — Hoje é `transition-all` linear. Use `motion` com spring.
- **Tap feedback** — `whileTap={{ scale: 0.97 }}` em botões e cards clicáveis. Fundamental no mobile.
- **Set marcado** — quando bate o check no runner (`runner.tsx:428-443`), animar `scale: 1 → 1.2 → 1` e o check com path drawing.
- **Streak count up** — quando entra na home, contador 0→N animado. Hoje aparece estático.
- **Confetti** — único motion existente, e é decente. Mantenha.

### Page transitions recomendadas
Use `template.tsx` por route group:

```tsx
"use client";
import { motion } from "framer-motion";
export default function Template({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

---

## 6. Acessibilidade (a11y)

**6.1 Contraste**
- `--brand-text-muted: #A3A3A3` sobre `#0A0A0A` = **6.4:1** — passa AA pra texto normal mas falha AAA pra texto pequeno (12px). Considere `#B8B8B8` (~7.5:1).
- `--brand-primary: #DC2626` como fundo com `text-white` = **4.6:1** — passa AA mas fica no limite. Em botões pequenos (badge, set checkmark) pode ficar duro pra baixa visão. Sem fix urgente, mas nota mental.
- **Chips de dia ativo** (`treinos/page.tsx:96-100`): `bg-[var(--brand-primary)] text-white` — letras D/S/T em 10px. Vermelho + branco em 10px é cansativo. Considere fundo com mais saturação em hover.

**6.2 Foco visível**
- Botões/inputs do shadcn já têm `focus-visible:ring-3 focus-visible:ring-ring/50` — bom.
- **Cards clicáveis** (Link wrappers) em home, treinos, perfil **NÃO** têm `focus-visible:ring`. Usuário tab navegando vê só uma border default do browser.
- **Bottom nav links** (`nav-link.tsx`) também sem ring de foco visível.

**6.3 Skip link**
- **Inexistente.** Usuário com leitor de tela tem que tabar por todo bottom nav antes de chegar ao conteúdo. Adicione `<a href="#main" className="sr-only focus:not-sr-only ...">Pular para conteúdo</a>` no layout.

**6.4 Touch targets**
- Bottom nav: `min-h-[56px]` ou `min-h-[44px]` — OK.
- Set check button: `size-10` (40px) — **abaixo de 44pt**. Aumente.
- RPE buttons: `h-10` (40px) com largura ~30px em iPhone SE — **falha**.
- Set inputs: `h-9` (36px) — falha.
- Pause/Skip rest buttons: `size-10` (40px) — falha.

**6.5 Reduce-motion**
- `confetti.disableForReducedMotion: true` (`runner.tsx:73, 80, 86`) — bom!
- Mas `animate-pulse` no skeleton e `transition-colors` em todo lugar não respeitam `prefers-reduced-motion`. Adicione um `@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }` ou equivalente Tailwind.

**6.6 Semântica**
- Bom uso de `<header>`, `<nav>`, `<section>`, `<article>` em geral.
- `aria-current="page"` no nav link ativo — correto.
- Mas em `home/page.tsx:171-192` o "Card de treino de hoje" é um `<Link>` envolvendo `<div>` — sem role explícito. Está OK pelo HTML mas considere `<article>` + link interno em vez de link wrapper.

---

## 7. Sinais de "AI slop"

Encontrei vários:

**7.1 Cards genéricos demais.** Mesmo padrão `rounded-2xl border border-border bg-card/40 p-4` repetido **dezenas de vezes** sem variação visual. Em apps premium cada superfície tem propósito (hero, kpi, list-item, action) com peso visual diferente.

**7.2 Eyebrows com `tracking-[0.4em]` em TUDO.**
8 lugares diferentes usam o mesmo eyebrow de letras espaçadas em uppercase. Vira ruído. Use só na hero principal.

**7.3 Ícones Lucide soltos.**
`SparklesIcon` aparece **5+ vezes** com significados diferentes (planos, stat de plano, badge "mais popular", quick link no dashboard). Sparkles é o emoji genérico de IA — perdeu valor semântico. Use ícones esportivos (DumbbellIcon já bom; troca Sparkles por TrophyIcon ou MedalIcon ou TargetIcon onde fizer sentido).

**7.4 Gradient + blur orb idêntico** em hero da home aluna E hero do dashboard trainer. Idêntico. Pelo menos varie ângulo/tamanho/posição.

**7.5 Nenhuma ilustração / foto / forma própria.**
Tudo é monocromático com 1 accent vermelho. Falta uma assinatura visual de marca (linha listrada, padrão geométrico de fundo, foto do Judson, silhueta de halter, etc.).

**7.6 Frases de empty state muito iguais.**
"Sem treino agendado", "Nenhum treino ainda", "Nada por aqui ainda", "Os planos ainda não foram cadastrados" — todas no mesmo tom passivo. Personalize: "Treino de hoje? Já vai sair do forno." / "Tua biblioteca tá vazia. Bora montar?".

---

## 8. Mobile-first checks

**8.1 Breakpoints** — Tailwind 4 default é mobile-first (min-width). Grep encontra: `sm:`, `md:`, `lg:`, `xl:` espalhados, todos como progressive enhancement. **Correto.** Bom.

**8.2 Safe areas**
- `env(safe-area-inset-bottom)` está em `(student)/layout.tsx:26`, `(trainer)/layout.tsx:39`, ambos bottom-navs e o sticky CTA do runner. **Correto.**
- `env(safe-area-inset-top)` **NÃO está em lugar nenhum.** `viewportFit: "cover"` em `layout.tsx:79` exige que a gente respeite top inset (notch iPhone, status bar Android). Trainer header em mobile (`trainer-header.tsx:14`) tem `sticky top-0 h-14` mas sem `pt-[env(safe-area-inset-top)]`. **Em iPhone com notch, o header colide com o status bar.** Bug visual.

**8.3 PWA splash**
- 6 tamanhos cobrem iPhone SE → 15 Pro Max — bom.
- **Mas** o icon SVG (`public/icons/icon.svg`) usa `font-family: 'Bebas Neue', 'Arial Narrow', Impact, sans-serif`. **Splash gerado por Sharp NÃO carrega Bebas Neue** — vai cair em Arial Narrow ou Impact. Resultado: o "JL" no splash aparece em letras diferentes do app. Quebra de identidade. **Fix:** crie um SVG com texto convertido para path (usando Inkscape ou um cdn de Bebas Neue baixado e referenciado via `<defs>`).

**8.4 Manifest**
- `display: "standalone"` correto.
- `theme_color: "#0A0A0A"` matches viewport — bom.
- **Faltam `screenshots`** no manifest. Android e algumas lojas pedem para mostrar a UI. Adicione 2-3 screenshots PNG ao manifest.json.
- `shortcuts` ausentes. Você poderia adicionar shortcut "Iniciar treino" e "Comunidade" pra long-press do ícone na home.

**8.5 `viewport.maximumScale: 1`** — `layout.tsx:78`
**Hostil pra acessibilidade.** Usuários com baixa visão precisam de pinch-zoom. Remova ou troque por `userScalable: false` só se você tiver MUITA certeza. Recomendação: **remova maximumScale**.

---

## 9. Top 12 melhorias visuais prioritárias (ranqueadas)

Em ordem de **alavancagem visual / esforço**.

### 1. **Substitua `confirm()` nativo por Dialog brand** — `src/app/(student)/treinos/[id]/runner.tsx:175`
**Por quê:** Quebra dark mode na pior tela do app. Trivial.
**Custo:** 1h.

### 2. **Botões padrão de 44px+ + active:scale + hover:bg-primary/90** — `src/components/ui/button.tsx:22-34`
**Por quê:** Toda a app respira CTAs. Tamanho default abaixo do mínimo de touch é problema sistêmico.
**Custo:** 30min.

### 3. **Adicione barra de progresso ao runner** (sticky no topo do conteúdo)
**Por quê:** A aluna passa 45min nessa tela. Saber visualmente "67% feito" é gratificação central.
**Custo:** 1h. Use uma `<Progress>` simples ou um `<div className="h-1 bg-card"><div className="h-full bg-[var(--brand-primary)] transition-all" style={{width: `${doneSets/totalSets*100}%`}} /></div>`.

### 4. **Inputs de reps/load gigantes no SetRow** — `runner.tsx:408-427`
**Por quê:** Usabilidade de academia. Hoje é um terror em dedo molhado.
**Custo:** 2h. Aumente para `h-12 text-lg font-bold tabular-nums`. Considere stepper +/-.

### 5. **Crie um componente `<EmptyState>`, `<PageHeader>`, `<StatCard>` e use em toda página**
**Por quê:** Reduz código duplicado em 5+ páginas e garante consistência visual.
**Custo:** 3h.

### 6. **Splash icon convertido para path (não fonte)**
**Por quê:** Hoje, em qualquer device sem Bebas Neue instalada, o splash cai em Arial. **Quebra a identidade da marca em primeiríssimo contato.**
**Custo:** 1h. Use `inkscape --export-text-to-path` ou converta no Figma.

### 7. **Page transitions com Framer Motion** (`template.tsx` em cada route group)
**Por quê:** Diferença visceral entre "site" e "app" premium.
**Custo:** 1h. Snippet pronto na §5.

### 8. **Tap feedback em todos os Links/Buttons** (`whileTap={{ scale: 0.97 }}`)
**Por quê:** Sensação tátil. Custo zero.
**Custo:** 2h pra varrer todo o app.

### 9. **Hero da home da aluna com hierarquia invertida (streak XL, nome menor) + foto/silhueta**
**Por quê:** A primeira coisa que importa é "quantos dias no fogo". Hoje o nome ocupa o display e o streak é um pillzinho.
**Custo:** 2h.

### 10. **Bottom nav com ícone preenchido quando ativo + barra ativa mais grossa/proeminente**
**Por quê:** Hoje quase invisível. É a navegação principal. Ela tem que VIBRAR.
**Custo:** 2h. Use ícones filled de `lucide` ou monte pares manuais (ex.: `HomeIcon` outline / `<Home className="fill-current" />` quando ativo).

### 11. **Adicione safe-area-inset-top no trainer-header e remova `viewport.maximumScale`** — `layout.tsx:78`, `trainer-header.tsx:14`
**Por quê:** Bug visual em iPhone com notch + acessibilidade.
**Custo:** 30min.

### 12. **Personalidade visual da marca: foto B&W do Judson + grain overlay sutil + uma linha estridente (assinatura visual)**
**Por quê:** Hoje o app é "dark com vermelho" — qualquer cliente seu (TecnoFit, Pacto) é visualmente igual. Para vender o SaaS branded, o cliente-zero tem que ter alma.
**Custo:** 1 dia + 1 sessão de fotos. Inspire-se em Whoop (foto de atletas em B&W com gradient escarlate), Strava (cores vivas mas com fotos reais).

---

## 10. Pontos extras (não rankeados, anotados)

- **Sem dark/light toggle.** OK pro MVP, mas o `next-themes` está no projeto. Decida: ou remove `next-themes` da dep, ou implementa.
- **`text-white` (15 ocorrências) em vez de `text-primary-foreground`.** Padronize: sempre o token. Migrar é trivial mas é higiene.
- **`bg-card/30`, `bg-card/40`, `bg-card/50`, `bg-card/60`, `bg-card/95`, `bg-card/85` espalhados.** Crie tokens semânticos `--surface-1`, `--surface-2`, `--surface-overlay` e use.
- **Não há favicon SVG dark-aware.** `favicon.ico` sozinho. Adicione `<link rel="icon" type="image/svg+xml" href="/icons/icon.svg" />` no `metadata.icons`.
- **Loading skeleton da home** (`(student)/home/loading.tsx`) tem `pt-10` enquanto a página real tem `pt-8` — pulo de 8px no swap. Sincronize.
- **Confetti em duas waves** (`runner.tsx:66-90`) é simpático, mas considere uma tela completa de "XP +50 / Treino #X" tipo Duolingo / Freeletics — visualmente é o auge do journey, mereceria mais.
- **Manifest sem `screenshots` e sem `shortcuts`.** Adicione.
- **`Toaster` com `position="top-center"`** — `layout.tsx:96`. Em mobile, top é cobrindo o conteúdo do header. Considere `position="bottom-center"` mas atenção ao bottom-nav. Ou `position="top-center"` com offset. Teste.

---

## Conclusão

O Judson App tem **fundação técnica sólida** (Tailwind 4 CSS-first, Base UI + shadcn bem integrados, multi-tenant via CSS vars, mobile-first respeitado, PWA configurado, server actions bem usadas). É claramente código de dev experiente que entende arquitetura.

**Mas falta o "tempero do designer".** Hoje o app é um shadcn-starter polido com tokens da marca aplicados — o que já está acima da média mas **não chega a "alto nível"** versus TecnoFit/Whoop/Centr. Falta:

1. Personalidade visual da marca Judson (foto, grain, assinatura visual)
2. Microinterações e motion (Framer Motion instalado e nunca usado!)
3. Detalhes do runner (a tela mais importante) — barra de progresso, inputs grandes, rest overlay melhor
4. Componentização de padrões repetidos (EmptyState, PageHeader, StatCard)
5. Toques de polimento — splash com path, safe-area-inset-top, tap feedback, ícones nav filled

Atacando os 12 itens da §9, o app pula de **5.5/10 para ~8/10** sem reescrever arquitetura. As mudanças são localizadas e somáveis.

Brutal mas justo: **é um produto bem feito que parece um SaaS B2B genérico**. Para parecer um produto premium do Judson Lobato, falta voz visual.

— fim do report
