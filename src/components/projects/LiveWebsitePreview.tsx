"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
  type RefObject,
} from "react";
import type { Dictionary } from "@/content/translations";
import { ExternalLink } from "@/components/ui/ExternalLink";

type ViewportMode = "desktop" | "tablet" | "mobile";
type PreviewState = "idle" | "loading" | "loaded" | "unavailable";

const VIEWPORT_WIDTHS: Record<ViewportMode, number> = {
  desktop: 1280,
  tablet: 768,
  mobile: 375,
};

const IFRAME_HEIGHT = 520;
const COMPACT_IFRAME_HEIGHT = 380;
const LOAD_TIMEOUT_MS = 12_000;
const MOBILE_BREAKPOINT = 640;
const DEFAULT_VIEWPORT_MODE: ViewportMode = "desktop";
const SCROLL_DRIFT_TOLERANCE_PX = 4;

function viewportForWindowWidth(width: number): ViewportMode {
  return width < MOBILE_BREAKPOINT ? "mobile" : "desktop";
}

/** Restore viewport scroll if a layout update nudges the page. */
function restoreScrollPosition(scrollX: number, scrollY: number): void {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (
        Math.abs(window.scrollX - scrollX) > SCROLL_DRIFT_TOLERANCE_PX ||
        Math.abs(window.scrollY - scrollY) > SCROLL_DRIFT_TOLERANCE_PX
      ) {
        window.scrollTo({ left: scrollX, top: scrollY, behavior: "instant" });
      }
    });
  });
}

function runWithoutScrollJump(action: () => void): void {
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  action();
  restoreScrollPosition(scrollX, scrollY);
}

export interface LiveWebsitePreviewProps {
  websiteUrl: string;
  title: string;
  displayDomain: string;
  openWebsiteLabel: string;
  labels: Dictionary["livePreview"];
  screenshotFallback?: string;
  /** When true, starts loading once the section nears the viewport. Default: click-to-load. */
  autoLoadWhenVisible?: boolean;
  /** Optional data-motion value for the browser shell wrapper (Gymura case study). */
  motionShell?: string;
  /** `compact` embeds a smaller preview for homepage columns — same iframe logic. */
  /** `compact-expanded` — Gymura homepage flagship preview; fills parent column height. */
  variant?: "default" | "compact" | "compact-expanded";
  /** Screen-reader hint for external links — from dictionary.a11y.opensInNewTab. */
  opensInNewTabLabel?: string;
}

