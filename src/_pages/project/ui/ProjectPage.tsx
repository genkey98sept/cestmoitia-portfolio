import { notFound } from "next/navigation";

import {
  getProjectBySlug,
  getProjects,
  ProjectDetail,
  type Project,
} from "@/entities/project";

import { MoreWorks } from "./MoreWorks";

interface ProjectPageProps {
  slug: string;
}

export async function ProjectPage({ slug }: ProjectPageProps) {
  let project: Project | null;
  try {
    project = await getProjectBySlug(slug);
  } catch {
    project = null;
  }

  if (!project) notFound();

  let allProjects: Project[];
  try {
    allProjects = await getProjects();
  } catch {
    allProjects = [];
  }

  const relatedProjects = allProjects
    .filter((p) => p.id !== project.id)
    .slice(0, 2);

  return (
    <>
      <ProjectDetail project={project} />
      <MoreWorks projects={relatedProjects} />
    </>
  );
}
