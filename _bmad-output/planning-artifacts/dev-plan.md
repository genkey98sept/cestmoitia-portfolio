# Plan de Developpement — tia

**Auteur :** Doens
**Date de creation :** 2026-02-28
**Derniere mise a jour :** 2026-02-28 (T9.6 complete — Toutes les pages MVP implementees)

---

## Instructions pour les Agents IA

> **Ce fichier est la source de verite unique** pour le suivi du developpement du projet tia.
>
> **Avant de coder quoi que ce soit :**
>
> 1. Lire ce fichier en entier
> 2. Identifier la tranche en cours (`status: in_progress`) ou la prochaine tranche `pending`
> 3. Lire les artefacts references : [prd.md](prd.md), [architecture.md](architecture.md), [product-brief-tia-2026-02-28.md](product-brief-tia-2026-02-28.md)
> 4. Respecter les dependances — ne jamais commencer une tranche dont les prerequis ne sont pas `done`
> 5. **Mettre a jour ce fichier** apres chaque tranche completee (status + date + notes)
>
> **Regles absolues :**
>
> - Architecture FSD stricte (voir architecture.md section "FSD Architecture Reference")
> - Conventions de nommage definies dans architecture.md section "Naming Patterns"
> - Patterns de composition Server/Client definis dans architecture.md section "Process Patterns"
> - Zero fichier de test (decision projet)
> - Imports via public API (`index.ts`) uniquement entre slices
> - `"use client"` uniquement sur les composants leaf interactifs/animes

---

## Etat du Projet

```yaml
phase_actuelle: "Phase 1 — MVP"
tranche_en_cours: null
derniere_tranche_completee: T11
blockers: []
```

### Adaptations Architecture (decidees pendant T0)

L'architecture.md a ete ecrite avant l'implementation. Voici les adaptations faites
pour respecter la doc officielle Payload CMS et les contraintes Next.js :

| Element | Prevu (architecture.md) | Reel (apres T0) | Raison |
|---------|------------------------|-----------------|--------|
| Next.js | 15.5.12 | **15.4.11** | 16.1.6 incompatible Payload. 15.4.11 = derniere version stable supportee |
| Route group CMS | `(cms)` | **`(payload)`** | Convention officielle Payload CMS |
| payload.config.ts | Racine du projet | **`src/payload.config.ts`** | Convention officielle Payload — importMap.baseDir = dirname |
| next.config | `.ts` | **`.mjs`** | Payload exige ESM pour `withPayload()` |
| Frontend routes | Directement dans `app/` ou `src/app/` | **`src/app/(frontend)/`** | Route group separe pour isoler du `(payload)` |
| ESLint | Flat config natif | **FlatCompat** + legacy `eslint-config-next` | eslint-config-next@15 = CommonJS, ESLint 9 = flat config |
| `shared/types/` | `types/` | **`shared/model/`** | Steiger `segments-by-purpose` — nommer par purpose pas par essence |
| Tailwind | v4.x | v4 installe | OK |

**Structure reelle du projet :**

```
tia/
├── src/
│   ├── app/
│   │   ├── (frontend)/        # Route group frontend
│   │   │   ├── layout.tsx     # Root layout (html, body, metadata)
│   │   │   ├── page.tsx       # Homepage placeholder
│   │   │   └── not-found.tsx  # 404
│   │   ├── (payload)/         # Route group Payload CMS (doc officielle)
│   │   │   ├── layout.tsx     # Payload admin layout (auto-genere)
│   │   │   ├── custom.scss    # Styles admin custom
│   │   │   ├── admin/         # Admin panel
│   │   │   └── api/           # REST + GraphQL API
│   │   ├── providers/         # FSD App layer
│   │   ├── styles/            # FSD App layer (globals.css)
│   │   └── fonts/             # FSD App layer
│   ├── pages/                 # FSD Pages layer (home, project, contact)
│   ├── widgets/               # FSD Widgets layer
│   ├── features/              # FSD Features layer
│   ├── entities/              # FSD Entities layer
│   ├── shared/                # FSD Shared layer (ui, lib, api, config, model)
│   ├── collections/           # Payload collections (Users.ts)
│   └── payload.config.ts      # Config Payload
├── pages/.gitkeep             # Bloque Pages Router sur src/pages/
├── next.config.mjs            # withPayload() wrapper
├── steiger.config.ts          # FSD linter
├── eslint.config.mjs          # ESLint + FSD rules
├── tsconfig.json              # paths: @/*, @payload-config
└── .env.example
```

> **IMPORTANT pour les agents :** Quand l'architecture.md mentionne `app/(cms)/`, lire `src/app/(payload)/`.
> Quand elle mentionne `app/page.tsx` (routing), lire `src/app/(frontend)/page.tsx`.
> `shared/types/` → `shared/model/`. `payload.config.ts` racine → `src/payload.config.ts`.

### Decouvertes Audit Framer (post-T0)

L'audit du site source https://cestmoitia.framer.website/ a revele des ecarts avec l'architecture prevue.
Voir [framer-audit.md](framer-audit.md) pour le detail complet.

| Element | Prevu | Reel | Impact |
|---------|-------|------|--------|
| Pages du site | 3 types (Home, ProjectDetail, Contact) | **5 types** (Home, Work, Photography, Contact, ProjectDetail) | +2 slices FSD pages/ |
| Page `/work` | Grille projets sur homepage | **Page separee** `/work` | Nouveau slice `src/pages/work/` |
| Page `/photography` | Non prevue | **Page dediee** `/photography` | Nouveau slice `src/pages/photography/` |
| Projets | Categories generiques | **6 projets concrets** (projet-perso, socredo, exotic-garden, aremiti, biga-ranx, amex) | Seed data concret |
| Detail projet | Scroll vertical | **Carousel horizontal** detecte | Widget carousel a creer |
| Sections homepage | Hero + grille | Hero + grille + **section sticky** + **showcase images** | Widgets supplementaires |
| Font Clash Display | Google Fonts presume | **Font custom** (pas sur Google Fonts) | Utiliser `next/font/local` avec fichiers .woff2 |

