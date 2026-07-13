import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { heroNameClass, bodyTextClass, badgeClass } from "@/lib/i18n/locale-classes";
import type { Dictionary } from "@/content/translations";
import { HeroLabKineticHeadline } from "@/components/hero-lab/HeroLabKineticHeadline";

interface HeroLabCopyProps {
  locale: Locale;
  dictionary: Dictionary;
  variant: "a" | "b" | "c";
  device: "desktop" | "mobile";
  reducedPreview?: boolean;
}

/** Approved Hero copy from dictionary — lab only. */
export function HeroLabCopy({
  locale,
  dictionary,
  variant,
  device,
  reducedPreview = false,
}: HeroLabCopyProps) {
  const base = `/${locale}`;
  const hero = dictionary.homeV2.hero;
  const isArabic = locale === "ar";

  return (
    <div
      className={`hero-lab-copy hero-lab-copy--${variant} hero-lab-copy--${device}`}
      data-reduced-preview={reducedPreview ? "1" : "0"}
    >
      <p className={heroNameClass(locale)}>{dictionary.hero.name}</p>
      <HeroLabKineticHeadline
        locale={locale}
        statement={dictionary.hero.statement}
        variant={variant}
        reducedPreview={reducedPreview}
      />
      <p
        className={`hero-lab-copy__headline mt-5 text-sm font-medium text-mist sm:text-base ${isArabic ? "leading-8" : "tracking-tight"}`}
        data-hero-lab-meta
      >
        {dictionary.hero.headline}
      </p>
      <p
        className={`hero-lab-copy__human mt-6 max-w-xl text-lg font-medium text-soft ${isArabic ? "leading-8" : "leading-relaxed"}`}
        data-hero-lab-meta
      >
        {hero.humanLine}
      </p>
      <p className={`mt-4 max-w-xl ${bodyTextClass(locale)}`} data-hero-lab-meta>
        {dictionary.hero.supporting}
      </p>

      <div className="hero-lab-origin" aria-hidden data-hero-lab-origin>
        <span className="hero-lab-origin__dot" />
        <span className="hero-lab-origin__label">{hero.originLabel}</span>
      </div>

      <div className="hero-lab-cta mt-9 flex min-w-0 flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
        <Link
          href={`${base}#world-brands`}
          className="hero-lab-cta__primary inline-flex min-h-12 items-center justify-center rounded-full bg-electric px-6 text-sm font-semibold text-obsidian"
          tabIndex={-1}
        >
          {hero.exploreSystem}
        </Link>
        <Link
          href={`${base}#future`}
          className="hero-lab-cta__secondary inline-flex min-h-12 items-center justify-center rounded-full border border-line px-6 text-sm font-medium text-soft"
          tabIndex={-1}
        >
          {hero.enterFuture}
        </Link>
        <span
          aria-disabled="true"
          className="inline-flex min-h-11 items-center gap-2 text-sm text-mist/75"
        >
          <span className="border-b border-dotted border-line/80 pb-0.5">
            {dictionary.hero.viewCv}
          </span>
          <span className={badgeClass(locale)}>{dictionary.common.comingSoon}</span>
        </span>
      </div>
    </div>
  );
}
