"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/content/translations";
import { assessOrbitHeroEligibility } from "@/lib/orbital-hero/eligibility";
import {
  OrbitalHeroForegroundSvg,
  OrbitalHeroRingsStatic,
} from "@/components/home/hero-orbital/OrbitalHeroForegroundSvg";
import { OrbitalHeroPortrait } from "@/components/home/hero-orbital/OrbitalHeroPortrait";
import { useOrbitRingsScene } from "@/components/home/hero-orbital/use-orbit-rings-scene";

interface OrbitalHeroVisualProps {
  locale: Locale;
  dictionary: Dictionary;
  motionEnabled?: boolean;
  /** Lab-only: local WebGL rings. Homepage uses persistent WorldCoreLayer instead. */
  localWebGLRings?: boolean;
}

/** Approved orbital portrait visual — rings + portrait + foreground paths. */
export function OrbitalHeroVisual({
  locale,
  dictionary,
  motionEnabled = true,
  localWebGLRings = false,
}: OrbitalHeroVisualProps) {
  const ringsHostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webglEligible, setWebglEligible] = useState(false);

  useEffect(() => {
    const update = () => setWebglEligible(assessOrbitHeroEligibility().eligible);
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  const ringsOn = localWebGLRings && motionEnabled && webglEligible;
  useOrbitRingsScene(ringsHostRef, canvasRef, { enabled: ringsOn });

  const [parallaxOn, setParallaxOn] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setParallaxOn(mq.matches && motionEnabled);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [motionEnabled]);

  return (
    <div className="lovable-hero-visual-stack" data-lovable-visual-stack>
      <div ref={ringsHostRef} className="lovable-hero-visual__rings-fixed" aria-hidden>
        {!ringsOn ? <OrbitalHeroRingsStatic /> : null}
        {ringsOn ? (
          <canvas
            ref={canvasRef}
            className="lovable-hero-visual__canvas"
            tabIndex={-1}
            aria-hidden
          />
        ) : null}
        <div className="lovable-hero-visual__tint-fixed" aria-hidden />
      </div>

      <div className="lovable-hero-visual" data-lovable-hero-visual>
        <div className="lovable-hero-visual__center">
          <div className="lovable-hero-visual__portrait-wrap">
            <OrbitalHeroPortrait locale={locale} dictionary={dictionary} parallax={parallaxOn} />
          </div>
        </div>

        <OrbitalHeroForegroundSvg />
      </div>
    </div>
  );
}
