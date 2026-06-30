interface ProgressBarProps {
  percent: number;
  className?: string;
}

export function ProgressBar({ percent, className = "" }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <div className={`h-2 overflow-hidden rounded-pill bg-border ${className}`}>
      <div
        className="h-full rounded-pill bg-mint transition-[width] duration-1000 ease-linear"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
