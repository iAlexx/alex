import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/content/translations";
import { composition, v2Spacing } from "@/lib/layout/v2-composition";
import { JourneyShell, JourneyComposition } from "@/components/v2/JourneyShell";
import { BridgeAnnotation, HumanAnnotation } from "@/components/v2/BridgeAnnotation";
import { WorldChapterHeader } from "@/components/v2/WorldChapterHeader";
import { IntelligenceArchitecture } from "@/components/v2/IntelligenceArchitecture";

interface WorldIntelligenceSectionProps {
  locale: Locale;
  dictionary: Dictionary;
  bridgeAnnotation?: string;
}

export function WorldIntelligenceSection({
  locale,
  dictionary,
  bridgeAnnotation,
}: WorldIntelligenceSectionProps) {
  const world = dictionary.homeV2.worlds.intelligence;

  return (
    <JourneyShell
      id="world-intelligence"
      spine="branch-intel"
      atmosphere="intelligence"
      continuityIn="systems-intelligence"
      continuityOut="intelligence-security"
      connector="intelligence"
      spineWaypoint="intelligence"
      chapterLabel={world.eyebrow}
      className={v2Spacing.worldIntelligence}
    >
      <JourneyComposition className={composition.innerWide}>
        {bridgeAnnotation ? (
          <div className="mobile-compress-hide">
            <BridgeAnnotation text={bridgeAnnotation} accent="intelligence" />
          </div>
        ) : null}

        <WorldChapterHeader accent="intelligence" eyebrow={world.eyebrow} />
        <div className="mobile-compress-hide">
          <HumanAnnotation locale={locale} text={world.bridge} />
        </div>

        <div className={`mt-6 ${composition.intelArchitecture}`}>
          <IntelligenceArchitecture locale={locale} dictionary={dictionary} />
        </div>
      </JourneyComposition>
    </JourneyShell>
  );
}
