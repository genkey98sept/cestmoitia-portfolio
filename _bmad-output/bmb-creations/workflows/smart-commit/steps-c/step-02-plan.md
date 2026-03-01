---
name: 'step-02-plan'
description: 'Analyze changes and propose a structured commit plan'

nextStepFile: './step-03-validate.md'
commitConventions: '../data/commit-conventions.md'
---

# Step 2: Commit Plan Generation

## STEP GOAL:

Analyser tous les changements collectés à l'étape précédente, les grouper en commits atomiques et sémantiquement logiques, et proposer un plan de commits structuré avec des messages Conventional Commits.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step, read entire file first
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in `{communication_language}`

### Role Reinforcement:

- ✅ You are a git architect and Conventional Commits expert
- ✅ You separate changes semantically, not mechanically
- ✅ You think like a developer who carefully organizes their work

### Step-Specific Rules:

- 🎯 Focus ONLY on analyzing changes and producing the commit plan
- 🚫 FORBIDDEN to execute any git commands (add, commit) in this step
- 🚫 FORBIDDEN to group changes mechanically (one commit per file)
- 📋 Every change must be accounted for — nothing left behind

## EXECUTION PROTOCOLS:

- 🎯 Follow the MANDATORY SEQUENCE exactly
- 📖 Load commit conventions before planning
- 💾 The plan is displayed to the user, not saved to a file
- 🚫 Do not proceed until plan is displayed

## CONTEXT BOUNDARIES:

- Project context and all changes are available from step-01
- Focus: semantic grouping and message generation
- Limits: planning only, no execution
- Dependencies: complete change analysis from step-01

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Load Commit Conventions

Load and read {commitConventions} to understand:
- Available commit types (feat, fix, refactor, chore, etc.)
- Semantic separation rules
- Scope patterns and message best practices
- Recommended commit ordering

### 2. Analyze and Group Changes

For each changed file from step-01:

**a. Classify the nature of the change:**
- Is it a new feature, bug fix, refactoring, config change, docs, etc.?
- What logical concern does it address?

**b. Group related changes together:**
- Files that serve the same logical purpose go in the same commit
- A new component + its styles + its tests = one `feat` commit
- A config change + its lockfile update = one `chore` commit
- Refactoring that enables a feature = separate `refactor` commit before the `feat`

**c. Apply semantic separation rules:**
- Never mix different types (feat + fix) in one commit
- Never mix unrelated concerns in one commit
- Split when a single file contains changes for multiple concerns (use `git add -p` in execution)

### 3. Determine Commit Order

Order commits following the convention:
1. `chore` / `build` / `ci` (infrastructure, config, deps)
2. `refactor` (preparation, cleanup)
3. `feat` (new functionality)
4. `fix` (bug corrections)
5. `test` (test additions/fixes)
6. `docs` (documentation)
7. `style` (formatting only)

### 4. Generate Commit Messages

For each commit, generate:
- **Type** from Conventional Commits
- **Scope** (optional but recommended) based on module/component
- **Description** in imperative, lowercase, max 72 chars
- **File list** showing which files are included

### 5. Display the Plan

Present the commit plan in this format:

```
📋 Plan de commits (X commits)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Commit 1: type(scope): description
  ├─ path/to/file1.ext (status)
  ├─ path/to/file2.ext (status)
  └─ path/to/file3.ext (status)

Commit 2: type(scope): description
  ├─ path/to/file4.ext (status)
  └─ path/to/file5.ext (status)

...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Where status is: new, modified, deleted, renamed

### 6. Proceed to Validation

Display: **[C]** Continue vers la validation

#### Menu Handling Logic:

- IF C: Load, read entire file, then execute {nextStepFile}
- IF Any other: help user, then redisplay menu

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- All changes accounted for (nothing left out)
- Commits are semantically grouped (not one-per-file)
- Messages follow Conventional Commits format
- Commits are logically ordered
- Plan is clearly formatted and readable

### ❌ SYSTEM FAILURE:

- Mechanical grouping (one file per commit)
- Missing changes from the plan
- Mixed types in a single commit (feat + fix)
- Executing git commands in this step
- Unclear or generic commit messages

**Master Rule:** The commit plan must look like it was carefully organized by a meticulous developer. Semantic separation is everything.
