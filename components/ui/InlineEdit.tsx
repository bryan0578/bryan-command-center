"use client";

import { useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";

interface InlineEditProps {
  value: string;
  onCommit: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  ariaLabel?: string;
  displayClassName?: string;
  inputClassName?: string;
}

/** Click-to-edit text: click the display to reveal an input, Enter/blur commits, Escape cancels. */
export function InlineEdit({
  value,
  onCommit,
  placeholder = "Click to edit",
  multiline = false,
  ariaLabel,
  displayClassName = "",
  inputClassName = "",
}: InlineEditProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const commit = () => {
    onCommit(draft.trim());
    setEditing(false);
  };

  const cancel = () => {
    setDraft(value);
    setEditing(false);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft(e.target.value);

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      cancel();
    } else if (e.key === "Enter" && !(multiline && e.shiftKey)) {
      e.preventDefault();
      commit();
    }
  };

  if (editing) {
    const sharedClassName = `bc-focus-ring w-full resize-none bg-transparent ${inputClassName}`;
    return multiline ? (
      <textarea
        autoFocus
        rows={2}
        value={draft}
        onChange={onChange}
        onBlur={commit}
        onKeyDown={onKeyDown}
        aria-label={ariaLabel}
        className={sharedClassName}
      />
    ) : (
      <input
        type="text"
        autoFocus
        value={draft}
        onChange={onChange}
        onBlur={commit}
        onKeyDown={onKeyDown}
        aria-label={ariaLabel}
        className={sharedClassName}
      />
    );
  }

  const hasValue = value.trim().length > 0;
  return (
    <button
      type="button"
      onClick={() => {
        setDraft(value);
        setEditing(true);
      }}
      aria-label={ariaLabel}
      className={`bc-focus-ring block w-full text-left ${displayClassName} ${hasValue ? "" : "italic text-ink-muted"}`}
    >
      {hasValue ? value : placeholder}
    </button>
  );
}
