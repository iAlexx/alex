"use client";

import { useEffect, useRef, useState } from "react";
import type { WorldCoreSceneHandle } from "@/lib/world-core/types";
import { scheduleDeferredMount } from "@/lib/deferred-mount";

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
  const [canInit, setCanInit] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;
    let observer: IntersectionObserver | null = null;

    const start = () => {
      if (!cancelled) setCanInit(true);
    };

    const cancelIdle = scheduleDeferredMount(start, 1800);

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) start();
        },
        { rootMargin: "120px 0px", threshold: 0.01 },
      );
      observer.observe(host);
    }

    return () => {
      cancelled = true;
      cancelIdle();
      observer?.disconnect();
      setCanInit(false);
    };
  }, [enabled, hostRef]);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas || !enabled || !canInit) return;

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
  }, [hostRef, canvasRef, enabled, canInit, mobile, reducedMotion]);

  useEffect(() => {
    sceneRef.current?.setReducedMotion(reducedMotion);
  }, [reducedMotion]);

  return sceneRef;
}
