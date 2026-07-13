import type { CSSProperties } from "react";
import type { HomeV2Copy } from "@/content/translations/types";
import { JourneyRail, JourneyRailSummary } from "@/components/v2/journey-rail/JourneyRail";
import { BuilderMap3D } from "@/components/v2/map3d/BuilderMap3D";

interface BuilderMapProps {
  map: HomeV2Copy["method"];
}

const WORLD_ORDER = ["brands", "systems", "intelligence", "security"] as const;

const WORLD_COLORS: Record<(typeof WORLD_ORDER)[number], string> = {
  brands: "var(--accent-brand)",
  systems: "var(--accent-system)",
  intelligence: "var(--accent-intel)",
  security: "var(--accent-secure)",
};

/** Builder Map — central world split using shared rail grammar. */
export function BuilderMap({ map }: BuilderMapProps) {
  const worlds = WORLD_ORDER.map((key) => ({
    key,
    color: WORLD_COLORS[key],
    ...map.worlds[key],
  }));

  return (
    <JourneyRail
      world="core"
      layout="map-branch"
      ariaLabel={map.mapAccessibleSummary}
      className="mt-8"
      spineAnchor="map"
    >
      <JourneyRailSummary text={map.mapAccessibleSummary} />

      <BuilderMap3D />

      <div className="journey-rail__canvas">
        <div className="journey-rail__core">
          <div className="journey-rail__node journey-rail__node--core" data-rail-node>
            <span aria-hidden className="journey-rail__node-marker" data-rail-marker />
            <div className="journey-rail__node-body">
              <p className="journey-rail__node-title">Alex Core</p>
            </div>
          </div>
        </div>

        <span aria-hidden className="journey-rail__core-connector" data-rail-line />
        <span aria-hidden className="journey-rail__branch-rail" data-rail-line />

        {worlds.map((world) => (
          <div
            key={world.key}
            className="journey-rail__world-node"
            data-rail-node
            data-world-order={world.key}
            style={{ "--rail-world-color": world.color } as CSSProperties}
          >
            <p className="journey-rail__node-title" style={{ color: world.color }}>
              {world.label}
            </p>
            <p className="journey-rail__node-description">{world.projects}</p>
            <span
              aria-hidden
              className="journey-rail__world-drop"
              data-rail-marker
              style={{ background: world.color }}
            />
          </div>
        ))}
      </div>
    </JourneyRail>
  );
}
