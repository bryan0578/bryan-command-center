# Handoff: Personal Command Center

A private, ADHD-friendly daily operating system. One screen that answers four questions the moment it loads:

1. **What matters today?** → Mission Bar
2. **What do I do first?** → First Focus Block ("Do this first")
3. **What progress have I made?** → Proof of Movement + per-section completion
4. **What am I intentionally NOT doing today?** → Not Today

Target stack: **Next.js (App Router) + TypeScript + Tailwind CSS + Supabase-ready** structure. Goal of the first pass: a **static MVP** — render every section from local seed data with the timer, checkboxes, reward unlock, and proof counters working client-side. Wire Supabase after the static screen matches the prototype.

---

## About the design files

The files in `prototype/` are a **design reference created in HTML**, not production code to copy line-for-line. It is a prototype that shows the intended look, layout, copy, and behavior. Your job is to **recreate it in Next.js + TypeScript + Tailwind** using idiomatic React components and the design tokens below — not to ship the HTML.

- `prototype/Command Center.dc.html` — the approved final design (a "Design Component" — its `<x-dc>` template + a `class Component` logic block). Read it for exact markup, spacing, and copy. It references a design-system bundle at `_ds/…`; that bundle is **not** required for the Next.js build — the real source of truth is the token files below.
- `tokens/colors.css`, `tokens/typography.css`, `tokens/spacing.css` — the **Bryan Cash Design System** tokens. Port these verbatim into your Tailwind theme.

## Fidelity: High

Final colors, type, spacing, radii, and interactions are all settled. Recreate it **pixel-accurately** with Tailwind, mapping the design tokens to your theme. Don't invent new colors or fonts — everything traces to a token.

---

## Page structure (top → bottom, single scrolling column)

The whole page is centered in a `max-width: 1280px` column with `gap: 18px` between sections, on a near-black canvas (`#070A0D`), `padding: 36px 32px 48px`.

| # | Section | Layout | Emphasis |
|---|---------|--------|----------|
| 1 | **Mission Bar** | Full-width elevated card. Flex row, wraps: left = mission text, right = energy/stress meter panel | Primary anchor |
| 2 | **Proof of Movement** | Full-width flat card. Slim horizontal strip: label left, 4 inline stats right | Secondary, near top |
| 3 | **Primary Action Row** | 2-col grid `minmax(0,1.04fr) minmax(0,0.96fr)`. **Left** = Focus Block (elevated) → connector → Reward (flat). **Right** = Job Search Tracker (flat, tall) | Strongest action + career |
| 4 | **Today's 3 Touches** | Full-width **elevated** band; 3 equal touch cards in a grid | Elevated weight, sits with focus block |
| 5 | **Supporting Row** | 2-col grid: Home Reset / Creative Projects | Supporting |
| 6 | **Not Today** | Full-width dashed card; pill chips | De-emphasized parking lot |

Order is intentional: the timer and reward live high; trackers and the parking lot fall below the fold.

---

## Component inventory

### Primitives (build once, in `components/ui/`)
- **Card** — surface container. Variants: `default` (bg `surface-card`, 1px `border-default`), `elevated` (bg `surface-elevated`, 1px `border-strong`, shadow `0 6px 20px rgba(0,0,0,.28)`), `dashed` (bg `surface-base`, 1px dashed `border-default`). Radius `12–16px`, padding `20–24px`.
- **Eyebrow** — mono uppercase kicker. `JetBrains Mono`, 12px, weight 600, letter-spacing `0.08em`, color varies (mint / aqua / gold / violet / muted / primary).
- **Button** — `primary` (bg Cash Mint, ink text, hover → Aqua), `secondary` (transparent, 1px `border-default`, hover bg `surface-elevated`), `sm` size. Radius `9px`, weight 600, transition `180ms cubic-bezier(.4,0,.2,1)`.
- **StatusChip** — mono uppercase tag with tinted bg + 1px tinted border. Tones: `aqua/info`, `warning`, `muted/neutral`, `violet/draft`, `mint/active`. Radius `6px`, ~10px text.
- **Callout** — left-accent aside (3px border-left) with a typed mono label + body. Used for "Definition of done" (type `technical`, aqua accent).
- **Checkbox** — 20–22px rounded square. Unchecked: 1px `border-strong` on `surface-card`. Checked: solid Cash Mint fill, ink `✓`.
- **SegmentMeter** — 5 pill segments (`21–24 × 6px`); first N filled in an accent (energy = mint, stress = aqua), rest `border-default`. Right-aligned text label.
- **ProgressBar** — 8px track (`border-default`) + mint fill, `width` = % complete, `transition: width 1000ms linear`.

