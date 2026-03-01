---
name: 'step-04-diagnostic'
description: 'Compare codebase analysis with artifacts review to identify all misalignments'

nextStepFile: './step-05-decisions.md'
checkpointFolder: '{checkpointFolder}'
---

# Step 4: Diagnostic des Désalignements

## STEP GOAL:

To compare the codebase analysis (step 02) with the artifacts review (step 03), identify every misalignment between planned and actual state, categorize them, and produce a comprehensive `misalignment-report.md` grouped by category.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}
- ⚙️ TOOL/SUBPROCESS FALLBACK: If any instruction references a subprocess, subagent, or tool you do not have access to, you MUST still achieve the outcome in your main context thread

### Role Reinforcement:

- ✅ You are a reconciliation analyst comparing plan vs reality
- ✅ Objectif, factuel, exhaustif. Chaque désalignement est documenté sans jugement.
- ✅ You bring expertise in gap analysis and systematic comparison

### Step-Specific Rules:

- 🎯 Subprocess Pattern 4: Launch parallel comparisons by category when possible
- ⚙️ If subprocess unavailable, compare sequentially by category
- 🚫 FORBIDDEN to make decisions about how to resolve misalignments — that's step 05
- 💬 Report findings objectively — no recommendations yet
- 🚫 DO NOT BE LAZY — compare every aspect systematically

## EXECUTION PROTOCOLS:

- 🎯 Follow the MANDATORY SEQUENCE exactly
- 💾 Write complete diagnostic to {checkpointFolder}/misalignment-report.md
- 📖 Update stepsCompleted in checkpoint-summary.md
- 🚫 Do NOT skip any comparison category

## CONTEXT BOUNDARIES:

- Available: codebase-analysis.md (step 02) + artifacts-review.md (step 03)
- Focus: COMPARISON between code and artifacts — identify gaps
- Limits: Report misalignments, do NOT prescribe solutions
- Dependencies: step-02 and step-03 completed

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise unless user explicitly requests a change.

### 1. Load Analysis Reports

Read both reports from the checkpoint folder:
- `{checkpointFolder}/codebase-analysis.md`
- `{checkpointFolder}/artifacts-review.md`

### 2. Announce Diagnostic Start

"**Lancement du diagnostic des désalignements.**
Le BMad Master compare le code source avec les artefacts BMAD pour identifier toutes les divergences."

### 3. Architecture Comparison

Compare the actual code architecture with what the architecture document specifies:

- **Structure du projet** : L'organisation des dossiers/fichiers suit-elle l'architecture prévue ?
- **Patterns architecturaux** : Les patterns utilisés dans le code correspondent-ils à ceux documentés ?
- **Composants/Modules** : Tous les composants prévus existent-ils ? Y en a-t-il de non prévus ?
- **Couches et responsabilités** : La séparation des responsabilités est-elle respectée ?
- **Stack technique** : Les technologies utilisées correspondent-elles à celles prévues ?

### 4. Functional Coverage Comparison

Compare implemented features with PRD/Stories requirements:

- **Fonctionnalités implémentées** vs **fonctionnalités prévues dans le PRD**
- **Couverture des stories** : Quelles stories sont implémentées, partiellement, ou pas du tout ?
- **Critères d'acceptation** : Les implémentations respectent-elles les critères définis ?
- **Fonctionnalités non prévues** : Y a-t-il du code qui implémente des choses non documentées ?

### 5. UX/UI Comparison

If UX design artifacts exist, compare:

- **Composants UI** : Les composants correspondent-ils aux maquettes/wireframes ?
- **Flux utilisateur** : Les parcours implémentés suivent-ils les flux définis ?
- **Design system** : Les conventions visuelles sont-elles respectées ?
- **Responsive/Accessibility** : Conformité avec les exigences UX

### 6. Technical Decisions Comparison

Compare technical choices in code vs documentation:

- **Dépendances** : Les librairies utilisées correspondent-elles à celles prévues ?
- **Patterns de données** : Le modèle de données suit-il le schema prévu ?
- **API design** : Les endpoints/interfaces suivent-ils la spécification ?
- **Configuration** : La configuration suit-elle les pratiques documentées ?

### 7. Categorize and Prioritize

Group all identified misalignments into categories:

**Catégories de désalignement :**

1. **Architecture** — Divergences structurelles et patterns
2. **Fonctionnel** — Couverture des fonctionnalités vs PRD
3. **UX/UI** — Divergences avec le design prévu
4. **Stack/Technique** — Choix techniques différents de la doc
5. **Documentation** — Artefacts incomplets, obsolètes ou manquants

**Niveaux de sévérité :**
- 🔴 **Critique** — Impact majeur sur le projet, nécessite attention immédiate
- 🟡 **Important** — Divergence significative à adresser
- 🟢 **Mineur** — Divergence légère, faible impact

### 8. Write Misalignment Report

Create `{checkpointFolder}/misalignment-report.md`:

```markdown
# Diagnostic des Désalignements

## Date: {date}

## Résumé

- Désalignements totaux identifiés: X
- 🔴 Critiques: X
- 🟡 Importants: X
- 🟢 Mineurs: X

## 1. Architecture
[For each misalignment in this category:]
### [MA-001] [Short title]
- **Sévérité:** 🔴/🟡/🟢
- **Prévu (doc):** [what the artifact says]
- **Réel (code):** [what the code actually does]
- **Impact:** [what this misalignment means]

## 2. Fonctionnel
[Same pattern]

## 3. UX/UI
[Same pattern]

## 4. Stack/Technique
[Same pattern]

## 5. Documentation
[Same pattern]

## Alignements confirmés
[What IS aligned — important for confidence]
```

### 9. Update Checkpoint Summary

Update `{checkpointFolder}/checkpoint-summary.md` frontmatter:
- Append `step-04-diagnostic` to `stepsCompleted`
- Set `lastStep: 'step-04-diagnostic'`

### 10. Present Diagnostic Summary

Present the full grouped inventory to the developer:

"**Diagnostic terminé. Voici l'inventaire complet des désalignements :**

**🔴 Critiques ([count]) :**
- [List briefly]

**🟡 Importants ([count]) :**
- [List briefly]

**🟢 Mineurs ([count]) :**
- [List briefly]

**✅ Alignements confirmés :**
- [Key areas that are aligned]

Le rapport détaillé est dans `misalignment-report.md`. L'étape suivante vous permettra de prendre des décisions sur chaque désalignement."

### 11. Present MENU OPTIONS

Display: **[C] Continuer — Passer aux décisions de réalignement**

#### Menu Handling Logic:

- IF C: Verify misalignment-report.md is written and checkpoint-summary.md is updated, then load, read entire file, then execute {nextStepFile}
- IF Any other: help user, then redisplay menu

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Both analysis reports loaded and cross-referenced
- Every comparison category covered systematically
- All misalignments identified, categorized, and severity-rated
- Aligned areas also documented (for confidence)
- Complete misalignment-report.md written with grouped inventory
- Developer presented with clear summary

### ❌ SYSTEM FAILURE:

- Missing comparison categories
- Making recommendations or decisions (not yet)
- Not reading both analysis reports
- Surface-level comparison missing real misalignments
- Not categorizing or prioritizing findings

**Master Rule:** Every comparison must be thorough. The diagnostic must be complete and objective. Skipping categories is FORBIDDEN.
