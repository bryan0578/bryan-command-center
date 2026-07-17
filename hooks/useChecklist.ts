/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState } from "react";

function readStoredIds(key: string): string[] | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every((id) => typeof id === "string")) {
      return parsed;
    }
  } catch {
    // malformed storage — fall back to seed defaults
  }
  return null;
}

/** Toggleable completion state for a set of row ids, persisted to localStorage. */
export function useChecklist(storageKey: string, defaultDoneIds: string[]) {
  const [completed, setCompleted] = useState<Set<string>>(() => new Set(defaultDoneIds));
  const hydrated = useRef(false);

  useEffect(() => {
    const stored = readStoredIds(storageKey);
    if (stored !== null) {
      setCompleted(new Set(stored));
    }
    hydrated.current = true;
    // Only ever reconcile against storage once, on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    window.localStorage.setItem(storageKey, JSON.stringify(Array.from(completed)));
  }, [completed, storageKey]);

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
