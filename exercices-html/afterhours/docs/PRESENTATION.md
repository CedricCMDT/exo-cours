# Présentation technique — Afterhours

## 1. Contexte et objectifs du TD

**Afterhours** est une application web de discussions réalisée avec React et TypeScript. Le travail porte sur l'intégration d'une API REST, la gestion des ressources côté client, l'organisation des composants et les interactions utilisateur.

L'application s'appuie sur deux services distincts : DummyJSON pour consulter les publications, utilisateurs et commentaires, et une API Node.js intégrée à Vite pour gérer les créations et modifications locales.

## 2. Déroulement de la présentation

### Présentation de l'interface

Afficher le fil principal, le panneau des catégories, le détail d'une publication et les différentes options de recherche et de classement. Présenter ensuite le passage entre les thèmes clair et sombre ainsi que l'adaptation de l'interface sur une largeur mobile.

### Intégration de l'API REST

Ouvrir les outils de développement du navigateur (**F12 → Réseau → Fetch/XHR**), puis utiliser **Actualiser API** pour examiner les trois requêtes HTTP :

| Méthode | Ressource | Utilisation |
| --- | --- | --- |
| GET | `/posts?limit=0` | Récupération des publications |
| GET | `/users?limit=0&select=id,username,firstName,lastName,image` | Récupération des utilisateurs |
| GET | `/comments?limit=0` | Récupération des commentaires |

L'objectif est de montrer le cycle **requête HTTP → réponse JSON → conversion des données → rendu React**.

Le composant `ApiPlayground` présente également les méthodes `GET`, `POST`, `PATCH` et `DELETE` sur DummyJSON. Les opérations d'écriture de ce fournisseur retournent une réponse sans enregistrer durablement les changements. Le stockage des contributions à l'application est donc assuré séparément par l'API locale.

### Gestion des contributions locales

Créer un compte, publier un sujet et ajouter une réponse. Vérifier que les opérations restent disponibles après actualisation et que les droits de modification et de suppression sont contrôlés côté serveur.

Le stockage en mémoire est une décision d'implémentation du TD : le redémarrage du processus Node.js réinitialise les ressources de la session.

### Architecture et factorisation

Ouvrir les fichiers suivants pour présenter les responsabilités :

| Fichier | Élément à expliquer |
| --- | --- |
| `src/services/api.ts` | Construction des requêtes HTTP et traitement des réponses |
| `src/features/api/useRemoteDataset.ts` | Chargement asynchrone, rafraîchissement et erreurs |
| `src/features/session/useLocalSession.ts` | Actions CRUD et synchronisation avec l'API locale |
| `src/context/NetworkContext.tsx` | Composition des Providers, sans état applicatif |
| `src/context/ForumContext.tsx` | Ressources consultables et état de l'API |
| `src/context/SessionContext.tsx` | Authentification et actions sur les contenus |
| `src/context/PreferencesContext.tsx` | Favoris et thème |
| `src/context/FeedQueryContext.tsx` | Filtres et pagination |
| `src/features/feed/selectors.ts` | Fonctions de recherche, filtrage, tri et pagination |
| `src/components/ui/Button.tsx` | Composant réutilisable et variantes visuelles |
| `src/components/ui/Fields.tsx` | Champs de formulaire avec labels associés |
| `src/styles/ui.css` | Variables CSS et règles communes aux deux thèmes |

Cette organisation suit une séparation entre **accès aux données**, **logique métier** et **présentation**, sans dupliquer les mêmes fonctions dans les pages.

## 3. Choix techniques à justifier

**Pourquoi React ?** La composition de composants permet de partager les mêmes cartes, boutons et formulaires dans plusieurs vues. Les changements d'état mettent à jour l'interface sans recharger intégralement le document.

**Pourquoi TypeScript ?** Les types `Post`, `Member` et `Reply` définissent les contrats manipulés par les composants et les services. Le compilateur signale les incohérences de typage.

**Pourquoi des hooks personnalisés ?** `useRemoteDataset` et `useLocalSession` isolent les traitements asynchrones du code des pages. Leur rôle reste clairement défini.

**Pourquoi plusieurs contextes React ?** Un Provider rend ses valeurs accessibles dans l'arbre sans transmettre manuellement les propriétés à chaque niveau. Afterhours distingue les données du forum, la session, les préférences et les filtres : chaque page utilise les hooks correspondant à ses besoins.

**Pourquoi une API locale ?** DummyJSON fournit un catalogue et des endpoints de pratique REST, mais ne persiste pas les mutations. Le routeur `/session-api` permet de réaliser les opérations utilisateur attendues dans l'application.

**Pourquoi Prettier et ESLint ?** Prettier uniformise la présentation du code ; ESLint signale des problèmes de qualité et d'utilisation des règles React. Les réglages VS Code permettent le formatage à l'enregistrement.

## 4. Vérifications

Depuis le dossier `afterhours` :

```bash
npm install
npm run lint
npm run build
npm run format:check
npx playwright install chromium
npm run test:e2e
```

Les tests Playwright examinent les principaux parcours : chargement des publications, filtres, navigation, inscription, publication, commentaires et contraste du texte en thème clair.

Pour une lecture détaillée des modules, consulter [ARCHITECTURE.md](ARCHITECTURE.md). Les choix de factorisation et points d'attention sont décrits dans [REVUE_CODE.md](REVUE_CODE.md).
