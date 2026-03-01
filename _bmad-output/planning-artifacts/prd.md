---
stepsCompleted: [step-01-init, step-02-discovery, step-02b-vision, step-02c-executive-summary, step-03-success, step-04-journeys, step-05-domain, step-06-innovation, step-07-project-type, step-08-scoping, step-09-functional, step-10-nonfunctional, step-11-polish]
classification:
  projectType: web_app
  domain: general
  complexity: low
  projectContext: greenfield
inputDocuments: [product-brief-tia-2026-02-28.md]
workflowType: 'prd'
documentCounts:
  briefs: 1
  research: 0
  brainstorming: 0
  projectDocs: 0
  projectContext: 0
---

# Product Requirements Document - tia

**Author:** Doens
**Date:** 2026-02-28

## Executive Summary

**tia** est la migration pixel-perfect du portfolio Framer de Tianoa (https://cestmoitia.framer.website) vers une stack Next.js maîtrisée. Le site existant présente des bugs impossibles à corriger sans accès au code source. L'objectif : recréer exactement le même design et les mêmes animations, avec une architecture Feature-Sliced Design (FSD) stricte, un back-office Payload CMS pour l'autonomie de gestion, et des performances/SEO optimisés nativement. Le contenu existant (projets, médias) sera migré via des scripts de seed, les médias étant fournis directement par Tianoa.

Utilisateurs cibles : prospects créatifs (DA, producteurs, agences), collaborateurs pairs, followers. Utilisateur admin unique : Tianoa via Payload CMS.

### What Makes This Special

Ce n'est pas un portfolio from scratch — c'est une **migration technique** d'un design validé. Le site Framer est la spec visuelle vivante : chaque pixel, chaque animation, chaque transition doit être fidèlement reproduite en code. La valeur réside dans la combinaison de cette fidélité visuelle avec une architecture technique exemplaire (FSD strict, règles d'import enforced) et un BO sur-mesure. Tianoa garde son identité visuelle, gagne le contrôle total de son code et l'autonomie de gestion.

## Project Classification

- **Type :** Web App (Next.js, App Router, SSR/SSG)
- **Domaine :** Général — portfolio créatif audiovisuel
- **Complexité domaine :** Low (pas de compliance, pas de données sensibles)
- **Complexité technique :** Medium-High (pixel-perfect, animations, FSD strict)
- **Contexte :** Greenfield (nouveau codebase, design de référence existant)
- **Migration data :** Scripts de seed pour peupler Payload avec le contenu existant du site Framer

## Success Criteria

### User Success

- **Visiteur (Prospect/Collab)** : trouve un projet pertinent et accède à la page contact en ≤ 3 clics depuis la homepage
- **Visiteur mobile** : expérience identique au desktop — navigation fluide, médias lisibles, aucun bug de layout
- **Premier visiteur** : ressent immédiatement l'identité visuelle de Tianoa dès le hero — impact en < 2 secondes (LCP)
- **Tianoa (Admin)** : crée et publie un nouveau projet complet (titre, description, médias) en ≤ 5 minutes via Payload

### Business Success

- **Remplacement Framer effectif** : site Next.js en production, abonnement Framer annulable
- **Autonomie totale** : Tianoa n'a besoin d'aucune assistance technique pour gérer son contenu au quotidien
- **Qualité perçue** : Tianoa valide que le site est "au moins aussi beau" que la version Framer

### Technical Success

- Toutes les cibles NFR Performance et Accessibilité atteintes (voir section Non-Functional Requirements)
- Lighthouse SEO ≥ 95
- 0 bug bloquant en production au lancement
- Architecture FSD validée : aucune violation de règles d'import (ESLint enforced, CI/CD)
- Fidélité pixel-perfect validée par comparaison visuelle Framer vs Next.js

### Measurable Outcomes

| Outcome | Mesure | Cible |
|---------|--------|-------|
| Performance | Lighthouse score | ≥ 90 desktop, ≥ 85 mobile |
| SEO | Lighthouse score | ≥ 95 |
| Accessibilité | Lighthouse score | ≥ 85 |
| Fidélité design | Comparaison visuelle | 100% identique |
| Animations | Audit visuel | Toutes reproduites |
| Autonomie BO | Test utilisateur Tianoa | Projet créé en < 5min |
| Bugs production | Bug tracker | 0 bloquant |
| Architecture FSD | ESLint CI/CD | 0 violation |

