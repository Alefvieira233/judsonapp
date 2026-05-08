# 04 — Auditoria de Segurança e Compliance LGPD — Judson App

**Data:** 2026-05-07  
**Escopo:** repositório `e:\judsonapp` (Next.js 16 + Supabase) na branch `main` em `ada5eaa`.  
**Perfil de risco:** dados de saúde, contato e identificação de mulheres adultas no Brasil (LGPD aplicável; ANPD pode multar).  
**Postura geral:** o produto está numa base sólida para um MVP — RLS hardening foi feito (migration 0007), Zod cobre todas as Server Actions, há rate-limit nos magic links, headers de segurança razoáveis. Mas há **3 vulnerabilidades críticas que bloqueiam produção** e um conjunto de gaps de LGPD que expõem o Judson (e o Alef como controlador conjunto) a multa.

---

## 1. Score por dimensão (0–10)

| Dimensão | Score | Comentário em uma linha |
|---|---:|---|
| Secrets & configuração | 9 | `.gitignore` cobre `.env*`, sem segredo no código nem no histórico — ok. |
| RLS Supabase | 7 | RLS endurecido em 0007, mas três `SECURITY DEFINER` expostos ao `authenticated` (advisor 0029) e service-role usado fora do estritamente necessário. |
| Auth (cookies, magic link, invite) | 7 | OTP com `shouldCreateUser:false` correto; invite tem rate-limit + RPC atômica. Mas a `consume_invite` aceita `p_user_id` arbitrário e `p_email` controlado pelo cliente, e o invite token é só 16 bytes hex (suficiente, mas vale documentar). |
| Hardening API routes / Server Actions | 6 | Toda action checa `getCurrentProfile` + Zod — bom. **Mas** uma Server Action (`createStudentDirectAction`) chama o admin REST do Supabase fora de rate-limit; há injeção de filtro PostgREST por route param não validado em 2 páginas. |
| Headers de segurança (CSP/HSTS/etc.) | 5 | HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy e Permissions-Policy estão setados. **Mas falta CSP**, falta COOP/COEP, falta CORP em rotas de imagem do bucket público. |
| OWASP Top 10 | 6 | Sem XSS evidente (sem `dangerouslySetInnerHTML`), mas há SSRF via `media_url`/`logo_url`/`banner_url` (URL controlada pelo dono é renderizada em `<a>`/Next `<Image>` no cliente da aluna), IDOR coberto bem com `.eq('tenant_id')`, e injeção PostgREST via `.or(\`...${id}...\`)`. |
| Storage / uploads | 7 | Bucket `tenant-assets` é público, MIME e tamanho são validados no client e pela bucket policy. Owner-folder check é correto. Sem upload de fotos de aluna — risco residual está nos URLs externos. |
| LGPD — Política de privacidade | 4 | Existe e cita LGPD, mas falta CNPJ, endereço, encarregado/DPO, base legal explícita, transferência internacional, retenção de logs, consentimento de menores — todos exigíveis. |
| LGPD — Termos de uso | 4 | Curto demais — falta foro, propriedade intelectual, limitação de responsabilidade, política de pagamento (mesmo que via WhatsApp), aceite de PI da aluna sobre conteúdo postado. |
| LGPD — Consentimento & cookies | 2 | **Não existe banner de cookies / aceite de termos no cadastro**. O fluxo `/invite/[token]` recolhe nome+email sem checkbox de aceite — gravíssimo. |
| Tratamento de dados de saúde | 5 | Só são coletados dados básicos hoje (peso/altura/anamnese ainda não estão no schema). Quando entrarem, vão precisar de **base legal específica art. 11 LGPD** + **criptografia em repouso por linha** ou bucket privado com policy restrita. |
| Audit log | 1 | Não existe. ANPD pode pedir comprovação de quem acessou cada perfil de aluna; nada é logado. |

**Score consolidado: 5.3 / 10** — não está pronto para um lançamento real com tráfego pago, mas dá pra fechar tudo em ~1 sprint.

---

## 2. Vulnerabilidades CRÍTICAS (bloqueiam produção)

