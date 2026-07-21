import { describe, expect, it } from "vitest";
import {
  getProjectValidationError,
  isProjectReviewDue,
  migrateProjectPortfolio,
  normalizeProject,
} from "./projects";
import type { Project } from "./types";

describe("project lifecycle migration", () => {
  it("migrates legacy complete to functionally-complete without closure evidence", () => {
    const migrated = migrateProjectPortfolio([
      { id: "portfolio-dorsyth", name: "Dorsyth Records Website V1", status: "complete" },
      { id: "portfolio-bcc", name: "Bryan Command Center V1", status: "complete" },
      { id: "portfolio-lcc", name: "Life Command Center V1", status: "complete" },
      { id: "portfolio-nexus", name: "Nexus Platform Foundation", status: "complete" },
    ]);

    for (const id of ["portfolio-dorsyth", "portfolio-bcc", "portfolio-lcc", "portfolio-nexus"]) {
      expect(migrated.find((project) => project.id === id)?.lifecycleState)
        .toBe("functionally-complete");
    }
  });

  it("is idempotent", () => {
    const once = migrateProjectPortfolio([
      { id: "custom", name: "Custom", status: "waiting", maintenanceTier: "Light" },
    ]);
    expect(migrateProjectPortfolio(once)).toEqual(once);
  });

  it("rejects closed without a closure-record URL", () => {
    const project: Project = { id: "p1", name: "Unverified closure", lifecycleState: "closed" };
    expect(getProjectValidationError(project)).toMatch(/closure-record URL/i);
  });

  it("accepts closed with valid closure evidence", () => {
    const project: Project = {
      id: "p1",
      name: "Verified closure",
      lifecycleState: "closed",
      closureRecordUrl: "https://github.com/example/project/blob/main/docs/CLOSURE.md",
    };
    expect(getProjectValidationError(project)).toBeNull();
    expect(normalizeProject({
      id: project.id,
      name: project.name,
      status: "complete",
      closureRecordUrl: project.closureRecordUrl,
    })).toEqual(project);
  });

  it("drops malformed optional metadata safely", () => {
    expect(normalizeProject({
      id: "p1",
      name: "Safe metadata",
      lifecycleState: "active",
      repositoryUrl: "not a URL",
      lastReviewDate: "2026-02-30",
      maintenanceTier: 3,
    })).toEqual({ id: "p1", name: "Safe metadata", lifecycleState: "active" });
  });

  it("marks an overdue review without changing lifecycle state", () => {
    const project: Project = {
      id: "p1",
      name: "Review me",
      lifecycleState: "active",
      nextReviewDate: "2026-07-20",
    };
    expect(isProjectReviewDue(project, new Date(2026, 6, 21, 12))).toBe(true);
    expect(project.lifecycleState).toBe("active");
    expect(isProjectReviewDue({ ...project, nextReviewDate: "2026-07-21" }, new Date(2026, 6, 21, 12)))
      .toBe(false);
  });
});
