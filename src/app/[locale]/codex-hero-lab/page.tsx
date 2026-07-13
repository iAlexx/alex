import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CodexHeroLab } from "@/components/codex-hero-lab/CodexHeroLab";
import { getDictionary } from "@/content/translations";
import { isLocale } from "@/lib/i18n/config";

export const dynamic = "force-static";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const dictionary = getDictionary(locale);
  return {
    title: `${dictionary.hero.name} — The Builder's Threshold`,
    description: dictionary.meta.description,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function CodexHeroLabPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <CodexHeroLab locale={locale} dictionary={getDictionary(locale)} />;
}
