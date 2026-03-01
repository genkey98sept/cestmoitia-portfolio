---
workflowType: dev-checkpoint
stepsCompleted: ['step-01-init', 'step-02-codebase-analysis', 'step-03-artifacts-analysis', 'step-04-diagnostic', 'step-05-decisions', 'step-06-application', 'step-07-snapshot']
lastStep: 'step-07-snapshot'
lastContinued: ''
date: '2026-02-28T19:36:11'
user_name: 'Doens'
project_name: 'tia'
checkpointFolder: '_bmad-output/dev-checkpoints/2026-02-28T19-36-11'
artifactsDiscovered:
  - name: product-brief-tia-2026-02-28.md
    path: _bmad-output/planning-artifacts/product-brief-tia-2026-02-28.md
    type: Product Brief
  - name: prd.md
    path: _bmad-output/planning-artifacts/prd.md
    type: PRD
  - name: architecture.md
    path: _bmad-output/planning-artifacts/architecture.md
    type: Architecture
  - name: dev-plan.md
    path: _bmad-output/planning-artifacts/dev-plan.md
    type: Dev Plan
  - name: framer-audit.md
    path: _bmad-output/planning-artifacts/framer-audit.md
    type: Framer Audit
status: COMPLETE
---

# Dev Checkpoint — tia

## Date: 2026-02-28

## 🏥 Santé du projet : 🟡 Partiellement aligné

Le projet est techniquement solide et bien avancé, mais présente des écarts visuels significatifs avec le site Framer de référence qui nécessitent une attention prioritaire.

---

## Résumé Human-Friendly

### Où en est le projet ?

Le projet **tia** est la migration du portfolio Framer de Tianoa (https://cestmoitia.framer.website/) vers une stack Next.js maîtrisée. Le développement est bien avancé : **13 tranches sur 17 sont terminées** (T0 à T9.6), ce qui représente environ **70-75% du MVP**. Toute la fondation technique est en place — l'architecture Feature-Sliced Design (FSD) est correctement implémentée, le code est propre (aucun `any`, aucun `console.log`, TypeScript strict), et les 6 pages du site sont fonctionnelles (accueil, projets, détail projet, photographie, contact, 404).

Ce qui fonctionne bien : le back-office Payload CMS est opérationnel avec les collections Projets et les informations globales du site. Le formulaire de contact envoie des emails via Resend avec validation Zod et protection anti-spam. Les animations Motion sont implémentées sur tous les widgets. L'accessibilité est prise en compte (aria-labels, focus visible, reduced-motion).

Ce qui reste à faire correspond aux **4 tranches planifiées** (T10 revalidation du cache, T11 stockage Blob pour les médias, T12 SEO/finitions, T13 scripts de migration de données) — c'est normal et prévu dans le plan de développement. En revanche, **le design ne correspond pas encore fidèlement au site Framer de référence** : il manque le curseur personnalisé, le fond quadrillé, et les animations n'ont pas été vérifiées contre les valeurs exactes du site source. Un bug empêche aussi l'affichage du contenu richText des sous-projets.

### Ce qui a été réaligné lors de ce checkpoint

**3 artefacts BMAD ont été mis à jour :**

1. **PRD (prd.md)** — Les pages `/work` et `/photography`, découvertes lors de l'audit Framer et déjà implémentées dans le code, ont été ajoutées comme exigences formelles (FR42, FR43). Le scope Phase 1 a été mis à jour pour refléter les 5 pages réelles au lieu de 3. La page contact est maintenant documentée comme "formulaire fonctionnel" (plus d'ambiguïté).

2. **Architecture (architecture.md)** — La version Next.js a été corrigée (15.5.12 → 15.4.11 pour correspondre à la réalité du code). Le schéma des collections Payload a été détaillé avec tous les champs réellement implémentés (Projects avec subProjects et richText, Media avec imageSizes, SiteInfo avec services et expériences).

3. **Dev Plan (dev-plan.md)** — Les checkboxes de validation de la tranche T0 ont été cochées pour refléter leur état réel (elles étaient restées décochées alors que la tranche est complète).

**Pourquoi c'est important :** Ces mises à jour font en sorte que les documents de planification redeviennent une source de vérité fiable. Un développeur ou un agent IA qui lit ces artefacts aura maintenant une image exacte de ce qui est attendu et de ce qui existe.

### Ce qui reste à faire

**🔴 Actions critiques (3) — à traiter en priorité :**
- Implémenter le **curseur personnalisé** du site Framer (~2-4h)
- Implémenter le **fond grillé/quadrillé** au lieu du fond noir uni (~1-2h)
- Corriger le **bug d'affichage richText** dans les sous-projets — le contenu Lexical n'est jamais rendu (~1-2h)

