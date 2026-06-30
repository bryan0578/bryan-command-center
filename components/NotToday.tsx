import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";

interface NotTodayProps {
  items: string[];
}

export function NotToday({ items }: NotTodayProps) {
  return (
    <Card variant="dashed" radius="section" className="p-[22px]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Eyebrow color="muted">Not Today</Eyebrow>
        <span className="text-[12.5px] text-ink-disabled italic">
          Parked on purpose — not forgotten, just not today.
        </span>
      </div>
      {items.length > 0 ? (
        <div className="mt-[15px] flex flex-wrap gap-2.5">
          {items.map((item) => (
            <span
              key={item}
              className="rounded-pill border border-border-subtle bg-card px-[15px] py-2 text-[13px] text-ink-muted"
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <div className="mt-[15px] text-[13px] text-ink-muted">
          Nothing parked. Everything you&apos;re carrying today is on the board.
        </div>
      )}
    </Card>
  );
}
