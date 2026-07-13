import { getDictionary } from "@/content/translations";
import type { Locale } from "@/lib/i18n/config";
import { JsonLd } from "@/lib/seo/json-ld";
import {
  buildPersonSchema,
  buildProfilePageSchema,
  buildWebSiteSchema,
} from "@/lib/seo/structured-data";

interface HomepageStructuredDataProps {
  locale: Locale;
}

export function HomepageStructuredData({ locale }: HomepageStructuredDataProps) {
  const dictionary = getDictionary(locale);
  const graph = [
    buildPersonSchema(locale),
    buildWebSiteSchema(locale, dictionary),
    buildProfilePageSchema(locale, dictionary),
  ];

  return <JsonLd data={{ "@context": "https://schema.org", "@graph": graph }} />;
}