### Feature components
- **MissionBar** — Eyebrow + date · mint-bar focus statement (Sora 21px/650) · SegmentMeter×2 (Energy, Stress).
- **ProofStrip** — gold Eyebrow + "showed up N of 5 days" · 4 stat items (number Sora 23px/700 + mono caption). Career=aqua, Chores=mint, Creative=violet, Tasks=gold.
- **FocusBlock** — Eyebrow + "Do this first" pill + "Responsibility" tag · task title (17px/600) · Callout (definition of done) · big timer (mono 54px) + ProgressBar · Start/Pause + Reset buttons.
- **Connector** — thin label "Finish the block to unlock your reward" + hairline + gold `↓`. Purely visual tether between FocusBlock and Reward.
- **RewardCard** — gold Eyebrow. Locked: dashed inner box + empty checkbox glyph + muted reward text. Unlocked: gold border + tinted bg + "Start reward →" button.
- **ThreeTouches** — elevated band; header (label + "One each" mint pill + rule caption) + 3 **TouchCard**s (category Eyebrow in category color, Checkbox, task text 14.5px).
- **JobSearchTracker** — Eyebrow + "Career progress" · 3 count tiles (Saved/Applied/Follow-ups) · role rows (**RoleRow**: company + title + StatusChip) · **NextAction** highlight (mint-soft bg, "Next →" + sentence).
- **HomeReset** — Eyebrow + "15-min" mint chip · **ChoreRow** list (Checkbox + label).
- **CreativeProjects** — violet Eyebrow · **ProjectRow** list (name + StatusChip: Draft/Active/Idle/Waiting).
- **NotToday** — muted Eyebrow + italic caption · pill chips (parked items).

---

## Design tokens used

Port these into `tailwind.config.ts` `theme.extend`. Full source in `tokens/*.css`.

### Colors (hex)
```
// Surfaces (step up in lightness)
canvas      #070A0D   base        #0B1117   card     #101923
elevated    #17212D   subtle      #243241

// Text
primary     #F7FAFC   secondary   #CBD5E1   muted    #8A97A8
disabled    #526173   inverse     #0B1117   (on mint)

// Brand accents — usage budget ~70% neutral / 20% structured / 7% mint·aqua / 3% gold·violet
mint   (primary action)   #5EF2C2     brand-soft (mint tint)  #0F2E28
aqua   (structure)        #38D9F2
gold   (premium, ≤3/page) #D6B46A
violet (creative only)    #A78BFA

// Borders
subtle #17212D   default #243241   strong #334155   accent #5EF2C2   focus #38D9F2

// Status (functional only, always with a label)
success #22C55E/#052E1A   warning #F59E0B/#3A2503   error #EF4444/#3B0A0A
info    #3B82F6/#071D3A   draft   #8B5CF6/#24103F
```

### Typography
- **Sora** — headings/display (focus statement, stat numbers). Negative tracking on large sizes (`-0.02em`), weight 650–700.
- **Inter** — body/UI. Min 13px in dense UI; 16–17px for primary body.
- **JetBrains Mono** — eyebrows, labels, status chips, the timer digits, stat captions. Letter-spacing `0.05–0.08em`, uppercase for labels.
- Key sizes in use: timer 54px · focus statement 21px · stat numbers 23–26px · task title 17px · body 13.5–14.5px · eyebrow 12px · micro-label 10–11px.

### Spacing / radius / shadow / motion
- 4px base grid. Section gap 18px. Card padding 20–24px. Inner row padding 11–16px.
- Radius: chips/badges 6px · buttons/inputs 9px · inner rows 9–11px · cards 12–16px · pills 999px.
- Shadow (elevated only): `0 6px 20px rgba(0,0,0,0.28)`.
- Motion: 120–180ms `cubic-bezier(0.4,0,0.2,1)`; the timer fill animates `1000ms linear`; running-dot pulse `bcpulse 1.4s ease-in-out infinite` (opacity 1↔0.3).
- Focus ring (add for a11y): `0 0 0 3px rgba(56,217,242,0.18)`.

### Tailwind theme snippet
```ts
// tailwind.config.ts → theme.extend
colors: {
  canvas:'#070A0D', base:'#0B1117', card:'#101923', elevated:'#17212D', subtle:'#243241',
  ink:{ primary:'#F7FAFC', secondary:'#CBD5E1', muted:'#8A97A8', disabled:'#526173', inverse:'#0B1117' },
  mint:'#5EF2C2', mintSoft:'#0F2E28', aqua:'#38D9F2', gold:'#D6B46A', violet:'#A78BFA',
  border:{ subtle:'#17212D', DEFAULT:'#243241', strong:'#334155' },
},
fontFamily: { sora:['Sora','sans-serif'], inter:['Inter','sans-serif'], mono:['"JetBrains Mono"','monospace'] },
borderRadius: { chip:'6px', btn:'9px', row:'11px', card:'12px', panel:'16px' },
boxShadow: { elevated:'0 6px 20px rgba(0,0,0,0.28)' },
```

