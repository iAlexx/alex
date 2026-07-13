import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary } from "@/content/translations";
import { isLocale } from "@/lib/i18n/config";
import { ThreeHeroLab } from "@/components/three-hero-lab/ThreeHeroLab";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const dictionary = getDictionary(locale);
  return {
    title: `${dictionary.threeHeroLab.title} — ${dictionary.meta.siteName}`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

/** Three Hero Lab — orbital workstation visual (Phase 7.4R.2). Not indexed. */
export default async function ThreeHeroLabPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dictionary = getDictionary(locale);

  return (
    <main id="main" className="flex-1">
      <ThreeHeroLab locale={locale} dictionary={dictionary} />
    </main>
  );
}
