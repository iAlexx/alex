import type { WorldState } from "@/lib/world-core/types";

/** Homepage sections in journey order — stable activation targets. */
export const HOMEPAGE_WORLD_SECTIONS: ReadonlyArray<{ id: string; world: WorldState }> = [
  { id: "hero", world: "core" },
  { id: "method", world: "method" },
  { id: "world-brands", world: "brands" },
  { id: "world-systems", world: "systems" },
  { id: "world-intelligence", world: "intelligence" },
  { id: "world-security", world: "security" },
  { id: "future", world: "future" },
  { id: "manifesto", world: "manifesto" },
  { id: "contact", world: "contact" },
];

/** Viewport band matching ScrollTrigger-style chapter activation. */
export const WORLD_ACTIVATION_BAND = {
  topRatio: 0.55,
  bottomRatio: 0.45,
  centerRatio: 0.5,
  anchorRatio: 0.38,
} as const;

export type WorldActivationResult = {
  world: WorldState;
  sectionId: string;
  progress: number;
};

export function pickActiveWorldSection(): WorldActivationResult {
  const vh = window.innerHeight;
  const centerY = vh * WORLD_ACTIVATION_BAND.centerRatio;
  const topLine = vh * WORLD_ACTIVATION_BAND.topRatio;
  const bottomLine = vh * WORLD_ACTIVATION_BAND.bottomRatio;

  let bestInBand: {
    world: WorldState;
    sectionId: string;
    distance: number;
    progress: number;
  } | null = null;

  let nearest: { world: WorldState; sectionId: string; distance: number } | null = null;

  for (const entry of HOMEPAGE_WORLD_SECTIONS) {
    const el = document.getElementById(entry.id);
    if (!el) continue;

    const rect = el.getBoundingClientRect();
    const anchorY = rect.top + rect.height * WORLD_ACTIVATION_BAND.anchorRatio;
    const distance = Math.abs(anchorY - centerY);

    if (!nearest || distance < nearest.distance) {
      nearest = { world: entry.world, sectionId: entry.id, distance };
    }

    const inBand = rect.top <= topLine && rect.bottom >= bottomLine;
    if (!inBand) continue;

    const span = Math.max(rect.height, 1);
    const progress = Math.min(1, Math.max(0, (topLine - rect.top) / span));

    if (!bestInBand || distance < bestInBand.distance) {
      bestInBand = {
        world: entry.world,
        sectionId: entry.id,
        distance,
        progress,
      };
    }
  }

  if (bestInBand) {
    return {
      world: bestInBand.world,
      sectionId: bestInBand.sectionId,
      progress: bestInBand.progress,
    };
  }

  if (nearest) {
    return { world: nearest.world, sectionId: nearest.sectionId, progress: 0 };
  }

  return { world: "core", sectionId: "hero", progress: 0 };
}

/** Exactly one section may own `data-world-active`. */
export function syncSectionWorldActive(activeSectionId: string): number {
  let activeCount = 0;

  for (const { id } of HOMEPAGE_WORLD_SECTIONS) {
    const el = document.getElementById(id);
    if (!el) continue;

    if (id === activeSectionId) {
      el.dataset.worldActive = "1";
      activeCount += 1;
    } else {
      delete el.dataset.worldActive;
    }
  }

  return activeCount;
}

export function isWorldDebugEnabled(): boolean {
  if (process.env.NODE_ENV !== "development") return false;
  return new URLSearchParams(window.location.search).get("worldDebug") === "1";
}
