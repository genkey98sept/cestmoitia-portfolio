---
name: 'step-01-init'
description: 'Analyze project context and collect git changes'

nextStepFile: './step-02-plan.md'
---

# Step 1: Project Context & Changes Analysis

## STEP GOAL:

Analyser le contexte du projet (architecture, conventions, historique git) et collecter tous les changements non commités pour construire une compréhension globale avant de proposer le plan de commits.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without completing all analysis steps
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, read entire file first
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in `{communication_language}`

### Role Reinforcement:

- ✅ You are a git architect and Conventional Commits expert
- ✅ You analyze deeply before making any decision
- ✅ You build a comprehensive mental model of the project before interpreting changes

### Step-Specific Rules:

- 🎯 Focus ONLY on data collection and context building — no commit planning yet
- 🚫 FORBIDDEN to propose commits in this step
- 🚫 FORBIDDEN to skip any analysis step
- 📋 Be thorough — the quality of the commit plan depends on this analysis

## EXECUTION PROTOCOLS:

- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Collect ALL context before proceeding
- 🚫 Do not proceed to step-02 until all data is gathered

## CONTEXT BOUNDARIES:

- This is the first step — no prior context exists
- Focus: understanding the project and its changes
- Limits: analysis only, no commit planning
- Dependencies: a git repository with uncommitted changes

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Analyze Project Context

Read and analyze the following to understand the project:

**a. Project documentation:**
- Read `CLAUDE.md` at project root (if exists) for project conventions and rules
- Read `README.md` (if exists) for project overview
- Read `package.json` or equivalent for project type and dependencies

**b. Project structure:**
- List the top-level directory structure to understand the architecture
- Identify the tech stack, framework, and project organization pattern

**c. Build a mental model:**
- What kind of project is this? (web app, library, API, etc.)
- What are the main conventions? (naming, structure, patterns)
- What is the typical scope granularity for this project?

### 2. Analyze Git History

Run `git log --oneline -20` to understand:

- The existing commit message style and format
- The typical scope and granularity of commits
- Whether the project already follows Conventional Commits
- Common scopes used in this project

### 3. Collect All Uncommitted Changes

Run the following commands and analyze the output:

**a. Overview of changes:**
- `git status` — list all modified, added, deleted, and untracked files

**b. Detailed changes for tracked files:**
- `git diff` — unstaged changes
- `git diff --staged` — staged changes

**c. For each changed file, understand:**
- What was changed and why (based on the diff content)
- Which feature, fix, or concern the change relates to
- How it connects to other changed files

### 4. Summarize Context

Present a brief summary to the user:

"**Contexte projet analysé.**

**Projet :** [type, stack, framework]
**Conventions détectées :** [commit style, naming patterns]
**Changements détectés :** [X fichiers modifiés, Y fichiers ajoutés, Z fichiers supprimés]

Passage à l'analyse et au plan de commits..."

### 5. Proceed to Planning

**Proceeding to commit planning...**

#### Menu Handling Logic:

- After context analysis is complete, immediately load, read entire file, then execute {nextStepFile}

#### EXECUTION RULES:

- This is an auto-proceed init step with no user choices
- Proceed directly to next step after analysis is complete

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Project context fully analyzed (docs, structure, conventions)
- Git history analyzed for commit style
- All uncommitted changes collected and understood
- Brief summary presented to user
- Ready to proceed to commit planning

### ❌ SYSTEM FAILURE:

- Skipping project context analysis
- Not reading git history
- Missing unstaged or staged changes
- Proposing commits in this step (too early)
- Not understanding the project before interpreting changes

**Master Rule:** Thorough analysis is the foundation of intelligent commit separation. Never rush this step.
