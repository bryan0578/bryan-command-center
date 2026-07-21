import { describe, expect, it } from "vitest";
import { createBackup, parseBackup } from "./backup";
import type { Project } from "./types";

describe("command center backups", () => {
  it("accepts the current backup format", () => {
    const backup = parseBackup(JSON.stringify({
      version: 1,
      exportedAt: "2026-07-17T12:00:00.000Z",
      data: { "cc:mission": { primaryFocus: "Finish the app" } },
    }));

    expect(backup.data["cc:mission"]).toEqual({ primaryFocus: "Finish the app" });
  });

  it("rejects unsupported or unrelated data", () => {
    expect(() => parseBackup("{}")) .toThrow(/not a supported/i);
    expect(() => parseBackup(JSON.stringify({ version: 1, data: { unrelated: true } })))
      .toThrow(/outside Bryan Command Center/i);
  });

  it("round-trips every lifecycle field", () => {
    const project: Project = {
      id: "mission-control",
      name: "Mission Control",
      lifecycleState: "maintenance",
      maintenanceTier: "Operator reviewed",
      lastReviewDate: "2026-07-20",
      nextReviewDate: "2026-08-20",
      reopeningTrigger: "Scope changes",
      repositoryUrl: "https://github.com/bryan0578/bryan-command-center",
      deploymentUrl: "https://example.com/command-center",
      closureRecordUrl: "https://github.com/bryan0578/bryan-command-center/blob/main/docs/CLOSURE.md",
    };
    const exported = createBackup(
      { "cc:projects-content": [project] },
      new Date("2026-07-21T12:00:00.000Z"),
    );
    const restored = parseBackup(JSON.stringify(exported));

    expect(restored.data["cc:projects-content"]).toEqual([project]);
  });

  it("accepts and migrates a legacy project backup", () => {
    const restored = parseBackup(JSON.stringify({
      version: 1,
      data: {
        "cc:projects-content": [
          { id: "legacy", name: "Legacy project", status: "complete" },
        ],
      },
    }));

    expect(restored.data["cc:projects-content"]).toEqual([
      { id: "legacy", name: "Legacy project", lifecycleState: "functionally-complete" },
    ]);
  });

  it("safely normalizes invalid lifecycle values", () => {
    const restored = parseBackup(JSON.stringify({
      version: 1,
      data: {
        "cc:projects-content": [
          { id: "invalid", name: "Invalid lifecycle", lifecycleState: "auto-closed" },
        ],
      },
    }));

    expect(restored.data["cc:projects-content"]).toEqual([
      { id: "invalid", name: "Invalid lifecycle", lifecycleState: "paused" },
    ]);
  });
});
