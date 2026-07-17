import { describe, expect, it } from "vitest";
import { computeProof, startOfISOWeek } from "./week";

describe("weekly proof", () => {
  it("starts ISO weeks on Monday", () => {
    const monday = startOfISOWeek(new Date("2026-07-19T12:00:00"));
    expect(monday.getDay()).toBe(1);
    expect(monday.getHours()).toBe(0);
  });

  it("combines this week's history with today's completed work", () => {
    const proof = computeProof({
      now: new Date("2026-07-17T12:00:00"),
      movementLog: [
        { id: "m1", type: "career", sourceId: "r1", createdAt: "2026-07-15T12:00:00Z" },
        { id: "old", type: "creative", sourceId: "p1", createdAt: "2026-07-01T12:00:00Z" },
      ],
      touches: [
        { id: "career", category: "career", label: "Apply", done: true },
        { id: "home", category: "home", label: "Reset", done: true },
        { id: "creative", category: "creative", label: "Create", done: false },
      ],
      chores: [{ id: "c1", label: "Dishes", done: true }],
    });

    expect(proof).toMatchObject({ career: 2, chores: 2, creative: 0, tasks: 4 });
  });

  it("honors a user task-count override", () => {
    const proof = computeProof({
      now: new Date("2026-07-17T12:00:00"),
      movementLog: [],
      touches: [],
      chores: [],
      tasksOverride: 9,
    });
    expect(proof.tasks).toBe(9);
  });
});
