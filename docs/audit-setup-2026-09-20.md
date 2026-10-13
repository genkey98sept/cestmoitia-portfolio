# Analyse et remise en route — 20 septembre 2026

## Résultat

Le clone est installé et fonctionne sur ce Mac Apple Silicon, en développement et après compilation de production. Les changements sont sur la branche locale `codex/setup-dependencies`. Aucun déploiement, push Git ou envoi d'email réel n'a été effectué.

- Site local : <http://localhost:3001> ; administration : <http://localhost:3001/admin>.
- PostgreSQL 17.11 dans un conteneur Docker dédié, contexte Colima, port 5432 sur l'interface locale.
- Dix médias et dix photos de galerie importés depuis Git, informations du site initialisées.
- Aucun projet artificiel conservé ; aucun compte administrateur de test conservé. Le premier compte reste à créer dans `/admin`.
- `pnpm audit` : **0 vulnérabilité connue**, y compris les dépendances de développement, au moment du contrôle.

## Ce que contient le projet

Il s'agit de la migration du portfolio Framer de Tia vers une application Next.js avec gestion de contenu intégrée. Le dépôt comprend aussi la méthode BMAD, des documents de conception et un ancien audit de février 2026. Ces documents restent utiles pour comprendre l'intention, mais ne décrivent pas tous l'état actuel du code.

### Application publique

| Route | Fonctionnement |
| --- | --- |
| `/` | Hero, clients, projets publiés, présentation, services, expérience, contact |
| `/work` | Liste des projets publiés, triés par ordre d'affichage |
| `/work/[slug]` | Détail, sous-projets, texte Lexical, images, vidéos YouTube ; 404 si absent/non publié |
| `/photography` | Galerie CMS avec image vedette et mosaïque |
| `/contact` | Informations de contact et Server Action utilisant Resend |
| `/sitemap.xml` | Pages publiques et slugs de projets |

Les composants de lecture utilisent l'API locale de Payload côté serveur. Les pages publiques sont pré-rendues au build ; les hooks CMS invalident les routes après modification. L'administration, les API REST/GraphQL et le webhook restent dynamiques. Motion, Lenis, les polices locales Clash Display et Inter via `next/font` constituent la partie visuelle.

### CMS et données

- **Users** : authentification administrateur et sessions.
- **Media** : fichiers locaux ou Vercel Blob, textes alternatifs, variantes thumbnail/card/full générées par Sharp.
- **Projects** : slug unique, couverture obligatoire, galeries, sous-projets, vidéos, ordre et statut brouillon/publié.
- **Gallery** : relation média, légende, image vedette, ordre et statut.
- **SiteInfo** : informations générales, coordonnées, réseaux, services et expériences.

PostgreSQL contient 18 tables après application de la migration initiale, en incluant les tables internes et les tableaux/relationnels gérés par Payload.

### Organisation du code

Les couches FSD (`_pages`, `widgets`, `features`, `entities`, `shared`) structurent l'interface. `src/app` contient les conventions Next.js ; `collections`, `globals` et `migrations` contiennent le backend CMS. Les fichiers `index.ts` définissent les API publiques des modules. Les restrictions d'import sont contrôlées par ESLint et Steiger.

## Versions retenues

Les versions de départ ci-dessous viennent du manifeste et du lockfile du clone. Les versions choisies ont été contrôlées dans le registre npm et installées ensemble, puis vérifiées par compilation et tests.

| Composant | Clone | Version retenue |
| --- | --- | --- |
| Next.js / eslint-config-next | 15.4.11 | 16.3.5 |
| Payload et ses quatre intégrations directes | 3.78.0 | 3.90.1, strictement alignées |
| React / React DOM | 19.2.3 | 19.3.0 |
| Tailwind CSS / PostCSS | 4.2.0 | 4.3.3 |
| Motion | 12.34.3 | 13.4.0 |
| Lenis | 1.3.17 | 1.3.26 |
| GraphQL | 16.13.0 | 16.14.2 |
| Resend | 6.9.3 | 6.28.1 |
| Sharp | 0.34.5 | 0.35.4 |
| Zod | 4.3.6 | 4.6.5 |
| tailwind-merge | 3.5.0 | 3.7.0 |
| Playwright | 1.58.2 | 1.63.0 |
| ESLint | 9.39.3 | 9.39.5 |
| Steiger / plugin FSD | 0.5.11 / 0.5.7 | 0.6.0 / 0.7.0 |
| tsx | 4.21.0 | 4.23.15 |
| TypeScript | 5.9.3 | 5.9.3, verrouillée |
| Types Node | 20.19.33 | 22.20.4 |
| Types React / React DOM | 19.2.14 / 19.2.3 | 19.3.0 |
| @next/env direct | 16.1.6 | 16.3.5 |

