import Link from "next/link";
import { Fragment } from "react";
import type { Locale } from "@/lib/i18n/config";
import { bodyTextClass } from "@/lib/i18n/locale-classes";
import type { Dictionary } from "@/content/translations";
import { gymura } from "@/content/projects/gymura";
import { composition, v2Spacing } from "@/lib/layout/v2-composition";
import { JourneyShell, JourneyComposition } from "@/components/v2/JourneyShell";
import { HumanAnnotation } from "@/components/v2/BridgeAnnotation";
import { ProjectStatusBadge } from "@/components/ui/ProjectStatusBadge";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { DesktopOnly } from "@/components/ui/DesktopOnly";
import { DeferredLiveWebsitePreview } from "@/components/projects/DeferredLiveWebsitePreview";
import { ProjectTechStack } from "@/components/projects/ProjectTechStack";
import { MobileDisclosure } from "@/components/mobile/MobileDisclosure";
import { MobilePreviewTeaser } from "@/components/mobile/MobilePreviewTeaser";
import { MobileProcessSteps } from "@/components/mobile/MobileProcessSteps";
import {
  JourneyRail,
  JourneyRailNode,
  JourneyRailSegment,
  JourneyRailSummary,
  JourneyRailTrack,
} from "@/components/v2/journey-rail/JourneyRail";

interface WorldBrandsSectionProps {
  locale: Locale;
  dictionary: Dictionary;
}