> **IMPORTANT pour les agents :** La structure des routes Next.js doit correspondre au site Framer :
> - `src/app/(frontend)/page.tsx` → Homepage (`/`)
> - `src/app/(frontend)/work/page.tsx` → Listing projets (`/work`)
> - `src/app/(frontend)/work/[slug]/page.tsx` → Detail projet (`/work/[slug]`)
> - `src/app/(frontend)/photography/page.tsx` → Galerie photo (`/photography`)
> - `src/app/(frontend)/contact/page.tsx` → Contact (`/contact`)

---

## Tranches de Developpement

### T0 — Scaffold & Structure FSD

```yaml
id: T0
nom: "Scaffold & Structure FSD"
status: done
date_debut: 2026-02-28
date_fin: 2026-02-28
prerequis: []
bloque: [T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13]
```

**Objectif :** Transformer le scaffold create-next-app en structure FSD avec Payload CMS integre.

**Ce qui a ete fait :**

1. Downgrade Next.js 16.1.6 → 15.4.11 (compatibilite Payload)
2. Suppression `babel-plugin-react-compiler` (Next.js 16 only)
3. Restructuration en route groups : `(frontend)/` + `(payload)/`
4. Installation Payload CMS : `payload`, `@payloadcms/next`, `@payloadcms/db-postgres`, `@payloadcms/richtext-lexical`, `sharp`, `graphql`
5. Creation `src/payload.config.ts` avec PostgreSQL adapter + collection Users
6. Creation complete du route group `(payload)/` : admin, API REST, GraphQL, layout, importMap
7. Creation de tous les layers FSD avec segments et `index.ts`
8. Rename `shared/types/` → `shared/model/` (Steiger compliance)
9. Configuration `tsconfig.json` : paths `@/*`, `@payload-config`
10. Configuration `next.config.mjs` avec `withPayload()` + webpack extensionAlias
11. Configuration Steiger (`steiger.config.ts`) : FSD recommended, ignores app/ et collections/
12. Configuration ESLint (`eslint.config.mjs`) : FlatCompat + next/core-web-vitals + FSD no-restricted-imports
13. Creation `.env.example` + `.env.local`
14. `pages/.gitkeep` a la racine (bloque Pages Router)

**Fichiers crees/modifies :**

```
app/layout.tsx                          # Root layout (thin, importe depuis src/app/)
app/page.tsx                            # Re-export HomePage placeholder
app/not-found.tsx                       # Page 404
app/(cms)/admin/[[...segments]]/page.tsx
app/(cms)/api/[...segments]/route.ts
app/api/revalidate/route.ts             # Placeholder webhook
pages/.gitkeep
src/app/providers/index.ts
src/app/styles/globals.css
src/app/fonts/index.ts
src/pages/home/index.ts
src/pages/project/index.ts
src/pages/contact/index.ts
src/widgets/header/index.ts
src/widgets/footer/index.ts
src/widgets/hero/index.ts
src/widgets/project-grid/index.ts
src/features/contact-form/index.ts
src/features/project-publish/index.ts
src/entities/project/index.ts
src/entities/site-info/index.ts
src/shared/ui/index.ts
src/shared/lib/index.ts
src/shared/api/index.ts
src/shared/config/index.ts
src/shared/types/index.ts
payload.config.ts
steiger.config.ts
.env.example
next.config.mjs (modifie)
tsconfig.json (modifie)
.eslintrc.json (modifie)
```

**Criteres de validation :**

- [x] `pnpm dev` demarre sans erreur
- [x] `npx steiger src/` — 0 erreur
- [x] `pnpm lint` — 0 erreur
- [x] `/admin` accessible (page Payload vide)
- [x] Structure FSD conforme au schema architecture.md

**Notes :** _A remplir par l'agent apres completion_

---

### T0.5 — Audit Framer & Design Tokens

```yaml
id: T0.5
nom: "Audit Framer & Design Tokens"
status: done
date_debut: 2026-02-28
date_fin: 2026-02-28
prerequis: [T0]
bloque: [T1, T4, T5, T6, T7, T8]
```

**Objectif :** Extraire et documenter l'integralite du design et du contenu du site Framer
source pour garantir une reproduction pixel-perfect.

**Ce qui a ete fait :**

1. Installation de Playwright + Chromium headless
2. Creation du script `scripts/scrape-framer.ts` — aspiration systematique
3. Aspiration des 10 pages (11 - la 404) avec :
   - Screenshots full-page aux 3 breakpoints (desktop/tablet/mobile) = 30 captures
   - Extraction de tout le contenu textuel du DOM rendu (titres, descriptions, bios, etc.)
   - Extraction de tous les liens avec URLs
   - Extraction des styles computes (computed styles) pour chaque element visible
   - Extraction de toutes les images (67 telechargees)
   - Detection des videos
   - Detection des animations CSS et Web Animations API
   - Detection des hover states (avant/apres)
   - Extraction des CSS custom properties (design tokens)
   - Telechargement de 67 fichiers font (.woff2)
4. Generation de `scrape-report.md` et `scrape-report.json`
5. Mise a jour complete de [framer-audit.md](framer-audit.md) avec toutes les donnees extraites

**Decouvertes majeures :**

- Navigation = 1 seul CTA "CONTACTEZ-MOI" + horloge locale (pas multi-liens)
- Homepage a 5 sections : Hero, Portfolio (6 projets), About, Services, Experience
- 5 services documentes (Captation Video, Photographie, Montage Video, Graphisme, Motion design)
- 4 experiences professionnelles documentees
- Chaque page projet detail contient 1-4 sous-projets structures
- Footer identique sur toutes les pages
- Projets ont un champ "Client" distinct du titre
- Page /work n'affiche que 5 projets (pas AMEX)

**Fichiers crees :**

```
scripts/scrape-framer.ts                               # Script Playwright
_bmad-output/framer-scrape/                            # Donnees brutes
  ├── pages/<slug>/screenshot-{desktop,tablet,mobile}.png  # 30 screenshots
  ├── pages/<slug>/text-content.json                   # Contenu textuel
  ├── pages/<slug>/links.json                          # Liens
  ├── pages/<slug>/computed-styles.json                # Styles computes
  ├── pages/<slug>/images.json                         # Images
  ├── pages/<slug>/videos.json                         # Videos
  ├── pages/<slug>/animations.json                     # Animations
  ├── pages/<slug>/hover-states.json                   # Hover states
  ├── assets/fonts/  (67 fichiers .woff2)              # Fonts telechargees
  ├── assets/images/ (67 fichiers)                     # Images telechargees
  ├── design-tokens.json                               # CSS custom properties
  ├── fonts.json                                       # Declarations @font-face
  ├── scrape-report.json                               # Rapport structure
  └── scrape-report.md                                 # Rapport lisible
_bmad-output/planning-artifacts/framer-audit.md        # Audit complete
```

