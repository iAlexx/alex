import Link from "next/link";
import type { Dictionary } from "@/content/translations";
import type { Locale } from "@/lib/i18n/config";
import { badgeClass } from "@/lib/i18n/locale-classes";
import { CodexBuilderThreshold } from "./CodexBuilderThreshold";
import { CodexHeroPortrait } from "./CodexHeroPortrait";

interface CodexHeroCompositionProps {
  locale: Locale;
  dictionary: Dictionary;
}

export function CodexHeroComposition({ locale, dictionary }: CodexHeroCompositionProps) {
  const base = `/${locale}`;
  const isArabic = locale === "ar";
  const hero = dictionary.homeV2.hero;

  return (
    <section className="codex-threshold-hero" aria-labelledby="codex-threshold-title">
      <div className="codex-threshold-grid">
        <div className="codex-threshold-copy">
          <p className="codex-threshold-name">{dictionary.hero.name}</p>
          <h1 id="codex-threshold-title" className="codex-threshold-title">
            {dictionary.hero.statement}
          </h1>
          <p className="codex-threshold-role" dir="auto">
            {dictionary.hero.headline}
          </p>
          <p className="codex-threshold-human">{hero.humanLine}</p>
          <p className="codex-threshold-supporting">{dictionary.hero.supporting}</p>

          <div className="codex-threshold-actions">
            <Link
              className="codex-threshold-action codex-threshold-action--primary"
              href={`${base}#world-brands`}
            >
              {hero.exploreSystem}
            </Link>
            <Link
              className="codex-threshold-action codex-threshold-action--secondary"
              href={`${base}#future`}
            >
              {hero.enterFuture}
            </Link>
            <span className="codex-threshold-cv" aria-disabled="true">
              <span>{dictionary.hero.viewCv}</span>
              <span className={badgeClass(locale)}>{dictionary.common.comingSoon}</span>
            </span>
          </div>
        </div>

        <div className={`codex-threshold-scene ${isArabic ? "codex-threshold-scene--rtl" : ""}`}>
          <div className="codex-threshold-scene__fill" aria-hidden />
          <CodexHeroPortrait locale={locale} dictionary={dictionary} />
          <CodexBuilderThreshold originLabel={hero.originLabel} />
          <p className="codex-threshold-worlds">
            <span>{dictionary.homeV2.method.worlds.brands.label}</span>
            <span>{dictionary.homeV2.method.worlds.systems.label}</span>
            <span>{dictionary.homeV2.method.worlds.intelligence.label}</span>
            <span>{dictionary.homeV2.method.worlds.security.label}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
