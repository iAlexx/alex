import type { WorldState } from "@/lib/world-core/types";

type WorldRgb = {
  accent: string;
  soft: string;
  line: string;
  glow: string;
  surface: string;
};

/** Cybersecurity world — permanent Purple Team identity */
export const SECURITY_PURPLE_RGB: WorldRgb = {
  accent: "139, 92, 246",
  soft: "168, 85, 247",
  line: "139, 92, 246",
  glow: "192, 132, 252",
  surface: "91, 33, 182",
};

export const SECURITY_PURPLE_HEX = "#8B5CF6";
export const SECURITY_PURPLE_SECONDARY_HEX = "#A855F7";
export const SECURITY_PURPLE_GLOW_HEX = "#C084FC";
export const SECURITY_PURPLE_DEEP_HEX = "#5B21B6";

/** @deprecated Use SECURITY_PURPLE_* — kept for historical report imports only */
export const SECURITY_CRIMSON_RGB = SECURITY_PURPLE_RGB;
export const SECURITY_CRIMSON_HEX = SECURITY_PURPLE_HEX;
export const SECURITY_CRIMSON_GLOW_HEX = SECURITY_PURPLE_GLOW_HEX;
export const SECURITY_CRIMSON_DEEP_HEX = SECURITY_PURPLE_DEEP_HEX;

/** World accent hex values — aligned with Lovable + production tokens */
export const WORLD_HEX: Record<WorldState, string> = {
  core: "#4f8dff",
  method: "#4f8dff",
  brands: "#c8d0dc",
  systems: "#d4a054",
  intelligence: "#9b7ed9",
  security: SECURITY_PURPLE_HEX,
  future: "#3a6fcc",
  manifesto: "#4f8dff",
  contact: "#3d5a99",
};

/** RGB triplets for CSS custom properties */
export const WORLD_RGB: Record<WorldState, WorldRgb> = {
  core: {
    accent: "79, 141, 255",
    soft: "79, 141, 255",
    line: "79, 141, 255",
    glow: "79, 141, 255",
    surface: "79, 141, 255",
  },
  method: {
    accent: "79, 141, 255",
    soft: "79, 141, 255",
    line: "79, 141, 255",
    glow: "79, 141, 255",
    surface: "60, 100, 200",
  },
  brands: {
    accent: "200, 208, 220",
    soft: "200, 208, 220",
    line: "200, 208, 220",
    glow: "200, 208, 220",
    surface: "160, 168, 180",
  },
  systems: {
    accent: "212, 160, 84",
    soft: "212, 160, 84",
    line: "212, 160, 84",
    glow: "231, 161, 59",
    surface: "180, 130, 60",
  },
  intelligence: {
    accent: "155, 126, 217",
    soft: "131, 91, 255",
    line: "155, 126, 217",
    glow: "131, 91, 255",
    surface: "100, 80, 180",
  },
  security: SECURITY_PURPLE_RGB,
  future: {
    accent: "58, 111, 204",
    soft: "47, 90, 180",
    line: "58, 111, 204",
    glow: "47, 128, 255",
    surface: "30, 50, 100",
  },
  manifesto: {
    accent: "79, 141, 255",
    soft: "155, 126, 217",
    line: "200, 208, 220",
    glow: "78, 201, 224",
    surface: "79, 141, 255",
  },
  contact: {
    accent: "61, 90, 153",
    soft: "47, 80, 140",
    line: "61, 90, 153",
    glow: "47, 100, 180",
    surface: "40, 60, 100",
  },
};

/** Secondary ring glow hex — soft falloff per world (ring neon only) */
export const WORLD_RING_GLOW_HEX: Record<WorldState, string> = {
  core: "#6fa0ff",
  method: "#6fa0ff",
  brands: "#b8c0cc",
  systems: "#e7a13b",
  intelligence: "#835bff",
  security: SECURITY_PURPLE_GLOW_HEX,
  future: "#2f5ab4",
  manifesto: "#6fa0ff",
  contact: "#2f508c",
};

/** Atmospheric tint for canvas host overlay */
export const WORLD_TINT: Record<WorldState, string> = {
  core: "rgba(79, 141, 255, 0.14)",
  method: "rgba(79, 141, 255, 0.10)",
  brands: "rgba(200, 208, 220, 0.10)",
  systems: "rgba(212, 160, 84, 0.14)",
  intelligence: "rgba(155, 126, 217, 0.16)",
  security: "rgba(139, 92, 246, 0.08)",
  future: "rgba(58, 111, 204, 0.10)",
  manifesto: "rgba(79, 141, 255, 0.12)",
  contact: "rgba(61, 90, 153, 0.08)",
};

/** Security ring/point boost only — nucleus untouched */
export const SECURITY_EMISSIVE_BOOST = {
  ring: 1.1,
  point: 1.06,
} as const;

/** Ring-only neon edge — crisp torus + soft outer shell */
export const WORLD_CORE_RING_NEON = {
  ringEmissiveMul: 1.68,
  glowShellOpacity: 0.15,
  glowShellScale: 1.025,
  glowShellEmissive: 0.38,
  mobileIntensityMul: 0.68,
} as const;

const TRANSITION_MS = 800;

export function resolveWorldRgb(world: WorldState): WorldRgb {
  return WORLD_RGB[world];
}

export function resolveWorldHex(world: WorldState): string {
  return WORLD_HEX[world];
}

export function resolveRingGlowHex(world: WorldState): string {
  return WORLD_RING_GLOW_HEX[world];
}

function isReducedMotionPreferred(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function applyWorldCssVariables(world: WorldState, immediate = false): void {
  if (typeof document === "undefined") return;

  const reducedMotion = isReducedMotionPreferred();
  const snap = immediate || reducedMotion;
  const rgb = resolveWorldRgb(world);
  const root = document.documentElement;

  root.dataset.worldState = world;
  delete root.dataset.securityPhase;

  root.style.setProperty("--world-accent-rgb", rgb.accent);
  root.style.setProperty("--world-accent-soft-rgb", rgb.soft);
  root.style.setProperty("--world-line-rgb", rgb.line);
  root.style.setProperty("--world-glow-rgb", rgb.glow);
  root.style.setProperty("--world-surface-rgb", rgb.surface);
  root.style.setProperty("--world-tint-opacity", "1");

  root.style.setProperty("--world-atmosphere-strength", world === "security" ? "0.07" : "1");

  if (snap) {
    root.style.setProperty("--world-transition-duration", "0ms");
    requestAnimationFrame(() => {
      root.style.setProperty(
        "--world-transition-duration",
        reducedMotion ? "0ms" : `${TRANSITION_MS}ms`,
      );
    });
  }
}
