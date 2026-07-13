/**
 * Builder Map 3D eligibility — Phase 7.4 conservative activation policy.
 * Static map remains authoritative whenever any check fails.
 */

export const MAP3D_MIN_VIEWPORT_WIDTH = 1024;
const MIN_HARDWARE_CONCURRENCY = 4;

export interface Map3DEligibility {
  eligible: boolean;
  reason: string;
}

interface NavigatorWithHints extends Navigator {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
}

/** Client-only. Evaluates the full desktop 3D activation policy. */
export function evaluateBuilderMap3DEligibility(): Map3DEligibility {
  if (typeof window === "undefined") {
    return { eligible: false, reason: "server render" };
  }

  if (window.innerWidth < MAP3D_MIN_VIEWPORT_WIDTH) {
    return { eligible: false, reason: `viewport < ${MAP3D_MIN_VIEWPORT_WIDTH}px` };
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return { eligible: false, reason: "prefers-reduced-motion" };
  }

  const nav = navigator as NavigatorWithHints;

  if (nav.connection?.saveData === true) {
    return { eligible: false, reason: "save-data enabled" };
  }

  if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency > 0) {
    if (nav.hardwareConcurrency < MIN_HARDWARE_CONCURRENCY) {
      return { eligible: false, reason: "low hardware concurrency" };
    }
  }

  if (typeof nav.deviceMemory === "number" && nav.deviceMemory > 0 && nav.deviceMemory < 4) {
    return { eligible: false, reason: "low device memory" };
  }

  if (!isWebGLSupported()) {
    return { eligible: false, reason: "WebGL unavailable" };
  }

  return { eligible: true, reason: "desktop + motion + WebGL ok" };
}

function isWebGLSupported(): boolean {
  try {
    const probe = document.createElement("canvas");
    const gl = probe.getContext("webgl") ?? probe.getContext("experimental-webgl");
    return gl !== null;
  } catch {
    return false;
  }
}
