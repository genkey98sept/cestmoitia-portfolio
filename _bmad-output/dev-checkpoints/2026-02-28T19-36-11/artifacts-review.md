# Revue des Artefacts BMAD

## Date: 2026-02-28

---

## Artefacts analysés

| # | Artefact | Emplacement | Date | Type |
|---|----------|-------------|------|------|
| 1 | Product Brief | planning-artifacts/product-brief-tia-2026-02-28.md | 28/02/2026 11:26 | Product Brief |
| 2 | PRD | planning-artifacts/prd.md | 28/02/2026 12:02 | PRD |
| 3 | Architecture | planning-artifacts/architecture.md | 28/02/2026 15:30 | Architecture |
| 4 | Dev Plan | planning-artifacts/dev-plan.md | 28/02/2026 17:14 | Dev Plan |
| 5 | Framer Audit | planning-artifacts/framer-audit.md | 28/02/2026 14:36 | Audit Design |

---

## Analyse par artefact

### 1. Product Brief

- **Complétude:** 8.5/10
- **Clarté:** 9/10 — Descriptions précises, peu d'ambiguïtés
- **Cohérence interne:** 9/10 — Vision, solution, scope et métriques alignés
- **Niveau de détail:** 8/10 — Suffisant pour démarrer le PRD
- **Maturité:** 8/10 — Quasi finalisé

**Points forts:**
- Executive Summary clair : migration Framer → Next.js
- Problem Statement bien défini (dépendance Framer, bugs, SEO, perf)
- 4 personas détaillés (3 primaires + 1 secondaire)
- Success Metrics mesurables (Lighthouse, CWV)
- MVP Scope bien délimité avec Out of Scope explicite
- User Journey Prospect décrit étape par étape

**Lacunes identifiées:**
- Section « Constraints » absente (budget, délais, ressources)
- Risques non documentés (qualité scraping, complexité animations)
- Hypothèses non formalisées
- Value Proposition Canvas absent
- Page contact non figée (« formulaire ou liens — à confirmer selon audit »)
- Blob storage non précisé (Vercel Blob ? S3 ?)

**Recommandations:**
- Ajouter section Constraints et Risques
- Clarifier la solution page contact
- Préciser le stockage des médias

---

### 2. PRD

- **Complétude:** 7.5/10
- **Clarté:** 8/10 — FR/NFR numérotés et testables
- **Cohérence interne:** 7.5/10 — Quelques incohérences (upload chunked, pages manquantes)
- **Niveau de détail:** 7/10 — Insuffisant pour les animations et le pixel-perfect
- **Maturité:** 7.5/10 — Structure professionnelle mais lacunes significatives

**Points forts:**
- 41 Functional Requirements (FR1-FR41) bien structurés
- 22 Non-Functional Requirements complets (performance, accessibilité, sécurité)
- User Journeys détaillés avec personas et scénarios
- Success Criteria mesurables (Lighthouse, LCP, CLS, INP)
- Référence Framer explicite
- Must-Have Justification par feature
- Risk Mitigation documenté
- Contexte Tahiti intégré (CDN, upload, SEO local)

**Lacunes identifiées:**
- **Pages `/work` et `/photography` absentes du PRD** (découvertes post-audit, implémentées dans le code)
- User stories au format standard absentes
- Acceptance criteria explicites par feature absents
- Liste des animations à reproduire non fournie
- Protocole de validation pixel-perfect non défini
- Upload chunked : incohérence MVP vs Phase 2 (FR29 vs scope)
- Page contact non figée
- Section Constraints dédiée absente
- Glossaire absent

**Recommandations:**
- Mettre à jour le PRD avec les pages `/work` et `/photography`
- Ajouter des acceptance criteria par FR
- Définir un protocole pixel-perfect (comparaison visuelle, outils, seuils)
- Lister les animations à reproduire ou référencer l'audit Framer
- Clarifier l'upload chunked (MVP ou Phase 2)

---

### 3. Architecture

- **Complétude:** 8.5/10
- **Clarté:** 9/10 — Très clair, quelques références T non expliquées
- **Cohérence interne:** 9/10 — Décisions architecturales cohérentes
- **Niveau de détail:** 8/10 — Très détaillé pour FSD, moins pour data model
- **Maturité:** 8.5/10 — Prêt pour implémentation

**Points forts:**
- FSD parfaitement documenté : hiérarchie, règles d'import, segments, public API
- Table de compatibilité des versions
- Patterns Server/Client Component bien décrits
- `ActionResult<T>` documenté
- Mapping FR/NFR → structure FSD
- Arborescence détaillée avec dual-folder Next.js/FSD
- Justification des choix techniques
- Guidelines pour agents IA

**Lacunes identifiées:**
- **Data model incomplet** : collections citées sans schéma détaillé (champs, types, contraintes, relations)
- Webhook revalidation (`app/api/revalidate/route.ts`) décrit dans le flow mais absent de la structure
- Sitemap (`sitemap.ts`) mentionné dans le mapping mais absent de la structure
- CSP mentionné sans contenu
- Rate limiting « basique » sans règles précises
- Scalabilité très limitée
- Références T (T0, T8, T9...) sans glossaire

**Recommandations:**
- Ajouter un schéma détaillé des collections Payload (champs, types, contraintes)
- Intégrer webhook/sitemap/scripts dans l'arborescence
- Créer un glossaire des références T
- Documenter la politique CSP et rate limiting

---

### 4. Dev Plan

- **Complétude:** 9/10
- **Clarté:** 9/10 — Tranches bien découpées et actionables
- **Cohérence interne:** 8.5/10 — Quelques incohérences mineures
- **Niveau de détail:** 9/10 — Critères de validation, prérequis, livrables par tranche
- **Maturité:** 9/10 — Document vivant bien maintenu

