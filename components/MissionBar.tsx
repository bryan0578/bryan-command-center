import type { Mission } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SegmentMeter } from "@/components/ui/SegmentMeter";
import { InlineEdit } from "@/components/ui/InlineEdit";

function levelLabel(value: number): string {
  if (value <= 0) return "—";
  if (value <= 2) return "Low";
  if (value === 3) return "Medium";
  return "High";
}

interface MissionBarProps {
  mission: Mission;
  onSetPrimaryFocus: (text: string) => void;
  onSetEnergy: (value: number) => void;
  onSetStress: (value: number) => void;
}

export function MissionBar({ mission, onSetPrimaryFocus, onSetEnergy, onSetStress }: MissionBarProps) {
  return (
    <Card
      variant="elevated"
      radius="panel"
      className="flex flex-wrap items-center justify-between gap-7 px-6 py-5"
    >
      <div className="min-w-0 flex-[1_1_440px]">
        <div className="flex items-center gap-3">
          <Eyebrow color="mint">Today&apos;s Mission</Eyebrow>
          <span className="h-1 w-1 rounded-full bg-ink-disabled" />
          <span className="font-sans text-xs tracking-[0.04em] text-ink-muted">{mission.dateLabel}</span>
        </div>
        <InlineEdit
          value={mission.primaryFocus}
          onCommit={onSetPrimaryFocus}
          multiline
          placeholder="Set today's primary focus"
          ariaLabel="Edit today's primary focus"
          displayClassName="mt-3 max-w-[600px] border-l-[3px] border-mint pl-[15px] font-sans text-[21px] leading-[1.35] font-[650] tracking-[-0.02em] text-ink-primary"
          inputClassName="mt-3 max-w-[600px] border-l-[3px] border-mint pl-[15px] font-sans text-[21px] leading-[1.35] font-[650] tracking-[-0.02em] text-ink-primary"
        />
      </div>
      <div className="flex min-w-[268px] flex-col gap-3 rounded-card border border-border bg-base px-4 py-[15px]">
        <SegmentMeter
          label="Energy"
          accent="mint"
          value={mission.energy}
          valueLabel={levelLabel(mission.energy)}
          onSelect={onSetEnergy}
        />
        <SegmentMeter
          label="Stress"
          accent="aqua"
          value={mission.stress}
          valueLabel={levelLabel(mission.stress)}
          onSelect={onSetStress}
        />
      </div>
    </Card>
  );
}
