import { getProjects, ProjectCard, type Project } from "@/entities/project";
import { SectionHeader } from "@/shared/ui";

import { ProjectGridAnimated } from "./ProjectGridAnimated";

export async function ProjectGrid() {
  let projects: Project[];
  try {
    projects = await getProjects();
  } catch {
    projects = [];
  }

  return (
    <section
      className="mx-auto w-full max-w-[1440px] px-5 pt-10 tablet:px-[30px] tablet:pt-[100px]"
      aria-label="Portfolio"
    >
      <SectionHeader number="01" label={"//Portfolio"} detail="2013 - 2025" />

      {/* Section Title */}
      <div className="mb-8 tablet:mb-12">
        <h2 className="max-w-[700px] font-clash text-[40px] font-semibold uppercase leading-[30px] text-text tablet:text-[60px] tablet:leading-[50px] tablet:tracking-[-1px] desktop:text-[120px] desktop:leading-[90px] desktop:tracking-[-1.6px]">
          <span className="block">MON</span>
          <span className="block">Portfolio</span>
        </h2>
      </div>

      {/* Project Grid — cards rendered server-side, wrapped by client animation */}
      <ProjectGridAnimated>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </ProjectGridAnimated>
    </section>
  );
}
