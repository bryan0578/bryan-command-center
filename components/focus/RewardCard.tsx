import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { InlineEdit } from "@/components/ui/InlineEdit";

interface RewardCardProps {
  rewardText: string;
  unlocked: boolean;
  done: boolean;
  onToggle: () => void;
  onSetRewardText: (text: string) => void;
}

export function RewardCard({ rewardText, unlocked, done, onToggle, onSetRewardText }: RewardCardProps) {
  return (
    <Card radius="section" className="p-[22px]">
      <Eyebrow color="gold">Reward — after the block</Eyebrow>

      {unlocked ? (
        <div className="mt-[14px] rounded-[10px] border border-gold bg-gold/[0.08] p-4">
          <div className="eyebrow-sm text-gold">
            Unlocked · you earned it
          </div>
          <div className="mt-[9px] flex min-h-[44px] items-center gap-[11px] rounded-[9px] p-1.5">
            <button
              type="button"
              role="checkbox"
              aria-checked={done}
              onClick={onToggle}
              aria-label="Mark reward complete"
              className="bc-focus-ring -m-1.5 flex h-[44px] w-[44px] flex-shrink-0 items-center justify-center rounded-[9px] transition-colors duration-[180ms] ease-bc hover:bg-gold/[0.06]"
            >
              <Checkbox checked={done} size={20} />
            </button>
            <InlineEdit
              value={rewardText}
              onCommit={onSetRewardText}
              placeholder="Add a reward to unlock after the block"
              ariaLabel="Edit reward text"
              displayClassName="text-[15px] font-semibold text-ink-primary"
              inputClassName="text-[15px] font-semibold text-ink-primary"
            />
          </div>
          <Button variant="primary" size="sm" className="mt-[13px]" onClick={onToggle}>
            {done ? "Reward complete ✓" : "Mark reward complete →"}
          </Button>
        </div>
      ) : (
        <div className="mt-[14px] flex items-start gap-[13px] rounded-[10px] border border-dashed border-border-strong p-4">
          <div className="mt-0.5 h-[18px] w-[18px] flex-shrink-0 rounded-[5px] border-2 border-ink-muted" />
          <div className="flex-1">
            <div className="eyebrow-sm text-ink-muted">
              Locked · unlocks at 0:00
            </div>
            <InlineEdit
              value={rewardText}
              onCommit={onSetRewardText}
              multiline
              placeholder="Add a reward to unlock after the block"
              ariaLabel="Edit reward text"
              displayClassName="mt-1.5 text-[14.5px] text-ink-secondary"
              inputClassName="mt-1.5 text-[14.5px] text-ink-secondary"
            />
          </div>
        </div>
      )}
    </Card>
  );
}
