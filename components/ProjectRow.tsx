import type { Project } from "@/lib/types";
import { StatusChip, type StatusChipTone } from "@/components/ui/StatusChip";

const statusTone: Record<Project["status"], StatusChipTone> = {
  draft: "violet",
  active: "mint",
  idle: "muted",
  waiting: "info",
};

const statusLabel: Record<Project["status"], string> = {
  draft: "Draft",
  active: "Active",
  idle: "Idle",
  waiting: "Waiting",
};

interface ProjectRowProps {
  project: Project;
}

export function ProjectRow({ project }: ProjectRowProps) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-row border border-border-subtle bg-base px-[13px] py-3">
      <span className="text-[13.5px] font-semibold text-ink-primary">{project.name}</span>
      <StatusChip tone={statusTone[project.status]} className="text-[9.5px]">
        {statusLabel[project.status]}
      </StatusChip>
    </div>
  );
}
