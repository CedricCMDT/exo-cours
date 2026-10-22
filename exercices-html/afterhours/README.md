# AFTERHOURS

**Forum expérimental en React + TypeScript, alimenté en priorité par une API REST.**

Afterhours présente les données de démonstration de [DummyJSON](https://dummyjson.com/) dans une interface futuriste : fil de discussions, recherche, tris, cartes de communautés, commentaires et laboratoire HTTP. Le projet comporte également des **archives françaises fictives** et une **mini-API locale** pour créer un compte et publier pendant une session.

> Projet pédagogique. Les publications de DummyJSON et les archives sont des données de démonstration, pas des contenus vérifiés ou un forum public.

## Lancer le projet

**Prérequis :** Node.js 20.19+ ou 22.12+, npm et une connexion Internet pour les appels DummyJSON.

```bash
cd exercices-html/afterhours
npm install
npm run dev
```

Ouvrir l'adresse indiquée par Vite (généralement `http://localhost:5173`).

Vérifier le code avant une présentation :

```bash
npm run build
```

Aucune clé API ni base de données à installer.

## Fonctionnalités

- **API prioritaire :** chargement des posts, des auteurs et des commentaires avec trois requêtes `GET` vers DummyJSON.
- **Exploration :** recherche textuelle, catégories, popularité, quatre modes de classement, pagination, favoris et navigation entre les sujets.
- **Laboratoire REST :** démonstration de `GET`, `POST`, `PATCH` et `DELETE` avec affichage des réponses JSON et des statuts HTTP.
- **Comptes et échanges locaux :** inscription, connexion, profil, nouveaux sujets, réponses imbriquées, modification et suppression de ses contenus.
- **Archives fictives :** rubriques en français et discussions générées de façon déterministe. Elles servent de contenu alternatif si l'API externe est inaccessible.
- **Interface :** thème sombre/clair, panneaux, animations GSAP/CSS, publicités parodiques **explicitement fictives**, notifications et fenêtre d'introduction refermables.
- **Accessibilité :** navigation clavier, titres sémantiques, états d'erreur, mise en page responsive et respect de `prefers-reduced-motion`.

## Deux API, deux responsabilités

| Source | Fonctionnement | Persistance |
| --- | --- | --- |
| **DummyJSON (externe)** | `GET /posts`, `GET /users`, `GET /comments` ; CRUD simulé dans le laboratoire | Données de démonstration fournies par le service |
| **`/session-api` (locale)** | Comptes, publications et commentaires personnels ; cookie de session `HttpOnly` | Mémoire vive du processus Node.js : **effacée au redémarrage** |
| **Archives françaises** | Données et réponses fictives fournies avec le code | Identiques à chaque démarrage |

**Important :** les opérations `POST`, `PATCH` et `DELETE` de DummyJSON simulent un résultat, mais n'écrivent pas durablement dans sa base. Les créations personnelles sont envoyées à **notre API locale**, pas à DummyJSON. Actualiser le navigateur conserve les données locales tant que le serveur tourne ; redémarrer le serveur les efface.

Le thème et certains réglages d'interface peuvent rester dans `localStorage` : ce ne sont pas des données du forum.

## Organisation du code

```text
afterhours/
├── README.md
├── docs/
│   ├── PRESENTATION.md          # Démonstration et explications pour l'oral
│   ├── ARCHITECTURE.md          # Circulation des données et dossiers
│   └── REVUE_CODE.md            # Choix techniques, contrôles et limites
├── server/
│   └── sessionApi.ts            # API temporaire intégrée à Vite
├── src/
│   ├── App.tsx                  # Navigation et routes
│   ├── main.tsx                 # Point d'entrée React + CSS
│   ├── components/
│   │   ├── api/ApiPlayground.tsx
│   │   ├── discussion/Discussion.tsx
│   │   ├── experience/Experience.tsx
│   │   ├── feed/
│   │   │   ├── ControlRoom.tsx
│   │   │   └── PostCard.tsx
│   │   └── ui/PageHeader.tsx    # En-tête réutilisable avec classes CSS
│   ├── context/NetworkContext.tsx
│   ├── data/                    # Archives fictives et réponses
│   ├── pages/                   # Accueil, sujet, favoris, création, compte
│   ├── services/api.ts          # Requêtes HTTP
│   ├── styles/                  # CSS : structure, pages, thème, responsive, effets
│   ├── types/                   # Types Post, Member et Reply
│   └── utils/avatar.ts
├── vite.config.ts
├── tsconfig.json
└── package.json
```

Les pages utilisent les mêmes composants réutilisables. Par exemple, `PageHeader` affiche les en-têtes du profil, des favoris et du formulaire de création. Les classes `.page-heading__*` permettent de modifier leur style au même endroit, en conservant des `h1` corrects pour l'accessibilité.

## Comprendre l'API en 30 secondes

```ts
const response = await fetch('https://dummyjson.com/posts?limit=0')
if (!response.ok) throw new Error('Erreur HTTP')
const json = await response.json()
console.log(json.posts)
```

Dans le véritable projet, `src/services/api.ts` regroupe trois appels dans `Promise.all`. `NetworkContext` gère le chargement, les erreurs et les données partagées par les composants.

Pour observer les échanges : **F12 → Réseau (Network) → Fetch/XHR → Actualiser API**.

## Limites et sécurité

Ce projet est prévu pour **une démonstration locale** :

- `server/sessionApi.ts` fonctionne avec **`npm run dev`**, pas avec un simple hébergement statique de `dist/`.
- Les comptes et leurs données ne sont pas destinés à une utilisation publique. Il manque notamment une vraie base de données, une protection contre les abus, des tests de sécurité et un déploiement serveur adapté.
- Les archives françaises et leurs compteurs sont **fictifs**. Les commentaires importés depuis DummyJSON n'ont pas de date fournie par l'API.
- Une panne réseau peut empêcher le chargement de DummyJSON ; les archives restent accessibles.

## Présenter le projet

Consulter **[le guide d'oral](docs/PRESENTATION.md)**, **[l'architecture](docs/ARCHITECTURE.md)** et **[la revue de code](docs/REVUE_CODE.md)**.

## Outils et assistance

React, TypeScript, React Router, Vite, CSS, GSAP, Node.js et DummyJSON.

ChatGPT a participé aux propositions visuelles, à la refactorisation, à la documentation et à la rédaction du code. Le fonctionnement doit être compris et expliqué lors de la présentation.
