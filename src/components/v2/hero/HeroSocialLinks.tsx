"use client";

import { useState } from "react";
import type { Dictionary } from "@/content/translations";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { getSocialLinks, HERO_SOCIAL_ORDER } from "@/lib/social/social-links";
import { SocialIcon } from "@/components/v2/hero/SocialIcon";

interface HeroSocialLinksProps {
  dictionary: Dictionary;
}

/** Compact glass social pills — mobile shows 4 initially with expand. */
export function HeroSocialLinks({ dictionary }: HeroSocialLinksProps) {
  const links = getSocialLinks(dictionary, HERO_SOCIAL_ORDER);
  const [expanded, setExpanded] = useState(false);
  const mobile = dictionary.homeV2.mobile;

  if (links.length === 0) {
    return null;
  }

  return (
    <nav
      className={`hero-social-links ${expanded ? "is-expanded" : ""}`}
      aria-label={dictionary.footer.connectTitle}
    >
      <ul className="hero-social-links__list">
        {links.map((link) => (
          <li key={link.key}>
            {link.external ? (
              <ExternalLink
                href={link.href}
                opensInNewTabLabel={dictionary.a11y.opensInNewTab}
                className="hero-social-pill"
              >
                <SocialIcon name={link.key} />
                <span>{link.label}</span>
              </ExternalLink>
            ) : (
              <a href={link.href} className="hero-social-pill">
                <SocialIcon name={link.key} />
                <span>{link.label}</span>
              </a>
            )}
          </li>
        ))}
      </ul>
      {links.length > 4 ? (
        <button
          type="button"
          className="hero-social-links__more lg:hidden"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? mobile.disclosure.showLess : mobile.disclosure.showMoreSocial}
        </button>
      ) : null}
    </nav>
  );
}
