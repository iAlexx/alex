import type { HomeV2Copy } from "@/content/translations/types";
import {
  JourneyRail,
  JourneyRailNode,
  JourneyRailSummary,
  JourneyRailTrack,
} from "@/components/v2/journey-rail/JourneyRail";

interface FuturePathRailProps {
  future: HomeV2Copy["worlds"]["future"];
}

/** Open directional path — shared journey rail grammar. */
export function FuturePathRail({ future }: FuturePathRailProps) {
  return (
    <JourneyRail
      world="future"
      layout="open-vertical"
      ariaLabel={future.title}
      spineAnchor="future-path"
    >
      <JourneyRailSummary text={future.title} />

      <div className="journey-rail__origin mb-4 flex items-center gap-3" data-rail-node="origin">
        <span aria-hidden className="journey-rail__node-marker" data-rail-marker />
        <p className="text-xs font-semibold uppercase tracking-wide text-electric">
          {future.pathOriginLabel}
        </p>
      </div>

      <JourneyRailTrack>
        {future.items.map((item) => (
          <JourneyRailNode
            key={item.label}
            title={item.label}
            description={item.description}
            titleDir="auto"
          />
        ))}
        <JourneyRailNode
          title={future.openPathLabel}
          description={future.openPathHint}
          variant="open"
        />
      </JourneyRailTrack>
    </JourneyRail>
  );
}
