import type { Metadata } from "next";

import {
  getProjectBySlug,
  getProjectSlugs,
} from "@/entities/project";
import { ProjectPage } from "@/pages/project";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let project;
  try {
    project = await getProjectBySlug(slug);
  } catch {
    return {};
  }
  if (!project) return {};
  return {
    title: `${project.title} — cestmoitia`,
    description: project.category ?? "Projet créatif",
    openGraph: {
      images: project.coverImage?.url ? [project.coverImage.url] : [],
    },
  };
}

export async function generateStaticParams() {
  let slugs: string[];
  try {
    slugs = await getProjectSlugs();
  } catch {
    slugs = [];
  }
  return slugs.map((slug) => ({ slug }));
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <ProjectPage slug={slug} />;
}
