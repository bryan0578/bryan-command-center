/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState } from "react";
import {
  chores as seedChores,
  focusBlock,
  mission as seedMission,
  movementLog,
  nextAction as seedNextAction,
  notToday as seedNotToday,
  projects as seedProjects,
  roles,
  touches as seedTouches,
} from "@/lib/data";
import type { ChoreContent, FocusBlockContent, MissionContent, MovementType, Project, TouchContent } from "@/lib/types";
import { getProjectValidationError, migrateProjectPortfolio } from "@/lib/projects";
import { computeProof, localDateKey } from "@/lib/week";
import { useTimer } from "@/hooks/useTimer";
import { useChecklist } from "@/hooks/useChecklist";
import { usePersistedState } from "@/hooks/usePersistedState";
import { MissionBar } from "@/components/MissionBar";
import { ProofStrip } from "@/components/ProofStrip";
import { FocusBlock as FocusBlockSection } from "@/components/focus/FocusBlock";
import { Connector } from "@/components/focus/Connector";
import { RewardCard } from "@/components/focus/RewardCard";
import { JobSearchTracker } from "@/components/jobs/JobSearchTracker";
import { ThreeTouches } from "@/components/ThreeTouches";
import { HomeReset } from "@/components/HomeReset";
import { CreativeProjects } from "@/components/CreativeProjects";
import { NotToday } from "@/components/NotToday";
import { CommandCenterControls } from "@/components/CommandCenterControls";

const TASKS_OVERRIDE_KEY = "cc:tasks-override";

function useTasksOverride() {
  const [override, setOverride] = useState<number | null>(null);
  const hydrated = useRef(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(TASKS_OVERRIDE_KEY);
    if (raw !== null) {
      const parsed = Number(raw);
      if (Number.isFinite(parsed)) setOverride(parsed);
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    if (override === null) {
      window.localStorage.removeItem(TASKS_OVERRIDE_KEY);
    } else {
      window.localStorage.setItem(TASKS_OVERRIDE_KEY, String(override));
    }
  }, [override]);

  return [override, setOverride] as const;
}

const missionContentSeed: MissionContent = {
  primaryFocus: seedMission.primaryFocus,
  energy: seedMission.energy,
  stress: seedMission.stress,
};

const focusContentSeed: FocusBlockContent = {
  title: focusBlock.title,
  definitionOfDone: focusBlock.definitionOfDone,
  durationMinutes: focusBlock.durationMinutes,
  rewardText: focusBlock.rewardText,
};

const touchesContentSeed: TouchContent[] = seedTouches.map(({ id, category, label }) => ({ id, category, label }));
const choresContentSeed: ChoreContent[] = seedChores.map(({ id, label }) => ({ id, label }));