## Product Scope & Development Strategy

### MVP Strategy

**Approche :** Experience MVP — reproduire l'expérience exacte du site Framer, BO inclus pour l'autonomie de gestion.

**Ressources :** Dev solo (Doens) assisté par agents IA. Pas de designer dédié — le design est le site Framer.

**Journeys supportés :** J1 (Prospect), J2 (Mobile), J3 (Edge case), J4 (Admin Tianoa) — tous les journeys dès le MVP.

### Phase 0 — Audit & Migration Data

- Scraping Framer via Playwright : design, animations, structure, contenu
- Inventaire complet : pages, sections, projets, médias, tokens CSS
- Scripts de seed pour peupler Payload avec les données existantes
- Tianoa fournit les médias originaux (vidéos, photos HD)

### Phase 1 — MVP

**Frontend Next.js :**
- Homepage pixel-perfect (hero, grille projets, toutes sections)
- Page `/work` — listing projets dédié (découvert lors de l'audit Framer)
- Page projet individuelle `/work/[slug]` (détail, médias, contexte)
- Page `/photography` — galerie photo dédiée (découvert lors de l'audit Framer)
- Page contact `/contact` (formulaire fonctionnel avec validation et envoi email)
- Navigation sticky + footer
- Toutes les animations reproduites fidèlement
- Responsive : desktop, tablet, mobile

**Back-Office Payload CMS :**
- Collection `Projets` : titre, description, médias, catégorie, ordre, statut
- Collection `Infos` : données globales (bio, liens réseaux, email)
- Upload médias (images/vidéos) vers Blob storage

**Architecture :**
- FSD strict avec ESLint rules enforced
- Next.js 14+ App Router
- PostgreSQL + Payload CMS
- Blob storage pour médias
- Déploiement Vercel

**Must-Have Justification :**

| Feature | Justification |
|---------|--------------|
| Audit Framer (Phase 0) | Pré-requis — sans ça, on ne sait pas quoi build |
| Homepage pixel-perfect | Première impression = critique |
| Page projet détaillée | Core value = voir le travail |
| Page contact | Conversion = être contacté |
| Navigation sticky + footer | Structure de base |
| Toutes animations | Priorité absolue du client |
| Responsive (desktop/tablet/mobile) | Audience mobile dominante (Instagram) |
| SEO de base (metadata, sitemap, OG) | Visibilité Google + partage réseaux |
| Architecture FSD enforced | Priorité absolue technique |
| Payload CMS + Collections | Autonomie Tianoa |
| Scripts de seed | Migration contenu existant |
| Déploiement Vercel | Mise en prod |

### Phase 2 — Growth (Post-MVP)

- Filtres projets par catégorie/type
- Drag & drop ordering dans le BO
- Optimisations images avancées (blur placeholder, AVIF)
- Section "À propos" enrichie (si souhaitée)
- Upload chunked résilient (connexion Tahiti)

### Phase 3 — Expansion (Future)

- Analytics léger (Plausible) si souhaité
- Galeries médias enrichies dans le BO
- Extension vers nouvelles sections créatives
- Blog/édito si besoin émerge

### Risk Mitigation

**Pixel-perfect animations :**
- Phase 0 d'audit approfondi pour documenter chaque animation avant de coder
- Fallback : Tianoa a dit "pas obligé d'en faire autant si c'est trop contraignant"
- Implémenter les animations les plus impactantes d'abord, les subtiles ensuite

**Architecture FSD :**
- Setup ESLint + règles d'import dès le jour 1, avant tout code feature
- Non-négociable

**Connexion Tahiti :**
- CDN edge Vercel pour les visiteurs, upload simple d'abord puis chunked en Phase 2
- Tester l'expérience admin depuis une connexion simulée basse

**Scope creep :**
- Ce document de scoping fait référence. Tout ce qui n'est pas Phase 1 attend.

## User Journeys

> **Contexte clé :** Tianoa vit et travaille à **Tahiti** (Polynésie française). Cela impacte le SEO (référencement local + international), la latence (CDN Pacifique), et les conditions d'upload depuis le BO (connexion potentiellement limitée).

### Journey 1 — Le Prospect qui cherche un créatif

**Persona :** Sarah, 34 ans, Directrice Artistique dans une agence lifestyle parisienne.

**Opening Scene :** Sarah prépare un shoot de campagne avec un thème tropicale/océan. Un collègue lui envoie un lien Instagram d'un créatif basé à Tahiti — Tianoa. Intriguée par l'univers polynésien, elle clique sur le lien dans sa bio.

**Rising Action :** Le site charge instantanément depuis Paris (CDN edge) — le hero l'accueille avec une identité visuelle forte, noir et blanc, qui inspire confiance. Elle scroll et découvre la grille de projets. Chaque thumbnail raconte déjà quelque chose. Elle clique sur un projet qui ressemble à ce qu'elle cherche — une page détail s'ouvre avec les médias en plein format, le contexte du projet, le type de travail.

**Climax :** En voyant un montage vidéo tourné en Polynésie pour une marque lifestyle, Sarah se dit : "C'est exactement ce style." Elle navigue vers Contact en un clic.

**Resolution :** Elle envoie un message via le formulaire de contact. Le lendemain (décalage horaire Tahiti), Tianoa répond. Une collaboration démarre.

> **Capabilities révélées :** Homepage hero impactant, grille projets visuelle, page projet détaillée (médias, contexte), navigation contact en ≤ 3 clics, formulaire de contact fonctionnel, CDN performant (edge global), temps de chargement < 2.5s.

---

### Journey 2 — Le Follower sur mobile

**Persona :** Yassine, 22 ans, étudiant en cinéma, suit Tianoa sur Instagram depuis 6 mois.

**Opening Scene :** Yassine voit une story Instagram de Tianoa qui tease un nouveau projet tourné à Moorea. Il swipe up et arrive sur le site depuis son iPhone.

**Rising Action :** Le site se charge vite, même en 4G. Le layout est parfaitement adapté mobile — pas de scroll horizontal, pas de texte trop petit, pas d'image coupée. Il scroll la homepage, admire les projets. Les animations sont fluides même sur mobile.

**Climax :** Il tombe sur le nouveau projet teasé — les vidéos se chargent sans lag, les photos sont nettes. Il screenshot pour le montrer à un pote.

**Resolution :** Yassine revient régulièrement quand Tianoa poste de nouveaux projets. Le site est bookmarké.

> **Capabilities révélées :** Responsive mobile pixel-perfect, performance mobile (LCP, CLS), médias optimisés pour mobile (lazy loading, formats adaptés), navigation tactile fluide, animations performantes sur device mobile.

---

### Journey 3 — Le Prospect face à un edge case

**Persona :** Marc, 41 ans, producteur audiovisuel à Papeete. Connexion fibre moyenne.

**Opening Scene :** Marc cherche un créatif local pour un projet vidéo. Il google "vidéaste créatif Tahiti" — le SEO local fait son travail, le site de Tianoa apparaît.

**Rising Action :** Il parcourt les projets mais clique sur un projet dont la vidéo met quelques secondes à charger — un placeholder flou s'affiche le temps du chargement. Rien ne casse, rien ne shift. Il revient en arrière avec le bouton du navigateur — l'état de la grille est préservé, il ne perd pas sa position.

**Climax :** Il tente d'envoyer un formulaire contact sans remplir l'email — un message d'erreur clair s'affiche. Il corrige, renvoie. Confirmation.

**Resolution :** Malgré la connexion moyenne et quelques temps de chargement médias, l'expérience reste propre et professionnelle. Aucun bug.

> **Capabilities révélées :** SEO local (Tahiti, Polynésie française) + international, placeholders médias, navigation back/forward sans perte d'état, validation formulaire, gestion d'erreurs gracieuse, loading states, 0 layout shift.

---

### Journey 4 — Tianoa gère son portfolio depuis Tahiti (Admin)

**Persona :** Tianoa, créatif basé à Tahiti, utilisateur unique du BO Payload.

**Opening Scene :** Tianoa vient de terminer un nouveau shoot photo sur un motu. Il veut l'ajouter à son portfolio immédiatement, depuis son MacBook à Papeete.

**Rising Action :** Il se connecte au panel admin Payload (`/admin`). La connexion depuis Tahiti est correcte mais pas ultra-rapide. L'interface admin charge rapidement (SSR léger). Il clique "Nouveau Projet". Un formulaire structuré apparaît : titre, description, catégorie (dropdown), médias (zone d'upload). Il remplit les champs, uploade 8 photos et 1 vidéo. L'upload est **résilient** — si la connexion flanche, les fichiers en cours ne sont pas perdus (upload progressif/chunked). La preview s'affiche au fur et à mesure.

**Climax :** Il clique "Publier". En moins de 30 secondes, le projet est live sur le site. Il ouvre le site dans un nouvel onglet — son nouveau projet apparaît dans la grille, à la bonne position.

**Resolution :** Total : 4 minutes. Tianoa partage le lien sur Instagram. Aucune intervention technique nécessaire, malgré la distance géographique.

> **Capabilities révélées :** Panel admin Payload (/admin), collection Projets (formulaire structuré), upload médias résilient (chunked upload pour connexion Tahiti), preview médias, publication instantanée, ordering des projets, revalidation du site après publication, performance BO acceptable depuis le Pacifique.

---

### Journey Requirements Summary

| Capability | J1 Prospect | J2 Mobile | J3 Edge | J4 Admin |
|------------|:-----------:|:---------:|:-------:|:--------:|
| Hero homepage impactant | ✓ | ✓ | | |
| Grille projets visuelle | ✓ | ✓ | ✓ | |
| Page projet détaillée | ✓ | ✓ | ✓ | |
| Page contact + formulaire | ✓ | | ✓ | |
| Navigation sticky | ✓ | ✓ | ✓ | |
| Responsive mobile | | ✓ | | |
| Animations fluides | ✓ | ✓ | | |
| SEO local Tahiti + international | | | ✓ | |
| CDN edge global (Pacifique inclus) | ✓ | | ✓ | |
| Loading states / placeholders | | | ✓ | |
| Validation formulaire | | | ✓ | |
| Back/forward navigation | | | ✓ | |
| Panel admin Payload | | | | ✓ |
| Collection Projets (CRUD) | | | | ✓ |
| Upload médias résilient (chunked) | | | | ✓ |
| Publication + revalidation | | | | ✓ |

## Web App Technical Strategy

### Overview

Site portfolio multi-pages (MPA) construit avec Next.js App Router. Server Components par défaut pour récupérer les données à jour depuis Payload CMS. Le design est dicté pixel-perfect par le site Framer de référence.

### Browser Support

| Navigateur | Support | Notes |
|------------|---------|-------|
| Chrome (2 dernières versions) | Full | Desktop + Mobile |
| Firefox (2 dernières versions) | Full | Desktop |
| Safari (2 dernières versions) | Full | Desktop + iOS (prioritaire — audience mobile) |
| Edge (2 dernières versions) | Full | Desktop |
| Samsung Internet | Best effort | Android |
| iOS Safari (≥ 16) | Full | Critique — audience Instagram → iPhone |

Progressive enhancement. Pas de polyfills lourds. Les animations dégradent gracieusement sur navigateurs plus anciens.

### Responsive Design

**Breakpoints** (alignés sur le site Framer de référence) :
- **Desktop :** 1440px (design de référence principal)
- **Tablet :** 810px
- **Mobile :** 390px (design de référence mobile)

Mobile-first CSS. Aucun scroll horizontal. Navigation adaptée par breakpoint (burger menu mobile). Animations réduites sur mobile si impact performance.

### Performance Strategy

- Server Components par défaut (zéro JS client sauf nécessité)
- `"use client"` uniquement pour : animations, interactions, formulaire contact
- Images : Next.js `<Image>` avec optimisation automatique, formats WebP/AVIF
- Vidéos : lazy loading, pas d'autoplay sur mobile, placeholder blur
- Fonts : `next/font` avec Clash Display + Inter (preload, swap)

> Cibles mesurables détaillées : voir NFR1-NFR9.

### SEO Strategy

- **Server Components** : contenu rendu côté serveur, indexable immédiatement
- **Metadata** : `generateMetadata` par page (title, description, OG images)
- **Structured Data** : JSON-LD pour Portfolio/CreativeWork sur chaque page projet
- **Sitemap** : `sitemap.xml` généré dynamiquement depuis Payload
- **Robots** : `robots.txt` configuré
- **SEO local** : meta geo pour Tahiti / Polynésie française
- **SEO international** : contenu en français, meta lang approprié
- **OG/Twitter cards** : preview riche pour partage réseaux sociaux (critique — Instagram bio link)

### Data Fetching Architecture

- **Server Components** pour toutes les pages de contenu (projets, homepage, contact)
- **Fetch depuis Payload** à chaque requête (données toujours à jour après publication)
- **ISR en fallback** : revalidation on-demand via webhook Payload → `revalidatePath`/`revalidateTag`
- **Pas de client-side fetching** pour le contenu principal (zéro waterfall côté client)
- **Cache strategy** : Next.js cache + CDN edge (Vercel) avec purge on-demand après publication

## Functional Requirements

### Portfolio Showcase

- **FR1:** Les visiteurs peuvent voir une homepage avec un hero visuel impactant reproduisant le design Framer
- **FR2:** Les visiteurs peuvent parcourir une grille de projets sur la homepage
- **FR3:** Les visiteurs peuvent accéder à la page détail d'un projet depuis la grille
- **FR4:** Les visiteurs peuvent voir les médias d'un projet (photos, vidéos) en plein format sur la page détail
- **FR5:** Les visiteurs peuvent lire le contexte et la description d'un projet sur sa page détail
- **FR6:** Les visiteurs peuvent voir les projets ordonnés selon l'ordre défini par Tianoa

### Navigation & Layout

- **FR7:** Les visiteurs peuvent naviguer entre les pages via une barre de navigation sticky
- **FR8:** Les visiteurs peuvent accéder à la page contact en ≤ 3 clics depuis n'importe quelle page
- **FR9:** Les visiteurs peuvent utiliser le site sur desktop (1440px), tablet (810px) et mobile (390px) avec un layout adapté
- **FR10:** Les visiteurs peuvent naviguer avec le bouton back/forward du navigateur sans perte d'état
- **FR11:** Les visiteurs peuvent voir un footer avec les informations globales de Tianoa

### Contact & Communication

- **FR12:** Les visiteurs peuvent envoyer un message à Tianoa via un formulaire de contact
- **FR13:** Les visiteurs reçoivent une confirmation après envoi du formulaire
- **FR14:** Le système valide les champs du formulaire et affiche des messages d'erreur clairs
- **FR15:** Tianoa reçoit les messages de contact par email

### Design & Animations

- **FR16:** Le système reproduit pixel-perfect le design du site Framer de référence
- **FR17:** Le système reproduit toutes les animations et transitions du site Framer
- **FR18:** Les animations dégradent gracieusement sur les appareils moins performants
- **FR19:** Le système utilise les mêmes typographies (Clash Display, Inter) et palette de couleurs (noir/blanc) que le site Framer

### Media Management

- **FR20:** Le système affiche les images optimisées (WebP/AVIF, responsive, lazy loading)
- **FR21:** Le système affiche les vidéos avec lazy loading et placeholder blur pendant le chargement
- **FR22:** Le système stocke les médias dans un service de Blob storage
- **FR23:** Le système maintient les aspect-ratios des médias sans layout shift (CLS < 0.1)

### Content Management (Back-Office)

- **FR24:** Tianoa peut se connecter au panel admin Payload CMS
- **FR25:** Tianoa peut créer un nouveau projet avec titre, description, catégorie, et médias
- **FR26:** Tianoa peut modifier un projet existant
- **FR27:** Tianoa peut supprimer un projet
- **FR28:** Tianoa peut définir l'ordre d'affichage des projets
- **FR29:** Tianoa peut uploader des images et vidéos pour un projet
- **FR30:** Tianoa peut gérer le statut d'un projet (publié/brouillon)
- **FR31:** Tianoa peut modifier les informations globales (bio, liens réseaux, email contact)
- **FR32:** Le système publie les modifications sur le site en temps réel après publication dans le BO (revalidation)

### SEO & Discoverability

- **FR33:** Le système génère des metadata SEO par page (title, description)
- **FR34:** Le système génère un sitemap.xml dynamique depuis les données Payload
- **FR35:** Le système génère des OG/Twitter cards pour le partage sur les réseaux sociaux
- **FR36:** Le système inclut des données structurées JSON-LD (Portfolio/CreativeWork) sur les pages projet
- **FR37:** Le système est indexable par les moteurs de recherche (rendu serveur)
- **FR38:** Le système cible le référencement local (Tahiti, Polynésie française) et international

### Pages Additionnelles (découvertes post-audit Framer)

- **FR42:** Les visiteurs peuvent accéder à une page `/work` listant tous les projets publiés avec une grille visuelle
- **FR43:** Les visiteurs peuvent accéder à une page `/photography` présentant une galerie photo dédiée avec un layout irrégulier fidèle au site Framer

### Data Migration

- **FR39:** Le système fournit des scripts de seed pour peupler la base Payload avec le contenu existant du site Framer
- **FR40:** Les scripts de seed importent les projets (titre, description, catégorie, ordre)
- **FR41:** Les médias fournis par Tianoa sont uploadés et associés aux bons projets via le seed

## Non-Functional Requirements

### Performance

- **NFR1:** Toutes les pages chargent avec un LCP < 2.5s mesuré depuis Europe et Pacifique (CDN edge)
- **NFR2:** Le Cumulative Layout Shift reste < 0.1 sur toutes les pages, y compris pendant le chargement des médias
- **NFR3:** L'Interaction to Next Paint reste < 200ms sur desktop et mobile
- **NFR4:** Le score Lighthouse Performance global est ≥ 90 sur desktop et ≥ 85 sur mobile
- **NFR5:** Le TTFB reste < 800ms en condition normale (CDN edge Vercel)
- **NFR6:** Le bundle JavaScript client est minimal — Server Components par défaut, `"use client"` uniquement pour animations/interactions/formulaire
- **NFR7:** Les images sont servies en formats optimisés (WebP/AVIF) avec des dimensions adaptées au viewport
- **NFR8:** Les vidéos se chargent en lazy loading avec placeholder visible — aucun autoplay sur mobile
- **NFR9:** Les fonts (Clash Display, Inter) sont preloadées via `next/font` sans flash de texte invisible (FOIT)

### Accessibilité

- **NFR10:** Le site respecte les critères WCAG 2.1 niveau AA
- **NFR11:** Le score Lighthouse Accessibility est ≥ 85
- **NFR12:** Toute la navigation est fonctionnelle au clavier (tab, enter, escape)
- **NFR13:** Les contrastes texte/fond respectent les ratios minimum AA (4.5:1 pour le texte normal)
- **NFR14:** Toutes les images ont un attribut alt descriptif (champ obligatoire dans Payload)
- **NFR15:** Les éléments interactifs ont un focus visible et des aria-labels appropriés
- **NFR16:** Les animations respectent `prefers-reduced-motion` — désactivées ou réduites si le système le demande

### Sécurité & Fiabilité

- **NFR17:** L'accès au panel admin Payload est protégé par authentification (login/password minimum)
- **NFR18:** Toutes les communications sont chiffrées via HTTPS (TLS)
- **NFR19:** Le formulaire de contact est protégé contre le spam (honeypot ou rate limiting)
- **NFR20:** Le site est disponible 99.9% du temps (SLA Vercel standard)
- **NFR21:** Les médias stockés dans Blob storage sont accessibles via CDN avec fallback en cas de défaillance
- **NFR22:** Les données Payload sont sauvegardées régulièrement (backup PostgreSQL)
