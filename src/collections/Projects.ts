import type { CollectionConfig } from "payload";

export const Projects: CollectionConfig = {
  slug: "projects",
  labels: {
    singular: "Projet",
    plural: "Projets",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "client", "status", "displayOrder", "updatedAt"],
  },
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data && !data.slug && data.title) {
          data.slug = data.title
            .toLowerCase()
            .trim()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
        }
        return data;
      },
    ],
    beforeChange: [
      ({ data, originalDoc }) => {
        if (
          data &&
          data.status === "published" &&
          originalDoc?.status !== "published"
        ) {
          data.publishedAt = new Date().toISOString();
        }
        return data;
      },
    ],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "Titre",
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      label: "Slug",
      admin: {
        description: "Auto-genere depuis le titre. Modifiable manuellement.",
      },
    },
    {
      name: "client",
      type: "text",
      label: "Client",
    },
    {
      name: "year",
      type: "text",
      label: "Annee",
      admin: {
        description: "Ex: 2022, 2023 - 2025",
      },
    },
    {
      name: "category",
      type: "text",
      label: "Categorie",
      admin: {
        description: "Ex: video, CLIP VIDEO, Motion design",
      },
    },
    {
      name: "description",
      type: "richText",
      label: "Description",
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      required: true,
      label: "Image de couverture",
    },
    {
      name: "galleryImages",
      type: "array",
      label: "Galerie d'images",
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
          label: "Image",
        },
      ],
    },
    {
      name: "videoUrl",
      type: "text",
      label: "URL video",
      admin: {
        description: "URL d'embed YouTube ou Vimeo",
      },
    },
    {
      name: "subProjects",
      type: "array",
      label: "Sous-projets",
      admin: {
        description: "Sous-sections du projet (ex: tournage, pub, aftermovie)",
      },
      fields: [
        {
          name: "subTitle",
          type: "text",
          required: true,
          label: "Titre du sous-projet",
        },
        {
          name: "subDescription",
          type: "richText",
          label: "Description",
        },
        {
          name: "subMedia",
          type: "array",
          label: "Medias",
          fields: [
            {
              name: "image",
              type: "upload",
              relationTo: "media",
              required: true,
              label: "Media",
            },
          ],
        },
      ],
    },
    {
      name: "displayOrder",
      type: "number",
      required: true,
      defaultValue: 0,
      label: "Ordre d'affichage",
      admin: {
        step: 1,
        description: "Plus petit = affiche en premier",
      },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "draft",
      label: "Statut",
      options: [
        { label: "Brouillon", value: "draft" },
        { label: "Publie", value: "published" },
      ],
    },
    {
      name: "publishedAt",
      type: "date",
      label: "Date de publication",
      admin: {
        description: "Defini automatiquement lors de la premiere publication.",
        readOnly: true,
      },
    },
  ],
};