export function LiveWebsitePreview({
  websiteUrl,
  title,
  displayDomain,
  openWebsiteLabel,
  labels,
  screenshotFallback,
  autoLoadWhenVisible = false,
  motionShell,
  variant = "default",
  opensInNewTabLabel = "",
}: LiveWebsitePreviewProps) {
  const isCompact = variant === "compact" || variant === "compact-expanded";
  const isCompactExpanded = variant === "compact-expanded";
  /** Restaurant compact embed only — Gymura header owns the project-level visit CTA. */
  const showStandaloneExternalLink = variant === "compact";
  const iframeHeightBase = isCompact ? COMPACT_IFRAME_HEIGHT : IFRAME_HEIGHT;
  const viewportMinHeight = isCompactExpanded
    ? "live-preview-viewport-expanded min-h-[clamp(17.5rem,75vw,22.5rem)] sm:min-h-[clamp(20rem,42vw,28rem)] lg:min-h-[clamp(24rem,36vw,32rem)] xl:min-h-[clamp(26rem,38vw,34rem)]"
    : isCompact
      ? "min-h-[200px]"
      : "min-h-[280px] sm:min-h-[320px]";
  const frameVariantClass = isCompactExpanded
    ? "live-preview-viewport-frame--expanded"
    : isCompact
      ? "live-preview-viewport-frame--compact"
      : "live-preview-viewport-frame--default";
  const rootRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const loadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadGenerationRef = useRef(0);
  const switcherId = useId();

  const [viewport, setViewport] = useState<ViewportMode>(DEFAULT_VIEWPORT_MODE);
  const [hasUserSelectedMode, setHasUserSelectedMode] = useState(false);
  const [previewState, setPreviewState] = useState<PreviewState>("idle");
  const [iframeKey, setIframeKey] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [hasAutoLaunched, setHasAutoLaunched] = useState(false);

  const targetWidth = VIEWPORT_WIDTHS[viewport];
  const scale = containerWidth > 0 ? Math.min(1, containerWidth / targetWidth) : 1;
  const iframeHeight =
    isCompactExpanded && containerHeight > 0 && scale > 0
      ? Math.max(480, Math.round(containerHeight / scale))
      : iframeHeightBase;
  const displayWidth = targetWidth * scale;
  const displayHeight =
    isCompactExpanded && containerHeight > 0 ? containerHeight : iframeHeight * scale;

  const clearLoadTimeout = useCallback(() => {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
      loadTimeoutRef.current = null;
    }
  }, []);

  const startLoadTimeout = useCallback(
    (generation: number) => {
      clearLoadTimeout();
      loadTimeoutRef.current = setTimeout(() => {
        if (loadGenerationRef.current !== generation) {
          return;
        }
        setPreviewState((current) => (current === "loading" ? "unavailable" : current));
      }, LOAD_TIMEOUT_MS);
    },
    [clearLoadTimeout],
  );

  const launchPreview = useCallback(() => {
    runWithoutScrollJump(() => {
      const generation = loadGenerationRef.current + 1;
      loadGenerationRef.current = generation;
      clearLoadTimeout();
      setPreviewState("loading");
      setIframeKey((key) => key + 1);
      startLoadTimeout(generation);
    });
  }, [clearLoadTimeout, startLoadTimeout]);

  const handleLaunchClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.currentTarget.focus({ preventScroll: true });
      launchPreview();
    },
    [launchPreview],
  );

  const handleIframeLoad = useCallback(() => {
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    clearLoadTimeout();
    setPreviewState((current) => {
      if (current === "loading" || current === "loaded") {
        return "loaded";
      }
      return current;
    });
    restoreScrollPosition(scrollX, scrollY);
  }, [clearLoadTimeout]);

  const reloadPreview = useCallback(() => {
    if (previewState === "idle" || previewState === "unavailable") {
      launchPreview();
      return;
    }
    runWithoutScrollJump(() => {
      const generation = loadGenerationRef.current + 1;
      loadGenerationRef.current = generation;
      clearLoadTimeout();
      setPreviewState("loading");
      setIframeKey((key) => key + 1);
      startLoadTimeout(generation);
    });
  }, [clearLoadTimeout, launchPreview, previewState, startLoadTimeout]);

  const selectViewport = useCallback((mode: ViewportMode) => {
    setHasUserSelectedMode(true);
    setViewport(mode);
  }, []);

  useEffect(() => {
    if (hasUserSelectedMode) {
      return;
    }

    const syncViewportFromWindow = () => {
      const next = viewportForWindowWidth(window.innerWidth);
      setViewport((current) => (current === next ? current : next));
    };

    syncViewportFromWindow();
    window.addEventListener("resize", syncViewportFromWindow);
    return () => window.removeEventListener("resize", syncViewportFromWindow);
  }, [hasUserSelectedMode]);

  useEffect(() => {
    const node = rootRef.current;
    if (!node || !autoLoadWhenVisible) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !hasAutoLaunched && previewState === "idle") {
          setHasAutoLaunched(true);
          launchPreview();
        }
      },
      { rootMargin: "120px", threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [autoLoadWhenVisible, hasAutoLaunched, launchPreview, previewState]);

  useEffect(() => {
    const node = frameRef.current;
    if (!node) {
      return;
    }
    const updateDimensions = () => {
      setContainerWidth(node.clientWidth);
      setContainerHeight(node.clientHeight);
    };
    updateDimensions();
    const observer = new ResizeObserver(updateDimensions);
    observer.observe(node);
    return () => observer.disconnect();
  }, [viewport]);

  useEffect(() => () => clearLoadTimeout(), [clearLoadTimeout]);

  const showIframe = previewState === "loading" || previewState === "loaded";
  const viewportModes: ViewportMode[] = ["desktop", "tablet", "mobile"];

  const openWebsiteLink = (
    <ExternalLink
      href={websiteUrl}
      opensInNewTabLabel={opensInNewTabLabel}
      className={
        isCompact
          ? "inline-flex min-h-11 shrink-0 items-center rounded-full border border-line px-4 text-xs font-medium text-mist transition-colors hover:border-electric hover:text-soft sm:text-sm"
          : "inline-flex min-h-11 shrink-0 items-center rounded-full border border-line px-5 text-sm font-medium text-mist transition-colors hover:border-electric hover:text-soft"
      }
    >
      {openWebsiteLabel}
    </ExternalLink>
  );

  const browserShell = (
    <div
      dir="ltr"
      role="group"
      aria-label={labels.previewShell}
      data-motion={motionShell}
      className={`${
        isCompactExpanded
          ? "mt-0 flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-line bg-ink/80 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)]"
          : isCompact
            ? "mt-3 min-w-0 overflow-hidden rounded-2xl border border-line bg-ink/80 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)]"
            : "mt-6 min-w-0 overflow-hidden rounded-2xl border border-line bg-ink/80 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)]"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2 border-b border-line bg-graphite/80 px-3 py-2.5 sm:gap-3 sm:px-4">
        <div aria-hidden className="flex shrink-0 items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-line" />
          <span className="size-2.5 rounded-full bg-line" />
          <span className="size-2.5 rounded-full bg-line" />
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-line bg-obsidian/70 px-3 py-1.5">
          <span aria-hidden className="size-2 shrink-0 rounded-full bg-electric/70" />
          <span className="truncate text-xs text-mist sm:text-sm">{displayDomain}</span>
        </div>

        <div
          role="group"
          aria-label={labels.viewportSwitcher}
          className="flex w-full flex-wrap gap-1 sm:w-auto"
        >
          {viewportModes.map((mode) => (
            <button
              key={mode}
              type="button"
              aria-pressed={viewport === mode}
              onClick={() => selectViewport(mode)}
              className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border px-3 text-xs font-medium transition-colors sm:min-w-0 ${
                viewport === mode
                  ? "border-electric bg-electric/15 text-soft"
                  : "border-line text-mist hover:border-electric/50 hover:text-soft"
              }`}
            >
              {labels[mode]}
            </button>
          ))}
        </div>

        <div className="flex w-full flex-wrap gap-2 sm:ml-auto sm:w-auto">
          <button
            type="button"
            onClick={reloadPreview}
            disabled={previewState === "idle"}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border border-line px-3 text-xs text-mist transition-colors hover:border-electric hover:text-soft disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
          >
            {labels.reload}
          </button>
          <ExternalLink
            href={websiteUrl}
            opensInNewTabLabel={opensInNewTabLabel}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border border-line px-3 text-xs font-medium text-soft transition-colors hover:border-electric sm:flex-none"
          >
            {labels.openFullWebsite}
          </ExternalLink>
        </div>
      </div>

      <div
        ref={viewportRef}
        className={`relative min-w-0 bg-obsidian p-3 sm:p-4 ${viewportMinHeight} ${isCompactExpanded ? "flex flex-1 flex-col" : ""}`}
      >
        <div
          ref={frameRef}
          className={`live-preview-viewport-frame ${frameVariantClass} ${isCompactExpanded ? "flex-1" : ""}`}
        >
          {previewState === "idle" ? (
            <div className="live-preview-viewport-overlay live-preview-viewport-overlay--idle">
              <p className="max-w-md text-sm text-mist">{labels.blockedHint}</p>
              <button
                type="button"
                onClick={handleLaunchClick}
                className="inline-flex min-h-12 items-center rounded-full bg-soft px-6 text-sm font-medium text-obsidian transition-colors hover:bg-electric"
              >
                {labels.launch}
              </button>
            </div>
          ) : null}

          {previewState === "unavailable" ? (
            <div className="live-preview-viewport-overlay live-preview-viewport-overlay--unavailable">
              {screenshotFallback ? (
                <div className="relative mx-auto aspect-video w-full max-w-2xl overflow-hidden rounded-lg border border-line">
                  <Image
                    src={screenshotFallback}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 672px"
                  />
                </div>
              ) : null}
              <p className="text-sm font-medium text-soft">{labels.unavailable}</p>
              <p className="max-w-md text-sm text-mist">{labels.blockedHint}</p>
              <ExternalLink
                href={websiteUrl}
                opensInNewTabLabel={opensInNewTabLabel}
                className="inline-flex min-h-12 items-center rounded-full bg-soft px-6 text-sm font-medium text-obsidian transition-colors hover:bg-electric"
              >
                {labels.openInNewTab}
              </ExternalLink>
              <button
                type="button"
                onClick={handleLaunchClick}
                className="inline-flex min-h-11 items-center rounded-full border border-line px-5 text-sm text-mist transition-colors hover:border-electric hover:text-soft"
              >
                {labels.reload}
              </button>
            </div>
          ) : null}

          {showIframe ? (
            <div className="live-preview-viewport-stage" aria-busy={previewState === "loading"}>
              <div
                className="live-preview-viewport-iframe-shell"
                style={{ width: displayWidth, height: displayHeight }}
              >
                {previewState === "loading" ? (
                  <div className="live-preview-viewport-loading" role="status" aria-live="polite">
                    <span className="text-sm text-mist">{labels.loading}</span>
                  </div>
                ) : null}

                <iframe
                  key={iframeKey}
                  title={title}
                  src={websiteUrl}
                  loading="eager"
                  tabIndex={-1}
                  referrerPolicy="strict-origin-when-cross-origin"
                  onLoad={handleIframeLoad}
                  className="block border-0 bg-white"
                  style={{
                    width: targetWidth,
                    height: iframeHeight,
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                  }}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );

  if (isCompact) {
    return (
      <div
        ref={rootRef as RefObject<HTMLDivElement>}
        role="group"
        aria-label={title}
        className={`min-w-0 ${isCompactExpanded ? "gymura-live-preview-expanded flex min-h-0 flex-1 flex-col" : ""}`}
      >
        {showStandaloneExternalLink ? (
          <div className="flex items-center justify-end gap-2">{openWebsiteLink}</div>
        ) : null}
        {browserShell}
      </div>
    );
  }

  return (
    <section
      ref={rootRef as RefObject<HTMLElement>}
      aria-labelledby={`${switcherId}-heading`}
      className="min-w-0"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2
          id={`${switcherId}-heading`}
          className="text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          {labels.sectionLabel}
        </h2>
        {openWebsiteLink}
      </div>
      <p className="mt-2 text-sm text-mist">{title}</p>
      {browserShell}
    </section>
  );
}
