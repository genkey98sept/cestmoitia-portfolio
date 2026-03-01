---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments: [prd.md, product-brief-tia-2026-02-28.md]
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-02-28'
project_name: 'tia'
user_name: 'Doens'
date: '2026-02-28'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
41 FRs across 8 capability areas. Core architectural drivers: pixel-perfect Framer migration (FR16-FR17), FSD architecture enforcement, Payload CMS integration with on-demand revalidation (FR32), and media optimization pipeline (FR20-FR23). All pages server-rendered by default with client islands for animations and interactions.

**Non-Functional Requirements:**
22 NFRs dominated by performance targets (LCP < 2.5s, CLS < 0.1, INP < 200ms, Lighthouse ≥ 90). Server Components by default to minimize JS bundle. WCAG 2.1 AA accessibility. Basic security (Payload auth, HTTPS, spam protection). 99.9% uptime via Vercel SLA.

**Scale & Complexity:**

- Primary domain: Full-stack web (Next.js App Router + Payload CMS + PostgreSQL)
- Complexity level: Medium-High (pixel-perfect fidelity + animation system + FSD strict)
- Scale: Low (single admin, portfolio traffic)
- Core challenge: Quality and fidelity, not scalability
- Estimated architectural components: ~15 (pages, layouts, features, shared, CMS collections, API routes, seed scripts)

### Technical Constraints & Dependencies

- **FSD Architecture (non-negotiable):** Feature-Sliced Design with ESLint + Steiger enforced import rules. Detailed rules in FSD Reference section below.
- **Next.js App Router:** Server Components by default. `"use client"` only for animations, interactions, contact form.
- **Payload CMS 3.x:** Embedded in Next.js process. Collections: Projets, Infos. Admin at /admin. Isolé dans `src/app/(payload)/` pour respecter FSD (adaptation T0 : `(cms)` → `(payload)`, convention officielle).
- **Vercel Deployment:** CDN edge global (critical for Tahiti/Pacific coverage). Blob storage for media.
- **PostgreSQL:** Database for Payload CMS data.
- **Framer Site as Visual Spec:** https://cestmoitia.framer.website/ — pixel-perfect reproduction required. Phase 0 audit via Playwright prerequisite.
- **Tahiti Context:** CDN latency, upload resilience for admin BO, SEO local + international.

### Cross-Cutting Concerns Identified

- **Server/Client Component Boundary:** Data fetching (server) vs animations/interactions (client) — requires clear composition pattern per page
- **FSD Import Rules:** Every module must respect layer boundaries — ESLint + Steiger enforced
- **Media Optimization Pipeline:** Images (WebP/AVIF via Next.js Image) + Videos (lazy loading, placeholder blur) — affects all content pages
- **SEO Metadata Generation:** generateMetadata per page, JSON-LD on project pages, OG cards for social sharing
- **Responsive Design:** 3 breakpoints (1440px, 810px, 390px) aligned with Framer reference — mobile-first CSS
- **Revalidation Flow:** Payload publish → webhook → revalidatePath/revalidateTag → CDN purge

## FSD Architecture Reference

### Core Principle

FSD organise le code en **Layers → Slices → Segments** avec une règle d'import unidirectionnelle stricte.

### Layer Hierarchy (du plus haut au plus bas)

