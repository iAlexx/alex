import { Fragment } from "react";
import type { Locale } from "@/lib/i18n/config";
import { bodyTextClass } from "@/lib/i18n/locale-classes";
import type { Dictionary } from "@/content/translations";
import { composition, v2Spacing } from "@/lib/layout/v2-composition";
import { JourneyShell } from "@/components/v2/JourneyShell";
import { BuilderMap } from "@/components/v2/BuilderMap";
import { MobileDisclosure } from "@/components/mobile/MobileDisclosure";
import { MobileProcessSteps } from "@/components/mobile/MobileProcessSteps";
import {
  JourneyRail,
  JourneyRailNode,
  JourneyRailSegment,
  JourneyRailSummary,
  JourneyRailTrack,
} from "@/components/v2/journey-rail/JourneyRail";

interface MethodSectionProps {
  locale: Locale;
  dictionary: Dictionary;
}

/** Method process rail + Builder Map (Phase 7.3B.6). */
export function MethodSection({ locale, dictionary }: MethodSectionProps) {
  const copy = dictionary.homeV2.method;
  const mobile = dictionary.homeV2.mobile;
  const paragraphClass = bodyTextClass(locale);

  const steps = copy.steps.map((step) => ({
    number: step.number,
    title: step.title,
    description: step.description,
  }));

  return (
    <JourneyShell
      id="method"
      spine="through"
      atmosphere="core"
      spineWaypoint="method"
      chapterLabel={copy.title}
      className={v2Spacing.method}
    >
      <div className={composition.innerWide}>
        <div className={composition.reading}>
          <h2 className="text-2xl font-semibold tracking-tight text-soft sm:text-3xl">
            {copy.title}
          </h2>
          <p
            className={`mt-6 text-xl font-medium text-pretty text-soft sm:text-2xl ${locale === "ar" ? "leading-9" : "leading-snug"}`}
          >
            {copy.opener}
          </p>
          <p className={`mobile-compress-hide mt-6 ${paragraphClass}`}>
            {copy.compressedNarrative}
          </p>
        </div>

        <MobileProcessSteps locale={locale} steps={steps} className="mobile-compress-only" />

        <MobileDisclosure
          label={mobile.disclosure.moreDetails}
          labelExpanded={mobile.disclosure.showLess}
        >
          <p className={paragraphClass}>{copy.compressedNarrative}</p>
          <JourneyRail
            world="core"
            layout="process-horizontal"
            ariaLabel={copy.title}
            className="mt-6"
            spineAnchor="process"
          >
            <JourneyRailSummary
              text={copy.steps.map((s) => `${s.title}: ${s.description}`).join(". ")}
            />
            <JourneyRailTrack>
              {copy.steps.map((step, index) => (
                <Fragment key={step.number}>
                  <JourneyRailNode
                    number={step.number}
                    title={step.title}
                    description={step.description}
                  />
                  {index < copy.steps.length - 1 ? (
                    <JourneyRailSegment orientation="horizontal" />
                  ) : null}
                </Fragment>
              ))}
            </JourneyRailTrack>
          </JourneyRail>
          <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
            {copy.principles.map((principle) => (
              <li
                key={principle}
                className="text-sm text-mist before:me-2 before:text-electric before:content-['·']"
              >
                {principle}
              </li>
            ))}
          </ul>
          <div className="mt-8 border-t border-line/60 pt-8">
            <h3 className="text-lg font-semibold text-soft">{copy.mapTitle}</h3>
            <p className={`mt-3 max-w-2xl ${paragraphClass}`}>{copy.mapSubtitle}</p>
            <BuilderMap map={copy} />
          </div>
        </MobileDisclosure>

        <div className="mobile-compress-hide">
          <JourneyRail
            world="core"
            layout="process-horizontal"
            ariaLabel={copy.title}
            className="mt-10"
            spineAnchor="process"
          >
            <JourneyRailSummary
              text={copy.steps.map((s) => `${s.title}: ${s.description}`).join(". ")}
            />
            <JourneyRailTrack>
              {copy.steps.map((step, index) => (
                <Fragment key={step.number}>
                  <JourneyRailNode
                    number={step.number}
                    title={step.title}
                    description={step.description}
                  />
                  {index < copy.steps.length - 1 ? (
                    <JourneyRailSegment orientation="horizontal" />
                  ) : null}
                </Fragment>
              ))}
            </JourneyRailTrack>
          </JourneyRail>

          <ul className="mt-8 flex flex-wrap gap-x-4 gap-y-2">
            {copy.principles.map((principle) => (
              <li
                key={principle}
                className="text-sm text-mist before:me-2 before:text-electric before:content-['·']"
              >
                {principle}
              </li>
            ))}
          </ul>

          <div className="mt-14 border-t border-line/60 pt-10">
            <h3 className="text-lg font-semibold text-soft">{copy.mapTitle}</h3>
            <p className={`mt-3 max-w-2xl ${paragraphClass}`}>{copy.mapSubtitle}</p>
            <BuilderMap map={copy} />
          </div>
        </div>
      </div>
    </JourneyShell>
  );
}
