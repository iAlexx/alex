import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { heroNameClass, bodyTextClass, badgeClass } from "@/lib/i18n/locale-classes";
import type { Dictionary } from "@/content/translations";
import { composition, v2Spacing } from "@/lib/layout/v2-composition";
import { JourneyShell } from "@/components/v2/JourneyShell";
import { HeroStatement } from "@/components/v2/hero/HeroStatement";
import { HeroWorkstationVisual } from "@/components/v2/hero/HeroWorkstationVisual";

interface HeroV2SectionLegacyProps {
  locale: Locale;
  dictionary: Dictionary;
}

/** Legacy production Hero — workstation centerpiece (rollback). */
export function HeroV2SectionLegacy({ locale, dictionary }: HeroV2SectionLegacyProps) {
  const base = `/${locale}`;
  const isArabic = locale === "ar";
  const hero = dictionary.homeV2.hero;

  return (
    <JourneyShell
      id="hero"
      spine="origin"
      atmosphere="core"
      spineWaypoint="core"
      className="hero-static-shell overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_42%_at_78%_18%,color-mix(in_srgb,var(--color-electric)_8%,transparent),transparent_62%)]"
      />

      <div className={`${composition.innerWide} ${v2Spacing.hero}`}>
        <div className="hero-static__grid">
          <div className="hero-static__lead">
            <p className={heroNameClass(locale)}>{dictionary.hero.name}</p>
            <HeroStatement locale={locale} statement={dictionary.hero.statement} />
          </div>

          <HeroWorkstationVisual locale={locale} dictionary={dictionary} />

          <div className="hero-static__body">
            <p
              className={`hero-static__role text-sm font-medium text-mist sm:text-base ${isArabic ? "leading-8" : "tracking-tight"}`}
            >
              {dictionary.hero.headline}
            </p>
            <p
              className={`hero-static__human mt-5 max-w-xl text-lg font-medium text-soft sm:mt-6 ${isArabic ? "leading-8" : "leading-relaxed"}`}
            >
              {hero.humanLine}
            </p>
            <p className={`hero-static__support mt-4 max-w-xl ${bodyTextClass(locale)}`}>
              {dictionary.hero.supporting}
            </p>

            <div className="hero-origin-rail" aria-hidden data-rail-motion-root>
              <div className="hero-origin-rail__node" data-rail-node>
                <span className="hero-origin-rail__marker" data-rail-marker />
                <span>{hero.originLabel}</span>
              </div>
              <span className="hero-origin-rail__stem" data-rail-line />
            </div>

            <div className="hero-static__cta mt-8 flex min-w-0 flex-col gap-4 sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href={`${base}#world-brands`}
                className="hero-static__cta-primary inline-flex min-h-12 shrink-0 max-w-full items-center justify-center rounded-full bg-electric px-6 text-sm font-semibold text-obsidian transition-colors hover:bg-glow sm:px-7"
              >
                {hero.exploreSystem}
              </Link>
              <Link
                href={`${base}#future`}
                className="hero-static__cta-secondary inline-flex min-h-12 shrink-0 max-w-full items-center justify-center rounded-full border border-line px-6 text-sm font-medium text-soft transition-colors hover:border-electric sm:px-7"
              >
                {hero.enterFuture}
              </Link>
              <span
                aria-disabled="true"
                className="inline-flex min-h-11 items-center gap-2 ps-1 text-sm text-mist/75 sm:ps-0"
              >
                <span className="border-b border-dotted border-line/80 pb-0.5">
                  {dictionary.hero.viewCv}
                </span>
                <span className={badgeClass(locale)}>{dictionary.common.comingSoon}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </JourneyShell>
  );
}
