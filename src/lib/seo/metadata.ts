import type { Metadata } from "next";
import { getSiteUrl, siteConfig, absoluteUrl, localePath } from "@/config/site";
import { buildLocaleAlternates } from "@/lib/seo/alternates";
import { getProjectIndexingDecision } from "@/lib/seo/project-indexing";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/content/translations";
import type { PortfolioProject } from "@/content/projects/types";

const OG_LOCALE_MAP: Record<Locale, string> = {
  en: "en_US",
  ar: "ar",
};

const OG_ALTERNATE_MAP: Record<Locale, string> = {
  en: "ar",
  ar: "en_US",
};

interface PageMetadataInput {
  locale: Locale;
  title: string;
  description: string;
  routePath?: string;
  robots?: Metadata["robots"];
  imagePath?: string;
}

function openGraphImages(locale: Locale, title: string, imagePath?: string) {
  const imageUrl = absoluteUrl(imagePath ?? `/${locale}/opengraph-image`);
  return [
    {
      url: imageUrl,
      width: 1200,
      height: 630,
      alt: title,
      type: "image/png",
    },
  ];
}

export function buildPageMetadata({
  locale,
  title,
  description,
  routePath = "",
  robots,
  imagePath,
}: PageMetadataInput): Metadata {
  const pageUrl = absoluteUrl(localePath(locale, routePath));
  const alternates = buildLocaleAlternates(locale, routePath);
  const ogImage = imagePath ?? `/${locale}/opengraph-image`;

  return {
    title,
    description,
    alternates,
    robots,
    openGraph: {
      type: siteConfig.defaultOgType,
      siteName: siteConfig.name,
      title,
      description,
      url: pageUrl,
      locale: OG_LOCALE_MAP[locale],
      alternateLocale: [OG_ALTERNATE_MAP[locale]],
      images: openGraphImages(locale, title, imagePath),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(ogImage)],
    },
  };
}

export function buildHomeMetadata(locale: Locale, dictionary: Dictionary): Metadata {
  return buildPageMetadata({
    locale,
    title: dictionary.meta.title,
    description: dictionary.meta.description,
    routePath: "",
  });
}

export function buildProjectsIndexMetadata(locale: Locale, dictionary: Dictionary): Metadata {
  const title = `${dictionary.projectPages.indexTitle} — ${dictionary.seo.creatorLabel}`;
  return buildPageMetadata({
    locale,
    title,
    description: dictionary.projectPages.indexIntro,
    routePath: "/projects",
  });
}

export function buildProjectMetadata(
  locale: Locale,
  dictionary: Dictionary,
  project: PortfolioProject,
): Metadata {
  const seo = dictionary.seo.projectMeta[project.slug];
  const title = `${seo.title} ${dictionary.seo.caseStudyTitleSuffix}`.trim();
  const description = seo.description;
  const indexing = getProjectIndexingDecision(project);

  return buildPageMetadata({
    locale,
    title,
    description,
    routePath: `/projects/${project.slug}`,
    imagePath: `/${locale}/projects/${project.slug}/opengraph-image`,
    robots:
      indexing.policy === "noindex"
        ? { index: false, follow: true }
        : { index: true, follow: true },
  });
}

export function buildNotFoundMetadata(locale: Locale, dictionary: Dictionary): Metadata {
  return buildPageMetadata({
    locale,
    title: dictionary.a11y.pageNotFoundTitle,
    description: dictionary.a11y.pageNotFoundDescription,
    robots: { index: false, follow: true },
  });
}

export function buildRootMetadataDefaults(): Metadata {
  return {
    metadataBase: new URL(getSiteUrl()),
    applicationName: siteConfig.name,
    creator: siteConfig.creator,
    authors: [{ name: siteConfig.creator }],
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons: {
      icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
      apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }],
    },
    other: {
      "theme-color": siteConfig.themeColor,
    },
  };
}
