# Audit Design — Site Framer cestmoitia

**Source :** https://cestmoitia.framer.website/
**Date d'audit :** 2026-02-28
**Methode :** Aspiration Playwright automatisee (headless Chromium) — contenu rendu JS extrait
**Script :** `scripts/scrape-framer.ts`
**Donnees brutes :** `_bmad-output/framer-scrape/`

---

## 1. Structure du Site (Sitemap)

**11 pages** identifiees :

| URL | Type | Titre extrait |
|-----|------|---------------|
| `/` | Homepage | cestmoitia — Portfolio |
| `/work` | Listing projets | "Selected Works" |
| `/photography` | Galerie photo | "Gallerie PHOTO" |
| `/contact` | Contact | "Ring a bell!" |
| `/work/projet-perso` | Detail projet | PROJET PERSO |
| `/work/socredo` | Detail projet | SOCREDO |
| `/work/exotic-garden` | Detail projet | EXOTIC GARDEN |
| `/work/aremiti` | Detail projet | Aremiti |
| `/work/biga-ranx` | Detail projet | Biga*Ranx |
| `/work/amex` | Detail projet | AMEX |
| `/404` | Erreur | — |

### Impact sur l'architecture

> **+2 pages par rapport a l'architecture prevue :**
> - `/work` — page listing des projets (separee de la homepage)
> - `/photography` — galerie photo dediee

---

## 2. Design System — Tokens

### 2.1 Palette de Couleurs

| Token CSS | Hex | Usage |
|-----------|-----|-------|
| `--token-f2130d30` | `#000000` | Fond principal |
| — | `#0a0a0a` | Fonds alternatifs |
| `--token-3680e070` | `#161616` | Bordures, separateurs |
| `--token-c46abb9d` | `#ffffff` | Texte principal |
| — | `#fff9` (~60%) | Texte navigation attenue |
| — | `#000c` (~75%) | Overlays sombres |
| `--token-781785ff` | `#ff462e` | Accent rouge |
| `--token-85c207e0` | `#14c700` | Accent vert |
| `--token-8e61e3d2` | `#009dff` | Accent bleu / liens |
| — | `#0099ff` | Liens interactifs |

### 2.2 Typographies

**Familles :**

| Famille | Usage | Weights | Source |
|---------|-------|---------|--------|
| **Clash Display** | Titres, navigation, hero, body | 500, 600, 700 | Custom (fichiers .woff2 telecharges dans `assets/fonts/`) |
| **Inter** | Corps texte, liens, formulaire | 400, 700 (+ italic) | Google Fonts → `next/font/google` |

**Echelle typographique (extraite via computed styles) :**

| Element | Font | Desktop | Mobile | Weight | Line-Height | Letter-Spacing | Transform |
|---------|------|---------|--------|--------|-------------|----------------|-----------|
| H1 hero | Clash Display | 140px | 40px | 600 | 110px / 30px | -3.2px / -1.2px | uppercase |
| H2 | Clash Display | 90px | 40px | 600 | 70px / 30px | 0 / -1.8px | uppercase |
| H3 | Clash Display | 90px | 40px | 600 | 70px / 30px | 0 | uppercase |
| H4 | Clash Display | 34px | 34px | 600 | 34px | 0 | uppercase |
| Body large | Clash Display | 48px | 25px | 600 | 38.8px / 19.8px | 0 | — |
| Navigation | Clash Display | 18px | 18px | 500 | 28px | 0 | uppercase |
| Liens | Inter | 16px | 16px | 400 | 1.2em | 0 | — |
| Formulaire | Inter Display | 16px | 16px | 400 | — | 0 | — |

### 2.3 Breakpoints

| Nom | Largeur | Conteneur max |
|-----|---------|---------------|
| Desktop | >= 1440px | 1440px |
| Tablet | 810px — 1439px | (intermediaire 1200px aussi utilise) |
| Mobile | <= 809px | 390px |

### 2.4 Espacements

| Element | Desktop | Mobile |
|---------|---------|--------|
| Padding sections | 100px 30px | 40px 20px |
| Padding header | 0 30px | 0 20px |
| Gap grille projets | 20px | 24px |
| Gap hero interne | 60px | — |
| Padding footer | 120px 30px 100px | 60px 20px 40px |

