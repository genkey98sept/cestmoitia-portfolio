---
stepsCompleted: [1, 2, 3, 4, 5, 6]
inputDocuments: []
date: 2026-02-28
author: Doens
---

# Product Brief: tia

## Executive Summary

Tia est le portfolio personnel de Tianoa, créatif indépendant. Le projet consiste à migrer son site portfolio existant (Framer) vers une stack Next.js maîtrisée, en reproduisant fidèlement le design, les animations et la structure du site de référence. L'objectif est d'obtenir un site professionnel, sans bug, performant, bien référencé et entièrement sous contrôle du développeur — avec un back-office Payload CMS simple permettant à Tianoa de gérer son contenu de façon autonome.

---

## Core Vision

### Problem Statement

Le site Framer actuel de Tianoa présente des bugs non maîtrisables par le développeur (dépendance à un outil no-code tiers). Il n'y a aucun contrôle sur le code, les performances, le SEO, ni sur la structure des données. Toute modification est contrainte par les limites de la plateforme.

### Problem Impact

- Impossible de corriger les bugs existants proprement
- Aucune flexibilité pour faire évoluer le site
- SEO et performances non optimisables
- Dépendance à un abonnement Framer
- Pas de gestion de contenu structurée pour Tianoa

### Why Existing Solutions Fall Short

Framer est puissant pour prototyper mais limité pour un projet en production : pas de contrôle du code, pas de back-office personnalisé, bugs difficiles à diagnostiquer. Recréer le site "from scratch" avec une stack maîtrisée est la seule solution pour avoir un produit propre, pérenne et évolutif.

### Proposed Solution

Recréer pixel-perfect le site portfolio de Tianoa en Next.js, à partir d'une analyse approfondie du site Framer de référence (scraping du design, des animations, de la structure). Le tout structuré selon le pattern **Feature-Sliced Design (FSD)** pour une architecture propre et maintenable. Un back-office **Payload CMS** permettra à Tianoa de gérer ses projets de façon autonome, avec une structure de collection pensée précisément pour le type de contenu créatif affiché.

### Key Differentiators

- **Pixel-perfect** : reproduction exacte du design Framer, animations comprises
- **Architecture FSD** : code structuré, maintenable, règles d'import strictes
- **Ownership total** : code source contrôlé, déployable sur n'importe quelle infra
- **BO sur-mesure** : Payload CMS avec collections pensées pour le contenu de Tianoa
- **SEO & performance** : Next.js avec bonnes pratiques dès le départ

---

## Target Users

### Primary Users

**1. Le Prospect Créatif** — *"Le Directeur Artistique / Producteur"*
- DA en agence, producteur audiovisuel, label musical, marque lifestyle
- Cherche un profil pour une mission précise (photo, montage, motion)
- Parcours : découvre via réseau → visite portfolio → évalue le style → contacte
- Besoin clé : voir rapidement la qualité et la cohérence du travail
- Moment "aha" : tombe sur un projet qui matche exactement ce qu'il cherche

**2. Le Collaborateur Pair** — *"Le Créatif Curieux"*
- Photographe, vidéaste, designer, musicien de la même sphère créative
- Découvre Tianoa via Instagram/réseaux → vient explorer le travail en détail
- Navigation fluide et projets bien présentés sont la priorité
- Besoin clé : immersion visuelle, accès rapide aux détails de chaque projet

**3. Le Curieux / Follower** — *"La Communauté"*
- Suit Tianoa sur les réseaux, veut voir ses dernières créations
- Navigation rapide, essentiellement mobile
- Besoin clé : site rapide, beau, responsive

### Secondary Users

**4. Tianoa (Admin BO)** — *"Le Créateur-Gestionnaire"*
- Utilisateur unique du back-office Payload CMS
- Besoin : ajouter/modifier un projet en quelques minutes, sans friction
- Besoin clé : formulaire bien structuré, upload médias simple et fiable

### User Journey

**Parcours type — Prospect (DA/Producteur) :**

