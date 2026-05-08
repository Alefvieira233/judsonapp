# 02 — Inventário de Features e Gaps

> Snapshot do que o Judson App faz hoje, persona por persona, e o que falta pra
> brigar com FitCoach top tier brasileiro (Tecnofit, Trainerize-style,
> FitsApp/Profit). Caminhos relativos a `e:\judsonapp\`.

Stack: Next.js 16 (App Router, Server Actions, RSC), Supabase (Postgres + Auth +
Storage + RLS), PWA com SW, Vercel. Multi-tenant ready (todas as tabelas têm
`tenant_id`), single-tenant em produção.

---

## 1. Features do TRAINER (Judson, role = `owner`)

Layout em `src/app/(trainer)/layout.tsx` — sidebar desktop, bottom nav mobile,
header. Auth obrigatório, role obrigatório `owner`. Bootstrap automático do
perfil do owner no primeiro login (`src/lib/auth.ts:41-58`).

### Tabela de features

| Rota | Status | O que faz |
|---|---|---|
| `/dashboard` (`src/app/(trainer)/dashboard/page.tsx`) | **completo (read-only)** | Saudação por horário, hero com nome do owner, 4 KPIs (alunas ativas, em planos pagos, treinos da semana, posts publicados). Lista "Última atividade" com últimos 6 logs concluídos. Quick links pra Planos / Comunidade / Exercícios / Ajustes. |
| `/students` (`src/app/(trainer)/students/page.tsx` + `students-list.tsx`) | **completo** | Lista de alunas com filtro Ativas/Inativas/Todas, busca por nome/email/objetivo, contadores. Ações: Cadastrar direto (cria auth user via admin REST + magic link automático) e Convidar via link único (token, 14d, WhatsApp share). |
| `/students/[id]` (`page.tsx` + `edit-form.tsx` + `plan-picker.tsx` + `referrals-block.tsx`) | **completo** | Detalhe da aluna: 3 stats (treinos, streak, tempo total), atribuição de plano, bloco de indicações (vincular indicadora, marcar bonificação custom, deletar), histórico dos últimos 8 treinos com RPE/duração, edit form (nome/objetivo/observações/ativa). |
| `/workouts` (`src/app/(trainer)/workouts/page.tsx`) | **completo** | Lista de treinos com aluna atribuída, contagem de exercícios, dias da semana, status ativo/inativo. CTA "Novo treino". |
| `/workouts/new` (`page.tsx` + `new-form.tsx`) | **completo** | Form mínimo (título + aluna opcional + descrição), redireciona pro builder após criar. |
| `/workouts/[id]` (`page.tsx` + `builder.tsx` + `exercise-picker.tsx`) | **completo** | Builder full: edição inline de título, atribui aluna, marca dias da semana (toggles 7d), descrição, status ativo, lista drag-and-drop de itens (`@dnd-kit`), edição de cada item em bottom sheet (séries/reps/descanso/carga sugerida/notas). Ações: Salvar, Apagar, **Duplicar** (cria cópia + redireciona). |
| `/exercises` (`page.tsx` + `exercises-view.tsx` + `exercise-sheet.tsx`) | **completo** | Biblioteca de exercícios com chips por grupo muscular, busca, badge "Meu" vs "Biblioteca" (tenant_id null = pública). Sheet de criar/editar com nome, grupo (datalist), equipamento (datalist), URL de vídeo (autodetecta YouTube/Instagram), instruções. CRUD completo nos do tenant; biblioteca pública é read-only. |
| `/plans` (`src/app/(trainer)/plans/page.tsx`) | **completo** | Cards de planos com tagline, preço, features, badge destaque, contador de alunas em cada plano. |
| `/plans/new` + `/plans/[id]` (`plan-form.tsx`) | **completo** | CRUD completo de plano (nome, tagline, descrição, preço-livre, features uma por linha, CTA label, destaque, ordem, ativo). Apagar disponível na edição. |
| `/community` (`page.tsx` + `create-post-sheet.tsx` + `post-card.tsx` + `post-menu.tsx`) | **parcial** | Lista posts (texto + media URL opcional + pinned). Pode criar, fixar/desfixar, deletar. **Falta**: comentários e curtidas no painel do trainer (existem na visão da aluna mas o trainer só vê texto/pin). |
| `/settings` (`page.tsx` + `settings-form.tsx`) | **completo** | Marca: upload de logo + capa (Supabase Storage), cor primária + hover (regex hex), nome, tagline, bio. Contato: WhatsApp, Instagram, CREF, cidade. Consultoria: preço-livre + pitch. |

### CRUDs por entidade

- **Alunas**: criar (direto + via convite), ler, editar (parcial — só nome/objetivo/observações/ativa; não edita email/telefone/avatar/birthdate), arquivar (active=false). **Não existe deletar**.
- **Treinos**: criar, ler, editar, duplicar, apagar. Editar dias agendados, status ativo, aluna atribuída.
- **Itens de treino**: criar via picker, editar em sheet, reordenar drag-and-drop, deletar. Save = delete-all + insert (`workouts/actions.ts:230`).
- **Exercícios**: criar, ler, editar, apagar (só os do tenant). Vídeo URL com source detection.
- **Planos**: CRUD completo + atribuição a aluna.
- **Indicações**: criar (vincular referrer), marcar como bonificada (label livre), deletar. **Não existe** auto-track via código (referral_code da aluna existe mas não é usado pra criar referral automático).
- **Posts comunidade**: criar, fixar/desfixar, deletar. Sem editar.
- **Tenant settings**: editar (sem delete porque é single-tenant).

---

## 2. Features da ALUNA (`role = student`)

Layout em `src/app/(student)/layout.tsx` — bottom nav 4-tab fixa, prompt PWA
install, brand vars do tenant aplicadas via CSS custom props. Acesso bloqueado
para owner.

Onboarding: trainer gera `/invite/<token>` → aluna preenche nome+email →
recebe magic link → `/auth/callback` consome o invite via RPC `consume_invite`
(cria profile vinculado ao tenant) → redireciona pra `/home`. Login recorrente
em `/aluna/entrar` (apenas magic link, `shouldCreateUser: false`, com rate
limit por email + IP em `src/lib/rate-limit.ts`).

### Tabela de features

| Rota | Status | O que faz |
|---|---|---|
| `/home` (`src/app/(student)/home/page.tsx`) | **completo** | Hero personalizado por horário, 3 stat chips (streak / total / plano). Card "Treino de hoje" baseado no `scheduled_days[dow]` (fallback pro mais recente). Lista "Outros treinos". 2 CTAs: plano + indicar amiga. Atalho pra comunidade. |
| `/treinos` (`page.tsx`) | **completo** | Lista todos os treinos ativos da aluna com contagem de exercícios, último log relativo (hoje / ontem / há N dias), grid de dias agendados. |
| `/treinos/[id]` (`page.tsx` + `runner.tsx` + `actions.ts`) | **completo (forte)** | **WorkoutRunner robusto**: pré-carrega última carga/reps por item; "Iniciar treino" cria `workout_log` com `started_at`. Pra cada série: input reps + input kg + botão check. Salva via `logSetAction` (upsert por log/item/set). **Cronômetro de descanso flutuante** com pause/skip ao marcar série. Cronômetro total elapsed em tempo real. Cancel preserva sets já marcados. Concluir abre sheet de RPE 1-10 + notes opcional → confetti animation com brand colors. Tela CompletedScreen com tempo e séries marcadas. |
| `/feed` (`page.tsx` + `post-card.tsx` + `actions.ts`) | **completo** | Lê posts com author + likes count + reactions próprias + comentários (com fk profile.full_name). Cada card tem like otimista (useOptimistic), toggle comments (auto-aberto se há), submit comentário inline (Enter envia, Shift+Enter quebra), delete do próprio comentário. |
| `/perfil` (`page.tsx` + `actions.ts` + `logout-button.tsx`) | **completo** | Avatar gerado da inicial (sem upload), nome, objetivo. 3 stats (treinos, streak, tempo total). Card do plano atual. **Bloco "Indique uma amiga"** com referral_code copiável + WhatsApp share pré-preenchido + lista de indicações. Histórico (últimos 5). Atalhos: editar perfil, abrir WhatsApp do trainer, sair. |
| `/perfil/editar` (`page.tsx` + `edit-form.tsx`) | **parcial** | Edita nome, telefone, objetivo, observações. **Não edita**: email (auth-managed), avatar, birthdate, foto. |
| `/planos` (`page.tsx`) | **completo (visualização)** | Cards dos planos ativos com tagline, preço, features. Plano atual marcado como "Esse é o teu plano atual". Outros planos: CTA WhatsApp pré-preenchido com mensagem "Quero saber sobre o plano X". Linha final: "Pagamento via PIX direto pro Judson". |

### Onboarding e fluxo

- `/invite/[token]` (`page.tsx` + `invite-form.tsx` + `actions.ts`): valida token, mostra erro se usado/expirado (com copy específica), form de email + nome → magic link. Brand vars aplicadas.
- `/aluna/entrar` (`page.tsx` + `actions.ts` + `login-form.tsx`): login recorrente apenas magic link (sem senha pra aluna). Rate limit 5/h email + 15/h IP. Mensagem genérica pra não vazar existência de email.
- `/welcome` (`page.tsx`): roteador — autenticado → bate em `profile.role` e manda owner → `/dashboard`, student → `/home`. Fallback se profile não existe.

### Execução de treino — pontos fortes (raros em concorrentes)

- Pré-carrega **última carga e reps** por item pra sugestão automática de evolução de carga (`page.tsx:67-90`).
- **Upsert por (log, item, set)** evita duplicação se aluna toca duas vezes.
- Cronômetro de descanso flutuante com pause + skip + continua tickando offline.
- Concluir mesmo com séries faltando (CTA muda label dinamicamente).
- Confetti com cores da marca (#DC2626) + reduced-motion respeitado.

---

## 3. Features compartilhadas / sistema

| Item | Status | Detalhe |
|---|---|---|
| Auth (owner password / aluna magic link) | **completo** | `src/app/(auth)/login` (senha), `/aluna/entrar` (OTP), `/auth/callback` consome invite via RPC. |
| Provisionamento automático do owner | **completo** | `src/lib/auth.ts:41-58` cria profile owner no primeiro login. Defesa: usuários com `invite_token` em metadata nunca viram owner. |
| RLS multi-tenant | **completo** | `0007_rls_hardening.sql` com `auth_tenant_id()` / `auth_role()` SECURITY DEFINER. Plans/referrals em `0009`. |
| RPC `consume_invite` | **completo** | Locked (`0005_lock_consume_invite.sql`) com SECURITY DEFINER e códigos de erro mapeados. |
| Storage | **completo** | Bucket `tenant-assets` (logo + banner upload no `/settings`). Não há bucket pra mídia de post / avatar / vídeo de exercício do owner. |
| PWA | **completo** | Manifest, ícones (192/512/maskable), splash screens iOS, SW cache-first, prompt install (Android beforeinstallprompt + dica iOS), página `/offline`. |
| Termos (`/termos`) | **completo** | LGPD-aware, CREF mencionado, copy específica do contexto. |
| Privacidade (`/privacidade`) | **completo** | LGPD completa (controlador, dados coletados, uso, compartilhamento, direitos, retenção, cookies). |
| Health check | **completo** | `GET /api/health` pinga `tenants` via admin client. 200/503. |
| Rate limit | **completo (em-mem)** | `src/lib/rate-limit.ts` — funcional para single-instance Vercel mas não escala horizontalmente. |
| Webhooks externos | **faltando** | Zero. Nenhum webhook de Stripe/Mercado Pago/Asaas, Calendly, Zapier, etc. |
| Push notifications | **faltando** | SW não tem `push` listener. Sem subscriptions na DB. |

### Componentes "em breve" / mortos

- `src/app/(trainer)/_components/coming-soon.tsx` e `src/app/(student)/_components/coming-soon.tsx` — **não usados em lugar nenhum** (`grep` confirma zero imports). Limpáveis.

### Colunas de DB com schema mas zero UI

- `profiles.avatar_url` — coluna existe, **nunca usada** (perfis renderizam inicial).
- `profiles.birthdate` — coluna existe, **nunca usada**.
- `community_posts.media_type` — existe mas só `media_url` é renderizado (e como link `<a>` truncado, não como `<img>`/`<video>`).
- `exercises.thumbnail_url` — coluna existe, **nunca usada**. Vídeo só vira badge "vídeo" sem player nem thumbnail.
- `testimonials` — tabela inteira existe (com seed em `0002`), policies, mas **nenhuma página renderiza**.

---

## 4. Gaps vs FitCoach top tier brasileiro

### Must-have (bloqueiam virar produto cobrável de verdade)

1. **Pagamento integrado / cobrança recorrente.** Hoje o fluxo de plano é "manda WhatsApp pro Judson, ele cobra PIX manualmente". Sem **Stripe/Mercado Pago/Asaas/Pagar.me** + sem `subscriptions` table com status, billing date, valor cents, ciclo. Plano em produção precisa Pix recorrente (Asaas ou Mercado Pago Recurring) + cartão.
2. **Anamnese / PAR-Q.** Toda aluna nova precisa preencher questionário de saúde antes de receber treino. Hoje só campo `observations` livre. Falta tabela `anamnesis` com perguntas estruturadas (lesões, medicamentos, condições cardíacas, gravidez, cirurgias, atividade prévia) + assinatura digital.
3. **Avaliação física estruturada.** Sem tabela de medidas (peso, altura, %BF, perímetros: braço/cintura/quadril/coxa, dobras cutâneas), sem séries temporais, sem gráficos de evolução. Hoje só "treinos concluídos" como métrica.
4. **Fotos de progresso.** Storage existe mas não há fluxo de upload mensal de foto frente/lado/costas com timeline comparativa. É feature de aderência ALTA em FitCoach BR.
5. **Vídeo demonstrativo embeddado de exercício.** Hoje só mostra badge "vídeo" — clica e abre URL externa em nova aba. Player inline (YouTube embed / Instagram embed / vídeo MP4 do Storage do tenant) é tabela mínima — aluna executando precisa ver com 1 toque.
6. **Notificações push.** Sem PWA push subscription, sem SW handler, sem cron de "tu tem treino hoje, bora?" / "faz 3 dias sem treinar". Em SaaS fitness brasileiro, push é o que mantém retenção.
7. **Avatar / foto de perfil real.** Tanto trainer quanto aluna mostram apenas a inicial em quadrado. Coluna `avatar_url` existe mas zero upload UI.
8. **Chat in-app aluna ↔ trainer.** Hoje toda comunicação 1:1 sai do app via WhatsApp. Modelo válido pra MVP, mas concorrente sério tem chat com áudio + foto + retorno do trainer dentro do app.

### Nice-to-have (expandem mas não bloqueiam)

9. **Plano alimentar / dieta.** Tabela `meal_plans` ou link pra nutricionista parceiro. VIP Total já promete "plano nutricional sugerido" mas não tem schema/UI.
10. **Calendário/agenda de treino presencial.** O Judson é Macapá, faz presencial. Falta calendário de horários, agendamento de sessões, lembrete.
11. **Métricas avançadas pro trainer.** Dashboard atual é 4 KPIs estáticos. Faltam: aderência por aluna (% de treinos agendados que executou), evolução de carga por exercício, alunas em risco (>7d sem treinar), churn de plano.
12. **Conquistas / gamificação.** Streak existe mas é cosmético. Sem badges (1º treino, 10 treinos, 1 mês de streak), sem leaderboard de equipe, sem celebração além do confetti final.
13. **Compartilhamento social automatizado.** Aluna concluiu treino → gerar story instagram com brand do trainer. Story de progresso mensal. Atualmente só compartilha código de indicação por WhatsApp.
14. **Wearables.** Nenhuma integração com Apple Health / Google Fit / Strava. FitCoach BR (Tecnofit) tem Health connect.
15. **Editar comentário** (só apaga). **Editar post** (só apaga + recria). **Reações além de like** (schema permite via `reaction text` mas só `like` é wired).
16. **Comentários e curtidas no painel do trainer**. Trainer cria post mas não vê quem comentou nem curtiu sem ir pro feed da aluna.

### Future / SaaS-readiness

17. **Multi-tenant ativo.** Schema pronto (todas as tabelas têm `tenant_id`, `tenants.slug`, `tenants.custom_domain`), mas hoje há um tenant fixo. Falta: signup de novo personal, billing pro tenant (cobrar Judson + 50 outros personals), domínio custom resolution no middleware.
18. **Onboarding de novo personal (self-serve).** Hoje provisiona owner no `getCurrentProfile()` automaticamente — válido cliente-zero, não escala.
19. **Backup / export (LGPD).** Política de privacidade promete portabilidade mas não há endpoint pra aluna baixar JSON dos dados. Bloqueia LGPD compliance estrita.
20. **Email transacional branded.** Magic links saem pelo template default do Supabase. Falta template branded (logo do tenant + cor da marca).
21. **Auditoria / log de ações sensíveis.** Sem `audit_log` pra ações de owner (apagou treino, mudou plano de aluna).
22. **Rate limit distribuído.** Atual é em memória — em multi-instance Vercel não compartilha estado. Trocar pra Upstash Redis ou similar quando escalar.
23. **i18n.** Tudo PT-BR hardcoded. Quando vender pra Argentina/Portugal precisa locale.
24. **Modelo de treino reutilizável.** `student_id` null já é "modelo" mas não há "biblioteca de templates" navegável + clonar pra aluna específica em 1 clique.
25. **Integração com personal training na mídia social.** Auto-posting de transformação de aluna (com consentimento) no Instagram do tenant.

### Features quebradas / incompletas detectadas

- `coming-soon.tsx` em ambos route groups — **dead code**, nunca renderizado.
- `testimonials` table com seed e policies — **nunca lida em UI nenhuma**. Provavelmente legado de design landing-page que nunca entrou.
- `community_posts.media_url` é renderizado como `<a>` truncado — **não embeda imagem nem vídeo**, mesmo que `media_type` exista no schema.
- `exercises.thumbnail_url` e `is_owner_video` salvos mas **nunca exibidos** pra aluna.
- `profiles.avatar_url` e `profiles.birthdate` declarados mas **sem fluxo de input/render**.
- `WorkoutBuilder` salva itens com **delete-all + insert** (`workouts/actions.ts:230`) — funciona pra MVP mas perde histórico de IDs de `workout_items` se aluna já executou esse treino. `exercise_logs.workout_item_id` aponta pra ID que pode ter sumido. Toleável pelo desenho atual mas vai virar bug se alguém quiser "diff de versões do treino".
- Botão "Apagar" no Workout Builder usa **`window.confirm`-ausente** — apaga direto via form action sem confirmação visual (`builder.tsx:288-292`).
- "Cancelar treino" no runner usa `confirm()` nativo (`runner.tsx:175`) — funciona mas inconsistente com resto do app que usa toast/sheet.
- Rate limit em memória (`src/lib/rate-limit.ts`) — funciona em single-instance mas vaza em multi-instance.
- Página `/welcome` tem fallback que renderiza UI mas o redirect sempre vence — código morto pra cenário improvável (profile sem role).
- Cancel de treino **não atualiza** o `workout_log` aberto (deixa órfão com `started_at` sem `completed_at`). Vai aparecer "treinos em aberto" se você consultar o DB.

---

## 5. Top 15 features pra virar "o melhor do Brasil"

Ordem por **impacto comercial × esforço inverso**, com base em o que MOVE retenção e conversão de FitCoach BR.

1. **Vídeo demonstrativo embeddado por exercício** — schema 80% pronto (`video_url`, `video_source`, `thumbnail_url`). Falta render: YouTube/Instagram embed inline no `runner.tsx` ao tocar no item. Esforço baixo, impacto enorme em qualidade percebida.
2. **Anamnese / PAR-Q estruturado** — bloqueador legal/profissional. Nova tabela `anamneses`, fluxo na primeira sessão, link no painel do trainer. Sem isso, Judson não pode prescrever treino LEGALMENTE pra aluna nova.
3. **Avaliação física com timeline** — tabelas `assessments` (peso, %BF, perímetros) e `progress_photos` (Storage). Gráfico de evolução. Diferencial gigantesco vs concorrente que não tem.
4. **Pagamento Pix recorrente (Asaas ou Mercado Pago)** — destrava o modelo SaaS de verdade. Hoje toda cobrança é manual. Mudança de mindset: produto vira self-service.
5. **Push notifications** — "Tem treino hoje 18h", "Faz 3 dias sem treinar, bora?", "Judson postou na comunidade". Aumenta DAU 30-50% em fitness apps.
6. **Player de mídia inline no feed** — `media_type` já existe; precisa renderizar `<img>` / `<video>` em vez de link truncado. Posts viram engajamento real.
7. **Chat 1:1 in-app aluna ↔ trainer** (texto + áudio) — manda WhatsApp pra fora hoje. Trazer pra dentro mantém conversão e dado.
8. **Avatar real com upload** — schema pronto, falta UI no `/perfil/editar` + Storage bucket. Pequeno mas humaniza muito.
9. **Métricas de aderência no painel** — `/dashboard` ganha "Alunas em risco" (>7d sem treinar), `/students/[id]` ganha % aderência (semanas treinou ÷ semanas no app). Justifica retenção em conversa de plano.
10. **Conquistas / badges** — celebrar "1ª semana", "10 treinos", "30 dias seguidos". Aproveita `workout_logs` que já existem. Combinado com share pra Insta vira marketing orgânico.
11. **Templates de treino do trainer** — biblioteca dele com "Treino A — peito, modelo", "HIIT 20min", clicar copia pra aluna específica e atribui. Reduz tempo de criação de treino em 70%.
12. **Story de progresso compartilhável** — depois de concluir treino ou no final do mês, gera card branded (logo + cor + número treinos + streak) pra story do Insta. Marketing orgânico do trainer feito pelas alunas.
13. **Edição de post + reações além de like** — permite o trainer corrigir post + 4 reactions (fire, heart, muscle, clap). Schema já permite reactions; só faltam emojis.
14. **Cronômetro de série (não só descanso)** — runner tem timer de descanso lindo. Alguns exercícios são tempo (prancha, isometria) — adicionar campo `mode: reps | seconds` em `workout_items` + timer ativo. Diferencia.
15. **Multi-tenant signup self-serve** — destrava a tese de white-label. Página pública `/criar-conta-personal` cria tenant + cobra mensalidade do PERSONAL via Stripe. Esforço médio mas é o pivô pro SaaS real.

---

## Anexo: arquitetura de dados existente

Tabelas (de `supabase/migrations/`):
- `tenants`, `profiles` (FK auth.users), `invites` (token único, 14d).
- `exercises` (`tenant_id NULL` = biblioteca pública).
- `workouts` → `workout_items` (drag-and-drop, posição int, `delete-all + insert` no save).
- `workout_logs` (1 por execução, `started_at` + `completed_at`, RPE 1-10, duration_minutes, notes).
- `exercise_logs` (1 por série executada, FK `workout_log_id` + `workout_item_id` + `set_number` + `reps_done` + `load_kg`).
- `community_posts` → `community_reactions` (unique by post+user+reaction) + `community_comments`.
- `plans` (free-text price, features array, highlight, display_order, active).
- `referrals` (referrer + referred + status pending/active/rewarded + reward_label livre).
- `testimonials` (com seed, **órfã na UI**).

Funções DB: `auth_role()`, `auth_tenant_id()`, `consume_invite(token, user_id, name, email)`, `set_referral_code()`, `trigger_set_timestamp()`.

RLS: `0007_rls_hardening.sql` é a base. Plans/referrals próprias em `0009`. Owner enxerga tudo do próprio tenant; aluna enxerga próprios treinos/logs + posts do tenant + indicações onde é parte.
