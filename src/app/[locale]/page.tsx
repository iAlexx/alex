import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary } from "@/content/translations";
import { isLocale } from "@/lib/i18n/config";
import { buildHomeMetadata } from "@/lib/seo/metadata";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { HeroV2Section } from "@/components/v2/HeroV2Section";
import { MethodSection } from "@/components/v2/MethodSection";
import { WorldBrandsSection } from "@/components/v2/WorldBrandsSection";
import { WorldSystemsSection } from "@/components/v2/WorldSystemsSection";
import { WorldIntelligenceSection } from "@/components/v2/WorldIntelligenceSection";
import { WorldSecuritySection } from "@/components/v2/WorldSecuritySection";
import { FutureDirectionSection } from "@/components/v2/FutureDirectionSection";
import { ManifestoV2Section } from "@/components/v2/ManifestoV2Section";
import { ContactV2Section } from "@/components/v2/ContactV2Section";
import { DeferredHomepageRailMotion } from "@/components/v2/motion/DeferredHomepageRailMotion";
import { HomepageStructuredData } from "@/components/seo/HomepageStructuredData";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return {};
  }
  return buildHomeMetadata(locale, getDictionary(locale));
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  const dictionary = getDictionary(locale);

  return (
    <>
      <HomepageStructuredData locale={locale} />
      <SiteHeader locale={locale} dictionary={dictionary} />
      <main id="main" className="relative z-[1] flex-1">
        <HeroV2Section locale={locale} dictionary={dictionary} />
        <MethodSection locale={locale} dictionary={dictionary} />
        <WorldBrandsSection locale={locale} dictionary={dictionary} />
        <WorldSystemsSection
          locale={locale}
          dictionary={dictionary}
          bridgeAnnotation={dictionary.homeV2.bridges.brandsToSystems}
        />
        <WorldIntelligenceSection
          locale={locale}
          dictionary={dictionary}
          bridgeAnnotation={dictionary.homeV2.bridges.systemsToIntelligence}
        />
        <WorldSecuritySection
          locale={locale}
          dictionary={dictionary}
          bridgeAnnotation={dictionary.homeV2.bridges.intelligenceToSecurity}
        />
        <FutureDirectionSection
          locale={locale}
          dictionary={dictionary}
          bridgeAnnotation={dictionary.homeV2.bridges.securityToFuture}
        />
        <ManifestoV2Section locale={locale} dictionary={dictionary} />
        <ContactV2Section locale={locale} dictionary={dictionary} />
      </main>
      <SiteFooter locale={locale} dictionary={dictionary} />
      <DeferredHomepageRailMotion />
    </>
  );
}
