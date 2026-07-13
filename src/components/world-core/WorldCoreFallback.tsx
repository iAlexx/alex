"use client";

/** Static World Core fallback — approved dark nucleus + ring stroke glow only. */
export function WorldCoreFallback() {
  return (
    <svg
      className="world-core-fallback"
      viewBox="0 0 200 200"
      aria-hidden
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <filter id="wcf-ring-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="wcf-core" cx="50%" cy="48%" r="42%">
          <stop offset="0%" stopColor="rgb(var(--world-accent-rgb))" stopOpacity="0.55" />
          <stop offset="70%" stopColor="rgb(var(--world-accent-rgb))" stopOpacity="0.12" />
          <stop offset="100%" stopColor="rgb(var(--world-accent-rgb))" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse
        cx="100"
        cy="100"
        rx="78"
        ry="28"
        fill="none"
        stroke="rgb(var(--world-glow-rgb))"
        strokeOpacity="0.34"
        strokeWidth="0.8"
        filter="url(#wcf-ring-glow)"
        transform="rotate(-12 100 100)"
      />
      <ellipse
        cx="100"
        cy="102"
        rx="68"
        ry="36"
        fill="none"
        stroke="rgb(var(--world-glow-rgb))"
        strokeOpacity="0.26"
        strokeWidth="0.6"
        filter="url(#wcf-ring-glow)"
        transform="rotate(18 100 102)"
      />
      <ellipse
        cx="100"
        cy="98"
        rx="58"
        ry="14"
        fill="none"
        stroke="rgb(var(--world-line-rgb))"
        strokeOpacity="0.2"
        strokeWidth="0.5"
        filter="url(#wcf-ring-glow)"
        transform="rotate(-24 100 98)"
      />
      <circle cx="100" cy="100" r="22" fill="url(#wcf-core)" />
      <circle cx="100" cy="100" r="14" fill="rgb(var(--world-accent-rgb))" fillOpacity="0.35" />
    </svg>
  );
}
