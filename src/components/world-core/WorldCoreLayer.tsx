"use client";

import { useEffect, useRef, useState } from "react";
import { assessWorldCoreEligibility } from "@/lib/world-core/eligibility";
import { applyWorldCssVariables } from "@/lib/world-core/world-colors";
import { createWorldCoreController } from "@/lib/world-core/world-core-controller";
import { WorldCoreFallback } from "@/components/world-core/WorldCoreFallback";
import { useWorldCoreScene } from "@/components/world-core/use-world-core-scene";
import "@/components/world-core/world-core.css";

/** Homepage persistent World Core — one canvas, inline-end, section-driven. */
export function WorldCoreLayer() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tintRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<ReturnType<typeof createWorldCoreController> | null>(null);

  const [eligibility, setEligibility] = useState(() =>
    typeof window !== "undefined"
      ? assessWorldCoreEligibility()
      : {
          webgl: false,
          desktop: false,
          tablet: false,
          mobile: true,
          reducedMotion: true,
          saveData: false,
          eligible: false,
        },
  );

  const webglOn = eligibility.eligible && !eligibility.reducedMotion;
  const sceneRef = useWorldCoreScene(hostRef, canvasRef, {
    enabled: webglOn,
    mobile: eligibility.mobile || eligibility.tablet,
    reducedMotion: eligibility.reducedMotion,
  });

  useEffect(() => {
    applyWorldCssVariables("core", true);
    document.documentElement.dataset.worldCorePersistent = "true";
    const update = () => setEligibility(assessWorldCoreEligibility());
    update();
    window.addEventListener("resize", update, { passive: true });
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMq = () => update();
    mq.addEventListener("change", onMq);
    return () => {
      window.removeEventListener("resize", update);
      mq.removeEventListener("change", onMq);
      delete document.documentElement.dataset.worldCorePersistent;
    };
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const controller = createWorldCoreController({
      host,
      canvas: canvasRef.current,
      getScene: () => sceneRef.current,
    });
    controllerRef.current = controller;

    return () => {
      controller.dispose();
      controllerRef.current = null;
    };
  }, [sceneRef, webglOn]);

  const layerClass = [
    "world-core-layer",
    eligibility.mobile ? "world-core-layer--mobile" : "",
    eligibility.tablet ? "world-core-layer--tablet" : "",
    !webglOn ? "world-core-layer--static" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={hostRef} className={layerClass} aria-hidden data-world-core-layer>
      {webglOn ? (
        <canvas ref={canvasRef} className="world-core-layer__canvas" tabIndex={-1} aria-hidden />
      ) : (
        <WorldCoreFallback />
      )}
      <div ref={tintRef} className="world-core-layer__tint" />
    </div>
  );
}
