export interface TimerView {
  time: string;
  pct: number;
  running: boolean;
  done: boolean;
  unlocked: boolean;
  locked: boolean;
  totalLabel: string;
  btnLabel: string;
}

export function totalSeconds(durationMinutes: number): number {
  return (Number.isFinite(durationMinutes) && durationMinutes > 0 ? durationMinutes : 20) * 60;
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** Pure projection from raw elapsed/running state to everything the FocusBlock UI needs. */
export function computeTimerView(
  durationMinutes: number,
  elapsedSeconds: number,
  running: boolean,
): TimerView {
  const total = totalSeconds(durationMinutes);
  const elapsed = Math.min(elapsedSeconds, total);
  const remaining = total - elapsed;
  const done = remaining <= 0;
  const mins = Math.round(total / 60);

  return {
    time: formatTime(Math.max(0, remaining)),
    pct: total ? (elapsed / total) * 100 : 0,
    running: running && !done,
    done,
    unlocked: done,
    locked: !done,
    totalLabel: `${mins}-minute block`,
    btnLabel: done
      ? "Block complete — nice"
      : running
        ? "Pause block"
        : elapsed > 0
          ? "Resume block"
          : `Start ${mins}-min block`,
  };
}