### CRIT-1 — `consume_invite` aceita `p_user_id` arbitrário do cliente, sem checar contra `auth.uid()`
**Arquivo:** `supabase/migrations/0004_consume_invite.sql:14-79`

A função SECURITY DEFINER recebe `p_user_id uuid` direto da Server Action (`src/app/auth/callback/route.ts:44-49`). Como ela é executada com privilégios elevados e o único lugar que valida que `p_user_id == auth.uid()` é a route handler, **qualquer cliente autenticado pode invocá-la via `supabase.rpc('consume_invite', { p_user_id: <outra_uuid>, … })` e criar um perfil `student` com qualquer `id`** — vinculando o token de uma aluna ao `auth.uid` de outra, ou gravando o e-mail dela no perfil do atacante.

**Impacto:** sequestro de convite, criação de perfis fantasma vinculados a alunas reais, escalada para owner se o invite for forjado.

**Remediação (1 linha de SQL):**
```sql
-- na função consume_invite, antes de qualquer outro check:
if p_user_id is null or p_user_id <> auth.uid() then
  raise exception 'user_mismatch' using errcode = 'P0005';
end if;
```
e remover `p_user_id` da assinatura passando a usar `auth.uid()` direto. Aplicar via migration `0010_consume_invite_lock_user.sql`.

---

### CRIT-2 — Filtro PostgREST `.or()` com string-interpolation de route params
**Arquivos:**
- `src/app/(trainer)/students/[id]/page.tsx:123` — `.or(\`referrer_id.eq.${id},referred_id.eq.${id}\`)`
- `src/app/(trainer)/exercises/page.tsx:29` — `.or(\`tenant_id.is.null,tenant_id.eq.${session.tenant.id}\`)` (interno, mais seguro)
- `src/app/(trainer)/workouts/[id]/page.tsx:40` — idem

O `id` em `students/[id]/page.tsx` é o parâmetro de URL (não validado como UUID antes do interpolate). Um atacante autenticado como `owner` pode acessar `/students/foo,referred_id.eq.<UUID-VITIMA>--/` e injetar filtros PostgREST adicionais — **PostgREST `.or()` aceita expressões como `referrer_id.eq.x,deleted_at.not.is.null`**, e o operador permite enumerar referrals de outros tenants (a query final ainda passa por RLS mas vaza estrutura).

Os outros dois usam `session.tenant.id` (validado server-side, é seguro), mas o padrão é frágil. Se amanhã virar input do usuário, vira injeção.

**Impacto:** information disclosure, possível bypass de filtro tenant via construção engenhosa.

**Remediação:**
```ts
// students/[id]/page.tsx
import { z } from "zod";
const parsedId = z.string().uuid().safeParse(id);
if (!parsedId.success) notFound();
// e usar duas queries separadas em vez de .or():
const [as_referrer, as_referred] = await Promise.all([
  supabase.from("referrals").select(...).eq("referrer_id", parsedId.data),
  supabase.from("referrals").select(...).eq("referred_id", parsedId.data),
]);
```
Substituir todas as 3 ocorrências de `.or(\`...${var}...\`)` por queries com `.eq()`/`.in()` ou usar `or()` com array (a API do supabase-js suporta `.or('referrer_id.eq.x,referred_id.eq.x')` mas o vetor de risco é a string interpolada).

---

### CRIT-3 — Service worker faz cache de HTML autenticado sem invalidação no logout
**Arquivo:** `public/sw.js:30-48`

O SW intercepta navegações HTML, faz `network-first` mas **clona e armazena no cache toda response HTML** (incluindo `/dashboard`, `/students/<uuid>`, `/perfil`, `/feed`). Quando a aluna sai (logout) ou outra pessoa abre o mesmo navegador, o SW serve a versão cacheada offline — vazando lista de alunas, valores de peso/RPE, mensagens da comunidade.

Em PWAs instaladas em dispositivos compartilhados (academia, celular emprestado), isso vira vazamento direto.

**Impacto:** vazamento de dados sensíveis de saúde via cache local, sem necessidade de credencial.

