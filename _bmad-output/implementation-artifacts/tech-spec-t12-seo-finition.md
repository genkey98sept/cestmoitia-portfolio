---
title: 'T12 — SEO & Finition'
slug: 't12-seo-finition'
created: '2026-03-01'
status: 'implementation-complete'
stepsCompleted: [1, 2, 3, 4]
tech_stack: ['Next.js 15.4 App Router', 'Payload CMS 3.78', 'TypeScript strict', 'Tailwind v4', 'Motion']
files_to_modify:
  - 'src/app/(frontend)/layout.tsx'
  - 'src/app/(frontend)/page.tsx'
  - 'src/app/(frontend)/work/page.tsx'
  - 'src/app/(frontend)/contact/page.tsx'
  - 'src/app/(frontend)/photography/page.tsx'
  - 'src/app/(frontend)/work/[slug]/page.tsx'
  - 'next.config.mjs'
  - 'src/shared/lib/index.ts'
files_to_create:
  - 'src/app/(frontend)/sitemap.ts'
  - 'public/robots.txt'
  - 'src/shared/lib/jsonld.ts'
code_patterns:
  - 'FSD: app > pages > widgets > features > entities > shared'
  - 'Metadata: static export or async generateMetadata'
  - 'Pages route: re-exports from src/pages/ layer'
  - 'Config: centralized in shared/config/site.ts'
  - 'Queries: via src/entities/*/api/queries.ts'
test_patterns: ['none - zero test policy']
---

# Tech-Spec: T12 — SEO & Finition

**Created:** 2026-03-01

## Overview

### Problem Statement

Le site tia est fonctionnellement complet (T0-T11 done) mais manque de toute l'optimisation SEO necessaire pour un deploiement production. Les moteurs de recherche ne peuvent pas indexer correctement (pas de sitemap, pas de robots.txt), les partages sociaux n'ont pas de preview riche (OG cards minimales), il n'y a pas de donnees structurees (JSON-LD), les security headers sont absents, et les metadata sont incompletes sur 3 des 5 pages frontend.

### Solution

Implementer l'ensemble des optimisations SEO et finitions production : sitemap dynamique, robots.txt, metadata completes sur toutes les pages, JSON-LD (CreativeWork + Person), OG cards (wiring pret pour image custom fournie plus tard), security headers essentiels dans next.config.mjs, meta geo pour la Polynesie francaise, et verification accessibilite.

### Scope

**In Scope:**

