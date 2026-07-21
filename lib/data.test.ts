import { describe, expect, it } from "vitest";
import { projects } from "./data";
import { migrateProjectPortfolio } from "./projects";

describe("project portfolio migration", () => {
  it("replaces untouched prototype projects and preserves personal additions", () => {
    const migrated = migrateProjectPortfolio([
      { id: "p1", name: "Caleb Ash", status: "draft" },
      { id: "custom", name: "My private project", status: "waiting" },
    ]);

    expect(migrated.some((project) => project.name === "Caleb Ash")).toBe(false);
    expect(migrated).toContainEqual({
      id: "custom",
      name: "My private project",
      lifecycleState: "paused",
    });
    expect(migrated).toEqual(
      expect.arrayContaining(projects.map((project) => expect.objectContaining({ id: project.id }))),
    );
  });

  it("does not duplicate portfolio projects already in storage", () => {
    const migrated = migrateProjectPortfolio([projects[0]]);
    expect(migrated.filter((project) => project.name === projects[0].name)).toHaveLength(1);
  });
});