### 2.5 Rayons / Ombres

| Element | Border-Radius |
|---------|---------------|
| Cards projets | 10px |
| Conteneurs principaux | 20px |

---

## 3. Contenu Textuel Complet (extrait par Playwright)

### 3.1 Navigation (Header)

| Position | Element | Texte |
|----------|---------|-------|
| Gauche | Horloge locale | `LOCAL/` + heure temps reel (ex: `14:29:07`) |
| Centre | Logo/nom | `cestmoitia` |
| Droite | CTA | `CONTACTEZ-MOI` → `/contact` |

**Note :** Pas de navigation multi-liens classique. Un seul lien CTA dans le header.

### 3.2 Hero (Homepage)

```
MON
Portfolio

cestmoitia

BASED IN Puna'auia,
Tahiti

Available ALL AROUNd
worldwidE

filmaker / graphiste
+ motion designer
```

### 3.3 Section Portfolio (Homepage) — 6 Projets

| # | Titre | Categorie | Lien |
|---|-------|-----------|------|
| 1 | AMEX | Publicite // aftermovie | `/work/amex` |
| 2 | SOCREDO | Publicite // aftermovie | `/work/socredo` |
| 3 | EXOTIC GARDEN | Aftermovie | `/work/exotic-garden` |
| 4 | AREMITI | CREA VIDEO // COMMUNITY MANAGER | `/work/aremiti` |
| 5 | BIGA RANX | CAPTATION VIDEO | `/work/biga-ranx` |
| 6 | PROJET PERSO | video | `/work/projet-perso` |

**Section titre :** `01 //Portfolio` + `2013 - 2025`

### 3.4 Section About (Homepage)

**Section titre :** `02 //a propos de moi` + `Since 2000`

**Bio principale :**
> Moi, c'est Tia, un jeune creatif passionne par l'audiovisuel, avec plus de 7 ans d'experience professionnelle en entreprise et en freelance.

**Body text :**
> Je cree, j'imagine et je construis dans le monde digital, la ou tout devient possible.

> Curieux et motive, je continue chaque jour a apprendre a travers de nouvelles experiences et de nouveaux projets. Parfois un peu desordonne, mais toujours anime par la creativite et l'efficacite.

**Slogan grande typographie :**
```
JEUNE
Creatif
AMOUREUX
DE
L'AUDIOVISUEL:
VOTRE
IDEE,
MA
VISION.
```

**Lien :** `Mon CV` → Google Drive PDF

### 3.5 Section Services (Homepage)

**Section titre :** `03 //Services` + `Fast Delivery`

| Service | Description 1 | Description 2 |
|---------|--------------|--------------|
| Captation Video | Maitrise de mon materiel, expertise du terrain | Documentaire, clip video, Publicite ... etc |
| Photographie | Mariage, portrait, real estate, evenement... etc | — |
| Montage Video | — | — |
| Graphisme | Creation visuels tout support | — |
| Motion design | maitrise d'after effect | — |

**Body :** J'allie creativite et technique pour donner vie vos projets !

### 3.6 Section Experience (Homepage)

**Section titre :** `05 //Experience`

| Entreprise | Poste | Annee | Description |
|-----------|-------|-------|-------------|
| EXOTIC GARDEN | cadreur // monteur // motion designer | 2022 | Stage d'un mois chez Exotic Garden : creation de contenu audiovisuel en quasi-autonomie. |
| Jiku production | cadreur // monteur // motion designer // graphiste | 2020 - 2024 | Deux stages durant ma licence, puis integration en 2023 en tant que CVD. |
| Aremiti | community manager // graphiste | 2024 | Mission de 3 mois en tant que community manager |
| Freelance | photographe // cadreur // monteur // motion designer // graphiste | 2018 - 2026 | Depuis le lycee, j'evolue dans le milieu professionnel de l'audiovisuel. C'est un metier passion. |

### 3.7 Footer (Commun a toutes les pages)

