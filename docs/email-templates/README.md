# Email templates — Supabase Auth

Templates HTML inline-styled pra colar no painel Supabase. Identidade visual Judson:
header `#DC2626`, body dark `#0a0a0a`, fonte Bebas Neue (com fallback Impact/Arial Narrow
porque clientes de email não baixam web fonts).

## Onde colar

Painel Supabase → **Authentication → Email Templates**:

- `magic-link-pt-BR.html` → aba **Magic Link** (público pt-BR padrão)
- `magic-link-es.html` → aba **Magic Link** (quando suportar tenant em ES — manter cópia)
- `recovery-pt-BR.html` → aba **Reset Password** (futuro — quando ativar reset por email)

## Subjects

Cole no campo **Subject** (acima do HTML) na mesma tela:

- pt-BR Magic Link: `Seu link pra entrar no app`
- es Magic Link: `Tu link de acceso`
- pt-BR Recovery: `Redefine tua senha`

## Variáveis usadas

Os templates usam apenas as variáveis padrão do Supabase Auth:

- `{{ .ConfirmationURL }}` — URL com token (botão CTA + fallback texto).
- `{{ .SiteURL }}` — URL do app (footer).
- `{{ .SiteName }}` — Nome do site (header + corpo).
- `{{ .Email }}` — Email do destinatário (footer "enviado para").

`SiteName` e `SiteURL` são configurados em **Authentication → URL Configuration**.

## Como testar

1. Cole o HTML + subject no painel Supabase.
2. Salva.
3. No app dev (`npm run dev:webpack`), acesse `/login` e envie magic link pra teu próprio
   e-mail.
4. Verifica caixa de entrada (e spam) — header vermelho, botão funcional, link clicável.
5. Repete em cliente mobile (Gmail iOS/Android) pra confirmar layout responsivo.

## Por que inline?

Clientes de email (Gmail, Outlook desktop) não suportam `<link>`, `<style>` global
confiável ou web fonts. Tudo deve ser `style="..."` direto. O CSS daqui é redundante
de propósito.
