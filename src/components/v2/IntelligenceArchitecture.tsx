import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { hintTextClass } from "@/lib/i18n/locale-classes";
import type { Dictionary } from "@/content/translations";
import type { IntelligenceArchNodeCopy } from "@/content/translations/types";
import { alexaAi } from "@/content/projects/alexa-ai";
import { automationLab } from "@/content/projects/automation-lab";
import { ProjectStatusBadge } from "@/components/ui/ProjectStatusBadge";
import { JourneyRail, JourneyRailSummary } from "@/components/v2/journey-rail/JourneyRail";
import { ProjectTechStack } from "@/components/projects/ProjectTechStack";
import { MobileDisclosure } from "@/components/mobile/MobileDisclosure";

interface IntelligenceArchitectureProps {
  locale: Locale;
  dictionary: Dictionary;
}

type ConnectorAnchor = "input" | "output" | "branch";

interface ArchNodeProps {
  node: IntelligenceArchNodeCopy;
  variant?: "core" | "branch" | "automation";
  anchor?: ConnectorAnchor | `${ConnectorAnchor} ${ConnectorAnchor}`;
  className?: string;
}

function ArchNode({ node, variant = "core", anchor, className = "" }: ArchNodeProps) {
  const variantClass =
    variant === "automation"
      ? "intel-arch-node--automation"
      : variant === "branch"
        ? "intel-arch-node--branch"
        : "intel-arch-node--core";

  return (
    <div
      className={`intel-arch-node ${variantClass} ${className}`.trim()}
      data-rail-node
      data-connector-anchor={anchor}
    >
      <p className="intel-arch-node__title" dir="auto">
        {node.title}
      </p>
      <ul className="intel-arch-node__items">
        {node.items.map((item) => (
          <li key={item}>
            <span dir={item.match(/[a-zA-Z0-9]/) ? "ltr" : undefined}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Unified CSS-grid intelligence architecture — Phase 7.3B.5. */
export function IntelligenceArchitecture({ locale, dictionary }: IntelligenceArchitectureProps) {
  const world = dictionary.homeV2.worlds.intelligence;
  const mobile = dictionary.homeV2.mobile;
  const arch = world.architecture;
  const diagram = world.diagram;
  const hintClass = hintTextClass(locale);
  const base = `/${locale}`;

  const coreLayers = [
    { title: arch.localModel.title, detail: arch.localModel.items[0] },
    { title: arch.memory.title, detail: arch.memory.items[0] },
    { title: arch.tools.title, detail: arch.tools.items[0] },
  ];

  return (
    <div className="intel-architecture">
      <p className="sr-only">{diagram.summary}</p>

      <div className="intel-architecture__header">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-2xl font-semibold text-soft sm:text-3xl">{world.alexaTitle}</h3>
          <ProjectStatusBadge
            status={alexaAi.status}
            label={dictionary.statusLabels[alexaAi.status]}
          />
        </div>
        <p className={`mobile-compress-hide mt-3 max-w-3xl ${hintClass}`}>
          {world.alexaDescription}
        </p>
        <p className={`mobile-compress-only mt-3 max-w-xl ${hintClass}`}>
          {mobile.intelligence.statement}
        </p>
      </div>

      <ProjectTechStack
        projectId="alexa-ai"
        locale={locale}
        dictionary={dictionary}
        compact
        maxItems={8}
        expandable
        mobileInitialCount={4}
        expandLabel={mobile.disclosure.showFullStack}
        collapseLabel={mobile.disclosure.showLess}
      />

      <div
        className="mobile-intel-layers mobile-compress-only lg:hidden"
        aria-label={diagram.summary}
      >
        {coreLayers.map((layer) => (
          <div key={layer.title} className="mobile-intel-layers__item" dir="auto">
            {layer.title}
            <span>{layer.detail}</span>
          </div>
        ))}
      </div>

      <div className="intel-architecture__actions">
        <Link
          href={`${base}/projects/${alexaAi.slug}`}
          className="mobile-primary-cta inline-flex min-h-12 items-center rounded-full bg-electric/90 px-6 text-sm font-semibold text-obsidian transition-colors hover:bg-glow"
        >
          {world.alexaCaseStudyLabel}
        </Link>
        <Link
          href={`${base}/projects/${automationLab.slug}`}
          className="mobile-compress-hide inline-flex min-h-11 items-center text-sm font-medium text-electric hover:underline"
        >
          {world.automationCaseStudyLabel}
        </Link>
      </div>

      <MobileDisclosure
        label={mobile.disclosure.showArchitecture}
        labelExpanded={mobile.disclosure.showLess}
      >
        <p className={`mt-2 max-w-3xl ${hintClass}`}>{world.alexaDescription}</p>
        <Link
          href={`${base}/projects/${automationLab.slug}`}
          className="mt-4 inline-flex min-h-11 items-center text-sm font-medium text-electric hover:underline"
        >
          {world.automationCaseStudyLabel}
        </Link>
        <JourneyRail
          world="intelligence"
          layout="architecture"
          ariaLabel={diagram.summary}
          className="mt-4"
          dir="ltr"
          spineAnchor="architecture"
        >
          <JourneyRailSummary text={diagram.summary} />

          <div className="intel-diagram" data-spine-anchor="architecture">
            <div className="intel-diagram__canvas">
              <ArchNode
                node={arch.localModel}
                anchor="output"
                className="intel-diagram__slot intel-diagram__slot--local"
              />

              <div className="intel-connector intel-connector--stack" aria-hidden>
                <span
                  className="intel-connector__line intel-connector__line--vertical"
                  data-rail-line
                />
              </div>
              <div
                className="intel-connector intel-connector--horizontal intel-connector--h1"
                aria-hidden
              >
                <span
                  className="intel-connector__line intel-connector__line--horizontal"
                  data-rail-line
                />
              </div>

              <ArchNode
                node={arch.memory}
                anchor="input output"
                className="intel-diagram__slot intel-diagram__slot--memory"
              />

              <div className="intel-connector intel-connector--stack" aria-hidden>
                <span
                  className="intel-connector__line intel-connector__line--vertical"
                  data-rail-line
                />
              </div>
              <div
                className="intel-connector intel-connector--horizontal intel-connector--h2"
                aria-hidden
              >
                <span
                  className="intel-connector__line intel-connector__line--horizontal"
                  data-rail-line
                />
              </div>

              <ArchNode
                node={arch.tools}
                anchor="branch"
                className="intel-diagram__slot intel-diagram__slot--tools"
              />

              <div className="intel-connector intel-connector--stack" aria-hidden>
                <span
                  className="intel-connector__line intel-connector__line--vertical"
                  data-rail-line
                />
              </div>
              <div className="intel-connector intel-connector--tools-drop" aria-hidden>
                <span
                  className="intel-connector__line intel-connector__line--vertical"
                  data-rail-line
                />
              </div>

              <div className="intel-connector intel-connector--fork" aria-hidden>
                <div className="intel-fork">
                  <span className="intel-fork__rail" data-rail-line />
                  <span className="intel-fork__stem intel-fork__stem--left" data-rail-line />
                  <span className="intel-fork__stem intel-fork__stem--right" data-rail-line />
                </div>
              </div>

              <div className="intel-diagram__branch-row">
                <ArchNode
                  node={arch.localTools}
                  variant="branch"
                  anchor="input"
                  className="intel-diagram__slot intel-diagram__slot--local-tools"
                />
                <div
                  className="intel-connector intel-connector--stack intel-connector--stack-branch"
                  aria-hidden
                >
                  <span
                    className="intel-connector__line intel-connector__line--vertical"
                    data-rail-line
                  />
                </div>
                <div className="intel-diagram__slot intel-diagram__slot--automation">
                  <ArchNode node={arch.automation} variant="automation" anchor="input" />
                  <div className="intel-diagram__automation-meta">
                    <ProjectStatusBadge
                      status={automationLab.status}
                      label={dictionary.statusLabels[automationLab.status]}
                    />
                    <span className="text-xs text-mist">{world.connectedLabel}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </JourneyRail>
      </MobileDisclosure>

      <div className="mobile-compress-hide">
        <JourneyRail
          world="intelligence"
          layout="architecture"
          ariaLabel={diagram.summary}
          className="mt-4"
          dir="ltr"
          spineAnchor="architecture"
        >
          <JourneyRailSummary text={diagram.summary} />

          <div className="intel-diagram" data-spine-anchor="architecture">
            <div className="intel-diagram__canvas">
              <ArchNode
                node={arch.localModel}
                anchor="output"
                className="intel-diagram__slot intel-diagram__slot--local"
              />

              <div className="intel-connector intel-connector--stack" aria-hidden>
                <span
                  className="intel-connector__line intel-connector__line--vertical"
                  data-rail-line
                />
              </div>
              <div
                className="intel-connector intel-connector--horizontal intel-connector--h1"
                aria-hidden
              >
                <span
                  className="intel-connector__line intel-connector__line--horizontal"
                  data-rail-line
                />
              </div>

              <ArchNode
                node={arch.memory}
                anchor="input output"
                className="intel-diagram__slot intel-diagram__slot--memory"
              />

              <div className="intel-connector intel-connector--stack" aria-hidden>
                <span
                  className="intel-connector__line intel-connector__line--vertical"
                  data-rail-line
                />
              </div>
              <div
                className="intel-connector intel-connector--horizontal intel-connector--h2"
                aria-hidden
              >
                <span
                  className="intel-connector__line intel-connector__line--horizontal"
                  data-rail-line
                />
              </div>

              <ArchNode
                node={arch.tools}
                anchor="branch"
                className="intel-diagram__slot intel-diagram__slot--tools"
              />

              <div className="intel-connector intel-connector--stack" aria-hidden>
                <span
                  className="intel-connector__line intel-connector__line--vertical"
                  data-rail-line
                />
              </div>
              <div className="intel-connector intel-connector--tools-drop" aria-hidden>
                <span
                  className="intel-connector__line intel-connector__line--vertical"
                  data-rail-line
                />
              </div>

              <div className="intel-connector intel-connector--fork" aria-hidden>
                <div className="intel-fork">
                  <span className="intel-fork__rail" data-rail-line />
                  <span className="intel-fork__stem intel-fork__stem--left" data-rail-line />
                  <span className="intel-fork__stem intel-fork__stem--right" data-rail-line />
                </div>
              </div>

              <div className="intel-diagram__branch-row">
                <ArchNode
                  node={arch.localTools}
                  variant="branch"
                  anchor="input"
                  className="intel-diagram__slot intel-diagram__slot--local-tools"
                />
                <div
                  className="intel-connector intel-connector--stack intel-connector--stack-branch"
                  aria-hidden
                >
                  <span
                    className="intel-connector__line intel-connector__line--vertical"
                    data-rail-line
                  />
                </div>
                <div className="intel-diagram__slot intel-diagram__slot--automation">
                  <ArchNode node={arch.automation} variant="automation" anchor="input" />
                  <div className="intel-diagram__automation-meta">
                    <ProjectStatusBadge
                      status={automationLab.status}
                      label={dictionary.statusLabels[automationLab.status]}
                    />
                    <span className="text-xs text-mist">{world.connectedLabel}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </JourneyRail>
      </div>
    </div>
  );
}
