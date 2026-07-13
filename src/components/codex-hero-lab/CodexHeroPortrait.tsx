import Image from "next/image";
import type { Dictionary } from "@/content/translations";
import type { Locale } from "@/lib/i18n/config";

interface CodexHeroPortraitProps {
  locale: Locale;
  dictionary: Dictionary;
}

export function CodexHeroPortrait({ locale, dictionary }: CodexHeroPortraitProps) {
  return (
    <div className="codex-threshold-portrait" data-locale={locale}>
      <picture>
        <source
          media="(max-width: 639px)"
          srcSet="/images/alex/alex-workstation-mobile.webp"
          type="image/webp"
        />
        <Image
          src="/images/alex/alex-workstation-desktop.webp"
          alt={dictionary.a11y.heroImageAlt}
          width={960}
          height={831}
          priority
          sizes="(max-width: 639px) 96vw, (max-width: 1023px) 82vw, 57vw"
          className="codex-threshold-portrait__image"
          draggable={false}
        />
      </picture>
      <span className="codex-threshold-portrait__key" aria-hidden />
      <span className="codex-threshold-portrait__rim" aria-hidden />
      <span className="codex-threshold-portrait__depth" aria-hidden />
    </div>
  );
}
