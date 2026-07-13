import type { ReactNode } from "react";
import type { SpineFragment } from "@/lib/layout/spine-tokens";
import { spineFragmentClass } from "@/lib/layout/spine-tokens";
import type { ContinuityEdge } from "@/lib/layout/color-continuity";
import type { WorldAccent } from "@/lib/design/tokens";

type Atmosphere = WorldAccent | "core" | "future" | "manifesto";

export type SpineConnector = WorldAccent | "future";

const atmosphereClass: Record<Atmosphere, string> = {
  brands: "atmosphere-brands",
  systems: "atmosphere-systems",
  intelligence: "atmosphere-intelligence",
  security: "atmosphere-security",
  core: "atmosphere-core",
  future: "atmosphere-future",
  manifesto: "atmosphere-manifesto",
};

interface JourneyShellProps {
  id?: string;
  spine: SpineFragment;
  atmosphere?: Atmosphere;
  continuityIn?: ContinuityEdge;
  continuityOut?: ContinuityEdge;
  connector?: SpineConnector;
  /** Stable anchor for global traveler waypoint interpolation. */
  spineWaypoint?: string;
  /** Mobile chapter marker label (localized eyebrow). */
  chapterLabel?: string;
  className?: string;
  children: ReactNode;
}

/** Section wrapper with spine, atmosphere, continuity, and content connector. */
export function JourneyShell({
  id,
  spine,
  atmosphere,
  continuityIn,
  continuityOut,
  connector,
  spineWaypoint,
  chapterLabel,
  className = "",
  children,
}: JourneyShellProps) {
  const atmo = atmosphere ? atmosphereClass[atmosphere] : "";

  return (
    <section
      id={id}
      data-continuity-in={continuityIn}
      data-continuity-out={continuityOut}
      data-spine-section={spineWaypoint ?? id}
      data-chapter-label={chapterLabel}
      className={`journey-shell relative scroll-mt-20 ${atmo} ${className}`.trim()}
    >
      <div
        aria-hidden
        data-rail-spine
        className={`builder-spine pointer-events-none ${spineFragmentClass[spine]}`}
      />
      {spineWaypoint ? (
        <span aria-hidden data-spine-waypoint={spineWaypoint} className="spine-waypoint" />
      ) : null}
      {connector ? (
        <div
          aria-hidden
          data-rail-connector
          className={`spine-content-connector pointer-events-none spine-content-connector--${connector}`}
        />
      ) : null}
      <div className="journey-content relative z-[2]">{children}</div>
    </section>
  );
}

/** Stable layout anchor for spine-to-content connectors. */
export function JourneyComposition({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={`journey-composition relative ${className}`.trim()}>{children}</div>;
}
