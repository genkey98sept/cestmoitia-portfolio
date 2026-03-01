# Conventional Commits - Règles et Conventions

## Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

## Types

| Type | Usage |
|------|-------|
| `feat` | Nouvelle fonctionnalité |
| `fix` | Correction de bug |
| `refactor` | Refactorisation sans changement de comportement |
| `chore` | Tâches de maintenance (deps, config, scripts) |
| `docs` | Documentation uniquement |
| `style` | Formatage, espaces, points-virgules (pas de changement de logique) |
| `test` | Ajout ou correction de tests |
| `perf` | Amélioration de performance |
| `ci` | Configuration CI/CD |
| `build` | Système de build, dépendances externes |

## Règles de Scope

- Le scope est optionnel mais recommandé
- Utiliser le nom du module, composant ou feature concerné
- Exemples : `feat(auth)`, `fix(api)`, `refactor(utils)`
- Si le changement touche plusieurs scopes, utiliser le scope le plus englobant ou omettre

## Règles de Séparation Sémantique

### Un commit = une préoccupation logique

**FAIRE :**
- Séparer les nouvelles features des corrections de bugs
- Séparer le refactoring des changements fonctionnels
- Séparer les changements de config/deps des changements de code
- Séparer les changements de style/formatage du reste
- Séparer les ajouts de tests des changements de code

**NE PAS FAIRE :**
- Un commit par fichier (trop mécanique)
- Mélanger feat + fix dans un même commit
- Mélanger refactor + feat dans un même commit
- Mettre des changements non liés dans un même commit

### Ordre des commits recommandé

1. `chore` / `build` / `ci` (config, deps) en premier
2. `refactor` (préparation du terrain)
3. `feat` (nouvelles fonctionnalités)
4. `fix` (corrections)
5. `test` (tests associés)
6. `docs` (documentation)
7. `style` (formatage) en dernier

## Bonnes Pratiques des Messages

- Description en minuscules, sans point final
- Impératif présent : "add feature" pas "added feature"
- Maximum 72 caractères pour la première ligne
- Body optionnel pour expliquer le "pourquoi" si nécessaire
- Pas de détails évidents ("update file X" — on le voit dans le diff)
- Être spécifique : "add login form validation" > "update auth"