**Remediação:**
1. No fetch handler, **não cachear navegações para rotas autenticadas** (`/dashboard`, `/students`, `/feed`, `/home`, `/treinos`, `/perfil`, `/planos`, `/community`, `/settings`, `/workouts`, `/exercises`, `/plans`, `/welcome`).
2. Na `logoutAction` (`src/app/(trainer)/actions.ts` e `src/app/(student)/perfil/actions.ts`), enviar `BroadcastChannel('logout').postMessage(...)` e o SW ouvir e fazer `caches.delete(CACHE)`.
3. Ou trocar para uma estratégia mais simples: **só fazer cache de `/offline` e dos assets estáticos**. As páginas autenticadas devem ir sempre na rede (e mostrar `offline` se falhar).

```js
// sw.js — substituir o handler de navegação
if (request.mode === "navigate") {
  event.respondWith(
    fetch(request).catch(() => caches.match(OFFLINE_URL))
  );
  return;
}
```

---

## 3. Riscos ALTOS

### ALTO-1 — `consume_invite` confia em `p_email` enviado pelo cliente
**Arquivo:** `supabase/migrations/0004_consume_invite.sql:64-71` + `src/app/auth/callback/route.ts:46-49`

A action passa `p_email: data.user.email ?? ""`, mas a função grava esse valor no `profiles.email` sem checar contra `auth.users.email`. Se a função fosse chamada direto (CRIT-1), o atacante poderia gravar qualquer e-mail no perfil. Mesmo após corrigir CRIT-1, melhor usar `(select email from auth.users where id = auth.uid())`.

**Remediação:** dentro da função, `select email into v_email from auth.users where id = auth.uid()` e usar `v_email` em vez de `p_email`.

---

### ALTO-2 — Service-role REST chamado direto em Server Action sem rate-limit nem audit
**Arquivo:** `src/app/(trainer)/students/actions.ts:265-307` (`createStudentDirectAction`)

A action faz POST direto em `/auth/v1/admin/users` com Bearer service-role. Não há rate-limit, então um owner comprometido (ou um bug que vaze cookie do owner) consegue criar contas em massa. Também não há audit-log de quem criou quem — útil para detectar abuso.

**Remediação:**
1. `rateLimit('admin-create-student:tenant:${session.tenant.id}', 30, HOUR)` antes da chamada admin.
2. `rateLimit('admin-create-student:ip:${ip}', 10, HOUR)`.
3. Inserir um row em uma tabela `audit_log` (criar) com `actor_id`, `action='create_student'`, `target_id`, `at`.

---

### ALTO-3 — Missing CSP (Content-Security-Policy)
**Arquivo:** `next.config.ts:7-16`

Comentário do próprio arquivo já reconhece: "Avoids inline-script-only CSP (Next emits inline scripts in dev) — production nonces are added by Next when CSP is enforced via middleware. For now we ship the conservative headers that don't require nonce coordination."

Sem CSP, qualquer XSS futuro (e a app vai ganhar uploads de bio/observations cada vez mais ricos) vira RCE de cookies. Como o app não tem inline scripts além dos do Next, dá pra ligar CSP via `proxy.ts` com nonces.

**Remediação:** adicionar no `proxy.ts` (Next 16), gerando um nonce por request:
```ts
const nonce = crypto.randomUUID().replace(/-/g, "");
response.headers.set(
  "Content-Security-Policy",
  [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: https://${supabaseHost} https://i.ytimg.com https://*.cdninstagram.com`,
    `font-src 'self' data:`,
    `connect-src 'self' https://${supabaseHost} wss://${supabaseHost}`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
  ].join("; ")
);
response.headers.set("x-nonce", nonce);
```

---

### ALTO-4 — `media_url`/`video_url`/`logo_url`/`banner_url`: SSRF passivo + risco de phishing
**Arquivos:** `src/app/(student)/feed/post-card.tsx:140-149`, `src/app/(trainer)/community/post-card.tsx`, `src/app/(trainer)/exercises/exercises-view.tsx:203`, `src/app/(trainer)/settings/settings-form.tsx:221-228`

O `media_url` aparece como `<a href={post.media_url}>` clicável para a aluna; o `logo_url` e `banner_url` são renderizados em `<Image src={...} unoptimized />`. O Zod só valida `.url()` — qualquer URL é aceita, incluindo `http://169.254.169.254/...` (metadata AWS) ou tracking pixels de terceiros. Um owner malicioso (ou owner com conta sequestrada) pode plantar URL que rastreia IP/UA das alunas.