/** Build Brands — expanded Gymura live preview (Phase 7.3B.7). */
export function WorldBrandsSection({ locale, dictionary }: WorldBrandsSectionProps) {
  const world = dictionary.homeV2.worlds.brands;
  const mobile = dictionary.homeV2.mobile;
  const gymuraCopy = dictionary.gymura;
  const paragraphClass = bodyTextClass(locale);
  const base = `/${locale}`;
  const websiteUrl = gymura.website ?? "https://gymura.store";

  const processSteps = world.brandEvolution.map((step) => ({
    number: step.number,
    title: step.title,
    description: step.items.join(" · "),
  }));

  return (
    <JourneyShell
      id="world-brands"
      spine="node-brands"
      atmosphere="brands"
      continuityOut="brands-systems"
      connector="brands"
      spineWaypoint="brands"
      chapterLabel={world.eyebrow}
      className={v2Spacing.world}
    >
      <JourneyComposition
        className={`gymura-mobile-stack ${composition.innerWide} ${composition.gymuraEditorialGrid}`}
      >
        <div className="gymura-content-column min-w-0">
          <p className="gymura-mobile-eyebrow journey-chapter-eyebrow text-xs font-semibold tracking-tight text-[var(--accent-brand)]">
            {world.eyebrow}
          </p>

          <h2
            className="gymura-mobile-title editorial-wordmark mt-2 font-semibold tracking-tight text-balance"
            aria-label={gymuraCopy.title}
          >
            {gymuraCopy.title}
          </h2>

          <p className="gymura-mobile-subtitle mobile-compress-hide mt-3 text-sm text-mist">
            {gymuraCopy.subtitle}
          </p>

          <div className="gymura-mobile-bridge mobile-compress-hide">
            <HumanAnnotation locale={locale} text={world.bridge} />
          </div>

          <p
            className={`gymura-mobile-statement mobile-compress-only mt-3 max-w-md ${paragraphClass}`}
          >
            {mobile.gymura.statement}
          </p>

          <p
            className={`gymura-mobile-statement mobile-compress-hide mt-5 max-w-md ${paragraphClass}`}
          >
            {gymuraCopy.description[0]}
          </p>

          <div className="gymura-mobile-meta mt-4 flex flex-wrap items-center gap-3">
            <ProjectStatusBadge
              status={gymura.status}
              label={dictionary.statusLabels[gymura.status]}
            />
            <p className="text-sm text-mist">
              {gymuraCopy.roleLabel}: <span className="text-soft">{gymuraCopy.role}</span>
            </p>
          </div>

          <ProjectTechStack
            className="gymura-mobile-tech"
            projectId="gymura"
            locale={locale}
            dictionary={dictionary}
            compact
            maxItems={8}
            expandable
            mobileInitialCount={4}
            expandLabel={mobile.disclosure.showFullStack}
            collapseLabel={mobile.disclosure.showLess}
          />

          <div className="gymura-mobile-cta mt-6 flex flex-wrap gap-3">
            <Link
              href={`${base}/projects/${gymura.slug}`}
              className="mobile-primary-cta inline-flex min-h-12 items-center rounded-full bg-electric/90 px-6 text-sm font-semibold text-obsidian transition-colors hover:bg-glow"
            >
              {gymuraCopy.caseStudy}
            </Link>
          </div>

          <MobileProcessSteps
            className="gymura-mobile-rail mobile-compress-only"
            locale={locale}
            steps={processSteps.slice(0, 3)}
          />

          <MobileDisclosure
            className="gymura-mobile-rail"
            label={mobile.disclosure.moreDetails}
            labelExpanded={mobile.disclosure.showLess}
          >
            <p className={`max-w-md ${paragraphClass}`}>{gymuraCopy.description[0]}</p>
            {gymuraCopy.description[1] ? (
              <p className={`mt-3 max-w-md ${paragraphClass}`}>{gymuraCopy.description[1]}</p>
            ) : null}
            <HumanAnnotation locale={locale} text={world.bridge} />
            <JourneyRail
              world="brands"
              layout="editorial-horizontal"
              ariaLabel={world.eyebrow}
              className="mt-6"
              spineAnchor="brand-evolution"
            >
              <JourneyRailSummary
                text={world.brandEvolution
                  .map((step) => `${step.number} ${step.title}: ${step.items.join(", ")}`)
                  .join(". ")}
              />
              <JourneyRailTrack>
                {world.brandEvolution.map((step, index) => (
                  <Fragment key={step.number}>
                    <JourneyRailNode
                      number={step.number}
                      title={step.title}
                      items={step.items}
                      titleDir="auto"
                    />
                    {index < world.brandEvolution.length - 1 ? (
                      <JourneyRailSegment orientation="horizontal" />
                    ) : null}
                  </Fragment>
                ))}
              </JourneyRailTrack>
            </JourneyRail>
          </MobileDisclosure>

          <JourneyRail
            world="brands"
            layout="editorial-horizontal"
            ariaLabel={world.eyebrow}
            className="gymura-mobile-rail mobile-compress-hide mt-8"
            spineAnchor="brand-evolution"
          >
            <JourneyRailSummary
              text={world.brandEvolution
                .map((step) => `${step.number} ${step.title}: ${step.items.join(", ")}`)
                .join(". ")}
            />
            <JourneyRailTrack>
              {world.brandEvolution.map((step, index) => (
                <Fragment key={step.number}>
                  <JourneyRailNode
                    number={step.number}
                    title={step.title}
                    items={step.items}
                    titleDir="auto"
                  />
                  {index < world.brandEvolution.length - 1 ? (
                    <JourneyRailSegment orientation="horizontal" />
                  ) : null}
                </Fragment>
              ))}
            </JourneyRailTrack>
          </JourneyRail>
        </div>

        <div className="gymura-preview-column">
          <MobilePreviewTeaser
            websiteUrl={websiteUrl}
            title={gymuraCopy.livePreview.title}
            displayDomain={gymuraCopy.livePreview.displayDomain}
            openWebsiteLabel={gymuraCopy.livePreview.openWebsiteLabel}
            openPreviewLabel={mobile.disclosure.openLivePreview}
            visitLabel={gymuraCopy.visit}
            labels={dictionary.livePreview}
            opensInNewTabLabel={dictionary.a11y.opensInNewTab}
            variant="compact-expanded"
          />

          <DesktopOnly>
            <div className="mobile-compress-hide">
              <div className="gymura-preview-header">
                <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--accent-brand)]">
                  {gymuraCopy.livePreview.title}
                </p>
                <ExternalLink
                  href={websiteUrl}
                  opensInNewTabLabel={dictionary.a11y.opensInNewTab}
                  className="inline-flex min-h-11 shrink-0 items-center rounded-full border border-line px-5 text-xs font-medium text-mist transition-colors hover:border-electric hover:text-soft sm:text-sm"
                >
                  {gymuraCopy.visit}
                </ExternalLink>
              </div>

              <div className="gymura-preview-shell">
                <DeferredLiveWebsitePreview
                  websiteUrl={websiteUrl}
                  title={gymuraCopy.livePreview.title}
                  displayDomain={gymuraCopy.livePreview.displayDomain}
                  openWebsiteLabel={gymuraCopy.livePreview.openWebsiteLabel}
                  labels={dictionary.livePreview}
                  variant="compact-expanded"
                  opensInNewTabLabel={dictionary.a11y.opensInNewTab}
                />
              </div>
            </div>
          </DesktopOnly>
        </div>
      </JourneyComposition>
    </JourneyShell>
  );
}
