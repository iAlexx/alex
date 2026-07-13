import Image from "next/image";
import type { Locale } from "@/lib/i18n/config";
import { bodyTextClass } from "@/lib/i18n/locale-classes";
import type { Dictionary } from "@/content/translations";
import { composition, v2Spacing } from "@/lib/layout/v2-composition";
import { JourneyShell } from "@/components/v2/JourneyShell";
import { MobileDisclosure } from "@/components/mobile/MobileDisclosure";

const MANIFESTO_IMAGE = {
  src: "/images/alex/alex-portrait-manifesto.webp",
  width: 640,
  height: 809,
} as const;

interface ManifestoV2SectionProps {
  locale: Locale;
  dictionary: Dictionary;
}

/** Manifesto with restrained path convergence (Phase 7.3B.6). */
export function ManifestoV2Section({ locale, dictionary }: ManifestoV2SectionProps) {
  const supportingClass = bodyTextClass(locale);
  const mobile = dictionary.homeV2.mobile;
  const worlds = ["Brands", "Systems", "Intelligence", "Security"];

  return (
    <JourneyShell
      id="manifesto"
      spine="converge"
      atmosphere="manifesto"
      spineWaypoint="manifesto"
      className="overflow-hidden"
    >
      <div className="relative min-h-[min(60vh,32rem)]">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={MANIFESTO_IMAGE.src}
            alt={dictionary.a11y.manifestoImageAlt}
            width={MANIFESTO_IMAGE.width}
            height={MANIFESTO_IMAGE.height}
            sizes="100vw"
            className="h-full w-full object-cover object-[center_22%] opacity-45 sm:object-[center_20%]"
          />
        </div>
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_45%,color-mix(in_srgb,var(--color-obsidian)_25%,transparent),color-mix(in_srgb,var(--color-obsidian)_88%,transparent))]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_bottom,color-mix(in_srgb,var(--color-obsidian)_82%,transparent),color-mix(in_srgb,var(--color-obsidian)_55%,transparent)_40%,color-mix(in_srgb,var(--color-obsidian)_92%,transparent))]"
        />

        <div
          aria-hidden
          className="manifesto-frame-convergence pointer-events-none absolute inset-0"
        >
          <span className="manifesto-frame-convergence__module manifesto-frame-convergence__module--brands" />
          <span className="manifesto-frame-convergence__module manifesto-frame-convergence__module--systems" />
          <span className="manifesto-frame-convergence__module manifesto-frame-convergence__module--intelligence" />
          <span className="manifesto-frame-convergence__module manifesto-frame-convergence__module--security" />
        </div>

        <div
          aria-hidden
          className="manifesto-convergence"
          title="World paths converge toward Alex Core"
        >
          {worlds.map((world, index) => (
            <span
              key={world}
              className="manifesto-convergence__line"
              data-rail-line
              style={{
                width: "42%",
                top: `${18 + index * 16}%`,
                insetInlineEnd: "8%",
                transform: `rotate(${-28 + index * 18}deg)`,
              }}
            />
          ))}
          <span
            className="absolute bottom-[18%] end-[6%] size-3 rounded-full bg-electric shadow-[0_0_10px_color-mix(in_srgb,var(--color-electric)_50%,transparent)]"
            data-rail-marker
          />
        </div>

        <div className={`relative ${composition.innerWide} flex items-end ${v2Spacing.manifesto}`}>
          <blockquote className="max-w-3xl">
            <p className="text-3xl leading-[1.2] font-semibold text-balance sm:text-4xl lg:text-5xl">
              {dictionary.manifesto.text}
            </p>
            <p className={`mobile-compress-hide mt-6 max-w-xl ${supportingClass}`}>
              {dictionary.manifesto.supporting}
            </p>
            <MobileDisclosure
              label={mobile.disclosure.moreDetails}
              labelExpanded={mobile.disclosure.showLess}
            >
              <p className={`max-w-xl ${supportingClass}`}>{dictionary.manifesto.supporting}</p>
            </MobileDisclosure>
          </blockquote>
        </div>
      </div>
    </JourneyShell>
  );
}
