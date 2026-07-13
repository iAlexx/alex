/** Persistent homepage World Core — typed world identities */

export const WORLD_STATES = [
  "core",
  "method",
  "brands",
  "systems",
  "intelligence",
  "security",
  "future",
  "manifesto",
  "contact",
] as const;

export type WorldState = (typeof WORLD_STATES)[number];

/** Maps JourneyShell `data-spine-section` / traveler waypoint to WorldState. */
export const WAYPOINT_TO_WORLD: Record<string, WorldState> = {
  core: "core",
  method: "method",
  brands: "brands",
  systems: "systems",
  intelligence: "intelligence",
  security: "security",
  future: "future",
  manifesto: "manifesto",
  contact: "contact",
};

export type WorldCoreTransformPreset = {
  offsetX: number;
  offsetY: number;
  scale: number;
  opacity: number;
  ringSpeed: number;
  emissiveIntensity: number;
  cameraZ: number;
  breathe: number;
};

export interface WorldCoreSceneHandle {
  resize: (width: number, height: number) => void;
  setWorldState: (world: WorldState, immediate?: boolean) => void;
  setPointer: (nx: number, ny: number) => void;
  clearPointer: () => void;
  setActive: (active: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
  dispose: () => void;
}

export interface WorldCoreControllerHandle {
  setActive: (active: boolean) => void;
  resize: () => void;
  dispose: () => void;
}
