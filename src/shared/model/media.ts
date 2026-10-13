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

