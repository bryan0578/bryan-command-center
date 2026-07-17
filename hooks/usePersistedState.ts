/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";

interface PersistedStateOptions<T> {
  migrationKey?: string;
  migrate?: (value: T) => T;
}

function readStoredValue<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/** Generic localStorage-persisted state with guarded hydration and optional one-time migrations. */
export function usePersistedState<T>(
  storageKey: string,
  seed: T,
  options?: PersistedStateOptions<T>,
) {
  const [value, setValue] = useState<T>(seed);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readStoredValue<T>(storageKey);
    let next = stored ?? seed;
    const shouldMigrate =
      options?.migrate &&
      (!options.migrationKey || window.localStorage.getItem(options.migrationKey) !== "done");

    if (shouldMigrate) {
      next = options.migrate!(next);
      if (options.migrationKey) window.localStorage.setItem(options.migrationKey, "done");
    }

    setValue(next);
    setHydrated(true);
    // Hydrate exactly once from the browser that owns this data.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(storageKey, JSON.stringify(value));
  }, [hydrated, value, storageKey]);

  return [value, setValue] as const;
}
