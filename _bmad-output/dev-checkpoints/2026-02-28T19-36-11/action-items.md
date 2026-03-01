# Actions Correctives à Planifier

## Date: 2026-02-28

---

## Résumé

- Actions totales: 8
- 🔴 Critiques: 3
- 🟡 Importantes: 2
- 🟢 Mineures: 3

---

## Actions par priorité

### 🔴 Actions critiques

#### [MF-002] Implémenter le curseur personnalisé

- **Zone du code:** CSS global (`src/app/styles/globals.css`) ou composant dédié (`shared/ui/CustomCursor.tsx`)
- **Ce qu'il faut faire:** Inspecter le site Framer (https://cestmoitia.framer.website/) pour identifier le type de curseur personnalisé utilisé (dot, circle, blend-mode, etc.). Implémenter un curseur custom CSS ou un composant React qui reproduit fidèlement le comportement. Options : CSS `cursor: none` + élément absolu suivi par mousemove, ou SVG cursor via CSS.
- **Pourquoi:** Divergence visuelle majeure avec le design de référence. Élément distinctif de l'identité du site.
- **Effort estimé:** 2-4h (inspection + implémentation + responsive + reduced-motion)

#### [MF-003] Implémenter le fond grillé/quadrillé

- **Zone du code:** `src/app/styles/globals.css` (design token `--color-bg`) ou composant layout
- **Ce qu'il faut faire:** Inspecter le site Framer pour capturer le motif quadrillé exact (taille des cellules, couleur des lignes, opacité). Implémenter via CSS `background-image: repeating-linear-gradient(...)` ou SVG pattern sur le `body` ou un élément de layout global.
- **Pourquoi:** Divergence visuelle significative — le fond n'est pas noir uni mais quadrillé.
- **Effort estimé:** 1-2h (inspection + CSS pattern)

#### [MF-004] Corriger le rendu richText Lexical pour subDescription

- **Zone du code:** `src/entities/project/ui/ProjectDetail.tsx`
- **Ce qu'il faut faire:** Remplacer la condition `typeof sub.subDescription === "string"` par un rendu Lexical approprié. Options :
  1. Utiliser `@payloadcms/richtext-lexical/react` avec le composant `RichText` de Payload
  2. Ou sérialiser le contenu Lexical en HTML côté serveur et rendre via `dangerouslySetInnerHTML`
  3. Ou convertir le champ en `text` simple dans la collection si le richText n'est pas nécessaire
- **Pourquoi:** Bug fonctionnel — le contenu saisi dans Payload n'est jamais rendu côté frontend.
- **Effort estimé:** 1-2h (choix d'approche + implémentation)

---

### 🟡 Actions importantes

#### [MT-001] Aligner les types Payload avec les types métier

- **Zone du code:** `src/entities/project/api/queries.ts`, `src/entities/site-info/api/queries.ts`, `src/entities/project/model/types.ts`, `src/entities/site-info/model/types.ts`
- **Ce qu'il faut faire:** Éliminer les casts `as unknown as Project[]` et `as unknown as SiteInfo`. Options :
  1. Utiliser `payload generate:types` pour générer les types Payload, puis dériver les types métier directement de ceux-ci
  2. Ou utiliser les types générés directement au lieu de types métier manuels
  3. Ou créer des fonctions de mapping explicites (Payload type → métier type) avec validation
- **Pourquoi:** Type safety compromise — les erreurs de mapping ne sont pas détectées à la compilation.
- **Effort estimé:** 2-3h (régénérer types + refactoring queries + mise à jour imports)

#### [MT-002] Documenter et ajuster les animations Framer

- **Zone du code:** Tous les fichiers `*Animated.tsx` (8 fichiers) + `framer-audit.md`
- **Ce qu'il faut faire:**
  1. Inspecter le site Framer avec les DevTools pour capturer les valeurs exactes d'animation (durées, easing, délais, distances de translation)
  2. Documenter ces valeurs dans `framer-audit.md` (nouvelle section "Animations — Valeurs exactes")
  3. Ajuster les composants Motion pour correspondre aux valeurs documentées
- **Pourquoi:** Fidélité au design de référence — les animations actuelles sont implémentées avec des valeurs estimées.
- **Effort estimé:** 4-6h (inspection DevTools + documentation + ajustement 8 composants)

---

### 🟢 Actions mineures

#### [MU-002] Créer un design token pour #808080

- **Zone du code:** `src/app/styles/globals.css` + 7 fichiers : `SectionHeader.tsx`, `HeroAnimated.tsx`, `ExperienceAnimated.tsx`, `FooterAnimated.tsx`, `ProjectDetail.tsx`, `ContactPage.tsx`, `WorkPage.tsx`
- **Ce qu'il faut faire:** Ajouter `--color-text-secondary: #808080;` dans la section `@theme` de `globals.css`. Remplacer toutes les occurrences de `#808080` par `var(--color-text-secondary)` ou la classe Tailwind correspondante.
- **Pourquoi:** Maintenabilité — modification du design = 1 seul token au lieu de 7 fichiers.
- **Effort estimé:** 30min

#### [MU-003] Corriger les 3 typos

- **Zone du code:**
  - `src/widgets/services/ui/ServicesAnimated.tsx` : "donner vie vos projets" → "donner vie **à** vos projets"
  - `src/pages/photography/ui/PhotographyPage.tsx` : "Gallerie" → "Galerie"
  - `src/widgets/footer/ui/FooterAnimated.tsx` : "Installe" → "Installé"
- **Ce qu'il faut faire:** Corriger les 3 chaînes de texte.
- **Pourquoi:** Qualité perçue — correspondance avec le contenu du site Framer.
- **Effort estimé:** 10min

#### [MU-004] Refaire la page 404

- **Zone du code:** `src/app/(frontend)/not-found.tsx`
- **Ce qu'il faut faire:** Redesigner la page 404 pour être cohérente avec le style du site (fond noir, typographie Clash Display, navigation retour). S'inspirer de la 404 du site Framer si elle existe, sinon créer un design minimaliste cohérent.
- **Pourquoi:** Expérience utilisateur — la page actuelle est basique et incohérente avec le reste du site.
- **Effort estimé:** 1h

---

## Suggestions de planification

### Sprint 1 — Fidélité visuelle (priorité haute)

| Action | Effort | Dépendances |
|--------|--------|-------------|
| MF-003 Fond grillé | 1-2h | Aucune |
| MF-002 Curseur custom | 2-4h | Aucune |
| MU-002 Token #808080 | 30min | Aucune |
| MU-003 Typos | 10min | Aucune |

**Total estimé : ~5h**

### Sprint 2 — Corrections fonctionnelles

| Action | Effort | Dépendances |
|--------|--------|-------------|
| MF-004 RichText Lexical | 1-2h | Aucune |
| MT-001 Types Payload | 2-3h | Aucune |
| MU-004 Page 404 | 1h | Aucune |

**Total estimé : ~5h**

### Sprint 3 — Polish animations

| Action | Effort | Dépendances |
|--------|--------|-------------|
| MT-002 Animations Framer | 4-6h | Idéalement après MF-002 et MF-003 |

**Total estimé : ~5h**
