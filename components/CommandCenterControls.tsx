"use client";

import { useRef, useState } from "react";
import { COMMAND_CENTER_PREFIX, parseBackup } from "@/lib/backup";

export function CommandCenterControls() {
  const restoreInput = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");

  const downloadBackup = () => {
    const data: Record<string, unknown> = {};
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);
      if (!key?.startsWith(COMMAND_CENTER_PREFIX)) continue;
      const raw = window.localStorage.getItem(key);
      if (raw === null) continue;
      try {
        data[key] = JSON.parse(raw);
      } catch {
        data[key] = raw;
      }
    }

    const blob = new Blob(
      [JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), data }, null, 2)],
      { type: "application/json" },
    );
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `bryan-command-center-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
    setMessage("Backup downloaded.");
  };

  const restoreBackup = async (file: File | undefined) => {
    if (!file) return;
    try {
      if (file.size > 1_000_000) throw new Error("Backup file is unexpectedly large.");
      const backup = parseBackup(await file.text());
      const count = Object.keys(backup.data).length;
      if (!window.confirm(`Replace this browser's Command Center data with ${count} backup sections?`)) return;

      const existingKeys = Array.from(
        { length: window.localStorage.length },
        (_, index) => window.localStorage.key(index),
      ).filter((key): key is string => Boolean(key?.startsWith(COMMAND_CENTER_PREFIX)));
      existingKeys.forEach((key) => window.localStorage.removeItem(key));
      Object.entries(backup.data).forEach(([key, value]) => {
        window.localStorage.setItem(key, JSON.stringify(value));
      });
      window.location.reload();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not restore this backup.");
    } finally {
      if (restoreInput.current) restoreInput.current.value = "";
    }
  };

  const reset = () => {
    if (!window.confirm("Reset every Command Center section to its starting content? Download a backup first if you want to keep your changes.")) return;
    const keys = Array.from({ length: window.localStorage.length }, (_, index) => window.localStorage.key(index))
      .filter((key): key is string => Boolean(key?.startsWith(COMMAND_CENTER_PREFIX)));
    keys.forEach((key) => window.localStorage.removeItem(key));
    window.location.reload();
  };

  return (
    <section className="flex flex-col gap-3 rounded-section border border-border-subtle bg-base p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="eyebrow-sm text-ink-muted">Your data</p>
        <p className="mt-1 text-sm text-ink-secondary">Saved privately in this browser. Download a backup before changing devices.</p>
        {message && <p className="mt-1 text-xs text-mint" aria-live="polite">{message}</p>}
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={downloadBackup} className="bc-focus-ring min-h-11 rounded-btn border border-border px-4 text-sm font-semibold hover:bg-elevated">Download backup</button>
        <button type="button" onClick={() => restoreInput.current?.click()} className="bc-focus-ring min-h-11 rounded-btn border border-border px-4 text-sm font-semibold hover:bg-elevated">Restore backup</button>
        <button type="button" onClick={reset} className="bc-focus-ring min-h-11 rounded-btn border border-error/40 px-4 text-sm font-semibold text-error hover:bg-error-bg">Reset</button>
        <input
          ref={restoreInput}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          aria-label="Choose Command Center backup"
          onChange={(event) => void restoreBackup(event.target.files?.[0])}
        />
      </div>
    </section>
  );
}
