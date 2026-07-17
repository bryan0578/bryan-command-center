import type { Role } from "@/lib/types";
import { StatusChip, type StatusChipTone } from "@/components/ui/StatusChip";

const statusTone: Record<Role["status"], StatusChipTone> = {
  applied: "aqua",
  follow_up: "warning",
  saved: "muted",
};

const statusLabel: Record<Role["status"], string> = {
  applied: "Applied",
  follow_up: "Follow up",
  saved: "Saved",
};

interface RoleRowProps {
  role: Role;
  onSetStatus: (status: Role["status"]) => void;
  onRemove: () => void;
}

export function RoleRow({ role, onSetStatus, onRemove }: RoleRowProps) {
  const label = role.statusNote ? `${statusLabel[role.status]} · ${role.statusNote}` : statusLabel[role.status];

  return (
    <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-row border border-border-subtle bg-base px-[13px] py-3">
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-ink-primary">{role.company}</div>
        <div className="text-xs text-ink-muted">{role.title}</div>
      </div>
      <div className="flex w-full items-center gap-2 sm:w-auto sm:shrink-0">
        <label className="sr-only" htmlFor={`role-status-${role.id}`}>Status for {role.company}</label>
        <select
          id={`role-status-${role.id}`}
          value={role.status}
          onChange={(event) => onSetStatus(event.target.value as Role["status"])}
          className="bc-focus-ring min-h-10 rounded-chip border border-border bg-card px-2 text-xs text-ink-secondary"
          aria-label={`Status for ${role.company}`}
        >
          <option value="saved">Saved</option>
          <option value="applied">Applied</option>
          <option value="follow_up">Follow up</option>
        </select>
        <StatusChip tone={statusTone[role.status]}>{label}</StatusChip>
        <button
          type="button"
          onClick={onRemove}
          className="bc-focus-ring min-h-10 min-w-10 rounded-chip text-ink-muted hover:bg-elevated hover:text-error"
          aria-label={`Remove ${role.company} ${role.title}`}
          title="Remove role"
        >
          ×
        </button>
      </div>
    </div>
  );
}
