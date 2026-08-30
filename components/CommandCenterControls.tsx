"use client";

import { useEffect, useRef, useState } from "react";
import { COMMAND_CENTER_PREFIX, createBackup, parseBackup } from "@/lib/backup";

type PendingAction =
  | { type: "restore"; file: File; count: number; data: Record<string, unknown> }
  | { type: "reset" }
  | null;

export function CommandCenterControls() {
  const restoreInput = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  useEffect(() => {
    if (!pendingAction) return;
    const timeout = window.setTimeout(() => setPendingAction(null), 8000);
    return () => window.clearTimeout(timeout);
  }, [pendingAction]);

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

    const blob = new Blob([JSON.stringify(createBackup(data), null, 2)], {
      type: "application/json",
    });
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
      if (file.size > 1_000_000)
        throw new Error("Backup file is unexpectedly large.");
      const backup = parseBackup(await file.text());
      setPendingAction({
        type: "restore",
        file,
        count: Object.keys(backup.data).length,
        data: backup.data,
      });
      setMessage("Review the restore confirmation below.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not restore this backup.",
      );
      if (restoreInput.current) restoreInput.current.value = "";
    }
  };

  const confirmRestore = () => {
    if (pendingAction?.type !== "restore") return;
    const existingKeys = Array.from(
      { length: window.localStorage.length },
      (_, index) => window.localStorage.key(index),
    ).filter((key): key is string =>
      Boolean(key?.startsWith(COMMAND_CENTER_PREFIX)),
    );
    existingKeys.forEach((key) => window.localStorage.removeItem(key));
    Object.entries(pendingAction.data).forEach(([key, value]) => {
      window.localStorage.setItem(key, JSON.stringify(value));
    });
    window.location.reload();
  };

  const requestReset = () => {
    setPendingAction({ type: "reset" });
    setMessage("Review the reset confirmation below.");
  };

  const confirmReset = () => {
    const keys = Array.from(
      { length: window.localStorage.length },
      (_, index) => window.localStorage.key(index),
    ).filter((key): key is string =>
      Boolean(key?.startsWith(COMMAND_CENTER_PREFIX)),
    );
    keys.forEach((key) => window.localStorage.removeItem(key));
    window.location.reload();
  };

  const cancelPending = () => {
    setPendingAction(null);
    if (restoreInput.current) restoreInput.current.value = "";
    setMessage("No data was changed.");
  };

  return (
    <section className="flex flex-col gap-3 rounded-section border border-border-subtle bg-base p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="eyebrow-sm text-ink-muted">Your data</p>
        <p className="mt-1 text-sm text-ink-secondary">
          Saved privately in this browser. Download a backup before changing devices.
        </p>
        {message && (
          <p className="mt-1 text-xs text-mint" aria-live="polite">
            {message}
          </p>
        )}
        {pendingAction && (
          <div className="mt-3 rounded-btn border border-aqua/30 bg-elevated p-3 text-sm">
            <p className="font-semibold text-ink-primary">
              {pendingAction.type === "restore"
                ? `Replace this browser's Command Center data with ${pendingAction.count} backup sections?`
                : "Reset every Command Center section to its starting content?"}
            </p>
            <p className="mt-1 text-xs text-ink-muted">
              {pendingAction.type === "restore"
                ? "Current Command Center data in this browser will be replaced."
                : "Your current local changes will be removed. Download a backup first if you may want them later."}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={cancelPending}
                className="bc-focus-ring min-h-11 rounded-btn border border-border px-4 text-sm font-semibold hover:bg-base"
              >
                Keep current data
              </button>
              <button
                type="button"
                onClick={pendingAction.type === "restore" ? confirmRestore : confirmReset}
                className="bc-focus-ring min-h-11 rounded-btn border border-error/50 bg-error-bg px-4 text-sm font-semibold text-error"
              >
                {pendingAction.type === "restore" ? "Replace data" : "Reset everything"}
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2 sm:justify-end">
        <button
          type="button"
          onClick={downloadBackup}
          className="bc-focus-ring min-h-11 rounded-btn border border-border px-4 text-sm font-semibold hover:bg-elevated"
        >
          Download backup
        </button>
        <button
          type="button"
          onClick={() => restoreInput.current?.click()}
          className="bc-focus-ring min-h-11 rounded-btn border border-border px-4 text-sm font-semibold hover:bg-elevated"
        >
          Restore backup
        </button>
        <button
          type="button"
          onClick={requestReset}
          className="bc-focus-ring min-h-11 rounded-btn border border-error/40 px-4 text-sm font-semibold text-error hover:bg-error-bg"
        >
          Reset
        </button>
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
