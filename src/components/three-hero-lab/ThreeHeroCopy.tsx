"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { Locale } from "@/lib/i18n/config";
import { heroNameClass, bodyTextClass, badgeClass } from "@/lib/i18n/locale-classes";
import type { Dictionary } from "@/content/translations";

interface ThreeHeroCopyProps {
  locale: Locale;
  dictionary: Dictionary;
  motionEnabled?: boolean;
}

function HeroHeadline({ locale, statement }: { locale: Locale; statement: string }) {
  const isArabic = locale === "ar";

  if (isArabic) {
    return (
      <h1 className="three-hero-copy__title" dir="auto" data-three-hero-h1>
        {statement}
      </h1>
    );
  }

  const parts = statement.split(/,\s*/);
  if (parts.length <= 1) {
    return (
      <h1 className="three-hero-copy__title" data-three-hero-h1>
        {statement}
      </h1>
    );
  }

  return (
    <h1 className="three-hero-copy__title" data-three-hero-h1>
      {parts.map((part, index) => {
        const isLast = index === parts.length - 1;
        return (
          <span key={part} className="three-hero-copy__title-line" data-three-hero-line>
            {part}
            {!isLast ? "," : ""}
          </span>
        );
      })}
    </h1>
  );
}

/** Approved Hero copy — HTML only, no canvas text. */
export function ThreeHeroCopy({ locale, dictionary, motionEnabled = true }: ThreeHeroCopyProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const base = `/${locale}`;
  const hero = dictionary.homeV2.hero;
  const isArabic = locale === "ar";

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !motionEnabled) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const lines = root.querySelectorAll<HTMLElement>(
      "[data-three-hero-line], [data-three-hero-h1]",
    );
    const meta = root.querySelectorAll<HTMLElement>("[data-three-hero-meta]");
    const core = root.querySelector<HTMLElement>("[data-three-hero-core]");
    const ctas = root.querySelectorAll<HTMLElement>("[data-three-hero-cta]");

    gsap.set([...lines, ...meta, ...ctas, core].filter(Boolean), { y: 10 });
    const tl = gsap.timeline({ delay: 1.05 });
    tl.to(lines, { y: 0, duration: 0.55, stagger: 0.12, ease: "power2.out" });
    tl.to(meta, { y: 0, duration: 0.45, stagger: 0.08, ease: "power2.out" }, "-=0.25");
    tl.to(core, { y: 0, duration: 0.4, ease: "power2.out" }, "-=0.2");
    tl.to(ctas, { y: 0, duration: 0.4, stagger: 0.06, ease: "power2.out" }, "-=0.15");

    return () => {
      tl.kill();
    };
  }, [motionEnabled, locale]);

  return (
    <div ref={rootRef} className={`three-hero-copy${isArabic ? " three-hero-copy--ar" : ""}`}>
      <p className={heroNameClass(locale)} data-three-hero-meta>
        {dictionary.hero.name}
      </p>

      <HeroHeadline locale={locale} statement={dictionary.hero.statement} />

      <p
        className={`three-hero-copy__role mt-5 text-sm font-medium text-mist sm:text-base ${isArabic ? "leading-8" : "tracking-tight"}`}
        data-three-hero-meta
      >
        {dictionary.hero.headline}
      </p>

      <p
        className={`three-hero-copy__human mt-6 max-w-xl text-lg font-medium text-soft ${isArabic ? "leading-8" : "leading-relaxed"}`}
        data-three-hero-meta
      >
        {hero.humanLine}
      </p>

      <p className={`mt-4 max-w-xl ${bodyTextClass(locale)}`} data-three-hero-meta>
        {dictionary.hero.supporting}
      </p>

      <div className="three-hero-core" data-three-hero-core>
        <span className="three-hero-core__node" aria-hidden />
        <span className="three-hero-core__label">{hero.originLabel}</span>
      </div>

      <div className="three-hero-copy__cta mt-9 flex min-w-0 flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
        <Link
          href={`${base}#world-brands`}
          className="three-hero-copy__cta-primary inline-flex min-h-12 items-center justify-center rounded-full bg-electric px-6 text-sm font-semibold text-obsidian transition-colors hover:bg-glow"
          data-three-hero-cta
        >
          {hero.exploreSystem}
        </Link>
        <Link
          href={`${base}#future`}
          className="three-hero-copy__cta-secondary inline-flex min-h-12 items-center justify-center rounded-full border border-line px-6 text-sm font-medium text-soft transition-colors hover:border-electric"
          data-three-hero-cta
        >
          {hero.enterFuture}
        </Link>
        <span
          aria-disabled="true"
          className="inline-flex min-h-11 items-center gap-2 text-sm text-mist/75"
          data-three-hero-cta
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
