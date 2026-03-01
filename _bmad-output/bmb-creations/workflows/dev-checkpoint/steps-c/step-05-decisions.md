---
name: 'step-05-decisions'
description: 'Collaboratively review misalignments and make realignment decisions with the developer'

nextStepFile: './step-06-application.md'
checkpointFolder: '{checkpointFolder}'
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 5: Décisions de Réalignement

## STEP GOAL:

To collaboratively review every misalignment identified in step 04 with the developer, discuss each one, and make clear decisions: update the documentation to match reality OR log a corrective action on the code. Every decision is justified and logged in `decisions-log.md`.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}

### Role Reinforcement:

- ✅ You are a technical advisor helping the developer make informed decisions
- ✅ Patient, clair, structuré. Présente les options sans imposer.
- ✅ You bring technical perspective, the developer brings domain authority
- ✅ The developer has FINAL decision authority on every misalignment

### Step-Specific Rules:

- 🎯 This is the COLLABORATIVE step — every decision requires developer input
- 🚫 FORBIDDEN to make decisions without developer confirmation
- 💬 Present misalignments grouped by category, discuss each group
- 📋 For each misalignment, present exactly two options: update doc OR action on code
- 🚫 FORBIDDEN to skip any misalignment — every one needs a decision

## EXECUTION PROTOCOLS:

- 🎯 Follow the MANDATORY SEQUENCE exactly
- 💾 Write all decisions to {checkpointFolder}/decisions-log.md
- 📖 Update stepsCompleted in checkpoint-summary.md
- 🚫 Do NOT apply any changes yet — that's step 06

## CONTEXT BOUNDARIES:

- Available: misalignment-report.md (step 04) with all categorized misalignments
- Focus: Decision-making WITH the developer
- Limits: Decide only, do NOT apply changes yet
- Dependencies: step-04 completed with complete misalignment report

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise unless user explicitly requests a change.

### 1. Load Misalignment Report

Read `{checkpointFolder}/misalignment-report.md` to get the full inventory.

### 2. Present Decision Framework

"**Phase de décisions de réalignement.**

Pour chaque désalignement, vous avez deux options :

**[D] Mettre à jour la Documentation** — Le code reflète la bonne réalité. On met à jour l'artefact BMAD pour correspondre.

**[C] Action Corrective sur le Code** — La documentation reflète la bonne intention. On note une action à faire sur le code.

On va procéder catégorie par catégorie, en commençant par les critiques."

### 3. Process Critical Misalignments First

Present all 🔴 Critical misalignments:

For each one:
"**[ID] [Title]** 🔴 Critique

- **Prévu (doc) :** [what artifact says]
- **Réel (code) :** [what code actually does]
- **Impact :** [consequence of this misalignment]

**Votre décision :**
- **[D]** Mettre à jour la doc (le code est correct)
- **[C]** Action corrective sur le code (la doc est correcte)

Justification ou commentaire ?"

Wait for the developer's response on each critical item.

### 4. Process Important Misalignments

Present all 🟡 Important misalignments by category.

For efficiency, present them in groups of 2-3 when they're related:

"**Catégorie : [Category Name]**

[ID-1] [Title] — Prévu: [X] / Réel: [Y]
[ID-2] [Title] — Prévu: [X] / Réel: [Y]

Pour chacun : **[D]** mettre à jour la doc ou **[C]** action sur le code ?"

### 5. Process Minor Misalignments

Present 🟢 Minor misalignments as a batch:

"**Désalignements mineurs :**

| ID | Titre | Prévu | Réel |
|----|-------|-------|------|
| [ID] | [title] | [planned] | [actual] |
| ... | ... | ... | ... |

Le BMad Master recommande **[D] mettre à jour la doc** pour tous les mineurs, sauf si vous préférez autrement. D'accord, ou souhaitez-vous ajuster certains ?"

### 6. Confirm All Decisions

"**Récapitulatif de toutes les décisions :**

**Mises à jour de documentation ([count]) :**
- [List IDs and titles]

**Actions correctives sur le code ([count]) :**
- [List IDs and titles]

Est-ce que ce récapitulatif est correct ? Des changements à apporter ?"

### 7. Write Decisions Log

Create `{checkpointFolder}/decisions-log.md`:

```markdown
# Journal des Décisions de Réalignement

## Date: {date}
## Décideur: {user_name}

## Résumé
- Désalignements traités: X
- Mises à jour documentation: X
- Actions correctives code: X

## Décisions détaillées

### [MA-001] [Title]
- **Sévérité:** 🔴/🟡/🟢
- **Décision:** [D] Mettre à jour la documentation / [C] Action corrective code
- **Justification:** [Developer's reasoning]
- **Artefact concerné:** [which BMAD artifact to update, or which code area to fix]
- **Action spécifique:** [what exactly needs to change]

[Repeat for each misalignment]

## Actions correctives à planifier
[List of all code-side actions for reference in step 06]
```

### 8. Update Checkpoint Summary

Update `{checkpointFolder}/checkpoint-summary.md` frontmatter:
- Append `step-05-decisions` to `stepsCompleted`
- Set `lastStep: 'step-05-decisions'`

### 9. Present MENU OPTIONS

Display: **Sélectionnez une option :** [A] Élicitation avancée [P] Party Mode [C] Continuer — Appliquer les décisions

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask}, and when finished redisplay the menu
- IF P: Execute {partyModeWorkflow}, and when finished redisplay the menu
- IF C: Verify decisions-log.md is written and checkpoint-summary.md is updated, then load, read entire file, then execute {nextStepFile}
- IF Any other: help user, then redisplay menu

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Every misalignment from the report received a decision
- Developer confirmed all decisions
- Decisions log written with justifications
- Critical items processed first
- Batch processing used for minor items (efficient)
- Developer feels heard and in control

### ❌ SYSTEM FAILURE:

- Skipping misalignments without a decision
- Making decisions without developer input
- Applying changes (not yet — step 06)
- Not documenting justifications
- Processing in wrong order (minor before critical)

**Master Rule:** Every misalignment needs a decision. The developer has final authority. Skipping items is FORBIDDEN.
