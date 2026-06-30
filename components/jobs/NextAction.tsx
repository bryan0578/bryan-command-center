interface NextActionProps {
  text: string;
}

export function NextAction({ text }: NextActionProps) {
  return (
    <div className="mt-[15px] flex items-center gap-[13px] rounded-row border border-mint/28 bg-mint-soft px-[15px] py-[13px]">
      <span className="eyebrow-sm flex-shrink-0 text-mint">
        Next →
      </span>
      <span className="text-[13.5px] leading-[1.5] text-ink-secondary">{text}</span>
    </div>
  );
}
