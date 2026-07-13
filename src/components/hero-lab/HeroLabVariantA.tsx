"use client";

import { useCallback, useRef } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/content/translations";
import { HeroLabCopy } from "@/components/hero-lab/HeroLabCopy";
import { HeroLabPortrait } from "@/components/hero-lab/HeroLabPortrait";
import { useLabWebGLScene, type LabSceneDebugInfo } from "@/lib/hero-lab/use-lab-webgl-scene";
import { useHeroLabVariantMotion } from "@/components/hero-lab/use-hero-lab-variant-motion";

interface HeroLabVariantAProps {
  locale: Locale;
  dictionary: Dictionary;
  device: "desktop" | "mobile";
  replayKey: number;
  motionPaused: boolean;
  reducedPreview: boolean;
  onDebugUpdate?: (info: LabSceneDebugInfo) => void;
}

export function HeroLabVariantA({
  locale,
  dictionary,
  device,
  replayKey,
  motionPaused,
  reducedPreview,
  onDebugUpdate,
}: HeroLabVariantAProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const loadScene = useCallback(
    async (canvas: HTMLCanvasElement, opts: { simplified?: boolean }) => {
      const mod = await import("@/lib/hero-lab/variant-a-architectural-scene");
      return mod.createVariantAArchitecturalScene(canvas, opts);
    },
    [],
  );

  useLabWebGLScene(hostRef, canvasRef, {
    simplified: device === "mobile",
    motionPaused,
    reducedPreview,
    replayKey,
    loadScene,
    onDebugUpdate,
  });

  useHeroLabVariantMotion({ variant: "a", replayKey, motionPaused, reducedPreview, rootRef });

  return (
    <div
      ref={rootRef}
      className={`hero-lab-variant hero-lab-variant--a hero-lab-variant--${device}`}
    >
      <div className="hero-lab-variant__grid">
        <HeroLabCopy
          locale={locale}
          dictionary={dictionary}
          variant="a"
          device={device}
          reducedPreview={reducedPreview}
        />
        <div className="hero-lab-variant__visual">
          <div ref={hostRef} className="hero-lab-canvas-host hero-lab-canvas-host--a" aria-hidden>
            {!reducedPreview ? (
              <canvas ref={canvasRef} className="hero-lab-canvas" tabIndex={-1} />
            ) : null}
            <div className="hero-lab-frame-fallback hero-lab-frame-fallback--a">
              <span className="hero-lab-frame-fallback__mod hero-lab-frame-fallback__mod--brands" />
              <span className="hero-lab-frame-fallback__mod hero-lab-frame-fallback__mod--systems" />
              <span className="hero-lab-frame-fallback__mod hero-lab-frame-fallback__mod--intelligence" />
              <span className="hero-lab-frame-fallback__mod hero-lab-frame-fallback__mod--security" />
            </div>
          </div>
          <HeroLabPortrait mode="portrait" device={device} variant="a" dictionary={dictionary} />
        </div>
      </div>
    </div>
  );
}
