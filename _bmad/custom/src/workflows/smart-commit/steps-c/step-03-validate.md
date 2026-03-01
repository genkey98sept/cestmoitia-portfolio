---
name: 'step-03-validate'
description: 'User validates the commit plan before execution'

nextStepFile: './step-04-execute.md'
---

# Step 3: Commit Plan Validation

## STEP GOAL:

Obtenir la validation explicite de l'utilisateur sur le plan de commits avant toute exécution. Permettre des ajustements si nécessaire.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, read entire file first
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in `{communication_language}`

### Role Reinforcement:

- ✅ You are a git architect presenting your commit plan for approval
- ✅ You respect the user's judgment — they know their code best
- ✅ You adapt the plan based on feedback without compromising quality

### Step-Specific Rules:

- 🎯 Focus ONLY on validation — no git execution
- 🚫 FORBIDDEN to execute any git commands (add, commit)
- 🚫 FORBIDDEN to proceed without explicit user approval
- 📋 If user requests adjustments, regenerate the full plan

## EXECUTION PROTOCOLS:

- 🎯 Follow the MANDATORY SEQUENCE exactly
- ⏸️ ALWAYS halt and wait for user decision
- 🔄 Loop on adjustments until user approves or cancels
- 🚫 Never proceed to execution without "O" (Oui)

## CONTEXT BOUNDARIES:

- Commit plan from step-02 is available in memory
- Focus: user review and approval
- Limits: no git execution, validation only
- Dependencies: complete commit plan from step-02

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Present Validation Menu

Display:

"**Le plan de commits est prêt. Que souhaitez-vous faire ?**

**[O]** Oui, exécuter les commits
**[A]** Ajuster le plan
**[X]** Annuler — ne rien commiter"

### 2. Handle User Decision

#### Menu Handling Logic:

- **IF O (Oui):** User approves the plan. Load, read entire file, then execute {nextStepFile}
- **IF A (Ajuster):** Ask user what to adjust:
  - "Qu'est-ce que tu souhaites modifier ? (ex: fusionner des commits, séparer un commit, changer un message, déplacer un fichier...)"
  - Apply the requested adjustments
  - Regenerate and redisplay the updated plan
  - Redisplay the validation menu [O] / [A] / [X]
- **IF X (Annuler):** Display "Annulé. Aucun commit n'a été exécuté." and end the workflow.
- **IF Any other:** Help user understand options, then redisplay menu

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to execution step when user selects 'O'
- On 'A': loop — adjust, redisplay plan, redisplay menu
- On 'X': end workflow immediately, no further steps

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- User explicitly approves with 'O' before any execution
- Adjustments handled gracefully with plan regeneration
- Cancel option respected — no commits made
- User feels in control of what will be committed

### ❌ SYSTEM FAILURE:

- Proceeding to execution without explicit 'O'
- Executing git commands in this step
- Not allowing adjustments when requested
- Ignoring cancel request

**Master Rule:** No commit is ever executed without explicit user approval. This is the safety gate.
