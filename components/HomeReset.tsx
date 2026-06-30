import type { Chore } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ChoreRow } from "@/components/ChoreRow";

interface HomeResetProps {
  chores: Chore[];
  onToggle: (id: string) => void;
}

export function HomeReset({ chores, onToggle }: HomeResetProps) {
  return (
    <Card radius="section" className="p-[22px]">
      <div className="mb-[15px] flex items-center justify-between gap-2.5">
        <Eyebrow color="primary">Home Reset</Eyebrow>
        <span className="rounded-chip border border-mint/32 bg-mint-soft px-[9px] py-1 font-mono text-[10px] font-medium tracking-[0.06em] text-mint uppercase">
          15-min
        </span>
      </div>
      {chores.length > 0 ? (
        <div className="flex flex-col gap-2">
          {chores.map((chore) => (
            <ChoreRow key={chore.id} chore={chore} onToggle={() => onToggle(chore.id)} />
          ))}
        </div>
      ) : (
        <div className="text-[13px] text-ink-muted">No reset tasks yet.</div>
      )}
    </Card>
  );
}
