import type { HTMLAttributes, ReactNode } from "react";

export type CalloutType = "technical";

const typeAccent: Record<CalloutType, string> = {
  technical: "border-aqua text-aqua",
};

interface CalloutProps extends HTMLAttributes<HTMLDivElement> {
  type?: CalloutType;
  label: string;
  children: ReactNode;
}

export function Callout({ type = "technical", label, className = "", children, ...rest }: CalloutProps) {
  return (
    <div className={`border-l-[3px] pl-[13px] ${typeAccent[type].split(" ")[0]} ${className}`} {...rest}>
      <div className={`font-mono text-[11px] font-semibold tracking-[0.07em] uppercase ${typeAccent[type].split(" ")[1]}`}>
        {label}
      </div>
      <div className="mt-1.5 text-[14.5px] leading-snug text-ink-secondary">{children}</div>
    </div>
  );
}