| Layer | Responsabilité | Slices ? | Peut importer depuis |
|-------|---------------|----------|---------------------|
| **app/** | Initialization, providers, routing, global styles | Non (segments directs) | pages, widgets, features, entities, shared |
| **pages/** | Composition de pages complètes, un slice par route | Oui | widgets, features, entities, shared |
| **widgets/** | Blocs UI autonomes et réutilisables composant features + entities | Oui | features, entities, shared |
| **features/** | Interactions utilisateur avec valeur business (formulaires, actions) | Oui | entities, shared |
| **entities/** | Concepts métier (Projet, User) — data, types, UI de base | Oui | shared uniquement (+ @x entre entities) |
| **shared/** | Code réutilisable sans logique business — UI kit, lib, config, api | Non (segments directs) | Rien (packages externes uniquement) |

### La Règle d'Import Stricte (CRITIQUE)

**AUTORISÉ :** Importer depuis les layers STRICTEMENT en dessous.
**INTERDIT :** Importer depuis le même layer (cross-import entre slices) ou depuis un layer supérieur.

```
app → peut importer de : pages, widgets, features, entities, shared
pages → peut importer de : widgets, features, entities, shared
widgets → peut importer de : features, entities, shared
features → peut importer de : entities, shared
entities → peut importer de : shared uniquement
shared → rien (packages externes uniquement)
```

**Exceptions :**
- `app/` et `shared/` n'ont pas de slices — leurs segments internes peuvent s'importer librement
- Pattern `@x` sur le layer entities uniquement : `entities/A/@x/B.ts` pour les relations entre entités

### Slices — Règles

- Nommés par domaine business (pas par technique) : `project`, `contact`, `hero` — pas `api-service`, `redux-store`
- Chaque slice DOIT avoir un `index.ts` (public API)
- Isolation totale : zéro couplage entre slices du même layer
- Les imports externes passent TOUJOURS par le `index.ts`, jamais par les fichiers internes

### Segments — Règles

| Segment | But | Contenu typique |
|---------|-----|----------------|
| `ui/` | Composants UI, rendu, styles | React components, CSS modules |
| `model/` | Logique business, types, schemas, state | TypeScript types, Zod schemas, stores |
| `api/` | Interactions backend, fetching, mutations | Server actions, queries, API calls |
| `lib/` | Code utilitaire interne au slice | Helpers spécifiques au slice |
| `config/` | Configuration, feature flags | Constants, env vars |

**Règle de nommage :** Nommer par PURPOSE (le "pourquoi"), pas par ESSENCE (le "quoi").
- **INTERDIT :** `components/`, `hooks/`, `utils/`, `types/`, `helpers/`
- **CORRECT :** `ui/`, `model/`, `api/`, `lib/`, `config/`

### Public API Pattern

```typescript
// CORRECT — exports nommés explicites
export { ProjectCard } from "./ui/ProjectCard";
export { type Project } from "./model/types";
export { getProjects } from "./api/queries";

// INTERDIT — wildcard re-exports
export * from "./ui/ProjectCard";  // ❌ Nuit à la découvrabilité
```

**Imports internes au slice :** chemins relatifs (vers le fichier direct).
**Imports entre slices :** chemins absolus via alias (vers le `index.ts`).

```typescript
// Dans entities/project/ui/ProjectCard.tsx :
import { type Project } from "../model/types";  // ✅ Relatif interne

// Dans pages/home/ui/HomePage.tsx :
import { ProjectCard } from "@/entities/project";  // ✅ Absolu via public API
import { ProjectCard } from "@/entities/project/ui/ProjectCard";  // ❌ Deep import
```

### FSD + Next.js App Router — Structure

> **IMPORTANT :** Cette section reflète la structure réelle après les adaptations T0.
> Le routing Next.js et les layers FSD sont tous sous `src/`.
> Le dossier `pages/` à la racine est vide (empêche Pages Router).

```
project-root/
├── pages/                              # DOSSIER VIDE OBLIGATOIRE (empêche Pages Router)
│   └── .gitkeep
│
└── src/
    ├── app/                            # FSD App Layer + Next.js routing combinés
    │   ├── (frontend)/                 # Route group frontend (thin re-exports UNIQUEMENT)
    │   │   ├── layout.tsx              # Root layout (html, body, metadata, providers, fonts)
    │   │   ├── page.tsx                # Re-export depuis src/pages/home
    │   │   ├── not-found.tsx           # Page 404
    │   │   ├── work/
    │   │   │   ├── page.tsx            # Re-export depuis src/pages/work (T9.5)
    │   │   │   └── [slug]/
    │   │   │       └── page.tsx        # Re-export depuis src/pages/project (T8)
    │   │   ├── photography/
    │   │   │   └── page.tsx            # Re-export depuis src/pages/photography (T9.6)
    │   │   └── contact/
    │   │       └── page.tsx            # Re-export depuis src/pages/contact (T9)
    │   │
    │   ├── (payload)/                  # Route group Payload CMS (convention officielle)
    │   │   ├── layout.tsx              # Payload admin layout (auto-généré)
    │   │   ├── custom.scss             # Styles admin custom
    │   │   ├── admin/
    │   │   │   ├── importMap.js
    │   │   │   └── [[...segments]]/
    │   │   │       ├── page.tsx        # Payload Admin UI
    │   │   │       └── not-found.tsx
    │   │   └── api/
    │   │       ├── graphql/
    │   │       │   └── route.ts        # GraphQL API
    │   │       └── [...slug]/
    │   │           └── route.ts        # REST API
    │   │
    │   ├── providers/                  # FSD App segment
    │   │   ├── AppProviders.tsx        # MotionProvider + wrappers
    │   │   └── index.ts
    │   ├── styles/
    │   │   └── globals.css             # Tailwind v4 CSS-first tokens
    │   └── fonts/
    │       ├── index.ts                # next/font definitions
    │       ├── ClashDisplay-Bold.woff2
    │       ├── ClashDisplay-Medium.woff2
    │       └── ClashDisplay-Semibold.woff2
    │
    ├── pages/                          # FSD Pages Layer (composition)
    │   ├── home/
    │   │   ├── ui/
    │   │   │   └── HomePage.tsx        # Server Component — compose widgets
    │   │   └── index.ts
    │   ├── project/
    │   │   ├── ui/
    │   │   │   └── ProjectPage.tsx
    │   │   ├── api/
    │   │   │   └── metadata.ts         # generateMetadata + generateStaticParams
    │   │   └── index.ts
    │   ├── contact/
    │   │   ├── ui/
    │   │   │   └── ContactPage.tsx
    │   │   └── index.ts
    │   ├── work/                       # NOUVEAU — découvert lors de l'audit Framer (T9.5)
    │   │   ├── ui/
    │   │   │   └── WorkPage.tsx
    │   │   └── index.ts
    │   └── photography/                # NOUVEAU — découvert lors de l'audit Framer (T9.6)
    │       ├── ui/
    │       │   └── PhotographyPage.tsx
    │       └── index.ts
    │
    ├── widgets/                        # Blocs UI composés réutilisables
    │   ├── header/
    │   │   ├── ui/
    │   │   │   ├── Header.tsx          # Server Component
    │   │   │   └── MobileMenuAnimated.tsx  # Client — menu burger
    │   │   └── index.ts
    │   ├── footer/
    │   │   ├── ui/
    │   │   │   └── Footer.tsx
    │   │   └── index.ts
    │   ├── hero/
    │   │   ├── ui/
    │   │   │   ├── Hero.tsx            # Server Component
    │   │   │   └── HeroAnimated.tsx    # Client — animations
    │   │   └── index.ts
    │   └── project-grid/
    │       ├── ui/
    │       │   ├── ProjectGrid.tsx     # Server Component
    │       │   └── ProjectGridAnimated.tsx  # Client — stagger
    │       └── index.ts
    │
    ├── features/                       # Interactions utilisateur
    │   ├── contact-form/
    │   │   ├── ui/
    │   │   │   └── ContactForm.tsx     # Client — formulaire interactif
    │   │   ├── model/
    │   │   │   └── schema.ts           # Zod validation
    │   │   ├── api/
    │   │   │   └── send-email.ts       # Server Action → Resend
    │   │   └── index.ts
    │   └── project-publish/
    │       ├── api/
    │       │   └── revalidate.ts       # Server Action revalidation
    │       └── index.ts
    │
    ├── entities/                       # Concepts métier
    │   ├── project/
    │   │   ├── ui/
    │   │   │   ├── ProjectCard.tsx     # Server Component
    │   │   │   ├── ProjectCardAnimated.tsx  # Client — hover/reveal
    │   │   │   └── ProjectDetail.tsx   # Server Component
    │   │   ├── model/
    │   │   │   └── types.ts            # Type Project (dérivé Payload)
    │   │   ├── api/
    │   │   │   └── queries.ts          # getProjects(), getProjectBySlug()
    │   │   └── index.ts
    │   └── site-info/
    │       ├── model/
    │       │   └── types.ts            # Type SiteInfo
    │       ├── api/
    │       │   └── queries.ts          # getSiteInfo()
    │       └── index.ts
    │
    ├── shared/                         # Code réutilisable sans business logic
    │   ├── ui/
    │   │   ├── MotionProvider.tsx       # "use client" — LazyMotion wrapper
    │   │   └── index.ts
    │   ├── lib/
    │   │   ├── payload-client.ts       # getPayload() helper
    │   │   ├── cn.ts                   # clsx + twMerge utility
    │   │   └── index.ts
    │   ├── api/
    │   │   └── index.ts                # Payload client re-export
    │   ├── config/
    │   │   ├── site.ts                 # SITE_URL, SITE_NAME constantes
    │   │   └── index.ts
    │   └── model/                      # Nommé "model" (pas "types") — Steiger by-purpose
    │       ├── action-result.ts        # ActionResult<T> type
    │       └── index.ts
    │
    ├── collections/                    # Payload CMS collection definitions (hors FSD)
    │   └── Users.ts                    # Collection authentification admin
    │
    └── payload.config.ts               # Config Payload (collections, DB, plugins)
```

### Re-export Pattern (CRITIQUE pour Next.js)

```typescript
// src/app/(frontend)/page.tsx — Next.js routing file
export { HomePage as default } from "@/pages/home";

// src/app/(frontend)/work/[slug]/page.tsx
export { ProjectPage as default } from "@/pages/project";
export { generateMetadata } from "@/pages/project";

// src/app/(frontend)/work/page.tsx
export { WorkPage as default } from "@/pages/work";

// src/app/(frontend)/contact/page.tsx
export { ContactPage as default } from "@/pages/contact";

// src/app/(frontend)/photography/page.tsx
export { PhotographyPage as default } from "@/pages/photography";
```

Les fichiers `page.tsx` dans `src/app/(frontend)/` ne contiennent AUCUNE logique — uniquement des re-exports depuis le layer FSD `src/pages/`. Le CMS Payload est isolé dans `src/app/(payload)/` comme route group dédié.

### Server/Client Components dans FSD

| Layer | Par défaut | "use client" quand ? |
|-------|-----------|---------------------|
| **pages** | Server Component | Rarement — composition uniquement |
| **widgets** | Server Component | Si state interactif propre |
| **features** | Mixte — UI souvent Client | Formulaires, boutons avec handlers, animations |
| **entities** | Server Component | Si onClick/onChange handlers |
| **shared** | Server Component | Composants interactifs (Modal, Dropdown) |

**Règle :** Garder les Client Components "leaf-like" — les pousser aux feuilles de l'arbre, pas aux racines de composition.

### Data Fetching dans FSD

**Queries (lectures) :** dans `entities/*/api/` — colocalisées avec le domaine.
```typescript
// src/entities/project/api/queries.ts (Server-only)
import { getPayloadClient } from "@/shared/api";

