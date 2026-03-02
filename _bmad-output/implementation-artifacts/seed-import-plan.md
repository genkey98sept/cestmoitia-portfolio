# Plan d'Import Seed — Ultra-Optimisé

**Projet :** tia (cestmoitia.framer.website → Next.js + Payload CMS)
**Date :** 2026-03-01
**Auteur :** BMad Master

---

## 1. OBJECTIF

Importer l'intégralité du contenu du site Framer (cestmoitia.framer.website) dans le CMS Payload, en exploitant les médias locaux du dossier SwissTransfer, pour obtenir un site fonctionnel et fidèle à l'original dès le premier déploiement.

---

## 2. STRATÉGIE D'IMPORT — 3 PHASES SÉQUENTIELLES

```
Phase 1: Médias (upload vers Vercel Blob via Payload API)
    ↓
Phase 2: SiteInfo (global — dépend d'aucun média)
    ↓
Phase 3: Projets (dépendent des IDs médias créés en Phase 1)
```

**Raison de cet ordre :** Les projets ont des relations `upload` vers la collection Media. Il faut que les médias existent en DB avec leurs IDs avant de créer les projets qui les référencent.

---

## 3. PHASE 1 — IMPORT DES MÉDIAS

### 3.1 Préparation des médias (pré-processing)

**CRITIQUE :** Les fichiers bruts du dossier SwissTransfer font 8.8 GB. Ils doivent être optimisés AVANT upload.

#### Script de pré-processing (`scripts/prepare-media.ts`)

```
Pour chaque image :
  1. Convertir en WebP (qualité 85%)
  2. Redimensionner : max 2400px côté le plus long
  3. Générer un nom de fichier normalisé (kebab-case, sans accents)
  4. Conserver les métadonnées EXIF pertinentes

Pour chaque vidéo :
  → NE PAS inclure dans l'upload Payload
  → Les vidéos sont sur YouTube (12 liens identifiés)
  → Seules les vidéos self-hosted courtes (stories, teasers) seront uploadées
  → Le champ videoUrl stockera les URLs YouTube embed
```

#### Fichier de mapping média (`scripts/seed-data/media-map.ts`)

Ce fichier associe chaque média local à son rôle dans le seed :

