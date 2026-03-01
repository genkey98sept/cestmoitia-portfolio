# Analyse du Code Source

## Date: 2026-02-28

---

## Structure du projet

### Organisation

- **Type :** Monorepo (un seul package, pas de workspaces multi-packages)
- **Architecture :** Feature-Sliced Design (FSD)
- **Stack :** Next.js 15.4 App Router + Payload CMS 3.78 + PostgreSQL
- **Pattern FSD :** `app` → `pages` → `widgets` → `features` → `entities` → `shared`
- **Outils FSD :** ESLint (`no-restricted-imports`) + Steiger (`@feature-sliced/steiger-plugin`)

### Arborescence principale

```
tia/
├── src/
│   ├── app/                    # Next.js App Router + couche App FSD
│   │   ├── (frontend)/         # Route group frontend
│   │   │   ├── contact/
│   │   │   ├── photography/
│   │   │   ├── work/[slug]/
│   │   │   └── layout.tsx, page.tsx, not-found.tsx
│   │   ├── (payload)/          # Route group admin Payload CMS
│   │   │   ├── admin/[[...segments]]/
│   │   │   └── api/graphql/, api/[...slug]/
│   │   ├── fonts/              # Polices (Inter, ClashDisplay)
│   │   ├── providers/          # AppProviders (MotionProvider)
│   │   └── styles/             # globals.css (design tokens Tailwind v4)
│   ├── collections/            # Collections Payload (Users, Media, Projects)
│   ├── entities/               # Entités FSD (project, site-info)
│   │   ├── project/            # api/, model/, ui/
│   │   └── site-info/          # api/, model/
│   ├── features/               # Features FSD (contact-form, project-publish)
│   │   ├── contact-form/       # api/, model/, ui/
│   │   └── project-publish/
│   ├── globals/                # Globals Payload (SiteInfo)
│   ├── pages/                  # Pages FSD (home, work, project, contact, photography)
│   ├── shared/                 # Code partagé (api, config, lib, model, ui)
│   └── widgets/                # Widgets FSD (about, experience, footer, header, hero, project-grid, services, vision)
├── public/                     # Assets statiques (images)
├── scripts/                    # Scripts utilitaires (scrape-framer.ts)
├── _bmad/                      # Framework BMAD
└── _bmad-output/               # Outputs BMAD
```

### Points d'entrée

| Fichier | Rôle |
|---------|------|
| `src/app/(frontend)/layout.tsx` | Layout racine frontend (html, body, metadata, Header, Footer, AppProviders) |
| `src/app/(frontend)/page.tsx` | Page d'accueil (re-export de `HomePage`) |
| `src/app/(payload)/layout.tsx` | Layout admin Payload |
| `payload.config.ts` | Configuration Payload CMS |

**Pattern :** Les `page.tsx` du frontend font des re-exports depuis `src/pages/` (pattern FSD).

### Répartition des fichiers

