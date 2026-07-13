"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/content/translations";
import {
  CINEMATIC_PORTRAIT,
  LOVABLE_PORTRAIT_FOREGROUND_PATHS,
} from "@/lib/orbital-hero/portrait-spec";

interface OrbitalHeroPortraitProps {
  locale: Locale;
  dictionary: Dictionary;
  parallax?: boolean;
}

/** Cinematic portrait plate — Lovable mask/rim/grain treatment. */
export function OrbitalHeroPortrait({
  locale,
  dictionary,
  parallax = true,
}: OrbitalHeroPortraitProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isArabic = locale === "ar";

  useEffect(() => {
    if (!parallax) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2 - window.innerHeight / 2;
        const y = Math.max(-60, Math.min(60, -center * 0.08));
        el.style.setProperty("--pY", `${y.toFixed(1)}px`);
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [parallax]);

  return (
    <div
      ref={ref}
      className={`lovable-portrait${isArabic ? " lovable-portrait--ar" : ""}`}
      style={{ ["--pY" as string]: "0px" }}
    >
      <div className="lovable-portrait__ambient" aria-hidden />

      <div
        className="lovable-portrait__plate"
        style={{
          transform: "translate3d(0, var(--pY), 0)",
          transition: "transform 0.2s linear",
        }}
      >
        <Image
          src={CINEMATIC_PORTRAIT.src}
          alt={dictionary.a11y.heroImageAlt}
          width={CINEMATIC_PORTRAIT.width}
          height={CINEMATIC_PORTRAIT.height}
          priority
          className="lovable-portrait__image"
          draggable={false}
          sizes="(max-width: 1023px) 92vw, min(580px, 52vw)"
        />

        <div className="lovable-portrait__rim lovable-portrait__rim--blue" aria-hidden />
        <div className="lovable-portrait__rim lovable-portrait__rim--violet" aria-hidden />
        <div className="lovable-portrait__shadow" aria-hidden />
        <div className="lovable-portrait__grain" aria-hidden />
      </div>

      <svg
        aria-hidden
        className="lovable-portrait__paths-front"
        viewBox="0 0 100 140"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="orbital-pline" x1="0" x2="1">
            <stop offset="0" stopColor="#2F80FF" stopOpacity="0" />
            <stop offset="0.5" stopColor="#2F80FF" stopOpacity="0.55" />
            <stop offset="1" stopColor="#835BFF" stopOpacity="0" />
          </linearGradient>
        </defs>
        {LOVABLE_PORTRAIT_FOREGROUND_PATHS.map((path) => (
          <path
            key={path.d}
            d={path.d}
            fill="none"
            stroke="url(#orbital-pline)"
            strokeWidth={path.strokeWidth}
            strokeDasharray={path.dash}
            opacity={path.opacity}
          />
        ))}
      </svg>

      <span className="lovable-portrait__corner lovable-portrait__corner--tl" aria-hidden />
      <span className="lovable-portrait__corner lovable-portrait__corner--br" aria-hidden />
    </div>
  );
}
