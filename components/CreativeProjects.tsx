import type { Project } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ProjectRow } from "@/components/ProjectRow";

interface CreativeProjectsProps {
  projects: Project[];
}

export function CreativeProjects({ projects }: CreativeProjectsProps) {
  return (
    <Card radius="section" className="p-[22px]">
      <div className="mb-[15px]">
        <Eyebrow color="violet">Creative Projects</Eyebrow>
      </div>
      {projects.length > 0 ? (
        <div className="flex flex-col gap-2">
          {projects.map((project) => (
            <ProjectRow key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-[13px] text-ink-muted">No active projects.</div>
      )}
    </Card>
  );
}
