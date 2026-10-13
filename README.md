# cestmoitia — portfolio de Tia

Portfolio Next.js (App Router), React, TypeScript et Tailwind CSS, avec Payload CMS et PostgreSQL. Les contenus se gèrent dans `/admin` : projets, galerie, médias et informations du site. Lenis assure le défilement en respectant la préférence de mouvement réduit.

## Installation locale

Prérequis : **Node 22.23.2** (`.nvmrc`), **pnpm 10.34.5**, Docker et Docker Compose. Sur ce Mac, Node 22 et Colima sont déjà installés. Les versions sont verrouillées dans `package.json` et `pnpm-lock.yaml`. Ne pas mélanger npm, Yarn et pnpm.

```sh
# Si vous utilisez nvm : nvm install && nvm use
corepack pnpm install --frozen-lockfile
pnpm setup
```

`pnpm setup` crée `.env.local` avec des secrets aléatoires et des permissions privées. Il ne remplace jamais un fichier existant. Si Docker utilise Colima, démarrer `colima start` au besoin et ajouter `DOCKER_CONTEXT=colima` à `.env.local`. Ce réglage ne change pas le contexte global de Docker.

```sh
pnpm db:up
pnpm generate
pnpm seed:local
pnpm dev
```

- Site : <http://localhost:3001>
- Administration : <http://localhost:3001/admin> — créer son premier compte à l'écran.
- PostgreSQL : `127.0.0.1:5432`, base et utilisateur `tia`, mot de passe dans `.env.local`.

Le port 3001 évite le service déjà présent sur le port 3000. Pour le changer, modifier ensemble `PORT` et `NEXT_PUBLIC_SITE_URL`. Pour changer le port PostgreSQL, modifier ensemble `POSTGRES_PORT` et le port de `DATABASE_URL`.

`pnpm seed:local` initialise les informations du site et les dix photos présentes dans Git. Il conserve les contenus existants et ne crée pas de doublons. Il refuse une base distante et le stockage Blob. **Les projets originaux ne sont pas inclus** : leurs médias sont dans une archive SwissTransfer exclue du dépôt.

## Au quotidien

```sh
pnpm db:up       # Démarrage de la base, attente du healthcheck
pnpm dev         # Site et CMS avec rechargement automatique
pnpm db:status   # État de la base
pnpm db:logs     # Derniers journaux PostgreSQL
pnpm db:down     # Arrêt, sans suppression des données
```

Les données PostgreSQL persistent dans le volume Docker `cestmoitia-portfolio_postgres_data`. Les médias téléversés localement sont dans `media/`, ignoré par Git. Sauvegarder **la base et les médias** ensemble. Un arrêt de Docker ou de Colima ne supprime pas ce volume. Ne pas utiliser `docker compose down -v` sauf pour supprimer volontairement la base locale.

## Variables d'environnement