`clsx` était déjà à jour. `cross-env` et `@eslint/eslintrc` ne sont plus nécessaires et ont été retirés. Les dépendances indirectes ont également été actualisées, pas seulement celles de `package.json`.

### Choix de compatibilité

- **Node 22.23.2** et **pnpm 10.34.5**, déjà présents sur le Mac, sont désormais déclarés explicitement. Aucun changement du Node global utilisé par les autres projets.
- GraphQL 17 n'est pas retenu : Payload déclare GraphQL 16 dans ses peer dependencies.
- TypeScript 6 a été évalué puis écarté : `tsconfck`, utilisé par Steiger, exige TypeScript 5. TypeScript 7 dépasse également la plage prise en charge par typescript-eslint.
- ESLint 10 n'est pas retenu : `eslint-plugin-react` déclare sa compatibilité jusqu'à ESLint 9. ESLint 9 est signalé comme déprécié par npm ; sa mise à niveau dépend donc de cette chaîne d'outils.
- Motion 13 change l'intégration avec certaines bibliothèques CSS-in-JS ; le projet utilise Tailwind et n'emploie pas cette intégration. Ses animations ont été vérifiées dans le navigateur.

## Corrections effectuées

### Installation et exécution

1. Ajout d'une base Docker Compose avec volume persistant, healthcheck et port limité à `127.0.0.1`.
2. Génération de `.env.local` avec secrets aléatoires, permissions `0600`, sans écraser un fichier existant.
3. Documentation des variables email manquantes et du choix du contexte Docker propre au projet.
4. Passage explicite à ESM. Suppression du monkey patch de `Module._resolveFilename` et du parseur `.env` artisanal ; les scripts utilisent maintenant `@next/env`.
5. Ajout de commandes pour le démarrage/arrêt/état de la base, la génération Payload, les migrations, les tests et le contrôle global.
6. Stockage `media/`, résultats de tests et données temporaires exclus de Git.
7. Réparation de `__dirname` dans l'ancien scraper pour conserver sa compatibilité ESM. Ce script historique n'a pas été exécuté contre le site externe.

### Migration Next.js et architecture

1. Renommage de `src/pages` en `src/_pages` et retrait du faux dossier racine `pages/`. Next.js 16 refusait le mélange du Pages Router racine et de l'App Router sous `src`.
2. Adaptation des appels `revalidateTag` à l'API Next.js 16, avec expiration immédiate conservant le comportement existant.
3. Utilisation de Turbopack avec l'intégration officielle `withPayload`, retrait de l'ancien réglage Webpack artisanal.
4. Migration d'ESLint vers sa configuration plate native Next.js ; activation du lint sur les scripts de setup et de seed.
5. Correction de trois imports interdits entre modules FSD : type Media commun déplacé dans `shared/model`, menu rapproché du header qui le possède.
6. Correction du montage du portail du menu et de l'avertissement React sur ses mutations DOM. L'initialisation de Lenis conserve une exception locale documentée à `set-state-in-effect`, puisqu'elle expose une instance navigateur externe au contexte.
7. Ajout de `sizes` aux images de logos, après détection des avertissements dans le navigateur.
8. Conservation des instructions `AGENTS.md` et `CLAUDE.md` générées par Next.js, pointant vers sa documentation locale correspondant à la version installée.

Le plugin FSD comprend le préfixe `_pages`, mais sa règle de détection de fautes de nom le signale encore. Cette seule règle est désactivée pour ce dossier ; les autres contrôles d'architecture restent actifs.

### Fiabilité et sécurité

1. Les lectures publiques des collections Projects et Gallery filtrent désormais les brouillons. Le filtrage des pages frontend seul ne protégeait pas les API CMS.
2. Sans `RESEND_API_KEY`, le formulaire retourne une erreur lisible, au lieu de laisser le constructeur Resend déclencher une exception non gérée.
3. Le webhook rejette un secret absent, les corps JSON invalides et les cibles mal formées ; prise en charge explicite de la galerie.
4. Les données JSON-LD échappent `<` pour empêcher un contenu CMS de fermer la balise `<script>`.
5. Deux contraintes transitives documentées dans `pnpm-workspace.yaml` : DOMPurify 3.4.15 pour Monaco et esbuild 0.25.12 pour l'ancien chargeur de Drizzle. Cela supprime les alertes laissées par leurs versions imposées en amont.

Le premier audit après actualisation des dépendances directes remontait 52 avis, dont 24 élevés. L'actualisation des dépendances indirectes et les deux contraintes ci-dessus aboutissent à zéro avis. Ces chiffres concernent des avis npm, pas une démonstration de 52 failles exploitables dans ce site.

### Données et migrations

