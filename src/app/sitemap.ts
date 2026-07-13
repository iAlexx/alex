import type { MetadataRoute } from "next";
import { absoluteUrl, localePath } from "@/config/site";
import { locales } from "@/lib/i18n/config";
import { projects } from "@/content/projects";
import { isSitemapProject } from "@/lib/seo/project-indexing";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    entries.push({
      url: absoluteUrl(localePath(locale)),
      alternates: {
        languages: Object.fromEntries(locales.map((code) => [code, absoluteUrl(localePath(code))])),
      },
    });

    entries.push({
      url: absoluteUrl(localePath(locale, "/projects")),
      alternates: {
        languages: Object.fromEntries(
          locales.map((code) => [code, absoluteUrl(localePath(code, "/projects"))]),
        ),
      },
    });

    for (const project of projects) {
      if (!isSitemapProject(project.slug, project)) continue;
      const path = localePath(locale, `/projects/${project.slug}`);
      entries.push({
        url: absoluteUrl(path),
        alternates: {
          languages: Object.fromEntries(
            locales.map((code) => [
              code,
              absoluteUrl(localePath(code, `/projects/${project.slug}`)),
            ]),
          ),
        },
      });
    }
  }

  return entries;
}
