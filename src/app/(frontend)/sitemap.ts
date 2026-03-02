import type { MetadataRoute } from "next";

import { getProjectSlugs } from "@/entities/project";
import { SITE_URL } from "@/shared/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/work`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/photography`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  let projectSlugs: string[] = [];
  try {
    projectSlugs = await getProjectSlugs();
  } catch {
    // Payload may not be available during build
  }

  const projectPages: MetadataRoute.Sitemap = projectSlugs.map((slug) => ({
    url: `${SITE_URL}/work/${slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...projectPages];
}
