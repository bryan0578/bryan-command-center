"use client";

import { useState } from "react";
import type { Chore } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { ChoreRow } from "@/components/ChoreRow";

interface HomeResetProps {
  chores: Chore[];
  onToggle: (id: string) => void;
  onEditLabel: (id: string, label: string) => void;
  onRemove: (id: string) => void;
  onAdd: (label: string) => void;
}

export function HomeReset({ chores, onToggle, onEditLabel, onRemove, onAdd }: HomeResetProps) {
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
      <div className="mb-[15px] flex items-center justify-between gap-2.5">
        <Eyebrow color="primary">Home Reset</Eyebrow>
        <span className="eyebrow-sm rounded-chip border border-mint/32 bg-mint-soft px-[9px] py-1 text-mint">
          15-min
        </span>
      </div>
      {chores.length > 0 ? (
        <div className="flex flex-col gap-2">
          {chores.map((chore) => (
            <ChoreRow
              key={chore.id}
              chore={chore}
              onToggle={() => onToggle(chore.id)}
              onEditLabel={(label) => onEditLabel(chore.id, label)}
              onRemove={() => onRemove(chore.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-[13px] text-ink-muted">No reset tasks yet.</div>
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
          placeholder="Add a chore…"
          aria-label="Add a chore"
          className="bc-focus-ring h-[46px] flex-1 rounded-row border border-dashed border-border-subtle bg-base px-[13px] text-[13px] text-ink-primary placeholder:text-ink-muted"
        />
        <Button variant="secondary" onClick={submit}>
          Add
        </Button>
      </div>
    </Card>
  );
}