**🟡 Actions importantes (2) :**
- Aligner les **types TypeScript** Payload avec les types métier pour éliminer les casts `as unknown as` (~2-3h)
- **Documenter et ajuster les animations** — inspecter les valeurs exactes du site Framer et les reproduire fidèlement (~4-6h)

**🟢 Actions mineures (3) :**
- Créer un **design token CSS** pour la couleur `#808080` utilisée en dur dans 7 fichiers (~30min)
- Corriger **3 typos** dans le contenu ("donner vie vos projets", "Gallerie", "Installe") (~10min)
- **Refaire la page 404** pour qu'elle soit cohérente avec le style du site (~1h)

### Prochaines priorités recommandées

1. **Sprint fidélité visuelle (~5h)** — Fond grillé + curseur custom + token CSS + typos. Ce sprint élimine les écarts visuels les plus visibles avec le site Framer.

2. **Sprint corrections fonctionnelles (~5h)** — Bug richText + types Payload + page 404. Ce sprint corrige le bug le plus impactant et améliore la robustesse du code.

3. **Sprint animations (~5h)** — Inspecter le site Framer avec les DevTools, documenter les valeurs exactes, ajuster les 8 composants animés. Ce sprint finalise la fidélité visuelle.

4. **Reprendre les tranches planifiées** — T10 (revalidation), T11 (Blob storage), T12 (SEO), T13 (seed) — dans l'ordre du plan de développement.

5. **Relancer un checkpoint** après les sprints correctifs et avant de commencer T10-T13.

---

## Métriques du checkpoint

| Métrique | Valeur |
|----------|--------|
| Artefacts BMAD analysés | 5 |
| Désalignements identifiés | 19 |
| Dont critiques | 4 |
| Décisions prises | 19 |
| Artefacts mis à jour | 3 (PRD, Architecture, Dev Plan) |
| Actions code restantes | 8 (3 critiques, 2 importantes, 3 mineures) |
| Effort estimé restant (actions) | ~15h |
| Tranches dev complétées | 13/17 (T0-T9.6) |
| Tranches dev restantes | 4 (T10, T11, T12, T13) |

## Fichiers de ce checkpoint

| Fichier | Description |
|---------|-------------|
| checkpoint-summary.md | Ce résumé — vue d'ensemble complète du projet |
| codebase-analysis.md | Analyse détaillée du code source (structure, qualité, stack, git, dette technique) |
| artifacts-review.md | Revue de chaque artefact BMAD (complétude, clarté, cohérence) |
| misalignment-report.md | Inventaire de tous les désalignements code ↔ documentation |
| decisions-log.md | Journal des 19 décisions de réalignement avec justifications |
| action-items.md | 8 actions correctives prioritisées avec effort estimé et sprints suggérés |

## Contexte du développeur

1. **Évolutions récentes :** Le projet est encore en cours de développement. Les collections (données/backend) ont été mises en place et le front-end a été commencé, mais il ne correspond pas encore exactement au design voulu.

2. **Décisions techniques non documentées :** Aucune décision technique majeure non reflétée dans la documentation identifiée par le développeur.

3. **Zones de préoccupation :** Le design actuel ne correspond pas fidèlement au site Framer de référence (https://cestmoitia.framer.website/). Problèmes identifiés par le développeur :
   - Le fond n'est pas tout noir mais devrait avoir un motif quadrillé (grid pattern)
   - Le curseur de souris n'est pas personnalisé (devrait être un curseur custom, pas le pointeur classique)
   - Plusieurs petits écarts de design par rapport à la référence Framer
   - Doute sur la qualité du travail de récupération du design depuis le site Framer

## Artefacts BMAD découverts

| # | Artefact | Emplacement | Date de modification |
|---|----------|-------------|---------------------|
| 1 | Product Brief | planning-artifacts/product-brief-tia-2026-02-28.md | 28/02/2026 11:26 |
| 2 | PRD | planning-artifacts/prd.md | 28/02/2026 (mis à jour ce checkpoint) |
| 3 | Architecture | planning-artifacts/architecture.md | 28/02/2026 (mis à jour ce checkpoint) |
| 4 | Dev Plan | planning-artifacts/dev-plan.md | 28/02/2026 (mis à jour ce checkpoint) |
| 5 | Framer Audit | planning-artifacts/framer-audit.md | 28/02/2026 14:36 |

**Non trouvés :** UX Design, Epics & Stories, Project Context (recommandés mais non bloquants)
