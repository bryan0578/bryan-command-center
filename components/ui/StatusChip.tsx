import type { HTMLAttributes, ReactNode } from "react";

export type StatusChipTone = "aqua" | "warning" | "muted" | "violet" | "mint" | "info";

const toneClasses: Record<StatusChipTone, string> = {
  aqua: "text-aqua bg-info-bg border-aqua/30",
  warning: "text-warning bg-warning-bg border-warning/30",
  muted: "text-ink-muted bg-subtle border-border",
  violet: "text-violet bg-draft-bg border-violet/32",
  mint: "text-mint bg-mint-soft border-mint/32",
  info: "text-info bg-info-bg border-info/30",
};

interface StatusChipProps extends HTMLAttributes<HTMLSpanElement> {
  tone: StatusChipTone;
  children: ReactNode;
}

export function StatusChip({ tone, className = "", children, ...rest }: StatusChipProps) {
  return (
    <span
      className={`inline-block rounded-chip border px-[9px] py-[4px] font-mono text-[10px] font-semibold tracking-[0.05em] uppercase ${toneClasses[tone]} ${className}`}
      {...rest}
    >
      {children}
    </span>
  );
}
