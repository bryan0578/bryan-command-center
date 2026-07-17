"use client";

import { useState } from "react";
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
  onAddRole: (company: string, title: string) => void;
  onSetStatus: (id: string, status: Role["status"]) => void;
  onRemoveRole: (id: string) => void;
  onSetNextAction: (text: string) => void;
}

export function JobSearchTracker({ roles, jobCounts, nextAction, onAddRole, onSetStatus, onRemoveRole, onSetNextAction }: JobSearchTrackerProps) {
  const hasRoles = roles.length > 0;
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");

  const addRole = () => {
    const cleanCompany = company.trim();
    const cleanTitle = title.trim();
    if (!cleanCompany || !cleanTitle) return;
    onAddRole(cleanCompany, cleanTitle);
    setCompany("");
    setTitle("");
  };

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
            <RoleRow
              key={role.id}
              role={role}
              onSetStatus={(status) => onSetStatus(role.id, status)}
              onRemove={() => onRemoveRole(role.id)}
            />
          ))}
        </div>
      ) : (
        <div className="mt-4 text-[13px] text-ink-muted">No roles tracked yet — add your first.</div>
      )}

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <input className="bc-focus-ring min-h-11 rounded-row border border-dashed border-border-subtle bg-base px-3 text-sm" value={company} onChange={(event) => setCompany(event.target.value)} placeholder="Company" aria-label="Company" />
        <input className="bc-focus-ring min-h-11 rounded-row border border-dashed border-border-subtle bg-base px-3 text-sm" value={title} onChange={(event) => setTitle(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") addRole(); }} placeholder="Role title" aria-label="Role title" />
        <button type="button" onClick={addRole} disabled={!company.trim() || !title.trim()} className="bc-focus-ring min-h-11 rounded-btn border border-aqua/40 bg-info-bg px-3 text-sm font-semibold text-aqua disabled:opacity-40 sm:col-span-2">Add role</button>
      </div>

      <NextAction text={nextAction} onEdit={onSetNextAction} />
    </Card>
  );
}
