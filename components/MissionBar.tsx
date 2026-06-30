import type { Mission } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SegmentMeter } from "@/components/ui/SegmentMeter";

function levelLabel(value: number): string {
  if (value <= 0) return "—";
  if (value <= 2) return "Low";
  if (value === 3) return "Medium";
  return "High";
}

interface MissionBarProps {
  mission: Mission;
}

export function MissionBar({ mission }: MissionBarProps) {
  const hasFocus = mission.primaryFocus.trim().length > 0;

  return (
    <Card
      variant="elevated"
      radius="panel"
      className="flex flex-wrap items-center justify-between gap-7 px-6 py-5"
    >
      <div className="min-w-[440px] flex-1">
        <div className="flex items-center gap-3">
          <Eyebrow color="mint">Today&apos;s Mission</Eyebrow>
          <span className="h-1 w-1 rounded-full bg-ink-disabled" />
          <span className="font-sans text-xs tracking-[0.04em] text-ink-muted">{mission.dateLabel}</span>
        </div>
        {hasFocus ? (
          <div className="mt-3 max-w-[600px] border-l-[3px] border-mint pl-[15px] font-sans text-[21px] leading-[1.35] font-[650] tracking-[-0.02em] text-ink-primary">
            {mission.primaryFocus}
          </div>
        ) : (
          <div className="mt-3 max-w-[600px] border-l-[3px] border-border pl-[15px] font-sans text-[21px] leading-[1.35] font-[650] tracking-[-0.02em] text-ink-muted italic">
            Set today&apos;s primary focus
          </div>
        )}
      </div>
      <div className="flex min-w-[268px] flex-col gap-3 rounded-card border border-border bg-base px-4 py-[15px]">
        <SegmentMeter
          label="Energy"
          accent="mint"
          value={hasFocus ? mission.energy : 0}
          valueLabel={hasFocus ? levelLabel(mission.energy) : "—"}
        />
        <SegmentMeter
          label="Stress"
          accent="aqua"
          value={hasFocus ? mission.stress : 0}
          valueLabel={hasFocus ? levelLabel(mission.stress) : "—"}
        />
      </div>
    </Card>
  );
}