---

## Interaction notes

### Timer (First Focus Block)
- Model as **elapsed seconds**, not a countdown clock, so duration changes and resumes are trivial. `total = durationMinutes * 60`; `remaining = total - elapsed`.
- A single `setInterval(…, 1000)` increments `elapsed` while `running && elapsed < total`. Auto-stops (`running=false`) at `elapsed >= total`.
- Display `M:SS` from `remaining`. ProgressBar width = `elapsed/total * 100%`.
- Button label state machine: not started → `Start 20-min block`; running → `Pause block`; paused mid-block → `Resume block`; done → `Block complete — nice` (disabled). Reset → `elapsed=0, running=false`.
- The duration is editable (5–45 min). Pulse dot shows only while running.
- **Persist** `{elapsed, running, startedAt}` (localStorage for static MVP; `focus_blocks` row later) so a refresh doesn't lose the block. On load, if it was running, reconcile elapsed against `Date.now() - startedAt`.

### Checkboxes (3 Touches + Home Reset)
- Each item has a boolean `done`. Click the whole row toggles it (row is the hit target, ≥44px tall).
- Static MVP: keep a `Set<string>` of completed ids in state (+ localStorage). Supabase: optimistic toggle → `upsert`.
- Checking an item is what feeds Proof counters (see below).

### Reward unlock
- The Reward is **derived from the timer**: `unlocked = (remaining <= 0)`. No separate button to unlock.
- Locked state = dashed box, muted copy, empty glyph. Unlocked = gold border + tinted bg + a real "Start reward →" CTA.
- Keep it visually tethered to the Focus Block via the Connector element directly above it.

### Proof of Movement counters
- Four numbers: **Career actions**, **Chores done**, **Creative blocks**, **Tasks finished** (this week).
- Derive, don't hand-edit: count completion events within the **current ISO week** (Mon–Sun).
  - Career = job-role status changes to `applied`/`follow-up done` + completed Career touches.
  - Chores done = completed chore checks.
  - Creative blocks = completed Creative touches + finished focus blocks tagged creative.
  - Tasks finished = total completed items across all sections.
- Static MVP: compute from seed `movement_log` array. Live: `select … where created_at >= startOfISOWeek()` then group by `type`.
- The "Tasks finished" total is a tweakable field in the prototype; in the build it should be **computed**, with a manual override allowed.

---

## Empty states

| Section | Empty | Treatment |
|---|---|---|
| Mission Bar | No focus set | Show "Set today's primary focus" ghost text in the mint-bar slot; meters default to 0 segments + "—" |
| Focus Block | No block defined | Card with "Define your first 20-minute block" + a "New block" button; timer hidden |
| Reward | No reward text | Locked card reads "Add a reward to unlock after the block" |
| 3 Touches | Fewer than 3 set | Render filled touch cards; remaining slots are dashed "Add a [Career/Home/Creative] touch" tiles |
| Job Search | No roles | "No roles tracked yet — add your first." Count tiles show 0. NextAction hidden |
| Home Reset | No chores | "No reset tasks yet." |
| Creative Projects | None | "No active projects." |
| Not Today | Empty | "Nothing parked. Everything you're carrying today is on the board." |
| Proof | New week / zero | All counters 0 + "This week starts now." |

All empty copy stays in-voice: direct, calm, supportive, gently witty — never guilt-inducing.

---

## Editable fields

What the user can change (build inline editing or a side sheet):
- **Mission:** primary focus text; energy level (0–5); stress level (0–5); date is system-derived.
- **Focus Block:** title; definition of done; duration (5–45 min, step 5); reward text.
- **3 Touches:** the task text for each of Career / Home / Creative; check/uncheck.
- **Job Search:** add/edit role (company, title, status ∈ saved·applied·follow-up); next-action sentence.
- **Home Reset:** add/remove/check chores.
- **Creative Projects:** name + status (draft·active·idle·waiting).
- **Not Today:** add/remove parked items.
- **Proof total:** computed; manual override optional.

---

## Suggested Next.js component breakdown

