# Journal des Décisions de Réalignement

## Date: 2026-02-28
## Décideur: Doens

---

## Résumé

- Désalignements traités: 19
- Mises à jour documentation: 10
- Actions correctives code: 9

---

## Décisions détaillées

### [MF-001] Pages `/work` et `/photography` absentes du PRD
- **Sévérité:** 🔴 Critique
- **Décision:** [D] Mettre à jour la documentation
- **Justification:** Les pages sont implémentées et nécessaires — le PRD doit refléter la réalité
- **Artefact concerné:** PRD (prd.md)
- **Action spécifique:** Ajouter les pages `/work` (listing projets) et `/photography` (galerie photo) comme exigences fonctionnelles dans le PRD

### [MF-002] Curseur personnalisé non implémenté
- **Sévérité:** 🔴 Critique
- **Décision:** [C] Action corrective sur le code
- **Justification:** Le curseur custom est un élément distinctif du design Framer de référence
- **Artefact concerné:** Code — composant global ou CSS
- **Action spécifique:** Implémenter un curseur personnalisé reproduisant celui du site Framer (https://cestmoitia.framer.website/). Documenter dans l'audit Framer et l'architecture.

### [MF-003] Fond grillé/quadrillé non implémenté
- **Sévérité:** 🔴 Critique
- **Décision:** [C] Action corrective sur le code
- **Justification:** Le fond grillé est un élément visuel caractéristique du design Framer
- **Artefact concerné:** Code — globals.css ou composant de layout
- **Action spécifique:** Implémenter le motif quadrillé (grid pattern) sur le fond, reproduisant celui du site Framer. Documenter dans l'audit Framer.

### [MF-004] Bug `subDescription` richText jamais affiché
- **Sévérité:** 🔴 Critique
- **Décision:** [C] Action corrective sur le code
- **Justification:** Bug fonctionnel — le contenu saisi dans Payload n'est jamais rendu
- **Artefact concerné:** Code — `src/entities/project/ui/ProjectDetail.tsx`
- **Action spécifique:** Remplacer la condition `typeof === "string"` par un rendu Lexical approprié (composant RichText de Payload ou équivalent)

### [MA-001] Webhook de revalidation non implémenté
- **Sévérité:** 🟡 Important
- **Décision:** [D] Mettre à jour la documentation
- **Justification:** Travail planifié (T10 pending) — pas un désalignement, c'est du travail à venir
- **Artefact concerné:** Dev Plan (dev-plan.md)
- **Action spécifique:** Confirmer le statut pending de T10 dans la documentation

### [MA-002] Sitemap dynamique non implémenté
- **Sévérité:** 🟡 Important
- **Décision:** [D] Mettre à jour la documentation
- **Justification:** Travail planifié (T12 pending) — pas un désalignement
- **Artefact concerné:** Dev Plan (dev-plan.md)
- **Action spécifique:** Confirmer le statut pending de T12 dans la documentation

### [MA-003] Data model Payload plus riche que documenté
- **Sévérité:** 🟡 Important
- **Décision:** [D] Mettre à jour la documentation
- **Justification:** Le code est la réalité — l'architecture doit documenter le schéma réel
- **Artefact concerné:** Architecture (architecture.md)
- **Action spécifique:** Ajouter le schéma détaillé des collections Payload avec tous les champs implémentés (subProjects, subDescription, category, isFeatured, coverImage, projectImages, projectVideos, etc.)

### [MF-005] Vercel Blob Storage non intégré
- **Sévérité:** 🟡 Important
- **Décision:** [D] Mettre à jour la documentation
- **Justification:** Travail planifié (T11 pending) — pas un désalignement
- **Artefact concerné:** Dev Plan (dev-plan.md)
- **Action spécifique:** Confirmer le statut pending de T11

### [MF-006] Seed scripts non implémentés
- **Sévérité:** 🟡 Important
- **Décision:** [D] Mettre à jour la documentation
- **Justification:** Travail planifié (T13 pending) — pas un désalignement
- **Artefact concerné:** Dev Plan (dev-plan.md)
- **Action spécifique:** Confirmer le statut pending de T13

### [MF-007] SEO avancé non implémenté
- **Sévérité:** 🟡 Important
- **Décision:** [D] Mettre à jour la documentation
- **Justification:** Travail planifié (T12 pending) — pas un désalignement
- **Artefact concerné:** Dev Plan (dev-plan.md)
- **Action spécifique:** Confirmer le statut pending de T12

### [MT-001] Casts `as unknown as` dans les queries Payload
- **Sévérité:** 🟡 Important
- **Décision:** [C] Action corrective sur le code
- **Justification:** Type safety compromise — les types devraient être alignés
- **Artefact concerné:** Code — `src/entities/project/api/queries.ts`, `src/entities/site-info/api/queries.ts`
- **Action spécifique:** Aligner les types métier (`Project`, `SiteInfo`) avec les types générés par Payload pour éliminer les casts `as unknown as`

### [MT-002] Animations — timings et easing non documentés ni vérifiés
- **Sévérité:** 🟡 Important
- **Décision:** [C] Action corrective sur le code
- **Justification:** Fidélité au design Framer de référence — les animations doivent correspondre
- **Artefact concerné:** Code — tous les fichiers `*Animated.tsx` + Framer Audit
- **Action spécifique:** Inspecter les animations du site Framer, documenter les valeurs (durées, easing, délais), et ajuster les composants Motion pour correspondre

### [MA-004] Version Next.js divergente
- **Sévérité:** 🟢 Mineur
- **Décision:** [D] Mettre à jour la documentation
- **Justification:** La doc doit refléter la version réellement utilisée
- **Artefact concerné:** Architecture (architecture.md)
- **Action spécifique:** Corriger la version Next.js de 15.5.12 à 15.4.11

### [MU-002] Couleur #808080 codée en dur dans 7 fichiers
- **Sévérité:** 🟢 Mineur
- **Décision:** [C] Action corrective sur le code
- **Justification:** Maintenabilité — un design token est plus approprié
- **Artefact concerné:** Code — `globals.css` + 7 fichiers utilisant `#808080`
- **Action spécifique:** Créer un token CSS (ex. `--color-text-muted-secondary: #808080`) dans globals.css et remplacer toutes les occurrences hardcodées

### [MU-003] Typos dans le contenu
- **Sévérité:** 🟢 Mineur
- **Décision:** [C] Action corrective sur le code
- **Justification:** Aligner le contenu textuel avec le site Framer de référence
- **Artefact concerné:** Code — `ServicesAnimated.tsx`, `PhotographyPage.tsx`, `FooterAnimated.tsx`
- **Action spécifique:** Corriger : "donner vie vos projets" → "donner vie à vos projets", "Gallerie" → "Galerie", "Installe" → "Installé"

### [MU-004] Page 404 minimale
- **Sévérité:** 🟢 Mineur
- **Décision:** [C] Action corrective sur le code
- **Justification:** Reproduire la page 404 du site Framer pour cohérence visuelle
- **Artefact concerné:** Code — `src/app/(frontend)/not-found.tsx`
- **Action spécifique:** Refaire la page 404 avec le design cohérent du site Framer

### [MD-003] Checkboxes dev plan non mises à jour
- **Sévérité:** 🟢 Mineur
- **Décision:** [D] Mettre à jour la documentation
- **Justification:** Les checkboxes de validation doivent refléter l'état réel
- **Artefact concerné:** Dev Plan (dev-plan.md)
- **Action spécifique:** Cocher les checkboxes de validation pour toutes les tranches `done`

### [MD-004] Artefacts BMAD manquants
- **Sévérité:** 🟢 Mineur
- **Décision:** [D] Mettre à jour la documentation
- **Justification:** Noté pour référence, pas bloquant pour le développement actuel
- **Artefact concerné:** Checkpoint summary
- **Action spécifique:** Documenter les artefacts manquants comme recommandation future (UX Design, Stories, Project Context)

### [MD-005] Version Next.js dans l'architecture
- **Sévérité:** 🟢 Mineur
- **Décision:** [D] Mettre à jour la documentation
- **Justification:** Même correction que MA-004
- **Artefact concerné:** Architecture (architecture.md)
- **Action spécifique:** Corriger la version Next.js

---

## Actions correctives à planifier

| # | ID | Action | Priorité | Fichiers concernés |
|---|-----|--------|----------|-------------------|
| 1 | MF-002 | Implémenter curseur personnalisé | Haute | CSS global / composant dédié |
| 2 | MF-003 | Implémenter fond grillé/quadrillé | Haute | globals.css / layout |
| 3 | MF-004 | Corriger rendu richText Lexical subDescription | Haute | ProjectDetail.tsx |
| 4 | MT-001 | Aligner types Payload / types métier | Moyenne | queries.ts (project, site-info) |
| 5 | MT-002 | Documenter et ajuster animations Framer | Moyenne | *Animated.tsx + Framer Audit |
| 6 | MU-002 | Créer token CSS pour #808080 | Basse | globals.css + 7 fichiers |
| 7 | MU-003 | Corriger 3 typos | Basse | ServicesAnimated, PhotographyPage, FooterAnimated |
| 8 | MU-004 | Refaire page 404 | Basse | not-found.tsx |
