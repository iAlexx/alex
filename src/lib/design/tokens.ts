/**
 * Semantic design tokens for Homepage V2 (Phase 7.3B).
 * CSS custom properties are defined in globals.css; this file provides typed keys for TS usage.
 */
export const WORLD_ACCENTS = ["brands", "systems", "intelligence", "security"] as const;

export type WorldAccent = (typeof WORLD_ACCENTS)[number];

/** Maps world accent to CSS custom property name. */
export const worldAccentVar: Record<WorldAccent, string> = {
  brands: "var(--accent-brand)",
  systems: "var(--accent-system)",
  intelligence: "var(--accent-intel)",
  security: "var(--accent-secure)",
};

/** Tailwind-compatible world band class names (leading-edge bleed). */
export const worldBandClass: Record<WorldAccent, string> = {
  brands: "world-band-brands",
  systems: "world-band-systems",
  intelligence: "world-band-intelligence",
  security: "world-band-security",
};

/** Eyebrow text color per world. */
export const worldEyebrowClass: Record<WorldAccent, string> = {
  brands: "text-[var(--accent-brand)]",
  systems: "text-[var(--accent-system)]",
  intelligence: "text-[var(--accent-intel)]",
  security: "text-[var(--accent-secure)]",
};

export const DESIGN_TOKENS = {
  core: "var(--color-electric)",
  live: "var(--accent-live)",
  canvas: "var(--color-obsidian)",
} as const;
