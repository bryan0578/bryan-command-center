import { describe, expect, it } from "vitest";
import { parseBackup } from "./backup";

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
});
