/** GSAP matchMedia queries — desktop / tablet / mobile / reduced motion. */
export const MOTION_MEDIA = {
  reduced: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 1024px)",
  tablet: "(min-width: 640px) and (max-width: 1023px)",
  mobile: "(max-width: 639px)",
} as const;

export const MOTION_DISTANCE = {
  desktopY: 28,
  tabletY: 24,
  mobileY: 16,
  previewX: 48,
  previewScaleFrom: 0.94,
} as const;

export const MOTION_DURATION = {
  reveal: 0.75,
  revealMobile: 0.55,
  reduced: 0.35,
  stagger: 0.09,
  staggerMobile: 0.06,
} as const;

export const MOTION_EASE = {
  reveal: "power2.out",
  soft: "power1.out",
} as const;

/** Short desktop pin distance — avoids trapping scroll. */
export const GYMURA_HOME_PIN_SCROLL = 420;
export const RESTAURANT_HOME_PIN_SCROLL = 400;
