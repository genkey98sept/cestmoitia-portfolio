import { ProjectCard, type Project } from "@/entities/project";

import { MoreWorksAnimated } from "./MoreWorksAnimated";

interface MoreWorksProps {
  projects: Project[];
}

export function MoreWorks({ projects }: MoreWorksProps) {
  if (projects.length === 0) return null;

  return (
    <div className="section-space">
      {/* Autres réalisations publiées */}
      <MoreWorksAnimated />

      {/* Cartes de projets associés */}
      <div className="site-shell">
        <div className="grid grid-cols-1 gap-6 tablet:grid-cols-2 tablet:gap-[28px]">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}
