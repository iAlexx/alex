import type { ReactNode } from "react";
import type { RailLayout, RailWorld } from "@/lib/layout/rail-tokens";
import { railWorldDataAttribute } from "@/lib/layout/rail-tokens";

export interface JourneyRailProps {
  world: RailWorld;
  layout: RailLayout;
  ariaLabel: string;
  className?: string;
  dir?: "ltr" | "rtl" | "auto";
  spineAnchor?: string;
  children: ReactNode;
}

/** Local world journey rail container — connects to global Builder Spine. */
export function JourneyRail({
  world,
  layout,
  ariaLabel,
  className = "",
  dir,
  spineAnchor,
  children,
}: JourneyRailProps) {
  return (
    <div
      className={`journey-rail journey-rail--${layout} ${className}`.trim()}
      data-world={railWorldDataAttribute[world]}
      data-layout={layout}
      data-spine-anchor={spineAnchor}
      data-rail-motion-root
      aria-label={ariaLabel}
      dir={dir}
    >
      <span aria-hidden className="journey-rail__spine-link" data-rail-spine-link />
      {children}
    </div>
  );
}

export interface JourneyRailTrackProps {
  className?: string;
  children: ReactNode;
  as?: "ol" | "ul" | "div";
}

export function JourneyRailTrack({
  className = "",
  children,
  as: Tag = "ol",
}: JourneyRailTrackProps) {
  return <Tag className={`journey-rail__track ${className}`.trim()}>{children}</Tag>;
}

export type JourneyRailNodeVariant =
  "default" | "core" | "endpoint" | "junction" | "open" | "operational";

export interface JourneyRailNodeProps {
  title: string;
  description?: string;
  number?: string;
  items?: string[];
  variant?: JourneyRailNodeVariant;
  className?: string;
  titleDir?: "ltr" | "rtl" | "auto";
}

export function JourneyRailNode({
  title,
  description,
  number,
  items,
  variant = "default",
  className = "",
  titleDir = "auto",
}: JourneyRailNodeProps) {
  return (
    <li
      className={`journey-rail__node journey-rail__node--${variant} ${className}`.trim()}
      data-rail-node
      data-connector-anchor={variant === "junction" ? "branch" : undefined}
    >
      {variant === "operational" && number ? (
        <span className="journey-rail__node-marker" data-rail-marker>
          <span className="journey-rail__node-number">{number}</span>
        </span>
      ) : (
        <span aria-hidden className="journey-rail__node-marker" data-rail-marker />
      )}
      <div className="journey-rail__node-body">
        {number && variant !== "operational" ? (
          <p className="journey-rail__node-number">{number}</p>
        ) : null}
        <p className="journey-rail__node-title" dir={titleDir}>
          {title}
        </p>
        {description ? <p className="journey-rail__node-description">{description}</p> : null}
        {items && items.length > 0 ? (
          <ul className="journey-rail__node-items">
            {items.map((item) => (
              <li key={item}>
                <span dir={item.match(/[a-zA-Z0-9]/) ? "ltr" : undefined}>{item}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </li>
  );
}

export function JourneyRailSegment({
  orientation = "horizontal",
  tone = "primary",
  className = "",
}: {
  orientation?: "horizontal" | "vertical";
  tone?: "primary" | "branch" | "dashed";
  className?: string;
}) {
  return (
    <span
      aria-hidden
      data-rail-line
      className={`journey-rail__segment journey-rail__segment--${orientation} journey-rail__segment--${tone} ${className}`.trim()}
    />
  );
}

export function JourneyRailBranch({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={`journey-rail__branch ${className}`.trim()}>{children}</div>;
}

export function JourneyRailJunction({ className = "" }: { className?: string }) {
  return <span aria-hidden className={`journey-rail__junction ${className}`.trim()} />;
}

export function JourneyRailSummary({ text, className = "" }: { text: string; className?: string }) {
  return <p className={`sr-only ${className}`.trim()}>{text}</p>;
}