```
Découverte (réseaux sociaux / bouche-à-oreille)
    → Homepage — impact visuel immédiat, hero fort
    → Scroll projets — grille visuelle, filtrage par envie
    → Page projet — détail, contexte, médias (photo/vidéo/montage)
    → Page contact — formulaire ou liens directs
    → Prise de contact
```

**Note méthodologique — Scraping Framer :**
Un audit technique préalable via Playwright/Puppeteer sera nécessaire pour capturer fidèlement le design, les animations, la structure de navigation et l'inventaire complet des projets existants. Cet audit constituera un livrable d'entrée pour le PRD et l'architecture.

---

## Success Metrics

Le succès de **tia** est avant tout **qualitatif** — ce site est une vitrine professionnelle, un "CV vivant" pour Tianoa. Il n'y a pas d'objectif de trafic ou de conversion chiffrée, mais des critères de qualité clairs et non-négociables.

### Business Objectives

- **Tianoa reçoit des opportunités** : des prospects et collaborateurs le contactent via le site après avoir vu son travail
- **Tianoa est autonome** : il peut ajouter, modifier ou retirer un projet seul depuis le BO Payload, sans intervention technique
- **Le site reflète fidèlement son identité créative** : design, ton, sélection de projets — tout doit être à son image
- **Remplacement complet de Framer** : zéro dépendance à la plateforme tierce, zéro bug hérité

### Key Performance Indicators

**Qualité technique (mesurables, non-négociables) :**
- Lighthouse Performance ≥ 90
- Lighthouse SEO ≥ 95
- Lighthouse Accessibility ≥ 85
- Core Web Vitals dans le vert (LCP < 2.5s, CLS < 0.1, INP < 200ms)
- 0 bug bloquant en production au lancement

**Qualité produit (subjectifs mais décisifs) :**
- Fidélité pixel-perfect au design Framer de référence ✓/✗
- Toutes les animations reproduites fidèlement ✓/✗
- Expérience de navigation fluide sur desktop et mobile ✓/✗
- Tianoa valide lui-même le résultat final ✓/✗

**Pas d'analytics prévu** — le succès se mesure par le retour direct de Tianoa et les opportunités reçues, pas par des dashboards.

---

## MVP Scope

### Core Features

**Phase 0 — Audit (pré-requis absolu)**
- Scraping complet du site Framer via Playwright (design, animations, structure, contenu)
- Livrable : document d'audit avec tokens CSS, inventaire pages/sections/projets, timing animations

**Pages & Navigation**
- Homepage (hero, grille projets, toutes sections identiques au Framer)
- Page projet individuelle (détail, médias, contexte)
- Page contact (formulaire ou liens directs — à confirmer selon audit)
- Navigation/header sticky + footer

**Back-Office Payload CMS**
- Collection `Projets` : titre, description, médias (images/vidéos), catégorie, ordre d'affichage, statut (publié/brouillon)
- Collection `Infos` : données globales (bio, liens réseaux, email contact)
- Interface admin accessible uniquement à Tianoa

**Architecture & Technique**
- Next.js 14+ (App Router)
- Feature-Sliced Design strict avec règles d'import enforced (ESLint)
- PostgreSQL + Payload CMS
- Blob storage pour médias
- Déploiement Vercel

### Out of Scope pour MVP

- Blog ou section éditoriale
- Filtres/catégories avancées sur la grille projets
- Analytics (Google Analytics, Plausible, etc.)
- Multilingue
- Fonctionnalités e-commerce ou pricing
- PWA / mode offline
- Internationalisation SEO

### MVP Success Criteria

- Toutes les pages du site Framer reproduites fidèlement
- Toutes les animations fonctionnelles
- Tianoa peut ajouter un projet depuis le BO sans aide
- Lighthouse Performance ≥ 90, SEO ≥ 95
- Validation finale par Tianoa

### Future Vision

- Ajout de filtres projets par catégorie/type
- Section "À propos" enrichie si souhaitée
- Analytics léger (Plausible) si Tianoa veut des stats
- Évolutions du BO (galeries, réordonnancement drag & drop)
- Potentielle extension vers d'autres sections créatives
