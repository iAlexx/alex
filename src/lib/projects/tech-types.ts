export type TechCategory =
  | "language"
  | "framework"
  | "library"
  | "database"
  | "platform"
  | "infrastructure"
  | "deployment"
  | "tool"
  | "protocol"
  | "security"
  | "ai";

export type ProjectTechnology = {
  id: string;
  label: string;
  category: TechCategory;
  iconKey: string;
  url?: string;
  verifiedBy: string[];
};

export type ProjectTechStack = {
  projectId: string;
  /** Full verified stack for case studies. */
  technologies: ProjectTechnology[];
  /** Subset for homepage sections (order preserved). */
  homepageIds: string[];
};
