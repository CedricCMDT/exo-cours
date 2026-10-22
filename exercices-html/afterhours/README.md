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

## Architecture factorisée

La nouvelle organisation distingue **UI partagée**, **fonctionnalités métier**, **accès aux APIs** et **pages**. Les pages n'ont plus besoin de connaître les détails des appels HTTP ou des états internes.

```text
afterhours/
├── .vscode/                     # Prettier automatique à l'enregistrement
├── .editorconfig                # Convention d'indentation commune
├── server/sessionApi.ts         # API Node temporaire
├── src/
│   ├── components/
│   │   ├── ui/                  # Button, ButtonLink, Fields, Panel, PageHeader
│   │   ├── feed/                # PostCard, ControlRoom
│   │   ├── api/                 # ApiPlayground
│   │   ├── discussion/          # Réponses et formulaire réutilisable
│   │   └── experience/          # Publicités fictives et pop-up
│   ├── features/
│   │   ├── api/                 # useRemoteDataset
│   │   ├── session/             # useLocalSession
│   │   └── feed/                # selectors, FeedHero, FeedControls, SourceSwitcher
│   ├── services/                # HTTP : api, demoApi
│   ├── context/                 # Assemblage des données
│   ├── pages/                   # Routes de l'application
│   ├── styles/                  # CSS par rôle + tokens du thème clair/sombre
│   ├── data/                    # Archives fictives
│   ├── types/                   # Interfaces TypeScript
│   └── utils/                   # Fonctions génériques
├── tests/network.spec.ts        # Tests de l'API, des formulaires et du contraste
├── docs/                        # Architecture détaillée et guide d'oral
└── package.json
```

**Exemple de réutilisation :** un seul `Button` avec les variantes `primary`, `secondary`, `ghost` et `danger`. Un seul `InputField` relie automatiquement le label au champ. Un seul fichier `styles/ui.css` gère leurs couleurs et le contraste clair/sombre. La logique `filterPosts()` / `orderPosts()` reste indépendante de React.

→ [Architecture détaillée](docs/ARCHITECTURE.md)

## Mise en forme automatique (VS Code et Prettier)

Prettier est **déjà présent dans les dépendances** et ses réglages sont fournis dans `.prettierrc.json`. Pour activer le formatage automatique :

1. Ouvre directement le dossier **`exercices-html/afterhours`** avec **Fichier → Ouvrir un dossier** dans VS Code (les paramètres `.vscode/` doivent être à la racine du dossier ouvert).
2. Accepte l'installation de l'extension recommandée **Prettier – Code formatter**.
3. Enregistre un fichier CSS, TS ou TSX : il est mis en forme automatiquement.

Commandes possibles depuis le terminal :

```powershell
npm run format:css    # Reformatage de tous les CSS
npm run format        # Reformatage CSS, React, TypeScript, JSON et Markdown
npm run format:check  # Contrôle sans modifier les fichiers
npm run lint          # Analyse du code
npm run build         # Compilation TypeScript + Vite
```

Les CSS du dépôt ont également été réindentés pour ne plus tenir sur une seule ligne. **Attention :** `npm run format` modifie les fichiers ; vérifie les changements avant un commit.

## Thème clair

Le thème clair repose sur des **variables CSS sémantiques** (`--ui-text`, `--ui-surface`, `--ui-input-bg`, etc.) et des styles de contraste pour les cartes, textes, panneaux et formulaires. Il ne se contente plus d'inverser la couleur d'arrière-plan. Les tests Playwright vérifient notamment que le titre et le texte d'une carte dépassent le rapport de contraste 4,5:1.

## Comprendre l'API en 30 secondes

```ts
const response = await fetch('https://dummyjson.com/posts?limit=0')
if (!response.ok) throw new Error('Erreur HTTP')
const json = await response.json()
console.log(json.posts)
```

Dans le véritable projet, `src/services/api.ts` regroupe trois appels dans `Promise.all`. Le hook `useRemoteDataset` gère le chargement et les erreurs HTTP ; le hook `useLocalSession` gère les écritures temporaires ; `NetworkContext` les assemble pour les composants.

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
