import type { Chore, MovementEvent, Proof, Touch } from "./types";

const WORKDAYS_PER_WEEK = 5;

/** Monday 00:00 (local time) of the ISO week containing `date`. */
export function startOfISOWeek(date: Date): Date {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const day = start.getDay(); // 0 = Sun ... 6 = Sat
  const diffToMonday = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diffToMonday);
  return start;
}

export function localDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

interface ComputeProofInput {
  touches: Touch[];
  chores: Chore[];
  movementLog: MovementEvent[];
  now: Date;
  tasksOverride?: number | null;
}

/**
 * Derives the weekly Proof numbers from the historical movement log plus
 * today's live checklist state — never hand-set, per the handoff spec.
 * `tasksOverride` lets the user pin "Tasks finished" to a specific number;
 * pass null/undefined to use the computed total.
 */
export function computeProof({ touches, chores, movementLog, now, tasksOverride }: ComputeProofInput): Proof {
  const weekStart = startOfISOWeek(now);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const inWeek = movementLog.filter((event) => {
    const created = new Date(event.createdAt);
    return created >= weekStart && created < weekEnd;
  });

  // Today's rows are represented by the live checklists below. Keeping only
  // earlier days here avoids double-counting a completion after it is logged.
  const todayKey = localDateKey(now);
  const historical = inWeek.filter((event) => localDateKey(new Date(event.createdAt)) !== todayKey);

  const historicalCareer = historical.filter((e) => e.type === "career").length;
  const historicalChores = historical.filter((e) => e.type === "chore").length;
  const historicalCreative = historical.filter((e) => e.type === "creative").length;

  const careerTouch = touches.find((t) => t.category === "career");
  const homeTouch = touches.find((t) => t.category === "home");
  const creativeTouch = touches.find((t) => t.category === "creative");

  const todayCareer = careerTouch?.done ? 1 : 0;
  const todayChores = chores.filter((c) => c.done).length + (homeTouch?.done ? 1 : 0);
  const todayCreative = creativeTouch?.done ? 1 : 0;

  const career = historicalCareer + todayCareer;
  const choresCount = historicalChores + todayChores;
  const creative = historicalCreative + todayCreative;
  const computedTasks = career + choresCount + creative;

  const activeDays = new Set(inWeek.map((e) => localDateKey(new Date(e.createdAt))));
  if (todayCareer || todayChores || todayCreative) {
    activeDays.add(localDateKey(now));
  }
  const daysShownUp = Math.min(WORKDAYS_PER_WEEK, activeDays.size);

  return {
    career,
    chores: choresCount,
    creative,
    tasks: tasksOverride ?? computedTasks,
    daysShownUp,
    daysTotal: WORKDAYS_PER_WEEK,
  };
}
