# Bryan Command Center

A private, ADHD-friendly daily operating system for choosing one mission, completing a focus block, moving a job search forward, keeping home responsibilities visible, and protecting creative momentum.

## Current release

- Editable mission, energy, stress, focus block, reward, daily touches, chores, projects, and Not Today list
- Persistent timestamp-based focus timer
- Editable job-search pipeline with live counts, status changes, additions, removals, and a single next action
- Daily checklist and focus-timer rollover using the user's local calendar day
- Weekly proof-of-movement history that records new completions without double-counting today
- Browser-local persistence across refreshes
- Private JSON backup download, validated restore, and guarded reset
- Responsive dark interface based on the approved Claude Design handoff

The application intentionally uses browser-local storage. No account, server database, or external service is required. Data does not automatically follow the user to another device; use **Download backup** before switching browsers or devices.

## Development

```bash
npm ci
npm run dev
```

Run the full quality gate before publishing:

```bash
npm run check
```

This runs ESLint, Vitest, TypeScript through the Next.js production build, and static page generation.

## Design source

The approved handoff is preserved under [`design_handoff_command_center`](./design_handoff_command_center).
