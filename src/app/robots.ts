import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/config/site";
import { locales } from "@/lib/i18n/config";

const LAB_SEGMENTS = ["hero-lab", "three-hero-lab", "codex-hero-lab"] as const;

function labDisallowPaths(): string[] {
  return locales.flatMap((locale) => LAB_SEGMENTS.map((segment) => `/${locale}/${segment}`));
}

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: labDisallowPaths(),
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
