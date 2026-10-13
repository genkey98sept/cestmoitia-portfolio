import { ProjectCard, type Project } from "@/entities/project";

import { MoreWorksAnimated } from "./MoreWorksAnimated";

interface MoreWorksProps {
  projects: Project[];
}

export function MoreWorks({ projects }: MoreWorksProps) {
  if (projects.length === 0) return null;

  return (
    <div className="mt-10 tablet:mt-[100px]">
      {/* Scrolling marquee text */}
      <MoreWorksAnimated />

      {/* Related project cards */}
      <div className="mx-auto max-w-[1440px] px-5 tablet:px-[30px]">
        <div className="grid grid-cols-1 gap-6 tablet:grid-cols-2 tablet:gap-[28px]">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}
