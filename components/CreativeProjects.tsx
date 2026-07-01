"use client";

import { useState } from "react";
import type { Project } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { ProjectRow } from "@/components/ProjectRow";

interface CreativeProjectsProps {
  projects: Project[];
  onEditName: (id: string, name: string) => void;
  onSetStatus: (id: string, status: Project["status"]) => void;
  onRemove: (id: string) => void;
  onAdd: (name: string) => void;
}

export function CreativeProjects({ projects, onEditName, onSetStatus, onRemove, onAdd }: CreativeProjectsProps) {
  const [draft, setDraft] = useState("");

  const submit = () => {
    const trimmed = draft.trim();
    if (trimmed) {
      onAdd(trimmed);
      setDraft("");
    }
  };

  return (
    <Card radius="section" className="p-[22px]">
      <div className="mb-[15px]">
        <Eyebrow color="violet">Creative Projects</Eyebrow>
      </div>
      {projects.length > 0 ? (
        <div className="flex flex-col gap-2">
          {projects.map((project) => (
            <ProjectRow
              key={project.id}
              project={project}
              onEditName={(name) => onEditName(project.id, name)}
              onSetStatus={(status) => onSetStatus(project.id, status)}
              onRemove={() => onRemove(project.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-[13px] text-ink-muted">No active projects.</div>
      )}
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Add a project…"
          aria-label="Add a project"
          className="bc-focus-ring h-[46px] flex-1 rounded-row border border-dashed border-border-subtle bg-base px-[13px] text-[13px] text-ink-primary placeholder:text-ink-muted"
        />
        <Button variant="secondary" onClick={submit}>
          Add
        </Button>
      </div>
    </Card>
  );
}
