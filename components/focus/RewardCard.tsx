import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";

interface RewardCardProps {
  rewardText: string;
  unlocked: boolean;
}

export function RewardCard({ rewardText, unlocked }: RewardCardProps) {
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
          <div className="font-mono text-[11px] tracking-[0.07em] text-gold uppercase">
            Unlocked · you earned it
          </div>
          <div className="mt-[7px] text-[15px] font-semibold text-ink-primary">{rewardText}</div>
          <Button variant="primary" size="sm" className="mt-[13px]">
            Start reward →
          </Button>
        </div>
      ) : (
        <div className="mt-[14px] flex items-start gap-[13px] rounded-[10px] border border-dashed border-border-strong p-4">
          <div className="mt-0.5 h-[18px] w-[18px] flex-shrink-0 rounded-[5px] border-2 border-ink-muted" />
          <div>
            <div className="font-mono text-[11px] tracking-[0.07em] text-ink-muted uppercase">
              Locked · unlocks at 0:00
            </div>
            <div className="mt-1.5 text-[14.5px] text-ink-secondary">{rewardText}</div>
          </div>
        </div>
      )}
    </Card>
  );
}
