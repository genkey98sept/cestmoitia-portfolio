---
stepsCompleted: ['step-01-discovery', 'step-02-classification', 'step-03-requirements', 'step-04-tools', 'step-05-plan-review', 'step-06-design', 'step-07-foundation', 'step-08-build-steps', 'step-09-deploy']
created: 2026-02-28
status: COMPLETE
approvedDate: 2026-02-28
completedDate: 2026-02-28
---

# Workflow Creation Plan

## Discovery Notes

**User's Vision:**
Un workflow "smart-commit" qui analyse en profondeur le contexte d'un projet pour en avoir une compréhension globale (architecture, structure, conventions), puis analyse tous les changements non commités, et propose un plan de commits séparés de manière logique et propre — chaque commit respectant les bonnes pratiques et conventions de nommage et de description. L'utilisateur valide le plan (o/n) avant exécution.

**Who It's For:**
Usage personnel de Doens dans son workflow de développement quotidien.

**What It Produces:**
Un plan de commits structuré et validé, puis l'exécution de commits propres, bien séparés, avec des messages conventionnels (Conventional Commits).

**Key Insights:**
- L'analyse du contexte projet est cruciale — le workflow doit construire une vraie vision d'ensemble pour interpréter les changements intelligemment
- La séparation des commits doit être sémantique et logique, pas mécanique
- Respect strict des conventions de commit (nommage, description)
- Validation utilisateur obligatoire avant exécution (o/n)
- Le workflow doit produire des commits "comme si on avait pris le temps de tout organiser manuellement"

## Classification Decisions

**Workflow Name:** smart-commit
**Target Path:** _bmad/custom/src/workflows/smart-commit/

**4 Key Decisions:**
1. **Document Output:** false
2. **Module Affiliation:** standalone
3. **Session Type:** single-session
4. **Lifecycle Support:** create-only

**Structure Implications:**
- Structure `steps-c/` uniquement (pas de steps-e/ ni steps-v/)
- Pas de logique de continuation (pas de step-01b-continue.md)
- Pas de document de sortie persistant — le workflow exécute des commits git
- Pas de tracking `stepsCompleted` dans un fichier de sortie (le workflow agit, il ne produit pas)
- Stocké en standalone dans `_bmad/custom/src/workflows/smart-commit/`

## Requirements

**Flow Structure:**
- Pattern: linéaire avec boucle de validation
- Phases: (1) Analyse contexte projet, (2) Analyse changements git, (3) Proposition plan de commits, (4) Validation utilisateur (boucle si ajustements), (5) Exécution des commits
- Estimated steps: 4-5 step files

**User Interaction:**
- Style: mostly autonomous avec checkpoint de validation
- Decision points: validation du plan de commits (oui/non/ajuster)
- Checkpoint frequency: un seul — après la proposition du plan

**Inputs Required:**
- Required: un repo git avec des changements non commités (staged ou unstaged)
- Auto-detected: contexte projet (CLAUDE.md, structure, conventions), git status, git diff, git diff --staged, historique récent des commits
- Optional: instructions spécifiques de l'utilisateur (ex: "regroupe le CSS", "sépare le refacto du feat")

**Output Specifications:**
- Type: actions (git add + git commit)
- Artéfact temporaire: plan de commits affiché pour validation (non persisté)
- Résultat final: historique git propre avec messages Conventional Commits

