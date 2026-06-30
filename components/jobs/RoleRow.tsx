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
}

export function RoleRow({ role }: RoleRowProps) {
  const label = role.statusNote ? `${statusLabel[role.status]} · ${role.statusNote}` : statusLabel[role.status];

  return (
    <div className="flex items-center justify-between gap-2.5 rounded-row border border-border-subtle bg-base px-[13px] py-3">
      <div>
        <div className="text-sm font-semibold text-ink-primary">{role.company}</div>
        <div className="text-xs text-ink-muted">{role.title}</div>
      </div>
      <StatusChip tone={statusTone[role.status]}>{label}</StatusChip>
    </div>
  );
}