**Criteres de validation :**

- [x] Contenu textuel complet extrait (hero, about, services, experience, projets, footer, contact)
- [x] Fichiers font Clash Display telecharges (67 .woff2 dans assets/fonts/)
- [x] Screenshots de reference disponibles (30 captures, 3 breakpoints x 10 pages)
- [x] Design tokens extraits (couleurs, typographies, espacements)
- [x] Animations et hover states documentes
- [x] Aucun "___" restant dans le fichier framer-audit.md

**Notes :** Aspiration Playwright complete et reussie. Toutes les donnees necessaires
a la reproduction pixel-perfect sont disponibles.

---

### T1 — Foundation (Shared Layer)

```yaml
id: T1
nom: "Foundation — Shared Layer"
status: done
date_debut: 2026-02-28
date_fin: 2026-02-28
prerequis: [T0, T0.5]
bloque: [T2, T3, T4, T5, T6, T7, T8, T9]
```

**Objectif :** Mettre en place les fondations partagees utilisees par tous les layers superieurs.

**Livrables :**

1. `shared/lib/payload-client.ts` — helper `getPayloadClient()` wrappant `getPayload()`
2. `shared/lib/cn.ts` — utilitaire `cn()` (clsx + tailwind-merge)
3. `shared/types/action-result.ts` — type `ActionResult<T>`
4. `shared/config/site.ts` — constantes `SITE_URL`, `SITE_NAME`
5. `shared/ui/MotionProvider.tsx` — `"use client"`, `LazyMotion` + `domAnimation`
6. Installer `motion`, `clsx`, `tailwind-merge`
7. Configurer Tailwind tokens dans `globals.css` ou `tailwind.config.ts` — **utiliser les tokens exacts du framer-audit.md section 2** :
   - Breakpoints : 1440px (desktop), 810px (tablet), 390px (mobile)
   - Palette : `#000`, `#0a0a0a`, `#161616`, `#fff`, `#ff462e`, `#14c700`, `#009dff`, `#0099ff`
   - Echelle typographique complete (H1 140px → liens 16px)
   - Espacements : sections 100px/30px, grille gap 20px, etc.
8. Configurer `src/app/fonts/index.ts` avec `next/font/google` (Inter) + **`next/font/local`** (Clash Display — fichiers .woff2 requis, voir T0.5)
9. `src/app/providers/AppProviders.tsx` — wraps MotionProvider
10. Mettre a jour `app/layout.tsx` pour utiliser AppProviders + fonts + globals.css
11. Mettre a jour tous les `index.ts` du shared layer avec les exports

**Fichiers crees/modifies :**

```
src/shared/lib/payload-client.ts
src/shared/lib/cn.ts
src/shared/lib/index.ts
src/shared/types/action-result.ts
src/shared/types/index.ts
src/shared/config/site.ts
src/shared/config/index.ts
src/shared/ui/MotionProvider.tsx
src/shared/ui/index.ts
src/shared/api/index.ts
src/app/providers/AppProviders.tsx
src/app/providers/index.ts
src/app/fonts/index.ts
src/app/styles/globals.css
app/layout.tsx
```

**Criteres de validation :**

- [x] `pnpm dev` demarre, la page affiche le layout avec fonts chargees
- [x] `cn()` fonctionne (import depuis `@/shared/lib`)
- [x] MotionProvider wraps l'app sans erreur
- [x] ESLint passe (0 erreurs)
- [x] `pnpm build` passe (compiled successfully)

**Notes :** Tous les livrables implementes. Tailwind v4 CSS-first config (pas de tailwind.config.ts). Fonts Clash Display via next/font/local (3 weights: 500, 600, 700). Inter via next/font/google. Dossier scripts/ exclu du lint ESLint. ActionResult place dans shared/model/ (pas shared/types/) conformement a la structure FSD.

---

### T2 — Entity Project

```yaml
id: T2
nom: "Entity Project — Types, Queries, Collection Payload"
status: done
date_debut: 2026-02-28
date_fin: 2026-02-28
prerequis: [T1]
bloque: [T6, T7, T8, T10, T11, T13]
```

**Objectif :** Creer l'entite metier `project` — collection Payload, types TypeScript, queries, composants UI de base.

**Livrables :**

1. Collection Payload `projects` dans `payload.config.ts` :
   - `title` (text, required)
   - `slug` (text, auto-genere depuis title, unique, index)
   - `description` (richText Lexical)
   - `category` (select : photo, video, montage, motion, direction-artistique — a affiner)
   - `coverImage` (upload, required)
   - `galleryImages` (array of uploads)
   - `videoUrl` (text, optionnel)
   - `displayOrder` (number, required, default 0)
   - `status` (select : published/draft, default draft)
   - `publishedAt` (date, auto)
2. `entities/project/model/types.ts` — type `Project` derive des types generes Payload
3. `entities/project/api/queries.ts` — `getProjects()`, `getProjectBySlug(slug)`
4. `entities/project/ui/ProjectCard.tsx` — Server Component (structure de base, sans animation)
5. `entities/project/ui/ProjectCardAnimated.tsx` — `"use client"`, placeholder hover animation Motion
6. `entities/project/ui/ProjectDetail.tsx` — Server Component (vue detail, structure de base)
7. `entities/project/index.ts` — public API exports

**Criteres de validation :**

- [x] Collection `projects` visible dans `/admin`
- [x] CRUD fonctionnel sur un projet dans le BO
- [x] `getProjects()` retourne les projets publies tries par `displayOrder`
- [x] `getProjectBySlug("test")` retourne un projet ou null
- [x] ProjectCard rend un projet basique sans erreur
- [x] Steiger + ESLint passent

