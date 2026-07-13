import type { Locale } from "@/lib/i18n/config";
import { bodyTextClass } from "@/lib/i18n/locale-classes";
import type { Dictionary } from "@/content/translations";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { composition, v2Spacing } from "@/lib/layout/v2-composition";
import { JourneyShell } from "@/components/v2/JourneyShell";
import { getSocialLinks, CONTACT_SOCIAL_ORDER } from "@/lib/social/social-links";

interface ContactV2SectionProps {
  locale: Locale;
  dictionary: Dictionary;
}

/** Contact — final journey resolution (Phase 7.3B.6). */
export function ContactV2Section({ locale, dictionary }: ContactV2SectionProps) {
  const introClass = bodyTextClass(locale);
  const mobile = dictionary.homeV2.mobile;
  const links = getSocialLinks(dictionary, CONTACT_SOCIAL_ORDER);

  return (
    <JourneyShell
      id="contact"
      spine="converge"
      atmosphere="core"
      spineWaypoint="contact"
      chapterLabel={dictionary.contact.resolutionLabel}
      className="border-t border-line/50"
    >
      <div className={`${composition.inner} ${v2Spacing.contact}`}>
        <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {dictionary.contact.ctaTitle}
        </h2>
        <p className="mt-3 text-xl text-mist">{dictionary.contact.ctaSubtitle}</p>
        <p className={`mobile-compress-hide mt-5 max-w-xl ${introClass}`}>
          {dictionary.contact.intro}
        </p>
        <p className={`mobile-compress-only mt-4 max-w-xl ${introClass}`}>{mobile.contact.intro}</p>

        <div className="contact-resolution" data-rail-motion-root>
          <span
            aria-hidden
            className="contact-resolution__stem mobile-compress-hide"
            data-rail-line
          />
          <p className="contact-resolution__label mobile-compress-hide" data-rail-node>
            {dictionary.contact.resolutionLabel}
          </p>
          <ul className="mt-5 flex flex-wrap gap-3" data-rail-node="social-group">
            {links.map((link) => (
              <li key={link.key}>
                {link.external ? (
                  <ExternalLink
                    href={link.href}
                    opensInNewTabLabel={dictionary.a11y.opensInNewTab}
                    className="inline-flex min-h-12 items-center rounded-full border border-line px-6 text-sm font-medium text-soft transition-colors hover:border-electric"
                  >
                    {link.label}
                  </ExternalLink>
                ) : (
                  <a
                    href={link.href}
                    className="inline-flex min-h-12 items-center rounded-full border border-line px-6 text-sm font-medium text-soft transition-colors hover:border-electric"
                  >
                    {link.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </JourneyShell>
  );
}
