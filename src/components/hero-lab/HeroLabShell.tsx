"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/content/translations";
import {
  HeroLabControls,
  HeroLabDebugPanel,
  HeroLabEvaluation,
} from "@/components/hero-lab/HeroLabControls";
import { HeroLabVariantA } from "@/components/hero-lab/HeroLabVariantA";
import { HeroLabVariantB } from "@/components/hero-lab/HeroLabVariantB";
import { HeroLabVariantC } from "@/components/hero-lab/HeroLabVariantC";
import type { LabSceneDebugInfo } from "@/lib/hero-lab/use-lab-webgl-scene";
import "@/components/hero-lab/hero-lab.css";

interface HeroLabShellProps {
  locale: Locale;
  dictionary: Dictionary;
}

export function HeroLabShell({ locale, dictionary }: HeroLabShellProps) {
  const lab = dictionary.heroLab;
  const [variant, setVariant] = useState<"a" | "b" | "c">("a");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [replayKey, setReplayKey] = useState(0);
  const [motionPaused, setMotionPaused] = useState(false);
  const [reducedPreview, setReducedPreview] = useState(false);
  const [debug, setDebug] = useState<LabSceneDebugInfo | null>(null);

  const onDebugUpdate = useCallback((info: LabSceneDebugInfo) => {
    setDebug(info);
  }, []);

  const handleVariantChange = (v: "a" | "b" | "c") => {
    setVariant(v);
    setReplayKey((k) => k + 1);
    setDebug(null);
  };

  return (
    <div className="hero-lab-page">
      <header className="hero-lab-header">
        <div className="hero-lab-header__top">
          <span className="hero-lab-badge">{lab.badge}</span>
          <Link href={`/${locale}`} className="hero-lab-header__back">
            ← {dictionary.a11y.pageNotFoundHome}
          </Link>
        </div>
        <h1 className="hero-lab-header__title">{lab.title}</h1>
        <p className="hero-lab-header__desc">{lab.description}</p>
      </header>

      <HeroLabControls
        labels={lab}
        variant={variant}
        device={device}
        motionPaused={motionPaused}
        reducedPreview={reducedPreview}
        onVariantChange={handleVariantChange}
        onDeviceChange={setDevice}
        onReplay={() => setReplayKey((k) => k + 1)}
        onTogglePause={() => setMotionPaused((p) => !p)}
        onToggleReduced={() => setReducedPreview((r) => !r)}
      />

      <section className="hero-lab-preview" aria-label={lab.previewLabel}>
        <div
          className={`hero-lab-preview__frame hero-lab-preview__frame--${device}`}
          data-variant={variant}
        >
          {variant === "a" ? (
            <HeroLabVariantA
              key={`a-${replayKey}`}
              locale={locale}
              dictionary={dictionary}
              device={device}
              replayKey={replayKey}
              motionPaused={motionPaused}
              reducedPreview={reducedPreview}
              onDebugUpdate={onDebugUpdate}
            />
          ) : null}
          {variant === "b" ? (
            <HeroLabVariantB
              key={`b-${replayKey}`}
              locale={locale}
              dictionary={dictionary}
              device={device}
              replayKey={replayKey}
              motionPaused={motionPaused}
              reducedPreview={reducedPreview}
              onDebugUpdate={onDebugUpdate}
            />
          ) : null}
          {variant === "c" ? (
            <HeroLabVariantC
              key={`c-${replayKey}`}
              locale={locale}
              dictionary={dictionary}
              device={device}
              replayKey={replayKey}
              motionPaused={motionPaused}
              reducedPreview={reducedPreview}
            />
          ) : null}
        </div>
      </section>

      <HeroLabDebugPanel
        title={lab.debugTitle}
        variant={variant}
        device={device}
        motionPaused={motionPaused}
        reducedPreview={reducedPreview}
        debug={debug}
      />

      <HeroLabEvaluation
        title={lab.evaluationTitle}
        note={lab.evaluationNote}
        criteria={lab.criteria}
      />
    </div>
  );
}
