---
name: 'step-01b-continue'
description: 'Handle workflow continuation from a previous session'

outputFolder: '{output_folder}/dev-checkpoints'
nextStepOptions:
  step-02: './step-02-codebase-analysis.md'
  step-03: './step-03-artifacts-analysis.md'
  step-04: './step-04-diagnostic.md'
  step-05: './step-05-decisions.md'
  step-06: './step-06-application.md'
  step-07: './step-07-snapshot.md'
---

# Step 1b: Continue Workflow

## STEP GOAL:

To resume the dev-checkpoint workflow from where it was left off in a previous session by reading the checkpoint-summary.md state and routing to the correct next step.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}

### Role Reinforcement:

- ✅ You are an analyste technique reprenant un checkpoint en cours
- ✅ Direct et efficace — l'objectif est de reprendre rapidement

### Step-Specific Rules:

- 🎯 Focus ONLY on reading state and routing to the correct step
- 🚫 FORBIDDEN to redo any already completed steps
- 💬 Brief welcome back, then route efficiently

## CONTEXT BOUNDARIES:

- User has run this workflow before
- checkpoint-summary.md exists with stepsCompleted array
- Need to route to the correct next step
- All previously generated files (codebase-analysis.md, etc.) should still exist in the checkpoint folder

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly.

### 1. Find In-Progress Checkpoint

Search {outputFolder} for the most recent checkpoint-summary.md with `status: IN_PROGRESS`.

Load that file and read its frontmatter:
- `stepsCompleted` array
- `lastStep`
- `checkpointFolder`
- `artifactsDiscovered`

### 2. Welcome Back

"**Bienvenue, {user_name} ! Le BMad Master reprend votre checkpoint en cours.**

- **Dossier :** {checkpointFolder}
- **Dernière étape complétée :** {lastStep}
- **Étapes terminées :** {stepsCompleted}

Prêt à reprendre à l'étape suivante."

### 3. Determine Next Step

Based on the last completed step in `stepsCompleted`, identify the next step to execute:

- If last was `step-01-init` → next is `step-02-codebase-analysis`
- If last was `step-02-codebase-analysis` → next is `step-03-artifacts-analysis`
- If last was `step-03-artifacts-analysis` → next is `step-04-diagnostic`
- If last was `step-04-diagnostic` → next is `step-05-decisions`
- If last was `step-05-decisions` → next is `step-06-application`
- If last was `step-06-application` → next is `step-07-snapshot`

### 4. Route to Correct Step

Load, read entirely, then execute the appropriate step file from {nextStepOptions}.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- In-progress checkpoint found and state read
- User welcomed back with clear status
- Correct next step identified and loaded
- No steps re-executed

### ❌ SYSTEM FAILURE:

- Re-executing completed steps
- Not reading stepsCompleted from frontmatter
- Routing to wrong step
- Not finding the in-progress checkpoint

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
