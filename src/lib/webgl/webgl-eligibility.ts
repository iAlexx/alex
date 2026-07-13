/**
 * Shared WebGL eligibility — Hero Builder Frame + Builder Map 3D.
 * Conservative policy; static/CSS fallbacks remain authoritative on failure.
 */

export const WEBGL_MIN_VIEWPORT_WIDTH = 1024;
const MIN_HARDWARE_CONCURRENCY = 4;

export interface WebGLEligibility {
  eligible: boolean;
  reason: string;
  tier: "A" | "B" | "C";
}

interface NavigatorWithHints extends Navigator {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
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

/** Client-only eligibility with capability tier. */
export function evaluateWebGLEligibility(minWidth = WEBGL_MIN_VIEWPORT_WIDTH): WebGLEligibility {
  if (typeof window === "undefined") {
    return { eligible: false, reason: "server render", tier: "C" };
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return { eligible: false, reason: "prefers-reduced-motion", tier: "C" };
  }

  const nav = navigator as NavigatorWithHints;

  if (nav.connection?.saveData === true) {
    return { eligible: false, reason: "save-data enabled", tier: "C" };
  }

  if (window.innerWidth < 768) {
    return { eligible: false, reason: "mobile viewport", tier: "C" };
  }

  if (window.innerWidth < minWidth) {
    return { eligible: false, reason: `viewport < ${minWidth}px`, tier: "C" };
  }

  if (!isWebGLSupported()) {
    return { eligible: false, reason: "WebGL unavailable", tier: "C" };
  }

  let tier: "A" | "B" = "A";

  if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency > 0) {
    if (nav.hardwareConcurrency < MIN_HARDWARE_CONCURRENCY) {
      tier = "B";
    }
  }

  if (typeof nav.deviceMemory === "number" && nav.deviceMemory > 0 && nav.deviceMemory < 4) {
    tier = "B";
  }

  if (window.innerWidth < 1280) {
    tier = "B";
  }

  return { eligible: true, reason: "desktop + motion + WebGL ok", tier };
}
