import Link from "next/link";
import type { Dictionary } from "@/content/translations";
import type { Locale } from "@/lib/i18n/config";
import { CodexHeroComposition } from "./CodexHeroComposition";
import "./codex-hero-lab.css";

interface CodexHeroLabProps {
  locale: Locale;
  dictionary: Dictionary;
}

export function CodexHeroLab({ locale, dictionary }: CodexHeroLabProps) {
  return (
    <div className="codex-threshold-page">
      <a className="codex-threshold-skip" href="#main">
        {dictionary.a11y.skipToContent}
      </a>
      <header className="codex-threshold-header">
        <Link href={`/${locale}`} className="codex-threshold-brand">
          <span>{dictionary.hero.name}</span>
          <span aria-hidden> / 01</span>
        </Link>
        <p className="codex-threshold-header__label" dir="ltr">
          THE BUILDER&apos;S THRESHOLD
        </p>
      </header>
      <main id="main">
        <CodexHeroComposition locale={locale} dictionary={dictionary} />
      </main>
    </div>
  );
}
