"use client";

import { useState } from "react";
import type { Proof } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";

interface StatItemProps {
  value: number;
  label: string;
  colorClass: string;
}

function StatItem({ value, label, colorClass }: StatItemProps) {
  return (
    <div className="flex items-baseline gap-2">
      <span className={`font-sans text-[23px] font-bold ${colorClass}`}>{value}</span>
      <span className="eyebrow-sm text-ink-muted">{label}</span>
    </div>
  );
}

interface TasksStatItemProps {
  value: number;
  isOverridden: boolean;
  onSetOverride: (value: number | null) => void;
}

// "Tasks finished" is computed by default but the spec allows pinning it to a
// manual number — click the value to edit, Enter/blur commits, the small ↺
// clears the override and goes back to the live computed total.
function TasksStatItem({ value, isOverridden, onSetOverride }: TasksStatItemProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));

  if (editing) {
    return (
      <div className="flex items-baseline gap-2">
        <input
          type="number"
          min={0}
          max={99}
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => {
            const parsed = Number(draft);
            onSetOverride(Number.isFinite(parsed) ? Math.max(0, Math.round(parsed)) : null);
            setEditing(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
            if (e.key === "Escape") {
              setDraft(String(value));
              setEditing(false);
            }
          }}
          className="bc-focus-ring w-12 rounded-chip border border-gold bg-base font-sans text-[23px] font-bold text-gold"
        />
        <span className="eyebrow-sm text-ink-muted">Tasks finished</span>
      </div>
    );
  }

  return (
    <div className="flex items-baseline gap-2">
      <button
        type="button"
        onClick={() => {
          setDraft(String(value));
          setEditing(true);
        }}
        title="Click to set a manual total"
        className="bc-focus-ring rounded-chip font-sans text-[23px] font-bold text-gold"
      >
        {value}
      </button>
      <span className="eyebrow-sm text-ink-muted">Tasks finished</span>
      {isOverridden && (
        <button
          type="button"
          onClick={() => onSetOverride(null)}
          title="Reset to computed total"
          className="bc-focus-ring text-[11px] text-ink-muted hover:text-ink-secondary"
        >
          ↺
        </button>
      )}
    </div>
  );
}

interface ProofStripProps {
  proof: Proof;
  isTasksOverridden: boolean;
  onSetTasksOverride: (value: number | null) => void;
}

export function ProofStrip({ proof, isTasksOverridden, onSetTasksOverride }: ProofStripProps) {
  const isZeroWeek = proof.career === 0 && proof.chores === 0 && proof.creative === 0 && proof.tasks === 0;

  return (
    <Card radius="card" className="flex flex-wrap items-center justify-between gap-[22px] px-[22px] py-[15px]">
      <div className="flex items-center gap-3">
        <Eyebrow color="gold">Proof of Movement</Eyebrow>
        <span className="font-sans text-[11px] tracking-[0.04em] text-ink-muted">
          {isZeroWeek
            ? "This week starts now."
            : `this week · showed up ${proof.daysShownUp} of ${proof.daysTotal} days`}
        </span>
      </div>
      <div className="flex flex-wrap items-baseline gap-[26px]">
        <StatItem value={proof.career} label="Career" colorClass="text-aqua" />
        <StatItem value={proof.chores} label="Chores" colorClass="text-mint" />
        <StatItem value={proof.creative} label="Creative blocks" colorClass="text-violet" />
        <TasksStatItem value={proof.tasks} isOverridden={isTasksOverridden} onSetOverride={onSetTasksOverride} />
      </div>
    </Card>
  );
}