```
app/
  layout.tsx              // fonts (Sora, Inter, JetBrains Mono via next/font), bg-canvas
  page.tsx                // server component: fetch day's data, render <Dashboard/>
components/
  Dashboard.tsx           // the max-w-[1280px] column + section order
  MissionBar.tsx
  ProofStrip.tsx
  focus/
    FocusBlock.tsx        // 'use client' — consumes useTimer
    Connector.tsx
    RewardCard.tsx
  ThreeTouches.tsx
  TouchCard.tsx
  jobs/
    JobSearchTracker.tsx
    RoleRow.tsx
    NextAction.tsx
  HomeReset.tsx
  ChoreRow.tsx
  CreativeProjects.tsx
  ProjectRow.tsx
  NotToday.tsx
  ui/
    Card.tsx  Eyebrow.tsx  Button.tsx  StatusChip.tsx
    Callout.tsx  Checkbox.tsx  SegmentMeter.tsx  ProgressBar.tsx
hooks/
  useTimer.ts             // elapsed-based timer + persistence
  useChecklist.ts         // toggle + completed set + localStorage
lib/
  supabase/client.ts  supabase/server.ts
  types.ts                // shared TS types (below)
  data.ts                 // static seed (below) — swap for Supabase queries later
  week.ts                 // startOfISOWeek(), proof aggregation
```
Server components fetch and pass data down; only `FocusBlock`, the checkbox rows, and editing controls need `'use client'`.

---

## Suggested Supabase tables

All rows scoped by `user_id uuid references auth.users` with **row-level security** (a user sees only their own). Dates are `date`; timestamps `timestamptz default now()`.

```sql
profiles            (id uuid pk = auth.uid, display_name text, created_at)

daily_missions      (id uuid pk, user_id, day date, energy int2, stress int2,
                     primary_focus text, unique(user_id, day))

focus_blocks        (id uuid pk, user_id, day date, title text,
                     definition_of_done text, duration_minutes int2 default 20,
                     elapsed_seconds int4 default 0, status text
                       check (status in ('idle','running','paused','done')),
                     started_at timestamptz,
                     reward_text text, reward_unlocked bool default false)

touches             (id uuid pk, user_id, day date,
                     category text check (category in ('career','home','creative')),
                     label text, done bool default false, done_at timestamptz)

job_roles           (id uuid pk, user_id, company text, title text,
                     status text check (status in ('saved','applied','follow_up')),
                     status_note text, applied_at date, sort int4)

next_action         (id uuid pk, user_id, role_id uuid references job_roles, text)

chores              (id uuid pk, user_id, label text, recurring bool default true,
                     done bool default false, reset_day date, sort int4)

creative_projects   (id uuid pk, user_id, name text,
                     status text check (status in ('draft','active','idle','waiting')), sort int4)

not_today           (id uuid pk, user_id, day date, text text)

movement_log        (id uuid pk, user_id, type text
                       check (type in ('career','chore','creative','task')),
                     source_id uuid, created_at timestamptz default now())
```
Proof counters = `select type, count(*) from movement_log where user_id = auth.uid() and created_at >= <start of ISO week> group by type`. Write a `movement_log` row whenever a touch/chore/role/block completes; that keeps the weekly numbers honest and auditable.

---

## Static placeholder data structure

For the static MVP, put this in `lib/data.ts` and `lib/types.ts`. It mirrors the prototype exactly.

```ts
// lib/types.ts
export type TouchCategory = 'career' | 'home' | 'creative';
export type RoleStatus    = 'saved' | 'applied' | 'follow_up';
export type ProjectStatus = 'draft' | 'active' | 'idle' | 'waiting';
export type BlockStatus   = 'idle' | 'running' | 'paused' | 'done';

export interface Mission   { day: string; dateLabel: string; energy: number; stress: number; primaryFocus: string; }
export interface FocusBlock{ title: string; definitionOfDone: string; durationMinutes: number; elapsedSeconds: number; status: BlockStatus; rewardText: string; }
export interface Touch     { id: string; category: TouchCategory; label: string; done: boolean; }
export interface Role      { id: string; company: string; title: string; status: RoleStatus; statusNote?: string; }
export interface Chore     { id: string; label: string; done: boolean; }
export interface Project   { id: string; name: string; status: ProjectStatus; }
export interface Proof     { career: number; chores: number; creative: number; tasks: number; daysShownUp: number; daysTotal: number; }
```