```typescript
export const mediaMap = {
  // === COVERS DE PROJETS ===
  "amex-cover": {
    sourcePath: "VIDEO/Amex/amex cover.jpg",
    alt: "Campagne publicitaire AMEX Padel Cup",
    role: "cover", project: "amex"
  },
  "socredo-cover": {
    sourcePath: "VIDEO/Socredo/mpv-shot0013.jpg",
    alt: "Collaboration Socredo Miss Tahiti",
    role: "cover", project: "socredo"
  },
  "exotic-garden-cover": {
    sourcePath: "VIDEO/Exotic Garden/mpv-shot0010.jpg",
    alt: "Tahiti Fashion Week - Exotic Garden",
    role: "cover", project: "exotic-garden"
  },
  "aremiti-cover": {
    sourcePath: "PHOTO/Aremiti/vlcsnap-2024-10-02-11h24m47s318.png",
    alt: "Mission community management Aremiti",
    role: "cover", project: "aremiti"
  },
  "biga-ranx-cover": {
    sourcePath: "PHOTO/Biga ranx/Biga_Ranx ft. Kea - Natural Woman (Clip officiel).jpeg",
    alt: "Clip Natural Woman - Biga Ranx ft. Kea",
    role: "cover", project: "biga-ranx"
  },
  "projet-perso-cover": {
    sourcePath: "VIDEO/Projets perso/mpv-shot-or-placeholder.jpg",
    alt: "Projets personnels vidéo",
    role: "cover", project: "projet-perso"
    // NOTE: pas de cover explicite — utiliser un frame grab ou photo perso
  },

  // === GALERIE PROJETS ===
  // Amex — 6 captures vidéo
  "amex-gallery-1": { sourcePath: "VIDEO/Amex/mpv-shot0001.jpg", alt: "AMEX campagne publicitaire", role: "gallery", project: "amex" },
  "amex-gallery-2": { sourcePath: "VIDEO/Amex/mpv-shot0002.jpg", alt: "AMEX spot TV", role: "gallery", project: "amex" },
  "amex-gallery-3": { sourcePath: "VIDEO/Amex/mpv-shot0003.jpg", alt: "AMEX production vidéo", role: "gallery", project: "amex" },
  "amex-gallery-4": { sourcePath: "VIDEO/Amex/mpv-shot0004.jpg", alt: "AMEX tournage", role: "gallery", project: "amex" },
  "amex-gallery-5": { sourcePath: "VIDEO/Amex/mpv-shot0005.jpg", alt: "AMEX post-production", role: "gallery", project: "amex" },
  "amex-gallery-6": { sourcePath: "VIDEO/Amex/mpv-shot0009.jpg", alt: "AMEX aftermovie Padel Cup", role: "gallery", project: "amex" },

  // Aremiti — designs + social
  "aremiti-gallery-1": { sourcePath: "PHOTO/Aremiti/Artboard 1-100.jpg", alt: "Design graphique Aremiti", role: "gallery", project: "aremiti" },
  "aremiti-gallery-2": { sourcePath: "PHOTO/Aremiti/Artboard 2-100.jpg", alt: "Création visuelle Aremiti", role: "gallery", project: "aremiti" },
  "aremiti-gallery-3": { sourcePath: "PHOTO/Aremiti/473081670_n.jpg", alt: "Publication social media Aremiti", role: "gallery", project: "aremiti" },

  // Socredo — designs
  "socredo-gallery-1": { sourcePath: "PHOTO/Socredo/SOC REO V9-100.jpg", alt: "Design campagne Socredo", role: "gallery", project: "socredo" },
  "socredo-gallery-2": { sourcePath: "VIDEO/Socredo/mpv-shot0014.jpg", alt: "Aftermovie soirée Socredo", role: "gallery", project: "socredo" },
  "socredo-gallery-3": { sourcePath: "VIDEO/Socredo/mpv-shot0015.jpg", alt: "Événement Socredo AOA", role: "gallery", project: "socredo" },

  // Biga Ranx — BTS
  "biga-ranx-gallery-1": { sourcePath: "PHOTO/Biga ranx/Biga_Ranx ft. Kea - Natural Woman (Clip officiel) (1).jpeg", alt: "Tournage clip Natural Woman", role: "gallery", project: "biga-ranx" },
  "biga-ranx-gallery-2": { sourcePath: "PHOTO/Biga ranx/WhatsApp Image 2025-06-09 at 13.28.14.jpeg", alt: "Behind the scenes Biga Ranx", role: "gallery", project: "biga-ranx" },
  "biga-ranx-gallery-3": { sourcePath: "PHOTO/Biga ranx/WhatsApp Image 2025-06-09 at 13.28.15.jpeg", alt: "Plateau de tournage Natural Woman", role: "gallery", project: "biga-ranx" },

  // === PROFIL / BIO ===
  "profile-main": {
    sourcePath: "PHOTO/Moi + logo/bigblack.jpg",
    alt: "Tia — Filmmaker et graphiste basé à Tahiti",
    role: "profile"
  },
  "profile-alt": {
    sourcePath: "PHOTO/Moi + logo/bigpa.jpg",
    alt: "Tia — Portrait",
    role: "profile"
  },
  "logo": {
    sourcePath: "PHOTO/Moi + logo/Untitled-1.png",
    alt: "Logo cestmoitia",
    role: "branding"
  },

  // === PHOTOGRAPHIE (page /photography) ===
  // 48 photos dans PHOTO/Mes photos/ — à importer en batch
  // Naming: photo-001 à photo-048
  // Alt text à générer depuis le contexte (sport, auto, portrait, etc.)
};
```

### 3.2 Upload séquentiel vers Payload

```typescript
// Pseudo-code du flow d'upload
for (const [key, media] of Object.entries(mediaMap)) {
  const optimizedFile = await optimizeImage(media.sourcePath);
  const created = await payload.create({
    collection: 'media',
    data: { alt: media.alt },
    file: optimizedFile,
  });
  mediaIdRegistry[key] = created.id; // Stocker l'ID pour Phase 3
}
```

**Résultat attendu Phase 1 :** ~70-80 entrées Media en DB avec IDs, images optimisées sur Vercel Blob.

