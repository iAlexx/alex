"use client";

import { useEffect, useRef } from "react";
import type { LabSceneBaseHandle } from "@/lib/hero-lab/webgl-utils";

export interface UseLabWebGLSceneOptions {
  simplified?: boolean;
  motionPaused?: boolean;
  reducedPreview?: boolean;
  replayKey?: number;
  loadScene: (
    canvas: HTMLCanvasElement,
    options: { simplified?: boolean },
  ) => Promise<LabSceneBaseHandle | null>;
  onDebugUpdate?: (info: LabSceneDebugInfo) => void;
}

export interface LabSceneDebugInfo {
  canvasActive: boolean;
  rendererCount: number;
  webglAvailable: boolean;
  devicePixelRatio: number;
  fpsEstimate: number;
}

function probeWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl") ?? c.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

/** Shared WebGL lifecycle for Hero Lab — one scene, full dispose on unmount. */
export function useLabWebGLScene(
  hostRef: React.RefObject<HTMLDivElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  options: UseLabWebGLSceneOptions,
): void {
  const {
    simplified = false,
    motionPaused = false,
    reducedPreview = false,
    replayKey = 0,
    loadScene,
    onDebugUpdate,
  } = options;

  const sceneRef = useRef<LabSceneBaseHandle | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas || reducedPreview) {
      onDebugUpdate?.({
        canvasActive: false,
        rendererCount: 0,
        webglAvailable: probeWebGL(),
        devicePixelRatio: window.devicePixelRatio,
        fpsEstimate: 0,
      });
      return;
    }

    let cancelled = false;
    let removePointer: (() => void) | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let inView = true;
    let pageVisible = document.visibilityState === "visible";
    let io: IntersectionObserver | null = null;

    const syncActive = () => {
      const shouldRun = inView && pageVisible && !motionPaused && !reducedPreview;
      sceneRef.current?.setActive(shouldRun);
      onDebugUpdate?.({
        canvasActive: shouldRun && !!sceneRef.current,
        rendererCount: shouldRun && sceneRef.current ? 1 : 0,
        webglAvailable: true,
        devicePixelRatio: Math.min(window.devicePixelRatio, 1.5),
        fpsEstimate: 0,
      });
    };

    void (async () => {
      const scene = await loadScene(canvas, { simplified });
      if (cancelled || !scene) {
        onDebugUpdate?.({
          canvasActive: false,
          rendererCount: 0,
          webglAvailable: probeWebGL(),
          devicePixelRatio: window.devicePixelRatio,
          fpsEstimate: 0,
        });
        return;
      }
      sceneRef.current = scene;
      scene.resetAnimation();

      const rect = host.getBoundingClientRect();
      scene.resize(rect.width, rect.height);

      resizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (!entry || !sceneRef.current) return;
        sceneRef.current.resize(entry.contentRect.width, entry.contentRect.height);
      });
      resizeObserver.observe(host);

      const canPointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      if (canPointer) {
        const onMove = (e: PointerEvent) => {
          const r = host.getBoundingClientRect();
          if (r.width === 0) return;
          scene.setPointer(
            ((e.clientX - r.left) / r.width) * 2 - 1,
            ((e.clientY - r.top) / r.height) * 2 - 1,
          );
        };
        const onLeave = () => scene.clearPointer();
        host.addEventListener("pointermove", onMove, { passive: true });
        host.addEventListener("pointerleave", onLeave, { passive: true });
        removePointer = () => {
          host.removeEventListener("pointermove", onMove);
          host.removeEventListener("pointerleave", onLeave);
        };
      }

      io = new IntersectionObserver(
        (entries) => {
          inView = entries.some((e) => e.isIntersecting);
          syncActive();
        },
        { rootMargin: "40px" },
      );
      io.observe(host);

      const onVis = () => {
        pageVisible = document.visibilityState === "visible";
        syncActive();
      };
      document.addEventListener("visibilitychange", onVis);
      syncActive();
    })();

    return () => {
      cancelled = true;
      removePointer?.();
      resizeObserver?.disconnect();
      io?.disconnect();
      sceneRef.current?.dispose();
      sceneRef.current = null;
      onDebugUpdate?.({
        canvasActive: false,
        rendererCount: 0,
        webglAvailable: probeWebGL(),
        devicePixelRatio: window.devicePixelRatio,
        fpsEstimate: 0,
      });
    };
  }, [
    hostRef,
    canvasRef,
    simplified,
    motionPaused,
    reducedPreview,
    replayKey,
    loadScene,
    onDebugUpdate,
  ]);

  useEffect(() => {
    if (reducedPreview || motionPaused) {
      sceneRef.current?.setActive(false);
    } else {
      sceneRef.current?.setActive(true);
      sceneRef.current?.resetAnimation();
    }
  }, [motionPaused, reducedPreview, replayKey]);
}
