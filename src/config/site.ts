import { defaultLocale, locales, type Locale } from "@/lib/i18n/config";

/** Stable site identity — not locale-specific copy (see dictionary.meta for localized SEO text). */
export const siteConfig = {
  name: "Alex Portfolio",
  creator: "Alex",
  alternateName: "Alex",
  defaultLocale,
  locales,
  defaultOgType: "website" as const,
  themeColor: "#06080f",
  backgroundColor: "#06080f",
  social: {
    github: "https://github.com/iAlexx",
    linkedin: "https://www.linkedin.com/in/ialexx",
    instagram: "https://instagram.com/_x1c",
    telegram: "https://t.me/xdevalex",
  },
  jobTitle: [
    "Product Builder",
    "Full-Stack Developer",
    "AI Systems & Automation Builder",
    "Cybersecurity Learner",
  ],
  knowsAbout: [
    "Product building",
    "Full-stack development",
    "E-commerce",
    "Local AI systems",
    "Automation workflows",
    "Ethical cybersecurity practice",
  ],
} as const;

/** Production URL from env — never invent a public domain. */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return normalizeSiteUrl(explicit);
  }

  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelHost) {
    return normalizeSiteUrl(`https://${vercelHost}`);
  }

  return "http://localhost:3000";
}

function normalizeSiteUrl(value: string): string {
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  return withProtocol.replace(/\/+$/, "");
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

export function localePath(locale: Locale, path = ""): string {
  const suffix = path.startsWith("/") ? path : path ? `/${path}` : "";
  return `/${locale}${suffix}`;
}

export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;
