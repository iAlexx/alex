import { getSiteUrl, siteConfig } from "@/config/site";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/content/translations";
import type { PortfolioProject } from "@/content/projects/types";
import type { CaseStudyCopy } from "@/content/translations/types";
import { absoluteUrl, localePath } from "@/config/site";

export function buildPersonSchema(locale: Locale) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: siteConfig.creator,
    alternateName: siteConfig.alternateName,
    url: absoluteUrl(localePath(locale)),
    sameAs: Object.values(siteConfig.social),
    jobTitle: siteConfig.jobTitle.join(", "),
    knowsAbout: siteConfig.knowsAbout,
  };
}

export function buildWebSiteSchema(locale: Locale, dictionary: Dictionary) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: dictionary.meta.siteName,
    url: absoluteUrl(localePath(locale)),
    inLanguage: locale,
    description: dictionary.meta.description,
    creator: { "@id": `${siteUrl}/#person` },
  };
}

export function buildProfilePageSchema(locale: Locale, dictionary: Dictionary) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${siteUrl}${localePath(locale)}#profile`,
    url: absoluteUrl(localePath(locale)),
    name: dictionary.meta.title,
    description: dictionary.meta.description,
    inLanguage: locale,
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${siteUrl}/#person` },
    mainEntity: { "@id": `${siteUrl}/#person` },
  };
}

export function buildCreativeWorkSchema(
  locale: Locale,
  project: PortfolioProject,
  copy: CaseStudyCopy,
  dictionary: Dictionary,
) {
  const pageUrl = absoluteUrl(localePath(locale, `/projects/${project.slug}`));
  const seo = dictionary.seo.projectMeta[project.slug];
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${pageUrl}#work`,
    name: copy.title,
    headline: seo.title,
    description: seo.description,
    url: pageUrl,
    inLanguage: locale,
    author: { "@id": `${getSiteUrl()}/#person` },
    creator: { "@id": `${getSiteUrl()}/#person` },
    keywords: project.technologies.join(", "),
  };
}