```
Un projet ?
CONTACTEZ-MOI → /contact

BASED PUNA'AUIA,
TAHITI

Filmaker / graphiste
+ Motion designer

Installe a Puna'auia, Tahiti, je suis un artiste digital. Mon but est de mettre ma passion
pour l'image au service de projets qui ont du sens.

Instagram → https://www.instagram.com/cestmoitia/
FACEBOOK → https://www.facebook.com/Cestmoitia/

cestmoitia

©2026 → https://x.com/MandroDesign
Retour en haut → #nav
```

### 3.8 Page `/work` — Listing Projets

**Titre :** `Selected Works` + `(2020 - 2025)`

| Projet | Categorie |
|--------|-----------|
| PROJET PERSO | video |
| SOCREDO | SOCREDO X MISS TAHITI |
| EXOTIC GARDEN | Video // MOTION DESIGN |
| AREMITI | Crea video // Community manager |
| Biga*Ranx | CLIP VIDEO |

**Note :** La page /work n'affiche pas AMEX — 5 projets (pas 6)

### 3.9 Page `/photography`

**Titre :** `Gallerie PHOTO` + sous-titre `Photographie`
**Contenu :** Galerie d'images (pas de texte supplementaire)
**Structure :** Screenshots disponibles dans `framer-scrape/pages/photography/`

### 3.10 Page `/contact`

**Titre :** `Ring a bell!`
**Sous-titre :** `Contactez-moi et creons ensemble quelque chose d'extraordinaire.`
**Instruction :** `Remplissez CE formulaire`

**Informations de contact :**

| Label | Valeur |
|-------|--------|
| FOLLOW ME | Instagram, facebook |
| CURRENT LOCATION | Puna'auia, 98717 / Tahiti / PF |
| Phone | +689 87 76 98 19 |
| EMAIL me | cestmoitia@gmail.com |

**Bouton formulaire :** `Soumettre`

**Liens sociaux :**
- Instagram → https://www.instagram.com/
- Facebook → https://www.facebook.com/Cestmoitia/

---

## 4. Pages Detail Projet

### 4.1 AMEX (`/work/amex`)

| Champ | Valeur |
|-------|--------|
| Year | 2024 |
| Client | OFINA |
| Category | Publicite // aftermovie |

**Description :** J'ai participe a de multiples collaborations, notamment dans le cadre de campagnes publicitaires

**Sous-projets :**

| Titre | Description |
|-------|-------------|
| (Pub) | Collaboration strategique avec Ofina / Amex pour le deploiement de campagnes publicitaires multi-supports. L'objectif : valoriser les avantages exclusifs de la marque aupres des commercants partenaires et de leur clientele. Contenu decline sur TV, radio, reseaux sociaux, panneaux 4/3 et ecrans LED. |
| AFTERMOvie | Immersion au coeur de l'Amex Padel Cup 2024 avec la realisation de cet aftermovie officiel. Montage rythme et dynamique. |

**Navigation :** `More Works` | Projets suggeres : PROJET PERSO, SOCREDO

### 4.2 SOCREDO (`/work/socredo`)

| Champ | Valeur |
|-------|--------|
| Year | 2023 - 2025 |
| Client | SOCREDO |
| Category | SOCREDO X MISS TAHITI |

**Description :** Collaboration continue avec les services marketing et communication de la Banque Socredo pour la production de campagnes publicitaires et de contenus video.

**Sous-projets :**

| Titre | Description |
|-------|-------------|
| SOCREDO // MISS TAHITI | Campagne publicitaire en collaboration avec le comite Miss Tahiti. Valorisation du patrimoine culturel et promotion de l'election. |
| AFTERMOVIE SOCREDO 2023 | Captation de la soiree annuelle. Revelation de la nouvelle identite visuelle et du nouveau logo. |
| SOCREDO // AOA // SOS VILLAGE | Aftermovie initiative solidaire avec AOA et SOS Village d'Enfants. Journee de partage au parc AOA. |
| Socredo // heiva | Conception d'affiches et motion design pour la promotion de la culture et langue polynesienne durant le Heiva i Tahiti. |

### 4.3 EXOTIC GARDEN (`/work/exotic-garden`)

| Champ | Valeur |
|-------|--------|
| Year | 2022 |
| Client | Exotic Garden |
| Category | Video // MOTION DESIGN |