**Impacto:** phishing dentro do app, tracking pixel cruzando dados sem consentimento (LGPD), e quando o Next.js faz fetch via `next/image` o servidor vira proxy para SSRF.

**Remediação:**
1. Whitelist de hosts: `z.string().url().refine(u => /^(https:\/\/(?:i\.ytimg\.com|youtube\.com|youtu\.be|www\.instagram\.com|.*\.supabase\.co)\/)/.test(u))`.
2. Para `media_url`, exigir upload em bucket `community-assets` em vez de URL externa.
3. No `next.config.ts`, configurar `images.remotePatterns` com whitelist explícita.

---

### ALTO-5 — Buckets Supabase Storage têm SELECT policy implícita via "public bucket"
**Arquivo:** `supabase/migrations/0003_storage.sql:6-18`

O bucket `tenant-assets` é `public:true` — qualquer pessoa com a URL acessa. OK para logo público, mas o comentário admite que adicionar SELECT policy "deixaria clientes LIST". O risco real é que **o tenant_id é o nome da pasta**, e um atacante que descubra o UUID do tenant (visível no `/invite/<token>` page payload) pode tentar enumerar arquivos por nome (`{tenant_id}/banner-1714...`). Como o nome usa `Date.now()`, isso é guessable em janela de poucos segundos.

**Impacto:** baixo hoje (só logo/banner que já são públicos), mas se amanhã entrar foto de aluna, qualquer um vê.

**Remediação:** quando entrarem fotos privadas, criar bucket `student-photos` com `public:false` e SELECT policy por `auth.uid()` ou `auth_role()='owner'`.

---

### ALTO-6 — `auth_role()` e `auth_tenant_id()` expostos via PostgREST RPC (advisor 0029)
**Detalhe:** Supabase Security Advisor reportou que essas duas funções `SECURITY DEFINER` podem ser chamadas via `/rest/v1/rpc/auth_role`. Hoje só vazam o role/tenant da própria aluna chamadora (já é dela), então o impacto é baixo, mas a má prática é deixar funções `SECURITY DEFINER` callable publicamente.

**Remediação:**
```sql
-- 0010_helpers_invoker.sql
alter function public.auth_role()        security invoker;
alter function public.auth_tenant_id()   security invoker;
-- elas só leem a própria linha de profiles, e profiles tem RLS profiles_self_read,
-- então invoker é o suficiente.
```

E `set_referral_code` precisa de `set search_path = ''` (mesma migration).

---

### ALTO-7 — Auto-provisão de owner em `getCurrentProfile` é uma porta de fundo
**Arquivo:** `src/lib/auth.ts:32-58`

Qualquer usuário autenticado que (a) tenha um `auth.users` row, (b) não tenha um profile, (c) não tenha `invite_token` no metadata — vira **owner** automaticamente do tenant `judsonlobato`. A defesa em profundidade (`if (user.user_metadata?.invite_token) return null`) é só client-controlled — o atacante consegue criar uma conta via `signInWithOtp` (se admin habilitar `shouldCreateUser:true` em algum endpoint, hoje só `/invite` o faz) e contornar.

Hoje não dá pra atacar diretamente (os fluxos públicos têm `shouldCreateUser:false`), mas o ponto crítico é: **a primeira conta cadastrada em qualquer endpoint que crie auth.users vira owner**. Se amanhã entrar SSO Google ou registrar via password no `/login`, isso vira escalada.

**Remediação:**
1. Adicionar coluna `tenants.owner_user_id uuid` setada uma vez por SQL (após o admin criar o owner manualmente).
2. Em `getCurrentProfile`, em vez de auto-provisionar, retornar 401 se não houver profile **e** `user.id !== tenant.owner_user_id`.