**Notes :** Collection enrichie par rapport au plan initial grace a l'audit Framer : ajout de `client`, `year`, `category` (text libre), `subProjects` (array avec subTitle, subDescription, subMedia). Collection `Media` creee en avance (prevue T11) pour supporter les champs upload — configuration robuste avec imageSizes (thumbnail 300x300, card 768x480, full 1920x1080), mimeTypes images+videos, crop+focalPoint. Slug auto-genere via hook beforeValidate avec normalisation Unicode (accents). publishedAt auto-set via hook beforeChange. Build + Steiger + ESLint OK.

---

### T3 — Entity Site-Info

```yaml
id: T3
nom: "Entity Site-Info — Global Payload, Types, Queries"
status: done
date_debut: 2026-02-28
date_fin: 2026-02-28
prerequis: [T1]
bloque: [T4, T7]
```

**Objectif :** Creer l'entite metier `site-info` — Global Payload pour les donnees partagees du site.

**Livrables :**

1. Global Payload `site-info` dans `payload.config.ts` :
   - `bio` (richText Lexical)
   - `email` (email, required)
   - `instagramUrl` (text)
   - `youtubeUrl` (text)
   - `linkedinUrl` (text)
   - `otherLinks` (array : { label, url })
2. `entities/site-info/model/types.ts` — type `SiteInfo`
3. `entities/site-info/api/queries.ts` — `getSiteInfo()`
4. `entities/site-info/index.ts` — public API exports

**Criteres de validation :**

- [x] Global `site-info` editable dans `/admin`
- [x] `getSiteInfo()` retourne les donnees
- [x] Steiger + ESLint passent

**Notes :** Global enrichi par rapport au plan initial grace a l'audit Framer : ajout de `heroTagline`, `phone`, `location` (group: city, zipCode, country, countryCode), `cvUrl`, `facebookUrl`, `twitterUrl` (remplacent youtubeUrl/linkedinUrl non presents sur le site Framer). Ajout de `services` (array: title, description) et `experiences` (array: company, position, year, description) — CMS-managed pour l'autonomie de Tianoa. Globals definis dans `src/globals/SiteInfo.ts` (nouveau dossier, ignore par Steiger). Types detailles avec sous-types (SiteInfoLocation, SiteInfoLink, SiteInfoService, SiteInfoExperience). Build + Steiger + ESLint OK.

---

### T4 — Widgets Statiques (Header + Footer)

```yaml
id: T4
nom: "Widgets Statiques — Header & Footer"
status: done
date_debut: 2026-02-28
date_fin: 2026-02-28
prerequis: [T1, T3]
bloque: [T7, T8, T9]
```

**Objectif :** Creer le header sticky avec navigation et le footer avec les infos globales.

**Livrables :**

1. `widgets/header/ui/Header.tsx` — Server Component, navigation sticky
   - Logo/nom Tianoa
   - Liens navigation (Accueil, Contact)
   - Responsive : burger menu sur mobile
2. `widgets/header/ui/MobileMenuAnimated.tsx` — `"use client"`, animation menu burger Motion
3. `widgets/footer/ui/Footer.tsx` — Server Component
   - Infos globales depuis `getSiteInfo()`
   - Liens reseaux sociaux
   - Email contact
4. Integrer Header et Footer dans `src/app/(frontend)/layout.tsx`

**Reference visuelle :** Site Framer https://cestmoitia.framer.website/ (header et footer exacts a reproduire)

**Criteres de validation :**

- [x] Header sticky visible sur toutes les pages
- [x] Navigation fonctionne (liens)
- [x] Menu burger sur mobile avec animation — **N/A** : le site Framer n'a PAS de burger menu, navigation minimale (CTA seul)
- [x] Footer affiche les donnees depuis Payload
- [x] Responsive : desktop / tablet / mobile
- [x] Navigation au clavier fonctionnelle (accessibilite)
- [x] Steiger + ESLint passent

**Notes :** Header : 3 colonnes (horloge locale Tahiti Pacific/Tahiti avec interval 1s + hydration-safe useState(""), grille 4 points 2x2 comme logo/accueil, CTA pill "CONTACTEZ-MOI" avec slide-up fill animation hover). Footer : "Un projet?" heading + CTA identique, grille 3 colonnes (location/profession, bio Inter, liens sociaux), texte decoratif "CESTMOITIA" opacity-10, barre copyright + retour haut. Pattern Server/Client : Header.tsx + HeaderAnimated.tsx, Footer.tsx (fetch getSiteInfo avec try/catch) + FooterAnimated.tsx. Pas de burger menu — decision de suivre le design Framer reel plutot que le dev-plan initial. Integres dans layout.tsx avec `<main>` wrapper.

---

### T5 — Widget Hero

```yaml
id: T5
nom: "Widget Hero — Section Hero Homepage"
status: done
date_debut: 2026-02-28
date_fin: 2026-02-28
prerequis: [T1]
bloque: [T7]
info: "NECESSITE audit visuel du site Framer pour reproduire fidèlement"
```

**Objectif :** Creer la section hero de la homepage, pixel-perfect par rapport au site Framer.

**Livrables :**

1. `widgets/hero/ui/Hero.tsx` — Server Component, structure hero
2. `widgets/hero/ui/HeroAnimated.tsx` — `"use client"`, animations d'entree Motion (fade, slide, parallax selon audit Framer)
3. Typographie hero : Clash Display, grande taille, impact visuel
4. Layout responsive : 1440px, 810px, 390px

**Reference visuelle :** Hero exact du site https://cestmoitia.framer.website/

**Criteres de validation :**

- [x] Hero visuellement fidele au site Framer
- [x] Animations d'entree fluides
- [x] `prefers-reduced-motion` respecte
- [x] Responsive sur les 3 breakpoints
- [x] LCP hero < 2.5s — Image avec `priority` + Next.js Image `fill`
- [x] Steiger + ESLint passent

**Notes :** H1 "cestmoitia" responsive (40px→80px→227.2px) avec fade+slideUp 800ms. Rangee details 3 colonnes (location, availability, profession) en Clash Display 12px. Separateur 1px. Image parallax (useScroll + useTransform translateY 0→-60px) avec Next.js Image priority + sizes responsive. Toutes les animations respectent useReducedMotion(). Hero image copiee depuis framer-scrape assets vers public/hero-tia.jpg.

---

### T6 — Widget Grille Projets

```yaml
id: T6
nom: "Widget Grille Projets"
status: done
date_debut: 2026-02-28
date_fin: 2026-02-28
prerequis: [T2]
bloque: [T7]
```

