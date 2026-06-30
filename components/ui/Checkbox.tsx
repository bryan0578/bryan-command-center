interface CheckboxProps {
  checked: boolean;
  size?: number;
  className?: string;
}

/** Presentational glyph only — the clickable/keyboard target is the parent row. */
export function Checkbox({ checked, size = 20, className = "" }: CheckboxProps) {
  const dim = { width: size, height: size };

  if (checked) {
    return (
      <span
        style={dim}
        className={`flex flex-shrink-0 items-center justify-center rounded-chip bg-mint text-[11px] font-bold text-ink-inverse ${className}`}
        aria-hidden="true"
      >
        ✓
      </span>
    );
  }

  return (
    <span
      style={dim}
      className={`flex-shrink-0 rounded-chip border border-border-strong bg-card ${className}`}
      aria-hidden="true"
    />
  );
}