export async function getProjects() {
  const payload = await getPayloadClient();
  return payload.find({ collection: "projects", where: { status: { equals: "published" } }, sort: "-order" });
}

export async function getProjectBySlug(slug: string) {
  const payload = await getPayloadClient();
  const result = await payload.find({ collection: "projects", where: { slug: { equals: slug } }, limit: 1 });
  return result.docs[0] ?? null;
}
```

**Mutations (server actions) :** dans `features/*/api/` — la feature qui mute possède la revalidation.
```typescript
// src/features/project-publish/api/revalidate.ts
"use server";
import { revalidatePath } from "next/cache";

export async function revalidateAfterPublish() {
  revalidatePath("/");
  revalidatePath("/projects/[slug]", "page");
}
```

### Enforcement — Steiger + ESLint

**Steiger** (linter officiel FSD) :
```bash
npm i -D steiger @feature-sliced/steiger-plugin
```

```typescript
// steiger.config.ts
import fsd from "@feature-sliced/steiger-plugin";
import { defineConfig } from "steiger";

export default defineConfig([
  ...fsd.configs.recommended,
  { ignores: ["**/app/**"] },  // Ignore le dossier app/ Next.js (routing, pas FSD)
]);
```

**Règles Steiger clés activées par défaut :**
- `fsd/forbidden-imports` — bloque imports depuis layers supérieurs et cross-imports
- `fsd/no-public-api-sidestep` — interdit les deep imports (bypass du index.ts)
- `fsd/public-api` — exige un index.ts par slice
- `fsd/no-segmentless-slices` — chaque slice doit avoir au moins un segment
- `fsd/no-ui-in-app` — pas de segment ui/ dans le layer app
- `fsd/ambiguous-slice-names` — interdit les noms de slice qui matchent des noms de segments

**ESLint** (enforcement complémentaire via no-restricted-imports) :
```javascript
{
  rules: {
    "no-restricted-imports": ["error", {
      patterns: [
        { group: ["@/entities/**/**", "!@/entities/*/index*"], message: "Use entities/* public API only." },
        { group: ["@/features/**/**", "!@/features/*/index*"], message: "Use features/* public API only." },
        { group: ["@/widgets/**/**", "!@/widgets/*/index*"], message: "Use widgets/* public API only." },
      ],
    }],
  },
}
```

### Anti-Patterns à Éviter

| Anti-Pattern | Correction |
|-------------|-----------|
| God Components (data + UI + validation + nav dans un composant) | Séparer Server Component (data) et Client Component (interaction) |
| `shared/` comme poubelle à utils | Strict : uniquement du code réutilisable multi-contexte |
| Segments nommés `components/`, `hooks/`, `utils/` | Nommer par purpose : `ui/`, `model/`, `api/`, `lib/` |
| Wildcard re-exports `export * from "./..."` | Exports nommés explicites uniquement |
| Import circulaire via index.ts propre | Imports relatifs internes au slice, jamais via son propre index |
| Over-slicing précoce | Commencer simple, extraire quand le pattern se confirme |
| State global pour tout | State local par défaut, lift uniquement quand nécessaire |
| Feature qui importe d'une autre feature | INTERDIT — remonter la logique partagée dans entities ou shared |
| Deep imports bypassing public API | TOUJOURS passer par le index.ts du slice |
| Barrel file monolithique dans shared/ui | Un index.ts par composant pour le tree-shaking |

### Quand utiliser Entity vs Feature vs Widget ?

| Question | → Layer |
|----------|---------|
| C'est un concept métier avec data et représentation visuelle ? | **Entity** (project, site-info) |
| C'est une interaction utilisateur avec valeur business ? | **Feature** (contact-form, project-publish) |
| C'est un bloc UI composé réutilisé sur plusieurs pages ? | **Widget** (header, footer, hero, project-grid) |
| C'est un layout de page unique ? | Garder dans **Page** |
| C'est un composant UI générique sans business logic ? | **Shared/ui** |

## Starter Template Evaluation

### Primary Technology Domain

Full-stack web application (Next.js App Router + Payload CMS + PostgreSQL) — identified from project requirements analysis.

### Version Compatibility Analysis

| Package | Version Choisie | Justification |
|---------|----------------|---------------|
| Next.js | 15.5.12 | Dernière 15.x stable, combo éprouvé avec Payload. Next.js 16.2 (requis par Payload pour le support 16.x) est encore en canary. |
| Payload CMS | 3.78.0 | Dernière version stable. Supporte Next.js 15.x nativement. |
| @payloadcms/db-postgres | 3.78.0 | Adapter PostgreSQL pour Payload |
| React | 19.x | Peer dependency de Next.js 15.5 |
| TypeScript | 5.x | Via create-next-app |
| Node.js | 20.x LTS | Requis par Next.js 15 |

**Note migration :** Upgrade vers Next.js 16.2 stable planifiable dès sa sortie. Payload v3.73.0+ le supportera. Migration Next.js 15 → 16 bien documentée par Vercel.

### Starter Options Considered

**Option A — `create-payload-app@latest -t blank` (REJETÉE)**
Crée `src/app/(frontend)/(payload)` — structure incompatible avec le FSD dual-folder pattern (root `app/` + `src/` pour layers FSD). Restructuration trop lourde et risquée.

**Option B — `create-next-app` + Payload Manuel (SÉLECTIONNÉE)**
Contrôle total sur la structure FSD dès le premier commit. Installation manuelle de Payload = ~6 packages + `src/payload.config.ts` + fichiers admin dans `src/app/(payload)/`.

### Selected Starter: create-next-app + Payload Manuel

**Rationale for Selection:**
Le FSD dual-folder pattern est non-négociable : `app/` à la racine pour le routing Next.js (thin re-exports uniquement), `src/` pour les layers FSD. Le scaffold Payload crée une structure `src/app/` qui fusionne routing et code — incompatible avec FSD. L'installation manuelle de Payload est bien documentée et se fait une seule fois.

**Initialization Commands:**

```bash
# 1. Scaffold Next.js (sans --src-dir : app/ reste à la racine)
npx create-next-app@15.5.12 . --typescript --eslint --app --import-alias "@/*" --use-pnpm

# 2. Installer Payload CMS + Database adapter
pnpm add payload @payloadcms/next @payloadcms/db-postgres @payloadcms/richtext-lexical sharp graphql

# 3. Installer outils FSD enforcement
pnpm add -D steiger @feature-sliced/steiger-plugin
```

**Post-Scaffold Setup (Story d'initialisation) :**

1. Créer `src/` avec tous les layers FSD (app, pages, widgets, features, entities, shared)
2. Modifier `tsconfig.json` : `"@/*" → "./src/*"`
3. Créer `src/app/(payload)/admin/[[...segments]]/page.tsx` (admin Payload)
4. Créer `src/app/(payload)/api/[...slug]/route.ts` (API Payload)
5. Créer `payload.config.ts` à la racine (collections, DB adapter, plugins)
6. Créer `pages/` vide à la racine (empêche Pages Router sur `src/pages/`)
7. Configurer `next.config.mjs` avec `withPayload()`
8. Configurer `steiger.config.ts` (FSD linter)
9. Ajouter règles ESLint FSD (`no-restricted-imports`)

### Architectural Decisions Provided by Starter

**Language & Runtime:**
TypeScript 5.x (strict mode via create-next-app). Node.js 20.x LTS.

**Build Tooling:**
Webpack 5 (production build). Turbopack disponible en dev (Next.js 15.5).

**Styling Solution:**
À décider en Step 04 (CSS Modules, Tailwind, ou autre). create-next-app le demande interactivement.

**Linting & Formatting:**
ESLint avec config Next.js par défaut + règles FSD custom (no-restricted-imports pour public API enforcement). Steiger pour validation structurelle FSD.

**Database:**
PostgreSQL via @payloadcms/db-postgres. Payload gère les migrations automatiquement.

**CMS & Auth:**
Payload CMS 3.78.0 embarqué dans le process Next.js. Auth built-in (admin unique : Tianoa). Admin panel à `/admin` via route group `(cms)`.

**Media Processing:**
sharp pour l'optimisation d'images côté serveur. Next.js Image component pour le rendu optimisé côté client.

**Rich Text Editor:**
Lexical editor (default Payload) — utilisable si besoin pour descriptions de projets enrichies.

**FSD Enforcement:**
Steiger (linter structurel FSD) + ESLint no-restricted-imports (public API enforcement) + configuration ignorant le dossier `app/` Next.js.

**Note :** L'initialisation du projet avec ces commandes et la mise en place de la structure FSD constituera la première story d'implémentation.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Styling solution: Tailwind CSS (v4.x)
- Animation library: Motion v12.x (package `motion`)
- Media storage: Vercel Blob
- Cache strategy: On-demand revalidation

**Important Decisions (Shape Architecture):**
- Contact form email: Resend
- CI/CD: Vercel auto-deploy

**Deferred Decisions (Post-MVP):**
- Analytics (Plausible si souhaité plus tard)
- Migration Next.js 15 → 16.2 (quand 16.2 stable sort)

### Data Architecture

**Database:** PostgreSQL via @payloadcms/db-postgres 3.78.0 (décidé en Step 03).

**Collections Payload:**
- `projects` : titre, slug, description, médias, catégorie, ordre, statut (publié/brouillon)
- `site-info` (Global) : bio, liens réseaux sociaux, email contact

**Data Validation:** Payload gère la validation côté CMS (champs required, types). Zod pour la validation côté frontend (formulaire de contact dans `features/contact-form/model/`).

**Media Storage:** Vercel Blob
- Intégré nativement à Vercel (même provider que le déploiement)
- Plugin Payload : `@payloadcms/storage-vercel-blob`
- Upload depuis le BO Payload → stocké dans Vercel Blob → servi via CDN edge
- Optimisation d'images via Next.js Image component (WebP/AVIF automatique)

**Caching Strategy:** On-demand Revalidation (maximum performance)
- Pages générées statiquement au build (SSG) → servies depuis le CDN edge
- Tianoa publie un projet dans Payload → webhook déclenche `revalidatePath()` / `revalidateTag()`
- Pages re-générées uniquement quand le contenu change → toujours à jour, toujours rapide
- Aucun timer ISR → zéro requête inutile, zéro délai de propagation

```typescript
// Flow de revalidation
// 1. Payload afterChange hook → appelle l'endpoint webhook
// 2. app/api/revalidate/route.ts → vérifie le secret + revalidatePath
// 3. CDN purge automatique → prochaine visite = page fraîche
```

### Authentication & Security

**Authentication:** Payload CMS built-in auth (décidé en Step 03).
- Utilisateur unique : Tianoa (admin)
- Session cookie httpOnly, secure
- Admin panel protégé à `/admin`
- Aucune auth côté frontend (site public)

**Security Headers:** Next.js middleware pour CSP, X-Frame-Options, HSTS.

**Spam Protection:** Honeypot field + rate limiting basique sur le formulaire de contact (Resend a ses propres limites intégrées).

**API Security:** Webhook revalidation protégé par secret token (`REVALIDATION_SECRET` en env var).

### API & Communication Patterns

**Payload Local API (pas de HTTP):**
Payload est embarqué dans le process Next.js → appels directs via `getPayload()` dans les Server Components. Aucune requête HTTP interne, performances optimales.

```typescript
// Accès direct — pas de fetch, pas de REST, pas de GraphQL
import { getPayload } from "payload";
import config from "@payload-config";

const payload = await getPayload({ config });
const projects = await payload.find({ collection: "projects" });
```

**Contact Form → Email:**
- Service : Resend (API email moderne, gratuit jusqu'à 100 emails/jour)
- Flow : Client Component (formulaire) → Server Action (`features/contact-form/api/`) → Resend API
- Validation : Zod côté client + côté serveur (double validation)
- Package : `resend` (SDK officiel)

**Error Handling:** Pattern standardisé dans `shared/lib/` :
- Server Actions retournent `{ success: boolean, error?: string }`
- Pas de try/catch génériques — erreurs typées et explicites

### Frontend Architecture

**Styling Solution:** Tailwind CSS (v4.x)
- Utility-first, rapide pour itérer sur les composants
- Configuration custom pour les design tokens extraits du Framer (couleurs, typos, spacings)
- `tailwind.config.ts` avec les breakpoints du design : 1440px, 810px, 390px
- Compatible avec FSD : styles colocalisés dans chaque composant, pas de fichiers CSS séparés par slice
- Utiliser `@apply` avec parcimonie — préférer les utilities directement dans le JSX

**Animation Library:** Motion v12.x (package `motion`)
- **Même moteur que Framer** — les animations du site source sont générées par cette exacte librairie
- Migration = traduction directe, pas reverse-engineering
- `LazyMotion` + composants `m` pour un bundle initial de ~4.6 KB gzipped
- Stratégie Server/Client : animations dans `"use client"` leaf components uniquement

```typescript
// shared/ui/motion-provider.tsx
"use client";
import { LazyMotion, domAnimation } from "motion/react";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}
```

- **Hover/transitions simples** → Tailwind `transition-*` classes (pas de "use client" nécessaire)
- **Animations complexes** (scroll, parallax, page transitions, stagger) → Motion

**State Management:** Minimal — Server Components par défaut.
- Pas de store global (Redux, Zustand, etc.)
- State local via `useState` uniquement dans les Client Components (formulaire de contact, menu mobile)
- Données depuis Payload via Local API dans les Server Components — pas besoin de cache client

**Font Strategy:** `next/font` pour le chargement optimisé (font-display: swap, preload automatique). Polices exactes à déterminer lors de l'audit Framer (Phase 0).

### Infrastructure & Deployment

**Hosting:** Vercel (décidé en PRD).
- CDN edge global (couverture Pacifique/Tahiti critique)
- Serverless functions pour les Server Components et API routes
- Preview deploys automatiques sur chaque push

**CI/CD:** Vercel auto-deploy.
- Push sur `main` → deploy production automatique
- Push sur branches → preview deploy automatique
- Pas de GitHub Actions nécessaire pour le MVP
- Steiger + ESLint vérifiés localement avant push (pre-commit hook recommandé)

**Environment Configuration:**
- `.env.local` : secrets (DATABASE_URL, PAYLOAD_SECRET, RESEND_API_KEY, REVALIDATION_SECRET, BLOB_READ_WRITE_TOKEN)
- `.env.example` : template sans valeurs sensibles (commité dans git)
- Variables Vercel : configurées dans le dashboard pour production/preview

**Monitoring:** Minimal pour le MVP.
- Vercel built-in : logs, analytics de performance basiques
- Pas d'analytics utilisateur prévu (confirmé dans le PRD)
- Erreurs runtime : logs Vercel par défaut, suffisant pour un portfolio

### Decision Impact Analysis

**Implementation Sequence:**
1. Scaffold Next.js + Payload + structure FSD (Story 0)
2. Configuration Tailwind avec tokens Framer (après audit Phase 0)
3. Shared UI components (Motion provider, composants de base)
4. Entities (project, site-info) + collections Payload
5. Widgets (header, footer, hero, project-grid) avec animations Motion
6. Pages (home, project, contact) — composition des widgets/features
7. Features (contact-form avec Resend, revalidation webhook)
8. Vercel Blob storage + media upload dans Payload
9. SEO (metadata, sitemap, JSON-LD)

**Cross-Component Dependencies:**
- Motion Provider (`shared/ui/`) → utilisé par tous les composants animés (widgets, features)
- Payload Config → définit les collections utilisées par entities (project, site-info)
- Tailwind Config → tokens design partagés par tous les composants
- Revalidation webhook → connecte Payload (CMS) au cache Next.js (frontend)
- Vercel Blob → connecte Payload upload au storage média

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**8 zones de conflit potentiel** identifiées où des agents IA pourraient faire des choix différents. Patterns ci-dessous pour garantir la cohérence.

### Naming Patterns

**Fichiers & Composants :**

| Élément | Convention | Exemple |
|---------|-----------|---------|
| Composants React (fichier) | PascalCase.tsx | `ProjectCard.tsx`, `HeroSection.tsx` |
| Slices FSD (dossier) | kebab-case | `contact-form/`, `project-grid/`, `site-info/` |
| Segments FSD (dossier) | noms FSD standard | `ui/`, `model/`, `api/`, `lib/`, `config/` |
| Fichiers non-composant | kebab-case.ts | `queries.ts`, `types.ts`, `use-scroll-animation.ts` |
| Variables / fonctions | camelCase | `getProjects()`, `projectSlug`, `isLoading` |
| Types / Interfaces | PascalCase | `Project`, `SiteInfo`, `ContactFormData` |
| Constantes | UPPER_SNAKE_CASE | `REVALIDATION_SECRET`, `DEFAULT_PAGE_SIZE` |
| CSS classes Tailwind custom | kebab-case | `text-brand-primary`, `bg-hero-gradient` |

**Payload Collections & Fields :**

| Élément | Convention | Exemple |
|---------|-----------|---------|
| Collection slug | kebab-case pluriel | `projects`, `site-info` |
| Field name | camelCase | `projectTitle`, `displayOrder`, `coverImage` |
| Relation field | camelCase + référent | `relatedProjects`, `featuredMedia` |
| Upload field | camelCase descriptif | `coverImage`, `galleryImages`, `videoFile` |

### Structure Patterns

**Pas de tests** — décision projet. Aucun framework de test, aucun dossier `__tests__/`, aucun fichier `*.test.*` ou `*.spec.*`.

**Organisation projet :** FSD strict (défini en Step 02). Chaque slice est autonome avec ses segments (`ui/`, `model/`, `api/`, `lib/`, `config/`).

**Assets statiques :**
- Fonts → `next/font` (pas de fichiers dans public/)
- Images statiques (logo, favicons) → `public/`
- Images de contenu (projets) → Vercel Blob via Payload upload
- Pas de dossier `assets/` ou `images/` dans `src/`

### Format Patterns

**Server Action Return Format (standardisé) :**

```typescript
// shared/model/action-result.ts
type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };
```

Toutes les Server Actions utilisent ce type de retour. Pas d'exceptions.

**Error Handling :**
- Server Actions → retournent `ActionResult` (jamais de throw côté action)
- Server Components → `error.tsx` par route (Next.js error boundary)
- Client Components → try/catch local + état d'erreur dans le composant
- Pas de try/catch génériques — erreurs typées et explicites

**Loading States :**

| Pattern | Fichier | Localisation FSD |
|---------|---------|-----------------|
| Loading par route | `app/*/loading.tsx` | Dans `app/` (routing) |
| Error boundary par route | `app/*/error.tsx` | Dans `app/` (routing), `"use client"` obligatoire |
| Not found | `app/not-found.tsx` | Dans `app/` (routing) |
| Suspense granulaire | `<Suspense>` inline | Dans Server Components (pages, widgets) |

### Communication Patterns

**Pas d'event system** — architecture simple sans pub/sub, WebSocket, ou event bus. Communication directe via :
- Payload Local API (Server Components → données)
- Server Actions (Client Components → mutations)
- On-demand revalidation (Payload → webhook → cache purge)

**State Management :**
- Zéro store global
- `useState` / `useActionState` uniquement dans Client Components
- Props drilling pour les données (arbre de composants peu profond)
- Server Components passent les données aux Client Components via props sérialisables

### Process Patterns

**Composition Server → Client (pattern obligatoire) :**

```typescript
// PATTERN : Server Component (data) → Client Component (interaction)

// entities/project/ui/ProjectCard.tsx (SERVER)
import { ProjectCardAnimated } from "./ProjectCardAnimated";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article>
      <ProjectCardAnimated
        title={project.title}
        imageUrl={project.image.url}
        slug={project.slug}
      />
    </article>
  );
}

// entities/project/ui/ProjectCardAnimated.tsx (CLIENT)
"use client";
import { m } from "motion/react";

export function ProjectCardAnimated({ title, imageUrl, slug }: Props) {
  return (
    <m.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
      {/* interactive UI */}
    </m.div>
  );
}
```

**Règle de nommage Client Components :** Suffixer avec le contexte interactif (`*Animated`, `*Interactive`, `*Form`) pour les distinguer des Server Components.

**Import Order (standardisé dans chaque fichier) :**

```typescript
// 1. Imports React / Next.js
import { Suspense } from "react";
import Image from "next/image";

