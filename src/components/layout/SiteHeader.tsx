import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/content/translations";
import { LanguageSwitcher } from "@/components/navigation/LanguageSwitcher";
import { MobileNavigation, type NavLink } from "@/components/navigation/MobileNavigation";
import { ScrollProgressLine } from "@/components/v2/ScrollProgressLine";

interface SiteHeaderProps {
  locale: Locale;
  dictionary: Dictionary;
}

export function SiteHeader({ locale, dictionary }: SiteHeaderProps) {
  const base = `/${locale}`;
  const links: NavLink[] = [
    { href: `${base}/projects`, label: dictionary.nav.projects },
    { href: `${base}#future`, label: dictionary.homeV2.hero.enterFuture },
    { href: `${base}#world-security`, label: dictionary.nav.cybersecurity },
    { href: `${base}#contact`, label: dictionary.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-line/40 bg-obsidian/92 backdrop-blur-sm">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-electric focus:px-4 focus:py-2 focus:text-obsidian"
      >
        {dictionary.a11y.skipToContent}
      </a>
      <div className="relative mx-auto flex h-16 max-w-[min(100%,72rem)] items-center justify-between gap-4 px-6 lg:px-8">
        <Link href={base} className="text-lg font-semibold tracking-tight">
          {dictionary.hero.name}
          <span aria-hidden className="text-electric">
            .
          </span>
        </Link>

        <nav
          aria-label={dictionary.a11y.mainNavigation}
          className="hidden items-center gap-4 md:flex"
        >
          <ul className="flex items-center gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-sm text-mist transition-colors hover:text-soft"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher
            locale={locale}
            label={dictionary.common.languageSwitcherLabel}
            ariaLabel={dictionary.a11y.switchLanguage}
          />
          <MobileNavigation
            links={links}
            openLabel={dictionary.a11y.openMenu}
            closeLabel={dictionary.a11y.closeMenu}
            navLabel={dictionary.a11y.mainNavigation}
          />
        </div>
        <ScrollProgressLine />
      </div>
    </header>
  );
}
