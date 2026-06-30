import type {
  Chore,
  FocusBlock,
  Mission,
  MovementEvent,
  Project,
  Proof,
  Role,
  Touch,
} from "./types";

// lib/data.ts — static seed (= the prototype's current content).
// Swap this module's exports for Supabase queries later; everything else
// reads through here, never straight from a hardcoded literal.

export const mission: Mission = {
  day: "2026-06-30",
  dateLabel: "Tuesday · June 30, 2026",
  energy: 3,
  stress: 2,
  primaryFocus: "Ship one screen of the PrettyWise landing page. Done is enough.",
};

export const focusBlock: FocusBlock = {
  title: "Finish & submit the SAP Fiori Developer application",
  definitionOfDone:
    "Application sent with resume attached. Not polished — submitted. That's the bar.",
  durationMinutes: 20,
  elapsedSeconds: 0,
  status: "idle",
  rewardText: "30 minutes on Caleb Ash sound design. No rules, just play.",
};

export const touches: Touch[] = [
  {
    id: "t-career",
    category: "career",
    label: "Submit the SAPUI5 / Fiori Developer application to SAP",
    done: false,
  },
  {
    id: "t-home",
    category: "home",
    label: "Reset the kitchen + start a laundry load",
    done: true,
  },
  {
    id: "t-creative",
    category: "creative",
    label: "Write 200 words for the Caleb Ash devlog",
    done: false,
  },
];

export const roles: Role[] = [
  { id: "r1", company: "SAP", title: "SAPUI5 / Fiori Developer", status: "applied", statusNote: "today" },
  { id: "r2", company: "Accenture", title: "SAP BTP Application Developer", status: "follow_up" },
  { id: "r3", company: "Salesforce", title: "Salesforce UI Developer", status: "applied", statusNote: "3d" },
  { id: "r4", company: "Workday", title: "Enterprise Frontend Engineer", status: "saved" },
  { id: "r5", company: "Vercel", title: "React / Next.js Developer", status: "saved" },
];

export const jobCounts = { saved: 8, applied: 5, followUps: 2 };

export const nextAction =
  "Follow up with the Accenture recruiter on the SAP BTP role — it's been 5 days. One short email.";

export const chores: Chore[] = [
  { id: "c1", label: "Kitchen counter + dishes", done: true },
  { id: "c2", label: "Switch the laundry over", done: false },
  { id: "c3", label: "Desk reset — clear & wipe", done: false },
  { id: "c4", label: "Trash + recycling out", done: true },
  { id: "c5", label: "Open & sort the mail", done: false },
];

export const projects: Project[] = [
  { id: "p1", name: "Caleb Ash", status: "draft" },
  { id: "p2", name: "PrettyWise", status: "active" },
  { id: "p3", name: "Blog / content", status: "idle" },
  { id: "p4", name: "Freelance / client", status: "waiting" },
];

export const notToday: string[] = [
  "Refactor the portfolio site",
  "Research a new CRM",
  "Reorganize the whole Notion",
  "Reply to the non-urgent email backlog",
  "Plan the Q3 content calendar",
];

// Static display total — used only before the live counters (lib/week.ts) take
// over in the interactive pass. Mirrors the prototype's default proofTotal.
export const proof: Proof = { career: 4, chores: 11, creative: 3, tasks: 18, daysShownUp: 5, daysTotal: 5 };

// Completion events logged on earlier days of the current ISO week (i.e. not
// today's 3 Touches / Home Reset rows, which are tracked live via checklist
// state). Combined with today's live completions in lib/week.ts, these
// reproduce the `proof` totals above and keep moving as the week goes on.
export const movementLog: MovementEvent[] = [
  { id: "m1", type: "career", sourceId: "r3", createdAt: "2026-06-29T15:10:00Z" },
  { id: "m2", type: "career", sourceId: "r1", createdAt: "2026-06-29T16:40:00Z" },
  { id: "m3", type: "career", sourceId: "r5", createdAt: "2026-06-29T18:05:00Z" },
  { id: "m4", type: "career", sourceId: "r4", createdAt: "2026-06-29T19:30:00Z" },
  { id: "m5", type: "chore", sourceId: "c1", createdAt: "2026-06-29T13:00:00Z" },
  { id: "m6", type: "chore", sourceId: "c2", createdAt: "2026-06-29T13:20:00Z" },
  { id: "m7", type: "chore", sourceId: "c3", createdAt: "2026-06-29T14:00:00Z" },
  { id: "m8", type: "chore", sourceId: "c4", createdAt: "2026-06-29T14:30:00Z" },
  { id: "m9", type: "chore", sourceId: "c5", createdAt: "2026-06-29T17:00:00Z" },
  { id: "m10", type: "chore", sourceId: "t-home", createdAt: "2026-06-29T17:45:00Z" },
  { id: "m11", type: "chore", sourceId: "t-home", createdAt: "2026-06-29T20:00:00Z" },
  { id: "m12", type: "chore", sourceId: "c2", createdAt: "2026-06-29T20:30:00Z" },
  { id: "m13", type: "creative", sourceId: "t-creative", createdAt: "2026-06-29T21:00:00Z" },
  { id: "m14", type: "creative", sourceId: "p2", createdAt: "2026-06-29T21:30:00Z" },
  { id: "m15", type: "creative", sourceId: "p1", createdAt: "2026-06-29T22:00:00Z" },
];