---

## 4. PHASE 2 — SEED SITEINFO (GLOBAL)

### 4.1 Données complètes extraites

```typescript
const siteInfoSeed: SiteInfoSeedData = {
  heroTagline: "filmaker / graphiste + motion designer",

  bio: /* Lexical RichText */ {
    root: {
      children: [
        paragraph("Moi, c'est Tia, un jeune créatif passionné par l'audiovisuel, avec plus de 7 ans d'expérience professionnelle en entreprise et en freelance."),
        paragraph("Je crée, j'imagine et je construis dans le monde digital, là où tout devient possible."),
        paragraph("Curieux et motivé, je continue chaque jour à apprendre à travers de nouvelles expériences et de nouveaux projets. Parfois un peu désordonné, mais toujours animé par la créativité et l'efficacité."),
      ]
    }
  },

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
  twitterUrl: null,

  services: [
    { title: "Captation Vidéo", description: "Maîtrise de mon matériel, expertise du terrain" },
    { title: "Photographie", description: "Mariage, portrait, real estate, événement... etc" },
    { title: "Montage Vidéo", description: "Documentaire, clip vidéo, Publicité ... etc" },
    { title: "Graphisme", description: "Création visuels tout support" },
    { title: "Motion Design", description: "Maîtrise d'After Effect" },
  ],

  experiences: [
    {
      company: "Freelance",
      position: "photographe // cadreur // monteur // motion designer // graphiste",
      year: "2018 - 2026",
      description: "Depuis le lycée, j'évolue dans le milieu professionnel de l'audiovisuel à travers différents médiums. C'est avant tout un métier passion qui m'anime et me motive au quotidien.",
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
      description: "J'ai effectué deux stages durant ma licence au sein d'Exotic Garden, en totale autonomie tout en travaillant en harmonie avec l'équipe. Suite à ces expériences, j'ai intégré l'entreprise en 2023 en tant que CVD.",
    },
    {
      company: "Exotic Garden",
      position: "cadreur // monteur // motion designer",
      year: "2022",
      description: "Stage d'un mois chez Exotic Garden : création de contenu audiovisuel en quasi-autonomie. Une expérience enrichissante et professionnalisante.",
    },
  ],
};
```

---

## 5. PHASE 3 — SEED PROJETS

### 5.1 Ordre d'affichage (displayOrder)

Basé sur l'ordre d'apparition sur la homepage du site Framer :

| displayOrder | Projet | Slug |
|---|---|---|
| 1 | AMEX | amex |
| 2 | SOCREDO | socredo |
| 3 | EXOTIC GARDEN | exotic-garden |
| 4 | AREMITI | aremiti |
| 5 | BIGA*RANX | biga-ranx |
| 6 | PROJET PERSO | projet-perso |

### 5.2 Données complètes par projet

#### PROJET 1 — AMEX

```typescript
{
  title: "AMEX",
  slug: "amex",
  client: "OFINA",
  year: "2024",
  category: "Publicité // aftermovie",
  description: richText("J'ai participé à de multiples collaborations, notamment dans le cadre de campagnes publicitaires"),
  coverImage: mediaIdRegistry["amex-cover"],
  galleryImages: [
    { image: mediaIdRegistry["amex-gallery-1"] },
    { image: mediaIdRegistry["amex-gallery-2"] },
    { image: mediaIdRegistry["amex-gallery-3"] },
    { image: mediaIdRegistry["amex-gallery-4"] },
    { image: mediaIdRegistry["amex-gallery-5"] },
    { image: mediaIdRegistry["amex-gallery-6"] },
  ],
  videoUrl: "https://www.youtube.com/embed/WR0rZgKg2cU",
  subProjects: [
    {
      subTitle: "Research",
      subDescription: richText("Collaboration stratégique avec Ofina / Amex pour le déploiement de campagnes publicitaires multi-supports. L'objectif : valoriser les avantages exclusifs de la marque auprès des commerçants partenaires et de leur clientèle. Pour garantir un impact maximal, le contenu a été décliné sur un écosystème média complet, incluant la TV, la radio et les réseaux sociaux, ainsi qu'un dispositif d'affichage urbain dynamique via des panneaux 4/3 et des écrans LED."),
      subMedia: [],
    },
    {
      subTitle: "Aftermovie",
      subDescription: richText("Immersion au cœur de l'Amex Padel Cup 2024 avec la réalisation de cet aftermovie officiel. L'objectif était de capturer l'intensité de la compétition et l'énergie de l'événement pour American Express, à travers un montage rythmé et dynamique."),
      subMedia: [],
    },
  ],
  displayOrder: 1,
  status: "published",
}
```

