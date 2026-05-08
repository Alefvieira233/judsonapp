// Locales suportados pelo app. ES é o segundo idioma alvo (mercado LatAm
// hispano). Adicionar mais aqui — junto com o JSON em messages/<locale>.json
// e a label em src/components/locale-switcher.tsx.
export const LOCALES = ["pt-BR", "es"] as const;
export type AppLocale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = "pt-BR";

export const LOCALE_COOKIE = "NEXT_LOCALE";

export function isAppLocale(value: string | undefined | null): value is AppLocale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

// Mapeia variantes de Accept-Language pro locale canônico do app. Mantém
// simples — só checa o prefixo de cada candidato.
export function negotiateLocale(acceptLanguage: string | null): AppLocale {
  if (!acceptLanguage) return DEFAULT_LOCALE;
  const candidates = acceptLanguage
    .split(",")
    .map((part) => part.split(";")[0]?.trim().toLowerCase())
    .filter(Boolean);

  for (const candidate of candidates) {
    if (!candidate) continue;
    if (candidate.startsWith("pt")) return "pt-BR";
    if (candidate.startsWith("es")) return "es";
  }

  return DEFAULT_LOCALE;
}
