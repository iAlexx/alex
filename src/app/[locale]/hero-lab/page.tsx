import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary } from "@/content/translations";
import { isLocale } from "@/lib/i18n/config";
import { HeroLabShell } from "@/components/hero-lab/HeroLabShell";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const dictionary = getDictionary(locale);
  return {
    title: `${dictionary.heroLab.title} — ${dictionary.meta.siteName}`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

/** Hero Lab — experimental visual comparison (Phase 7.4R.1). Not indexed. */
export default async function HeroLabPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dictionary = getDictionary(locale);

  return (
    <main id="main" className="flex-1">
      <HeroLabShell locale={locale} dictionary={dictionary} />
    </main>
  );
}