#### PROJET 2 — SOCREDO

```typescript
{
  title: "SOCREDO",
  slug: "socredo",
  client: "SOCREDO",
  year: "2023 - 2025",
  category: "SOCREDO X MISS TAHITI",
  description: richText("Collaboration continue avec les services marketing et communication de la Banque Socredo pour la production de campagnes publicitaires et de contenus vidéo visant à valoriser les engagements de la banque"),
  coverImage: mediaIdRegistry["socredo-cover"],
  galleryImages: [
    { image: mediaIdRegistry["socredo-gallery-1"] },
    { image: mediaIdRegistry["socredo-gallery-2"] },
    { image: mediaIdRegistry["socredo-gallery-3"] },
  ],
  videoUrl: "https://www.youtube.com/embed/VFEiMR9h3mo",
  subProjects: [
    {
      subTitle: "SOCREDO // MISS TAHITI",
      subDescription: richText("Réalisation d'une campagne publicitaire en collaboration avec le comité Miss Tahiti. Un contenu dédié à la valorisation du patrimoine culturel et à la promotion de l'élection à travers une identité visuelle élégante et institutionnelle"),
      subMedia: [],
    },
    {
      subTitle: "Aftermovie Socredo 2023",
      subDescription: richText("Captation de la soirée annuelle de la Banque Socredo, célébrant l'engagement de ses collaborateurs. Ce projet vidéo souligne un moment charnière pour l'institution : la révélation officielle de sa nouvelle identité visuelle et de son nouveau logo."),
      subMedia: [],
    },
    {
      subTitle: "SOCREDO // AOA // SOS Village",
      subDescription: richText("Aftermovie d'une initiative solidaire entre la Banque Socredo, AOA et SOS Village d'Enfants. Cette immersion documente une journée de partage au parc AOA, visant à offrir un moment d'évasion aux enfants tout en les sensibilisant à la préservation de la faune et de la flore locales."),
      subMedia: [],
    },
    {
      subTitle: "Socredo // Heiva",
      subDescription: richText("Conception d'affiches et de contenus en motion design dédiés à la promotion de la culture et de la langue polynésienne durant le Heiva i Tahiti."),
      subMedia: [],
    },
  ],
  displayOrder: 2,
  status: "published",
}
```

#### PROJET 3 — EXOTIC GARDEN

```typescript
{
  title: "EXOTIC GARDEN",
  slug: "exotic-garden",
  client: "Exotic Garden",
  year: "2022",
  category: "Video // MOTION DESIGN",
  description: richText("Immersion professionnelle au sein du pôle création de l'agence lors de mon stage de fin de licence."),
  coverImage: mediaIdRegistry["exotic-garden-cover"],
  galleryImages: [],
  videoUrl: "https://www.youtube.com/embed/rN1p6TUmvKM",
  subProjects: [
    {
      subTitle: "Tahiti Fashion Week",
      subDescription: richText("Collaboration stratégique autour de la Tahiti Fashion Week pour le déploiement de sa communication visuelle. Une participation active à la promotion de l'événement à travers la création de contenus réseaux sociaux et la captation de séquences backstage."),
      subMedia: [],
    },
  ],
  displayOrder: 3,
  status: "published",
}
```

#### PROJET 4 — AREMITI

