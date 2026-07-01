"use client";

import { useEffect, useRef, useState } from "react";
import {
  chores as seedChores,
  focusBlock,
  jobCounts,
  mission as seedMission,
  movementLog,
  nextAction,
  notToday as seedNotToday,
  projects as seedProjects,
  roles,
  touches as seedTouches,
} from "@/lib/data";
import type { ChoreContent, FocusBlockContent, MissionContent, TouchContent } from "@/lib/types";
import { computeProof } from "@/lib/week";
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
  const [missionContent, setMissionContent] = usePersistedState("cc:mission", missionContentSeed);
  const [focusContent, setFocusContent] = usePersistedState("cc:focus-content", focusContentSeed);
  const [touchesContent, setTouchesContent] = usePersistedState("cc:touches-content", touchesContentSeed);
  const [choresContent, setChoresContent] = usePersistedState("cc:chores-content", choresContentSeed);
  const [projectsContent, setProjectsContent] = usePersistedState("cc:projects-content", seedProjects);
  const [notTodayItems, setNotTodayItems] = usePersistedState("cc:not-today", seedNotToday);

  const timer = useTimer("cc:focus-timer", focusContent.durationMinutes);

  const touchChecklist = useChecklist(
    "cc:touches",
    seedTouches.filter((t) => t.done).map((t) => t.id),
  );
  const choreChecklist = useChecklist(
    "cc:chores",
    seedChores.filter((c) => c.done).map((c) => c.id),
  );
  const rewardChecklist = useChecklist("cc:reward", []);
  const [tasksOverride, setTasksOverride] = useTasksOverride();

  const mission = { ...seedMission, ...missionContent };
  const touches = touchesContent.map((t) => ({ ...t, done: touchChecklist.completed.has(t.id) }));
  const chores = choresContent.map((c) => ({ ...c, done: choreChecklist.completed.has(c.id) }));

  const rewardUnlocked = timer.elapsedSeconds >= focusContent.durationMinutes * 60;
  const rewardDone = rewardUnlocked && rewardChecklist.completed.has("reward");

  const proof = computeProof({
    touches,
    chores,
    movementLog,
    now: new Date(),
    tasksOverride,
  });

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
        <JobSearchTracker roles={roles} jobCounts={jobCounts} nextAction={nextAction} />
      </div>

      <ThreeTouches
        touches={touches}
        onToggle={touchChecklist.toggle}
        onEditLabel={(id, label) =>
          setTouchesContent((prev) => prev.map((t) => (t.id === id ? { ...t, label } : t)))
        }
      />

      <div className="grid grid-cols-1 items-start gap-[18px] md:grid-cols-2">
        <HomeReset
          chores={chores}
          onToggle={choreChecklist.toggle}
          onEditLabel={(id, label) =>
            setChoresContent((prev) => prev.map((c) => (c.id === id ? { ...c, label } : c)))
          }
          onRemove={(id) => setChoresContent((prev) => prev.filter((c) => c.id !== id))}
          onAdd={(label) => setChoresContent((prev) => [...prev, { id: crypto.randomUUID(), label }])}
        />
        <CreativeProjects
          projects={projectsContent}
          onEditName={(id, name) =>
            setProjectsContent((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)))
          }
          onSetStatus={(id, status) =>
            setProjectsContent((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)))
          }
          onRemove={(id) => setProjectsContent((prev) => prev.filter((p) => p.id !== id))}
          onAdd={(name) =>
            setProjectsContent((prev) => [...prev, { id: crypto.randomUUID(), name, status: "draft" }])
          }
        />
      </div>

      <NotToday
        items={notTodayItems}
        onAdd={(text) => setNotTodayItems((prev) => [...prev, { id: crypto.randomUUID(), text }])}
        onRemove={(id) => setNotTodayItems((prev) => prev.filter((item) => item.id !== id))}
      />
    </div>
  );
}