// 2. Imports packages externes
import { m } from "motion/react";
import { z } from "zod";

// 3. Imports FSD (du layer le plus bas au plus haut)
import { ProjectCard } from "@/entities/project";
import { cn } from "@/shared/lib";

// 4. Imports relatifs (intra-slice)
import { type Project } from "../model/types";
```

**Environment Variables :**

```bash
# Infra
DATABASE_URL=
# CMS
PAYLOAD_SECRET=
# Services externes
RESEND_API_KEY=
# Interne
REVALIDATION_SECRET=
# Storage
BLOB_READ_WRITE_TOKEN=
# Public (exposées au client) — prefix NEXT_PUBLIC_
NEXT_PUBLIC_SITE_URL=
```

### Enforcement Guidelines

**Tous les agents IA DOIVENT :**
1. Respecter la hiérarchie FSD et les règles d'import strictes (Steiger + ESLint)
2. Utiliser les conventions de nommage ci-dessus sans exception
3. Séparer Server Components (data) et Client Components (interaction) via le pattern de composition
4. Utiliser `ActionResult<T>` pour toutes les Server Actions
5. Ne jamais créer de fichiers de test
6. Utiliser `@/` pour les imports inter-slices, chemins relatifs pour les imports intra-slice
7. Placer les animations Motion dans des Client Components leaf uniquement
8. Ne jamais importer directement depuis les fichiers internes d'un slice (toujours via `index.ts`)

**Vérification des patterns :**
- Steiger CLI : `npx steiger src/` — vérifie la structure FSD
- ESLint : `no-restricted-imports` — vérifie les public API
- TypeScript strict mode — vérifie les types
- Pas de CI automatisée — vérification locale avant push

## Project Structure & Boundaries

### Complete Project Directory Structure

> **NOTE :** Cette section reflète la structure réelle après les adaptations T0.
> Voir la section "Adaptations Architecture" du dev-plan.md pour l'historique des changements.

```
tia/
├── .env.local                          # Secrets (DATABASE_URL, PAYLOAD_SECRET, etc.)
├── .env.example                        # Template sans valeurs (commité)
├── .gitignore
├── eslint.config.mjs                   # ESLint flat config + FlatCompat + FSD rules
├── next.config.mjs                     # withPayload() wrapper (ESM requis par Payload)
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs                  # PostCSS pour Tailwind v4
├── steiger.config.ts                   # FSD linter config
├── tsconfig.json                       # strict, paths: { "@/*": ["./src/*"], "@payload-config": [...] }
│
├── public/                             # Assets statiques
│   ├── favicon.ico
│   ├── og-default.jpg                  # OG image par défaut (T12)
│   └── robots.txt                      # (T12)
│
├── pages/                              # VIDE — empêche Next.js Pages Router sur src/pages/
│   └── .gitkeep
│
└── src/
    ├── app/                            # FSD App Layer + Next.js routing combinés
    │   ├── (frontend)/                 # Route group frontend (thin re-exports UNIQUEMENT)
    │   │   ├── layout.tsx              # Root layout (html, body, metadata, providers, fonts)
    │   │   ├── page.tsx                # Re-export HomePage depuis src/pages/home
    │   │   ├── not-found.tsx           # Page 404
    │   │   ├── work/
    │   │   │   ├── page.tsx            # Re-export WorkPage (T9.5)
    │   │   │   └── [slug]/
    │   │   │       ├── page.tsx        # Re-export ProjectPage + generateMetadata (T8)
    │   │   │       ├── loading.tsx
    │   │   │       └── error.tsx
    │   │   ├── photography/
    │   │   │   └── page.tsx            # Re-export PhotographyPage (T9.6)
    │   │   └── contact/
    │   │       ├── page.tsx            # Re-export ContactPage (T9)
    │   │       └── loading.tsx
    │   │
    │   ├── (payload)/                  # Route group Payload CMS (convention officielle)
    │   │   ├── layout.tsx              # Payload admin layout
    │   │   ├── custom.scss             # Styles admin custom
    │   │   ├── admin/
    │   │   │   ├── importMap.js
    │   │   │   └── [[...segments]]/
    │   │   │       ├── page.tsx        # Payload Admin UI
    │   │   │       └── not-found.tsx
    │   │   └── api/
    │   │       ├── graphql/
    │   │       │   └── route.ts        # GraphQL API
    │   │       └── [...slug]/
    │   │           └── route.ts        # REST API
    │   │
    │   ├── providers/                  # FSD App segment
    │   │   ├── AppProviders.tsx        # MotionProvider + wrappers
    │   │   └── index.ts
    │   ├── styles/
    │   │   └── globals.css             # Tailwind v4 CSS-first tokens
    │   └── fonts/
    │       ├── index.ts                # next/font definitions
    │       ├── ClashDisplay-Bold.woff2
    │       ├── ClashDisplay-Medium.woff2
    │       └── ClashDisplay-Semibold.woff2
    │
    ├── pages/                          # Layer: Pages (composition)
    │   ├── home/
    │   │   ├── ui/
    │   │   │   └── HomePage.tsx        # Server Component — compose widgets
    │   │   └── index.ts                # export { HomePage }
    │   ├── project/
    │   │   ├── ui/
    │   │   │   └── ProjectPage.tsx     # Server Component — détail projet
    │   │   ├── api/
    │   │   │   └── metadata.ts         # generateMetadata + generateStaticParams
    │   │   └── index.ts
    │   ├── contact/
    │   │   ├── ui/
    │   │   │   └── ContactPage.tsx     # Server Component — page contact
    │   │   └── index.ts
    │   ├── work/                       # Découvert audit Framer (T9.5)
    │   │   ├── ui/
    │   │   │   └── WorkPage.tsx
    │   │   └── index.ts
    │   └── photography/                # Découvert audit Framer (T9.6)
    │       ├── ui/
    │       │   └── PhotographyPage.tsx
    │       └── index.ts
    │
    ├── widgets/                        # Layer: Widgets (blocs UI composés)
    │   ├── header/
    │   │   ├── ui/
    │   │   │   ├── Header.tsx          # Server Component — structure
    │   │   │   └── MobileMenuAnimated.tsx  # Client — menu burger animé
    │   │   └── index.ts
    │   ├── footer/
    │   │   ├── ui/
    │   │   │   └── Footer.tsx          # Server Component
    │   │   └── index.ts
    │   ├── hero/
    │   │   ├── ui/
    │   │   │   ├── Hero.tsx            # Server Component — structure
    │   │   │   └── HeroAnimated.tsx    # Client — animations scroll/parallax
    │   │   └── index.ts
    │   └── project-grid/
    │       ├── ui/
    │       │   ├── ProjectGrid.tsx     # Server Component — grille
    │       │   └── ProjectGridAnimated.tsx  # Client — animations stagger
    │       └── index.ts
    │
    ├── features/                       # Layer: Features (interactions)
    │   ├── contact-form/
    │   │   ├── ui/
    │   │   │   └── ContactForm.tsx     # Client — formulaire interactif
    │   │   ├── model/
    │   │   │   └── schema.ts           # Zod validation schema
    │   │   ├── api/
    │   │   │   └── send-email.ts       # Server Action → Resend
    │   │   └── index.ts
    │   └── project-publish/
    │       ├── api/
    │       │   └── revalidate.ts       # Server Action revalidation
    │       └── index.ts
    │
    ├── entities/                       # Layer: Entities (concepts métier)
    │   ├── project/
    │   │   ├── ui/
    │   │   │   ├── ProjectCard.tsx     # Server Component
    │   │   │   ├── ProjectCardAnimated.tsx  # Client — hover/reveal
    │   │   │   └── ProjectDetail.tsx   # Server Component — vue détail
    │   │   ├── model/
    │   │   │   └── types.ts            # Type Project (dérivé Payload)
    │   │   ├── api/
    │   │   │   └── queries.ts          # getProjects(), getProjectBySlug()
    │   │   └── index.ts
    │   └── site-info/
    │       ├── model/
    │       │   └── types.ts            # Type SiteInfo
    │       ├── api/
    │       │   └── queries.ts          # getSiteInfo()
    │       └── index.ts
    │
    ├── shared/                         # Layer: Shared (code réutilisable)
    │   ├── ui/
    │   │   ├── MotionProvider.tsx       # "use client" — LazyMotion wrapper
    │   │   └── index.ts
    │   ├── lib/
    │   │   ├── payload-client.ts       # getPayload() helper
    │   │   ├── cn.ts                   # clsx + twMerge utility
    │   │   └── index.ts
    │   ├── api/
    │   │   └── index.ts                # Payload client re-export
    │   ├── config/
    │   │   ├── site.ts                 # SITE_URL, SITE_NAME constantes
    │   │   └── index.ts
    │   └── model/                      # Nommé "model" (pas "types") — Steiger by-purpose
    │       ├── action-result.ts        # ActionResult<T> type
    │       └── index.ts
    │
    ├── collections/                    # Payload CMS collection definitions (hors FSD)
    │   └── Users.ts                    # Collection authentification admin
    │
    └── payload.config.ts               # Config Payload (collections, DB, plugins)
