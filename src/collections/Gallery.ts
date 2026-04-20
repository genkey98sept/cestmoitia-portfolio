import { revalidatePath, revalidateTag } from "next/cache";
import type { CollectionConfig } from "payload";

export const Gallery: CollectionConfig = {
  slug: "gallery",
  labels: {
    singular: "Photo de galerie",
    plural: "Galerie",
  },
  admin: {
    useAsTitle: "caption",
    defaultColumns: ["image", "caption", "featured", "displayOrder", "status"],
    description:
      "Photos affichees sur la page Galerie. La photo 'vedette' apparait en grand au sommet, les autres composent une mosaique.",
    pagination: {
      defaultLimit: 50,
    },
    listSearchableFields: ["caption"],
  },
  defaultSort: "displayOrder",
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  hooks: {
    afterChange: [
      ({ doc }) => {
        try {
          revalidatePath("/photography");
          revalidateTag("gallery");
        } catch {
          // Safe to ignore during build/seed
        }
        return doc;
      },
    ],
    afterDelete: [
      ({ doc }) => {
        try {
          revalidatePath("/photography");
          revalidateTag("gallery");
        } catch {
          // Safe to ignore during build/seed
        }
        return doc;
      },
    ],
  },
  fields: [
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
      label: "Image",
      admin: {
        description:
          "Le ratio est preserve automatiquement dans la mosaique. Privilegier les visuels haute definition.",
      },
    },
    {
      name: "caption",
      type: "text",
      label: "Legende (optionnelle)",
      admin: {
        description:
          "Affichee en survol de l'image. Sert egalement de titre dans cette liste d'admin.",
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "featured",
          type: "checkbox",
          defaultValue: false,
          label: "Image vedette",
          admin: {
            width: "50%",
            description:
              "Mise en avant en grand au sommet de la page. Une seule a la fois ideal.",
          },
        },
        {
          name: "displayOrder",
          type: "number",
          required: true,
          defaultValue: 0,
          label: "Ordre d'affichage",
          admin: {
            width: "50%",
            step: 1,
            description: "Plus petit = affiche en premier.",
          },
        },
      ],
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "published",
      label: "Statut",
      options: [
        { label: "Brouillon", value: "draft" },
        { label: "Publie", value: "published" },
      ],
    },
  ],
};
