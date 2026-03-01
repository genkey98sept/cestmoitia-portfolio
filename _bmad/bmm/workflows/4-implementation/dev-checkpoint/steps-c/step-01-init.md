---
name: 'step-01-init'
description: 'Initialize dev checkpoint - detect artifacts, gather developer context, create checkpoint folder'

nextStepFile: './step-02-codebase-analysis.md'
continueFile: './step-01b-continue.md'
checkpointTemplate: '../data/checkpoint-template.md'
outputFolder: '{output_folder}/dev-checkpoints'
---

# Step 1: Initialization

## STEP GOAL:

To initialize the dev checkpoint process by detecting existing BMAD artifacts, checking for an in-progress checkpoint, gathering focused context from the developer, and creating the timestamped checkpoint folder with its initial summary file.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}
- ⚙️ TOOL/SUBPROCESS FALLBACK: If any instruction references a subprocess, subagent, or tool you do not have access to, you MUST still achieve the outcome in your main context thread

### Role Reinforcement:

- ✅ You are an analyste technique et architecte logiciel spécialisé BMAD
- ✅ Direct, factuel, structuré. Présente les données clairement.
- ✅ You bring deep expertise in code analysis and BMAD artifact management
- ✅ User brings their domain knowledge and development context

### Step-Specific Rules:

- 🎯 Focus ONLY on initialization: artifact detection, context gathering, folder creation
- 🚫 FORBIDDEN to start any analysis or comparison in this step
- 💬 Ask 2-3 targeted questions maximum — not an interrogation
- 🚫 FORBIDDEN to load next step until checkpoint folder and summary are created

## EXECUTION PROTOCOLS:

- 🎯 Follow the MANDATORY SEQUENCE exactly
- 💾 Create checkpoint folder and checkpoint-summary.md from template
- 📖 Track stepsCompleted in checkpoint-summary.md frontmatter
- 🚫 Do NOT analyze code or artifacts yet — that's steps 02 and 03

## CONTEXT BOUNDARIES:

- Available context: workflow.md has been loaded, config variables resolved
- Focus: Setup, detection, and context gathering
- Limits: No analysis, no comparisons, no recommendations
- Dependencies: None — this is the first step

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise unless user explicitly requests a change.

### 1. Check for Existing Checkpoint

Search {outputFolder} for any existing checkpoint-summary.md files.

- **If found** with `status: IN_PROGRESS` → Load and execute {continueFile}
- **If found** with `status: COMPLETE` → Note as previous checkpoint (available for comparison later). Continue to step 2.
- **If not found** → Continue to step 2.

### 2. Discover BMAD Artifacts

Scan the project to detect all existing BMAD planning artifacts. Search in:

1. `{output_folder}/planning-artifacts/` — primary location
2. `{output_folder}/` — root output folder
3. `{project-root}/docs/` — project docs folder

**Artifacts to detect:**
- Product Brief (`*-brief.md`, `*-product-brief.md`)
- PRD (`*-prd.md`)
- Architecture (`*-architecture.md`, `architecture.md`)
- UX Design (`*-ux.md`, `*-ux-design.md`)
- Epics & Stories (`*-epics.md`, `*-stories.md`, `epic-*.md`, `story-*.md`)
- Project Context (`*-project-context.md`)
- Any other `.md` files that appear to be BMAD planning documents

Present findings to the developer:

"**Artefacts BMAD détectés :**
- [1] architecture.md (planning-artifacts/, date)
- [2] prd-project.md (planning-artifacts/, date)
- ...

**Artefacts non trouvés :**
- [liste des types non détectés]

Est-ce que cette liste est complète, ou y a-t-il d'autres documents de planification que je devrais inclure ?"

### 3. Gather Developer Context

Ask the developer 2-3 targeted questions to understand the current state:

"**Quelques questions ciblées avant de commencer l'analyse :**

1. **Qu'est-ce qui a le plus évolué dans le projet récemment ?** (nouvelles fonctionnalités, changements d'architecture, refactoring...)

2. **Y a-t-il des décisions techniques prises en cours de développement qui ne sont pas reflétées dans la documentation ?** (changement de librairie, pattern différent de ce qui était prévu, pivot fonctionnel...)

3. **Y a-t-il des zones du projet qui vous préoccupent particulièrement ?** (dette technique, incohérences que vous avez remarquées, zones fragiles...)"

Wait for the developer's responses. These will provide crucial context for the analysis phases.

### 4. Create Checkpoint Folder and Summary

Generate a timestamp string (format: `YYYY-MM-DDThh-mm-ss`).

Create the checkpoint folder at: `{outputFolder}/{timestamp}/`

Load {checkpointTemplate} and create `checkpoint-summary.md` in the new folder with:

- Frontmatter populated: date, user_name, project_name, checkpointFolder, artifactsDiscovered (list of detected artifacts with paths), stepsCompleted: ['step-01-init']
- "Contexte du développeur" section filled with the developer's responses
- "Artefacts BMAD découverts" section filled with the detection results

### 5. Confirm and Proceed

"**Checkpoint initialisé :**
- Dossier : `{outputFolder}/{timestamp}/`
- Artefacts détectés : [count]
- Contexte développeur capturé

Prêt à lancer l'analyse approfondie du code source."

### 6. Present MENU OPTIONS

Display: **[C] Continuer — Lancer l'analyse du code source**

#### Menu Handling Logic:

- IF C: Verify checkpoint-summary.md is created and populated, then load, read entire file, then execute {nextStepFile}
- IF Any other: help user, then redisplay menu

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected and checkpoint-summary.md exists with populated frontmatter will you load and read fully `./step-02-codebase-analysis.md` to begin the code analysis phase.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Existing checkpoint detection performed
- All available BMAD artifacts discovered and listed
- Developer context gathered through targeted questions
- Checkpoint folder created with timestamp
- checkpoint-summary.md created from template with populated frontmatter
- stepsCompleted updated

### ❌ SYSTEM FAILURE:

- Starting analysis before completing initialization
- Asking too many questions (more than 3)
- Not detecting artifacts automatically
- Not creating the checkpoint folder and summary
- Hardcoded paths instead of variables

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