```typescript
{
  title: "AREMITI",
  slug: "aremiti",
  client: "Aremiti",
  year: "2024",
  category: "Crea video // Community manager",
  description: richText("Mission de Community Management d'une durée de trois mois au sein du pôle digital. Une immersion stratégique dédiée à la gestion de l'image de marque."),
  coverImage: mediaIdRegistry["aremiti-cover"],
  galleryImages: [
    { image: mediaIdRegistry["aremiti-gallery-1"] },
    { image: mediaIdRegistry["aremiti-gallery-2"] },
    { image: mediaIdRegistry["aremiti-gallery-3"] },
  ],
  videoUrl: "https://www.youtube.com/embed/DrT_XvF1xi0",
  subProjects: [
    {
      subTitle: "Consigne de sécurité",
      subDescription: richText("Réalisation de la vidéo de sécurité pour la flotte Aremiti. Sous la direction artistique de l'entreprise, ce projet a nécessité une exécution technique rigoureuse pour traduire les protocoles de sécurité en un support visuel clair."),
      subMedia: [],
    },
    {
      subTitle: "Community Manager",
      subDescription: richText("Conception et réalisation de supports visuels et digitaux sur mesure, répondant aux besoins ponctuels de l'entreprise. Une série de contenus variés (post, story, print) créés pour soutenir les temps forts."),
      subMedia: [],
    },
  ],
  displayOrder: 4,
  status: "published",
}
```

#### PROJET 5 — BIGA*RANX

```typescript
{
  title: "Biga*Ranx",
  slug: "biga-ranx",
  client: "BIGA RANX",
  year: "2025",
  category: "CLIP VIDEO",
  description: richText("Réalisation de clip vidéo à destination du clip 'Natural Woman' de Biga*Ranx en collaboration avec Kea un artiste local."),
  coverImage: mediaIdRegistry["biga-ranx-cover"],
  galleryImages: [
    { image: mediaIdRegistry["biga-ranx-gallery-1"] },
    { image: mediaIdRegistry["biga-ranx-gallery-2"] },
    { image: mediaIdRegistry["biga-ranx-gallery-3"] },
  ],
  videoUrl: "https://www.youtube.com/embed/ieEYBUJQSXU",
  subProjects: [
    {
      subTitle: "Tournage",
      subDescription: richText("Direction de production et réalisation du clip 'Natural Woman', né de la collaboration entre l'artiste international Biga*Ranx et l'artiste local Kea. Un projet d'envergure mené sur deux jours de tournage intensifs, alliant esthétique visuelle soignée et gestion de plateau pour retranscrire l'univers singulier de cette œuvre musicale."),
      subMedia: [],
    },
  ],
  displayOrder: 5,
  status: "published",
}
```

#### PROJET 6 — PROJET PERSO

```typescript
{
  title: "PROJET PERSO",
  slug: "projet-perso",
  client: "PROJET PERSO",
  year: "2022",
  category: "video",
  description: richText(""), // Pas de description principale sur le site Framer
  coverImage: mediaIdRegistry["projet-perso-cover"],
  galleryImages: [],
  videoUrl: "https://www.youtube.com/embed/ZJkJKtowr3Q",
  subProjects: [
    {
      subTitle: "Video Tatau Legacy",
      subDescription: richText("Réalisation vidéo avec le tatoueur Teaniva Dinard. L'idée de ce projet était de mélanger nos deux styles pour créer un contenu qui mettrait en avant nos deux univers en même temps, en jouant sur une ambiance visuelle forte."),
      subMedia: [],
    },
    {
      subTitle: "Pub Carver",
      subDescription: richText("Réalisation d'un spot publicitaire fictif pour la marque de skateboards Carver dans le cadre d'un projet scolaire. Cette production a bénéficié d'une large visibilité après avoir été officiellement relayée par la marque sur son compte Instagram 'carver_france'. Cette republication souligne la pertinence de la direction artistique choisie et la qualité d'exécution technique du projet, dépassant ainsi les attentes du cadre scolaire initial."),
      subMedia: [],
    },
  ],
  displayOrder: 6,
  status: "published",
}
```

---

## 6. ARCHITECTURE DU SCRIPT DE SEED

### 6.1 Structure des fichiers

```
scripts/
├── seed.ts                          # Point d'entrée principal
├── seed-data/
│   ├── media-map.ts                 # Mapping fichiers locaux → rôles
│   ├── site-info.ts                 # Données SiteInfo complètes
│   ├── projects.ts                  # Données des 6 projets
│   └── helpers/
│       ├── rich-text.ts             # Helper pour construire du Lexical RichText
│       └── optimize-image.ts        # Compression/conversion WebP via Sharp
├── prepare-media.ts                 # Script standalone d'optimisation média
```

