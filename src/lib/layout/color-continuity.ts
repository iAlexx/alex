/** Cross-section atmospheric transition edges (Phase 7.3B.2). */
export type ContinuityEdge =
  "brands-systems" | "systems-intelligence" | "intelligence-security" | "security-future";

export const continuityInAttr = (edge?: ContinuityEdge): string | undefined =>
  edge ? edge : undefined;

export const continuityOutAttr = (edge?: ContinuityEdge): string | undefined =>
  edge ? edge : undefined;

/** Bridge annotation accent — matches the incoming world. */
export type BridgeAccent = "systems" | "intelligence" | "security" | "future";

export const bridgeAccentClass: Record<BridgeAccent, string> = {
  systems: "bridge-accent-systems",
  intelligence: "bridge-accent-intelligence",
  security: "bridge-accent-security",
  future: "bridge-accent-future",
};
