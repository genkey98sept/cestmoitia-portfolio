# Diagnostic des Désalignements

## Date: 2026-02-28

---

## Résumé

- Désalignements totaux identifiés: **19**
- 🔴 Critiques: **4**
- 🟡 Importants: **8**
- 🟢 Mineurs: **7**

---

## 1. Architecture

### [MA-001] Webhook de revalidation non implémenté
- **Sévérité:** 🟡 Important
- **Prévu (doc):** L'architecture décrit un endpoint `app/api/revalidate/route.ts` pour la revalidation on-demand après modification de contenu dans Payload. Tranche T10 du dev plan.
- **Réel (code):** Aucun fichier `revalidate/route.ts` n'existe. Le `REVALIDATION_SECRET` est dans `.env.example` mais le endpoint n'est pas implémenté.
- **Impact:** Les modifications de contenu dans Payload ne déclenchent pas de mise à jour du cache ISR/SSG — les pages restent en cache jusqu'au prochain build.

### [MA-002] Sitemap dynamique non implémenté
- **Sévérité:** 🟡 Important
- **Prévu (doc):** L'architecture mentionne `src/app/(frontend)/sitemap.ts` dans le mapping FR34. Tranche T12 du dev plan.
- **Réel (code):** Aucun fichier `sitemap.ts` n'existe dans le projet.
- **Impact:** SEO — pas de sitemap.xml dynamique pour l'indexation par les moteurs de recherche.

### [MA-003] Data model Payload plus riche que documenté
- **Sévérité:** 🟡 Important
- **Prévu (doc):** L'architecture cite les collections (projects, site-info, users, media) sans schéma détaillé des champs, types, contraintes ou relations.
- **Réel (code):** Le code implémente des champs spécifiques non documentés : `subProjects` (avec `subTitle`, `subDescription` en richText, `subMedia`), `category` enum, `order` numérique, `isFeatured`, champs `coverImage`/`projectImages`/`projectVideos` distincts. La collection `Projects` a un schéma bien plus complexe que ce que la doc suggère.
- **Impact:** Impossible de vérifier la conformité du data model par rapport à la doc. Les développeurs futurs n'ont pas de référence documentée.

### [MA-004] Version Next.js divergente
- **Sévérité:** 🟢 Mineur
- **Prévu (doc):** L'architecture documente Next.js 15.5.12.
- **Réel (code):** Le code utilise Next.js 15.4.11 (package.json).
- **Impact:** Faible — versions proches, pas de breaking changes connu. La doc n'est simplement pas à jour.

---

## 2. Fonctionnel

### [MF-001] Pages `/work` et `/photography` absentes du PRD
- **Sévérité:** 🔴 Critique
- **Prévu (doc):** Le PRD ne mentionne que 3 pages frontend : Homepage, Page projet individuelle, Page contact. Pas de mention de `/work` (listing projets) ni `/photography` (galerie photo).
- **Réel (code):** Les deux pages sont implémentées (`WorkPage.tsx`, `PhotographyPage.tsx`), routées via `app/(frontend)/work/page.tsx` et `app/(frontend)/photography/page.tsx`, et référencées dans le dev plan (T9.5, T9.6).
- **Impact:** Le PRD n'est plus une source de vérité pour le périmètre fonctionnel du projet. Des fonctionnalités existent dans le code sans exigences formelles correspondantes.

### [MF-002] Curseur personnalisé non implémenté
- **Sévérité:** 🔴 Critique
- **Prévu (doc):** Le site Framer de référence utilise un curseur personnalisé (confirmé par le développeur). Aucun artefact BMAD ne le documente (absent de l'audit Framer, du PRD, et de l'architecture).
- **Réel (code):** Aucune implémentation de curseur custom dans le code. Le curseur par défaut du navigateur est utilisé.
- **Impact:** Divergence visuelle majeure avec le design de référence. Le développeur a confirmé cette préoccupation.

### [MF-003] Fond grillé/quadrillé non implémenté
- **Sévérité:** 🔴 Critique
- **Prévu (doc):** Le site Framer de référence a un fond avec motif quadrillé (grid pattern) au lieu d'un fond noir uni (confirmé par le développeur). Aucun artefact BMAD ne le documente.
- **Réel (code):** Le fond est noir uni (`--color-bg: #0a0a0a` dans globals.css). Aucun motif quadrillé n'est implémenté.
- **Impact:** Divergence visuelle significative avec le design de référence.

