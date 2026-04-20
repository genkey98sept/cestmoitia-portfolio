import { getPayloadClient } from "@/shared/lib";
import type { Media } from "@/entities/project";

import type { GalleryPhoto } from "../model/types";

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

function mapPhoto(raw: any): GalleryPhoto {
  return {
    id: raw.id ?? "",
    image: typeof raw.image === "object" ? mapMedia(raw.image) : raw.image,
    caption: raw.caption,
    featured: !!raw.featured,
    displayOrder: raw.displayOrder ?? 0,
    status: raw.status ?? "draft",
    createdAt: raw.createdAt ?? "",
    updatedAt: raw.updatedAt ?? "",
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function getGalleryPhotos(): Promise<GalleryPhoto[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "gallery",
    where: {
      status: { equals: "published" },
    },
    sort: "displayOrder",
    depth: 1,
    limit: 200,
  });
  return result.docs.map(mapPhoto);
}
