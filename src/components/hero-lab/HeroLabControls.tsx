"use client";

import type { LabSceneDebugInfo } from "@/lib/hero-lab/use-lab-webgl-scene";

interface HeroLabControlsProps {
  labels: {
    variantALabel: string;
    variantBLabel: string;
    variantCLabel: string;
    deviceDesktop: string;
    deviceMobile: string;
    replayMotion: string;
    pauseMotion: string;
    resumeMotion: string;
    reducedMotionPreview: string;
  };
  variant: "a" | "b" | "c";
  device: "desktop" | "mobile";
  motionPaused: boolean;
  reducedPreview: boolean;
  onVariantChange: (v: "a" | "b" | "c") => void;
  onDeviceChange: (d: "desktop" | "mobile") => void;
  onReplay: () => void;
  onTogglePause: () => void;
  onToggleReduced: () => void;
}

export function HeroLabControls({
  labels,
  variant,
  device,
  motionPaused,
  reducedPreview,
  onVariantChange,
  onDeviceChange,
  onReplay,
  onTogglePause,
  onToggleReduced,
}: HeroLabControlsProps) {
  return (
    <div className="hero-lab-controls" role="toolbar" aria-label="Hero lab controls">
      <div className="hero-lab-controls__group" role="group" aria-label="Variant">
        {(
          [
            ["a", labels.variantALabel],
            ["b", labels.variantBLabel],
            ["c", labels.variantCLabel],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={`hero-lab-controls__btn ${variant === key ? "hero-lab-controls__btn--active" : ""}`}
            aria-pressed={variant === key}
            onClick={() => onVariantChange(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="hero-lab-controls__group" role="group" aria-label="Device">
        <button
          type="button"
          className={`hero-lab-controls__btn ${device === "desktop" ? "hero-lab-controls__btn--active" : ""}`}
          aria-pressed={device === "desktop"}
          onClick={() => onDeviceChange("desktop")}
        >
          {labels.deviceDesktop}
        </button>
        <button
          type="button"
          className={`hero-lab-controls__btn ${device === "mobile" ? "hero-lab-controls__btn--active" : ""}`}
          aria-pressed={device === "mobile"}
          onClick={() => onDeviceChange("mobile")}
        >
          {labels.deviceMobile}
        </button>
      </div>

      <div className="hero-lab-controls__group">
        <button type="button" className="hero-lab-controls__btn" onClick={onReplay}>
          {labels.replayMotion}
        </button>
        <button type="button" className="hero-lab-controls__btn" onClick={onTogglePause}>
          {motionPaused ? labels.resumeMotion : labels.pauseMotion}
        </button>
        <button
          type="button"
          className={`hero-lab-controls__btn ${reducedPreview ? "hero-lab-controls__btn--active" : ""}`}
          aria-pressed={reducedPreview}
          onClick={onToggleReduced}
        >
          {labels.reducedMotionPreview}
        </button>
      </div>
    </div>
  );
}

interface HeroLabDebugPanelProps {
  title: string;
  variant: string;
  device: string;
  motionPaused: boolean;
  reducedPreview: boolean;
  debug: LabSceneDebugInfo | null;
}

export function HeroLabDebugPanel({
  title,
  variant,
  device,
  motionPaused,
  reducedPreview,
  debug,
}: HeroLabDebugPanelProps) {
  if (process.env.NODE_ENV !== "development") return null;

  return (
    <aside className="hero-lab-debug" aria-label={title}>
      <p className="hero-lab-debug__title">{title}</p>
      <dl className="hero-lab-debug__list">
        <div>
          <dt>Variant</dt>
          <dd>{variant}</dd>
        </div>
        <div>
          <dt>Device</dt>
          <dd>{device}</dd>
        </div>
        <div>
          <dt>Canvas active</dt>
          <dd>{debug?.canvasActive ? "yes" : "no"}</dd>
        </div>
        <div>
          <dt>Renderer count</dt>
          <dd>{debug?.rendererCount ?? 0}</dd>
        </div>
        <div>
          <dt>WebGL</dt>
          <dd>{debug?.webglAvailable ? "available" : "unavailable"}</dd>
        </div>
        <div>
          <dt>DPR</dt>
          <dd>{debug?.devicePixelRatio?.toFixed(2) ?? "—"}</dd>
        </div>
        <div>
          <dt>Motion paused</dt>
          <dd>{motionPaused ? "yes" : "no"}</dd>
        </div>
        <div>
          <dt>Reduced preview</dt>
          <dd>{reducedPreview ? "yes" : "no"}</dd>
        </div>
      </dl>
    </aside>
  );
}

interface HeroLabEvaluationProps {
  title: string;
  note: string;
  criteria: string[];
}

export function HeroLabEvaluation({ title, note, criteria }: HeroLabEvaluationProps) {
  return (
    <section className="hero-lab-evaluation" aria-labelledby="hero-lab-eval-title">
      <h2 id="hero-lab-eval-title" className="hero-lab-evaluation__title">
        {title}
      </h2>
      <p className="hero-lab-evaluation__note">{note}</p>
      <ul className="hero-lab-evaluation__list">
        {criteria.map((item) => (
          <li key={item}>
            <label className="hero-lab-evaluation__item">
              <input type="checkbox" className="hero-lab-evaluation__check" />
              <span>{item}</span>
            </label>
            <textarea
              className="hero-lab-evaluation__notes"
              rows={1}
              placeholder="Notes…"
              aria-label={`${item} notes`}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
