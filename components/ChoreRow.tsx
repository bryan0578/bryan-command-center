import type { Chore } from "@/lib/types";
import { Checkbox } from "@/components/ui/Checkbox";
import { InlineEdit } from "@/components/ui/InlineEdit";

interface ChoreRowProps {
  chore: Chore;
  onToggle: () => void;
  onEditLabel: (label: string) => void;
  onRemove: () => void;
}

export function ChoreRow({ chore, onToggle, onEditLabel, onRemove }: ChoreRowProps) {
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
      <div
        className="min-w-0 flex-1"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InlineEdit
          value={chore.label}
          onCommit={onEditLabel}
          ariaLabel="Edit chore"
          displayClassName="text-[13px] text-ink-secondary"
          inputClassName="text-[13px] text-ink-secondary"
        />
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        aria-label="Remove chore"
        className="bc-focus-ring flex-shrink-0 text-[13px] text-ink-muted hover:text-ink-secondary"
      >
        ×
      </button>
    </div>
  );
}
