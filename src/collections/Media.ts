import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  labels: {
    singular: "Media",
    plural: "Medias",
  },
  admin: {
    useAsTitle: "alt",
    defaultColumns: ["alt", "filename", "mimeType", "updatedAt"],
  },
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  upload: {
    mimeTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
      "image/svg+xml",
      "video/mp4",
      "video/webm",
    ],
    imageSizes: [
      {
        name: "thumbnail",
        width: 300,
        height: 300,
        fit: "cover",
      },
      {
        name: "card",
        width: 768,
        height: 480,
        fit: "cover",
      },
      {
        name: "full",
        width: 1920,
        height: 1080,
        fit: "contain",
        withoutEnlargement: true,
      },
    ],
    adminThumbnail: "thumbnail",
    crop: true,
    focalPoint: true,
    bulkUpload: true,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      label: "Texte alternatif",
    },
    {
      name: "caption",
      type: "textarea",
      label: "Legende",
    },
  ],
};
