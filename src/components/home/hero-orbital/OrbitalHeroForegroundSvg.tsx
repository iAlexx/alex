import {
  LOVABLE_HERO_FOREGROUND_ELLIPSES,
  LOVABLE_PRIMARY,
} from "@/lib/orbital-hero/portrait-spec";

export function OrbitalHeroForegroundSvg() {
  return (
    <svg
      aria-hidden
      className="lovable-hero-visual__paths-front"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {LOVABLE_HERO_FOREGROUND_ELLIPSES.map((ellipse) => (
        <ellipse
          key={`${ellipse.rx}-${ellipse.ry}-${ellipse.rotate}`}
          cx={ellipse.cx}
          cy={ellipse.cy}
          rx={ellipse.rx}
          ry={ellipse.ry}
          fill="none"
          stroke={ellipse.stroke}
          strokeWidth={ellipse.width}
          strokeDasharray={ellipse.dash}
          opacity={ellipse.opacity}
          transform={`rotate(${ellipse.rotate} ${ellipse.cx} ${ellipse.cy})`}
        />
      ))}
    </svg>
  );
}

export function OrbitalHeroRingsStatic() {
  return (
    <svg
      aria-hidden
      className="lovable-hero-visual__rings-static"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <ellipse
        cx="50"
        cy="48"
        rx="48"
        ry="22"
        fill="none"
        stroke={LOVABLE_PRIMARY}
        strokeWidth="0.12"
        opacity="0.22"
        transform="rotate(-8 50 48)"
      />
      <ellipse
        cx="50"
        cy="52"
        rx="42"
        ry="28"
        fill="none"
        stroke={LOVABLE_PRIMARY}
        strokeWidth="0.1"
        opacity="0.16"
        transform="rotate(18 50 52)"
      />
      <ellipse
        cx="50"
        cy="50"
        rx="36"
        ry="12"
        fill="none"
        stroke={LOVABLE_PRIMARY}
        strokeWidth="0.08"
        opacity="0.12"
        transform="rotate(-22 50 50)"
      />
    </svg>
  );
}
