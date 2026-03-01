export type MediaSize = {
  filename: string | null;
  width: number | null;
  height: number | null;
  url?: string | null;
};

export type Media = {
  id: string;
  alt: string;
  caption?: string;
  filename: string;
  mimeType: string;
  filesize: number;
  width?: number;
  height?: number;
  url?: string;
  sizes?: {
    thumbnail?: MediaSize;
    card?: MediaSize;
    full?: MediaSize;
  };
};

export type SubProject = {
  id?: string;
  subTitle: string;
  subDescription?: unknown;
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
