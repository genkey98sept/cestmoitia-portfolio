---
name: 'step-02-codebase-analysis'
description: 'Deep autonomous analysis of the codebase - structure, quality, patterns, dependencies, git history'

nextStepFile: './step-03-artifacts-analysis.md'
checkpointFolder: '{checkpointFolder}'
---

# Step 2: Analyse du Code Source

## STEP GOAL:

To perform a comprehensive, autonomous analysis of the entire codebase — structure, code quality, architectural patterns, dependencies, git history, and technical debt — producing a detailed `codebase-analysis.md` report in the checkpoint folder.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT in {communication_language}
- ⚙️ TOOL/SUBPROCESS FALLBACK: If any instruction references a subprocess, subagent, or tool you do not have access to, you MUST still achieve the outcome in your main context thread

### Role Reinforcement:

- ✅ You are an expert code reviewer and software architect
- ✅ Direct, factuel, exhaustif. Analyse en profondeur, pas en surface.
- ✅ You bring deep expertise in code quality, architecture patterns, and technical debt assessment

### Step-Specific Rules:

- 🎯 Analyse approfondie et autonome — prendre le temps nécessaire pour tout capter
- 🚫 FORBIDDEN to compare with BMAD artifacts in this step — comparison happens in step-04
- 💬 Subprocess Pattern 2+4: Use sub-agents in parallel for different analysis zones
- ⚙️ If subprocess unavailable, perform all analysis sequentially in main thread
- 🚫 DO NOT BE LAZY — analyze every significant area of the codebase

## EXECUTION PROTOCOLS:

- 🎯 Follow the MANDATORY SEQUENCE exactly
- 💾 Write complete analysis to {checkpointFolder}/codebase-analysis.md
- 📖 Update stepsCompleted in checkpoint-summary.md
- 🚫 Do NOT skip any analysis area — thoroughness is critical

## CONTEXT BOUNDARIES:

- Available: checkpoint-summary.md with artifactsDiscovered and developer context from step 01
- Focus: Code source ONLY — no artifact comparison yet
- Limits: Analyze what exists, don't prescribe changes
- Dependencies: step-01-init completed, checkpoint folder exists

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise unless user explicitly requests a change.

### 1. Announce Analysis Start

"**Lancement de l'analyse approfondie du code source.**
Cette phase est majoritairement autonome. Le BMad Master va scanner l'ensemble du projet. Cela peut prendre un moment."

### 2. Project Structure Analysis

Scan the entire project structure:

- Directory tree and organization pattern (monorepo, modular, feature-based, layer-based...)
- Key directories and their roles
- File count and distribution by type
- Entry points and configuration files
- Identify the architectural pattern in use (FSD, MVC, hexagonal, etc.)

### 3. Code Quality Review

DO NOT BE LAZY — For EACH significant area of the codebase, launch a subprocess (or analyze sequentially if unavailable) that:

1. Reads the code files in that area
2. Analyzes:
   - Code conventions and consistency (naming, formatting, structure)
   - Component/module organization and cohesion
   - Error handling patterns
   - Type safety and typing coverage
   - Code duplication and DRY compliance
   - Complexity assessment (deep nesting, long functions, large files)
3. Returns structured findings: conventions used, quality issues found, patterns identified

**Areas to analyze (adapt to project):**
- Components/UI layer
- Business logic / services / utilities
- Data layer (API calls, state management, database)
- Configuration and infrastructure
- Tests (if present)

### 4. Stack and Dependencies Analysis

Analyze the technical stack:

- Framework and runtime versions
- Key dependencies and their versions
- Dev dependencies and tooling
- Identify outdated or potentially problematic dependencies
- Build configuration and scripts
- Environment configuration patterns

### 5. Git History Analysis

Analyze recent git history to understand evolution:

- Recent commit patterns and frequency
- Areas of most active development
- Contributors and their focus areas
- Any significant refactoring or pivots visible in history
- Branch structure if relevant

### 6. Technical Debt Identification

Based on the analysis above, identify technical debt:

- Code quality issues that accumulate cost
- Missing tests or test coverage gaps
- Hardcoded values, magic numbers
- TODO/FIXME/HACK comments
- Inconsistent patterns across the codebase
- Dependencies that need updating
- Configuration that needs cleanup

### 7. Write Codebase Analysis Report

Create `{checkpointFolder}/codebase-analysis.md` with the following semi-structured format:

```markdown
# Analyse du Code Source

## Date: {date}

## Structure du projet
[Findings from step 2]

## Qualité du code
[Findings from step 3 — grouped by area]

## Stack technique et dépendances
[Findings from step 4]

## Historique Git
[Findings from step 5]

## Dette technique identifiée
[Findings from step 6 — prioritized]

## Métriques clés
- Nombre de fichiers: X
- Langages principaux: X
- Couverture de tests: X (si applicable)
- Zones critiques identifiées: X
```

### 8. Update Checkpoint Summary

Update `{checkpointFolder}/checkpoint-summary.md` frontmatter:
- Append `step-02-codebase-analysis` to `stepsCompleted`
- Set `lastStep: 'step-02-codebase-analysis'`

### 9. Present Results Summary

Present a brief summary of key findings to the developer:

"**Analyse du code terminée. Voici les points clés :**
- [3-5 most significant findings]
- [Any red flags or notable observations]

Le rapport complet est dans `codebase-analysis.md`. Prêt pour l'analyse des artefacts BMAD."

### 10. Present MENU OPTIONS

Display: **[C] Continuer — Lancer l'analyse des artefacts BMAD**

#### Menu Handling Logic:

- IF C: Verify codebase-analysis.md is written and checkpoint-summary.md is updated, then load, read entire file, then execute {nextStepFile}
- IF Any other: help user, then redisplay menu

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Project structure fully mapped and documented
- Code quality reviewed across all significant areas
- Stack and dependencies analyzed
- Git history insights captured
- Technical debt identified and prioritized
- Complete codebase-analysis.md written to checkpoint folder
- stepsCompleted updated in checkpoint-summary.md

### ❌ SYSTEM FAILURE:

- Superficial analysis that misses significant areas
- Being lazy — skipping code areas or doing surface-level review
- Comparing with BMAD artifacts (not yet — that's step 04)
- Not writing the complete report
- Not updating checkpoint-summary.md

**Master Rule:** Thoroughness is non-negotiable. Every significant area of the codebase must be analyzed. Skipping steps is FORBIDDEN.
