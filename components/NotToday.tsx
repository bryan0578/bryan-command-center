"use client";

import { useState } from "react";
import type { NotTodayItem } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";

interface NotTodayProps {
  items: NotTodayItem[];
  onAdd: (text: string) => void;
  onRemove: (id: string) => void;
}

export function NotToday({ items, onAdd, onRemove }: NotTodayProps) {
  const [draft, setDraft] = useState("");

  const submit = () => {
    const trimmed = draft.trim();
    if (trimmed) {
      onAdd(trimmed);
      setDraft("");
    }
  };

  return (
    <Card variant="dashed" radius="section" className="p-[22px]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Eyebrow color="muted">Not Today</Eyebrow>
        <span className="text-[12.5px] text-ink-disabled italic">
          Parked on purpose — not forgotten, just not today.
        </span>
      </div>
      {items.length > 0 ? (
        <div className="mt-[15px] flex flex-wrap gap-2.5">
          {items.map((item) => (
            <span
              key={item.id}
              className="flex items-center gap-2 rounded-pill border border-border-subtle bg-card px-[15px] py-2 text-[13px] text-ink-muted"
            >
              {item.text}
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                aria-label={`Remove ${item.text}`}
                className="bc-focus-ring text-ink-muted hover:text-ink-secondary"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      ) : (
        <div className="mt-[15px] text-[13px] text-ink-muted">
          Nothing parked. Everything you&apos;re carrying today is on the board.
        </div>
      )}
      <div className="mt-3 flex gap-2">
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
          placeholder="Park something for later…"
          aria-label="Add a parked item"
          className="bc-focus-ring h-[38px] flex-1 rounded-pill border border-dashed border-border-subtle bg-base px-[15px] text-[13px] text-ink-primary placeholder:text-ink-muted"
        />
        <Button variant="secondary" size="sm" onClick={submit}>
          Add
        </Button>
      </div>
    </Card>
  );
}
