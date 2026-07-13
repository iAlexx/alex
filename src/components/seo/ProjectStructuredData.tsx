import { getDictionary } from "@/content/translations";
import type { Locale } from "@/lib/i18n/config";
import type { PortfolioProject } from "@/content/projects/types";
import type { CaseStudyCopy } from "@/content/translations/types";
import { JsonLd } from "@/lib/seo/json-ld";
import { buildCreativeWorkSchema, buildPersonSchema } from "@/lib/seo/structured-data";

interface ProjectStructuredDataProps {
  locale: Locale;
  project: PortfolioProject;
  copy: CaseStudyCopy;
}

export function ProjectStructuredData({ locale, project, copy }: ProjectStructuredDataProps) {
  const dictionary = getDictionary(locale);
  const graph = [
    buildPersonSchema(locale),
    buildCreativeWorkSchema(locale, project, copy, dictionary),
  ];

  return <JsonLd data={{ "@context": "https://schema.org", "@graph": graph }} />;
}
