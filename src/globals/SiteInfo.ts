import { revalidatePath, revalidateTag } from "next/cache";
import type { GlobalConfig } from "payload";

export const SiteInfo: GlobalConfig = {
  slug: "site-info",
  label: "Infos du site",
  access: {
    read: () => true,
    update: ({ req }) => !!req.user,
  },
  hooks: {
    afterChange: [
      ({ doc }) => {
        try {
          revalidatePath("/");
          revalidatePath("/work");
          revalidatePath("/photography");
          revalidatePath("/contact");
          revalidateTag("site-info");
        } catch {
          // Revalidation can fail during build/seed — safe to ignore
        }
        return doc;
      },
    ],
  },
  fields: [
    {
      name: "heroTagline",
      type: "text",
      label: "Tagline hero",
      admin: {
        description:
          "Phrase d'accroche affichee sur le hero de la homepage.",
      },
    },
    {
      name: "bio",
      type: "richText",
      label: "Bio / A propos",
    },
    {
      type: "row",
      fields: [
        {
          name: "email",
          type: "email",
          required: true,
          label: "Email de contact",
          admin: { width: "50%" },
        },
        {
          name: "phone",
          type: "text",
          label: "Telephone",
          admin: { width: "50%" },
        },
      ],
    },
    {
      name: "location",
      type: "group",
      label: "Localisation",
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "city",
              type: "text",
              label: "Ville",
              admin: { width: "50%" },
            },
            {
              name: "zipCode",
              type: "text",
              label: "Code postal",
              admin: { width: "50%" },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "country",
              type: "text",
              label: "Pays / Territoire",
              admin: { width: "50%" },
            },
            {
              name: "countryCode",
              type: "text",
              label: "Code pays",
              admin: {
                width: "50%",
                description: "Ex: PF pour Polynesie francaise",
              },
            },
          ],
        },
      ],
    },
    {
      name: "cvUrl",
      type: "text",
      label: "Lien vers le CV",
      admin: {
        description: "URL du CV (Google Drive, etc.)",
      },
    },
    {
      name: "instagramUrl",
      type: "text",
      label: "Instagram",
    },
    {
      name: "facebookUrl",
      type: "text",
      label: "Facebook",
    },
    {
      name: "twitterUrl",
      type: "text",
      label: "Twitter / X",
    },
    {
      name: "otherLinks",
      type: "array",
      label: "Autres liens",
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
          label: "Libelle",
        },
        {
          name: "url",
          type: "text",
          required: true,
          label: "URL",
        },
      ],
    },
    {
      name: "services",
      type: "array",
      label: "Services",
      admin: {
        description: "Liste des services proposes (affiches sur la homepage).",
      },
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
          label: "Titre du service",
        },
        {
          name: "description",
          type: "textarea",
          label: "Description",
        },
      ],
    },
    {
      name: "experiences",
      type: "array",
      label: "Experiences",
      admin: {
        description:
          "Parcours professionnel (affiche sur la homepage).",
      },
      fields: [
        {
          name: "company",
          type: "text",
          required: true,
          label: "Entreprise",
        },
        {
          name: "position",
          type: "text",
          required: true,
          label: "Poste / Role",
        },
        {
          name: "year",
          type: "text",
          required: true,
          label: "Annee(s)",
          admin: {
            description: "Ex: 2022, 2020 - 2024",
          },
        },
        {
          name: "description",
          type: "textarea",
          label: "Description",
        },
      ],
    },
  ],
};
