---
name: 'step-04-execute'
description: 'Execute the validated commit plan'
---

# Step 4: Commit Execution

## STEP GOAL:

Exécuter le plan de commits validé par l'utilisateur en créant chaque commit de manière propre et ordonnée.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 📖 CRITICAL: Read the complete step file before taking any action
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in `{communication_language}`

### Role Reinforcement:

- ✅ You are a precise git operator executing an approved plan
- ✅ You execute exactly what was validated — no deviations
- ✅ You report the result of each commit clearly

### Step-Specific Rules:

- 🎯 Execute the validated commit plan exactly as approved
- 🚫 FORBIDDEN to modify the plan during execution
- 🚫 FORBIDDEN to add files or changes not in the plan
- 🚫 FORBIDDEN to skip any commit from the plan
- 📋 Execute commits in the planned order
- ⚠️ If a git command fails, STOP and report the error to the user

## EXECUTION PROTOCOLS:

- 🎯 Follow the MANDATORY SEQUENCE exactly
- 💾 Execute each commit sequentially
- 📖 Report the result of each commit
- 🚫 Stop on any error — do not continue blindly

## CONTEXT BOUNDARIES:

- Validated commit plan is available from step-03
- Focus: precise execution of approved commits
- Limits: execute only what was approved, nothing more
- Dependencies: explicit user approval from step-03

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise.

### 1. Execute Each Commit

For each commit in the validated plan, in order:

**a. Stage the files:**
- For new/modified files: `git add <file1> <file2> ...`
- For deleted files: `git add <deleted-file>` (git handles deletion tracking)
- If partial staging is needed (file has changes for multiple commits): use `git add -p <file>` with appropriate hunks

**b. Create the commit:**
- `git commit -m "<type>(<scope>): <description>"`
- Use HEREDOC format for multi-line messages if body is needed

**c. Report the result:**
```
✅ Commit 1/X: type(scope): description
   X files changed, Y insertions(+), Z deletions(-)
```

**d. If a commit fails:**
```
❌ Commit N/X failed: [error message]
Execution stopped. Previous commits (1 to N-1) have been applied.
Remaining commits (N+1 to X) have NOT been applied.
```
Stop execution immediately and inform the user.

### 2. Final Summary

After all commits are executed successfully, display:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Smart Commit terminé

X commits exécutés avec succès :
  1. type(scope): description
  2. type(scope): description
  ...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 3. End Workflow

The workflow is complete. No further steps.

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- All commits from the validated plan executed successfully
- Each commit contains exactly the files specified in the plan
- Commit messages match the validated plan exactly
- Commits are in the correct order
- Final summary clearly shows what was done

### ❌ SYSTEM FAILURE:

- Modifying the plan during execution
- Adding files not in the plan
- Skipping a commit
- Continuing after a git error
- Wrong commit order
- Commit messages different from the plan

**Master Rule:** Execute exactly what was approved. No more, no less. Stop on any error.
