/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState } from "react";

function readStoredValue<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/** Generic localStorage-persisted state: hydrates once on mount, then persists on every change. */
export function usePersistedState<T>(storageKey: string, seed: T) {
  const [value, setValue] = useState<T>(seed);
  const hydrated = useRef(false);

  useEffect(() => {
    const stored = readStoredValue<T>(storageKey);
    if (stored !== null) setValue(stored);
    hydrated.current = true;
    // Only ever reconcile against storage once, on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    window.localStorage.setItem(storageKey, JSON.stringify(value));
  }, [value, storageKey]);

  return [value, setValue] as const;
}