Toutes les variables attendues figurent dans `.env.example`. Next.js et les scripts utilisent le chargeur officiel `@next/env`, avec sa priorité habituelle (`process.env`, fichiers locaux, fichiers propres à l'environnement, `.env`).

| Variable | Usage |
| --- | --- |
| `DATABASE_URL` | Connexion PostgreSQL de Payload |
| `PAYLOAD_SECRET` | Secret de chiffrement/signature ; conserver sa valeur pour une base existante |
| `POSTGRES_PASSWORD`, `POSTGRES_PORT` | Base Docker locale uniquement |
| `PORT`, `NEXT_PUBLIC_SITE_URL` | Port local et URL canonique publique |
| `REVALIDATION_SECRET` | Secret du webhook `POST /api/revalidate` |
| `RESEND_API_KEY` | Envoi réel du formulaire de contact, optionnel en local |
| `EMAIL_FROM`, `EMAIL_NAME`, `ADMIN_EMAIL` | Expéditeur vérifié et destinataire du formulaire |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob, optionnel ; sinon stockage local dans `media/` |
| `DOCKER_CONTEXT` | Contexte Docker choisi pour ce projet, optionnel |
| `SEED_MEDIA_ROOT` | Répertoire de l'archive originale, optionnel |

Sans clé Resend, le site et le CMS fonctionnent ; soumettre le formulaire affiche un message d'indisponibilité. Aucun email n'est envoyé. Pour activer les emails, renseigner une clé et un domaine expéditeur vérifié dans Resend. Le service email natif de Payload (réinitialisation des mots de passe administrateurs) n'est pas encore configuré.

Ne jamais versionner `.env.local`, les secrets, les médias locaux ou une sauvegarde de base.

## Importer les projets originaux

1. Récupérer l'archive d'origine et l'extraire en conservant ses sous-dossiers `PHOTO/`, `VIDEO/`, etc.
2. Renseigner `SEED_MEDIA_ROOT` dans `.env.local` avec le chemin du dossier `Portfolio 2026 maybe` (sans inclure les sous-dossiers).
3. Exécuter `pnpm seed`.

L'import vérifie les fichiers avant toute modification, réutilise les médias/projets déjà importés et signale un échec par un code de sortie non nul. `pnpm seed:media` importe uniquement les médias ; `pnpm seed:data` importe les textes et projets avec les médias déjà en base. Le seed historique réapplique les informations du site.

Si Payload a renommé un fichier lors d'une collision, fournir l'archive source pour vérifier son contenu et retrouver le bon média. Sans archive, `seed:data` accepte uniquement les noms d'origine ; il refuse de deviner à partir d'un suffixe.

**`pnpm seed:clean` supprime les projets, la galerie et les médias avant réimport.** Ne pas l'utiliser sur une base contenant des modifications à conserver. Vérifier `DATABASE_URL` avant toute opération de seed ou de migration.

## Vérifications

```sh
pnpm check                  # Génération Payload, ESLint, architecture FSD, TypeScript, tests unitaires
pnpm test:integration       # Base locale initialisée : contrôle réel des droits brouillon/publication
pnpm exec playwright install chromium  # Ou PLAYWRIGHT_CHANNEL=chrome dans .env.local
pnpm test:e2e               # Navigation, galerie, contact sans envoi, admin et webhook ; desktop/mobile
pnpm build                  # Génération Payload puis build de production (base disponible)
pnpm start                  # Serveur de production après build
pnpm audit                  # Vulnérabilités publiées des dépendances
```

`CAPTURE_UI=1 pnpm test:e2e` sauvegarde les vues des quatre pages publiques sur ordinateur et mobile dans `test-results/` (non versionné).

Le build régénère les types Payload ignorés par Git et l’import map avant la compilation Next.js. Il fonctionne ainsi sur un checkout neuf, y compris sur Vercel, sans dépendre d’un précédent `pnpm check`.

Au 12 octobre 2026, les correctifs disponibles sont intégrés. `pnpm audit` signale encore [l'avis non corrigé sur `braces`](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), une dépendance transitive de l'outillage et de Payload. Cet avis reste visible dans l'audit ; aucune exclusion ne le masque.

Les tests d'intégration créent des contenus temporaires puis les suppriment. Les tests navigateur utilisent le serveur local existant ou le démarrent automatiquement ; arrêter `pnpm start` pour tester explicitement le mode développement. Le scénario contact est ignoré lorsqu'une clé Resend est configurée. Sur ce Mac, `PLAYWRIGHT_CHANNEL=chrome` réutilise Google Chrome déjà installé. Les tests CMS utilisent `--test-force-exit`, car Payload conserve une connexion PostgreSQL réservée après `destroy()`.

## Architecture

```text
src/app/                 Routes Next.js, layouts frontend/Payload et API
src/_pages/              Composition des pages (Feature-Sliced Design)
src/widgets/             Grandes sections : hero, portfolio, navigation, footer…
src/features/            Formulaire de contact et revalidation
src/entities/            Projets, galerie et informations du site
src/shared/              UI, configuration, utilitaires et client Payload
src/collections/         Modèles CMS : Users, Media, Projects, Gallery
src/globals/             Informations globales du site
scripts/                 Installation, base locale, seeds et données d'origine
tests/                   Tests unitaires, intégration CMS et navigateur
_bmad-output/            Documents historiques de cadrage (peuvent dater)
```

La couche FSD utilise `src/_pages/` pour éviter le conflit avec le dossier réservé `pages` de Next.js. Les routes restent dans `src/app/`.

## Base de données et production

En développement, Payload synchronise automatiquement son schéma PostgreSQL (« push mode »). En production, utiliser des migrations versionnées :

```sh
pnpm db:migrate:create nom-de-la-modification
pnpm db:migrate:status
pnpm db:migrate
```

La migration initiale versionnée crée le schéma complet sur une base vide. **Ne pas l'appliquer telle quelle à une base existante déjà créée en mode développement** : il faut préparer son état initial de migrations. Les migrations doivent être relues et validées sur une base de test avant application à une base contenant des données. Le build ne lance pas de migration et ne déploie rien. Pour un hébergement sans disque persistant, activer Vercel Blob, fournir les secrets de production et l'URL canonique réelle. Ne pas copier les identifiants Docker locaux en production.

Sources : [installation Payload](https://payloadcms.com/docs/getting-started/installation), [migrations PostgreSQL/Payload](https://payloadcms.com/docs/database/migrations), [migration Next.js 16](https://nextjs.org/docs/app/guides/upgrading/version-16).
