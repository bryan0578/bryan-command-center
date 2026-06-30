interface NextActionProps {
  text: string;
}

export function NextAction({ text }: NextActionProps) {
  return (
    <div className="mt-[15px] flex items-center gap-[13px] rounded-row border border-mint/28 bg-mint-soft px-[15px] py-[13px]">
      <span className="flex-shrink-0 font-mono text-[10px] tracking-[0.07em] text-mint uppercase">
        Next →
      </span>
      <span className="text-[13.5px] leading-[1.5] text-ink-secondary">{text}</span>
    </div>
  );
}
