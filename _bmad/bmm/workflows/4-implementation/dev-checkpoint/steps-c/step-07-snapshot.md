---
name: 'step-07-snapshot'
description: 'Finalize checkpoint summary with human-friendly overview and mark workflow complete'

checkpointFolder: '{checkpointFolder}'
---

# Step 7: Snapshot Final

## STEP GOAL:

To finalize the checkpoint by completing the `checkpoint-summary.md` with a comprehensive, human-friendly summary that gives anyone a clear picture of the project state, the realignment actions taken, and what's next. Mark the workflow as complete.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}

### Role Reinforcement:

- ✅ You are a technical communicator producing a clear, actionable summary
- ✅ Clair, accessible, synthétique. Écrit pour être compris par quelqu'un qui n'a pas suivi le processus.
- ✅ You bring expertise in synthesizing complex technical information into digestible summaries

### Step-Specific Rules:

- 🎯 Synthèse finale — clair, lisible, human-friendly
- 🚫 FORBIDDEN to use jargon without explanation
- 💬 Write as if the reader is discovering the project state for the first time
- 📋 Include a qualitative health assessment of the project

## EXECUTION PROTOCOLS:

- 🎯 Follow the MANDATORY SEQUENCE exactly
- 💾 Finalize checkpoint-summary.md with all sections
- 📖 Mark workflow as COMPLETE in frontmatter
- 🚫 This is the FINAL step — no nextStepFile

## CONTEXT BOUNDARIES:

- Available: All checkpoint files (codebase-analysis, artifacts-review, misalignment-report, decisions-log, action-items)
- Focus: Synthesis and finalization
- Limits: Summarize and synthesize, don't create new analysis
- Dependencies: All previous steps completed

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise unless user explicitly requests a change.

### 1. Load All Checkpoint Files

Read all files in {checkpointFolder}:
- `codebase-analysis.md`
- `artifacts-review.md`
- `misalignment-report.md`
- `decisions-log.md`
- `action-items.md`

### 2. Generate Project Health Assessment

Based on all analysis, determine an overall project health score:

- **🟢 Aligné** — Le projet est bien aligné avec la documentation. Divergences mineures seulement.
- **🟡 Partiellement aligné** — Des divergences significatives existent mais le projet reste sur la bonne trajectoire.
- **🔴 Besoin d'attention** — Des divergences critiques nécessitent une action immédiate.

### 3. Finalize Checkpoint Summary

Update `{checkpointFolder}/checkpoint-summary.md` — replace the placeholder sections with complete content:

```markdown
# Dev Checkpoint — {project_name}

## Date: {date}

## 🏥 Santé du projet : [🟢/🟡/🔴] [Aligné / Partiellement aligné / Besoin d'attention]

---

## Résumé Human-Friendly

### Où en est le projet ?

[2-3 paragraphes en langage clair décrivant l'état actuel du projet :
- Ce qui est fait et fonctionne bien
- Ce qui est en cours de développement
- Ce qui reste à faire par rapport à la vision initiale
- Le pourcentage approximatif d'avancement global]

### Ce qui a été réaligné lors de ce checkpoint

[Liste claire des changements apportés à la documentation :
- Quels artefacts ont été mis à jour
- Pourquoi (en langage simple)
- Ce que ça change pour la suite du développement]

### Ce qui reste à faire

[Liste priorisée des actions correctives sur le code :
- Actions critiques à traiter en premier
- Actions importantes pour la prochaine itération
- Actions mineures à planifier]

### Prochaines priorités recommandées

[3-5 recommandations concrètes sur ce qui devrait être fait en premier, basées sur l'analyse complète]

---

## Métriques du checkpoint

| Métrique | Valeur |
|----------|--------|
| Artefacts BMAD analysés | X |
| Désalignements identifiés | X |
| Dont critiques | X |
| Décisions prises | X |
| Artefacts mis à jour | X |
| Actions code restantes | X |

## Fichiers de ce checkpoint

| Fichier | Description |
|---------|-------------|
| checkpoint-summary.md | Ce résumé |
| codebase-analysis.md | Analyse complète du code source |
| artifacts-review.md | Revue de tous les artefacts BMAD |
| misalignment-report.md | Inventaire des désalignements |
| decisions-log.md | Journal des décisions de réalignement |
| action-items.md | Actions correctives à planifier |

## Contexte du développeur

[Responses from step 01 — preserved from initialization]

## Artefacts BMAD découverts

[List from step 01 — preserved from initialization]
```

### 4. Update Frontmatter to Complete

Update the frontmatter of `checkpoint-summary.md`:
- Append `step-07-snapshot` to `stepsCompleted`
- Set `lastStep: 'step-07-snapshot'`
- Set `status: COMPLETE`

### 5. Present Final Summary to Developer

Present the human-friendly summary directly to the developer:

"**✅ Dev Checkpoint terminé !**

**🏥 Santé du projet : [score]**

[Present the key sections of the human-friendly summary]

**Dossier du checkpoint :** `{checkpointFolder}/`

Tous les fichiers de synthèse sont disponibles dans ce dossier. Vos artefacts BMAD ont été mis à jour et votre contexte projet est maintenant réaligné.

Le BMad Master recommande de relancer un checkpoint après la prochaine phase de développement significative pour maintenir l'alignement."

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- All checkpoint files read and synthesized
- Project health assessment determined and justified
- Human-friendly summary written in clear, accessible language
- Metrics table populated with accurate numbers
- checkpoint-summary.md finalized with all sections
- Status marked as COMPLETE
- Developer presented with clear final summary

### ❌ SYSTEM FAILURE:

- Summary uses jargon without explanation
- Missing sections in checkpoint-summary.md
- Not reading all checkpoint files before synthesizing
- Status not marked as COMPLETE
- Summary not useful to someone reading it for the first time

**Master Rule:** The final summary must be clear enough that anyone reading it understands the exact state of the project. No jargon, no assumptions.
