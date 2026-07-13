import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { bodyTextClass, securityStageClass } from "@/lib/i18n/locale-classes";
import type { Dictionary } from "@/content/translations";
import { cybersecurityLab } from "@/content/projects/cybersecurity-lab";
import { composition, v2Spacing } from "@/lib/layout/v2-composition";
import { JourneyShell, JourneyComposition } from "@/components/v2/JourneyShell";
import { BridgeAnnotation, HumanAnnotation } from "@/components/v2/BridgeAnnotation";
import { WorldChapterHeader } from "@/components/v2/WorldChapterHeader";
import {
  JourneyRail,
  JourneyRailBranch,
  JourneyRailNode,
  JourneyRailSummary,
  JourneyRailTrack,
} from "@/components/v2/journey-rail/JourneyRail";
import { ProjectTechStack } from "@/components/projects/ProjectTechStack";
import { MobileDisclosure } from "@/components/mobile/MobileDisclosure";
import { MobileProcessSteps } from "@/components/mobile/MobileProcessSteps";

interface WorldSecuritySectionProps {
  locale: Locale;
  dictionary: Dictionary;
  bridgeAnnotation?: string;
}

/** Build Securely — discipline rail + principles branch (Phase 7.3B.6). */
export function WorldSecuritySection({
  locale,
  dictionary,
  bridgeAnnotation,
}: WorldSecuritySectionProps) {
  const world = dictionary.homeV2.worlds.security;
  const mobile = dictionary.homeV2.mobile;
  const paragraphClass = bodyTextClass(locale);
  const stageClass = securityStageClass(locale);
  const base = `/${locale}`;

  const learningSteps = world.stages.map((stage) => ({
    number: stage.number,
    title: stage.title,
    description: stage.description,
  }));

  return (
    <JourneyShell
      id="world-security"
      spine="node-secure"
      atmosphere="security"
      continuityIn="intelligence-security"
      continuityOut="security-future"
      connector="security"
      spineWaypoint="security"
      chapterLabel={world.eyebrow}
      className={v2Spacing.world}
    >
      <JourneyComposition className={composition.innerWide}>
        {bridgeAnnotation ? (
          <div className="mobile-compress-hide">
            <BridgeAnnotation text={bridgeAnnotation} accent="security" />
          </div>
        ) : null}

        <WorldChapterHeader
          accent="security"
          eyebrow={world.eyebrow}
          title={dictionary.cyber.title}
        />

        <div className="mobile-compress-hide">
          <HumanAnnotation locale={locale} text={world.bridge} />
        </div>

        <p className={`mobile-compress-only mt-4 max-w-xl ${paragraphClass}`}>
          {mobile.security.statement}
        </p>

        <div className={`mt-8 ${composition.securityGrid}`}>
          <div>
            <div className="mobile-compress-hide space-y-3">
              {world.intro.map((paragraph) => (
                <p key={paragraph} className={`max-w-xl ${paragraphClass}`}>
                  {paragraph}
                </p>
              ))}
            </div>

            <ProjectTechStack
              projectId="cybersecurity-lab"
              locale={locale}
              dictionary={dictionary}
              compact
              maxItems={8}
              expandable
              mobileInitialCount={4}
              expandLabel={mobile.disclosure.showFullStack}
              collapseLabel={mobile.disclosure.showLess}
            />

            <MobileProcessSteps
              locale={locale}
              steps={learningSteps}
              className="mobile-compress-only"
            />

            <Link
              href={`${base}/projects/${cybersecurityLab.slug}`}
              className="mobile-primary-cta mobile-compress-only mt-6 inline-flex min-h-12 items-center rounded-full border border-line px-6 text-sm font-medium text-soft transition-colors hover:border-electric"
            >
              {dictionary.projectPages.openCaseStudy}
            </Link>

            <JourneyRail
              world="security"
              layout="discipline-vertical"
              ariaLabel={world.stagesTitle}
              className="mobile-compress-hide mt-10"
              spineAnchor="discipline"
            >
              <JourneyRailSummary text={world.diagramSummary} />
              <h3 className="mb-4 text-sm font-semibold text-[var(--accent-secure)]">
                {world.stagesTitle}
              </h3>
              <JourneyRailTrack>
                {world.stages.map((stage) => (
                  <JourneyRailNode
                    key={stage.number}
                    number={stage.number}
                    title={stage.title}
                    description={stage.description}
                    titleDir="auto"
                  />
                ))}
              </JourneyRailTrack>
            </JourneyRail>

            <Link
              href={`${base}/projects/${cybersecurityLab.slug}`}
              className="mobile-primary-cta mobile-compress-hide mt-8 inline-flex min-h-12 items-center rounded-full border border-line px-6 text-sm font-medium text-soft transition-colors hover:border-electric"
            >
              {dictionary.projectPages.openCaseStudy}
            </Link>
          </div>

          <aside className="security-framework space-y-10">
            <MobileDisclosure
              className="mobile-compress-only"
              label={mobile.disclosure.moreDetails}
              labelExpanded={mobile.disclosure.showLess}
            >
              <HumanAnnotation locale={locale} text={world.bridge} />
              {world.intro.map((paragraph) => (
                <p key={paragraph} className={`mt-3 max-w-xl ${paragraphClass}`}>
                  {paragraph}
                </p>
              ))}
              <h3 className="mt-6 text-sm font-semibold text-[var(--accent-secure)]">
                {world.principlesTitle}
              </h3>
              <ul className="mt-3 space-y-2">
                {world.principles.map((principle) => (
                  <li key={principle} className="text-sm text-mist">
                    {principle}
                  </li>
                ))}
              </ul>
            </MobileDisclosure>

            <JourneyRail
              world="security"
              layout="discipline-vertical"
              ariaLabel={world.principlesTitle}
              spineAnchor="principles"
              className="mobile-compress-hide"
            >
              <h3 className="text-sm font-semibold text-[var(--accent-secure)]">
                {world.principlesTitle}
              </h3>
              <JourneyRailTrack className="mt-4">
                {world.principles.map((principle) => (
                  <JourneyRailNode key={principle} title={principle} titleDir="auto" />
                ))}
              </JourneyRailTrack>
            </JourneyRail>

            <JourneyRailBranch>
              <div className="security-framework__branch border-s-2 border-dashed border-[color-mix(in_srgb,var(--accent-secure)_30%,var(--color-line))] ps-5">
                <p className="text-xs font-medium text-[var(--accent-secure)]">
                  {world.alexLinuxBranchLabel}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-soft">{world.alexLinuxTitle}</h3>
                <p className={`mt-2 ${stageClass}`}>{world.alexLinuxDescription}</p>
              </div>
            </JourneyRailBranch>

            <p
              className={`security-legal-note border-s-2 border-[color-mix(in_srgb,var(--accent-secure)_35%,var(--color-line))] ps-4 ${stageClass} text-soft`}
            >
              {dictionary.cyber.legal}
            </p>
          </aside>
        </div>
      </JourneyComposition>
    </JourneyShell>
  );
}
