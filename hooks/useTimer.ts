/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState } from "react";
import { totalSeconds } from "@/lib/timer";

interface PersistedTimer {
  baseElapsed: number;
  running: boolean;
  startedAt: number | null;
  day?: string;
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
export function useTimer(storageKey: string, durationMinutes: number, day?: string) {
  const total = totalSeconds(durationMinutes);
  const [state, setState] = useState<PersistedTimer>(IDLE);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const hydrated = useRef(false);

  useEffect(() => {
    const stored = readStorage(storageKey);
    if (stored && (!day || !stored.day || stored.day === day)) {
      const now = Date.now();
      const elapsed = liveElapsed(stored, total, now);
      const done = elapsed >= total;
      const reconciled: PersistedTimer = done
        ? { baseElapsed: total, running: false, startedAt: null, day }
        : { baseElapsed: elapsed, running: stored.running, startedAt: stored.running ? now : null, day };
      setState(reconciled);
      setElapsedSeconds(elapsed);
    } else if (stored) {
      setState({ ...IDLE, day });
      setElapsedSeconds(0);
    }
    hydrated.current = true;
  }, [day, storageKey, total]);

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
        setState({ baseElapsed: total, running: false, startedAt: null, day });
      }
    }, 1000);
    return () => clearInterval(id);
  }, [day, state, total]);

  const toggle = () => {
    setState((prev) => {
      if (prev.baseElapsed >= total) return prev;
      const now = Date.now();
      if (prev.running) {
        return { baseElapsed: liveElapsed(prev, total, now), running: false, startedAt: null, day };
      }
      return { baseElapsed: prev.baseElapsed, running: true, startedAt: now, day };
    });
  };

  const reset = () => setState({ ...IDLE, day });

  return { elapsedSeconds: Math.floor(elapsedSeconds), running: state.running, toggle, reset };
}
