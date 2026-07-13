import Link from "next/link";
import type { Metadata } from "next";
import { getDictionary } from "@/content/translations";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { buildNotFoundMetadata } from "@/lib/seo/metadata";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export async function generateMetadata({
  params,
}: {
  params?: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const resolved = params ? await params : undefined;
  const localeParam = resolved?.locale ?? "en";
  const locale = isLocale(localeParam) ? localeParam : "en";
  return buildNotFoundMetadata(locale, getDictionary(locale));
}

/** Localized 404 — params may be undefined during static analysis. */
export default async function LocaleNotFound({ params }: { params?: Promise<{ locale: string }> }) {
  const resolved = params ? await params : undefined;
  const localeParam = resolved?.locale ?? "en";
  const locale: Locale = isLocale(localeParam) ? localeParam : "en";
  const dictionary = getDictionary(locale);
  const base = `/${locale}`;

  return (
    <>
      <SiteHeader locale={locale} dictionary={dictionary} />
      <main
        id="main"
        className="mx-auto flex min-h-[60vh] max-w-lg flex-1 flex-col items-center justify-center px-6 py-20 text-center"
      >
        <p className="text-sm font-medium text-electric">404</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
          {dictionary.a11y.pageNotFoundTitle}
        </h1>
        <p className="mt-4 text-sm text-mist">{dictionary.a11y.pageNotFoundDescription}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href={base}
            className="inline-flex min-h-12 items-center rounded-full bg-electric px-6 text-sm font-semibold text-obsidian transition-colors hover:bg-glow"
          >
            {dictionary.a11y.pageNotFoundHome}
          </Link>
          <Link
            href={`${base}/projects`}
            className="inline-flex min-h-12 items-center rounded-full border border-line px-6 text-sm font-medium text-soft transition-colors hover:border-electric"
          >
            {dictionary.nav.projects}
          </Link>
        </div>
      </main>
      <SiteFooter locale={locale} dictionary={dictionary} />
    </>
  );
}
