"use client";

import { useEffect, useRef, useState } from "react";
import {
  chores as seedChores,
  focusBlock,
  jobCounts,
  mission,
  movementLog,
  nextAction,
  notToday,
  projects,
  roles,
  touches as seedTouches,
} from "@/lib/data";
import { computeProof } from "@/lib/week";
import { useTimer } from "@/hooks/useTimer";
import { useChecklist } from "@/hooks/useChecklist";
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

export function Dashboard() {
  const timer = useTimer("cc:focus-timer", focusBlock.durationMinutes);

  const touchChecklist = useChecklist(
    "cc:touches",
    seedTouches.filter((t) => t.done).map((t) => t.id),
  );
  const choreChecklist = useChecklist(
    "cc:chores",
    seedChores.filter((c) => c.done).map((c) => c.id),
  );
  const [tasksOverride, setTasksOverride] = useTasksOverride();

  const touches = seedTouches.map((t) => ({ ...t, done: touchChecklist.completed.has(t.id) }));
  const chores = seedChores.map((c) => ({ ...c, done: choreChecklist.completed.has(c.id) }));

  const rewardUnlocked = timer.elapsedSeconds >= focusBlock.durationMinutes * 60;

  const proof = computeProof({
    touches,
    chores,
    movementLog,
    now: new Date(),
    tasksOverride,
  });

  return (
    <div className="mx-auto flex max-w-[1280px] flex-col gap-[18px] px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:pt-9 lg:pb-12">
      <MissionBar mission={mission} />

      <ProofStrip proof={proof} isTasksOverridden={tasksOverride !== null} onSetTasksOverride={setTasksOverride} />

      <div className="grid grid-cols-1 items-start gap-[18px] lg:grid-cols-[1.04fr_0.96fr]">
        <div className="flex flex-col">
          <FocusBlockSection
            block={focusBlock}
            elapsedSeconds={timer.elapsedSeconds}
            running={timer.running}
            onToggle={timer.toggle}
            onReset={timer.reset}
          />
          <Connector />
          <RewardCard rewardText={focusBlock.rewardText} unlocked={rewardUnlocked} />
        </div>
        <JobSearchTracker roles={roles} jobCounts={jobCounts} nextAction={nextAction} />
      </div>

      <ThreeTouches touches={touches} onToggle={touchChecklist.toggle} />

      <div className="grid grid-cols-1 items-start gap-[18px] md:grid-cols-2">
        <HomeReset chores={chores} onToggle={choreChecklist.toggle} />
        <CreativeProjects projects={projects} />
      </div>

      <NotToday items={notToday} />
    </div>
  );
}
