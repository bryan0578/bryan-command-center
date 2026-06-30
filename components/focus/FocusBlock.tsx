import type { FocusBlock as FocusBlockType } from "@/lib/types";
import { computeTimerView } from "@/lib/timer";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Callout } from "@/components/ui/Callout";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";

interface FocusBlockProps {
  block: FocusBlockType;
  elapsedSeconds: number;
  running: boolean;
  onToggle: () => void;
  onReset: () => void;
}

export function FocusBlock({ block, elapsedSeconds, running, onToggle, onReset }: FocusBlockProps) {
  const hasBlock = block.title.trim().length > 0;

  if (!hasBlock) {
    return (
      <Card variant="elevated" radius="section" className="p-6">
        <Eyebrow color="aqua">First Focus Block</Eyebrow>
        <div className="mt-[15px] text-[17px] font-semibold text-ink-primary">
          Define your first 20-minute block
        </div>
        <Button variant="primary" className="mt-[18px]">
          New block
        </Button>
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

      <div className="mt-[15px] text-[17px] font-semibold text-ink-primary">{block.title}</div>

      <Callout type="technical" label="Definition of done" className="mt-[13px]">
        {block.definitionOfDone}
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
