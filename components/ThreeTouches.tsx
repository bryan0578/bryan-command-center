import type { Touch, TouchCategory } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { TouchCard } from "@/components/TouchCard";

const CATEGORIES: { category: TouchCategory; label: string }[] = [
  { category: "career", label: "Career" },
  { category: "home", label: "Home" },
  { category: "creative", label: "Creative" },
];

interface ThreeTouchesProps {
  touches: Touch[];
  onToggle: (id: string) => void;
}

export function ThreeTouches({ touches, onToggle }: ThreeTouchesProps) {
  return (
    <Card variant="elevated" radius="section" className="p-[22px]">
      <div className="mb-4 flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <Eyebrow color="primary">Today&apos;s 3 Touches</Eyebrow>
          <span className="rounded-pill bg-mint px-[9px] py-[3px] font-mono text-[10px] font-semibold tracking-[0.06em] text-ink-inverse uppercase">
            One each
          </span>
        </div>
        <span className="font-mono text-[11px] text-ink-muted">
          Career · Home · Creative — that&apos;s the rule
        </span>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {CATEGORIES.map(({ category, label }) => {
          const touch = touches.find((t) => t.category === category);
          return touch ? (
            <TouchCard key={touch.id} touch={touch} onToggle={() => onToggle(touch.id)} />
          ) : (
            <div
              key={category}
              className="flex min-h-[44px] flex-col justify-center gap-3 rounded-row border border-dashed border-border p-4 text-[14.5px] text-ink-muted"
            >
              Add a {label} touch
            </div>
          );
        })}
      </div>
    </Card>
  );
}