---

### ALTO-8 — Rate-limit é in-memory e zera a cada cold-start Vercel
**Arquivo:** `src/lib/rate-limit.ts:11-12`

A própria documentação do arquivo admite o problema. Cold start em Vercel acontece a cada ~5 min ocioso — um atacante que dispare 5 OTPs/hora por email só precisa esperar a função desinflar e tentar de novo.

**Impacto:** rate-limit virtualmente desativado em produção Vercel free/hobby tier; potencial de spam de email-enumeration via OTP do Supabase (mesmo com `shouldCreateUser:false`).

**Remediação:** adicionar Upstash Redis (free tier basta) e trocar a `Map` por `@upstash/ratelimit`. Mantém a mesma interface.

---

### ALTO-9 — RPC `auth.exchangeCodeForSession` no `/auth/callback` sem rate-limit
**Arquivo:** `src/app/auth/callback/route.ts:31-41`

A rota é GET — não há rate-limit. Um atacante pode chamar `/auth/callback?code=...` em loop tentando adivinhar códigos. Códigos OTP do Supabase são curtos (6 dígitos por padrão para magic link), mas o exchange code é longer hex.

**Remediação:** `rateLimit('auth-callback:ip:${ip}', 30, HOUR)` antes do `exchangeCodeForSession`.

---

### ALTO-10 — Cookies do Supabase não declaram `secure`/`httpOnly`/`sameSite` explicitamente
**Arquivos:** `src/lib/supabase/server.ts:14-27`, `src/lib/supabase/middleware.ts:13-27`

O wrapper aceita `options` do `@supabase/ssr` e passa direto. O default da lib é `httpOnly: true` + `sameSite: 'lax'` + `secure` se HTTPS, então **provavelmente está ok** — mas não há teste explícito. Em Server Components que tentam setar cookie, há um silent `try/catch`:
```ts
} catch {
  // Server Components cannot set cookies; the middleware will refresh on the next request.
}
```
Isso silencia erros legítimos também.

**Remediação:**
1. Forçar opções de cookie no `setAll`:
```ts
cookieStore.set(name, value, { ...options, httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
```
2. Logar (não silenciar) erros de cookie set diferentes do esperado em RSC.

---

## 4. LGPD — gaps de conformidade

### LGPD-1 — Política de privacidade incompleta
**Arquivo:** `src/app/privacidade/page.tsx`

Falta (Lei 13.709/18, art. 9º):
- **Identificação completa do controlador**: CNPJ ou CPF do Judson, endereço físico (Macapá-AP), e-mail formal.
- **Encarregado (DPO)**: art. 41 — mesmo que seja o próprio Judson, precisa nominar e dar canal direto (e-mail, não só WhatsApp).
- **Bases legais explícitas**: art. 7º para dados gerais, art. 11 para dados de saúde (peso, %BF, anamnese, fotos progresso) — sem isso, todo tratamento é ilegal.
- **Compartilhamento mais granular**: a página cita "Vercel" e "Supabase", mas faltam subprocessadores (Vercel usa Cloudflare, Supabase usa AWS). Citar que dados são processados em servidores nos EUA + base legal art. 33 (transferência internacional).
- **Tempo de retenção específico por categoria**: hoje diz "7 dias após encerrar + 12 meses logs anônimos" — precisa especificar por categoria (treinos = 5 anos? logs de auth = 6 meses?).
- **Direito de portabilidade ativável**: hoje "pelo WhatsApp" não é suficiente — ANPD exige canal escrito.
- **Cookies**: a página afirma "só estritamente necessários", mas o SW grava cache local de páginas autenticadas — isso vai além de "estritamente necessário".
- **Menores de 18**: art. 14 — proibido tratar dados de menores sem consentimento parental específico. Precisa: (a) campo `birthdate` na anamnese, (b) bloqueio de cadastro se < 18 sem responsável, (c) cláusula explícita.

### LGPD-2 — Termos de uso curtos demais
**Arquivo:** `src/app/termos/page.tsx`