**Success Criteria:**
- Chaque commit est atomique (une seule préoccupation logique)
- Les messages respectent Conventional Commits (feat:, fix:, refactor:, chore:, etc.)
- La séparation est sémantique, pas mécanique (pas "un commit par fichier")
- L'utilisateur a validé le plan avant exécution
- Tous les changements non commités sont couverts (rien d'oublié)
- L'historique git résultant est lisible et propre

**Instruction Style:**
- Overall: prescriptive
- Notes: comportement prévisible et contrôlé pour les opérations git, règles précises pour l'analyse et la séparation

## Tools Configuration

**Core BMAD Tools:**
- **Party Mode:** exclu — workflow analytique/exécutif, pas de brainstorming
- **Advanced Elicitation:** exclu — pas de phase d'exploration profonde
- **Brainstorming:** exclu — pas de génération d'idées

**LLM Features:**
- **Web-Browsing:** exclu — tout est local (git + fichiers projet)
- **File I/O:** inclus — lecture du contexte projet (CLAUDE.md, structure, conventions), lecture des diffs
- **Sub-Agents:** exclu — workflow séquentiel simple
- **Sub-Processes:** exclu — exécution séquentielle

**Memory:**
- Type: single-session
- Tracking: aucun — pas de persistance nécessaire

**External Integrations:**
- Git via commandes bash natives (git status, git diff, git add, git commit) — pas de MCP nécessaire

**Installation Requirements:**
- Aucune installation requise — tout est natif

## Workflow Structure Preview

**Phase 1 : Analyse du contexte projet**
- Lire CLAUDE.md, structure du projet, conventions
- Analyser l'historique récent des commits (style de messages)

**Phase 2 : Analyse des changements**
- Exécuter git status, git diff, git diff --staged
- Interpréter chaque changement à la lumière du contexte projet

**Phase 3 : Proposition du plan de commits**
- Grouper les changements en commits logiques et atomiques
- Générer les messages Conventional Commits
- Afficher le plan à l'utilisateur

**Phase 4 : Validation**
- L'utilisateur valide (oui/non/ajuster)
- Si ajustement → boucle vers Phase 3

**Phase 5 : Exécution**
- Exécuter git add + git commit pour chaque commit du plan
- Confirmation finale

## Workflow Design

### File Structure
```
smart-commit/
├── workflow.md
├── data/
│   └── commit-conventions.md
└── steps-c/
    ├── step-01-init.md
    ├── step-02-plan.md
    ├── step-03-validate.md
    └── step-04-execute.md
```

### Step Design

**step-01-init** (Init, auto-proceed)
- Goal: Analyser le contexte projet et collecter les changements git
- Actions:
  - Lire CLAUDE.md, structure projet, conventions
  - git log --oneline -20 (style de messages)
  - git status, git diff, git diff --staged
  - Construire le modèle mental du projet
- Menu: auto-proceed → step-02
- Type: Init (Non-Continuable)

**step-02-plan** (Middle, simple)
- Goal: Proposer le plan de commits structuré
- Actions:
  - Analyser les changements à la lumière du contexte
  - Grouper sémantiquement en commits atomiques
  - Charger data/commit-conventions.md pour les règles
  - Générer les messages Conventional Commits
  - Afficher le plan formaté
- Menu: C only → step-03
- Type: Middle (Simple)

**step-03-validate** (Custom menu avec boucle)
- Goal: Validation utilisateur du plan de commits
- Actions:
  - Afficher le plan résumé
  - Demander validation : [O] Oui / [A] Ajuster / [X] Annuler
  - Si A: demander les ajustements, régénérer, re-afficher menu
  - Si X: fin du workflow
- Menu: Custom O/A/X
- Type: Branch Step (avec boucle sur A)

**step-04-execute** (Final step)
- Goal: Exécuter les commits validés
- Actions:
  - Pour chaque commit: git add [fichiers] + git commit -m "message"
  - Afficher le résultat de chaque commit
  - Résumé final: X commits exécutés
- Menu: aucun (fin)
- Type: Final Step

### Data Flow
- step-01 → contexte projet + diffs git (en mémoire)
- step-02 → plan de commits (en mémoire, affiché)
- step-03 → plan validé/ajusté (en mémoire)
- step-04 → exécution git (actions irréversibles)

### AI Role
- Expertise: architecte git, expert Conventional Commits
- Ton: concis, technique, direct
- Style: prescriptif
- Langue: {communication_language}

### data/commit-conventions.md
- Types: feat, fix, refactor, chore, docs, style, test, perf, ci, build
- Règles de séparation sémantique
- Patterns de scope
- Bonnes pratiques de messages
- Format: type(scope): description
