"use client";

import { useState, type FocusEvent } from "react";
import {
  PROJECT_LIFECYCLE_STATES,
  type Project,
  type ProjectLifecycleState,
} from "@/lib/types";
import { isProjectReviewDue } from "@/lib/projects";
import { StatusChip, type StatusChipTone } from "@/components/ui/StatusChip";
import { InlineEdit } from "@/components/ui/InlineEdit";

const statusTone: Record<ProjectLifecycleState, StatusChipTone> = {
  active: "mint",
  "functionally-complete": "warning",
  "production-ready": "aqua",
  closed: "mint",
  maintenance: "info",
  paused: "muted",
  archived: "muted",
  reopened: "violet",
};

const statusLabel: Record<ProjectLifecycleState, string> = {
  active: "Active",
  "functionally-complete": "Functionally complete · unclosed",
  "production-ready": "Production ready",
  closed: "Closed",
  maintenance: "Maintenance",
  paused: "Paused",
  archived: "Archived",
  reopened: "Reopened",
};

interface ProjectRowProps {
  project: Project;
  onUpdate: (changes: Partial<Project>) => string | null;
  onRemove: () => void;
}

type EditableField = Exclude<keyof Project, "id" | "name" | "lifecycleState">;

export function ProjectRow({ project, onUpdate, onRemove }: ProjectRowProps) {
  const [message, setMessage] = useState("");
  const reviewDue = isProjectReviewDue(project);

  const update = (changes: Partial<Project>) => {
    const error = onUpdate(changes);
    setMessage(error ?? "Saved.");
    return error;
  };

  const commitField = (field: EditableField, event: FocusEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value.trim() || undefined;
    const error = update({ [field]: value });
    if (error) event.currentTarget.value = project[field] ?? "";
  };

  return (
    <div className="rounded-row border border-border-subtle bg-base px-[13px] py-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <InlineEdit
            value={project.name}
            onCommit={(name) => update({ name })}
            ariaLabel="Edit project name"
            displayClassName="text-[13.5px] font-semibold text-ink-primary"
            inputClassName="text-[13.5px] font-semibold text-ink-primary"
          />
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusChip tone={statusTone[project.lifecycleState]} className="text-[9.5px]">
              {statusLabel[project.lifecycleState]}
            </StatusChip>
            {reviewDue && <StatusChip tone="warning">Review overdue</StatusChip>}
            {project.maintenanceTier && (
              <span className="text-[11px] text-ink-muted">Maintenance: {project.maintenanceTier}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={project.lifecycleState}
            onChange={(event) => update({ lifecycleState: event.target.value as ProjectLifecycleState })}
            aria-label={`Lifecycle state for ${project.name}`}
            className="bc-focus-ring min-h-11 min-w-0 flex-1 rounded-btn border border-border bg-elevated px-3 text-[12px] text-ink-primary sm:w-[190px]"
          >
            {PROJECT_LIFECYCLE_STATES.map((status) => (
              <option key={status} value={status}>{statusLabel[status]}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${project.name}`}
            className="bc-focus-ring min-h-11 flex-shrink-0 rounded-btn px-3 text-[16px] text-ink-muted hover:text-ink-secondary"
          >
            ×
          </button>
        </div>
      </div>

      {(project.repositoryUrl || project.deploymentUrl ||
        (project.lifecycleState === "closed" && project.closureRecordUrl)) && (
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[12px] font-semibold text-aqua">
          {project.repositoryUrl && <a href={project.repositoryUrl} target="_blank" rel="noreferrer">Repository ↗</a>}
          {project.deploymentUrl && <a href={project.deploymentUrl} target="_blank" rel="noreferrer">Deployment ↗</a>}
          {project.lifecycleState === "closed" && project.closureRecordUrl && (
            <a href={project.closureRecordUrl} target="_blank" rel="noreferrer">Closure record ↗</a>
          )}
        </div>
      )}

      {message && (
        <p className={`mt-3 text-[11px] ${message === "Saved." ? "text-mint" : "text-error"}`} aria-live="polite">
          {message}
        </p>
      )}

      <details className="mt-3 border-t border-border-subtle pt-3">
        <summary className="bc-focus-ring cursor-pointer text-[12px] font-semibold text-ink-secondary">
          Lifecycle details
        </summary>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <MetadataField label="Maintenance tier" value={project.maintenanceTier} onBlur={(event) => commitField("maintenanceTier", event)} />
          <MetadataField label="Reopening trigger" value={project.reopeningTrigger} onBlur={(event) => commitField("reopeningTrigger", event)} />
          <MetadataField label="Last review date" type="date" value={project.lastReviewDate} onBlur={(event) => commitField("lastReviewDate", event)} />
          <MetadataField label="Next review date" type="date" value={project.nextReviewDate} onBlur={(event) => commitField("nextReviewDate", event)} />
          <MetadataField label="Repository URL" type="url" value={project.repositoryUrl} onBlur={(event) => commitField("repositoryUrl", event)} />
          <MetadataField label="Deployment URL" type="url" value={project.deploymentUrl} onBlur={(event) => commitField("deploymentUrl", event)} />
          <div className="sm:col-span-2">
            <MetadataField label="Closure-record URL" type="url" value={project.closureRecordUrl} onBlur={(event) => commitField("closureRecordUrl", event)} />
            <p className="mt-1 text-[11px] text-ink-muted">Required before this project can be marked closed.</p>
          </div>
        </div>
      </details>
    </div>
  );
}

interface MetadataFieldProps {
  label: string;
  value?: string;
  type?: "text" | "date" | "url";
  onBlur: (event: FocusEvent<HTMLInputElement>) => void;
}

function MetadataField({ label, value, type = "text", onBlur }: MetadataFieldProps) {
  return (
    <label className="flex flex-col gap-1 text-[11px] font-semibold text-ink-muted">
      {label}
      <input
        key={value ?? ""}
        type={type}
        defaultValue={value ?? ""}
        onBlur={onBlur}
        className="bc-focus-ring min-h-11 rounded-btn border border-border bg-elevated px-3 text-[13px] text-ink-primary"
      />
    </label>
  );
}
