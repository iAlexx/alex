import Link from "next/link";
import { Fragment } from "react";
import type { Locale } from "@/lib/i18n/config";
import { hintTextClass } from "@/lib/i18n/locale-classes";
import type { Dictionary } from "@/content/translations";
import { texasFunds } from "@/content/projects/texas-funds";
import {
  JourneyRail,
  JourneyRailNode,
  JourneyRailSegment,
  JourneyRailSummary,
  JourneyRailTrack,
} from "@/components/v2/journey-rail/JourneyRail";
import { ProjectTechStack } from "@/components/projects/ProjectTechStack";

interface SystemsTexasFundsBranchProps {
  locale: Locale;
  dictionary: Dictionary;
  statusLine: string;
  description: string;
  microFlow: string;
  flowSteps: string[];
}

/** Independent live Telegram product rail inside Build Systems. */
export function SystemsTexasFundsBranch({
  locale,
  dictionary,
  statusLine,
  description,
  microFlow,
  flowSteps,
}: SystemsTexasFundsBranchProps) {
  const hintClass = hintTextClass(locale);
  const base = `/${locale}`;
  const title = dictionary.liveProducts.texasFunds.title;
  const ariaLabel = `${title} — ${statusLine}`;

  return (
    <aside aria-label={ariaLabel} className="systems-texas-branch">
      <div aria-hidden className="systems-texas-branch__connector" data-rail-line />
      <span aria-hidden className="systems-texas-branch__node" data-rail-marker />

      <div className="systems-texas-branch__header">
        <div className="flex flex-wrap items-center gap-2">
          <span className="relative flex size-2" aria-hidden>
            <span className="inline-flex size-2 rounded-full bg-[var(--accent-live)]" />
          </span>
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--accent-system)]">
            {statusLine}
          </span>
        </div>
        <h3 className="mt-2 text-base font-semibold text-soft sm:text-lg">{title}</h3>
      </div>

      <div className="systems-texas-branch__body">
        <JourneyRail
          world="systems"
          layout="micro-flow"
          ariaLabel={microFlow}
          dir="ltr"
          spineAnchor="texas-flow"
        >
          <JourneyRailSummary text={microFlow} />
          <JourneyRailTrack>
            <span aria-hidden className="texas-data-pulse" data-texas-pulse />
            {flowSteps.map((step, index) => (
              <Fragment key={step}>
                <JourneyRailNode title={step} titleDir="auto" />
                {index < flowSteps.length - 1 ? (
                  <JourneyRailSegment orientation="horizontal" />
                ) : null}
              </Fragment>
            ))}
          </JourneyRailTrack>
        </JourneyRail>

        <p className={`mt-3 max-w-xl ${hintClass}`}>{description}</p>

        <ProjectTechStack
          projectId="texas-funds"
          locale={locale}
          dictionary={dictionary}
          compact
          maxItems={8}
          expandable
          mobileInitialCount={4}
          expandLabel={dictionary.homeV2.mobile.disclosure.showFullStack}
          collapseLabel={dictionary.homeV2.mobile.disclosure.showLess}
        />

        <Link
          href={`${base}/projects/${texasFunds.slug}`}
          className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-electric hover:underline"
        >
          {dictionary.projectPages.openCaseStudy} →
        </Link>
      </div>
    </aside>
  );
}
