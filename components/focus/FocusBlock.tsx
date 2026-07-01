import type { FocusBlockContent } from "@/lib/types";
import { computeTimerView } from "@/lib/timer";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Callout } from "@/components/ui/Callout";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { InlineEdit } from "@/components/ui/InlineEdit";

const MIN_DURATION = 5;
const MAX_DURATION = 45;
const DURATION_STEP = 5;

interface FocusBlockProps {
  block: FocusBlockContent;
  elapsedSeconds: number;
  running: boolean;
  onToggle: () => void;
  onReset: () => void;
  onSetTitle: (title: string) => void;
  onSetDefinitionOfDone: (text: string) => void;
  onSetDuration: (minutes: number) => void;
}

export function FocusBlock({
  block,
  elapsedSeconds,
  running,
  onToggle,
  onReset,
  onSetTitle,
  onSetDefinitionOfDone,
  onSetDuration,
}: FocusBlockProps) {
  const hasBlock = block.title.trim().length > 0;

  if (!hasBlock) {
    return (
      <Card variant="elevated" radius="section" className="p-6">
        <Eyebrow color="aqua">First Focus Block</Eyebrow>
        <InlineEdit
          value={block.title}
          onCommit={onSetTitle}
          placeholder="Define your first 20-minute block"
          ariaLabel="Set focus block title"
          displayClassName="mt-[15px] text-[17px] font-semibold text-ink-primary"
          inputClassName="mt-[15px] text-[17px] font-semibold text-ink-primary"
        />
      </Card>
    );
  }

  const t = computeTimerView(block.durationMinutes, elapsedSeconds, running);

  return (
    <Card variant="elevated" radius="section" className="p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Eyebrow color="aqua">First Focus Block</Eyebrow>
          <span className="eyebrow-sm rounded-pill bg-mint px-[9px] py-[3px] text-ink-inverse">
            Do this first
          </span>
        </div>
        <span className="eyebrow-sm text-ink-muted">
          Responsibility
        </span>
      </div>

      <InlineEdit
        value={block.title}
        onCommit={onSetTitle}
        ariaLabel="Edit focus block title"
        displayClassName="mt-[15px] text-[17px] font-semibold text-ink-primary"
        inputClassName="mt-[15px] text-[17px] font-semibold text-ink-primary"
      />

      <Callout type="technical" label="Definition of done" className="mt-[13px]">
        <InlineEdit
          value={block.definitionOfDone}
          onCommit={onSetDefinitionOfDone}
          multiline
          placeholder="What does done look like?"
          ariaLabel="Edit definition of done"
          displayClassName="text-[14.5px] leading-snug text-ink-secondary"
          inputClassName="text-[14.5px] leading-snug text-ink-secondary"
        />
      </Callout>

      <div className="mt-5 flex items-center gap-5">
        <div className="font-sans text-[44px] leading-none font-semibold tracking-[-0.02em] text-ink-primary md:text-[54px]">
          {t.time}
        </div>
        <div className="flex-1">
          <div className="eyebrow-sm mb-[9px] flex items-center gap-[7px] text-ink-muted">
            {t.running && (
              <span className="h-[7px] w-[7px] animate-bc-pulse rounded-full bg-mint" />
            )}
            <span>{t.totalLabel}</span>
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                disabled={t.running}
                onClick={() => onSetDuration(Math.max(MIN_DURATION, block.durationMinutes - DURATION_STEP))}
                aria-label="Decrease block duration"
                className="bc-focus-ring text-[13px] text-ink-muted hover:text-ink-secondary disabled:cursor-not-allowed disabled:opacity-40"
              >
                −
              </button>
              <button
                type="button"
                disabled={t.running}
                onClick={() => onSetDuration(Math.min(MAX_DURATION, block.durationMinutes + DURATION_STEP))}
                aria-label="Increase block duration"
                className="bc-focus-ring text-[13px] text-ink-muted hover:text-ink-secondary disabled:cursor-not-allowed disabled:opacity-40"
              >
                +
              </button>
            </div>
          </div>
          <ProgressBar percent={t.pct} />
        </div>
      </div>

      <div className="mt-[18px] flex gap-2.5">
        <Button variant="primary" disabled={t.done} onClick={onToggle} className="flex-1">
          {t.btnLabel}
        </Button>
        <Button variant="secondary" onClick={onReset}>
          Reset
        </Button>
      </div>
    </Card>
  );
}
