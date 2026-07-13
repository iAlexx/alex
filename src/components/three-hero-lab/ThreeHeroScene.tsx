"use client";

import { useCallback, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { BuilderDebugMode } from "@/lib/three-hero/builder-system-materials";
import { useThreeHeroScene } from "@/lib/three-hero/use-three-hero-scene";
import { ThreeHeroFallback } from "@/components/three-hero-lab/ThreeHeroFallback";
import type { Dictionary } from "@/content/translations";

interface ThreeHeroSceneProps {
  locale: Locale;
  dictionary: Dictionary;
  debug?: BuilderDebugMode;
  forceFallback?: boolean;
}

/** Route-scoped WebGL canvas — dynamically loads Three.js. */
export function ThreeHeroScene({
  locale,
  dictionary,
  debug = null,
  forceFallback = false,
}: ThreeHeroSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webglReady, setWebglReady] = useState(false);

  const onReady = useCallback((ready: boolean) => {
    setWebglReady(ready);
  }, []);

  useThreeHeroScene(hostRef, canvasRef, {
    locale,
    debug,
    forceFallback,
    onReady,
  });

  const showCanvas = !forceFallback && debug !== "fallback";
  const grayscale = debug === "grayscale";

  return (
    <div
      className={`three-hero-scene${webglReady ? " three-hero-scene--active" : ""}${grayscale ? " three-hero-scene--grayscale" : ""}`}
      data-three-hero-scene
    >
      <ThreeHeroFallback locale={locale} dictionary={dictionary} />

      {showCanvas ? (
        <div ref={hostRef} className="three-hero-scene__canvas-host" aria-hidden>
          <canvas ref={canvasRef} className="three-hero-scene__canvas" tabIndex={-1} />
        </div>
      ) : null}
    </div>
  );
}
