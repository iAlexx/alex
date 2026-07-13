import { ORBIT_COLORS } from "@/lib/three-hero/orbit-visual-tokens";

interface OrbitalPathsSvgProps {
  variant: "desktop" | "mobile";
  layer: "rear" | "front" | "grid";
}

/** SVG orbital paths — rear behind portrait, front crosses at low opacity. */
export function OrbitalPathsSvg({ variant, layer }: OrbitalPathsSvgProps) {
  const isMobile = variant === "mobile";

  if (layer === "grid") {
    return (
      <svg
        className="orbit-paths orbit-paths--grid"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        <line x1="50" y1="0" x2="50" y2="100" stroke={ORBIT_COLORS.crosshair} strokeWidth="0.12" />
        <line
          x1="0"
          y1={isMobile ? "46" : "48"}
          x2="100"
          y2={isMobile ? "46" : "48"}
          stroke={ORBIT_COLORS.crosshair}
          strokeWidth="0.12"
        />
      </svg>
    );
  }

  if (layer === "rear") {
    if (isMobile) {
      return (
        <svg
          className="orbit-paths orbit-paths--rear"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
          data-orbit-layer="rear"
        >
          <path
            d="M 8 28 C 8 8, 42 2, 58 18 C 74 34, 78 58, 62 78 C 46 98, 18 92, 10 68"
            fill="none"
            stroke={ORBIT_COLORS.linePrimary}
            strokeWidth="0.55"
            strokeLinecap="round"
          />
          <path
            d="M 92 24 C 72 6, 48 8, 36 26 C 24 44, 28 72, 48 86"
            fill="none"
            stroke={ORBIT_COLORS.linePrimary}
            strokeWidth="0.42"
            strokeLinecap="round"
            opacity="0.82"
          />
          <ellipse
            cx="50"
            cy="50"
            rx="38"
            ry="34"
            fill="none"
            stroke={ORBIT_COLORS.lineSoft}
            strokeWidth="0.28"
            strokeDasharray="1.8 2.4"
          />
        </svg>
      );
    }

    return (
      <svg
        className="orbit-paths orbit-paths--rear"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
        data-orbit-layer="rear"
      >
        <path
          d="M 2 42 C -2 10, 38 0, 62 18 C 86 36, 92 62, 78 84"
          fill="none"
          stroke={ORBIT_COLORS.linePrimary}
          strokeWidth="0.78"
          strokeLinecap="round"
        />
        <path
          d="M 98 28 C 82 4, 50 6, 34 26 C 18 46, 22 72, 44 88 C 66 104, 90 92, 98 66"
          fill="none"
          stroke={ORBIT_COLORS.linePrimary}
          strokeWidth="0.68"
          strokeLinecap="round"
          opacity="0.92"
        />
        <path
          d="M 12 82 C 30 96, 58 98, 82 82"
          fill="none"
          stroke={ORBIT_COLORS.lineSoft}
          strokeWidth="0.42"
          strokeLinecap="round"
        />
        <ellipse
          cx="50"
          cy="50"
          rx="44"
          ry="40"
          fill="none"
          stroke={ORBIT_COLORS.lineFaint}
          strokeWidth="0.24"
        />
        <line x1="6" y1="48" x2="94" y2="48" stroke={ORBIT_COLORS.lineFaint} strokeWidth="0.14" />
      </svg>
    );
  }

  if (isMobile) {
    return (
      <svg
        className="orbit-paths orbit-paths--front"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
        data-orbit-layer="front"
      >
        <ellipse
          cx="50"
          cy="48"
          rx="34"
          ry="22"
          fill="none"
          stroke={ORBIT_COLORS.linePrimary}
          strokeWidth="0.32"
          strokeDasharray="1.2 1.8"
          opacity="0.38"
        />
        <path
          d="M 14 52 C 30 40, 70 40, 86 52"
          fill="none"
          stroke={ORBIT_COLORS.linePrimary}
          strokeWidth="0.28"
          opacity="0.32"
        />
        <path
          d="M 22 62 C 38 72, 62 72, 78 62"
          fill="none"
          stroke={ORBIT_COLORS.lineSoft}
          strokeWidth="0.24"
          strokeDasharray="0.8 1.4"
          opacity="0.42"
        />
      </svg>
    );
  }

  return (
    <svg
      className="orbit-paths orbit-paths--front"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
      data-orbit-layer="front"
    >
      <ellipse
        cx="50"
        cy="48"
        rx="38"
        ry="22"
        fill="none"
        stroke={ORBIT_COLORS.linePrimary}
        strokeWidth="0.38"
        strokeDasharray="1.6 2.2"
        opacity="0.42"
      />
      <path
        d="M 6 50 C 24 36, 76 36, 94 50"
        fill="none"
        stroke={ORBIT_COLORS.linePrimary}
        strokeWidth="0.34"
        opacity="0.34"
      />
      <path
        d="M 22 60 C 38 72, 62 72, 78 60"
        fill="none"
        stroke={ORBIT_COLORS.lineSoft}
        strokeWidth="0.3"
        strokeDasharray="1 1.6"
        opacity="0.46"
      />
      <path
        d="M 84 18 C 92 36, 90 58, 78 72"
        fill="none"
        stroke={ORBIT_COLORS.linePrimary}
        strokeWidth="0.28"
        opacity="0.32"
      />
      <path
        d="M 14 24 C 8 40, 10 58, 20 70"
        fill="none"
        stroke={ORBIT_COLORS.lineSoft}
        strokeWidth="0.24"
        strokeDasharray="0.8 1.4"
        opacity="0.28"
      />
    </svg>
  );
}

/** Thin L-shaped framing corners. */
export function OrbitalCornersSvg({ variant }: { variant: "desktop" | "mobile" }) {
  const size = variant === "mobile" ? 5.5 : 6;
  const inset = variant === "mobile" ? 20 : 22;
  const br = 100 - inset;

  return (
    <svg
      className="orbit-corners"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <path
        d={`M ${inset} ${inset + size} V ${inset} H ${inset + size}`}
        fill="none"
        stroke={ORBIT_COLORS.corner}
        strokeWidth="0.22"
        strokeLinecap="round"
      />
      <path
        d={`M ${br - size} ${br} H ${br} V ${br - size}`}
        fill="none"
        stroke={ORBIT_COLORS.corner}
        strokeWidth="0.22"
        strokeLinecap="round"
      />
    </svg>
  );
}
