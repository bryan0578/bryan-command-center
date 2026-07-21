import { normalizeProjectBackup } from "./projects";

export const COMMAND_CENTER_PREFIX = "cc:";
export const PROJECTS_STORAGE_KEY = "cc:projects-content";

export interface CommandCenterBackup {
  version: 1;
  exportedAt: string;
  data: Record<string, unknown>;
}

export function createBackup(
  data: Record<string, unknown>,
  exportedAt = new Date(),
): CommandCenterBackup {
  return {
    version: 1,
    exportedAt: exportedAt.toISOString(),
    data,
  };
}

export function parseBackup(raw: string): CommandCenterBackup {
  const parsed: unknown = JSON.parse(raw);
  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("Backup must be a JSON object.");
  }

  const candidate = parsed as Partial<CommandCenterBackup>;
  if (
    candidate.version !== 1 ||
    typeof candidate.data !== "object" ||
    candidate.data === null ||
    Array.isArray(candidate.data)
  ) {
    throw new Error("This is not a supported Bryan Command Center backup.");
  }

  const entries = Object.entries(candidate.data);
  if (entries.some(([key]) => !key.startsWith(COMMAND_CENTER_PREFIX))) {
    throw new Error("Backup contains data outside Bryan Command Center.");
  }

  const data = Object.fromEntries(entries);
  if (PROJECTS_STORAGE_KEY in data) {
    data[PROJECTS_STORAGE_KEY] = normalizeProjectBackup(data[PROJECTS_STORAGE_KEY]);
  }

  return {
    version: 1,
    exportedAt: typeof candidate.exportedAt === "string" ? candidate.exportedAt : "",
    data,
  };
}
