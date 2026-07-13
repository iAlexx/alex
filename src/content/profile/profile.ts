/**
 * Central profile configuration — single source of truth for all personal data.
 * Every page and component must read from this object. Never hardcode these
 * values elsewhere. (Roadmap section 14.)
 */
export const profile = {
  professionalName: "Alex",
  location: "Damascus",
  languages: [
    { name: "Arabic", level: "Native" },
    { name: "English", level: "Working proficiency" },
  ],
  headline: "Product Builder · Full-Stack Developer · AI Systems & Automation · Cybersecurity",
  heroStatement: "I build brands, software, and intelligent systems.",
  signature: "Building my own empire, one idea at a time.",
  /** Professional contact email — UI shows mailto actions only when set. */
  email: "y720183@gmail.com" as string | null,
  links: {
    github: "https://github.com/iAlexx",
    linkedin: "https://www.linkedin.com/in/ialexx",
    instagram: "https://instagram.com/_x1c",
    telegram: "https://t.me/xdevalex",
  },
} as const;

export type Profile = typeof profile;
