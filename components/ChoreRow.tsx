import type { Chore } from "@/lib/types";
import { Checkbox } from "@/components/ui/Checkbox";

interface ChoreRowProps {
  chore: Chore;
  onToggle: () => void;
}

export function ChoreRow({ chore, onToggle }: ChoreRowProps) {
  return (
    <div
      role="checkbox"
      aria-checked={chore.done}
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      className="bc-focus-ring flex min-h-[44px] cursor-pointer items-center gap-[11px] rounded-row border border-border-subtle bg-base px-[13px] py-[11px] transition-colors duration-[180ms] ease-bc hover:bg-elevated"
    >
      <Checkbox checked={chore.done} size={20} />
      <span className="text-[13px] text-ink-secondary">{chore.label}</span>
    </div>
  );
}
