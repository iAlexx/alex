import type { Locale } from "@/lib/i18n/config";
import { ThreeHeroPortrait } from "@/components/three-hero-lab/ThreeHeroPortrait";
import type { Dictionary } from "@/content/translations";

interface ThreeHeroFallbackProps {
  locale: Locale;
  dictionary: Dictionary;
}

/** Static CSS/SVG composition — complete without WebGL. */
export function ThreeHeroFallback({ locale, dictionary }: ThreeHeroFallbackProps) {
  const isArabic = locale === "ar";

  return (
    <div
      className={`three-hero-fallback${isArabic ? " three-hero-fallback--ar" : ""}`}
      data-three-hero-fallback
      aria-hidden
    >
      <svg
        className="three-hero-fallback__structure"
        viewBox="0 0 420 380"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="thl-metal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2a3140" />
            <stop offset="55%" stopColor="#151a24" />
            <stop offset="100%" stopColor="#0e1219" />
          </linearGradient>
          <linearGradient id="thl-rim" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#3a4458" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#1a2030" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path
          d="M48 72 L372 58 L388 118 L360 330 L60 338 L32 140 Z"
          fill="url(#thl-metal)"
          stroke="url(#thl-rim)"
          strokeWidth="1.2"
        />
        <path
          d="M72 96 L118 88 L126 168 L78 176 Z"
          fill="#1e2430"
          stroke="#3a4458"
          strokeWidth="0.8"
        />
        <path
          d="M302 82 L348 76 L356 162 L308 170 Z"
          fill="#1c222e"
          stroke="#38445a"
          strokeWidth="0.8"
        />
        <path d="M96 52 L324 44 L332 78 L88 86 Z" fill="#222a38" />
        <path d="M68 286 L352 278 L360 312 L60 320 Z" fill="#141a24" />
        <rect x="88" y="118" width="18" height="6" rx="1" fill="#c8c0b4" opacity="0.55" />
        <rect x="314" y="112" width="18" height="6" rx="1" fill="#7b5fd4" opacity="0.5" />
        <rect x="300" y="268" width="20" height="7" rx="1" fill="#c4882a" opacity="0.5" />
        <rect x="96" y="272" width="20" height="7" rx="1" fill="#3bc4d4" opacity="0.5" />
        <rect
          x="196"
          y="300"
          width="28"
          height="14"
          rx="2"
          fill="#181f2c"
          stroke="#3d4a62"
          strokeWidth="0.8"
        />
      </svg>

      <div className="three-hero-fallback__atmosphere" />
      <div className="three-hero-fallback__haze" />

      <div className="three-hero-fallback__portrait-slot">
        <ThreeHeroPortrait locale={locale} dictionary={dictionary} />
      </div>

      <div className="three-hero-fallback__front-layer" />
      <div className="three-hero-fallback__contact-shadow" />
    </div>
  );
}
