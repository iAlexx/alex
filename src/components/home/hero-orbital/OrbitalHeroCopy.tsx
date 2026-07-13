import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { heroNameClass, bodyTextClass } from "@/lib/i18n/locale-classes";
import type { Dictionary } from "@/content/translations";
import { HeroStatement } from "@/components/v2/hero/HeroStatement";
import { HeroSocialLinks } from "@/components/v2/hero/HeroSocialLinks";

interface OrbitalHeroCopyProps {
  locale: Locale;
  dictionary: Dictionary;
}

/** Production Hero copy — dictionaries + ALEX CORE origin rail for Global Traveler. */
export function OrbitalHeroCopy({ locale, dictionary }: OrbitalHeroCopyProps) {
  const base = `/${locale}`;
  const hero = dictionary.homeV2.hero;
  const isArabic = locale === "ar";

  return (
    <div className={`orbital-hero-copy${isArabic ? " orbital-hero-copy--ar" : ""}`}>
      <p className={heroNameClass(locale)}>{dictionary.hero.name}</p>

      <HeroStatement
        locale={locale}
        statement={dictionary.hero.statement}
        titleClassName="orbital-hero-copy__title"
        lineClassName="orbital-hero-copy__title-line"
      />

      <p
        className={`mt-5 text-sm font-medium text-mist sm:text-base ${isArabic ? "leading-8" : "tracking-tight"}`}
      >
        {dictionary.hero.headline}
      </p>

      <p
        className={`mt-6 max-w-xl text-lg font-medium text-soft ${isArabic ? "leading-8" : "leading-relaxed"}`}
      >
        {hero.humanLine}
      </p>

      <p className={`mt-4 max-w-xl ${bodyTextClass(locale)}`}>{dictionary.hero.supporting}</p>

      <div className="hero-origin-rail" aria-hidden data-rail-motion-root>
        <div className="hero-origin-rail__node" data-rail-node>
          <span className="hero-origin-rail__marker" data-rail-marker />
          <span>{hero.originLabel}</span>
        </div>
        <span className="hero-origin-rail__stem" data-rail-line />
      </div>

      <div className="orbital-hero-copy__cta mt-9 flex min-w-0 flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
        <Link
          href={`${base}#world-brands`}
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-electric px-6 text-sm font-semibold text-obsidian transition-colors hover:bg-glow"
        >
          {hero.exploreSystem}
        </Link>
        <Link
          href={`${base}#future`}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-line px-6 text-sm font-medium text-soft transition-colors hover:border-electric"
        >
          {hero.enterFuture}
        </Link>
      </div>

      <HeroSocialLinks dictionary={dictionary} />
    </div>
  );
}
