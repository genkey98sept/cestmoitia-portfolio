import Link from "next/link";

import type { Project } from "../model/types";
import { ProjectCardAnimated } from "./ProjectCardAnimated";

export interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article>
      <Link href={`/work/${project.slug}`} className="block">
        <ProjectCardAnimated
          title={project.title}
          category={project.category}
          imageUrl={project.coverImage?.url ?? ""}
          imageAlt={project.coverImage?.alt ?? project.title}
        />
      </Link>
    </article>
  );
}
