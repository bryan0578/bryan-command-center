import type { Role } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RoleRow } from "@/components/jobs/RoleRow";
import { NextAction } from "@/components/jobs/NextAction";

interface CountTileProps {
  value: number;
  label: string;
  colorClass: string;
}

function CountTile({ value, label, colorClass }: CountTileProps) {
  return (
    <div className="flex-1 rounded-row border border-border-subtle bg-base p-3.5 text-center">
      <div className={`font-sans text-[26px] font-bold ${colorClass}`}>{value}</div>
      <div className="eyebrow-sm mt-1 text-ink-muted">{label}</div>
    </div>
  );
}

interface JobSearchTrackerProps {
  roles: Role[];
  jobCounts: { saved: number; applied: number; followUps: number };
  nextAction: string;
}

export function JobSearchTracker({ roles, jobCounts, nextAction }: JobSearchTrackerProps) {
  const hasRoles = roles.length > 0;

  return (
    <Card radius="section" className="p-6">
      <div className="flex items-center justify-between gap-3">
        <Eyebrow color="aqua">Job Search Tracker</Eyebrow>
        <span className="eyebrow-sm text-ink-muted">
          Career progress
        </span>
      </div>

      <div className="mt-[18px] flex gap-2.5">
        <CountTile value={jobCounts.saved} label="Saved" colorClass="text-ink-primary" />
        <CountTile value={jobCounts.applied} label="Applied" colorClass="text-aqua" />
        <CountTile value={jobCounts.followUps} label="Follow-ups" colorClass="text-warning" />
      </div>

      {hasRoles ? (
        <div className="mt-4 flex flex-col gap-2">
          {roles.map((role) => (
            <RoleRow key={role.id} role={role} />
          ))}
        </div>
      ) : (
        <div className="mt-4 text-[13px] text-ink-muted">No roles tracked yet — add your first.</div>
      )}

      {hasRoles && nextAction && <NextAction text={nextAction} />}
    </Card>
  );
}
