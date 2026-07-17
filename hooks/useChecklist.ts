/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState } from "react";

interface DatedChecklist {
  day: string;
  ids: string[];
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((id) => typeof id === "string");
}

function readStoredIds(key: string, day?: string): string[] | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return null;
    const parsed: unknown = JSON.parse(raw);
    // Migrate the original undated array format as today's state.
    if (isStringArray(parsed)) {
      return parsed;
    }
    if (
      day &&
      typeof parsed === "object" &&
      parsed !== null &&
      "day" in parsed &&
      "ids" in parsed
    ) {
      const dated = parsed as DatedChecklist;
      return dated.day === day && isStringArray(dated.ids) ? dated.ids : [];
    }
  } catch {
    // malformed storage — fall back to seed defaults
  }
  return null;
}

/** Toggleable completion state for a set of row ids, persisted to localStorage. */
export function useChecklist(storageKey: string, defaultDoneIds: string[], day?: string) {
  const [completed, setCompleted] = useState<Set<string>>(() => new Set(defaultDoneIds));
  const hydrated = useRef(false);

  useEffect(() => {
    const stored = readStoredIds(storageKey, day);
    if (stored !== null) {
      setCompleted(new Set(stored));
    }
    hydrated.current = true;
  }, [day, storageKey]);

  useEffect(() => {
    if (!hydrated.current) return;
    const ids = Array.from(completed);
    window.localStorage.setItem(storageKey, JSON.stringify(day ? { day, ids } : ids));
  }, [completed, day, storageKey]);

  const toggle = (id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return { completed, toggle };
}