**Points forts:**
- Instructions explicites pour agents IA (FSD, imports, `"use client"`)
- Adaptations post-audit documentées (tableau T0.5)
- Graphe de dépendances ASCII avec chemins critiques
- Suivi d'avancement avec statuts, dates, agent et notes
- 13 tranches complétées (T0-T9.6), 4 en attente
- Références visuelles vers le site Framer par tranche
- Glossaire FSD
- Tranches parallélisables identifiées

**Lacunes identifiées:**
- Checkboxes de validation T0 restées à `[ ]` alors que T0 est `done`
- T0.5 absent du graphe de dépendances
- T12 trop chargée (SEO + accessibilité + sécurité + performance)
- Migration Media local → Vercel Blob (T11) non détaillée
- Section Vision non explicitement listée dans les livrables T7

**Recommandations:**
- Mettre à jour les checkboxes de validation des tranches complétées
- Découper T12 en sous-tranches
- Documenter la migration Media dans T11
- Ajouter Vision dans les livrables T7

---

### 5. Framer Audit

- **Complétude:** 8/10
- **Clarté:** 8/10 — Descriptions claires pour la plupart
- **Cohérence interne:** 8.5/10
- **Niveau de détail:** 7/10 — Insuffisant pour certaines animations et micro-interactions
- **Maturité:** 8/10 — Document exploitable mais à enrichir

**Points forts:**
- Méthode documentée (Playwright, 11 pages, 30 screenshots, 67 images, 67 fonts)
- Design tokens extraits (palette, typographies, breakpoints, espacements)
- Contenu textuel complet (Hero, Portfolio, About, Services, Vision, Experience)
- Structure des projets avec metadata
- Écarts avec l'architecture documentés
- Données prêtes pour seed (T13)

**Lacunes identifiées:**
- **Curseur personnalisé non documenté** (confirmé comme manquant par le développeur)
- **Fond grillé/quadrillé non documenté** (confirmé comme manquant par le développeur)
- Animations : durées, courbes d'easing, délais non documentés
- Section Vision : layout et animations non décrits
- Carousel horizontal : comportement et navigation non détaillés
- Breakpoint tablet : pas de valeurs typo/espacement spécifiques
- `mix-blend-mode: difference` mentionné sans précision
- Champs du formulaire contact non listés
- Transitions « globales `all` » sans valeurs numériques

**Recommandations:**
- Compléter l'audit avec : curseur custom, fond grillé, effets de scroll
- Documenter les durées et courbes d'animation
- Décrire le layout et les animations de la section Vision
- Détailler le carousel horizontal
- Lister les champs du formulaire et leurs contraintes

---

## Cohérence inter-artefacts

### Alignements confirmés

| Paire d'artefacts | Alignement |
|-------------------|------------|
| Brief → PRD | Vision de migration Framer → Next.js cohérente |
| Brief → Architecture | Stack technique alignée (Next.js, Payload, FSD, PostgreSQL) |
| PRD → Architecture | FR/NFR → structure FSD mapping documenté |
| Architecture → Dev Plan | Tranches suivent la structure FSD documentée |
| Framer Audit → Dev Plan | Découvertes T0.5 intégrées dans le dev plan |
| Tous | Objectifs de performance Lighthouse cohérents |
| Tous | Personas et cibles utilisateurs cohérents |

### Incohérences détectées

| # | Incohérence | Artefacts concernés | Sévérité |
|---|-------------|---------------------|----------|
| 1 | **Pages `/work` et `/photography` absentes du PRD** — découvertes dans l'audit Framer, implémentées dans le code, présentes dans le dev plan, mais jamais ajoutées au PRD | PRD vs Framer Audit, Dev Plan, Code | **Haute** |
| 2 | **Upload chunked** : décrit dans le User Journey J4 du PRD comme MVP, mais classé Phase 2 dans le scope du PRD | PRD (interne) | Moyenne |
| 3 | **Curseur personnalisé et fond grillé** : présents sur le site Framer, absents de tous les artefacts | Framer Audit vs Site réel | **Haute** (confirmé par développeur) |
| 4 | **Data model** : l'architecture mentionne les collections sans schéma détaillé ; le code implémente des champs spécifiques (subProjects, richText) non documentés | Architecture vs Code | Moyenne |
| 5 | **Breakpoint mobile** : PRD 390px vs Framer Audit 809px pour le seuil mobile/tablet | PRD vs Framer Audit | Faible |
| 6 | **Next.js version** : Architecture documente 15.5.12, code utilise 15.4.11 | Architecture vs Code | Faible |
| 7 | **Section Vision** : absente des livrables T7 du dev plan mais implémentée dans le code | Dev Plan vs Code | Faible |
| 8 | **Checkboxes T0** : toujours décochées alors que la tranche est marquée `done` | Dev Plan (interne) | Faible |

### Artefacts manquants

| # | Artefact recommandé | Justification |
|---|---------------------|---------------|
| 1 | **UX Design** | Aucun document UX (wireframes, user flows visuels, design system). L'audit Framer ne remplace pas un vrai document UX. |
| 2 | **Epics & Stories** | Pas de user stories structurées. Le dev plan a des tranches mais pas de stories au format BMAD. |
| 3 | **Project Context** | Pas de document de contexte projet synthétique et à jour. |

---

## Métriques clés

| Métrique | Valeur |
|----------|--------|
| Nombre d'artefacts analysés | 5 |
| Score de complétude moyen | 8.3/10 |
| Incohérences inter-artefacts | 8 (2 hautes, 2 moyennes, 4 faibles) |
| Artefacts manquants recommandés | 3 (UX Design, Epics & Stories, Project Context) |
| Lacunes individuelles totales | ~30 |
| Recommandations totales | ~25 |
