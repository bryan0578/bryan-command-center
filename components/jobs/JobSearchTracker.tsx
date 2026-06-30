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
      <div className={`font-sora text-[26px] font-bold ${colorClass}`}>{value}</div>
      <div className="mt-1 font-mono text-[10px] tracking-[0.06em] text-ink-muted uppercase">{label}</div>
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
        <span className="font-mono text-[11px] tracking-[0.05em] text-ink-muted uppercase">
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