export function Dashboard() {
  const now = new Date();
  const currentDay = localDateKey(now);
  const [missionContent, setMissionContent] = usePersistedState("cc:mission", missionContentSeed);
  const [focusContent, setFocusContent] = usePersistedState("cc:focus-content", focusContentSeed);
  const [touchesContent, setTouchesContent] = usePersistedState("cc:touches-content", touchesContentSeed);
  const [choresContent, setChoresContent] = usePersistedState("cc:chores-content", choresContentSeed);
  const [projectsContent, setProjectsContent] = usePersistedState("cc:projects-content", seedProjects, {
    migrationKey: "cc:migration:project-lifecycle-v2",
    migrate: migrateProjectPortfolio,
  });
  const [notTodayItems, setNotTodayItems] = usePersistedState("cc:not-today", seedNotToday);
  const [rolesContent, setRolesContent] = usePersistedState("cc:job-roles", roles);
  const [jobNextAction, setJobNextAction] = usePersistedState("cc:job-next-action", seedNextAction);
  const [movementHistory, setMovementHistory] = usePersistedState("cc:movement-log", movementLog);

  const timer = useTimer("cc:focus-timer", focusContent.durationMinutes, currentDay);

  const touchChecklist = useChecklist(
    "cc:touches",
    [],
    currentDay,
  );
  const choreChecklist = useChecklist(
    "cc:chores",
    [],
    currentDay,
  );
  const rewardChecklist = useChecklist("cc:reward", [], currentDay);
  const [tasksOverride, setTasksOverride] = useTasksOverride();

  const mission = {
    ...seedMission,
    ...missionContent,
    day: currentDay,
    dateLabel: new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(now),
  };
  const touches = touchesContent.map((t) => ({ ...t, done: touchChecklist.completed.has(t.id) }));
  const chores = choresContent.map((c) => ({ ...c, done: choreChecklist.completed.has(c.id) }));

  const recordMovement = (type: MovementType, sourceId: string, completed: boolean) => {
    const id = `${currentDay}:${type}:${sourceId}`;
    setMovementHistory((previous) => {
      if (!completed) return previous.filter((event) => event.id !== id);
      if (previous.some((event) => event.id === id)) return previous;
      return [...previous, { id, type, sourceId, createdAt: new Date().toISOString() }];
    });
  };

  const toggleTouch = (id: string) => {
    const touch = touchesContent.find((item) => item.id === id);
    if (!touch) return;
    const completing = !touchChecklist.completed.has(id);
    touchChecklist.toggle(id);
    const type: MovementType = touch.category === "home" ? "chore" : touch.category;
    recordMovement(type, id, completing);
  };

  const toggleChore = (id: string) => {
    const completing = !choreChecklist.completed.has(id);
    choreChecklist.toggle(id);
    recordMovement("chore", id, completing);
  };

  const rewardUnlocked = timer.elapsedSeconds >= focusContent.durationMinutes * 60;
  const rewardDone = rewardUnlocked && rewardChecklist.completed.has("reward");
  const jobCounts = {
    saved: rolesContent.filter((role) => role.status === "saved").length,
    applied: rolesContent.filter((role) => role.status === "applied").length,
    followUps: rolesContent.filter((role) => role.status === "follow_up").length,
  };

  const proof = computeProof({
    touches,
    chores,
    movementLog: movementHistory,
    now,
    tasksOverride,
  });

  const updateProject = (id: string, changes: Partial<Project>): string | null => {
    const current = projectsContent.find((project) => project.id === id);
    if (!current) return "Project could not be found.";
    const candidate = { ...current, ...changes };
    const validationError = getProjectValidationError(candidate);
    if (validationError) return validationError;
    setProjectsContent((previous) =>
      previous.map((project) => (project.id === id ? candidate : project)),
    );
    return null;
  };

  return (
    <div className="mx-auto flex max-w-[1280px] flex-col gap-[18px] px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:pt-9 lg:pb-12">
      <MissionBar
        mission={mission}
        onSetPrimaryFocus={(text) => setMissionContent((prev) => ({ ...prev, primaryFocus: text }))}
        onSetEnergy={(value) => setMissionContent((prev) => ({ ...prev, energy: value }))}
        onSetStress={(value) => setMissionContent((prev) => ({ ...prev, stress: value }))}
      />

      <ProofStrip proof={proof} isTasksOverridden={tasksOverride !== null} onSetTasksOverride={setTasksOverride} />

      <div className="grid grid-cols-1 items-start gap-[18px] lg:grid-cols-[1.04fr_0.96fr]">
        <div className="flex flex-col">
          <FocusBlockSection
            block={focusContent}
            elapsedSeconds={timer.elapsedSeconds}
            running={timer.running}
            onToggle={timer.toggle}
            onReset={timer.reset}
            onSetTitle={(title) => setFocusContent((prev) => ({ ...prev, title }))}
            onSetDefinitionOfDone={(text) => setFocusContent((prev) => ({ ...prev, definitionOfDone: text }))}
            onSetDuration={(minutes) => setFocusContent((prev) => ({ ...prev, durationMinutes: minutes }))}
          />
          <Connector />
          <RewardCard
            rewardText={focusContent.rewardText}
            unlocked={rewardUnlocked}
            done={rewardDone}
            onToggle={() => rewardUnlocked && rewardChecklist.toggle("reward")}
            onSetRewardText={(text) => setFocusContent((prev) => ({ ...prev, rewardText: text }))}
          />
        </div>
        <JobSearchTracker
          roles={rolesContent}
          jobCounts={jobCounts}
          nextAction={jobNextAction}
          onAddRole={(company, title) =>
            setRolesContent((prev) => [
              ...prev,
              { id: crypto.randomUUID(), company, title, status: "saved" },
            ])
          }
          onSetStatus={(id, status) =>
            setRolesContent((prev) => prev.map((role) => (role.id === id ? { ...role, status } : role)))
          }
          onRemoveRole={(id) => setRolesContent((prev) => prev.filter((role) => role.id !== id))}
          onSetNextAction={setJobNextAction}
        />
      </div>

      <ThreeTouches
        touches={touches}
        onToggle={toggleTouch}
        onEditLabel={(id, label) =>
          setTouchesContent((prev) => prev.map((t) => (t.id === id ? { ...t, label } : t)))
        }
      />

      <div className="grid grid-cols-1 items-start gap-[18px] md:grid-cols-2">
        <HomeReset
          chores={chores}
          onToggle={toggleChore}
          onEditLabel={(id, label) =>
            setChoresContent((prev) => prev.map((c) => (c.id === id ? { ...c, label } : c)))
          }
          onRemove={(id) => setChoresContent((prev) => prev.filter((c) => c.id !== id))}
          onAdd={(label) => setChoresContent((prev) => [...prev, { id: crypto.randomUUID(), label }])}
        />
        <CreativeProjects
          projects={projectsContent}
          onUpdate={updateProject}
          onRemove={(id) => setProjectsContent((prev) => prev.filter((p) => p.id !== id))}
          onAdd={(name) =>
            setProjectsContent((prev) => [
              ...prev,
              { id: crypto.randomUUID(), name, lifecycleState: "active" },
            ])
          }
        />
      </div>

      <NotToday
        items={notTodayItems}
        onAdd={(text) => setNotTodayItems((prev) => [...prev, { id: crypto.randomUUID(), text }])}
        onRemove={(id) => setNotTodayItems((prev) => prev.filter((item) => item.id !== id))}
      />

      <CommandCenterControls />
    </div>
  );
}
