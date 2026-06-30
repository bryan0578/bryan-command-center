"use client";

import { useCallback } from "react";
import { useSyncExternalStore } from "react";

type Listener = () => void;

const tabListeners = new Map<string, Set<Listener>>();
const snapshotCache = new Map<string, { raw: string | null; value: unknown }>();

function notifySameTab(key: string) {
  tabListeners.get(key)?.forEach((listener) => listener());
}

function subscribe(key: string, onStoreChange: Listener): () => void {
  if (!tabListeners.has(key)) tabListeners.set(key, new Set());
  tabListeners.get(key)!.add(onStoreChange);

  const onStorageEvent = (event: StorageEvent) => {
    if (event.key === key) onStoreChange();
  };
  window.addEventListener("storage", onStorageEvent);

  return () => {
    tabListeners.get(key)?.delete(onStoreChange);
    window.removeEventListener("storage", onStorageEvent);
  };
}

function readSnapshot<T>(key: string, parse: (raw: string | null) => T): T {
  const raw = window.localStorage.getItem(key);
  const cached = snapshotCache.get(key);
  if (cached && cached.raw === raw) return cached.value as T;
  const value = parse(raw);
  snapshotCache.set(key, { raw, value });
  return value;
}

/**
 * Reads a localStorage-backed value through React's external-store API:
 * SSR-safe (renders `serverValue` until hydrated, avoiding a mismatch) and
 * reactive to writes from `writeLocalStorageState`, including other tabs.
 */
export function useLocalStorageState<T>(
  key: string,
  parse: (raw: string | null) => T,
  serverValue: T,
): T {
  const subscribeToKey = useCallback((onStoreChange: Listener) => subscribe(key, onStoreChange), [key]);
  const getSnapshot = useCallback(() => readSnapshot(key, parse), [key, parse]);
  const getServerSnapshot = useCallback(() => serverValue, [serverValue]);

  return useSyncExternalStore(subscribeToKey, getSnapshot, getServerSnapshot);
}

/** Writes a value for `useLocalStorageState` to pick up, in this tab and others. */
export function writeLocalStorageState(key: string, raw: string | null): void {
  if (raw === null) {
    window.localStorage.removeItem(key);
  } else {
    window.localStorage.setItem(key, raw);
  }
  snapshotCache.delete(key);
  notifySameTab(key);
}
