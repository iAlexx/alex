/** Shared Builder Spine alignment — sections align fragments to these offsets. */
export const SPINE_INSET = "clamp(1rem, 3vw, 2.5rem)" as const;

export type SpineFragment =
  | "origin"
  | "through"
  | "node-brands"
  | "node-systems"
  | "branch-intel"
  | "node-secure"
  | "dashed"
  | "converge";

export const spineFragmentClass: Record<SpineFragment, string> = {
  origin: "spine-fragment-origin",
  through: "spine-fragment-through",
  "node-brands": "spine-fragment-node-brands",
  "node-systems": "spine-fragment-node-systems",
  "branch-intel": "spine-fragment-branch-intel",
  "node-secure": "spine-fragment-node-secure",
  dashed: "spine-fragment-dashed",
  converge: "spine-fragment-converge",
};
