import type { WorldAccent } from "@/lib/design/tokens";

/** Shared journey rail world accents — Phase 7.3B.6. */
export type RailWorld = WorldAccent | "core" | "future" | "manifesto";

export const railWorldDataAttribute: Record<RailWorld, string> = {
  core: "core",
  brands: "brands",
  systems: "systems",
  intelligence: "intelligence",
  security: "security",
  future: "future",
  manifesto: "manifesto",
};

export type RailLayout =
  | "process-horizontal"
  | "process-vertical"
  | "editorial-horizontal"
  | "operational-horizontal"
  | "architecture"
  | "micro-flow"
  | "discipline-vertical"
  | "open-vertical"
  | "map-branch"
  | "convergence"
  | "contact-resolve";