**Description :** Immersion professionnelle au sein du pole creation de l'agence lors de mon stage de fin de licence.

**Sous-projets :**

| Titre | Description |
|-------|-------------|
| TAHITI FASHION WEEK | Collaboration strategique autour de la Tahiti Fashion Week. Creation de contenus reseaux sociaux et captation backstage. |

### 4.4 AREMITI (`/work/aremiti`)

| Champ | Valeur |
|-------|--------|
| Year | 2024 |
| Client | Aremiti |
| Category | Crea video // Community manager |

**Description :** Mission de Community Management de trois mois au sein du pole digital. Gestion de l'image de marque.

**Sous-projets :**

| Titre | Description |
|-------|-------------|
| CONSIGNE DE SECURITE | Realisation de la video de securite pour la flotte Aremiti. Execution technique rigoureuse pour traduire les protocoles en support visuel clair. |
| Community manager | Conception et realisation de supports visuels et digitaux sur mesure. Serie de contenus varies (post, story, print) pour les temps forts. |

### 4.5 BIGA*RANX (`/work/biga-ranx`)

| Champ | Valeur |
|-------|--------|
| Year | 2025 |
| Client | BIGA RANX |
| Category | CLIP VIDEO |

**Description :** Realisation de clip video a destination du clip "Natural Woman" de Biga*Ranx en collaboration avec Kea un artiste local.

**Sous-projets :**

| Titre | Description |
|-------|-------------|
| tournage | Direction de production et realisation du clip "Natural Woman". Collaboration Biga*Ranx x Kea. Deux jours de tournage intensifs, esthetique soignee et gestion de plateau. |

### 4.6 PROJET PERSO (`/work/projet-perso`)

| Champ | Valeur |
|-------|--------|
| Year | 2022 |
| Client | PROJET PERSO |
| Category | video |

**Sous-projets :**

| Titre | Description |
|-------|-------------|
| VIDEO tatau legacy | Realisation video avec le tatoueur Teaniva Dinard. Melange de styles pour un contenu mettant en avant deux univers, ambiance visuelle forte. |
| PUB CARVER | Spot publicitaire fictif pour la marque Carver (projet scolaire). Officiellement relaye par carver_france sur Instagram. |

---

## 5. Animations & Interactions

### 5.1 Hover States (detectes par Playwright)

| Element | Propriete | Avant | Apres |
|---------|-----------|-------|-------|
| `a "CONTACTEZ-MOI"` | color | `rgb(255,255,255)` | `rgb(0,0,0)` |
| `a "CONTACTEZ-MOI"` | border-color | `rgb(255,255,255)` | `rgb(0,0,0)` |

**Note :** Le bouton CTA inverse ses couleurs au hover (blanc → noir).

### 5.2 Animation Hints (will-change / transform)

Les elements suivants ont des proprietes d'animation detectees (voir fichiers `animations.json` par page) :
- **Header** : `will-change: transform` (sticky behavior)
- **Hero** : `will-change: filter, transform` (entree avec blur/fade)
- **Cards projets** : `will-change: transform` (hover scale probable)
- **Sections sticky** : `position: sticky; top: 0` (parallax scroll)
- **Mix-blend-mode** : `difference` sur certains textes

### 5.3 Scroll Behavior

- Sections avec `position: sticky` pour effet parallax
- Animations au scroll (stagger reveal) sur les cards
- Defilement horizontal detecte sur les pages projet detail (carousel)

### 5.4 Transitions CSS

Les transitions globales `all` sont appliquees sur la majorite des elements (heritage Framer).
Les transitions specifiques a cibler pour la reproduction :
- Hover CTA : inversion couleurs (color + border-color + background)
- Cards : scale/translate au hover
- Sections : opacity/transform a l'entree dans le viewport

---

## 6. Assets Telecharges

### 6.1 Fonts — 67 fichiers .woff2

Telecharges dans `_bmad-output/framer-scrape/assets/fonts/`

Familles identifiees dans les declarations `@font-face` :
- **Clash Display** : weights 500, 600, 700
- **Inter** : weights 400, 700, italic variants
- Multiples subsets Unicode pour support multilingue

> Les fichiers Clash Display sont disponibles pour utilisation avec `next/font/local`.

