"use client";

import { useCallback, useRef } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/content/translations";
import { HeroLabCopy } from "@/components/hero-lab/HeroLabCopy";
import { HeroLabPortrait } from "@/components/hero-lab/HeroLabPortrait";
import { useLabWebGLScene, type LabSceneDebugInfo } from "@/lib/hero-lab/use-lab-webgl-scene";
import { useHeroLabVariantMotion } from "@/components/hero-lab/use-hero-lab-variant-motion";

interface HeroLabVariantBProps {
  locale: Locale;
  dictionary: Dictionary;
  device: "desktop" | "mobile";
  replayKey: number;
  motionPaused: boolean;
  reducedPreview: boolean;
  onDebugUpdate?: (info: LabSceneDebugInfo) => void;
}

export function HeroLabVariantB({
  locale,
  dictionary,
  device,
  replayKey,
  motionPaused,
  reducedPreview,
  onDebugUpdate,
}: HeroLabVariantBProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const loadScene = useCallback(
    async (canvas: HTMLCanvasElement, opts: { simplified?: boolean }) => {
      const mod = await import("@/lib/hero-lab/variant-b-glass-scene");
      return mod.createVariantBGlassScene(canvas, opts);
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

  useHeroLabVariantMotion({ variant: "b", replayKey, motionPaused, reducedPreview, rootRef });

  return (
    <div
      ref={rootRef}
      className={`hero-lab-variant hero-lab-variant--b hero-lab-variant--${device}`}
    >
      <div className="hero-lab-variant__grid hero-lab-variant__grid--b">
        <HeroLabCopy
          locale={locale}
          dictionary={dictionary}
          variant="b"
          device={device}
          reducedPreview={reducedPreview}
        />
        <div className="hero-lab-variant__visual hero-lab-variant__visual--b">
          <div ref={hostRef} className="hero-lab-canvas-host hero-lab-canvas-host--b" aria-hidden>
            {!reducedPreview ? (
              <canvas ref={canvasRef} className="hero-lab-canvas" tabIndex={-1} />
            ) : null}
            <div className="hero-lab-glass-fallback" aria-hidden>
              <span className="hero-lab-glass-fallback__slab hero-lab-glass-fallback__slab--back" />
              <span className="hero-lab-glass-fallback__slab hero-lab-glass-fallback__slab--mid" />
              <span className="hero-lab-glass-fallback__slab hero-lab-glass-fallback__slab--front" />
            </div>
          </div>
          <HeroLabPortrait mode="workstation" device={device} variant="b" dictionary={dictionary} />
        </div>
      </div>
    </div>
  );
}
