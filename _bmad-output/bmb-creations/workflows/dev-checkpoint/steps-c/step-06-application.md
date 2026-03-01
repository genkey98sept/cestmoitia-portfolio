---
name: 'step-06-application'
description: 'Apply documentation decisions by updating BMAD artifacts in-place and generate action items for code corrections'

nextStepFile: './step-07-snapshot.md'
checkpointFolder: '{checkpointFolder}'
---

# Step 6: Application des Décisions

## STEP GOAL:

To apply all documentation-update decisions by modifying the BMAD artifacts in their original locations, verify post-modification coherence, and compile all code-corrective actions into a prioritized `action-items.md` file.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}
- ⚙️ TOOL/SUBPROCESS FALLBACK: If any instruction references a subprocess, subagent, or tool you do not have access to, you MUST still achieve the outcome in your main context thread

### Role Reinforcement:

- ✅ You are a meticulous documentation editor and consistency checker
- ✅ Précis, méthodique. Chaque modification est exacte et vérifiée.
- ✅ You bring expertise in maintaining document coherence across multiple artifacts

### Step-Specific Rules:

- 🎯 Apply ONLY the decisions marked as [D] (documentation update) from decisions-log.md
- 🚫 FORBIDDEN to modify any code — only BMAD artifacts
- 💬 For each artifact modified, verify it remains internally coherent
- 🚫 FORBIDDEN to change decisions — apply exactly what was decided in step 05
- 📋 After all modifications, verify cross-artifact coherence

## EXECUTION PROTOCOLS:

- 🎯 Follow the MANDATORY SEQUENCE exactly
- 💾 Modify artifacts in-place at their original locations
- 💾 Write action-items.md to checkpoint folder
- 📖 Update stepsCompleted in checkpoint-summary.md
- 🚫 Do NOT skip any documentation-update decision

## CONTEXT BOUNDARIES:

- Available: decisions-log.md with all decisions and specific actions
- Focus: Apply documentation updates, compile code actions
- Limits: Only modify artifacts for [D] decisions, do NOT touch code
- Dependencies: step-05 completed with confirmed decisions

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise unless user explicitly requests a change.

### 1. Load Decisions Log

Read `{checkpointFolder}/decisions-log.md` to get all decisions.

Separate into two lists:
- **[D] Documentation updates** — artifacts to modify
- **[C] Code corrective actions** — items for action-items.md

### 2. Announce Application Start

"**Application des décisions de réalignement.**

**Mises à jour documentation :** [count] artefacts à modifier
**Actions code :** [count] actions à compiler

Le BMad Master applique maintenant les modifications aux artefacts BMAD."

### 3. Apply Documentation Updates

For each [D] decision:

1. **Load** the target artifact at its original location
2. **Apply** the specific modification documented in the decisions log
3. **Verify** the artifact remains internally coherent after modification
4. **Save** the modified artifact in-place
5. **Log** what was changed, where, and the before/after summary

Present progress to the developer:
"✅ [Artifact name] mis à jour — [brief description of change]"

### 4. Cross-Artifact Coherence Verification

After all individual updates are applied:

- Re-read all modified artifacts
- Verify that modifications don't create NEW inconsistencies between artifacts
- If new inconsistencies are found, flag them to the developer:

"**⚠️ Vérification de cohérence post-modification :**
La modification de [artifact A] crée une possible incohérence avec [artifact B] :
- [Description]

Souhaitez-vous que je corrige également [artifact B] pour maintenir la cohérence ?"

Apply additional corrections if developer agrees.

### 5. Compile Code Action Items

For each [C] decision, compile into a structured action items list:

Group by priority (critical first) and by affected area.

### 6. Write Action Items

Create `{checkpointFolder}/action-items.md`:

```markdown
# Actions Correctives à Planifier

## Date: {date}

## Résumé
- Actions totales: X
- 🔴 Critiques: X
- 🟡 Importantes: X
- 🟢 Mineures: X

## Actions par priorité

### 🔴 Actions critiques

#### [MA-ID] [Title]
- **Zone du code:** [specific files/modules affected]
- **Ce qu'il faut faire:** [specific corrective action]
- **Pourquoi:** [reference to the original misalignment]
- **Effort estimé:** [rough estimate if possible]

### 🟡 Actions importantes
[Same pattern]

### 🟢 Actions mineures
[Same pattern]

## Suggestions de planification
[Optional: group related actions into potential sprints or work packages]
```

### 7. Report Application Results

"**Application terminée :**

**Artefacts mis à jour ([count]) :**
- ✅ [List each modified artifact with brief change description]

**Vérification de cohérence :** [Passed / Issues found and resolved]

**Actions code compilées ([count]) :**
- 🔴 [count] critiques
- 🟡 [count] importantes  
- 🟢 [count] mineures

Le détail des actions est dans `action-items.md`."

### 8. Update Checkpoint Summary

Update `{checkpointFolder}/checkpoint-summary.md` frontmatter:
- Append `step-06-application` to `stepsCompleted`
- Set `lastStep: 'step-06-application'`

### 9. Present MENU OPTIONS

Display: **[C] Continuer — Générer le snapshot final**

#### Menu Handling Logic:

- IF C: Verify action-items.md is written, artifacts are updated, and checkpoint-summary.md is updated, then load, read entire file, then execute {nextStepFile}
- IF Any other: help user, then redisplay menu

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Every [D] decision applied to the correct artifact
- Artifacts modified in-place at their original locations
- Post-modification coherence verified
- New inconsistencies flagged and resolved
- Complete action-items.md written with prioritized code actions
- Developer informed of all changes made

### ❌ SYSTEM FAILURE:

- Skipping documentation-update decisions
- Modifying code (not this step's job)
- Changing decisions made in step 05
- Not verifying post-modification coherence
- Creating new inconsistencies between artifacts

**Master Rule:** Apply exactly what was decided. Verify coherence after every change. Skipping items is FORBIDDEN.
