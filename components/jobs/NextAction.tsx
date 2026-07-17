import { InlineEdit } from "@/components/ui/InlineEdit";

interface NextActionProps {
  text: string;
  onEdit: (text: string) => void;
}

export function NextAction({ text, onEdit }: NextActionProps) {
  return (
    <div className="mt-[15px] flex items-center gap-[13px] rounded-row border border-mint/28 bg-mint-soft px-[15px] py-[13px]">
      <span className="eyebrow-sm flex-shrink-0 text-mint">
        Next →
      </span>
      <InlineEdit
        value={text}
        onCommit={onEdit}
        multiline
        placeholder="Set the single next job-search action"
        ariaLabel="Edit next job-search action"
        displayClassName="text-[13.5px] leading-[1.5] text-ink-secondary"
        inputClassName="text-[13.5px] leading-[1.5] text-ink-secondary"
      />
    </div>
  );
}
