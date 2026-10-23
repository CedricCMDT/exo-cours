# AFTERHOURS

**Application web de discussions — React, TypeScript et API REST**

Afterhours est une application de forum développée dans le cadre d'un **travail dirigé de développement web**. Le projet met en pratique la consommation d'une API REST, la conception d'interfaces avec React, la gestion d'état, le routage et la factorisation de composants.

L'interface propose un fil de publications, des espaces thématiques, des discussions avec réponses imbriquées ainsi qu'un espace utilisateur. L'application utilise **DummyJSON** pour alimenter le catalogue principal et une API Node.js intégrée au serveur Vite pour gérer les contributions locales.

## Sommaire

- [Objectifs pédagogiques](#objectifs-pédagogiques)
- [Technologies](#technologies)
- [Installation et exécution](#installation-et-exécution)
- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [API et gestion des données](#api-et-gestion-des-données)
- [Qualité du code](#qualité-du-code)
- [Documentation complémentaire](#documentation-complémentaire)

## Objectifs pédagogiques

Ce TD couvre notamment les compétences suivantes :

1. **Consommer une API REST** avec `fetch`, `async/await`, `Promise.all` et le traitement des réponses JSON.
2. **Développer une application React** avec des composants réutilisables, des propriétés typées et des hooks personnalisés.
3. **Structurer un projet TypeScript** en séparant l'interface, la logique métier, les types et l'accès aux données.
4. **Gérer la navigation et les formulaires** : routes, validation, états de chargement et messages d'erreur.
5. **Implémenter les opérations CRUD** sur des ressources locales, avec vérification des droits côté serveur.
6. **Concevoir une interface responsive** avec un thème clair/sombre, des variables CSS et des animations.
7. **Contrôler la qualité** au moyen de TypeScript, ESLint, Prettier et de tests d'interface.

## Technologies

| Technologie | Utilisation |
| --- | --- |
| React 19 | Construction de l'interface et gestion des composants |
| TypeScript 5 | Typage des ressources, propriétés et fonctions |
| Vite 7 | Serveur de développement et compilation |
| React Router 7 | Navigation entre les pages |
| DummyJSON | Récupération des publications, utilisateurs et commentaires |
| Node.js | API locale intégrée au serveur de développement |
| CSS / GSAP | Mise en page responsive, thèmes et animations |
| Prettier / ESLint | Formatage et analyse statique |
| Playwright | Tests fonctionnels dans Chromium |

## Installation et exécution

**Prérequis :** Node.js 20.19+ ou 22.12+, npm et une connexion Internet pour l'accès à DummyJSON.

Depuis la racine du dépôt :

```bash
cd exercices-html/afterhours
npm install
npm run dev
```

Le serveur Vite indique l'adresse de l'application dans le terminal (par défaut, `http://localhost:5173`).

Pour vérifier la compilation :

```bash
npm run build
```

Aucune variable d'environnement ni base de données supplémentaire n'est nécessaire pour l'exécution du TD.

## Fonctionnalités

**Consultation et navigation.** Affichage des publications, recherche textuelle, filtrage par catégorie et popularité, plusieurs classements, pagination et consultation d'un sujet.

**Discussions.** Lecture des commentaires associés aux publications, réponses imbriquées, ajout de commentaires et gestion des contributions de l'utilisateur connecté.

**Espace utilisateur.** Inscription, connexion, personnalisation du profil, création de publications et gestion des favoris.

**Exploration REST.** Un panneau intégré permet d'exécuter les méthodes `GET`, `POST`, `PATCH` et `DELETE` sur les ressources de DummyJSON, puis d'inspecter le statut HTTP et la réponse JSON.

**Interface.** Tableau de bord des communautés, navigation responsive, composants de formulaire partagés, thèmes clair/sombre et animations GSAP/CSS.

## Architecture

Le code suit une organisation **par responsabilités et fonctionnalités**. Les pages assemblent les éléments ; les composants UI restent réutilisables ; les hooks et services concentrent l'accès aux données.

```text
afterhours/
├── docs/                           # Documentation technique
├── server/
│   └── sessionApi.ts                # Routes et stockage de l'API locale
├── src/
│   ├── components/
│   │   ├── ui/                      # Button, Fields, Panel, PageHeader
│   │   ├── feed/                    # Carte de publication, tableau de bord
│   │   ├── discussion/              # Commentaires et formulaire de réponse
│   │   ├── api/                     # Explorateur des méthodes REST
│   │   └── experience/              # Éléments interactifs de l'interface
│   ├── features/
│   │   ├── api/                     # useRemoteDataset
│   │   ├── session/                 # useLocalSession
│   │   └── feed/                    # Sélecteurs, filtres et modules du fil
│   ├── context/                     # Contextes distincts : forum, session, filtres, préférences
│   ├── data/                        # Publications et réponses du catalogue local
│   ├── pages/                       # Feed, Detail, Create, Account, Saved
│   ├── services/                    # Clients HTTP
│   ├── styles/                      # Styles par module et variables de thème
│   ├── types/                       # Types et contrats de données
│   ├── utils/                       # Fonctions utilitaires
│   ├── App.tsx                       # Déclaration des routes
│   └── main.tsx                      # Initialisation de l'application
├── tests/                           # Scénarios Playwright
├── .vscode/                         # Configuration du formatage
├── .editorconfig
├── .prettierrc.json
└── package.json
```

### Principes de factorisation

- **`Button` / `ButtonLink`** : variantes de taille et d'apparence centralisées dans `styles/ui.css`.
- **`InputField`, `TextareaField`, `SelectField`** : labels associés aux champs et gestion commune de leur présentation.
- **`features/feed/selectors.ts`** : fonctions indépendantes de React pour filtrer, classer et paginer les publications.
- **`useRemoteDataset` / `useLocalSession`** : séparation des requêtes externes et des opérations sur la session.
- **`ForumContext`** : lecture des publications, membres, commentaires et état de l'API.
- **`SessionContext`** : authentification et actions CRUD locales.
- **`PreferencesContext`** : thème et favoris ; **`FeedQueryContext`** : filtres et pagination.
- **`NetworkProvider`** : composition des quatre Providers, sans état métier.

Le détail des responsabilités est présenté dans [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## API et gestion des données

### 1. API externe — DummyJSON

Au chargement du catalogue, trois requêtes HTTP sont effectuées en parallèle :

| Méthode | Endpoint | Ressource |
| --- | --- | --- |
| GET | `/posts?limit=0` | Publications |
| GET | `/users?limit=0&select=id,username,firstName,lastName,image` | Utilisateurs |
| GET | `/comments?limit=0` | Commentaires |

Le service `src/services/api.ts` transforme les réponses dans les types `Post`, `Member` et `Reply`. Le hook `useRemoteDataset` gère les états de chargement, d'erreur et de rafraîchissement.

Le panneau REST utilise également `GET /posts/1`, `POST /posts/add`, `PATCH /posts/1` et `DELETE /posts/1`. **DummyJSON fournit des opérations d'écriture non persistantes** : les réponses permettent d'étudier les échanges HTTP sans modifier durablement les ressources du fournisseur.

### 2. API locale — `/session-api`

L'API locale prend en charge les actions utilisateur :

| Opération | Route |
| --- | --- |
| Consultation de la session | `GET /state` |
| Inscription / connexion / déconnexion | `POST /register`, `POST /login`, `POST /logout` |
| Mise à jour du profil | `PATCH /profile` |
| Création de publication | `POST /posts` |
| Modification / suppression d'une publication | `PATCH /posts/:id`, `DELETE /posts/:id` |
| Ajout de commentaire | `POST /comments` |
| Modification / suppression d'un commentaire | `PATCH /comments/:id`, `DELETE /comments/:id` |

Les comptes, publications et commentaires créés via cette API sont stockés **en mémoire du processus Node.js**. Ils restent disponibles après une actualisation du navigateur et sont réinitialisés au redémarrage du serveur.

Les données du catalogue local sont définies dans `src/data/`. Elles restent indépendantes des données renvoyées par DummyJSON. Les préférences d'affichage et les favoris utilisent le stockage du navigateur.

> **Périmètre technique :** les routes `/session-api` sont fournies par un plugin du serveur Vite en développement. La compilation statique `dist/` ne déploie pas à elle seule cette API Node.js.

## Qualité du code

Le projet dispose d'une configuration commune pour Prettier et ESLint, de réglages VS Code et de tests Playwright.

| Commande | Fonction |
| --- | --- |
| `npm run format` | Appliquer le formatage Prettier |
| `npm run format:css` | Formater les feuilles CSS |
| `npm run format:check` | Vérifier le formatage sans modifier les fichiers |
| `npm run lint` | Exécuter ESLint |
| `npm run build` | Vérifier TypeScript et compiler avec Vite |
| `npm run test:e2e` | Exécuter les tests Playwright |
| `npm run check` | Regrouper les vérifications prévues par le projet |

Pour le formatage automatique, ouvrir **le dossier `afterhours` comme dossier de travail dans VS Code** et utiliser l'extension Prettier recommandée dans `.vscode/extensions.json`.

Les tests couvrent notamment la récupération et l'affichage des publications, la recherche, les formulaires, la persistance pendant la session et la lisibilité du thème clair.

## Documentation complémentaire

- [Architecture technique](docs/ARCHITECTURE.md) — modules, flux de données et responsabilités.
- [Présentation du TD](docs/PRESENTATION.md) — parcours de présentation et points techniques à expliquer.
- [Revue de code](docs/REVUE_CODE.md) — factorisation, vérifications et points d'attention.

---

**Afterhours — TD de développement web, React / TypeScript / API REST.**
