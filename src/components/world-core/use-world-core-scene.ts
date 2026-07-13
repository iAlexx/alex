"use client";

import { useEffect, useRef } from "react";
import type { WorldCoreSceneHandle } from "@/lib/world-core/types";

interface UseWorldCoreSceneOptions {
  enabled?: boolean;
  mobile?: boolean;
  reducedMotion?: boolean;
}

/** Dynamic Three.js import + lifecycle for persistent World Core. */
export function useWorldCoreScene(
  hostRef: React.RefObject<HTMLDivElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  options: UseWorldCoreSceneOptions = {},
): React.MutableRefObject<WorldCoreSceneHandle | null> {
  const { enabled = true, mobile = false, reducedMotion = false } = options;
  const sceneRef = useRef<WorldCoreSceneHandle | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas || !enabled) return;

    let cancelled = false;

    void (async () => {
      const mod = await import("@/lib/world-core/world-core-scene");
      if (cancelled) return;
      const scene = await mod.createWorldCoreScene(canvas, { mobile });
      if (cancelled || !scene) return;

      sceneRef.current = scene;
      scene.setReducedMotion(reducedMotion);
      scene.resize(host.clientWidth, host.clientHeight);
    })();

    return () => {
      cancelled = true;
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, [hostRef, canvasRef, enabled, mobile, reducedMotion]);

  useEffect(() => {
    sceneRef.current?.setReducedMotion(reducedMotion);
  }, [reducedMotion]);

  return sceneRef;
}