- Le seed historique dépend de **76 fichiers de médias absents du clone**. L'import s'arrête maintenant avant toute modification si l'archive est incomplète.
- `seed:local` fournit un démarrage reproductible avec les dix photos versionnées et les informations existantes du site. Plusieurs exécutions ont conservé dix médias et dix photos.
- Les imports historiques réutilisent les médias et projets déjà présents et retournent un échec réel lorsqu'un import est incomplet.
- Les scripts ne se connectent plus au canal HMR d'un autre serveur Next.js. Payload conserve toutefois une connexion PostgreSQL réservée après `destroy()` ; les scripts ponctuels et le lanceur de tests CMS terminent explicitement leur processus après les opérations attendues.
- Une migration initiale et son snapshot sont versionnés pour initialiser une base de production vide. Ils ne doivent pas être appliqués directement à une base existante créée en mode « push » sans préparer son état initial.

## Vérifications réalisées

| Contrôle | Résultat |
| --- | --- |
| Installation avec lockfile figé, puis vérification hors ligne | Réussite |
| Génération des types et import map Payload | Réussite |
| ESLint, TypeScript, architecture FSD | Réussite |
| Tests unitaires contact et injection JSON-LD | 4/4 |
| Test PostgreSQL réel : brouillons, publication, suppression non autorisée | 1/1 |
| Tests navigateur desktop/mobile en développement | 14/14 |
| Build Next.js 16 avec Turbopack | Réussite |
| Même suite navigateur sur le serveur de production local | 14/14 |
| Connexion administrateur et éditeur de projet dans le navigateur | Réussite |
| Création REST d'un projet, page détail et invalidation du portfolio | Réussite |
| Passage en brouillon après build : retrait du portfolio, détail 404, API 404 | Réussite |
| Migration initiale sur une base temporaire vide | 18 tables créées, migration enregistrée |
| Seed historique sans archive | Échec explicite attendu, galerie locale conservée |
| Audit npm complet | 0 vulnérabilité connue |

Les utilisateurs et projets temporaires de validation ont été supprimés. La base temporaire de migration et le serveur de production de validation sont nettoyés en fin d'intervention ; le serveur de développement et la base du projet restent disponibles.

## Limites et suites utiles

- **Contenus originaux** : il faut l'archive SwissTransfer ou une sauvegarde de la base et de ses médias pour retrouver tous les projets. Le dépôt ne permet pas de les reconstituer fidèlement.
- **Emails et stockage cloud** : Resend et Vercel Blob ne sont pas configurés ; aucun envoi externe ou upload cloud n'a été testé. Les médias locaux et leurs variantes Sharp ont été testés.
- **Emails de compte CMS** : aucun adaptateur email Payload n'est configuré pour la récupération de mot de passe. Resend sert actuellement uniquement au formulaire public.
- **Formulaire public** : validation et honeypot existent ; ajouter une limitation de débit avant une exposition publique importante.
- **Diagnostics de données** : plusieurs composants masquent encore les erreurs CMS par un contenu vide. Une indisponibilité réelle de la base pourrait ressembler à un site sans contenus ; prévoir une meilleure journalisation avant exploitation durable.
- **Types métier** : les fonctions de conversion CMS emploient encore des `any` explicites et des types d'identifiants historiques. La compilation passe, mais l'exploitation des types Payload générés permettrait de renforcer ces contrats.
- **Accessibilité** : le parcours clavier de base est testé, pas un audit WCAG complet. Le menu modal mérite notamment une vérification dédiée du confinement et de la restitution du focus.
- **Dépendances amont** : l'ancien chargeur esbuild-kit et tsconfck restent dépréciés dans la chaîne Payload/Steiger ; l'audit ne leur attribue plus de vulnérabilité connue après mise à jour. Revoir les contraintes lors des prochaines versions.
- **Production distante** : aucun environnement Vercel, base distante, domaine, sauvegarde automatisée ou CI GitHub n'a été créé. Les commandes locales et la migration préparent la suite, sans modifier une infrastructure distante.

## Références vérifiées

- [Installation et compatibilité Payload](https://payloadcms.com/docs/getting-started/installation)
- [Migration Next.js 16](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [Migrations PostgreSQL avec Payload](https://payloadcms.com/docs/database/migrations)
- [FSD avec Next.js](https://feature-sliced.design/docs/guides/tech/with-nextjs)
- [Migration Motion](https://motion.dev/docs/react-upgrade-guide)
- [Versions prises en charge par typescript-eslint](https://typescript-eslint.io/users/dependency-versions/)
- [Politique de support PostgreSQL](https://www.postgresql.org/support/versioning/)

Les peer dependencies effectivement installées, le lockfile et les tests priment lorsqu'une documentation générale ne reflète pas encore une version précise.
