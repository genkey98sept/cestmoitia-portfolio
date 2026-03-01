---
stepsCompleted: ['step-01-discovery', 'step-02-classification', 'step-03-requirements', 'step-04-tools', 'step-05-plan-review', 'step-06-design', 'step-07-foundation', 'step-08-build-step-01', 'step-09-build-next-step', 'step-10-confirmation', 'step-11-completion']
created: 2026-02-28
completionDate: 2026-02-28
status: COMPLETE
approvedDate: 2026-02-28
confirmationDate: 2026-02-28
confirmationType: new_workflow
coverageStatus: complete
---

# Workflow Creation Plan — Dev Checkpoint

## Discovery Notes

**Vision de l'utilisateur :**
Créer un workflow de réconciliation et réalignement du contexte projet BMAD. Le problème fondamental : au fil du développement, les artefacts BMAD (PRD, architecture, stories...) dérivent par rapport à la réalité du code. Cette dérive dégrade la qualité du développement car l'IA et le développeur travaillent avec un contexte qui ne reflète plus le vrai projet. Ce workflow corrige ça en faisant un état des lieux complet, en identifiant les désalignements, et en réalignant concrètement les artefacts.

**Pour qui :**
Développeurs solo ou en équipe utilisant BMAD pour le développement de projets. Réutilisable sur n'importe quel projet BMAD.

**Ce que ça produit :**
1. Un dossier horodaté (snapshot/checkpoint) contenant des fichiers de synthèse sur l'état du développement
2. Des artefacts BMAD mis à jour et réalignés avec la réalité du projet
3. Une trace des décisions prises lors du réalignement

**Insights clés :**
- L'inventaire complet des désalignements doit être présenté en bloc avant les décisions (pas un par un)
- Le workflow doit se terminer par une action concrète : mise à jour effective des artefacts, pas juste un rapport
- Doit être lançable en une commande, sans configuration préalable
- Détection automatique des artefacts BMAD existants
- Questions ciblées et peu nombreuses — pas un interrogatoire

## Classification Decisions

**Workflow Name:** dev-checkpoint
**Target Path:** _bmad/bmm/workflows/4-implementation/dev-checkpoint/

**4 Key Decisions:**
1. **Document Output:** true — Produit un dossier de fichiers de synthèse + met à jour des artefacts existants
2. **Module Affiliation:** BMM (module de développement logiciel) — Phase 4-implementation
3. **Session Type:** Continuable — L'analyse complète + décisions de réalignement peuvent consommer beaucoup de tokens
4. **Lifecycle Support:** Create-only — On commence simple, tri-modal pourra être ajouté si le besoin se confirme

**Structure Implications:**
- Dossier steps-c/ uniquement (create-only)
- Nécessite step-01-init.md avec détection de continuation
- Nécessite step-01b-continue.md pour la reprise de session
- Suivi stepsCompleted dans le frontmatter des fichiers de sortie
- Accès aux variables du module BMM

## Requirements

**Flow Structure:**
- Pattern: Linéaire avec phase de décision groupée
- Phases: Collecte (approfondie, multi-étapes) → Diagnostic (inventaire groupé) → Décision (collaborative) → Application (autonome) → Snapshot (autonome)
- Estimated steps: 7-9 step files (la collecte sera découpée en plusieurs étapes pour la profondeur)
- La collecte est la phase la plus longue et peut s'étendre sur plusieurs étapes

**User Interaction:**
- Style: Mixte — majoritairement autonome pour l'analyse, collaboratif pour les décisions
- Phases autonomes: Collecte (analyse code + artefacts), Application, Snapshot
- Phase collaborative: Décision (présentation des désalignements, choix utilisateur)
- Questions ciblées au lancement pour comprendre le contexte récent
- Decision points: Phase de décision par catégorie de désalignement
- Checkpoint frequency: Entre chaque grande phase

