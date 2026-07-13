/** Homepage persistent World Core WebGL eligibility */

export const WORLD_CORE_MIN_WIDTH = 768;
export const WORLD_CORE_MAX_DPR = 1.5;
export const WORLD_CORE_MOBILE_MAX_DPR = 1;
export const WORLD_CORE_TARGET_FPS = 30;

export type WorldCoreEligibility = {
  webgl: boolean;
  desktop: boolean;
  tablet: boolean;
  mobile: boolean;
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

export function assessWorldCoreEligibility(
  width = typeof window !== "undefined" ? window.innerWidth : 0,
): WorldCoreEligibility {
  if (typeof window === "undefined") {
    return {
      webgl: false,
      desktop: false,
      tablet: false,
      mobile: false,
      reducedMotion: false,
      saveData: false,
      eligible: false,
    };
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  const saveData = !!connection?.saveData;
  const mobile = width < 768;
  const tablet = width >= 768 && width < 1024;
  const desktop = width >= 1024;
  const webgl = probeWebGL();
  const eligible = webgl && !reducedMotion && !saveData && width >= 768;

  return { webgl, desktop, tablet, mobile, reducedMotion, saveData, eligible };
}
