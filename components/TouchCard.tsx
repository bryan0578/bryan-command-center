import type { Touch, TouchCategory } from "@/lib/types";
import { Checkbox } from "@/components/ui/Checkbox";

const categoryLabel: Record<TouchCategory, string> = {
  career: "Career",
  home: "Home / Admin",
  creative: "Creative",
};

const categoryColorClass: Record<TouchCategory, string> = {
  career: "text-aqua",
  home: "text-mint",
  creative: "text-violet",
};

interface TouchCardProps {
  touch: Touch;
  onToggle: () => void;
}

export function TouchCard({ touch, onToggle }: TouchCardProps) {
  return (
    <div
      role="checkbox"
      aria-checked={touch.done}
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      className="bc-focus-ring flex min-h-[44px] cursor-pointer flex-col gap-3 rounded-row border border-border bg-base p-4 transition-colors duration-[180ms] ease-bc hover:bg-elevated"
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={`font-mono text-[11px] font-semibold tracking-[0.07em] uppercase ${categoryColorClass[touch.category]}`}
        >
          {categoryLabel[touch.category]}
        </span>
        <Checkbox checked={touch.done} size={22} />
      </div>
      <div className="text-[14.5px] leading-[1.45] text-ink-secondary">{touch.label}</div>
    </div>
  );
}
