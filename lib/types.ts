export type TouchCategory = "career" | "home" | "creative";
export type RoleStatus = "saved" | "applied" | "follow_up";
export type ProjectStatus = "draft" | "active" | "idle" | "waiting";
export type BlockStatus = "idle" | "running" | "paused" | "done";
export type MovementType = "career" | "chore" | "creative" | "task";

export interface Mission {
  day: string;
  dateLabel: string;
  energy: number;
  stress: number;
  primaryFocus: string;
}

export interface FocusBlock {
  title: string;
  definitionOfDone: string;
  durationMinutes: number;
  elapsedSeconds: number;
  status: BlockStatus;
  rewardText: string;
}

export interface Touch {
  id: string;
  category: TouchCategory;
  label: string;
  done: boolean;
}

export interface Role {
  id: string;
  company: string;
  title: string;
  status: RoleStatus;
  statusNote?: string;
}

export interface Chore {
  id: string;
  label: string;
  done: boolean;
}

export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
}

export interface Proof {
  career: number;
  chores: number;
  creative: number;
  tasks: number;
  daysShownUp: number;
  daysTotal: number;
}

/** A logged completion event — the source of truth for the weekly Proof counters. */
export interface MovementEvent {
  id: string;
  type: MovementType;
  sourceId: string;
  createdAt: string;
}
