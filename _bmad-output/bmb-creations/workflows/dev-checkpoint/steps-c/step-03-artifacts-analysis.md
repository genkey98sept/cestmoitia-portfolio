---
name: 'step-03-artifacts-analysis'
description: 'Deep autonomous analysis of all existing BMAD planning artifacts'

nextStepFile: './step-04-diagnostic.md'
checkpointFolder: '{checkpointFolder}'
---

# Step 3: Analyse des Artefacts BMAD

## STEP GOAL:

To perform a comprehensive, autonomous review of every BMAD planning artifact discovered in step 01 — evaluating each artifact's content, completeness, internal coherence, and cross-artifact consistency — producing a detailed `artifacts-review.md` report in the checkpoint folder.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}
- ⚙️ TOOL/SUBPROCESS FALLBACK: If any instruction references a subprocess, subagent, or tool you do not have access to, you MUST still achieve the outcome in your main context thread

### Role Reinforcement:

- ✅ You are an expert BMAD methodology analyst and documentation reviewer
- ✅ Rigoureux, méthodique. Analyse chaque artefact en profondeur.
- ✅ You bring expertise in BMAD artifact structure, completeness criteria, and cross-document coherence

### Step-Specific Rules:

- 🎯 Analyse approfondie et autonome de chaque artefact BMAD
- 🚫 FORBIDDEN to compare with code in this step — comparison happens in step-04
- 💬 Subprocess Pattern 2: DO NOT BE LAZY — For EACH artifact, launch a subprocess for deep analysis
- ⚙️ If subprocess unavailable, analyze each artifact sequentially in main thread
- 🚫 DO NOT BE LAZY — read and analyze every artifact completely

## EXECUTION PROTOCOLS:

- 🎯 Follow the MANDATORY SEQUENCE exactly
- 💾 Write complete analysis to {checkpointFolder}/artifacts-review.md
- 📖 Update stepsCompleted in checkpoint-summary.md
- 🚫 Do NOT skip any artifact — thoroughness is critical

## CONTEXT BOUNDARIES:

- Available: checkpoint-summary.md with artifactsDiscovered list and paths
- Focus: BMAD artifacts ONLY — no code comparison yet
- Limits: Evaluate artifacts as documents, don't compare to code
- Dependencies: step-01 (artifact list), step-02 completed

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise unless user explicitly requests a change.

### 1. Announce Analysis Start

"**Lancement de l'analyse des artefacts BMAD.**
Le BMad Master va lire et analyser chaque document de planification détecté."

### 2. Load Artifact List

Read `{checkpointFolder}/checkpoint-summary.md` to get the `artifactsDiscovered` list with file paths.

### 3. Analyze Each Artifact

DO NOT BE LAZY — For EACH artifact in the discovered list, launch a subprocess (or analyze sequentially if unavailable) that:

1. Loads and reads the complete artifact
2. Analyzes:
   - **Complétude** : Toutes les sections attendues sont-elles présentes et remplies ?
   - **Clarté** : Les descriptions sont-elles claires, non ambiguës ?
   - **Cohérence interne** : Les informations au sein du document sont-elles cohérentes ?
   - **Niveau de détail** : Le document est-il suffisamment détaillé pour guider le développement ?
   - **Qualité des décisions** : Les choix documentés sont-ils justifiés ?
   - **Maturité** : Le document semble-t-il finalisé ou en brouillon ?
3. Returns structured findings per artifact

**For each artifact type, evaluate specific criteria:**

**Product Brief:**
- Problem statement clarity, target audience, value proposition, scope

**PRD:**
- Functional requirements completeness, user stories, acceptance criteria, NFRs, success metrics

**Architecture:**
- Tech stack decisions, component structure, data model, API design, security, deployment, scalability

**UX Design:**
- User flows, wireframes/mockups references, design system, accessibility, responsive design

**Epics & Stories:**
- Coverage of PRD requirements, acceptance criteria, dependencies, estimation, priority

**Project Context:**
- Accuracy, completeness, up-to-date information

### 4. Cross-Artifact Coherence Check

After analyzing each artifact individually, evaluate coherence BETWEEN artifacts:

- Do the PRD requirements align with the Product Brief vision?
- Does the Architecture support all PRD functional requirements?
- Do the Stories cover all PRD requirements?
- Does the UX Design align with the PRD user experience expectations?
- Are there contradictions between any two artifacts?
- Are naming conventions consistent across artifacts?

### 5. Write Artifacts Review Report

Create `{checkpointFolder}/artifacts-review.md` with the following semi-structured format:

```markdown
# Revue des Artefacts BMAD

## Date: {date}

## Artefacts analysés
[List of all artifacts with paths and dates]

## Analyse par artefact

### [Artifact Name]
- **Complétude:** [score/assessment]
- **Clarté:** [assessment]
- **Cohérence interne:** [assessment]
- **Niveau de détail:** [assessment]
- **Points forts:** [list]
- **Lacunes identifiées:** [list]
- **Recommandations:** [list]

[Repeat for each artifact]

## Cohérence inter-artefacts
- **Alignements confirmés:** [what's consistent]
- **Incohérences détectées:** [contradictions or gaps between artifacts]
- **Artefacts manquants:** [recommended artifacts that don't exist yet]

## Métriques clés
- Nombre d'artefacts analysés: X
- Score de complétude moyen: X
- Incohérences inter-artefacts: X
- Artefacts manquants recommandés: X
```

### 6. Update Checkpoint Summary

Update `{checkpointFolder}/checkpoint-summary.md` frontmatter:
- Append `step-03-artifacts-analysis` to `stepsCompleted`
- Set `lastStep: 'step-03-artifacts-analysis'`

### 7. Present Results Summary

"**Analyse des artefacts BMAD terminée. Voici les points clés :**
- [Nombre] artefacts analysés
- [Key coherence findings]
- [Most significant gaps or issues]

Le rapport complet est dans `artifacts-review.md`. Prêt pour le diagnostic des désalignements."

### 8. Present MENU OPTIONS

Display: **[C] Continuer — Lancer le diagnostic des désalignements**

#### Menu Handling Logic:

- IF C: Verify artifacts-review.md is written and checkpoint-summary.md is updated, then load, read entire file, then execute {nextStepFile}
- IF Any other: help user, then redisplay menu

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Every discovered artifact fully read and analyzed
- Completeness, clarity, coherence evaluated per artifact
- Cross-artifact coherence checked
- Complete artifacts-review.md written to checkpoint folder
- stepsCompleted updated in checkpoint-summary.md

### ❌ SYSTEM FAILURE:

- Skipping any artifact from the discovered list
- Superficial analysis without reading complete artifacts
- Comparing with code (not yet — step 04)
- Not evaluating cross-artifact coherence
- Not writing the complete report

**Master Rule:** Every artifact must be read completely and analyzed in depth. Skipping or surface-level review is FORBIDDEN.
