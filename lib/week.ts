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

function dateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
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

  const historicalCareer = inWeek.filter((e) => e.type === "career").length;
  const historicalChores = inWeek.filter((e) => e.type === "chore").length;
  const historicalCreative = inWeek.filter((e) => e.type === "creative").length;

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

  const activeDays = new Set(inWeek.map((e) => dateKey(new Date(e.createdAt))));
  if (todayCareer || todayChores || todayCreative) {
    activeDays.add(dateKey(now));
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
