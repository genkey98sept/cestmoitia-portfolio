import { richText } from "./rich-text";

/**
 * Données seed pour la collection Projects.
 * Extraites du site Framer cestmoitia.framer.website.
 *
 * Les champs coverImage / galleryImages / subMedia utilisent des clés
 * du mediaMap qui seront résolues en IDs Payload au runtime par seed.ts.
 */

export type ProjectSeed = {
  title: string;
  slug: string;
  client: string;
  year: string;
  category: string;
  description: ReturnType<typeof richText>;
  coverImageKey: string;
  galleryImageKeys: string[];
  videoUrl?: string;
  subProjects: {
    subTitle: string;
    subDescription: ReturnType<typeof richText>;
    subMediaKeys: string[];
    videoUrl?: string; // Pour référence, stocké en description si besoin
  }[];
  displayOrder: number;
  status: "published" | "draft";
};

export const projectsSeed: ProjectSeed[] = [
  // ═══════════════════════════════════════════════════
  // 1. AMEX
  // ═══════════════════════════════════════════════════
  {
    title: "AMEX",
    slug: "amex",
    client: "OFINA",
    year: "2024",
    category: "Publicité // aftermovie",
    description: richText(
      "J'ai participé à de multiples collaborations, notamment dans le cadre de campagnes publicitaires",
    ),
    coverImageKey: "amex-cover",
    galleryImageKeys: [
      "amex-gallery-1",
      "amex-gallery-2",
      "amex-gallery-3",
      "amex-gallery-4",
      "amex-gallery-5",
      "amex-gallery-6",
    ],
    videoUrl: "https://www.youtube.com/embed/WR0rZgKg2cU",
    subProjects: [
      {
        subTitle: "Publicité",
        subDescription: richText(
          "Collaboration stratégique avec Ofina / Amex pour le déploiement de campagnes publicitaires multi-supports. L'objectif : valoriser les avantages exclusifs de la marque auprès des commerçants partenaires et de leur clientèle. Pour garantir un impact maximal, le contenu a été décliné sur un écosystème média complet, incluant la TV, la radio et les réseaux sociaux, ainsi qu'un dispositif d'affichage urbain dynamique via des panneaux 4/3 et des écrans LED.",
        ),
        subMediaKeys: [],
      },
      {
        subTitle: "Aftermovie",
        subDescription: richText(
          "Immersion au cœur de l'Amex Padel Cup 2024 avec la réalisation de cet aftermovie officiel. L'objectif était de capturer l'intensité de la compétition et l'énergie de l'événement pour American Express, à travers un montage rythmé et dynamique.",
        ),
        subMediaKeys: [],
        videoUrl: "https://www.youtube.com/embed/XGZbkYMzM0g",
      },
    ],
    displayOrder: 1,
    status: "published",
  },

  // ═══════════════════════════════════════════════════
  // 2. SOCREDO
  // ═══════════════════════════════════════════════════
  {
    title: "SOCREDO",
    slug: "socredo",
    client: "SOCREDO",
    year: "2023 - 2025",
    category: "SOCREDO X MISS TAHITI",
    description: richText(
      "Collaboration continue avec les services marketing et communication de la Banque Socredo pour la production de campagnes publicitaires et de contenus vidéo visant à valoriser les engagements de la banque",
    ),
    coverImageKey: "socredo-cover",
    galleryImageKeys: [
      "socredo-gallery-1",
      "socredo-gallery-2",
      "socredo-gallery-3",
      "socredo-gallery-4",
    ],
    videoUrl: "https://www.youtube.com/embed/VFEiMR9h3mo",
    subProjects: [
      {
        subTitle: "SOCREDO // MISS TAHITI",
        subDescription: richText(
          "Réalisation d'une campagne publicitaire en collaboration avec le comité Miss Tahiti. Un contenu dédié à la valorisation du patrimoine culturel et à la promotion de l'élection à travers une identité visuelle élégante et institutionnelle",
        ),
        subMediaKeys: [],
      },
      {
        subTitle: "Aftermovie Socredo 2023",
        subDescription: richText(
          "Captation de la soirée annuelle de la Banque Socredo, célébrant l'engagement de ses collaborateurs. Ce projet vidéo souligne un moment charnière pour l'institution : la révélation officielle de sa nouvelle identité visuelle et de son nouveau logo.",
        ),
        subMediaKeys: [],
        videoUrl: "https://www.youtube.com/embed/53o0MnFzJHA",
      },
      {
        subTitle: "SOCREDO // AOA // SOS Village",
        subDescription: richText(
          "Aftermovie d'une initiative solidaire entre la Banque Socredo, AOA et SOS Village d'Enfants. Cette immersion documente une journée de partage au parc AOA, visant à offrir un moment d'évasion aux enfants tout en les sensibilisant à la préservation de la faune et de la flore locales.",
        ),
        subMediaKeys: [],
        videoUrl: "https://www.youtube.com/embed/rlRfoj5VHVc",
      },
      {
        subTitle: "Socredo // Heiva",
        subDescription: richText(
          "Conception d'affiches et de contenus en motion design dédiés à la promotion de la culture et de la langue polynésienne durant le Heiva i Tahiti.",
        ),
        subMediaKeys: [],
        videoUrl: "https://www.youtube.com/embed/xceUzE0F1PU",
      },
    ],
    displayOrder: 2,
    status: "published",
  },

  // ═══════════════════════════════════════════════════
  // 3. EXOTIC GARDEN
  // ═══════════════════════════════════════════════════
  {
    title: "EXOTIC GARDEN",
    slug: "exotic-garden",
    client: "Exotic Garden",
    year: "2022",
    category: "Video // MOTION DESIGN",
    description: richText(
      "Immersion professionnelle au sein du pôle création de l'agence lors de mon stage de fin de licence.",
    ),
    coverImageKey: "exotic-garden-cover",
    galleryImageKeys: [],
    videoUrl: "https://www.youtube.com/embed/rN1p6TUmvKM",
    subProjects: [
      {
        subTitle: "Tahiti Fashion Week",
        subDescription: richText(
          "Collaboration stratégique autour de la Tahiti Fashion Week pour le déploiement de sa communication visuelle. Une participation active à la promotion de l'événement à travers la création de contenus réseaux sociaux et la captation de séquences backstage.",
        ),
        subMediaKeys: [],
        videoUrl: "https://www.youtube.com/embed/RbfwAObrYLk",
      },
    ],
    displayOrder: 3,
    status: "published",
  },

  // ═══════════════════════════════════════════════════
  // 4. AREMITI
  // ═══════════════════════════════════════════════════
  {
    title: "AREMITI",
    slug: "aremiti",
    client: "Aremiti",
    year: "2024",
    category: "Crea video // Community manager",
    description: richText(
      "Mission de Community Management d'une durée de trois mois au sein du pôle digital. Une immersion stratégique dédiée à la gestion de l'image de marque.",
    ),
    coverImageKey: "aremiti-cover",
    galleryImageKeys: [
      "aremiti-gallery-1",
      "aremiti-gallery-2",
      "aremiti-gallery-3",
      "aremiti-gallery-4",
      "aremiti-gallery-5",
    ],
    videoUrl: "https://www.youtube.com/embed/DrT_XvF1xi0",
    subProjects: [
      {
        subTitle: "Consigne de sécurité",
        subDescription: richText(
          "Réalisation de la vidéo de sécurité pour la flotte Aremiti. Sous la direction artistique de l'entreprise, ce projet a nécessité une exécution technique rigoureuse pour traduire les protocoles de sécurité en un support visuel clair.",
        ),
        subMediaKeys: [],
      },
      {
        subTitle: "Community Manager",
        subDescription: richText(
          "Conception et réalisation de supports visuels et digitaux sur mesure, répondant aux besoins ponctuels de l'entreprise. Une série de contenus variés (post, story, print) créés pour soutenir les temps forts.",
        ),
        subMediaKeys: [],
      },
    ],
    displayOrder: 4,
    status: "published",
  },

  // ═══════════════════════════════════════════════════
  // 5. BIGA*RANX
  // ═══════════════════════════════════════════════════
  {
    title: "Biga*Ranx",
    slug: "biga-ranx",
    client: "BIGA RANX",
    year: "2025",
    category: "CLIP VIDEO",
    description: richText(
      "Réalisation de clip vidéo à destination du clip 'Natural Woman' de Biga*Ranx en collaboration avec Kea un artiste local.",
    ),
    coverImageKey: "biga-ranx-cover",
    galleryImageKeys: [
      "biga-ranx-gallery-1",
      "biga-ranx-gallery-2",
      "biga-ranx-gallery-3",
      "biga-ranx-gallery-4",
    ],
    videoUrl: "https://www.youtube.com/embed/ieEYBUJQSXU",
    subProjects: [
      {
        subTitle: "Tournage",
        subDescription: richText(
          "Direction de production et réalisation du clip 'Natural Woman', né de la collaboration entre l'artiste international Biga*Ranx et l'artiste local Kea. Un projet d'envergure mené sur deux jours de tournage intensifs, alliant esthétique visuelle soignée et gestion de plateau pour retranscrire l'univers singulier de cette œuvre musicale.",
        ),
        subMediaKeys: [],
      },
    ],
    displayOrder: 5,
    status: "published",
  },

  // ═══════════════════════════════════════════════════
  // 6. PROJET PERSO
  // ═══════════════════════════════════════════════════
  {
    title: "PROJET PERSO",
    slug: "projet-perso",
    client: "PROJET PERSO",
    year: "2022",
    category: "video",
    description: richText(
      "Projets personnels de création vidéo, alliant passion et expérimentation artistique.",
    ),
    coverImageKey: "projet-perso-cover",
    galleryImageKeys: [],
    videoUrl: "https://www.youtube.com/embed/ZJkJKtowr3Q",
    subProjects: [
      {
        subTitle: "Video Tatau Legacy",
        subDescription: richText(
          "Réalisation vidéo avec le tatoueur Teaniva Dinard. L'idée de ce projet était de mélanger nos deux styles pour créer un contenu qui mettrait en avant nos deux univers en même temps, en jouant sur une ambiance visuelle forte.",
        ),
        subMediaKeys: [],
      },
      {
        subTitle: "Pub Carver",
        subDescription: richText(
          "Réalisation d'un spot publicitaire fictif pour la marque de skateboards Carver dans le cadre d'un projet scolaire. Cette production a bénéficié d'une large visibilité après avoir été officiellement relayée par la marque sur son compte Instagram 'carver_france'. Cette republication souligne la pertinence de la direction artistique choisie et la qualité d'exécution technique du projet, dépassant ainsi les attentes du cadre scolaire initial.",
        ),
        subMediaKeys: [],
        videoUrl: "https://www.youtube.com/embed/CD3g7qkhLBM",
      },
    ],
    displayOrder: 6,
    status: "published",
  },
];