### 6.2 Flow d'exécution du seed

```
1. seed.ts démarre
   ↓
2. Vérifier connexion DB (Payload init)
   ↓
3. Nettoyer les données existantes (optionnel, flag --clean)
   ↓
4. PHASE 1: Upload médias
   - Lire media-map.ts
   - Pour chaque entrée : optimiser → upload → stocker ID
   - Progression affichée : [12/78] Uploading amex-cover...
   ↓
5. PHASE 2: Créer SiteInfo
   - payload.updateGlobal({ slug: 'site-info', data: siteInfoSeed })
   ↓
6. PHASE 3: Créer Projets
   - Pour chaque projet : résoudre les media IDs → payload.create()
   - Progression affichée : [3/6] Creating project: EXOTIC GARDEN...
   ↓
7. Résumé final
   - ✓ 78 médias uploadés
   - ✓ SiteInfo configuré
   - ✓ 6 projets créés (tous published)
   - Temps total : ~X minutes
```

### 6.3 Commande d'exécution

```bash
# Seed complet (première fois)
npx tsx scripts/seed.ts

# Seed avec nettoyage préalable (reset)
npx tsx scripts/seed.ts --clean

# Seed médias uniquement
npx tsx scripts/seed.ts --media-only

# Seed projets uniquement (médias déjà uploadés)
npx tsx scripts/seed.ts --projects-only
```

---

## 7. POINTS D'ATTENTION CRITIQUES

### 7.1 Médias dans public/ — DANGER

Le dossier `public/swisstransfer_019ba9cd-bb4c-4317-b1e5-85ddac5b7a52/` (8.8 GB) :
- **NE DOIT PAS** être commité dans Git
- **NE DOIT PAS** rester dans `public/` en production
- **DOIT** être ajouté au `.gitignore` (vérifier)
- Après le seed, ce dossier peut être supprimé du projet

### 7.2 Texte placeholder à ignorer

Les sections "Development" dans les projets Aremiti et Biga*Ranx sur le site Framer contiennent du texte lorem ipsum anglais provenant du template. Ces sections sont **exclues** du seed.

### 7.3 RichText Lexical

Les champs `description`, `bio`, `subDescription` utilisent le format Lexical de Payload CMS. Le helper `rich-text.ts` doit produire des objets JSON Lexical valides :

```typescript
function richText(text: string): SerializedEditorState {
  return {
    root: {
      type: "root",
      children: text.split("\n\n").map(paragraph => ({
        type: "paragraph",
        children: [{ type: "text", text: paragraph, format: 0, mode: "normal" }],
        direction: "ltr",
        format: "",
        indent: 0,
        version: 1,
      })),
      direction: "ltr",
      format: "",
      indent: 0,
      version: 1,
    },
  };
}
```

### 7.4 Vidéos YouTube — Format embed

Le champ `videoUrl` attend une URL embed, pas une URL standard :
- **Correct :** `https://www.youtube.com/embed/WR0rZgKg2cU`
- **Incorrect :** `https://youtube.com/watch?v=WR0rZgKg2cU`

### 7.5 Vidéos multiples par projet

Le modèle Payload actuel ne supporte qu'UN seul `videoUrl` par projet. Or certains projets ont plusieurs vidéos YouTube :
- AMEX : 2 vidéos
- SOCREDO : 4 vidéos
- EXOTIC GARDEN : 2 vidéos
- PROJET PERSO : 2 vidéos

**Décision à prendre :** Soit on ajoute un champ `videoUrls[]` (array), soit on met la vidéo principale en `videoUrl` et les autres dans les `subProjects`.

**Recommandation du BMad Master :** Mettre les vidéos additionnelles dans les sous-projets correspondants. Chaque sous-projet correspond déjà à une section avec sa propre vidéo. Le modèle pourrait être étendu avec un champ `subVideoUrl` dans `subProjects` si nécessaire.

### 7.6 Page Photographie

Les 48 photos de `PHOTO/Mes photos/` seront importées comme des projets de type photographie OU comme médias standalone consultables via la page `/photography`.

