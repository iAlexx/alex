/** Orbital portrait / orbit constants — approved Lovable lab source */

export const LOVABLE_BG = "#05070B";
export const LOVABLE_PRIMARY = "#2F80FF";
export const LOVABLE_VIOLET = "#835BFF";
export const LOVABLE_CORE_TINT = "rgba(47,128,255,0.14)";

export const CINEMATIC_PORTRAIT = {
  src: "/images/alex/alex-portrait-cinematic.png",
  width: 764,
  height: 1024,
  aspectRatio: 764 / 1024,
} as const;

export const LOVABLE_TORUS_RINGS = [
  { r: 1.35, tube: 0.012, tilt: [0, 0, 0] as const },
  { r: 1.6, tube: 0.008, tilt: [Math.PI / 3, 0, Math.PI / 6] as const },
  { r: 1.85, tube: 0.006, tilt: [Math.PI / 2, Math.PI / 4, 0] as const },
  { r: 2.15, tube: 0.005, tilt: [-Math.PI / 4, Math.PI / 3, Math.PI / 8] as const },
] as const;

export const LOVABLE_RING_CAMERA = {
  position: [0, 0, 5.5] as const,
  fov: 42,
};

export const LOVABLE_PORTRAIT_FOREGROUND_PATHS = [
  { d: "M -5 118 C 25 110, 55 128, 108 100", strokeWidth: 0.25, dash: "0.8 0.6", opacity: 1 },
  { d: "M -5 22 C 20 30, 60 12, 108 26", strokeWidth: 0.2, dash: "0.6 0.8", opacity: 0.7 },
] as const;

export const LOVABLE_HERO_FOREGROUND_ELLIPSES = [
  {
    cx: 50,
    cy: 52,
    rx: 44,
    ry: 14,
    rotate: -14,
    stroke: LOVABLE_PRIMARY,
    width: 0.15,
    dash: "0.8 0.6",
    opacity: 1,
  },
  {
    cx: 50,
    cy: 52,
    rx: 38,
    ry: 20,
    rotate: 22,
    stroke: LOVABLE_VIOLET,
    width: 0.12,
    dash: "0.4 0.8",
    opacity: 0.7,
  },
] as const;

/** Static rear rings when WebGL is unavailable */
export const LOVABLE_HERO_REAR_ELLIPSES = [
  { cx: 50, cy: 48, rx: 48, ry: 22, rotate: -8, opacity: 0.22 },
  { cx: 50, cy: 52, rx: 42, ry: 28, rotate: 18, opacity: 0.16 },
  { cx: 50, cy: 50, rx: 36, ry: 12, rotate: -22, opacity: 0.12 },
] as const;