| Extension | Nombre |
|-----------|--------|
| .ts | ~44 |
| .tsx | ~41 |
| .css | 1 |
| .scss | 1 |
| **Total src/** | **~87 fichiers** |

---

## Qualité du code

### Composants UI — Pattern « Server + Animated »

Chaque widget suit le pattern double :
- `*.tsx` — version serveur (data fetching, SSR)
- `*Animated.tsx` — version client (`'use client'`, animations Motion)

**31 composants UI** au total (hors layouts et pages de routing).

### Taille et complexité

| Fichier | Lignes | Complexité |
|---------|--------|------------|
| `PhotoGalleryAnimated.tsx` | 165 | Moyenne |
| `AboutAnimated.tsx` | 155 | Moyenne |
| `FooterAnimated.tsx` | 143 | Moyenne |
| `ServicesAnimated.tsx` | 137 | Moyenne |
| `HeroAnimated.tsx` | 125 | Moyenne |
| `ContactPage.tsx` | 122 | Moyenne |
| `ProjectDetail.tsx` | 114 | Moyenne |
| `ContactForm.tsx` | 108 | Faible |

**Aucun fichier ne dépasse 200 lignes.** Bonne granularité.

### Typage TypeScript

- **Aucun usage de `any`**
- **`strict: true`** dans tsconfig.json
- Interfaces explicites pour chaque composant (`SectionHeaderProps`, `AboutAnimatedProps`, etc.)
- Types métier dans `entities/*/model/types.ts`
- **Casts problématiques :** `as unknown as Project[]` et `as unknown as SiteInfo` dans les queries Payload → les types Payload ne sont pas alignés avec les types métier

### Conventions de nommage

- PascalCase pour les composants
- Suffixe `Animated` pour les variantes client
- Structure FSD stricte (entities, features, widgets, pages)
- `cn()` (clsx + tailwind-merge) défini mais peu utilisé

### Récupération de données

- **Server Components** pour le data fetching
- Pattern `try/catch` avec fallback silencieux (`null`, `[]`)
- `generateStaticParams` pour `/work/[slug]`
- `generateMetadata` pour le SEO des projets

### Accessibilité

- `aria-label`, `aria-expanded`, `aria-live`, `aria-hidden` utilisés
- Focus visible
- `useReducedMotion()` dans les composants animés
- Règle CSS `prefers-reduced-motion` dans globals.css

### Points positifs

1. Architecture FSD bien structurée
2. TypeScript strict, aucun `any`
3. Aucun `console.log`, TODO, FIXME
4. Bonne séparation serveur/client
5. LazyMotion pour la performance
6. Validation Zod pour le formulaire
7. Honeypot anti-spam
8. SEO avec generateMetadata

### Problèmes identifiés

#### Bug : `subDescription` non affiché (ProjectDetail.tsx)

```typescript
{typeof sub.subDescription === "string" && sub.subDescription.length > 0 && (
  <p>...</p>
)}
```

`subDescription` est un champ richText (Lexical) dans Payload → c'est un objet JSON, pas une chaîne. La condition est toujours fausse et le contenu n'est jamais rendu.

#### Valeurs codées en dur

- **Couleur `#808080`** utilisée dans 7 fichiers au lieu d'un design token : `SectionHeader.tsx`, `HeroAnimated.tsx`, `ExperienceAnimated.tsx`, `FooterAnimated.tsx`, `ProjectDetail.tsx`, `ContactPage.tsx`, `WorkPage.tsx`
- **Email `cestmoitia@gmail.com`** dans `ContactPage.tsx` et `send-email.ts`
- **URL X/Twitter** dans `FooterAnimated.tsx`
- **Texte statique** (localisation, descriptions) directement dans `HeroAnimated.tsx`

#### Typos

- `ServicesAnimated.tsx` : "donner vie vos projets" → "donner vie **à** vos projets"
- `PhotographyPage.tsx` : "Gallerie" → "Galerie"
- `FooterAnimated.tsx` : "Installe" → "Installé"

#### Page 404 minimale

`not-found.tsx` très basique, sans mise en page ni styles cohérents avec le reste du site.

#### Gestion d'erreurs

- Pattern try/catch avec fallback silencieux (pas de logging)
- Messages d'erreur génériques pour le formulaire de contact
- Pas de monitoring d'erreurs

#### `shared/api/index.ts` vide

Fichier présent mais contient uniquement un commentaire.

---

## Stack technique et dépendances

### Framework et runtime

| Élément | Version |
|---------|---------|
| Next.js | 15.4.11 |
| React | 19.2.3 |
| TypeScript | 5.9.3 |
| Node.js | ES2022 target |

### Dépendances principales

| Package | Version | Rôle |
|---------|---------|------|
| `payload` | 3.78.0 | CMS headless |
| `@payloadcms/db-postgres` | 3.78.0 | Base de données |
| `@payloadcms/richtext-lexical` | 3.78.0 | Éditeur richtext |
| `motion` | 12.34.3 | Animations |
| `resend` | 6.9.3 | Envoi d'emails |
| `zod` | 4.3.6 | Validation |
| `clsx` + `tailwind-merge` | 2.1.1 / 3.5.0 | Utilitaires CSS |
| `sharp` | 0.34.5 | Traitement d'images |
| `graphql` | 16.13.0 | GraphQL |

### DevDependencies

| Package | Version | Rôle |
|---------|---------|------|
| `tailwindcss` | 4.2.0 | CSS framework |
| `@tailwindcss/postcss` | 4.2.0 | PostCSS plugin |
| `eslint` | 9.39.3 | Linting |
| `eslint-config-next` | 15.4.11 | Règles Next.js |
| `steiger` | 0.5.11 | Validation FSD |
| `@feature-sliced/steiger-plugin` | 0.5.7 | Plugin FSD |
| `@playwright/test` | 1.58.2 | E2E (scraping uniquement) |
| `tsx` | 4.21.0 | Exécution TS |

