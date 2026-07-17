import { describe, expect, it } from "vitest";
import { computeTimerView, formatTime, totalSeconds } from "./timer";

describe("focus timer", () => {
  it("uses a safe fallback for invalid durations", () => {
    expect(totalSeconds(0)).toBe(1_200);
    expect(totalSeconds(Number.NaN)).toBe(1_200);
  });

  it("formats remaining time", () => {
    expect(formatTime(65)).toBe("1:05");
  });

  it("projects start, pause, resume, and completion labels", () => {
    expect(computeTimerView(20, 0, false).btnLabel).toBe("Start 20-min block");
    expect(computeTimerView(20, 10, true).btnLabel).toBe("Pause block");
    expect(computeTimerView(20, 10, false).btnLabel).toBe("Resume block");
    const done = computeTimerView(20, 1_500, true);
    expect(done.done).toBe(true);
    expect(done.running).toBe(false);
    expect(done.pct).toBe(100);
  });
});
