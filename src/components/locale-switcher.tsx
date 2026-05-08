"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { GlobeIcon } from "lucide-react";

import { LOCALES, LOCALE_COOKIE, type AppLocale } from "@/i18n/routing";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

const FLAGS: Record<AppLocale, string> = {
  "pt-BR": "🇧🇷",
  es: "🇪🇸",
};

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("locale");
  const [pending, startTransition] = useTransition();

  function onChange(next: AppLocale) {
    if (next === locale) return;
    document.cookie = `${LOCALE_COOKIE}=${next}; Path=/; Max-Age=${ONE_YEAR_SECONDS}; SameSite=Lax`;
    startTransition(() => {
      // Hard reload — server components need to re-render with the new locale
      // and there's no path prefix to swap with router.replace.
      window.location.reload();
    });
  }

  return (
    <label
      className={`flex items-center gap-2 rounded-xl border border-border bg-card/30 px-3 py-2 text-sm ${
        className ?? ""
      }`}
    >
      <GlobeIcon className="size-4 text-muted-foreground" aria-hidden />
      <span className="sr-only">Idioma</span>
      <select
        value={locale}
        disabled={pending}
        onChange={(e) => onChange(e.target.value as AppLocale)}
        className="flex-1 bg-transparent text-foreground outline-none disabled:opacity-60"
      >
        {LOCALES.map((l) => (
          <option key={l} value={l} className="bg-background text-foreground">
            {FLAGS[l]} {t(l)}
          </option>
        ))}
      </select>
    </label>
  );
}
