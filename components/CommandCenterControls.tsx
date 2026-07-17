"use client";

const PREFIX = "cc:";

export function CommandCenterControls() {
  const downloadBackup = () => {
    const data: Record<string, unknown> = {};
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);
      if (!key?.startsWith(PREFIX)) continue;
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
  };

  const reset = () => {
    if (!window.confirm("Reset every Command Center section to its starting content? Download a backup first if you want to keep your changes.")) return;
    const keys = Array.from({ length: window.localStorage.length }, (_, index) => window.localStorage.key(index))
      .filter((key): key is string => Boolean(key?.startsWith(PREFIX)));
    keys.forEach((key) => window.localStorage.removeItem(key));
    window.location.reload();
  };

  return (
    <section className="flex flex-col gap-3 rounded-section border border-border-subtle bg-base p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="eyebrow-sm text-ink-muted">Your data</p>
        <p className="mt-1 text-sm text-ink-secondary">Saved privately in this browser. Download a backup before changing devices.</p>
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={downloadBackup} className="bc-focus-ring min-h-11 rounded-btn border border-border px-4 text-sm font-semibold hover:bg-elevated">Download backup</button>
        <button type="button" onClick={reset} className="bc-focus-ring min-h-11 rounded-btn border border-error/40 px-4 text-sm font-semibold text-error hover:bg-error-bg">Reset</button>
      </div>
    </section>
  );
}