```ts
// lib/data.ts  (seed = the prototype's current content)
export const mission: Mission = {
  day: '2026-06-30', dateLabel: 'Tuesday · June 30, 2026',
  energy: 3, stress: 2,
  primaryFocus: 'Ship one screen of the PrettyWise landing page. Done is enough.',
};

export const focusBlock: FocusBlock = {
  title: 'Finish & submit the SAP Fiori Developer application',
  definitionOfDone: 'Application sent with resume attached. Not polished — submitted. That\'s the bar.',
  durationMinutes: 20, elapsedSeconds: 0, status: 'idle',
  rewardText: '30 minutes on Caleb Ash sound design. No rules, just play.',
};

export const touches: Touch[] = [
  { id: 't-career',   category: 'career',   label: 'Submit the SAPUI5 / Fiori Developer application to SAP', done: false },
  { id: 't-home',     category: 'home',     label: 'Reset the kitchen + start a laundry load',              done: true  },
  { id: 't-creative', category: 'creative', label: 'Write 200 words for the Caleb Ash devlog',              done: false },
];

export const roles: Role[] = [
  { id: 'r1', company: 'SAP',        title: 'SAPUI5 / Fiori Developer',      status: 'applied',   statusNote: 'today' },
  { id: 'r2', company: 'Accenture',  title: 'SAP BTP Application Developer',  status: 'follow_up' },
  { id: 'r3', company: 'Salesforce', title: 'Salesforce UI Developer',        status: 'applied',   statusNote: '3d' },
  { id: 'r4', company: 'Workday',    title: 'Enterprise Frontend Engineer',   status: 'saved' },
  { id: 'r5', company: 'Vercel',     title: 'React / Next.js Developer',       status: 'saved' },
];
export const jobCounts = { saved: 8, applied: 5, followUps: 2 };
export const nextAction = 'Follow up with the Accenture recruiter on the SAP BTP role — it\'s been 5 days. One short email.';

export const chores: Chore[] = [
  { id: 'c1', label: 'Kitchen counter + dishes', done: true  },
  { id: 'c2', label: 'Switch the laundry over',  done: false },
  { id: 'c3', label: 'Desk reset — clear & wipe', done: false },
  { id: 'c4', label: 'Trash + recycling out',    done: true  },
  { id: 'c5', label: 'Open & sort the mail',     done: false },
];

export const projects: Project[] = [
  { id: 'p1', name: 'Caleb Ash',          status: 'draft'   },
  { id: 'p2', name: 'PrettyWise',         status: 'active'  },
  { id: 'p3', name: 'Blog / content',     status: 'idle'    },
  { id: 'p4', name: 'Freelance / client', status: 'waiting' },
];

export const notToday: string[] = [
  'Refactor the portfolio site',
  'Research a new CRM',
  'Reorganize the whole Notion',
  'Reply to the non-urgent email backlog',
  'Plan the Q3 content calendar',
];

export const proof: Proof = { career: 4, chores: 11, creative: 3, tasks: 18, daysShownUp: 5, daysTotal: 5 };
```

Status-chip color map (reuse for RoleRow + ProjectRow): `applied/active → aqua-info`, `follow_up/waiting → warning/info`, `saved/idle → muted`, `draft → violet`.

---

## Responsive behavior

Designed at 1280px; collapses cleanly. Suggested Tailwind breakpoints:

- **≥1024px (lg, desktop):** as drawn. Primary Action Row = 2 cols (`lg:grid-cols-[1.04fr_0.96fr]`). 3 Touches = 3 cols. Supporting = 2 cols. Mission Bar = row.
- **768–1023px (md, tablet):** Primary Action Row stacks to 1 col (Focus → Reward → Job Search). 3 Touches stays 3 cols if it fits, else 1. Supporting = 2 cols. Mission Bar wraps (meter panel drops below the mission text). Reduce outer padding to `24px`.
- **<768px (mobile):** everything single column (`grid-cols-1`). 3 Touches stack vertically. Proof stats wrap to a 2×2 grid. Mission meter panel full width. Timer digits scale down (~44px). Outer padding `16px`. Keep all tap targets ≥44px.

Use `clamp()`/responsive type for the timer (`text-[44px] md:text-[54px]`) and focus statement.

---

## Build order (recommended)

1. Tailwind theme + fonts + `ui/` primitives.
2. Static `Dashboard` rendering all sections from `lib/data.ts` — match the prototype 1:1.
3. `useTimer` + `useChecklist` with localStorage → timer, checkboxes, reward unlock, live Proof counters.
4. Empty-state variants.
5. Supabase schema + RLS; swap seed reads for queries; add inline editing.

---

## Files in this bundle

- `prototype/Command Center.dc.html` — approved final design (reference).
- `tokens/colors.css` · `tokens/typography.css` · `tokens/spacing.css` — Bryan Cash Design System tokens (source of truth for the Tailwind theme).
- `README.md` — this document (self-sufficient; implementable without having seen the conversation).
