import type { HTMLAttributes, ReactNode } from "react";

export type CardVariant = "default" | "elevated" | "dashed";
export type CardRadius = "card" | "section" | "panel";

const variantClasses: Record<CardVariant, string> = {
  default: "bg-card border border-border",
  elevated: "bg-elevated border border-border-strong shadow-elevated",
  dashed: "bg-base border border-dashed border-border",
};

const radiusClasses: Record<CardRadius, string> = {
  card: "rounded-card",
  section: "rounded-section",
  panel: "rounded-panel",
};

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  radius?: CardRadius;
  children: ReactNode;
}

export function Card({
  variant = "default",
  radius = "section",
  className = "",
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={`${variantClasses[variant]} ${radiusClasses[radius]} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