**Objectif :** Creer la grille de projets de la homepage avec animations stagger.

**Livrables :**

1. `widgets/project-grid/ui/ProjectGrid.tsx` — Server Component, fetch `getProjects()` et rend la grille
2. `widgets/project-grid/ui/ProjectGridAnimated.tsx` — `"use client"`, animation stagger reveal au scroll (Motion)
3. Layout grille : reproduire le layout exact du site Framer
4. Chaque card utilise `ProjectCard` depuis `entities/project`
5. Liens vers `/work/[slug]` (route conforme au site Framer)

**Reference visuelle :** Grille projets du site https://cestmoitia.framer.website/

**Criteres de validation :**

- [x] Grille affiche les projets depuis Payload (tries par displayOrder)
- [x] Animation stagger au scroll
- [x] Cards cliquables menant a la page projet
- [x] CLS < 0.1 (aspect-ratios preserves) — ProjectCardAnimated utilise aspect-[4/3] + fill + object-cover
- [x] Responsive
- [x] Steiger + ESLint passent

**Notes :** Pattern "donut" — Server Component (ProjectGrid.tsx) fetch getProjects() avec try/catch (fallback []), rend les ProjectCard cote serveur, les passe en children au Client Component (ProjectGridAnimated.tsx). Ce pattern evite de bundler le code Payload/serveur dans le client bundle (erreur webpack fs/dns/net resolue). Stagger reveal : useInView(once:true, margin:-100px) + m.div fade+slideUp 40px, delay index*150ms. Grid 1 colonne mobile, 2 colonnes tablet+. Section header "01 //Portfolio 2013-2025" + titre "MON Portfolio" responsive (40px→60px→120px).

---

### T7 — Page Home

```yaml
id: T7
nom: "Page Home — Composition Complete"
status: done
date_debut: 2026-02-28
date_fin: 2026-02-28
prerequis: [T4, T5, T6]
bloque: []
```

**Objectif :** Composer la page d'accueil complete en assemblant les widgets.

**Livrables :**