### 6.2 Images — 67 fichiers

Telecharges dans `_bmad-output/framer-scrape/assets/images/`
Formats : JPEG, PNG, SVG, WebP

### 6.3 Screenshots — 30 captures (10 pages x 3 viewports)

Disponibles dans `_bmad-output/framer-scrape/pages/<slug>/screenshot-{desktop,tablet,mobile}.png`

---

## 7. Structure des Pages Projet (Layout Type)

Chaque page detail projet suit le meme pattern :

```
[Header]                          ← fixe, commun
[Metadata]                        ← Year | Client | Category
  ├── Year: XXXX
  ├── Client: NOM
  └── Category: TYPE
[Titre + Description]             ← H1 + paragraphe introductif
[Sous-projets]                    ← 1 a 4 blocs, chacun :
  ├── Titre du sous-projet
  ├── Description detaillee
  └── Medias (images/videos)
[More Works]                      ← 2 projets suggeres (cards)
[Footer]                          ← commun a toutes les pages
```

**Navigation inter-projets :** `More Works` affiche 2 projets suggeres (toujours PROJET PERSO et SOCREDO sur les pages analysees).

---

## 8. Ecarts avec l'Architecture Prevue

| Element | Prevu | Reel | Impact |
|---------|-------|------|--------|
| Pages | 3 types | **5 types** (+Work listing, +Photography) | +2 slices FSD pages/ |
| Route projets | `/projects/[slug]` | **`/work/[slug]`** | Routing Next.js ajuste |
| Navigation | Multi-liens | **Un seul CTA** ("CONTACTEZ-MOI") + horloge locale | Header simplifie |
| Section About | Non planifiee en detail | **Section complete** avec bio, slogan, lien CV | Widget about a creer |
| Section Services | Non planifiee | **Section complete** avec 5 services | Widget services a creer |
| Section Experience | Non planifiee | **Section complete** avec 4 experiences | Widget experience a creer |
| Sous-projets | Medias simples | **Blocs structures** (titre + description + media) | Impact sur entity Project |
| "More Works" | Non planifie | **Navigation inter-projets** a la fin de chaque detail | Widget ou feature a creer |
| Horloge locale | Non planifiee | **Affichage heure locale** dans le header | Composant client temps reel |
| Page Photography | Non planifiee | **Galerie photo dediee** | Nouvelle page + potentielle entity |

---

## 9. Donnees pour le Seed (T13)

### Projets

| Slug | Titre | Client | Year | Category | Sous-projets |
|------|-------|--------|------|----------|-------------|
| amex | AMEX | OFINA | 2024 | Publicite // aftermovie | 2 (pub + aftermovie) |
| socredo | SOCREDO | SOCREDO | 2023-2025 | SOCREDO X MISS TAHITI | 4 (Miss Tahiti, Aftermovie 2023, AOA/SOS, Heiva) |
| exotic-garden | EXOTIC GARDEN | Exotic Garden | 2022 | Video // MOTION DESIGN | 1 (Tahiti Fashion Week) |
| aremiti | Aremiti | Aremiti | 2024 | Crea video // Community manager | 2 (Consigne securite, CM) |
| biga-ranx | Biga*Ranx | BIGA RANX | 2025 | CLIP VIDEO | 1 (Natural Woman) |
| projet-perso | PROJET PERSO | PROJET PERSO | 2022 | video | 2 (Tatau Legacy, Pub Carver) |

### Site Info (Global)

| Champ | Valeur |
|-------|--------|
| Nom | cestmoitia / Tia |
| Metier | Filmaker / graphiste + Motion designer |
| Localisation | Puna'auia, 98717, Tahiti, PF |
| Bio | Installe a Puna'auia, Tahiti, je suis un artiste digital. Mon but est de mettre ma passion pour l'image au service de projets qui ont du sens. |
| Email | cestmoitia@gmail.com |
| Telephone | +689 87 76 98 19 |
| Instagram | https://www.instagram.com/cestmoitia/ |
| Facebook | https://www.facebook.com/Cestmoitia/ |
| CV | https://drive.google.com/file/d/1_nKIV5dD5uJhUEDIJAKOSDmm6Ynio-BM/view |
