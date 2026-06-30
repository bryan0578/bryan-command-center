import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary";
export type ButtonSize = "default" | "sm";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-mint text-ink-inverse hover:bg-aqua disabled:bg-subtle disabled:text-ink-disabled",
  secondary:
    "bg-transparent border border-border text-ink-primary hover:bg-elevated disabled:text-ink-disabled disabled:hover:bg-transparent",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-[46px] px-5 text-[15px]",
  sm: "h-[38px] px-4 text-[13px]",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  variant = "primary",
  size = "default",
  className = "",
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`bc-focus-ring inline-flex items-center justify-center gap-2 rounded-btn font-semibold transition-[background-color,color,opacity] duration-[180ms] ease-bc disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...rest}
    />
  );
}
