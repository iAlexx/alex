import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { bodyTextClass } from "@/lib/i18n/locale-classes";
import type { Dictionary } from "@/content/translations";
import { restaurantPlatform } from "@/content/projects/restaurant-platform";
import { composition, v2Spacing } from "@/lib/layout/v2-composition";
import { JourneyShell, JourneyComposition } from "@/components/v2/JourneyShell";
import { BridgeAnnotation, HumanAnnotation } from "@/components/v2/BridgeAnnotation";
import { WorldChapterHeader } from "@/components/v2/WorldChapterHeader";
import { SystemsWorkflowBand } from "@/components/v2/SystemsWorkflowBand";
import { SystemsProofComposition } from "@/components/v2/SystemsProofComposition";
import { SystemsTexasFundsBranch } from "@/components/v2/SystemsTexasFundsBranch";
import { ProjectTechStack } from "@/components/projects/ProjectTechStack";
import { MobileDisclosure } from "@/components/mobile/MobileDisclosure";
import { MobilePreviewTeaser } from "@/components/mobile/MobilePreviewTeaser";
import { MobileProcessSteps } from "@/components/mobile/MobileProcessSteps";

interface WorldSystemsSectionProps {
  locale: Locale;
  dictionary: Dictionary;
  bridgeAnnotation?: string;
}

export function WorldSystemsSection({
  locale,
  dictionary,
  bridgeAnnotation,
}: WorldSystemsSectionProps) {
  const world = dictionary.homeV2.worlds.systems;
  const mobile = dictionary.homeV2.mobile;
  const restaurantCopy = dictionary.restaurant;
  const paragraphClass = bodyTextClass(locale);
  const base = `/${locale}`;
  const websiteUrl = restaurantPlatform.website ?? "https://alnkha.site";

  const workflowSteps = world.workflowStages.slice(0, 3).map((stage, index) => ({
    number: String(index + 1).padStart(2, "0"),
    title: stage.label,
    description: stage.hint,
  }));

  return (
    <JourneyShell
      id="world-systems"
      spine="node-systems"
      atmosphere="systems"
      continuityIn="brands-systems"
      continuityOut="systems-intelligence"
      connector="systems"
      spineWaypoint="systems"
      chapterLabel={world.eyebrow}
      className={v2Spacing.worldSystems}
    >
      <JourneyComposition className={composition.innerWide}>
        {bridgeAnnotation ? (
          <div className="mobile-compress-hide">
            <BridgeAnnotation text={bridgeAnnotation} accent="systems" />
          </div>
        ) : null}

        <div className="systems-world-composition">
          <div aria-hidden className="systems-world-composition__rail" />

          <article
            aria-label={restaurantCopy.title}
            className="systems-world-composition__platform"
          >
            <div className={composition.systemsIntro}>
              <WorldChapterHeader
                accent="systems"
                eyebrow={world.eyebrow}
                title={restaurantCopy.title}
              />
              <div className="mobile-compress-hide">
                <HumanAnnotation locale={locale} text={world.bridge} />
                <p className={`mt-4 ${paragraphClass}`}>{world.problem}</p>
              </div>
              <p className={`mobile-compress-only mt-3 max-w-xl ${paragraphClass}`}>
                {mobile.systems.statement}
              </p>
            </div>

            <ProjectTechStack
              projectId="restaurant-platform"
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
              steps={workflowSteps}
              className="mobile-compress-only"
            />

            <Link
              href={`${base}/projects/${restaurantPlatform.slug}`}
              className="mobile-compress-only mobile-primary-cta mt-4 inline-flex min-h-12 items-center rounded-full bg-electric/90 px-6 text-sm font-semibold text-obsidian transition-colors hover:bg-glow"
            >
              {restaurantCopy.caseStudy}
            </Link>

            <MobilePreviewTeaser
              websiteUrl={websiteUrl}
              title={restaurantCopy.livePreview.title}
              displayDomain={restaurantCopy.livePreview.displayDomain}
              openWebsiteLabel={restaurantCopy.livePreview.openWebsiteLabel}
              openPreviewLabel={mobile.disclosure.openLivePreview}
              visitLabel={restaurantCopy.visit ?? restaurantCopy.livePreview.openWebsiteLabel}
              labels={dictionary.livePreview}
              opensInNewTabLabel={dictionary.a11y.opensInNewTab}
              variant="compact"
            />

            <MobileDisclosure
              label={mobile.disclosure.viewProcess}
              labelExpanded={mobile.disclosure.showLess}
            >
              <HumanAnnotation locale={locale} text={world.bridge} />
              <p className={`mt-3 ${paragraphClass}`}>{world.problem}</p>
              <SystemsWorkflowBand
                title={world.workflowTitle}
                note={world.workflowNote}
                stages={world.workflowStages}
              />
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-[var(--accent-system)]">
                  {world.capabilitiesTitle}
                </h3>
                <ul className="mt-3 space-y-2">
                  {world.capabilities.map((cap) => (
                    <li key={cap} className="text-sm text-mist">
                      {cap}
                    </li>
                  ))}
                </ul>
              </div>
            </MobileDisclosure>

            <div className="mobile-compress-hide">
              <SystemsWorkflowBand
                title={world.workflowTitle}
                note={world.workflowNote}
                stages={world.workflowStages}
              />

              <SystemsProofComposition
                locale={locale}
                dictionary={dictionary}
                capabilitiesTitle={world.capabilitiesTitle}
                capabilities={world.capabilities}
              />
            </div>
          </article>

          <SystemsTexasFundsBranch
            locale={locale}
            dictionary={dictionary}
            statusLine={world.texasFundsStatusLine}
            description={world.texasFundsDescription}
            microFlow={world.texasFundsMicroFlow}
            flowSteps={world.texasFundsFlowSteps}
          />
        </div>
      </JourneyComposition>
    </JourneyShell>
  );
}
