import { getPayloadClient } from "@/shared/lib";

import type { Project } from "../model/types";

export async function getProjects(): Promise<Project[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "projects",
    where: {
      status: { equals: "published" },
    },
    sort: "displayOrder",
    depth: 1,
  });
  return result.docs as unknown as Project[];
}

export async function getProjectBySlug(
  slug: string,
): Promise<Project | null> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "projects",
    where: {
      slug: { equals: slug },
      status: { equals: "published" },
    },
    limit: 1,
    depth: 2,
  });
  return (result.docs[0] as unknown as Project) ?? null;
}

export async function getProjectSlugs(): Promise<string[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "projects",
    where: {
      status: { equals: "published" },
    },
    sort: "displayOrder",
    depth: 0,
    limit: 100,
  });
  return result.docs.map((doc) => doc.slug as string);
}
