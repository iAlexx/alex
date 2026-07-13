import type { ProjectSlug, ProjectStatus } from "@/content/projects/types";

export interface CaseStudySectionCopy {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface CaseStudyCopy {
  /** Eyebrow label above the title, e.g. "Flagship Brand & E-commerce Project". */
  label: string;
  title: string;
  subtitle: string;
  /** Overview paragraphs rendered directly under the hero. */
  intro: string[];
  /** Ordered long-form sections of the case study. */
  sections: CaseStudySectionCopy[];
  /** Localized label for the primary external action; omit when no website exists. */
  visitLabel?: string;
  /** Live website preview config — only for projects with a public entry point. */
  livePreview?: {
    /** Accessible iframe title and section heading. */
    title: string;
    displayDomain: string;
    openWebsiteLabel: string;
    /** Optional static screenshot path for future fallback when embedding is blocked. */
    screenshotFallback?: string;
  };
}

export interface WorkflowStageCopy {
  id: string;
  label: string;
  hint?: string;
}

export interface EcosystemCategoryCopy {
  title: string;
  items: string[];
}

export interface IntelligenceArchNodeCopy {
  title: string;
  items: string[];
}

export interface IntelligenceDiagramCopy {
  summary: string;
  localModel: string;
  memory: string;
  tools: string;
  fileTools: string;
  automationBranch: string;
  automationStack: string;
}

export interface CapabilityCopy {
  title: string;
  description: string;
}

export interface ProcessStepCopy {
  number: string;
  title: string;
  description: string;
}

/** Builder map world branch labels for Homepage V2. */
export interface BuilderMapWorldCopy {
  label: string;
  projects: string;
}

export interface MethodStepCopy {
  number: string;
  title: string;
  description: string;
}

export interface SecurityStageCopy {
  number: string;
  title: string;
  description: string;
}

export interface FutureDirectionItemCopy {
  label: string;
  description: string;
}

/** Homepage V2 typed copy — Phase 7.3B narrative architecture. */
export interface BrandEvolutionStepCopy {
  number: string;
  title: string;
  items: string[];
}

export interface HomeV2Copy {
  hero: {
    humanLine: string;
    exploreSystem: string;
    enterFuture: string;
    originLabel: string;
  };
  method: {
    title: string;
    opener: string;
    compressedNarrative: string;
    steps: MethodStepCopy[];
    principles: string[];
    mapTitle: string;
    mapSubtitle: string;
    mapAccessibleSummary: string;
    worlds: {
      brands: BuilderMapWorldCopy;
      systems: BuilderMapWorldCopy;
      intelligence: BuilderMapWorldCopy;
      security: BuilderMapWorldCopy;
    };
  };
  bridges: {
    brandsToSystems: string;
    systemsToIntelligence: string;
    intelligenceToSecurity: string;
    securityToFuture: string;
  };
  mobile: {
    disclosure: {
      moreDetails: string;
      viewProcess: string;
      showFullStack: string;
      showLess: string;
      openLivePreview: string;
      showMoreSocial: string;
      showArchitecture: string;
    };
    gymura: {
      statement: string;
    };
    systems: {
      statement: string;
    };
    intelligence: {
      statement: string;
    };
    security: {
      statement: string;
    };
    future: {
      intro: string;
    };
    contact: {
      intro: string;
    };
  };
  worlds: {
    brands: {
      eyebrow: string;
      bridge: string;
      principles: string[];
      brandEvolution: BrandEvolutionStepCopy[];
      ecosystemCategories: EcosystemCategoryCopy[];
    };
    systems: {
      eyebrow: string;
      bridge: string;
      problem: string;
      workflowTitle: string;
      workflowNote: string;
      workflowStages: WorkflowStageCopy[];
      capabilitiesTitle: string;
      capabilities: string[];
      texasFundsStatusLine: string;
      texasFundsDescription: string;
      texasFundsMicroFlow: string;
      texasFundsFlowSteps: string[];
    };
    intelligence: {
      eyebrow: string;
      bridge: string;
      alexaTitle: string;
      alexaDescription: string;
      alexaHighlights: string[];
      automationTitle: string;
      automationDescription: string;
      automationHighlights: string[];
      connectedLabel: string;
      alexaCaseStudyLabel: string;
      automationCaseStudyLabel: string;
      diagram: IntelligenceDiagramCopy;
      architecture: {
        localModel: IntelligenceArchNodeCopy;
        memory: IntelligenceArchNodeCopy;
        tools: IntelligenceArchNodeCopy;
        localTools: IntelligenceArchNodeCopy;
        automation: IntelligenceArchNodeCopy;
      };
    };
    security: {
      eyebrow: string;
      bridge: string;
      intro: string[];
      stagesTitle: string;
      stages: SecurityStageCopy[];
      principlesTitle: string;
      principles: string[];
      alexLinuxTitle: string;
      alexLinuxDescription: string;
      alexLinuxBranchLabel: string;
      alexLinuxLine: string;
      diagramSummary: string;
    };
    future: {
      title: string;
      intro: string;
      pathOriginLabel: string;
      openPathLabel: string;
      openPathHint: string;
      items: FutureDirectionItemCopy[];
    };
  };
}

export interface BuildingCardCopy {
  /** Must match a slug in the project registry so the status badge stays honest. */
  slug: string;
  title: string;
  description: string;
}

/** Localized fact-sheet values for case study pages — keyed exhaustively by ProjectSlug. */
export interface ProjectFactsCopy {
  roles: string[];
  technologies: string[];
  capabilities: string[];
}

/**
 * Shared dictionary shape for both locales. English and Arabic must always
 * expose the exact same keys so no user-facing text is ever missing.
 */
export interface ProjectSeoMeta {
  /** Page title before the creator suffix, e.g. "Gymura — Brand & E-commerce Case Study". */
  title: string;
  /** Concise meta description — honest status and scope only. */
  description: string;
  /** Short OG image subtitle (Latin text; OG images render English only). */
  ogSubtitle: string;
}

export interface Dictionary {
  meta: {
    title: string;
    description: string;
    siteName: string;
  };
  seo: {
    localeName: string;
    creatorLabel: string;
    caseStudyTitleSuffix: string;
    defaultSocialDescription: string;
    incompleteStatus: {
      functionalPrototype: string;
      activeDevelopment: string;
      inProgress: string;
      researchConcept: string;
    };
    projectMeta: Record<ProjectSlug, ProjectSeoMeta>;
  };
  nav: {
    home: string;
    about: string;
    projects: string;
    lab: string;
    cybersecurity: string;
    cv: string;
    contact: string;
  };
  a11y: {
    skipToContent: string;
    mainNavigation: string;
    openMenu: string;
    closeMenu: string;
    switchLanguage: string;
    heroImageAlt: string;
    manifestoImageAlt: string;
    opensInNewTab: string;
    pageNotFoundTitle: string;
    pageNotFoundDescription: string;
    pageNotFoundHome: string;
  };
  hero: {
    name: string;
    statement: string;
    headline: string;
    supporting: string;
    signature: string;
    exploreWork: string;
    enterLab: string;
    viewCv: string;
  };
  narrative: {
    lines: string[];
    conclusion: string;
    pillars: CapabilityCopy[];
  };
  gymura: {
    label: string;
    title: string;
    subtitle: string;
    description: string[];
    roleLabel: string;
    role: string;
    ecosystemTitle: string;
    ecosystem: string[];
    visit: string;
    caseStudy: string;
    livePreview: {
      title: string;
      displayDomain: string;
      openWebsiteLabel: string;
    };
  };
  restaurant: {
    label: string;
    title: string;
    description: string[];
    roleLabel: string;
    role: string;
    visit: string;
    caseStudy: string;
    workflow: {
      title: string;
      conceptualNote: string;
      orderCardLabel: string;
      stages: WorkflowStageCopy[];
    };
    primaryModules: {
      title: string;
      items: string[];
    };
    secondaryModules: {
      title: string;
      items: string[];
    };
    livePreview: {
      title: string;
      displayDomain: string;
      openWebsiteLabel: string;
    };
  };
  building: {
    title: string;
    intro: string;
    cards: BuildingCardCopy[];
  };
  liveProducts: {
    title: string;
    intro: string;
    texasFunds: {
      label: string;
      title: string;
      description: string[];
      roleLabel: string;
      role: string;
    };
  };
  cyber: {
    title: string;
    intro: string[];
    areasTitle: string;
    areas: string[];
    legal: string;
  };
  different: {
    title: string;
    capabilities: CapabilityCopy[];
  };
  skills: {
    title: string;
    intro: string;
  };
  process: {
    title: string;
    steps: ProcessStepCopy[];
  };
  manifesto: {
    text: string;
    supporting: string;
  };
  contact: {
    ctaTitle: string;
    ctaSubtitle: string;
    intro: string;
    resolutionLabel: string;
    links: {
      github: string;
      linkedin: string;
      instagram: string;
      telegram: string;
      email: string;
    };
  };
  footer: {
    navigationTitle: string;
    connectTitle: string;
    locationLabel: string;
    locationValue: string;
  };
  projectPages: {
    indexTitle: string;
    indexIntro: string;
    eyebrow: string;
    backToProjects: string;
    roleLabel: string;
    statusLabel: string;
    typeLabel: string;
    technologiesLabel: string;
    techStackLabel: string;
    techStackShowMore: string;
    techStackShowLess: string;
    capabilitiesLabel: string;
    galleryTitle: string;
    previousProject: string;
    nextProject: string;
    openCaseStudy: string;
    visitFallback: string;
  };
  /** Localized project-type labels keyed by slug — compile-time exhaustive via ProjectSlug. */
  projectTypes: Record<ProjectSlug, string>;
  /** Localized roles, technologies, and capabilities for case study fact sheets. */
  projectFacts: Record<ProjectSlug, ProjectFactsCopy>;
  caseStudies: Record<ProjectSlug, CaseStudyCopy>;
  livePreview: {
    sectionLabel: string;
    launch: string;
    desktop: string;
    tablet: string;
    mobile: string;
    reload: string;
    openFullWebsite: string;
    loading: string;
    unavailable: string;
    blockedHint: string;
    openInNewTab: string;
    viewportSwitcher: string;
    previewShell: string;
  };
  statusLabels: Record<ProjectStatus, string>;
  common: {
    languageSwitcherLabel: string;
    comingSoon: string;
    assetPlaceholderTitle: string;
    assetPlaceholderNote: string;
    underConstruction: string;
  };
  /** Homepage V2 narrative copy (Phase 7.3B). */
  homeV2: HomeV2Copy;
  /** Hero Lab experimental UI copy (Phase 7.4R.1). */
  heroLab: {
    badge: string;
    title: string;
    description: string;
    variantA: string;
    variantB: string;
    variantC: string;
    variantALabel: string;
    variantBLabel: string;
    variantCLabel: string;
    deviceDesktop: string;
    deviceMobile: string;
    replayMotion: string;
    pauseMotion: string;
    resumeMotion: string;
    reducedMotionPreview: string;
    evaluationTitle: string;
    evaluationNote: string;
    criteria: string[];
    previewLabel: string;
    debugTitle: string;
  };
  /** Three Hero Lab — true 3D Builder System (Phase 7.4R.2). */
  threeHeroLab: {
    badge: string;
    title: string;
    description: string;
    backHome: string;
    heroAria: string;
  };
}
