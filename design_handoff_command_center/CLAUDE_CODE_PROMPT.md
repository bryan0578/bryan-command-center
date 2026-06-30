# Claude Code prompt — Personal Command Center (static Next.js MVP)

Copy everything in the box below into Claude Code, run from an empty project directory that also contains this handoff folder (`design_handoff_command_center/`). It builds the static MVP; Supabase comes in a later pass.

---

```
You are building the first static MVP of my **Personal Command Center** — a private, ADHD-friendly
daily dashboard. Everything you need is in ./design_handoff_command_center/. Read these first and
treat them as the source of truth:

  - design_handoff_command_center/README.md          ← full spec: structure, components, tokens,
                                                        interactions, empty states, data shapes,
                                                        Supabase schema, responsive rules
  - design_handoff_command_center/tokens/*.css       ← Bryan Cash Design System tokens (colors,
                                                        type, spacing) — the ONLY source for visual
                                                        values. Do not invent colors or fonts.
  - design_handoff_command_center/prototype/Command Center.dc.html
                                                     ← the approved final design. Read it for exact
                                                        markup, spacing, copy, and behavior. It is a
                                                        REFERENCE, not code to copy — recreate it in
                                                        React, do not port the HTML.

## Stack (use exactly this)
- Next.js (App Router) + TypeScript, strict mode
- Tailwind CSS — map the design tokens into tailwind.config.ts theme.extend (use the snippet in the
  README's "Tailwind theme snippet" section verbatim as the starting point)
- next/font for Sora, Inter, JetBrains Mono
- NO backend yet. All data comes from lib/data.ts (the typed seed in the README). NO Supabase client,
  NO API routes, NO auth in this pass. Structure the code so Supabase can be dropped in later (keep
  data access behind lib/data.ts and the types in lib/types.ts).

## Scope of THIS pass = high-fidelity static screen + local interactions
Build the single dashboard exactly as drawn, pixel-accurately, from seed data. Wire ONLY these
client interactions (state local to the browser, persisted in localStorage):
  1. Focus Block timer — elapsed-based (total = durationMinutes*60). One setInterval(1s) increments
     elapsed while running && elapsed<total; auto-stops at total. Button state machine: Start → Pause
     → Resume → "Block complete — nice" (disabled); Reset zeroes it. Progress bar width = elapsed/total.
     Persist {elapsed, running, startedAt}; reconcile on reload.
  2. Checkboxes — 3 Touches and Home Reset rows toggle done; whole row is the hit target (>=44px).
     Persist completed ids.
  3. Reward unlock — derived from the timer: unlocked = remaining<=0. Locked = dashed/muted; unlocked
     = gold border + tinted bg + "Start reward →" button. Keep the Connector tether above it.
  4. Proof of Movement counters — compute from completion state for the current ISO week (don't
     hand-set). For the static MVP, derive from the seed movement data + live checkbox toggles so the
     numbers move when I check things off. Allow a manual override for the "Tasks finished" total.
Everything else (editing fields, adding roles/chores, Supabase) is OUT of scope for this pass — leave
clean TODO seams.

## Layout (match the README "Page structure" table exactly)
Centered max-w-[1280px] column, gap-[18px], bg canvas (#070A0D), padding 36/32/48:
  1. MissionBar (elevated, full width) — eyebrow+date, mint-bar focus statement, Energy/Stress meters
  2. ProofStrip (flat, full width, slim) — gold label + "showed up N of 5 days" + 4 inline stats
  3. Primary Action Row — 2-col grid lg:grid-cols-[1.04fr_0.96fr]:
       LEFT  = FocusBlock (elevated, the strongest card) → Connector → RewardCard (flat)
       RIGHT = JobSearchTracker (flat, tall) — count tiles, role rows, NextAction
  4. ThreeTouches — full-width ELEVATED band, 3 equal touch cards (this is intentionally weighty)
  5. Supporting Row — 2-col: HomeReset / CreativeProjects
  6. NotToday — full-width dashed parking-lot card with pill chips

## Components
Build reusable primitives in components/ui/ first: Card (default/elevated/dashed), Eyebrow, Button
(primary/secondary/sm), StatusChip, Callout, Checkbox, SegmentMeter, ProgressBar. Then the feature
components and the Dashboard, per the README's "Suggested Next.js component breakdown". Only FocusBlock,
the checkbox rows, and the proof counters need 'use client'.

## Data
Create lib/types.ts and lib/data.ts using the EXACT typed seed in the README ("Static placeholder data
structure"). Render every section from it. Keep the status-chip color map: applied/active→aqua,
follow_up/waiting→warning/info, saved/idle→muted, draft→violet.

## Visual fidelity rules
- Dark mode only. Solid fills, no gradients except the mint-soft callout/next-action tint.
- Mint = primary action/active only (laser pointer, not a paint bucket). Aqua = structure. Gold =
  reward + proof, max ~3 uses/page. Violet = creative only. ~70% neutral surfaces overall.
- Mono (JetBrains) for eyebrows, labels, status chips, timer digits, stat captions. Sora for the focus
  statement + stat numbers. Inter for body.
- Radii: chips 6 / buttons 9 / rows 9-11 / cards 12-16 / pills 999. Elevated shadow 0 6px 20px rgba(0,0,0,.28).
- Motion 120-180ms cubic-bezier(.4,0,.2,1); timer fill 1000ms linear; running dot pulses opacity 1↔.3.
- Add an aqua focus ring (0 0 0 3px rgba(56,217,242,.18)) and keyboard support on checkboxes/buttons.

## Empty states
Implement the variants in the README "Empty states" table (in-voice copy: direct, calm, supportive,
lightly witty — never guilt-inducing).

## Responsive
Per the README: lg = as drawn; md = Primary Action Row stacks to 1 col, padding 24; <768 = everything
single column, Proof stats 2x2, timer ~44px, padding 16, tap targets >=44px.

## Deliverables
- A running `npm run dev` app showing the dashboard 1:1 with the prototype.
- tailwind.config.ts with the token theme; app/layout.tsx with the three fonts and bg-canvas.
- All components typed; no `any`. lib/data.ts + lib/types.ts as the single data seam.
- A short README in the repo: how to run it, and a "Next steps: Supabase" section listing the tables
  from the handoff README so the backend pass is obvious.

Work in this order: (1) Tailwind theme + fonts + ui/ primitives, (2) static Dashboard from seed —
match the prototype exactly, (3) timer + checkboxes + reward + live proof via localStorage,
(4) empty states. Show me the dashboard after step 2 before wiring interactions.
```

---

**Tip:** keep `design_handoff_command_center/` in the repo root while Claude Code works — it reads the README, tokens, and prototype directly. After the static screen matches, run a second prompt for the Supabase pass using the schema in the handoff README.