**Inputs Required:**
- Required (détection automatique):
  - Artefacts BMAD existants dans _bmad-output/ (PRD, architecture, stories, UX design...)
  - Code source complet (structure, patterns, qualité, dette technique)
  - Config BMAD (config.yaml) pour le contexte projet
  - Git history (pour comprendre l'évolution)
- Required (code review globale):
  - Conformité architecturale (le code suit-il l'architecture prévue ?)
  - Qualité du code (patterns, conventions, cohérence)
  - Couverture fonctionnelle (implémenté vs prévu)
  - Dette technique identifiée
  - Dépendances et stack technique vs planifié
- Optional:
  - Checkpoint précédent (pour comparer l'évolution)
  - Notes du développeur sur les changements non documentés

**Output Specifications:**
- Type: Dossier horodaté multi-fichiers + mise à jour d'artefacts existants
- Format: Semi-structuré (sections obligatoires pour cohérence entre checkpoints, flexibilité dans le contenu)
- Dossier de sortie:
  ```
  _bmad-output/dev-checkpoints/{timestamp}/
  ├── checkpoint-summary.md
  ├── codebase-analysis.md
  ├── artifacts-review.md
  ├── misalignment-report.md
  ├── decisions-log.md
  └── action-items.md
  ```
- Artefacts BMAD mis à jour directement dans leurs emplacements existants
- Frequency: À la demande

**Success Criteria:**
1. Tous les artefacts BMAD existants ont été analysés et comparés à la réalité
2. Le code a été revu globalement — qualité, patterns, conformité architecturale
3. Chaque désalignement identifié a reçu une décision (mettre à jour la doc OU noter une action sur le code)
4. Les artefacts BMAD sont effectivement mis à jour selon les décisions
5. Le snapshot est complet et exploitable — quelqu'un qui le lit comprend l'état exact du projet

**Instruction Style:**
- Overall: Mixte
- Intent-based pour les phases d'analyse (flexibilité pour s'adapter à chaque projet)
- Prescriptif pour la phase de décision (structure claire : présenter, attendre, appliquer)
- Prescriptif pour le format de sortie (fichiers cohérents entre checkpoints)

## Tools Configuration

**Core BMAD Tools:**
- **Party Mode:** Exclu — workflow analytique, pas créatif
- **Advanced Elicitation:** Exclu — questions ciblées, pas d'exploration ouverte
- **Brainstorming:** Exclu — pas pertinent

**LLM Features:**
- **File I/O:** Inclus — essentiel pour lire artefacts, scanner le code, écrire les fichiers de sortie, mettre à jour les artefacts
- **Sub-Agents:** Inclus — paralléliser l'analyse (agent code + agent artefacts) pour plus de profondeur et rapidité
- **Web-Browsing:** Exclu — pas de besoin de données en temps réel
- **Sub-Processes:** Exclu — Sub-Agents suffit

**Memory:**
- Type: Continuable
- Tracking: stepsCompleted, lastStep, lastContinued dans le frontmatter du checkpoint-summary.md
- Reprise: step-01b-continue.md pour détecter et reprendre un checkpoint en cours

**External Integrations:**
- Aucune requise — tout via les outils natifs de l'IDE (lecture fichiers, git)

**Installation Requirements:**
- Aucune installation supplémentaire requise

## Workflow Structure Design

### File Structure
```
dev-checkpoint/
├── workflow.md
├── data/
│   └── checkpoint-template.md
├── steps-c/
│   ├── step-01-init.md
│   ├── step-01b-continue.md
│   ├── step-02-codebase-analysis.md
│   ├── step-03-artifacts-analysis.md
│   ├── step-04-diagnostic.md
│   ├── step-05-decisions.md
│   ├── step-06-application.md
│   └── step-07-snapshot.md
```

### Step Design

**Step 01 - Init (Continuable)**
- Type: Init (Continuable)
- Goal: Initialiser le checkpoint, détecter les artefacts, poser des questions ciblées
- Détection d'un checkpoint en cours → step-01b
- Découverte automatique des artefacts BMAD
- Découverte d'un checkpoint précédent (optionnel)
- Questions ciblées au développeur
- Création du dossier horodaté + checkpoint-summary.md initial
- Menu: [C] Continuer (pas de A/P)

**Step 01b - Continue**
- Type: Continuation
- Goal: Reprendre un checkpoint en cours
- Lit stepsCompleted depuis checkpoint-summary.md
- Route vers la bonne étape

**Step 02 - Analyse du code source (autonome)**
- Type: Middle (Simple)
- Goal: Code review globale approfondie
- Scan structure projet, patterns, conventions, qualité
- Stack technique, dépendances, git history
- Détection dette technique
- Subprocess: Pattern 2+4 (sub-agents parallèles par zone de code)
- Fallback: Analyse séquentielle en thread principal
- Output: codebase-analysis.md
- Menu: [C] Continuer

**Step 03 - Analyse des artefacts BMAD (autonome)**
- Type: Middle (Simple)
- Goal: Revue approfondie de chaque artefact BMAD
- Lecture et analyse de chaque artefact
- Évaluation cohérence interne entre artefacts
- Évaluation complétude
- Subprocess: Pattern 2 (sub-agent par artefact)
- Fallback: Analyse séquentielle
- Output: artifacts-review.md
- Menu: [C] Continuer

**Step 04 - Diagnostic des désalignements (autonome)**
- Type: Middle (Simple)
- Goal: Comparer code vs artefacts et identifier les désalignements
- Lit codebase-analysis.md + artifacts-review.md
- Comparaison par catégorie: Architecture, PRD/Fonctionnel, UX, Stories, Stack
- Subprocess: Pattern 4 (comparaisons parallèles)
- Fallback: Comparaisons séquentielles
- Output: misalignment-report.md
- Menu: [C] Continuer

**Step 05 - Décisions de réalignement (collaboratif)**
- Type: Middle (Standard)
- Goal: Présenter les désalignements et prendre des décisions avec le développeur
- Lit misalignment-report.md
- Présentation groupée par catégorie
- Pour chaque catégorie: présenter, discuter, décider
- Options: mettre à jour la doc OU action corrective code
- Output: decisions-log.md
- Menu: [A] Élicitation avancée [P] Party Mode [C] Continuer

**Step 06 - Application (autonome)**
- Type: Middle (Simple)
- Goal: Appliquer les décisions en mettant à jour les artefacts BMAD
- Lit decisions-log.md
- Mise à jour effective de chaque artefact
- Vérification de cohérence post-modification
- Liste des actions restantes côté code
- Output: action-items.md + artefacts modifiés in-place
- Menu: [C] Continuer

**Step 07 - Snapshot final**
- Type: Final Step
- Goal: Finaliser le checkpoint et produire le résumé
- Finalisation du checkpoint-summary.md
- Résumé: réalignements effectués + actions restantes
- Marquage status: COMPLETE
- Pas de nextStepFile

### Subprocess Optimization

| Step | Pattern | Description | Fallback |
|------|---------|-------------|----------|
| Step 02 | Pattern 2+4 | Sub-agents parallèles: structure, qualité, stack, git | Analyse séquentielle |
| Step 03 | Pattern 2 | Sub-agent par artefact BMAD | Analyse séquentielle |
| Step 04 | Pattern 4 | Comparaisons parallèles par catégorie | Comparaisons séquentielles |

### Data Flow
```
Step 01 → checkpoint-summary.md (init) + liste artefacts découverts
Step 02 → codebase-analysis.md (lit code source)
Step 03 → artifacts-review.md (lit artefacts BMAD)
Step 04 → misalignment-report.md (lit step 02 + 03)
Step 05 → decisions-log.md (lit step 04 + interaction utilisateur)
Step 06 → action-items.md + artefacts modifiés (lit step 05)
Step 07 → checkpoint-summary.md finalisé (lit tout)
```

### Role & Persona
- Expertise: Analyste technique et architecte logiciel spécialisé BMAD
- Communication: Direct, factuel, structuré. Présente les données clairement.
- Ton: Professionnel mais accessible. Pas de jargon inutile.
- Style: Autonome pour l'analyse, collaboratif et patient pour les décisions.
