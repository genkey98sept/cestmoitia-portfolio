import type { Media } from "@/shared/model";

export type { Media, MediaSize } from "@/shared/model";

export type SubProject = {
  id?: string;
  subTitle: string;
  subDescription?: unknown;
  youtubeUrl?: string;
  subMedia?: Array<{ image: Media; id?: string }>;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  client?: string;
  year?: string;
  category?: string;
  description?: unknown;
  coverImage: Media;
  galleryImages?: Array<{ image: Media; id?: string }>;
  videoUrl?: string;
  subProjects?: SubProject[];
  displayOrder: number;
  status: "published" | "draft";
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
};