Falta:
- **Foro de eleição** (Macapá-AP).
- **Lei aplicável** (Brasil).
- **Limitação de responsabilidade**: o app não substitui consulta médica — está no texto, mas falta cláusula de exclusão de responsabilidade por lesão.
- **Propriedade intelectual**: treinos prescritos são propriedade do Judson, aluna não pode redistribuir.
- **Licença sobre conteúdo postado**: aluna posta no feed, quem é dono? Quem responde se ela postar foto de terceiro?
- **Política de pagamento**: mesmo que via WhatsApp/PIX, precisa cláusula de inadimplência, suspensão de acesso.
- **Vigência e alterações**: como notificar mudança nos termos.

### LGPD-3 — Não há aceite de termos / cookie banner / opt-in
**Arquivos:** `src/app/invite/[token]/invite-form.tsx`, `src/app/aluna/entrar/login-form.tsx`, qualquer layout

A aluna preenche nome+email no `/invite/[token]` **sem checkbox** "Li e aceito os Termos de Uso e a Política de Privacidade". Sem isso, **não há consentimento registrado**. ANPD entende ausência de aceite explícito como tratamento sem base legal.

**Remediação:**
1. Adicionar checkbox obrigatório no `InviteForm` e no `StudentLoginForm` da primeira vez.
2. Persistir o aceite: nova tabela `consents` com `user_id`, `tenant_id`, `policy_version`, `terms_version`, `accepted_at`, `ip`, `user_agent`.
3. Cookie banner mínimo (opt-in para tudo que não for "essencial"). Hoje não há analytics, então pode ser um banner one-time só de comunicação ("este app usa cookies essenciais") com link pra política.

### LGPD-4 — Não há mecanismo self-service de exportação/exclusão
A política diz "pedidos pelo WhatsApp", o que tecnicamente atende mas não é escalável e não cumpre prazo legal de 15 dias se o Judson estiver de férias.

**Remediação:**
1. Endpoint `/perfil/exportar` que retorna JSON com tudo de `profiles`, `workout_logs`, `exercise_logs`, `community_posts`, `community_comments`, `referrals` da aluna.
2. Endpoint `/perfil/excluir-conta` que faz soft-delete (`active=false`, anonimiza nome/email com hash) — cuidar pra não quebrar `workout_logs` históricos do Judson.

### LGPD-5 — Logs de consentimento ausentes
Sem tabela `consents`, não há prova de quando a aluna aceitou. ANPD pede.

### LGPD-6 — Tratamento de dados de saúde (art. 11) — preparação para o futuro
Hoje o schema tem só `goal` + `observations` em `profiles`. A política comercial dos planos cita "Foto de progresso mensal", "Plano nutricional sugerido" — quando isso entrar:
- Precisa **criptografia em repouso adicional** (Supabase já criptografa volume, mas para dado sensível se exige column-level via `pgcrypto` ou bucket privado com policies estritas).
- Base legal art. 11: **consentimento específico e destacado** para dados de saúde (não vale o consentimento geral).
- Acesso restrito ao trainer da aluna **e nunca a outras alunas** — RLS hoje permite owner ler tudo do tenant; quando entrar foto, criar `student_photos` com policy `student.id = auth.uid() OR (auth_role()='owner' AND tenant_id=auth_tenant_id())` e nada de feed.

### LGPD-7 — Audit log inexistente
Nenhum registro de quem leu o quê. ANPD em fiscalização pede comprovação. O Judson, sendo o único owner, não está sob risco direto, mas no SaaS multi-tenant **sem audit log fica impossível defender o controlador**.

**Remediação:** tabela `audit_log` com triggers em SELECT/UPDATE/DELETE em `profiles`, `workout_logs`, `community_posts`. Postgres `pg_audit` é overkill — basta um trigger em UPDATE/DELETE e logging das Server Actions críticas.

---

## 5. Top 10 ações priorizadas