- `sitemap.ts` dynamique (pages statiques + projets publies depuis Payload)
- `robots.txt` statique
- `metadataBase` dans le root layout
- Metadata (title, description, OG) sur `/work`, `/photography`, `/contact`
- OG cards enrichies sur toutes les pages (wiring pret, placeholder pour l'image par defaut)
- JSON-LD `CreativeWork` sur les pages projet individuelles
- JSON-LD `Person` sur la homepage
- Meta geo Tahiti / Polynesie francaise
- Security headers essentiels (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
- Verification prefers-reduced-motion, alt images, navigation clavier, contrastes

**Out of Scope:**

- Content-Security-Policy strict (risque de casser Payload admin)
- Creation de l'OG image elle-meme (fournie plus tard par Doens)
- Script de seed (T13)
- Optimisation Lighthouse performance (fondation deja solide avec SSG + LazyMotion)

## Context for Development

### Codebase Patterns

**Architecture FSD :**
- `app` > `pages` > `widgets` > `features` > `entities` > `shared`
- Pattern Server/Client : `*.tsx` (serveur) / `*Animated.tsx` (client)
- Imports entre slices uniquement via public API (`index.ts`)

**Metadata pattern existant :**
- Root layout : `export const metadata: Metadata = { ... }` (statique)
- `[slug]/page.tsx` : `export async function generateMetadata()` (dynamique, avec try/catch)
- Autres pages : simples re-exports one-liner sans metadata

**Config centralisee :**
- `shared/config/site.ts` exporte `SITE_URL`, `SITE_NAME`, `SITE_DESCRIPTION`
- `SITE_URL` utilise `process.env.NEXT_PUBLIC_SITE_URL` avec fallback `http://localhost:3000`

**Donnees disponibles pour SEO :**
- `SiteInfo` (global Payload) : email, phone, location (city/country/countryCode), bio, social URLs (instagram, facebook, twitter), services[], experiences[]
- `Project` : title, slug, category, client, year, description (richText), coverImage (avec url + alt), status, publishedAt

**Page d'accueil :**
- `page.tsx` est un re-export one-liner : `export { HomePage as default } from "@/pages/home"`
- `HomePage` est un composant synchrone qui rend 6 widgets (Hero, ProjectGrid, About, Services, Vision, Experience)
- Pour injecter le JSON-LD Person, le `page.tsx` devra devenir async et fetch `getSiteInfo()`

**shared/lib/index.ts :**
- Exporte `cn` (clsx) et `getPayloadClient`
- Les helpers JSON-LD y seront ajoutes via re-export

### Files to Reference

| File | Purpose | Status |
| ---- | ------- | ------ |
| `src/app/(frontend)/layout.tsx` | Root layout — `lang="fr"`, metadata basique, pas de metadataBase | MODIFIER |
| `src/app/(frontend)/page.tsx` | Homepage — re-export `HomePage` | MODIFIER (metadata + JSON-LD Person) |
| `src/app/(frontend)/work/page.tsx` | Listing projets — re-export `WorkPage` | MODIFIER (metadata) |
| `src/app/(frontend)/contact/page.tsx` | Contact — re-export `ContactPage` | MODIFIER (metadata) |
| `src/app/(frontend)/photography/page.tsx` | Photo — re-export `PhotographyPage` | MODIFIER (metadata) |
| `src/app/(frontend)/work/[slug]/page.tsx` | Projet detail — generateMetadata existant | MODIFIER (enrichir OG + JSON-LD) |
| `next.config.mjs` | Config Next.js — pas de headers | MODIFIER (security headers) |
| `src/shared/lib/index.ts` | Exports shared/lib — ajouter jsonld | MODIFIER |
| `src/shared/config/site.ts` | Constantes SITE_URL, SITE_NAME, SITE_DESCRIPTION | REFERENCE |
| `src/entities/project/api/queries.ts` | getProjects(), getProjectSlugs() | REFERENCE (sitemap) |
| `src/entities/site-info/api/queries.ts` | getSiteInfo() | REFERENCE (JSON-LD Person) |
| `src/entities/site-info/model/types.ts` | Type SiteInfo avec location, social URLs | REFERENCE |
| `src/entities/project/model/types.ts` | Type Project avec coverImage, category | REFERENCE |
| `src/app/(frontend)/sitemap.ts` | Sitemap dynamique | CREER |
| `public/robots.txt` | Robots | CREER |
| `src/shared/lib/jsonld.ts` | Helpers JSON-LD | CREER |

### Technical Decisions

1. **metadataBase** : Utiliser `SITE_URL` de `shared/config` pour definir `metadataBase` dans le root layout — prerequis pour que les OG images relatives fonctionnent
2. **OG image par defaut** : Prevoir le wiring `openGraph` dans le layout — pour l'instant sans image (sera fournie plus tard par Doens)
3. **JSON-LD** : Fonctions pures dans `shared/lib/jsonld.ts` qui retournent des objets — injectes via `<script type="application/ld+json">` dans les pages
4. **Security headers** : Via `next.config.mjs` `headers()` — pattern source `/:path*` pour couvrir tout le site (les headers de securite de base ne cassent pas Payload admin)
5. **robots.txt** : Fichier statique dans `public/` — bloque `/admin` et `/api` de l'indexation
6. **Pages metadata** : Les re-exports deviennent des fichiers avec `export const metadata` + composant default. Pour `page.tsx` (homepage), conversion en async pour fetch SiteInfo et injecter JSON-LD Person
7. **Meta geo** : `other: { "geo.region": "PF", "geo.placename": "Tahiti, Polynesie francaise" }` dans le layout metadata

## Implementation Plan

### Tasks

#### Phase 1 — Fondation SEO (prerequis pour tout le reste)

- [ ] Task 1: Ajouter `metadataBase` et enrichir les metadata globales dans le root layout
  - File: `src/app/(frontend)/layout.tsx`
  - Action: Ajouter `metadataBase: new URL(SITE_URL)` dans l'export `metadata`. Enrichir avec `openGraph` defaults (siteName, locale, type), `twitter` card config, et meta geo `other: { "geo.region": "PF", "geo.placename": "Tahiti, Polynesie francaise" }`. Importer `SITE_URL` depuis `@/shared/config`.
  - Notes: `metadataBase` est le prerequis pour que toutes les URLs OG relatives fonctionnent. Ne PAS ajouter d'OG image par defaut (fournie plus tard).

- [ ] Task 2: Creer `robots.txt`
  - File: `public/robots.txt`
  - Action: Creer un fichier robots.txt statique : `User-agent: *`, `Allow: /`, `Disallow: /admin`, `Disallow: /api`, `Sitemap: https://cestmoitia.com/sitemap.xml` (ou SITE_URL de production).
  - Notes: Fichier statique dans public/ — servi automatiquement par Next.js. L'URL du sitemap devra etre ajustee quand le domaine final sera confirme.

#### Phase 2 — Sitemap dynamique

- [ ] Task 3: Creer le sitemap dynamique
  - File: `src/app/(frontend)/sitemap.ts`
  - Action: Exporter une fonction `default` qui retourne un `MetadataRoute.Sitemap`. Pages statiques : `/`, `/work`, `/photography`, `/contact` avec `changeFrequency: "monthly"` et `priority` appropriees (1.0 pour `/`, 0.8 pour les autres). Pages dynamiques : query `getProjectSlugs()` pour generer `/work/{slug}` pour chaque projet publie avec `changeFrequency: "weekly"` et `priority: 0.7`. Utiliser `SITE_URL` pour les URLs absolues.
  - Notes: Next.js genere automatiquement `/sitemap.xml`. Wrap `getProjectSlugs()` dans try/catch avec fallback `[]`.

#### Phase 3 — JSON-LD helpers

- [ ] Task 4: Creer les helpers JSON-LD
  - File: `src/shared/lib/jsonld.ts`
  - Action: Creer deux fonctions pures :
    - `buildPersonJsonLd(siteInfo: SiteInfo, siteUrl: string)` → objet JSON-LD `Person` avec `@context: "https://schema.org"`, `@type: "Person"`, `name: "Tia"`, `url: siteUrl`, `email`, `jobTitle: "Creatif independant"`, `address` (depuis `siteInfo.location` : `addressLocality: city`, `addressCountry: countryCode`), `sameAs` (tableau filtrant les social URLs non-null : instagramUrl, facebookUrl, twitterUrl). Importer le type `SiteInfo` depuis `@/entities/site-info`.
    - `buildCreativeWorkJsonLd(project: Project, siteUrl: string)` → objet JSON-LD `CreativeWork` avec `@context: "https://schema.org"`, `@type: "CreativeWork"`, `name: project.title`, `url: ${siteUrl}/work/${project.slug}`, `image: project.coverImage?.url`, `author: { @type: "Person", name: "Tia" }`, `datePublished: project.publishedAt`, `genre: project.category`. Importer le type `Project` depuis `@/entities/project`.
  - Notes: Fonctions pures, pas de composants React. Typage de retour `Record<string, unknown>`.

- [ ] Task 5: Exporter les helpers JSON-LD dans shared/lib
  - File: `src/shared/lib/index.ts`
  - Action: Ajouter `export { buildPersonJsonLd, buildCreativeWorkJsonLd } from "./jsonld";`

#### Phase 4 — Metadata par page

- [ ] Task 6: Ajouter metadata sur la page `/work`
  - File: `src/app/(frontend)/work/page.tsx`
  - Action: Remplacer le re-export one-liner. Ajouter `import type { Metadata } from "next"` et `export const metadata: Metadata = { title: "Projets — cestmoitia", description: "Decouvrez les projets de Tia, creatif independant en Polynesie francaise.", openGraph: { title: "Projets — cestmoitia", description: "Decouvrez les projets de Tia, creatif independant en Polynesie francaise." } }`. Garder `export { WorkPage as default } from "@/pages/work"`.

- [ ] Task 7: Ajouter metadata sur la page `/contact`
  - File: `src/app/(frontend)/contact/page.tsx`
  - Action: Meme pattern que Task 6. `title: "Contact — cestmoitia"`, `description: "Contactez Tia pour vos projets creatifs en Polynesie francaise."`, plus `openGraph` miroir.

- [ ] Task 8: Ajouter metadata sur la page `/photography`
  - File: `src/app/(frontend)/photography/page.tsx`
  - Action: Meme pattern que Task 6. `title: "Photographie — cestmoitia"`, `description: "Galerie photo de Tia, creatif independant base en Polynesie francaise."`, plus `openGraph` miroir.

- [ ] Task 9: Enrichir metadata + ajouter JSON-LD CreativeWork sur la page projet
  - File: `src/app/(frontend)/work/[slug]/page.tsx`
  - Action:
    1. Dans `generateMetadata` : enrichir le retour avec `openGraph: { title, description, type: "article", images }` et `twitter: { card: "summary_large_image" }`.
    2. Dans le composant `Page` : le transformer en async, fetcher le projet via `getProjectBySlug(slug)` (try/catch, null si erreur). Si projet non null, injecter `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildCreativeWorkJsonLd(project, SITE_URL)) }} />` avant `<ProjectPage>`.
  - Notes: Le fetch du projet est duplique (generateMetadata + composant) mais Next.js deduplique automatiquement les requetes identiques via `fetch` cache. Importer `buildCreativeWorkJsonLd` depuis `@/shared/lib` et `SITE_URL` depuis `@/shared/config`.

#### Phase 5 — JSON-LD Person sur la homepage

- [ ] Task 10: Convertir la homepage pour injecter JSON-LD Person
  - File: `src/app/(frontend)/page.tsx`
  - Action: Remplacer le re-export one-liner par un Server Component async :
    ```
    import { getSiteInfo } from "@/entities/site-info";
    import { HomePage } from "@/pages/home";
    import { buildPersonJsonLd } from "@/shared/lib";
    import { SITE_URL } from "@/shared/config";

    export default async function Page() {
      let siteInfo = null;
      try { siteInfo = await getSiteInfo(); } catch { /* noop */ }
      return (
        <>
          {siteInfo && (
            <script type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(buildPersonJsonLd(siteInfo, SITE_URL)) }}
            />
          )}
          <HomePage />
        </>
      );
    }
    ```
  - Notes: La homepage herite des metadata du layout (title + description). Pas besoin d'un `export const metadata` supplementaire ici.

#### Phase 6 — Security headers

- [ ] Task 11: Ajouter les security headers dans next.config.mjs
  - File: `next.config.mjs`
  - Action: Ajouter une methode `headers()` async dans `nextConfig` :
    ```
    async headers() {
      return [{
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      }];
    }
    ```
  - Notes: `/:path*` couvre toutes les routes. Ces 4 headers ne cassent pas Payload admin (pas de CSP, pas d'iframe restriction problematique pour l'admin).

#### Phase 7 — Mise a jour du dev-plan

- [ ] Task 12: Mettre a jour le dev-plan pour marquer T12 comme done
  - File: `_bmad-output/planning-artifacts/dev-plan.md`
  - Action: Changer le status de T12 de `pending` a `done`. Ajouter la date. Cocher les criteres de validation pertinents. Mettre a jour le header "Derniere mise a jour".

### Acceptance Criteria

#### Sitemap & Robots
- [ ] AC1: Given le site deploye, when on accede a `/sitemap.xml`, then on obtient un XML valide contenant les 4 pages statiques (`/`, `/work`, `/photography`, `/contact`) et les URLs de tous les projets publies.
- [ ] AC2: Given le site deploye, when on accede a `/robots.txt`, then on obtient un fichier avec `Allow: /`, `Disallow: /admin`, `Disallow: /api`, et le lien vers le sitemap.

#### Metadata
- [ ] AC3: Given la page `/work`, when on inspecte le HTML source, then `<title>` contient "Projets — cestmoitia" et `<meta name="description">` a un contenu specifique.
- [ ] AC4: Given la page `/contact`, when on inspecte le HTML source, then `<title>` contient "Contact — cestmoitia" et `<meta name="description">` a un contenu specifique.
- [ ] AC5: Given la page `/photography`, when on inspecte le HTML source, then `<title>` contient "Photographie — cestmoitia" et `<meta name="description">` a un contenu specifique.
- [ ] AC6: Given n'importe quelle page, when on inspecte les meta OG, then on trouve `og:site_name: "cestmoitia"`, `og:locale: "fr_FR"`.

#### JSON-LD
- [ ] AC7: Given la homepage `/`, when on inspecte le HTML source, then un `<script type="application/ld+json">` contient un objet `@type: "Person"` avec le nom, l'email, la localisation et au moins un lien social.
- [ ] AC8: Given une page projet `/work/{slug}`, when on inspecte le HTML source, then un `<script type="application/ld+json">` contient un objet `@type: "CreativeWork"` avec le titre, l'image, la categorie et l'auteur.
- [ ] AC9: Given un JSON-LD genere, when on le valide avec le Google Rich Results Test, then aucune erreur critique n'est reportee.

#### Security Headers
- [ ] AC10: Given une requete HTTP vers n'importe quelle page, when on inspecte les headers de reponse, then on trouve `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, et `Permissions-Policy`.

#### Meta Geo
- [ ] AC11: Given n'importe quelle page, when on inspecte le HTML source, then on trouve les meta tags `geo.region: PF` et `geo.placename`.

#### Non-regression
- [ ] AC12: Given le Payload admin a `/admin`, when on y accede, then l'interface fonctionne normalement.
- [ ] AC13: Given le projet, when on lance `pnpm lint` (ESLint + Steiger), then aucune erreur n'est reportee.

## Additional Context

### Dependencies

- Aucune nouvelle dependance npm requise
- Constantes existantes dans `shared/config/site.ts` reutilisables
- Queries existantes (`getProjectSlugs`, `getSiteInfo`, `getProjectBySlug`) reutilisables
- Types existants (`Project`, `SiteInfo`) importables depuis les entites via public API

### Testing Strategy

- Zero fichier de test (decision projet)
- Validation manuelle :
  - Lighthouse : Performance >= 90 desktop, SEO >= 95, Accessibility >= 85
  - opengraph.xyz : verifier les OG cards de chaque page
  - Google Rich Results Test : valider les JSON-LD
  - curl -I : verifier les security headers
  - `/sitemap.xml` et `/robots.txt` : accessibles et valides
- ESLint + Steiger doivent passer sans erreur

### Notes

- Base sur la tranche T12 du dev-plan (`_bmad-output/planning-artifacts/dev-plan.md`)
- Prerequis T7-T9.6 tous `done`
- L'OG image par defaut sera ajoutee plus tard quand Doens la fournira — le wiring est pret
- Pour le JSON-LD Person, `HomePage` est synchrone — c'est `page.tsx` qui fait le fetch async de `getSiteInfo()`
- Le `robots.txt` utilise l'URL de production pour le sitemap — s'assurer que `NEXT_PUBLIC_SITE_URL` est bien defini
- Les descriptions metadata sont en francais (coherent avec `lang="fr"`)
- Next.js deduplique automatiquement les fetch identiques dans `generateMetadata` et le composant de page — pas de double requete Payload