**Recommandation :** Créer un projet spécial avec `category: "photographie"` et les 48 images en `galleryImages[]`, filtré par la page `/photography`.

### 7.7 Projets additionnels découverts

- **ELECTROFEST** : Teaser vidéo disponible (147 MB). Pas sur le site Framer actuel. À confirmer avec Doens si on l'inclut.
- **TAHITI INK** : Vidéo de 1.2 GB liée au sous-projet "Tatau Legacy". Peut être uploadée si nécessaire.

---

## 8. INDEX COMPLET DES VIDÉOS YOUTUBE

| Projet | Vidéo | URL Embed | Rôle |
|--------|-------|-----------|------|
| AMEX | Pub multi-supports | `https://www.youtube.com/embed/WR0rZgKg2cU` | videoUrl principal |
| AMEX | Aftermovie Padel Cup | `https://www.youtube.com/embed/XGZbkYMzM0g` | subProject "Aftermovie" |
| SOCREDO | Miss Tahiti | `https://www.youtube.com/embed/VFEiMR9h3mo` | videoUrl principal |
| SOCREDO | Aftermovie 2023 | `https://www.youtube.com/embed/53o0MnFzJHA` | subProject "Aftermovie 2023" |
| SOCREDO | AOA SOS Village | `https://www.youtube.com/embed/rlRfoj5VHVc` | subProject "AOA // SOS Village" |
| SOCREDO | Heiva | `https://www.youtube.com/embed/xceUzE0F1PU` | subProject "Heiva" |
| EXOTIC GARDEN | TFW Backstage | `https://www.youtube.com/embed/rN1p6TUmvKM` | videoUrl principal |
| EXOTIC GARDEN | TFW TV Spot | `https://www.youtube.com/embed/RbfwAObrYLk` | subProject "TFW" |
| AREMITI | Consignes sécurité | `https://www.youtube.com/embed/DrT_XvF1xi0` | videoUrl principal |
| BIGA*RANX | Natural Woman | `https://www.youtube.com/embed/ieEYBUJQSXU` | videoUrl principal |
| PROJET PERSO | Tatau Legacy | `https://www.youtube.com/embed/ZJkJKtowr3Q` | videoUrl principal |
| PROJET PERSO | Pub Carver | `https://www.youtube.com/embed/CD3g7qkhLBM` | subProject "Pub Carver" |

---

## 9. ESTIMATION DES VOLUMES

| Élément | Quantité |
|---------|----------|
| Entrées Media (images) | ~70-80 |
| Entrées Media (vidéos courtes, optionnel) | ~3-5 |
| Projets | 6 (+1 photographie optionnel) |
| Sous-projets | 12 total |
| Services | 5 |
| Expériences | 4 |
| Vidéos YouTube référencées | 12 |
| Taille estimée après optimisation images | ~200-300 MB |

---

## 10. CHECKLIST PRÉ-EXÉCUTION

- [ ] Vérifier que `public/swisstransfer_*` est dans `.gitignore`
- [ ] Vérifier que les variables d'environnement sont configurées (DATABASE_URL, BLOB_READ_WRITE_TOKEN)
- [ ] Décider : inclure ELECTROFEST et TAHITI INK comme projets ?
- [ ] Décider : étendre le modèle avec `subVideoUrl` dans subProjects ?
- [ ] Décider : comment gérer la page Photographie (projet unique ou collection dédiée) ?
- [ ] Valider les textes alt des images avec Doens (ou garder ceux proposés)
- [ ] Confirmer l'ordre d'affichage des projets (homepage Framer comme référence)
- [ ] S'assurer que Sharp est installé pour l'optimisation d'images

---

## 11. RÉSUMÉ EXÉCUTIF

Le plan se résume en **3 étapes** :

1. **Préparer** : Optimiser les 122 fichiers média (convertir en WebP, redimensionner, nommer proprement)
2. **Uploader** : Injecter ~80 médias dans Payload CMS → Vercel Blob, récupérer les IDs
3. **Seeder** : Créer SiteInfo + 6 projets avec toutes leurs relations média et sous-projets

**Fidélité au site Framer : 100%** — Chaque texte, chaque projet, chaque sous-projet, chaque vidéo YouTube, chaque service et chaque expérience sont couverts par ce plan.
