import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";

import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  isAppLocale,
  negotiateLocale,
  type AppLocale,
} from "./routing";

// Sem path prefix: detecção via cookie (pref. da aluna) com fallback no
// Accept-Language do request. Mantém URLs limpas para multi-tenant via slug
// e evita reescrever todo o roteamento existente do app.
async function resolveLocale(): Promise<AppLocale> {
  const cookieStore = await cookies();
  const fromCookie = cookieStore.get(LOCALE_COOKIE)?.value;
  if (isAppLocale(fromCookie)) return fromCookie;

  const headerStore = await headers();
  return negotiateLocale(headerStore.get("accept-language"));
}

export default getRequestConfig(async () => {
  const locale = await resolveLocale();
  const messages = (await import(`../../messages/${locale}.json`)).default;
  return {
    locale,
    messages,
    timeZone: "America/Sao_Paulo",
    now: new Date(),
  };
});

export { DEFAULT_LOCALE };
