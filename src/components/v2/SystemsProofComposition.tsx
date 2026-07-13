import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { hintTextClass } from "@/lib/i18n/locale-classes";
import type { Dictionary } from "@/content/translations";
import { restaurantPlatform } from "@/content/projects/restaurant-platform";
import { composition } from "@/lib/layout/v2-composition";
import { ProjectStatusBadge } from "@/components/ui/ProjectStatusBadge";
import { DeferredLiveWebsitePreview } from "@/components/projects/DeferredLiveWebsitePreview";

interface SystemsProofCompositionProps {
  locale: Locale;
  dictionary: Dictionary;
  capabilitiesTitle: string;
  capabilities: string[];
}

/** Restaurant operational platform — preview dominant, case study outside preview. */
export function SystemsProofComposition({
  locale,
  dictionary,
  capabilitiesTitle,
  capabilities,
}: SystemsProofCompositionProps) {
  const restaurantCopy = dictionary.restaurant;
  const hintClass = hintTextClass(locale);
  const base = `/${locale}`;

  return (
    <div className={`${composition.systemsProofGrid} systems-proof-composition`}>
      <div className="systems-proof-composition__preview min-w-0">
        <DeferredLiveWebsitePreview
          websiteUrl={restaurantPlatform.website ?? "https://alnkha.site"}
          title={restaurantCopy.livePreview.title}
          displayDomain={restaurantCopy.livePreview.displayDomain}
          openWebsiteLabel={restaurantCopy.livePreview.openWebsiteLabel}
          labels={dictionary.livePreview}
          variant="compact"
          opensInNewTabLabel={dictionary.a11y.opensInNewTab}
        />
      </div>

      <div className="systems-proof-composition__details flex flex-col gap-5 lg:pt-1">
        <div className="flex flex-wrap items-center gap-3">
          <ProjectStatusBadge
            status={restaurantPlatform.status}
            label={dictionary.statusLabels[restaurantPlatform.status]}
          />
          <p className={hintClass}>
            {restaurantCopy.roleLabel}: <span className="text-soft">{restaurantCopy.role}</span>
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[var(--accent-system)]">{capabilitiesTitle}</h3>
          <ul className="mt-3 space-y-2">
            {capabilities.map((cap) => (
              <li
                key={cap}
                className={`flex items-center gap-2 ${hintClass} before:size-1.5 before:shrink-0 before:rounded-full before:bg-[var(--accent-system)] before:content-['']`}
              >
                <span dir={cap.match(/[a-zA-Z]/) ? "ltr" : undefined}>{cap}</span>
              </li>
            ))}
          </ul>
        </div>

        <Link
          href={`${base}/projects/${restaurantPlatform.slug}`}
          className="inline-flex min-h-12 w-fit items-center justify-center rounded-full bg-electric/90 px-6 text-sm font-semibold text-obsidian transition-colors hover:bg-glow"
        >
          {restaurantCopy.caseStudy}
        </Link>
      </div>
    </div>
  );
}