### [MF-004] Bug subDescription richText jamais affiché
- **Sévérité:** 🔴 Critique
- **Prévu (doc):** Les sous-projets ont une `subDescription` richText (Lexical) dans Payload CMS.
- **Réel (code):** `ProjectDetail.tsx` teste `typeof sub.subDescription === "string"` — or Lexical retourne un objet JSON, donc la condition est toujours fausse et le contenu n'est jamais rendu.
- **Impact:** Du contenu saisi par l'utilisateur dans le back-office n'est jamais affiché côté frontend.

### [MF-005] Vercel Blob Storage non intégré
- **Sévérité:** 🟡 Important
- **Prévu (doc):** L'architecture mentionne `@payloadcms/storage-vercel-blob` pour le stockage des médias. FR22 du PRD. Tranche T11 du dev plan (pending).
- **Réel (code):** Aucune dépendance `@payloadcms/storage-vercel-blob` dans package.json. Les médias sont gérés localement par Payload.
- **Impact:** Le déploiement en production (Vercel) ne fonctionnera pas pour les médias sans cette intégration.

### [MF-006] Seed scripts non implémentés
- **Sévérité:** 🟡 Important
- **Prévu (doc):** FR39-FR41 du PRD. Tranche T13 du dev plan (pending). Le dossier `scripts/` est documenté dans l'architecture.
- **Réel (code):** Seul `scripts/scrape-framer.ts` existe (pour le scraping). Aucun script de seed pour Payload.
- **Impact:** La migration des données (projets, médias) ne peut pas être automatisée.

### [MF-007] SEO avancé non implémenté (JSON-LD, OG cards)
- **Sévérité:** 🟡 Important
- **Prévu (doc):** FR35 (OG/Twitter cards), FR36 (JSON-LD Portfolio/CreativeWork), FR38 (SEO local). Tranche T12 du dev plan (pending).
- **Réel (code):** `generateMetadata` implémenté pour les pages projet (titre, description). Pas de JSON-LD, pas d'OG cards enrichis, pas de SEO local structuré.
- **Impact:** SEO limité à des metadata basiques. Les rich snippets Google ne fonctionneront pas.

---

## 3. UX/UI

### [MU-001] Design pixel-perfect non atteint
- **Sévérité:** 🟡 Important
- **Prévu (doc):** FR16 du PRD : « design pixel-perfect du site Framer ». L'audit Framer fournit les design tokens et le contenu textuel mais manque de détails sur les animations et micro-interactions.
- **Réel (code):** Le développeur confirme que le front-end ne ressemble pas encore exactement au design voulu. Multiples détails visuels divergent (curseur, fond, animations).
- **Impact:** L'objectif principal du projet (reproduire fidèlement le site Framer) n'est pas encore atteint.

### [MU-002] Couleur #808080 codée en dur dans 7 fichiers
- **Sévérité:** 🟢 Mineur
- **Prévu (doc):** L'audit Framer définit une palette de design tokens. L'architecture prévoit des design tokens dans globals.css.
- **Réel (code):** La couleur `#808080` est utilisée en dur dans 7 fichiers (SectionHeader, HeroAnimated, ExperienceAnimated, FooterAnimated, ProjectDetail, ContactPage, WorkPage) au lieu d'utiliser un token CSS comme `--color-text-muted`.
- **Impact:** Maintenabilité réduite. Modification du design = changement dans 7 fichiers au lieu d'un seul token.

### [MU-003] Typos dans le contenu
- **Sévérité:** 🟢 Mineur
- **Prévu (doc):** L'audit Framer fournit le contenu textuel exact.
- **Réel (code):** 3 typos détectées : "donner vie vos projets" (manque "à"), "Gallerie" (→ "Galerie"), "Installe" (→ "Installé").
- **Impact:** Qualité perçue réduite.

### [MU-004] Page 404 minimale
- **Sévérité:** 🟢 Mineur
- **Prévu (doc):** Le site Framer a une page 404. L'audit Framer couvre 11 pages dont le 404.
- **Réel (code):** `not-found.tsx` est très basique (titre + paragraphe), sans design cohérent avec le reste du site.
- **Impact:** Expérience utilisateur dégradée sur les pages inexistantes.

---

## 4. Stack/Technique

### [MT-001] Casts de types `as unknown as` dans les queries Payload
- **Sévérité:** 🟡 Important
- **Prévu (doc):** L'architecture documente des types métier dans `entities/*/model/types.ts` et un pattern de typage strict.
- **Réel (code):** Les queries Payload utilisent `as unknown as Project[]` et `as unknown as SiteInfo` — contournement du typage pour adapter les types Payload aux types métier.
- **Impact:** Type safety compromise. Les erreurs de mapping entre types Payload et types métier ne seront pas détectées à la compilation.

