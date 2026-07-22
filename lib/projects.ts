import { projects as seededProjects } from "./data";
import {
  PROJECT_LIFECYCLE_STATES,
  type Project,
  type ProjectLifecycleState,
} from "./types";

const lifecycleStates = new Set<string>(PROJECT_LIFECYCLE_STATES);
const legacyDefaultProjects = new Map([
  ["p1", "Caleb Ash"],
  ["p2", "PrettyWise"],
  ["p3", "Blog / content"],
  ["p4", "Freelance / client"],
]);

type ProjectRecord = Record<string, unknown>;

export function isProjectLifecycleState(value: unknown): value is ProjectLifecycleState {
  return typeof value === "string" && lifecycleStates.has(value);
}

export function isValidProjectUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.trim() === "") return false;
  try {
    const url = new URL(value.trim());
    return (url.protocol === "https:" || url.protocol === "http:") && !url.username && !url.password;
  } catch {
    return false;
  }
}

export function isValidProjectDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function optionalText(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function optionalUrl(value: unknown): string | undefined {
  return isValidProjectUrl(value) ? value.trim() : undefined;
}

function optionalDate(value: unknown): string | undefined {
  return isValidProjectDate(value) ? value : undefined;
}

function lifecycleFrom(record: ProjectRecord, closureRecordUrl?: string): ProjectLifecycleState {
  const current = record.lifecycleState;
  if (isProjectLifecycleState(current)) {
    return current === "closed" && !closureRecordUrl ? "functionally-complete" : current;
  }

  const legacy = record.status;
  if (legacy === "complete") return closureRecordUrl ? "closed" : "functionally-complete";
  if (legacy === "active") return "active";
  if (legacy === "draft" || legacy === "idle" || legacy === "waiting") return "paused";
  return "paused";
}

export function normalizeProject(value: unknown): Project | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  const record = value as ProjectRecord;
  const id = optionalText(record.id);
  const name = optionalText(record.name);
  if (!id || !name) return null;

  const closureRecordUrl = optionalUrl(record.closureRecordUrl);
  return {
    id,
    name,
    lifecycleState: lifecycleFrom(record, closureRecordUrl),
    ...(optionalText(record.maintenanceTier) && { maintenanceTier: optionalText(record.maintenanceTier) }),
    ...(optionalDate(record.lastReviewDate) && { lastReviewDate: optionalDate(record.lastReviewDate) }),
    ...(optionalDate(record.nextReviewDate) && { nextReviewDate: optionalDate(record.nextReviewDate) }),
    ...(optionalText(record.reopeningTrigger) && { reopeningTrigger: optionalText(record.reopeningTrigger) }),
    ...(optionalUrl(record.repositoryUrl) && { repositoryUrl: optionalUrl(record.repositoryUrl) }),
    ...(optionalUrl(record.deploymentUrl) && { deploymentUrl: optionalUrl(record.deploymentUrl) }),
    ...(closureRecordUrl && { closureRecordUrl }),
  };
}

export function normalizeProjectBackup(value: unknown): Project[] {
  if (!Array.isArray(value)) throw new Error("Project portfolio backup must be an array.");
  return value.map((entry) => {
    const normalized = normalizeProject(entry);
    if (!normalized) throw new Error("Project portfolio backup contains an invalid project.");
    return normalized;
  });
}

/** Migrates browser-local project data and preserves the established portfolio seed behavior. */
export function migrateProjectPortfolio(value: unknown): Project[] {
  const existing = Array.isArray(value)
    ? value.map(normalizeProject).filter((project): project is Project => project !== null)
    : [];
  const preserved = existing.filter(
    (project) => legacyDefaultProjects.get(project.id) !== project.name,
  );
  const names = new Set(preserved.map((project) => project.name.toLocaleLowerCase()));
  return [
    ...preserved,
    ...seededProjects.filter((project) => !names.has(project.name.toLocaleLowerCase())),
  ];
}

const BCC_V1_ID = "portfolio-bcc";
const BCC_V1_CLOSURE_RECORD_URL =
  "https://github.com/bryan0578/bryan-command-center/blob/main/docs/CLOSURE.md";

/** Applies Bryan's evidence-backed BCC V1 closure to existing browser-local portfolios. */
export function migrateBccV1Closure(value: unknown): Project[] {
  return migrateProjectPortfolio(value).map((project) =>
    project.id === BCC_V1_ID
      ? {
          ...project,
          lifecycleState: "closed",
          closureRecordUrl: BCC_V1_CLOSURE_RECORD_URL,
        }
      : project,
  );
}

export function getProjectValidationError(project: Project): string | null {
  if (project.lifecycleState === "closed" && !isValidProjectUrl(project.closureRecordUrl)) {
    return "Closed requires a valid closure-record URL.";
  }
  if (project.repositoryUrl && !isValidProjectUrl(project.repositoryUrl)) {
    return "Repository URL must be a valid http(s) URL.";
  }
  if (project.deploymentUrl && !isValidProjectUrl(project.deploymentUrl)) {
    return "Deployment URL must be a valid http(s) URL.";
  }
  if (project.closureRecordUrl && !isValidProjectUrl(project.closureRecordUrl)) {
    return "Closure-record URL must be a valid http(s) URL.";
  }
  if (project.lastReviewDate && !isValidProjectDate(project.lastReviewDate)) {
    return "Last review date must be a valid date.";
  }
  if (project.nextReviewDate && !isValidProjectDate(project.nextReviewDate)) {
    return "Next review date must be a valid date.";
  }
  return null;
}

function localDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isProjectReviewDue(project: Project, now = new Date()): boolean {
  return Boolean(
    project.nextReviewDate &&
    isValidProjectDate(project.nextReviewDate) &&
    project.nextReviewDate < localDateKey(now),
  );
}