| # | Ação | Severidade | Esforço | Onde |
|---|---|---|---|---|
| 1 | Corrigir `consume_invite` para usar `auth.uid()` em vez de `p_user_id` | CRIT | 1h | `supabase/migrations/0010_*.sql` |
| 2 | Service worker: parar de cachear HTML autenticado + invalidar cache no logout | CRIT | 2h | `public/sw.js` |
| 3 | Substituir `.or(\`...${id}...\`)` por queries tipadas em 3 arquivos + validar route params com Zod | CRIT | 1h | `students/[id]/page.tsx`, `workouts/[id]/page.tsx`, `exercises/page.tsx` |
| 4 | Adicionar checkbox de aceite Termos+Política em `/invite` e `/aluna/entrar` + tabela `consents` | LGPD bloqueia produção | 3h | `invite-form.tsx`, `aluna/entrar/login-form.tsx`, nova migration |
| 5 | Completar `/privacidade` com CNPJ, DPO, bases legais art. 7/11, transferência internacional, cookies, menores | LGPD bloqueia produção | 3h | `src/app/privacidade/page.tsx` (texto novo + revisão jurídica) |
| 6 | Completar `/termos` com foro, lei aplicável, IP, licença de conteúdo, política de pagamento | LGPD bloqueia produção | 2h | `src/app/termos/page.tsx` |
| 7 | Trocar `auth_role()` e `auth_tenant_id()` para `SECURITY INVOKER` (advisor 0029) + pin `set_referral_code` search_path | ALTO | 30min | `supabase/migrations/0010_*.sql` |
| 8 | Whitelist de hosts em `media_url`/`video_url`/`logo_url`/`banner_url` (Zod refine) + `next.config.ts` `images.remotePatterns` | ALTO | 1h | actions.ts dos endpoints + next.config.ts |
| 9 | Implementar CSP com nonce no `proxy.ts` + COOP/CORP em next.config.ts | ALTO | 2h | `src/proxy.ts`, `next.config.ts` |
| 10 | Endpoint self-service `/perfil/exportar-dados` (JSON) e `/perfil/excluir-conta` (soft-delete + anonimiza) | LGPD ANPD | 4h | nova rota + actions |

**Total estimado:** ~20h para chegar em postura defensável publicamente.

---

## 6. Notas adicionais / coisas boas que devem continuar

- **Toda Server Action faz `getCurrentProfile()` + Zod**: padrão excelente, manter.
- **Defense in depth nas mutations**: além do RLS, todas as actions adicionam `.eq('tenant_id', session.tenant.id)` — isso cobre o caso de RLS por engano permissivo.
- **Migrations bem documentadas**: comentário em cada migration explica o "porquê", facilita auditoria.
- **`/auth/callback` mapeia errors de invite por SQLSTATE específico** (P0001-P0004): muito limpo.
- **Rate-limit por email + por IP nos OTPs**: padrão certo, só precisa migrar pra Redis.
- **`shouldCreateUser:false` no fluxo `/aluna/entrar`**: previne enumeração de email + abuso. Bom.
- **Bucket policy bem escrita** (`storage.foldername(name)[1] = tenant_id`): correto, owner-folder isolation.

---

## 7. Apêndice — Supabase Security Advisor (live, projeto `ymepyisibjraxtrnxpwc`)

5 warnings ativos:
1. `function_search_path_mutable` em `public.set_referral_code` (resolver com `set search_path = ''` na função).
2. `authenticated_security_definer_function_executable` em `public.auth_role` (trocar para INVOKER).
3. Idem em `public.auth_tenant_id` (trocar para INVOKER).
4. Idem em `public.consume_invite` — esse é o pior, ver CRIT-1.
5. `auth_leaked_password_protection`: HaveIBeenPwned check desabilitado no Supabase Auth — **habilitar no painel**, custo zero, só evita aluna usar `123456`.

---

**Veredicto final:** o app está perto de pronto, mas **não pode ir live até CRIT-1, CRIT-2, CRIT-3 e LGPD-3 (consentimento) estarem fechados**. Os outros itens podem entrar como Onda G (segurança) e Onda H (LGPD compliance) e fechar em ~3 dias de trabalho focado.
