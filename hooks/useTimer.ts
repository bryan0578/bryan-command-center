/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState } from "react";
import { totalSeconds } from "@/lib/timer";

interface PersistedTimer {
  baseElapsed: number;
  running: boolean;
  startedAt: number | null;
}

const IDLE: PersistedTimer = { baseElapsed: 0, running: false, startedAt: null };

function readStorage(key: string): PersistedTimer | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      typeof parsed.baseElapsed === "number" &&
      typeof parsed.running === "boolean" &&
      (parsed.startedAt === null || typeof parsed.startedAt === "number")
    ) {
      return parsed as PersistedTimer;
    }
  } catch {
    // malformed storage — fall back to idle
  }
  return null;
}

function liveElapsed(state: PersistedTimer, total: number, now: number): number {
  const raw =
    state.running && state.startedAt !== null
      ? state.baseElapsed + (now - state.startedAt) / 1000
      : state.baseElapsed;
  return Math.min(total, Math.max(0, raw));
}

/**
 * Elapsed-based Focus Block timer. Tracks {baseElapsed, running, startedAt}
 * instead of ticking a countdown directly, so a refresh mid-block can
 * reconcile elapsed time from wall-clock time rather than drifting.
 */
export function useTimer(storageKey: string, durationMinutes: number) {
  const total = totalSeconds(durationMinutes);
  const [state, setState] = useState<PersistedTimer>(IDLE);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const hydrated = useRef(false);

  useEffect(() => {
    const stored = readStorage(storageKey);
    if (stored) {
      const now = Date.now();
      const elapsed = liveElapsed(stored, total, now);
      const done = elapsed >= total;
      const reconciled: PersistedTimer = done
        ? { baseElapsed: total, running: false, startedAt: null }
        : { baseElapsed: elapsed, running: stored.running, startedAt: stored.running ? now : null };
      setState(reconciled);
      setElapsedSeconds(elapsed);
    }
    hydrated.current = true;
    // Only ever reconcile against storage once, on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state, storageKey]);

  useEffect(() => {
    if (!state.running) {
      setElapsedSeconds(state.baseElapsed);
      return;
    }
    const id = setInterval(() => {
      const now = Date.now();
      const elapsed = liveElapsed(state, total, now);
      setElapsedSeconds(elapsed);
      if (elapsed >= total) {
        setState({ baseElapsed: total, running: false, startedAt: null });
      }
    }, 1000);
    return () => clearInterval(id);
  }, [state, total]);

  const toggle = () => {
    setState((prev) => {
      if (prev.baseElapsed >= total) return prev;
      const now = Date.now();
      if (prev.running) {
        return { baseElapsed: liveElapsed(prev, total, now), running: false, startedAt: null };
      }
      return { baseElapsed: prev.baseElapsed, running: true, startedAt: now };
    });
  };

  const reset = () => setState(IDLE);

  return { elapsedSeconds: Math.floor(elapsedSeconds), running: state.running, toggle, reset };
}
