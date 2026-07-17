export const COMMAND_CENTER_PREFIX = "cc:";

export interface CommandCenterBackup {
  version: 1;
  exportedAt: string;
  data: Record<string, unknown>;
}

export function parseBackup(raw: string): CommandCenterBackup {
  const parsed: unknown = JSON.parse(raw);
  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("Backup must be a JSON object.");
  }

  const candidate = parsed as Partial<CommandCenterBackup>;
  if (candidate.version !== 1 || typeof candidate.data !== "object" || candidate.data === null) {
    throw new Error("This is not a supported Bryan Command Center backup.");
  }

  const entries = Object.entries(candidate.data);
  if (entries.some(([key]) => !key.startsWith(COMMAND_CENTER_PREFIX))) {
    throw new Error("Backup contains data outside Bryan Command Center.");
  }

  return {
    version: 1,
    exportedAt: typeof candidate.exportedAt === "string" ? candidate.exportedAt : "",
    data: Object.fromEntries(entries),
  };
}
