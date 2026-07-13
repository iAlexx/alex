import { locales, type Locale } from "@/lib/i18n/config";
import { absoluteUrl, localePath } from "@/config/site";

/** Build canonical + hreflang alternates for a localized route. */
export function buildLocaleAlternates(locale: Locale, routePath = "") {
  const languages: Record<string, string> = {};
  for (const code of locales) {
    languages[code] = absoluteUrl(localePath(code, routePath));
  }

  return {
    canonical: absoluteUrl(localePath(locale, routePath)),
    languages,
  };
}
