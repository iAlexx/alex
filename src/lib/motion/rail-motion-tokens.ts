/** Phase 7.3D — restrained rail motion timing. */
export const RAIL_MOTION_EASE = {
  draw: "power2.out",
  node: "power2.out",
  soft: "power1.inOut",
} as const;

export const RAIL_MOTION_DURATION = {
  connector: 0.35,
  mainLine: 0.55,
  branchLine: 0.4,
  node: 0.22,
  nodeMobile: 0.18,
  spine: 0.45,
  convergence: 0.5,
} as const;

export const RAIL_MOTION_TRIGGER = {
  section: "top 78%",
  sectionTight: "top 82%",
  hero: "top 88%",
} as const;

export const RAIL_MOTION_STAGGER = {
  node: 0.12,
  nodeMobile: 0.08,
} as const;
