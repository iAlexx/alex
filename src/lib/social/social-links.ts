import { profile } from "@/content/profile/profile";
import type { Dictionary } from "@/content/translations";

export type SocialLinkKey = "github" | "linkedin" | "instagram" | "email" | "telegram";

export type SocialLinkItem = {
  key: SocialLinkKey;
  href: string;
  label: string;
  external: boolean;
};

/** Hero — most relevant platforms first. */
export const HERO_SOCIAL_ORDER: SocialLinkKey[] = [
  "github",
  "linkedin",
  "instagram",
  "email",
  "telegram",
];

/** Contact resolution rail. */
export const CONTACT_SOCIAL_ORDER: SocialLinkKey[] = [
  "telegram",
  "linkedin",
  "github",
  "instagram",
  "email",
];

/** Site footer connect column. */
export const FOOTER_SOCIAL_ORDER: SocialLinkKey[] = [
  "github",
  "linkedin",
  "telegram",
  "instagram",
  "email",
];

function buildSocialLinkMap(
  dictionary: Dictionary,
): Partial<Record<SocialLinkKey, SocialLinkItem>> {
  const labels = dictionary.contact.links;
  const map: Partial<Record<SocialLinkKey, SocialLinkItem>> = {
    github: {
      key: "github",
      href: profile.links.github,
      label: labels.github,
      external: true,
    },
    linkedin: {
      key: "linkedin",
      href: profile.links.linkedin,
      label: labels.linkedin,
      external: true,
    },
    instagram: {
      key: "instagram",
      href: profile.links.instagram,
      label: labels.instagram,
      external: true,
    },
    telegram: {
      key: "telegram",
      href: profile.links.telegram,
      label: labels.telegram,
      external: true,
    },
  };

  if (profile.email) {
    map.email = {
      key: "email",
      href: `mailto:${profile.email}`,
      label: labels.email,
      external: false,
    };
  }

  return map;
}

/** Shared social links from profile — only returns links that are configured. */
export function getSocialLinks(
  dictionary: Dictionary,
  order: readonly SocialLinkKey[] = HERO_SOCIAL_ORDER,
): SocialLinkItem[] {
  const map = buildSocialLinkMap(dictionary);

  return order.map((key) => map[key]).filter((item): item is SocialLinkItem => item !== undefined);
}
