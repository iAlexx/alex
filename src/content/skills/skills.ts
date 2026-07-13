import type { Locale } from "@/lib/i18n/config";

/**
 * Skills grouped by domain (roadmap homepage section 8), bilingual.
 * `highlights` marks the skills given stronger visual weight in the UI —
 * never attach percentages or proficiency bars to any of these.
 */
export interface SkillGroup {
  id: string;
  title: Record<Locale, string>;
  highlights: Record<Locale, string[]>;
  skills: Record<Locale, string[]>;
}

export const skillGroups: SkillGroup[] = [
  {
    id: "product-business",
    title: { en: "Product & Business", ar: "المنتج والأعمال" },
    highlights: {
      en: ["Product architecture", "Brand development", "Digital product strategy"],
      ar: ["هندسة المنتجات", "تطوير العلامات التجارية", "استراتيجية المنتجات الرقمية"],
    },
    skills: {
      en: [
        "Product planning",
        "Requirements analysis",
        "Business workflow design",
        "System decomposition",
        "E-commerce",
        "User experience decisions",
      ],
      ar: [
        "تخطيط المنتجات",
        "تحليل المتطلبات",
        "تصميم سير عمل الأعمال",
        "تفكيك الأنظمة",
        "التجارة الإلكترونية",
        "قرارات تجربة المستخدم",
      ],
    },
  },
  {
    id: "software-development",
    title: { en: "Software Development", ar: "تطوير البرمجيات" },
    highlights: {
      en: ["Next.js", "TypeScript", "Python"],
      ar: ["Next.js", "TypeScript", "Python"],
    },
    skills: {
      en: [
        "React",
        "JavaScript",
        "Tailwind CSS",
        "FastAPI",
        "REST APIs",
        "SQLite",
        "Git",
        "GitHub",
      ],
      ar: [
        "React",
        "JavaScript",
        "Tailwind CSS",
        "FastAPI",
        "REST APIs",
        "SQLite",
        "Git",
        "GitHub",
      ],
    },
  },
  {
    id: "ai-automation",
    title: { en: "AI & Automation", ar: "الذكاء الاصطناعي والأتمتة" },
    highlights: {
      en: ["Prompt design", "Local LLM integration", "Workflow orchestration"],
      ar: ["تصميم الموجهات", "تكامل النماذج اللغوية المحلية", "تنسيق سير العمل"],
    },
    skills: {
      en: [
        "Context engineering",
        "AI-assisted development",
        "Ollama",
        "AI memory systems",
        "Tool-enabled AI",
        "n8n",
        "API automation",
      ],
      ar: [
        "هندسة السياق",
        "التطوير المدعوم بالذكاء الاصطناعي",
        "Ollama",
        "أنظمة ذاكرة الذكاء الاصطناعي",
        "ذكاء اصطناعي مزوّد بالأدوات",
        "n8n",
        "أتمتة الواجهات البرمجية",
      ],
    },
  },
  {
    id: "cybersecurity",
    title: { en: "Cybersecurity", ar: "الأمن السيبراني" },
    highlights: {
      en: ["Vulnerability assessment", "Red Team learning path", "Technical reporting"],
      ar: ["تقييم الثغرات", "مسار الفريق الأحمر", "التقارير التقنية"],
    },
    skills: {
      en: [
        "Networking",
        "Linux",
        "Web fundamentals",
        "API fundamentals",
        "Security fundamentals",
        "Authorized testing methodology",
      ],
      ar: [
        "الشبكات",
        "لينكس",
        "أساسيات الويب",
        "أساسيات الواجهات البرمجية",
        "أساسيات الأمن",
        "منهجية اختبار مصرّح بها",
      ],
    },
  },
  {
    id: "technical-operations",
    title: { en: "Technical Operations", ar: "العمليات التقنية" },
    highlights: {
      en: ["Technical problem-solving", "Development environment setup"],
      ar: ["حل المشكلات التقنية", "تجهيز بيئات التطوير"],
    },
    skills: {
      en: [
        "Windows environments",
        "Linux environments",
        "Network troubleshooting",
        "Hardware and software diagnosis",
        "Local deployment",
      ],
      ar: [
        "بيئات ويندوز",
        "بيئات لينكس",
        "استكشاف أخطاء الشبكات",
        "تشخيص العتاد والبرمجيات",
        "النشر المحلي",
      ],
    },
  },
];