```

### Architectural Boundaries

**Boundary CMS (Payload) ↔ Frontend (FSD) :**
- Payload vit dans `src/app/(payload)/` — complètement isolé du frontend via route group
- `src/payload.config.ts` est dans src (convention officielle Payload)
- Collections Payload dans `src/collections/` (hors FSD, ignoré par Steiger)
- Les entities FSD accèdent à Payload via `shared/lib/payload-client.ts` → `getPayload()`
- Les types Payload générés (`payload-types.ts`) sont re-exportés dans `entities/*/model/types.ts`

**Boundary Server ↔ Client :**
- Server Components = default dans pages, widgets, entities
- Client Components = suffixes explicites (`*Animated`, `*Form`, `*Interactive`)
- Props sérialisables uniquement entre Server → Client (pas de fonctions, pas de Date objects)

**Boundary Data :**
- Lectures : `entities/*/api/queries.ts` → Payload Local API
- Mutations : `features/*/api/*.ts` → Server Actions
- Revalidation : `app/api/revalidate/route.ts` → webhook endpoint

### Requirements to Structure Mapping

| Requirement (PRD) | Localisation FSD |
|-------------------|-----------------|
| FR01-FR04 Homepage hero, sections | `widgets/hero/`, `pages/home/` |
| FR05-FR08 Navigation header/footer | `widgets/header/`, `widgets/footer/` |
| FR09-FR15 Grille projets | `widgets/project-grid/`, `entities/project/` |
| FR16-FR17 Page projet détail | `pages/project/`, `entities/project/ui/ProjectDetail` |
| FR18-FR19 Page contact | `pages/contact/`, `features/contact-form/` |
| FR20-FR23 Media optimization | `entities/project/ui/` (Next.js Image), Tailwind responsive |
| FR24-FR27 Animations Framer | `widgets/*/ui/*Animated.tsx`, `entities/*/ui/*Animated.tsx` |
| FR28-FR31 SEO | `pages/*/api/metadata.ts`, `src/app/(frontend)/sitemap.ts` |
| FR32-FR35 CMS Payload | `src/app/(payload)/`, `src/payload.config.ts`, `src/collections/` |
| FR36-FR41 Admin BO | `src/app/(payload)/admin/`, `features/project-publish/` |

### Data Flow

```
Visiteur → Vercel CDN → Static HTML (pre-built)
                 ↓ (cache miss ou revalidation)
           Next.js Server Component
                 ↓
           entities/*/api/queries.ts
                 ↓
           Payload Local API (getPayload())
                 ↓
           PostgreSQL

Admin Tianoa → src/app/(payload)/admin → Payload Admin UI
                 ↓ (afterChange hook)
           revalidation endpoint (T10)
                 ↓
           revalidatePath() → CDN purge
```

### External Integrations

| Service | Usage | Point d'intégration |
|---------|-------|-------------------|
| Vercel | Hosting + CDN | Deploy auto via Git |
| Vercel Blob | Media storage | `@payloadcms/storage-vercel-blob` dans `payload.config.ts` |
| PostgreSQL | Database | `@payloadcms/db-postgres` dans `payload.config.ts` |
| Resend | Email contact | `features/contact-form/api/send-email.ts` |

### File Organization Patterns

**Configuration Files :** À la racine (`next.config.mjs`, `steiger.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`). Exception : `payload.config.ts` dans `src/` (convention officielle Payload). Tailwind v4 = CSS-first dans `globals.css` (pas de `tailwind.config.ts`).

**Source Organization :** Tout dans `src/`. Routing Next.js dans `src/app/(frontend)/` (thin re-exports). FSD layers dans `src/pages|widgets|features|entities|shared`. Payload isolé dans `src/app/(payload)/`. Collections CMS dans `src/collections/`.

**Asset Organization :**
- `public/` : favicon, OG image par défaut, robots.txt
- Vercel Blob : tous les médias de contenu (images/vidéos projets)
- `next/font` : fonts (pas de fichiers dans public/)

### Development Workflow

**Dev Server :** `pnpm dev` → Next.js dev server + Payload admin accessible à `localhost:3000/admin`

**Build :** `pnpm build` → Next.js production build. Pages statiques générées au build. Payload migrations auto.

**Deploy :** Push sur `main` → Vercel auto-deploy. Preview deploys sur branches.

## Architecture Validation Results

### Coherence Validation

**Decision Compatibility :** Toutes les technologies sont compatibles. Next.js 15.5.12 + Payload 3.78.0 + PostgreSQL + Tailwind v4 + Motion v12 — aucun conflit de versions. Motion nécessite `"use client"`, aligné avec la stratégie Server Components par défaut + Client Components leaf.

**Pattern Consistency :** Les patterns FSD (import rules, public API, composition Server/Client) supportent toutes les décisions techniques. ActionResult<T> standardise les Server Actions. Conventions de nommage cohérentes partout.

**Structure Alignment :** La structure dual-folder (root `app/` + `src/` FSD) supporte l'isolation Payload dans `(cms)` et le routing thin re-export. Note : root `app/` = routing Next.js, `src/app/` = layer FSD d'initialisation — deux rôles distincts malgré le même nom.

### Requirements Coverage Validation

**Functional Requirements (41 FRs) :**

| FR Range | Status | Support Architecture |
|----------|--------|---------------------|
| FR1-FR6 Portfolio Showcase | ✅ | widgets/hero, widgets/project-grid, entities/project, pages/home, pages/project |
| FR7-FR11 Navigation & Layout | ✅ | widgets/header, widgets/footer, Tailwind breakpoints, App Router |
| FR12-FR15 Contact | ✅ | features/contact-form, Resend, Zod validation |
| FR16-FR19 Design & Animations | ✅ | Motion v12 (même moteur Framer), Tailwind tokens, next/font |
| FR20-FR23 Media | ✅ | Next.js Image, Vercel Blob, lazy loading |
| FR24-FR32 CMS | ✅ | src/app/(payload)/, src/payload.config.ts, src/collections/, revalidation webhook |
| FR33-FR38 SEO | ✅ | generateMetadata, sitemap.ts, JSON-LD, Server Components |
| FR39-FR41 Seed Scripts | ✅ | scripts/ à la racine (hors FSD — scripts one-shot) |

**Non-Functional Requirements (22 NFRs) :**

| NFR Range | Status | Support Architecture |
|-----------|--------|---------------------|
| NFR1-NFR9 Performance | ✅ | SSG + CDN edge, LazyMotion 4.6KB, Server Components, Next.js Image, next/font |
| NFR10-NFR16 Accessibilité | ✅ | WCAG 2.1 AA, HTML sémantique, Tailwind focus, Motion respecte prefers-reduced-motion nativement |
| NFR17-NFR22 Sécurité & Fiabilité | ✅ | Payload auth, HTTPS Vercel, honeypot, Vercel SLA 99.9%, backup PostgreSQL via provider managé |

### Gap Analysis Results

**Gaps résolus lors de la validation :**

1. **Scripts de seed (FR39-FR41)** — Ajout d'un dossier `scripts/` à la racine pour les scripts de migration one-shot (hors FSD)
2. **prefers-reduced-motion (NFR16)** — Motion v12 respecte nativement cette préférence CSS. Documenté dans les enforcement guidelines.
3. **Backup PostgreSQL (NFR22)** — Dépend du provider PostgreSQL managé (Neon, Supabase, Vercel Postgres). Backups automatiques inclus dans les services managés.

**Aucun gap critique restant.**

### Architecture Completeness Checklist

**Requirements Analysis :**
- [x] Contexte projet analysé en profondeur
- [x] Scale et complexité évalués
- [x] Contraintes techniques identifiées
- [x] Cross-cutting concerns mappés

**Architectural Decisions :**
- [x] Décisions critiques documentées avec versions
- [x] Stack technique complètement spécifiée
- [x] Patterns d'intégration définis
- [x] Performance considerations adressées

**Implementation Patterns :**
- [x] Conventions de nommage établies
- [x] Patterns structurels définis
- [x] Patterns de communication spécifiés
- [x] Patterns de process documentés

**Project Structure :**
- [x] Structure de dossiers complète et spécifique
- [x] Boundaries composants établies
- [x] Points d'intégration mappés
- [x] Mapping requirements → structure complet

**FSD Reference :**
- [x] 7 layers documentés avec règles d'import
- [x] Pattern dual-folder Next.js/FSD
- [x] Steiger + ESLint enforcement
- [x] Anti-patterns documentés

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High — toutes les validations passées, aucun gap critique.

**Key Strengths:**
- FSD exhaustivement documenté avec règles d'import, enforcement tools, et anti-patterns
- Motion = même moteur que Framer → migration directe sans reverse-engineering
- Architecture simple et prévisible : Server Components + Payload Local API + on-demand revalidation
- Stack éprouvée : Next.js 15.5 + Payload 3.78 — combo production-ready

**Areas for Future Enhancement:**
- Migration vers Next.js 16.2 stable quand disponible
- Upload chunked résilient pour connexion Tahiti (Phase 2)
- Analytics Plausible si souhaité (Phase 3)

### Implementation Handoff

**AI Agent Guidelines :**
- Suivre toutes les décisions architecturales exactement comme documentées
- Utiliser les patterns d'implémentation de façon cohérente sur tous les composants
- Respecter la structure projet et les boundaries
- Référencer ce document pour toute question architecturale
- Ne jamais créer de tests
- Toujours respecter la hiérarchie FSD et les règles d'import strictes

**First Implementation Priority :**

```bash
# Story 0 — Scaffold + Structure FSD
npx create-next-app@15.5.12 . --typescript --eslint --app --import-alias "@/*" --use-pnpm
pnpm add payload @payloadcms/next @payloadcms/db-postgres @payloadcms/richtext-lexical sharp graphql
pnpm add -D steiger @feature-sliced/steiger-plugin
```

Puis restructuration FSD dual-folder comme documenté dans la section "Project Structure & Boundaries".
