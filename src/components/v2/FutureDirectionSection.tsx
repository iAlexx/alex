import type { Locale } from "@/lib/i18n/config";
import { bodyTextClass } from "@/lib/i18n/locale-classes";
import type { Dictionary } from "@/content/translations";
import { composition, v2Spacing } from "@/lib/layout/v2-composition";
import { JourneyShell, JourneyComposition } from "@/components/v2/JourneyShell";
import { BridgeAnnotation } from "@/components/v2/BridgeAnnotation";
import { FuturePathRail } from "@/components/v2/FuturePathRail";
import { MobileDisclosure } from "@/components/mobile/MobileDisclosure";

interface FutureDirectionSectionProps {
  locale: Locale;
  dictionary: Dictionary;
  bridgeAnnotation?: string;
}

export function FutureDirectionSection({
  locale,
  dictionary,
  bridgeAnnotation,
}: FutureDirectionSectionProps) {
  const future = dictionary.homeV2.worlds.future;
  const mobile = dictionary.homeV2.mobile;
  const paragraphClass = bodyTextClass(locale);

  return (
    <JourneyShell
      id="future"
      spine="dashed"
      atmosphere="future"
      continuityIn="security-future"
      connector="future"
      spineWaypoint="future"
      chapterLabel={future.title}
      className={v2Spacing.future}
    >
      <JourneyComposition className={composition.innerWide}>
        {bridgeAnnotation ? (
          <div className="mobile-compress-hide">
            <BridgeAnnotation text={bridgeAnnotation} accent="future" />
          </div>
        ) : null}

        <h2 className="text-2xl font-semibold tracking-tight text-soft sm:text-3xl">
          {future.title}
        </h2>
        <p className={`mobile-compress-hide mt-4 max-w-2xl ${paragraphClass}`}>{future.intro}</p>
        <p className={`mobile-compress-only mt-3 max-w-xl ${paragraphClass}`}>
          {mobile.future.intro}
        </p>

        <ul className="mobile-future-items mobile-compress-only lg:hidden">
          {future.items.map((item) => (
            <li key={item.label} className="mobile-future-items__item" dir="auto">
              {item.label}
            </li>
          ))}
        </ul>

        <MobileDisclosure
          label={mobile.disclosure.moreDetails}
          labelExpanded={mobile.disclosure.showLess}
        >
          <p className={`max-w-2xl ${paragraphClass}`}>{future.intro}</p>
          <div className="mt-6">
            <FuturePathRail future={future} />
          </div>
        </MobileDisclosure>

        <div className="mobile-compress-hide mt-10">
          <FuturePathRail future={future} />
        </div>
      </JourneyComposition>
    </JourneyShell>
  );
}
