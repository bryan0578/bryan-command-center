import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";

interface RewardCardProps {
  rewardText: string;
  unlocked: boolean;
  done: boolean;
  onToggle: () => void;
}

export function RewardCard({ rewardText, unlocked, done, onToggle }: RewardCardProps) {
  const hasReward = rewardText.trim().length > 0;

  return (
    <Card radius="section" className="p-[22px]">
      <Eyebrow color="gold">Reward — after the block</Eyebrow>

      {!hasReward ? (
        <div className="mt-[14px] rounded-[10px] border border-dashed border-border-strong p-4 text-[14.5px] text-ink-secondary">
          Add a reward to unlock after the block
        </div>
      ) : unlocked ? (
        <div className="mt-[14px] rounded-[10px] border border-gold bg-gold/[0.08] p-4">
          <div className="eyebrow-sm text-gold">
            Unlocked · you earned it
          </div>
          <div
            role="checkbox"
            aria-checked={done}
            tabIndex={0}
            onClick={onToggle}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onToggle();
              }
            }}
            className="bc-focus-ring mt-[9px] flex min-h-[44px] cursor-pointer items-center gap-[11px] rounded-[9px] p-1.5 transition-colors duration-[180ms] ease-bc hover:bg-gold/[0.06]"
          >
            <Checkbox checked={done} size={20} />
            <span className="text-[15px] font-semibold text-ink-primary">{rewardText}</span>
          </div>
          <Button variant="primary" size="sm" className="mt-[13px]">
            Start reward →
          </Button>
        </div>
      ) : (
        <div className="mt-[14px] flex items-start gap-[13px] rounded-[10px] border border-dashed border-border-strong p-4">
          <div className="mt-0.5 h-[18px] w-[18px] flex-shrink-0 rounded-[5px] border-2 border-ink-muted" />
          <div>
            <div className="eyebrow-sm text-ink-muted">
              Locked · unlocks at 0:00
            </div>
            <div className="mt-1.5 text-[14.5px] text-ink-secondary">{rewardText}</div>
          </div>
        </div>
      )}
    </Card>
  );
}
