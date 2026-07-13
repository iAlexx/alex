/** Homepage-scoped orbital rings WebGL eligibility */

export const ORBIT_HERO_MIN_WIDTH = 1024;
export const ORBIT_HERO_MAX_DPR = 1.5;
export const ORBIT_HERO_TARGET_FPS = 30;

export type OrbitHeroEligibility = {
  webgl: boolean;
  desktop: boolean;
  reducedMotion: boolean;
  saveData: boolean;
  eligible: boolean;
};

export function probeWebGL(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function assessOrbitHeroEligibility(
  width = typeof window !== "undefined" ? window.innerWidth : 0,
): OrbitHeroEligibility {
  if (typeof window === "undefined") {
    return { webgl: false, desktop: false, reducedMotion: false, saveData: false, eligible: false };
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  const saveData = !!connection?.saveData;
  const desktop = width >= ORBIT_HERO_MIN_WIDTH;
  const webgl = probeWebGL();
  const eligible = desktop && webgl && !reducedMotion && !saveData;

  return { webgl, desktop, reducedMotion, saveData, eligible };
}
