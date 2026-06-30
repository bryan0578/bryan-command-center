export type SegmentMeterAccent = "mint" | "aqua";

const accentClasses: Record<SegmentMeterAccent, string> = {
  mint: "bg-mint",
  aqua: "bg-aqua",
};

interface SegmentMeterProps {
  label: string;
  value: number;
  valueLabel: string;
  accent: SegmentMeterAccent;
  max?: number;
}

export function SegmentMeter({ label, value, valueLabel, accent, max = 5 }: SegmentMeterProps) {
  return (
    <div className="flex items-center justify-between gap-3.5">
      <span className="w-[52px] font-mono text-[11px] tracking-[0.07em] text-ink-muted uppercase">
        {label}
      </span>
      <div className="flex gap-[5px]">
        {Array.from({ length: max }, (_, i) => (
          <span
            key={i}
            className={`h-[6px] w-[22px] rounded-pill ${i < value ? accentClasses[accent] : "bg-border"}`}
          />
        ))}
      </div>
      <span className="w-[50px] text-right text-[13px] text-ink-secondary">{valueLabel}</span>
    </div>
  );
}
