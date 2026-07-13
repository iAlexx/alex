import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { mutedLabelClass } from "@/lib/i18n/locale-classes";
import type { Dictionary } from "@/content/translations";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { sectionSpacing } from "@/lib/layout/section-spacing";
import { getSocialLinks, FOOTER_SOCIAL_ORDER } from "@/lib/social/social-links";

interface SiteFooterProps {
  locale: Locale;
  dictionary: Dictionary;
}

export function SiteFooter({ locale, dictionary }: SiteFooterProps) {
  const base = `/${locale}`;
  const headingClass = mutedLabelClass(locale);
  const navLinks = [
    { href: `${base}/projects`, label: dictionary.nav.projects },
    { href: `${base}#future`, label: dictionary.nav.lab },
    { href: `${base}#world-security`, label: dictionary.nav.cybersecurity },
    { href: `${base}#contact`, label: dictionary.nav.contact },
  ];
  const socialLinks = getSocialLinks(dictionary, FOOTER_SOCIAL_ORDER);

  return (
    <footer className="border-t border-line bg-navy/40">
      <div
        className={`mx-auto grid max-w-6xl gap-8 px-6 sm:grid-cols-2 lg:grid-cols-3 ${sectionSpacing.footer}`}
      >
        <div className="max-w-sm">
          <p className="text-lg font-semibold">
            {dictionary.hero.name}
            <span aria-hidden className="text-electric">
              .
            </span>
          </p>
          <p className="mt-3 text-sm text-mist">{dictionary.hero.headline}</p>
          <p className="mt-4 text-sm text-mist">
            {dictionary.footer.locationLabel}{" "}
            <span className="text-soft">{dictionary.footer.locationValue}</span>
          </p>
        </div>

        <nav aria-label={dictionary.footer.navigationTitle}>
          <h2 className={headingClass}>{dictionary.footer.navigationTitle}</h2>
          <ul className="mt-4 space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-11 items-center py-1 text-sm text-mist transition-colors hover:text-soft"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className={headingClass}>{dictionary.footer.connectTitle}</h2>
          <ul className="mt-4 space-y-2">
            {socialLinks.map((link) => (
              <li key={link.key}>
                {link.external ? (
                  <ExternalLink
                    href={link.href}
                    opensInNewTabLabel={dictionary.a11y.opensInNewTab}
                    className="inline-block min-h-11 py-1 text-sm text-mist transition-colors hover:text-soft"
                  >
                    {link.label}
                  </ExternalLink>
                ) : (
                  <a
                    href={link.href}
                    className="inline-block min-h-11 py-1 text-sm text-mist transition-colors hover:text-soft"
                  >
                    {link.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
