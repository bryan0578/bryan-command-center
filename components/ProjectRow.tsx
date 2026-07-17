import type { Project } from "@/lib/types";
import { StatusChip, type StatusChipTone } from "@/components/ui/StatusChip";
import { InlineEdit } from "@/components/ui/InlineEdit";

const statusTone: Record<Project["status"], StatusChipTone> = {
  draft: "violet",
  active: "mint",
  idle: "muted",
  waiting: "info",
  complete: "mint",
};

const statusLabel: Record<Project["status"], string> = {
  draft: "Draft",
  active: "Active",
  idle: "Idle",
  waiting: "Waiting",
  complete: "Complete",
};

const STATUS_CYCLE: Project["status"][] = ["draft", "active", "idle", "waiting", "complete"];

function nextStatus(current: Project["status"]): Project["status"] {
  const index = STATUS_CYCLE.indexOf(current);
  return STATUS_CYCLE[(index + 1) % STATUS_CYCLE.length];
}

interface ProjectRowProps {
  project: Project;
  onEditName: (name: string) => void;
  onSetStatus: (status: Project["status"]) => void;
  onRemove: () => void;
}

export function ProjectRow({ project, onEditName, onSetStatus, onRemove }: ProjectRowProps) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-row border border-border-subtle bg-base px-[13px] py-3">
      <div className="min-w-0 flex-1">
        <InlineEdit
          value={project.name}
          onCommit={onEditName}
          ariaLabel="Edit project name"
          displayClassName="text-[13.5px] font-semibold text-ink-primary"
          inputClassName="text-[13.5px] font-semibold text-ink-primary"
        />
      </div>
      <button
        type="button"
        onClick={() => onSetStatus(nextStatus(project.status))}
        aria-label="Change project status"
        className="bc-focus-ring flex-shrink-0"
      >
        <StatusChip tone={statusTone[project.status]} className="text-[9.5px]">
          {statusLabel[project.status]}
        </StatusChip>
      </button>
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove project"
        className="bc-focus-ring flex-shrink-0 text-[13px] text-ink-muted hover:text-ink-secondary"
      >
        ×
      </button>
    </div>
  );
}