### Points d'attention

| Élément | Observation |
|---------|-------------|
| **Zod v4** | En version majeure récente (v4) — surveiller la stabilité |
| **Playwright** | Présent mais sans `playwright.config.ts` — utilisé uniquement pour le script de scraping Framer, pas pour des tests E2E |
| **Tailwind v4** | Configuration CSS-first (pas de fichier config JS/TS) |

### Configuration build

- `next.config.mjs` : `withPayload` wrapper, extension aliases (.js → .ts/.tsx)
- `postcss.config.mjs` : `@tailwindcss/postcss`
- `steiger.config.ts` : Ignores pour `app/`, `collections/`, `globals/`

### Variables d'environnement

Attendues (d'après `.env.example`) : `DATABASE_URL`, `PAYLOAD_SECRET`, `RESEND_API_KEY`, `REVALIDATION_SECRET`, `BLOB_READ_WRITE_TOKEN`, `NEXT_PUBLIC_SITE_URL`

---

## Historique Git

### Vue d'ensemble

- **Contributeur unique :** Hugo Doens (37 commits)
- **Branche unique :** `main` (historique linéaire)
- **Derniers 10 commits :** 76 fichiers modifiés, 4702 insertions, 153 suppressions

### Chronologie des commits

Tous les commits datent du **28 février 2026**, répartis en deux sessions :

**Session 1 (~16h)** — Fondations :
- Scaffold FSD, scraper Framer, docs planning
- Collections Payload, entités (project, site-info)
- Architecture et dev plan

**Session 2 (~19h28-19h32)** — Frontend complet :
- Dépendances (motion, resend, zod)
- Shared components (SectionHeader)
- Widgets : header, footer, hero, project-grid, about, services, vision, experience
- Pages : home, work, project, contact, photography
- Dev plan mis à jour, workflow dev-checkpoint

### Patterns observés

- Commits conventionnels (`feat()`, `chore()`, `docs()`)
- Construction incrémentale (shared → entities → widgets → pages)
- Développement rapide (projet entier en une journée)

---

## Dette technique identifiée

### Priorité Haute

| # | Problème | Impact |
|---|----------|--------|
| 1 | **Bug `subDescription` richText** : condition `typeof === "string"` toujours fausse pour un champ Lexical | Contenu non affiché |

### Priorité Moyenne

| # | Problème | Impact |
|---|----------|--------|
| 2 | **Couleur `#808080` codée en dur** dans 7 fichiers | Maintenabilité, incohérence design |
| 3 | **Casts `as unknown as`** dans les queries Payload | Type safety compromise |
| 4 | **Typos dans le contenu** (3 occurrences) | Qualité perçue |
| 5 | **Erreurs silencieuses** (try/catch sans logging) | Difficulté de debug |

### Priorité Basse

| # | Problème | Impact |
|---|----------|--------|
| 6 | **Emails/URLs codés en dur** au lieu de config/SiteInfo | Maintenabilité |
| 7 | **Texte statique** dans les composants | Pas d'i18n, modification = code change |
| 8 | **Page 404 minimale** | Expérience utilisateur |
| 9 | **`shared/api/index.ts` vide** | Code mort |
| 10 | **Playwright sans config E2E** | Pas de tests automatisés |
| 11 | **`cn()` défini mais peu utilisé** | Classes conditionnelles non optimisées |

---

## Métriques clés

| Métrique | Valeur |
|----------|--------|
| Nombre de fichiers src/ | ~87 |
| Composants UI | 31 |
| Pages frontend | 6 (home, work, project, contact, photography, 404) |
| Collections Payload | 3 (Users, Media, Projects) |
| Globals Payload | 1 (SiteInfo) |
| Langages principaux | TypeScript, TSX |
| Framework CSS | Tailwind v4 |
| Fichiers > 200 lignes | 0 |
| Usage de `any` | 0 |
| TODO/FIXME/HACK | 0 |
| `console.log` | 0 |
| Couverture de tests | 0% (aucun test) |
| Zones critiques identifiées | 5 (haute + moyenne priorité) |