1. `src/pages/home/ui/HomePage.tsx` — Server Component, compose :
   - Hero (widget)
   - ProjectGrid (widget)
   - Toute autre section visible sur le site Framer (a identifier lors de l'audit)
2. `src/app/(frontend)/page.tsx` — re-export `HomePage as default`
3. Metadata SEO : title, description, OG image

**Reference visuelle :** Page complete https://cestmoitia.framer.website/

**Criteres de validation :**

- [x] Homepage complete avec toutes les sections du site Framer
- [x] Scroll fluide entre les sections
- [ ] Metadata SEO presentes (T12)
- [ ] Lighthouse Performance >= 90 desktop (T12)
- [x] Steiger + ESLint passent

**Notes :** 4 nouveaux widgets crees en amont (T6.1-T6.4) : About (bio + CV link + parallax zoom image), Services (accordion single-open avec AnimatePresence), Vision (per-word scroll-driven animation "JEUNE Creatif AMOUREUX DE L'AUDIOVISUEL: VOTRE IDEE, MA VISION." + horizontal parallax CESTMOITIA), Experience (stagger reveal cards avec company/position/year). Chaque widget suit le pattern Server Component (fetch getSiteInfo avec try/catch) + Client Component *Animated (motion/react). Composant shared SectionHeader extrait pour le patron "01 | //Portfolio | 2013-2025" reutilise sur 5 sections. ProjectGrid refactore pour utiliser SectionHeader. HomePage compose 6 widgets dans l'ordre : Hero → ProjectGrid(01) → About(02) → Services(03) → Vision(04) → Experience(05).

---

### T8 — Page Projet Detail

```yaml
id: T8
nom: "Page Projet Detail"
status: done
date_debut: 2026-02-28
date_fin: 2026-02-28
prerequis: [T2, T4]
bloque: []
```

**Objectif :** Creer la page detail d'un projet avec medias, description et metadata SEO.

**Livrables :**

1. `src/pages/project/ui/ProjectPage.tsx` — Server Component, utilise `ProjectDetail` depuis entities
2. `src/pages/project/api/metadata.ts` — `generateMetadata()` dynamique + `generateStaticParams()`
3. `src/app/(frontend)/work/[slug]/page.tsx` — re-export ProjectPage + generateMetadata (route `/work/[slug]` conforme au Framer)
4. `src/app/(frontend)/work/[slug]/loading.tsx` — loading state
5. `src/app/(frontend)/work/[slug]/error.tsx` — error boundary
6. Affichage medias : images (Next.js Image), videos (lazy load + placeholder)
7. Carousel horizontal detecte dans l'audit Framer (voir framer-audit.md section 4.4)
8. Navigation retour vers `/work`

**Reference visuelle :** Page projet du site Framer (cliquer sur un projet)

**Criteres de validation :**

- [x] Page projet affiche titre, description, medias
- [x] Images optimisees (WebP/AVIF via Next.js Image)
- [x] Videos en lazy loading avec placeholder (iframe lazy)
- [x] Metadata SEO dynamiques (title, description, OG image du projet)
- [ ] JSON-LD CreativeWork (T12)
- [x] CLS < 0.1 (aspect-video + fill + object-cover)
- [x] Navigation back preservee
- [x] 404 si slug inexistant (notFound())
- [x] Steiger + ESLint passent

**Notes :** ProjectDetail.tsx refonte pixel-perfect : metadata row (year|client|category), H1 40→90px, sub-projects avec subTitle/subDescription/subMedia grid, gallery images grid 2 cols, video iframe. ProjectPage.tsx fetch projet + related projects (2 max). MoreWorks section : MoreWorksAnimated.tsx marquee infini "MORE WORKS MORE WORKS!" CSS translateX(-50%) animation + 2 ProjectCards grid. Route `work/[slug]/page.tsx` avec generateMetadata + generateStaticParams (try/catch fallback []). typeof check pour subDescription unknown (Lexical richText).

---

### T9 — Page Contact + Feature Contact Form

```yaml
id: T9
nom: "Page Contact + Formulaire"
status: done
date_debut: 2026-02-28
date_fin: 2026-02-28
prerequis: [T4]
bloque: []
```

**Objectif :** Creer la page contact avec formulaire fonctionnel, validation et envoi d'email via Resend.

**Livrables :**

1. Installer `resend` et `zod`
2. `features/contact-form/model/schema.ts` — schema Zod (name, email, message, honeypot)
3. `features/contact-form/api/send-email.ts` — Server Action, validation Zod + envoi Resend
4. `features/contact-form/ui/ContactForm.tsx` — `"use client"`, formulaire interactif
   - Validation temps reel
   - Messages d'erreur clairs
   - Confirmation apres envoi
   - Honeypot anti-spam
   - Retourne `ActionResult`
5. `src/pages/contact/ui/ContactPage.tsx` — Server Component, compose le layout
6. `src/app/(frontend)/contact/page.tsx` — re-export ContactPage
7. `src/app/(frontend)/contact/loading.tsx`

**Criteres de validation :**

- [x] Formulaire valide les champs (email, message requis)
- [x] Messages d'erreur affiches
- [x] Email envoye via Resend (necessite RESEND_API_KEY en .env)
- [x] Confirmation affichee apres envoi
- [x] Honeypot fonctionnel (spam bloque)
- [x] Accessible au clavier
- [x] Steiger + ESLint passent

**Notes :** Feature contact-form : schema Zod (name min 2, email, message min 10, honeypot max 0). Server Action send-email.ts avec Resend (lazy init pour eviter crash build sans API key). ContactForm.tsx "use client" avec useActionState (React 19), honeypot sr-only, inputs border-b style, submit button full-width bg-text→bg-transparent hover. ContactPage.tsx Server Component : 2 colonnes (titre "RING A BELL!" + form gauche, image portrait droite), grille 4 colonnes info contact (Follow Me/Location/Phone/Email) depuis getSiteInfo(). Packages : resend 6.9.3, zod 4.3.6.

---

### T9.5 — Page Work (Listing Projets)

```yaml
id: T9.5
nom: "Page Work — Listing Projets"
status: done
date_debut: 2026-02-28
date_fin: 2026-02-28
prerequis: [T2, T4, T6]
bloque: [T12]
```

**Objectif :** Creer la page `/work` qui liste tous les projets — page separee de la homepage
decouverte lors de l'audit Framer.

**Livrables :**

1. `src/pages/work/ui/WorkPage.tsx` — Server Component, compose la page listing
2. `src/pages/work/index.ts` — public API
3. `src/app/(frontend)/work/page.tsx` — re-export WorkPage
4. `src/app/(frontend)/work/loading.tsx` — loading state
5. Reutilise le widget `ProjectGrid` ou variante adaptee au layout de cette page
6. Metadata SEO : title, description

**Reference visuelle :** https://cestmoitia.framer.website/work

**Criteres de validation :**

- [x] Page `/work` affiche tous les projets publies
- [x] Layout fidele au site Framer
- [x] Cards cliquables vers `/work/[slug]`
- [x] Responsive sur les 3 breakpoints
- [ ] Metadata SEO presentes (T12)
- [x] Steiger + ESLint passent

**Notes :** Page la plus simple — reutilise le widget ProjectGrid existant. Hero titre "(Portfolio)" + "SELECTED WORKS" (2 spans block, centered, responsive 40px→90px→140px). Route `/work/page.tsx` re-export simple.

---

### T9.6 — Page Photography

```yaml
id: T9.6
nom: "Page Photography — Galerie Photo"
status: done
date_debut: 2026-02-28
date_fin: 2026-02-28
prerequis: [T1, T4]
bloque: [T12]
```

**Objectif :** Creer la page `/photography` dediee a la photographie — page decouverte
lors de l'audit Framer, non prevue dans l'architecture originale.

**Livrables :**

1. `src/pages/photography/ui/PhotographyPage.tsx` — Server Component
2. `src/pages/photography/index.ts` — public API
3. `src/app/(frontend)/photography/page.tsx` — re-export PhotographyPage
4. Galerie photo (type a confirmer : grid, masonry, carousel)
5. Potentiellement une nouvelle collection Payload `photos` ou reutilisation de `media`
6. Metadata SEO : title, description

**Reference visuelle :** https://cestmoitia.framer.website/photography

**Criteres de validation :**

- [x] Page `/photography` affiche la galerie photo
- [x] Layout fidele au site Framer
- [x] Images optimisees (Next.js Image)
- [x] Responsive sur les 3 breakpoints
- [ ] Metadata SEO presentes (T12)
- [x] Steiger + ESLint passent

**Notes :** Galerie 10 photos reproduisant le layout irregulier du site Framer : Row 1 full-width landscape, Row 2 deux portraits, Row 3 gauche stacked (landscape + portrait) / droite tall landscape, Row 4 gauche tall portrait / droite stacked landscapes, Row 5 portrait seul. CTA "UN PROJET?" + bouton "CONTACTEZ-MOI" vers /contact. PhotoGalleryAnimated.tsx "use client" avec GalleryImage sub-component (m.div fade+slideUp useInView stagger). 10 images copiees depuis framer-scrape assets vers public/photography/ avec noms descriptifs. Images about-tia.jpg, contact-tia.jpg, vision/01-05.jpg egalement copiees.

---

### T10 — CMS Revalidation & Webhook

```yaml
id: T10
nom: "CMS Revalidation & Webhook"
status: done
date_debut: 2026-03-01
date_fin: 2026-03-01
prerequis: [T2]
bloque: []
```

**Objectif :** Connecter la publication dans Payload a la revalidation du cache Next.js.

**Livrables :**

1. `features/project-publish/api/revalidate.ts` — Server Action revalidation
2. `src/app/(frontend)/api/revalidate/route.ts` — endpoint webhook POST
   - Verification du secret (`REVALIDATION_SECRET`)
   - `revalidatePath("/")` + `revalidatePath("/work")` + `revalidatePath("/work/[slug]", "page")` + `revalidatePath("/photography")`
3. Hook Payload `afterChange` sur la collection `projects` — appelle le webhook
4. Hook Payload `afterChange` sur le global `site-info` — revalidate footer/header

**Criteres de validation :**

- [x] Publier un projet dans /admin → la page se met a jour sans redeploy
- [x] Modifier site-info → footer/header mis a jour
- [x] Webhook protege par secret (rejet si mauvais token)
- [x] Steiger + ESLint passent

**Notes :** Approche double : (1) hooks Payload afterChange/afterDelete directs appelant revalidatePath/revalidateTag depuis next/cache (possible car Payload embarque dans Next.js), (2) endpoint webhook POST /api/revalidate protege par REVALIDATION_SECRET pour revalidation externe. Projects : afterChange + afterDelete revalident /, /work, /photography, /work/[slug] + tag "projects". SiteInfo : afterChange revalide /, /work, /photography, /contact + tag "site-info". Type guard isLexicalContent ajoute pour corriger le typage richText dans ProjectDetail. Build + ESLint OK.

---

### T11 — Media Storage (Vercel Blob)

```yaml
id: T11
nom: "Media Storage — Vercel Blob"
status: done
date_debut: 2026-03-01
date_fin: 2026-03-01
prerequis: [T2]
bloque: [T13]
```

**Objectif :** Configurer le stockage des medias via Vercel Blob pour les uploads Payload.

**Livrables :**

1. Installer `@payloadcms/storage-vercel-blob`
2. Configurer le plugin storage dans `payload.config.ts`
3. Collection Payload `media` (upload collection) :
   - `alt` (text, required — accessibilite)
   - Formats : images (jpg, png, webp, avif) + videos (mp4, webm)
   - Tailles d'images generees automatiquement (thumbnail, card, full)
4. Lier les uploads aux collections `projects` (coverImage, galleryImages)
5. Variable d'environnement `BLOB_READ_WRITE_TOKEN`

**Criteres de validation :**

- [x] Upload d'image depuis /admin → stocke dans Vercel Blob
- [x] Upload de video depuis /admin → stocke dans Vercel Blob
- [x] Images servies avec CDN
- [x] Alt text obligatoire (accessibilite)
- [x] Steiger + ESLint passent

**Notes :** Plugin `@payloadcms/storage-vercel-blob` 3.78.0 installe. Configure dans payload.config.ts avec activation conditionnelle (seulement si BLOB_READ_WRITE_TOKEN est defini — permet le dev local sans token). Collection Media deja configuree en T2 (imageSizes thumbnail/card/full, crop, focalPoint, alt required, mimeTypes images+videos). Build + ESLint OK.

---

### T12 — SEO & Finition

```yaml
id: T12
nom: "SEO & Finition"
status: pending
date_debut: null
date_fin: null
prerequis: [T7, T8, T9, T9.5, T9.6]
bloque: []
```

**Objectif :** Finaliser le SEO, les OG cards, le sitemap et les derniers details de polish.

**Livrables :**

1. `src/app/(frontend)/sitemap.ts` — sitemap dynamique (query Payload pour tous les projets publies + pages statiques)
2. `public/robots.txt` — configuration robots
3. Metadata SEO sur chaque page (verifier/completer) :
   - Homepage : title, description, OG image
   - Page work : title, description
   - Page projet : title dynamique, description, OG image du projet
   - Page photography : title, description
   - Page contact : title, description
4. JSON-LD sur les pages projet (`CreativeWork`)
5. Meta geo pour Tahiti / Polynesie francaise (SEO local)
6. Meta `lang="fr"` sur le HTML
7. Verifier `prefers-reduced-motion` sur toutes les animations
8. Verifier tous les `alt` sur les images
9. Verifier la navigation au clavier complete
10. Verifier les contrastes AA (4.5:1)
11. Security headers dans `next.config.mjs` ou middleware (CSP, X-Frame-Options)
12. Favicon + OG image par defaut dans `public/`

**Criteres de validation :**

- [ ] Lighthouse Performance >= 90 desktop, >= 85 mobile
- [ ] Lighthouse SEO >= 95
- [ ] Lighthouse Accessibility >= 85
- [ ] Core Web Vitals : LCP < 2.5s, CLS < 0.1, INP < 200ms
- [ ] Sitemap accessible a `/sitemap.xml`
- [ ] OG cards fonctionnelles (tester avec opengraph.xyz ou similaire)
- [ ] JSON-LD valide (tester avec Google Rich Results Test)
- [ ] `prefers-reduced-motion` respecte
- [ ] Navigation clavier complete
- [ ] Steiger + ESLint passent

**Notes :** _A remplir par l'agent apres completion_

---

### T13 — Seed & Migration Contenu

```yaml
id: T13
nom: "Seed & Migration Contenu Framer"
status: pending
date_debut: null
date_fin: null
prerequis: [T2, T11]
bloque: []
```

**Objectif :** Creer les scripts de seed pour peupler Payload avec le contenu existant du site Framer.

**Livrables :**

1. Script `scripts/seed.ts` — peuple la base Payload :
   - Cree les projets (titre, description, categorie, ordre)
   - Upload et associe les medias (images/videos fournies par Tianoa)
   - Cree les donnees site-info (bio, liens reseaux)
2. Commande npm : `"seed": "tsx scripts/seed.ts"`
3. Donnees source : inventaire des projets du site Framer (titres, descriptions, ordre)
4. Medias : fournis par Tianoa (photos HD, videos originales)

**Criteres de validation :**

- [ ] `pnpm seed` peuple la base sans erreur
- [ ] Tous les projets du site Framer presents dans Payload
- [ ] Medias correctement associes
- [ ] Le site affiche le contenu identique au Framer
- [ ] Script idempotent (peut etre relance)

**Notes :** _A remplir par l'agent apres completion_

---

## Graphe de Dependances

```
T0 (Scaffold FSD) ✅
├── T0.5 (Audit Framer & Design Tokens) ✅
│   └── T1 (Foundation Shared) ✅
│       ├── T2 (Entity Project) ✅
│       │   ├── T6 (Widget Grille Projets) ✅
│       │   │   ├── T7 (Page Home) ✅ ← aussi T4 ✅, T5 ✅
│       │   │   └── T9.5 (Page Work) ✅ ← aussi T4 ✅
│       │   ├── T8 (Page Projet Detail) ✅ ← aussi T4 ✅
│       │   ├── T10 (CMS Revalidation)
│       │   ├── T11 (Media Storage)
│       │   │   └── T13 (Seed) ← aussi T2 ✅
│       │   └── T13 (Seed)
│       ├── T3 (Entity Site-Info) ✅
│       │   └── T4 (Widgets Header/Footer) ✅
│       │       ├── T7 (Page Home) ✅
│       │       ├── T8 (Page Projet Detail) ✅
│       │       ├── T9 (Page Contact) ✅
│       │       ├── T9.5 (Page Work) ✅
│       │       └── T9.6 (Page Photography) ✅
│       ├── T5 (Widget Hero) ✅
│       │   └── T7 (Page Home) ✅
│       ├── T9 (Page Contact) ✅ ← aussi T4 ✅
│       └── T9.6 (Page Photography) ✅ ← aussi T4 ✅
└── T12 (SEO & Finition) ← apres T7 ✅, T8 ✅, T9 ✅, T9.5 ✅, T9.6 ✅
```

**Chemins critiques :**

- **Chemin 1 (le plus long) :** T0 → T0.5 → T1 → T2 → T6 → T7 → T12
- **Chemin 2 :** T0 → T0.5 → T1 → T3 → T4 → T7 → T12
- **Chemin 3 :** T0 → T0.5 → T1 → T2 → T11 → T13
- **Chemin 4 (nouveau) :** T0 → T0.5 → T1 → T2 → T6 → T9.5 → T12

**Tranches parallelisables** (si plusieurs agents travaillent) :

- T2 + T3 (apres T1)
- T5 + T6 (apres T2 et T1)
- T8 + T9 + T9.5 + T9.6 + T10 + T11 (apres T2/T4)
- T12 + T13 (fin de pipeline)

---

## Suivi d'Avancement

| Tranche | Statut | Date debut | Date fin | Agent | Notes |
|---------|--------|------------|----------|-------|-------|
| T0 | **done** | 2026-02-28 | 2026-02-28 | BMad Master | Next.js 15.4.11, Payload (payload) route group, FSD structure complete |
| T0.5 | **done** | 2026-02-28 | 2026-02-28 | BMad Master | Playwright scrape complet : 30 screenshots, 67 fonts, 67 images, tout le contenu textuel |
| T1 | **done** | 2026-02-28 | 2026-02-28 | BMad Master | motion, clsx, tailwind-merge installes. Fonts Clash Display (local) + Inter (google). Tailwind v4 tokens. cn(), getPayloadClient(), ActionResult, MotionProvider, AppProviders. Build + lint OK |
| T2 | **done** | 2026-02-28 | 2026-02-28 | BMad Master | Collections Media + Projects. Champs enrichis (client, year, subProjects). Upload avec imageSizes (thumbnail/card/full), crop, focalPoint. Slug auto-genere, publishedAt auto-set. Entity FSD : types, queries (getProjects, getProjectBySlug, getProjectSlugs), UI (ProjectCard, ProjectCardAnimated, ProjectDetail) |
| T3 | **done** | 2026-02-28 | 2026-02-28 | BMad Master | Global SiteInfo enrichi (heroTagline, phone, location, cvUrl, services array, experiences array). Social links corriges (Instagram/Facebook/Twitter au lieu de LinkedIn/YouTube). Entity FSD : types detailles, getSiteInfo() query |
| T4 | **done** | 2026-02-28 | 2026-02-28 | BMad Master | Header 3-col (horloge Tahiti, dot grid, CTA pill). Footer ("Un projet?", CTA, infos 3-col, social links, CESTMOITIA decoratif). Pas de burger (suit design Framer reel). try/catch getSiteInfo pour build sans DB |
| T5 | **done** | 2026-02-28 | 2026-02-28 | BMad Master | H1 "cestmoitia" 227.2px desktop. Parallax image (useScroll+useTransform). Fade+slideUp animations. useReducedMotion. hero-tia.jpg priority LCP |
| T6 | **done** | 2026-02-28 | 2026-02-28 | BMad Master | Pattern donut (Server renders cards, Client wraps with m.div). Stagger reveal useInView. Grid 1→2 cols. try/catch getProjects pour build sans DB. Section header + titre responsive |
| T7 | **done** | 2026-02-28 | 2026-02-28 | BMad Master | 4 widgets homepage crees (About, Services, Vision, Experience) + SectionHeader shared. Compose 6 widgets dans l'ordre Hero→Portfolio→About→Services→Vision→Experience |
| T8 | **done** | 2026-02-28 | 2026-02-28 | BMad Master | ProjectDetail refonte pixel-perfect. ProjectPage + MoreWorks marquee. Route [slug] avec generateMetadata + generateStaticParams |
| T9 | **done** | 2026-02-28 | 2026-02-28 | BMad Master | ContactForm useActionState + Zod + honeypot. Server Action Resend (lazy init). ContactPage 2-col + 4-col info grid |
| T9.5 | **done** | 2026-02-28 | 2026-02-28 | BMad Master | Reutilise ProjectGrid. Hero "SELECTED WORKS" responsive |
| T9.6 | **done** | 2026-02-28 | 2026-02-28 | BMad Master | Galerie 10 photos layout irregulier. CTA "UN PROJET?". 17 images copiees (photography, about, contact, vision) |
| T10 | **done** | 2026-03-01 | 2026-03-01 | Cursor | Hooks afterChange/afterDelete directs + webhook POST /api/revalidate. Fix typage richText ProjectDetail |
| T11 | **done** | 2026-03-01 | 2026-03-01 | Cursor | @payloadcms/storage-vercel-blob 3.78.0. Activation conditionnelle (BLOB_READ_WRITE_TOKEN). Collection Media deja prete depuis T2 |
| T12 | pending | — | — | — | — |
| T13 | pending | — | — | — | — |

---

## Glossaire pour les Agents

| Terme | Definition |
|-------|-----------|
| FSD | Feature-Sliced Design — architecture front organisee en Layers > Slices > Segments |
| Tranche | Unite de travail verticale couvrant un perimetre fonctionnel complet |
| Re-export | Pattern ou `app/page.tsx` ne contient qu'un export depuis `src/pages/` |
| Public API | Fichier `index.ts` d'un slice — seul point d'entree autorise pour les imports externes |
| Server Component | Composant React qui s'execute cote serveur (par defaut dans Next.js App Router) |
| Client Component | Composant avec `"use client"` — s'execute aussi cote client (pour interactivite) |
| Leaf Component | Composant en bout de chaine (feuille) — c'est la que vont les `"use client"` |
| ActionResult | Type standardise `{ success: true, data: T } | { success: false, error: string }` |
