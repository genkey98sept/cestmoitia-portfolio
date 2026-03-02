import type { Metadata } from "next";

import {
  getProjectBySlug,
  getProjectSlugs,
} from "@/entities/project";
import { ProjectPage } from "@/pages/project";
import { buildCreativeWorkJsonLd } from "@/shared/lib";
import { SITE_URL } from "@/shared/config";

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
  const description = project.category ?? "Projet creatif";
  return {
    title: `${project.title} — cestmoitia`,
    description,
    openGraph: {
      title: `${project.title} — cestmoitia`,
      description,
      type: "article",
      images: project.coverImage?.url ? [project.coverImage.url] : [],
    },
    twitter: {
      card: "summary_large_image",
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

  let project = null;
  try {
    project = await getProjectBySlug(slug);
  } catch {
    // Payload may not be available
  }

  return (
    <>
      {project && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildCreativeWorkJsonLd(project, SITE_URL)),
          }}
        />
      )}
      <ProjectPage slug={slug} />
    </>
  );
}
