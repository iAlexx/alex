import Image from "next/image";
import type { Dictionary } from "@/content/translations";

export type HeroLabPortraitMode = "portrait" | "workstation";

const ASSETS = {
  portrait: {
    desktop: { src: "/images/alex/alex-portrait-desktop.webp", width: 720, height: 900 },
    mobile: { src: "/images/alex/alex-portrait-mobile.webp", width: 480, height: 615 },
  },
  workstation: {
    desktop: { src: "/images/alex/alex-workstation-desktop.webp", width: 960, height: 831 },
    mobile: { src: "/images/alex/alex-workstation-mobile.webp", width: 640, height: 517 },
  },
} as const;

interface HeroLabPortraitProps {
  mode: HeroLabPortraitMode;
  device: "desktop" | "mobile";
  variant: "a" | "b" | "c";
  dictionary: Dictionary;
}

/** Lab-only portrait — real Alex assets, variant-specific integration. */
export function HeroLabPortrait({ mode, device, variant, dictionary }: HeroLabPortraitProps) {
  const asset = ASSETS[mode][device];

  return (
    <div className={`hero-lab-portrait hero-lab-portrait--${variant} hero-lab-portrait--${mode}`}>
      <Image
        src={asset.src}
        alt={dictionary.a11y.heroImageAlt}
        width={asset.width}
        height={asset.height}
        sizes={device === "mobile" ? "100vw" : "50vw"}
        className="hero-lab-portrait__image"
        priority
        draggable={false}
      />
      <div aria-hidden className="hero-lab-portrait__rim" />
    </div>
  );
}
