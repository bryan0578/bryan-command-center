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
  onSelect?: (value: number) => void;
}

export function SegmentMeter({ label, value, valueLabel, accent, max = 5, onSelect }: SegmentMeterProps) {
  return (
    <div className="flex items-center justify-between gap-3.5">
      <span className="eyebrow-sm w-[52px] text-ink-muted">
        {label}
      </span>
      <div className="flex gap-[5px]">
        {Array.from({ length: max }, (_, i) => {
          const pipClass = `h-[6px] w-[22px] rounded-pill ${i < value ? accentClasses[accent] : "bg-border"}`;
          return onSelect ? (
            <button
              key={i}
              type="button"
              aria-label={`Set ${label} to ${i + 1}`}
              onClick={() => onSelect(i + 1)}
              className={`bc-focus-ring transition-opacity duration-[180ms] ease-bc hover:opacity-80 ${pipClass}`}
            />
          ) : (
            <span key={i} className={pipClass} />
          );
        })}
      </div>
      <span className="w-[50px] text-right text-[13px] text-ink-secondary">{valueLabel}</span>
    </div>
  );
}
