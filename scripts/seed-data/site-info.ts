import { richText } from "./rich-text";

/**
 * Données seed pour le global SiteInfo.
 * Extraites du site Framer cestmoitia.framer.website.
 */
export const siteInfoSeed = {
  heroTagline: "filmaker / graphiste + motion designer",

  bio: richText(
    "Moi, c'est Tia, un jeune créatif passionné par l'audiovisuel, avec plus de 7 ans d'expérience professionnelle en entreprise et en freelance.\n\n" +
      "Je crée, j'imagine et je construis dans le monde digital, là où tout devient possible.\n\n" +
      "Curieux et motivé, je continue chaque jour à apprendre à travers de nouvelles expériences et de nouveaux projets. Parfois un peu désordonné, mais toujours animé par la créativité et l'efficacité.",
  ),

  email: "cestmoitia@gmail.com",
  phone: "+689 87 76 98 19",

  location: {
    city: "Puna'auia",
    zipCode: "98717",
    country: "Tahiti",
    countryCode: "PF",
  },

  cvUrl: "https://drive.google.com/file/d/1_nKIV5dD5uJhUEDIJAKOSDmm6Ynio-BM/view?usp=sharing",
  instagramUrl: "https://www.instagram.com/cestmoitia/",
  facebookUrl: "https://www.facebook.com/Cestmoitia/",

  services: [
    {
      title: "Captation Vidéo",
      description: "Maîtrise de mon matériel, expertise du terrain",
    },
    {
      title: "Photographie",
      description: "Mariage, portrait, real estate, événement... etc",
    },
    {
      title: "Montage Vidéo",
      description: "Documentaire, clip vidéo, Publicité ... etc",
    },
    {
      title: "Graphisme",
      description: "Création visuels tout support",
    },
    {
      title: "Motion Design",
      description: "Maîtrise d'After Effect",
    },
  ],

  experiences: [
    {
      company: "Freelance",
      position: "photographe // cadreur // monteur // motion designer // graphiste",
      year: "2018 - 2026",
      description:
        "Depuis le lycée, j'évolue dans le milieu professionnel de l'audiovisuel à travers différents médiums. C'est avant tout un métier passion qui m'anime et me motive au quotidien.",
    },
    {
      company: "Aremiti",
      position: "community manager // graphiste",
      year: "2024",
      description: "Mission de 3 mois en tant que community manager",
    },
    {
      company: "Jiku Production",
      position: "cadreur // monteur // motion designer // graphiste",
      year: "2020 - 2024",
      description:
        "J'ai effectué deux stages durant ma licence au sein d'Exotic Garden, en totale autonomie tout en travaillant en harmonie avec l'équipe. Suite à ces expériences, j'ai intégré l'entreprise en 2023 en tant que CVD.",
    },
    {
      company: "Exotic Garden",
      position: "cadreur // monteur // motion designer",
      year: "2022",
      description:
        "Stage d'un mois chez Exotic Garden : création de contenu audiovisuel en quasi-autonomie. Une expérience enrichissante et professionnalisante.",
    },
  ],
};
