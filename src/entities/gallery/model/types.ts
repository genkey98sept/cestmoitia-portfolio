import type { Media } from "@/entities/project";

export type GalleryPhoto = {
  id: string;
  image: Media;
  caption?: string;
  featured: boolean;
  displayOrder: number;
  status: "published" | "draft";
  createdAt: string;
  updatedAt: string;
};
