import type { Media } from "@/shared/model";

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
