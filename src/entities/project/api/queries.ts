import { getPayloadClient } from "@/shared/lib";

import type { Project, SubProject, Media } from "../model/types";

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapMedia(raw: any): Media {
  return {
    id: raw.id ?? "",
    alt: raw.alt ?? "",
    caption: raw.caption,
    filename: raw.filename ?? "",
    mimeType: raw.mimeType ?? "",
    filesize: raw.filesize ?? 0,
    width: raw.width,
    height: raw.height,
    url: raw.url,
    sizes: raw.sizes,
  };
}

function mapSubProject(raw: any): SubProject {
  return {
    id: raw.id,
    subTitle: raw.subTitle ?? "",
    subDescription: raw.subDescription,
    subMedia: raw.subMedia?.map((m: any) => ({
      id: m.id,
      image: typeof m.image === "object" ? mapMedia(m.image) : m.image,
    })),
  };
}

function mapProject(raw: any): Project {
  return {
    id: raw.id ?? "",
    title: raw.title ?? "",
    slug: raw.slug ?? "",
    client: raw.client,
    year: raw.year,
    category: raw.category,
    description: raw.description,
    coverImage:
      typeof raw.coverImage === "object"
        ? mapMedia(raw.coverImage)
        : raw.coverImage,
    galleryImages: raw.galleryImages?.map((g: any) => ({
      id: g.id,
      image: typeof g.image === "object" ? mapMedia(g.image) : g.image,
    })),
    videoUrl: raw.videoUrl,
    subProjects: raw.subProjects?.map(mapSubProject),
    displayOrder: raw.displayOrder ?? 0,
    status: raw.status ?? "draft",
    publishedAt: raw.publishedAt,
    createdAt: raw.createdAt ?? "",
    updatedAt: raw.updatedAt ?? "",
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

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
  return result.docs.map(mapProject);
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
  const doc = result.docs[0];
  return doc ? mapProject(doc) : null;
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
  return result.docs.map((doc) => String(doc.slug ?? ""));
}
