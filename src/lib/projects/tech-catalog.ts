import type { ProjectTechnology } from "@/lib/projects/tech-types";

/** Shared technology definitions — single source of truth for badges. */
export const TECHNOLOGY_CATALOG = {
  nextjs: {
    id: "nextjs",
    label: "Next.js",
    category: "framework",
    iconKey: "nextjs",
    url: "https://nextjs.org",
    verifiedBy: [
      "src/content/projects/restaurant-platform.ts",
      "C:/Users/Master aLEX/Desktop/GYMURA/package.json",
      "C:/Users/Master aLEX/Desktop/api texas/package.json",
    ],
  },
  react: {
    id: "react",
    label: "React",
    category: "library",
    iconKey: "react",
    url: "https://react.dev",
    verifiedBy: [
      "src/content/projects/restaurant-platform.ts",
      "C:/Users/Master aLEX/Desktop/GYMURA/package.json",
      "C:/Users/Master aLEX/Desktop/api texas/package.json",
    ],
  },
  typescript: {
    id: "typescript",
    label: "TypeScript",
    category: "language",
    iconKey: "typescript",
    url: "https://www.typescriptlang.org",
    verifiedBy: [
      "src/content/projects/restaurant-platform.ts",
      "src/content/projects/alexa-ai.ts",
      "C:/Users/Master aLEX/Desktop/GYMURA/package.json",
      "C:/Users/Master aLEX/Desktop/GYMURA/tsconfig.json",
      "C:/Users/Master aLEX/Desktop/api texas/package.json",
      "C:/Users/Master aLEX/Desktop/api texas/tsconfig.json",
    ],
  },
  "tailwind-css": {
    id: "tailwind-css",
    label: "Tailwind CSS",
    category: "library",
    iconKey: "tailwindcss",
    url: "https://tailwindcss.com",
    verifiedBy: [
      "src/content/projects/restaurant-platform.ts",
      "C:/Users/Master aLEX/Desktop/GYMURA/package.json",
      "C:/Users/Master aLEX/Desktop/api texas/package.json",
    ],
  },
  "rest-apis": {
    id: "rest-apis",
    label: "REST APIs",
    category: "protocol",
    iconKey: "api",
    verifiedBy: [
      "src/content/projects/restaurant-platform.ts",
      "src/content/translations/en.ts projectFacts.restaurant-platform",
    ],
  },
  fastapi: {
    id: "fastapi",
    label: "FastAPI",
    category: "framework",
    iconKey: "fastapi",
    url: "https://fastapi.tiangolo.com",
    verifiedBy: [
      "src/content/projects/alexa-ai.ts",
      "src/content/translations/en.ts caseStudies.alexa-ai sections Architecture",
    ],
  },
  ollama: {
    id: "ollama",
    label: "Ollama",
    category: "platform",
    iconKey: "ollama",
    url: "https://ollama.com",
    verifiedBy: [
      "src/content/projects/alexa-ai.ts",
      "src/content/translations/en.ts caseStudies.alexa-ai",
      "src/content/translations/en.ts homeV2.worlds.intelligence",
    ],
  },
  "local-llms": {
    id: "local-llms",
    label: "Local LLMs",
    category: "ai",
    iconKey: "brain",
    verifiedBy: [
      "src/content/projects/alexa-ai.ts",
      "src/content/translations/en.ts projectFacts.alexa-ai",
    ],
  },
  sqlite: {
    id: "sqlite",
    label: "SQLite",
    category: "database",
    iconKey: "database",
    url: "https://www.sqlite.org",
    verifiedBy: [
      "src/content/projects/alexa-ai.ts",
      "src/content/translations/en.ts caseStudies.alexa-ai sections Memory System",
    ],
  },
  chromadb: {
    id: "chromadb",
    label: "ChromaDB",
    category: "database",
    iconKey: "chromadb",
    url: "https://www.trychroma.com",
    verifiedBy: [
      "src/content/projects/alexa-ai.ts",
      "src/content/translations/en.ts caseStudies.alexa-ai sections Memory System",
    ],
  },
  n8n: {
    id: "n8n",
    label: "n8n",
    category: "platform",
    iconKey: "n8n",
    url: "https://n8n.io",
    verifiedBy: [
      "src/content/projects/automation-lab.ts",
      "src/content/translations/en.ts projectFacts.automation-lab",
      "src/content/translations/en.ts homeV2.worlds.intelligence.architecture.automation",
    ],
  },
  "api-integrations": {
    id: "api-integrations",
    label: "API Integrations",
    category: "tool",
    iconKey: "api",
    verifiedBy: [
      "src/content/projects/automation-lab.ts",
      "src/content/translations/en.ts projectFacts.automation-lab",
    ],
  },
  "ai-workflows": {
    id: "ai-workflows",
    label: "AI Workflows",
    category: "ai",
    iconKey: "workflow",
    verifiedBy: [
      "src/content/projects/automation-lab.ts",
      "src/content/translations/en.ts projectFacts.automation-lab",
    ],
  },
  "telegram-bot-api": {
    id: "telegram-bot-api",
    label: "Telegram Bot API",
    category: "platform",
    iconKey: "telegram",
    url: "https://core.telegram.org/bots/api",
    verifiedBy: [
      "C:/Users/Master aLEX/Desktop/api texas/src/lib/telegram/bot-api.ts",
      "C:/Users/Master aLEX/Desktop/api texas/src/app/api/telegram/webhook/route.ts",
      "C:/Users/Master aLEX/Desktop/api texas/README.md",
    ],
  },
  linux: {
    id: "linux",
    label: "Linux",
    category: "platform",
    iconKey: "linux",
    verifiedBy: [
      "src/content/projects/cybersecurity-lab.ts",
      "src/content/projects/alex-linux.ts",
      "src/content/translations/en.ts projectFacts",
    ],
  },
  python: {
    id: "python",
    label: "Python",
    category: "language",
    iconKey: "python",
    url: "https://www.python.org",
    verifiedBy: [
      "src/content/projects/cybersecurity-lab.ts",
      "src/content/translations/en.ts projectFacts.cybersecurity-lab",
      "src/content/translations/en.ts caseStudies.cybersecurity-lab",
    ],
  },
  networking: {
    id: "networking",
    label: "Networking",
    category: "tool",
    iconKey: "network",
    verifiedBy: [
      "src/content/projects/cybersecurity-lab.ts",
      "src/content/translations/en.ts projectFacts.cybersecurity-lab",
    ],
  },
  "web-technologies": {
    id: "web-technologies",
    label: "Web Technologies",
    category: "tool",
    iconKey: "web",
    verifiedBy: [
      "src/content/projects/cybersecurity-lab.ts",
      "src/content/translations/en.ts projectFacts.cybersecurity-lab",
    ],
  },
  "web-security": {
    id: "web-security",
    label: "Web Security",
    category: "security",
    iconKey: "shield",
    verifiedBy: [
      "src/content/projects/cybersecurity-lab.ts capabilities",
      "src/content/translations/en.ts projectFacts.cybersecurity-lab",
    ],
  },
  "api-security": {
    id: "api-security",
    label: "API Security",
    category: "security",
    iconKey: "shield",
    verifiedBy: [
      "src/content/projects/cybersecurity-lab.ts capabilities",
      "src/content/translations/en.ts projectFacts.cybersecurity-lab",
    ],
  },
  "active-directory": {
    id: "active-directory",
    label: "Active Directory",
    category: "platform",
    iconKey: "directory",
    verifiedBy: [
      "src/content/projects/cybersecurity-lab.ts capabilities",
      "src/content/translations/en.ts homeV2.worlds.security.stages",
    ],
  },
  "red-team": {
    id: "red-team",
    label: "Red Team Methodology",
    category: "security",
    iconKey: "target",
    verifiedBy: [
      "src/content/projects/cybersecurity-lab.ts capabilities",
      "src/content/translations/en.ts caseStudies.cybersecurity-lab",
    ],
  },
  "vulnerability-assessment": {
    id: "vulnerability-assessment",
    label: "Vulnerability Assessment",
    category: "security",
    iconKey: "scan",
    verifiedBy: [
      "src/content/projects/cybersecurity-lab.ts capabilities",
      "src/content/translations/en.ts projectFacts.cybersecurity-lab",
    ],
  },
  supabase: {
    id: "supabase",
    label: "Supabase",
    category: "platform",
    iconKey: "supabase",
    url: "https://supabase.com",
    verifiedBy: [
      "C:/Users/Master aLEX/Desktop/GYMURA/package.json",
      "C:/Users/Master aLEX/Desktop/GYMURA/src/lib/supabase/server.ts",
      "C:/Users/Master aLEX/Desktop/api texas/package.json",
      "C:/Users/Master aLEX/Desktop/api texas/README.md",
    ],
  },
  postgresql: {
    id: "postgresql",
    label: "PostgreSQL",
    category: "database",
    iconKey: "postgresql",
    url: "https://www.postgresql.org",
    verifiedBy: [
      "C:/Users/Master aLEX/Desktop/GYMURA/supabase/schema.sql",
      "C:/Users/Master aLEX/Desktop/GYMURA/ARCHITECT_MAP.md",
      "C:/Users/Master aLEX/Desktop/api texas/README.md",
      "C:/Users/Master aLEX/Desktop/api texas/supabase/migrations/",
    ],
  },
  vercel: {
    id: "vercel",
    label: "Vercel",
    category: "deployment",
    iconKey: "vercel",
    url: "https://vercel.com",
    verifiedBy: [
      "C:/Users/Master aLEX/Desktop/GYMURA/DEPLOYMENT.md",
      "C:/Users/Master aLEX/Desktop/GYMURA/src/lib/seo/site.ts",
    ],
  },
  railway: {
    id: "railway",
    label: "Railway",
    category: "deployment",
    iconKey: "railway",
    url: "https://railway.app",
    verifiedBy: [
      "C:/Users/Master aLEX/Desktop/api texas/railway.toml",
      "C:/Users/Master aLEX/Desktop/api texas/README.md",
      "C:/Users/Master aLEX/Desktop/api texas/.env.example",
    ],
  },
  zod: {
    id: "zod",
    label: "Zod",
    category: "library",
    iconKey: "zod",
    url: "https://zod.dev",
    verifiedBy: [
      "C:/Users/Master aLEX/Desktop/GYMURA/package.json",
      "C:/Users/Master aLEX/Desktop/GYMURA/src/lib/validation/schemas.ts",
      "C:/Users/Master aLEX/Desktop/api texas/package.json",
    ],
  },
  zustand: {
    id: "zustand",
    label: "Zustand",
    category: "library",
    iconKey: "zustand",
    url: "https://zustand.docs.pmnd.rs",
    verifiedBy: [
      "C:/Users/Master aLEX/Desktop/GYMURA/package.json",
      "C:/Users/Master aLEX/Desktop/GYMURA/src/lib/store/useCart.ts",
    ],
  },
  resend: {
    id: "resend",
    label: "Resend",
    category: "platform",
    iconKey: "resend",
    url: "https://resend.com",
    verifiedBy: [
      "C:/Users/Master aLEX/Desktop/GYMURA/package.json",
      "C:/Users/Master aLEX/Desktop/GYMURA/src/app/api/admin/generate-report/route.ts",
    ],
  },
  webhooks: {
    id: "webhooks",
    label: "Webhooks",
    category: "protocol",
    iconKey: "webhook",
    verifiedBy: [
      "C:/Users/Master aLEX/Desktop/api texas/src/app/api/telegram/webhook/route.ts",
      "C:/Users/Master aLEX/Desktop/api texas/.env.example",
      "C:/Users/Master aLEX/Desktop/api texas/README.md",
    ],
  },
  gramjs: {
    id: "gramjs",
    label: "GramJS",
    category: "library",
    iconKey: "gramjs",
    url: "https://gram.js.org",
    verifiedBy: [
      "C:/Users/Master aLEX/Desktop/api texas/package.json",
      "C:/Users/Master aLEX/Desktop/api texas/src/lib/telegram/userbot-client.ts",
    ],
  },
  puppeteer: {
    id: "puppeteer",
    label: "Puppeteer",
    category: "tool",
    iconKey: "puppeteer",
    url: "https://pptr.dev",
    verifiedBy: [
      "C:/Users/Master aLEX/Desktop/api texas/package.json",
      "C:/Users/Master aLEX/Desktop/api texas/src/lib/report/report-screenshot.ts",
      "C:/Users/Master aLEX/Desktop/api texas/README.md",
    ],
  },
  sentry: {
    id: "sentry",
    label: "Sentry",
    category: "tool",
    iconKey: "sentry",
    url: "https://sentry.io",
    verifiedBy: [
      "C:/Users/Master aLEX/Desktop/api texas/package.json",
      "C:/Users/Master aLEX/Desktop/api texas/src/instrumentation.ts",
    ],
  },
} as const satisfies Record<string, ProjectTechnology>;

export type TechnologyId = keyof typeof TECHNOLOGY_CATALOG;

export function getTechnology(id: TechnologyId): ProjectTechnology {
  return TECHNOLOGY_CATALOG[id];
}

export function resolveTechnologies(ids: readonly TechnologyId[]): ProjectTechnology[] {
  return ids.map((id) => TECHNOLOGY_CATALOG[id]);
}
