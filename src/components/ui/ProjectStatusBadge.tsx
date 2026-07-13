import type { ProjectStatus } from "@/content/projects/types";

const statusStyles: Record<ProjectStatus, { dot: string; text: string }> = {
  live: { dot: "bg-emerald-400", text: "text-emerald-300" },
  "active-development": { dot: "bg-electric", text: "text-electric" },
  "functional-prototype": { dot: "bg-cyber", text: "text-cyber" },
  research: { dot: "bg-glow", text: "text-glow" },
  planned: { dot: "bg-mist", text: "text-mist" },
  archived: { dot: "bg-mist", text: "text-mist" },
  private: { dot: "bg-amber-soft", text: "text-amber-soft" },
};

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
  label: string;
}

export function ProjectStatusBadge({ status, label }: ProjectStatusBadgeProps) {
  const style = statusStyles[status];
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-line bg-ink px-3 py-1 text-xs font-medium ${style.text}`}
    >
      <span aria-hidden className={`size-1.5 rounded-full ${style.dot}`} />
      {label}
    </span>
  );
}