### [MT-002] Animations — timings et easing non documentés ni implémentés fidèlement
- **Sévérité:** 🟡 Important
- **Prévu (doc):** FR17 du PRD : « toutes les animations et transitions du site Framer ». L'audit Framer mentionne des animations mais sans durées, courbes d'easing ni délais précis.
- **Réel (code):** Les composants `*Animated.tsx` implémentent des animations Motion, mais sans référence documentée aux valeurs exactes du site Framer. La fidélité des animations est invérifiable.
- **Impact:** Impossible de valider que les animations correspondent à la référence. Probable divergence visuelle.

---

## 5. Documentation

### [MD-001] PRD obsolète — ne reflète pas le périmètre réel
- **Sévérité:** 🔴 Critique (même que MF-001)
- **Prévu (doc):** Le PRD devrait être la source de vérité pour le périmètre fonctionnel.
- **Réel (code):** Le PRD ne mentionne pas les pages `/work` et `/photography`, la page contact est non figée, l'upload chunked est incohérent (MVP vs Phase 2).
- **Impact:** Le PRD ne peut pas être utilisé comme référence fiable pour valider la complétude du développement.

### [MD-002] Framer Audit incomplet — éléments visuels majeurs manquants
- **Sévérité:** 🟡 Important (même que MF-002 et MF-003)
- **Prévu (doc):** L'audit Framer devrait capturer tous les éléments visuels du site de référence.
- **Réel (code):** Curseur personnalisé, fond grillé, timings d'animation, détails du carousel, et plusieurs micro-interactions ne sont pas documentés.
- **Impact:** Le développeur ne peut pas reproduire fidèlement le design sans ces informations.

### [MD-003] Dev Plan — checkboxes de validation non mises à jour
- **Sévérité:** 🟢 Mineur
- **Prévu (doc):** Les checkboxes de validation de chaque tranche devraient refléter l'état réel.
- **Réel (code):** Les checkboxes de T0 sont toujours à `[ ]` alors que la tranche est marquée `done`.
- **Impact:** Confiance réduite dans le suivi d'avancement.

### [MD-004] Artefacts BMAD manquants (UX Design, Stories, Project Context)
- **Sévérité:** 🟢 Mineur
- **Prévu (doc):** Un projet BMAD complet devrait avoir un UX Design, des Epics & Stories, et un Project Context.
- **Réel (code):** Ces artefacts n'existent pas. Le dev plan sert de substitut aux stories, l'audit Framer sert de substitut au UX Design.
- **Impact:** Traçabilité réduite. Pas de référence formelle pour le design system ni pour les critères d'acceptation par fonctionnalité.

### [MD-005] Architecture — version Next.js non à jour
- **Sévérité:** 🟢 Mineur
- **Prévu (doc):** L'architecture documente Next.js 15.5.12.
- **Réel (code):** Le code utilise Next.js 15.4.11.
- **Impact:** Incohérence mineure dans la documentation de référence.

---

## Alignements confirmés

Les zones suivantes sont correctement alignées entre la documentation et le code :

| Zone | Détail |
|------|--------|
| **Architecture FSD** | La structure Feature-Sliced Design est correctement implémentée selon la documentation : layers (app, pages, widgets, features, entities, shared), public API via index.ts, règles d'import respectées |
| **Pattern Server/Client** | Le pattern double `*.tsx` (serveur) / `*Animated.tsx` (client) est cohérent avec la documentation architecturale |
| **Stack technique principale** | Next.js 15.x, Payload CMS 3.78, PostgreSQL, React 19, TypeScript strict, Tailwind v4, Motion — tout aligné |
| **Collections Payload** | Users, Media, Projects — les 3 collections prévues existent (même si le schéma détaillé n'est pas documenté) |
| **Global SiteInfo** | Implémenté comme prévu dans l'architecture |
| **Route groups** | `(frontend)` et `(payload)` correctement séparés |
| **ESLint FSD** | Règles `no-restricted-imports` pour forcer les imports via public API |
| **Steiger FSD** | Configuré avec les exclusions correctes (app, collections, globals) |
| **Design tokens** | Couleurs, typographies (Clash Display + Inter), breakpoints (390/810/1440) implémentés dans globals.css |
| **Formulaire de contact** | Implémenté avec validation Zod, honeypot anti-spam, envoi via Resend |
| **SEO basique** | `generateMetadata` et `generateStaticParams` implémentés pour les pages projet |
| **Accessibilité** | `aria-*` attributes, `useReducedMotion`, `prefers-reduced-motion` CSS |
| **LazyMotion** | Performance optimisée pour les animations comme prévu |
| **Toutes les pages prévues** | Homepage, projet détail, contact, work, photography — toutes implémentées |
| **Dev Plan avancement** | Les tranches marquées `done` correspondent au code existant |
