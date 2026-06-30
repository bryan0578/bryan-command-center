import type { HTMLAttributes, ReactNode } from "react";

export type EyebrowColor = "mint" | "aqua" | "gold" | "violet" | "muted" | "primary";

const colorClasses: Record<EyebrowColor, string> = {
  mint: "text-mint",
  aqua: "text-aqua",
  gold: "text-gold",
  violet: "text-violet",
  muted: "text-ink-muted",
  primary: "text-ink-primary",
};

interface EyebrowProps extends HTMLAttributes<HTMLSpanElement> {
  color?: EyebrowColor;
  children: ReactNode;
}

export function Eyebrow({ color = "primary", className = "", children, ...rest }: EyebrowProps) {
  return (
    <span
      className={`font-mono text-xs font-semibold tracking-[0.08em] uppercase ${colorClasses[color]} ${className}`}
      {...rest}
    >
      {children}
    </span>
  );
}
