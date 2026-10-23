# Revue de code — Afterhours

## Périmètre

Cette revue porte sur la structure de l'application React/TypeScript, l'utilisation des API REST, les composants communs, les conventions de code et les tests.

## 1. Architecture et responsabilités

L'application distingue les éléments suivants :

| Couche | Responsabilité |
| --- | --- |
| `src/pages/` | Composition des écrans et navigation |
| `src/components/ui/` | Composants visuels génériques |
| `src/features/` | Gestion de l'API distante, de la session et des traitements métier |
| `src/services/` | Construction et exécution des requêtes HTTP |
| `src/context/` | Composition de quatre Providers spécialisés : forum, session, préférences et filtres |
| `server/` | Traitement des opérations locales, authentification et autorisations |
| `src/types/` | Définition des contrats de données |

La séparation réduit les duplications et limite les dépendances entre présentation, logique applicative et accès au réseau.

## 2. Factorisation

**Composants partagés.** Les boutons, liens d'action, champs de formulaire, panneaux et en-têtes disposent d'implémentations communes. Leurs variantes visuelles sont définies dans `src/styles/ui.css`.

**Sélecteurs du catalogue.** `features/feed/selectors.ts` centralise la sélection des ressources, les filtres, le classement et la pagination. Les fonctions travaillent sur les données reçues en paramètres et ne dépendent pas de React.

**Hooks de données.** `useRemoteDataset` gère les requêtes de consultation et leurs états ; `useLocalSession` centralise les actions associées à `/session-api`. `ForumContext` assemble les ressources consultables ; `SessionContext` gère les actions utilisateur. `PreferencesContext` et `FeedQueryContext` isolent les états d'interface. `NetworkProvider` ne fait que composer ces Providers.

**Modules de présentation.** `FeedHero`, `SourceSwitcher` et `FeedControls` isolent les principales sections du fil de publications.

## 3. Contextes React et responsabilités

L'ancien contexte unique exposait simultanément les comptes, les ressources, les filtres, les favoris et le thème. La factorisation répartit ces responsabilités entre quatre contextes indépendants, consommés avec `useForum`, `useSession`, `usePreferences` et `useFeedQuery`. Les composants n'importent plus `useNetwork()`.

## 4. Commentaires et conventions

Des commentaires ont été ajoutés aux points structurants du code : appels HTTP, gestion des effets React, synchronisation du serveur local, transformation des données, tri sans mutation des tableaux et règles de composition des composants.

Les commentaires documentent une responsabilité, un contrat ou un choix d'implémentation ; ils n'ont pas vocation à décrire systématiquement les instructions évidentes.

Le code utilise un format commun : indentation à deux espaces, configuration Prettier, fichier `.editorconfig` et réglages VS Code pour le formatage à l'enregistrement.

## 5. Gestion des thèmes

Les variables CSS décrivent les couleurs selon leur rôle : surface, texte, bordure, champ de formulaire, action principale, etc. Les adaptations du mode clair sont regroupées pour maintenir la lisibilité des éléments sans redéfinir intégralement leur apparence.

Les tests d'interface comprennent des contrôles de contraste sur les cartes de publications et les libellés des formulaires.

## 6. Vérifications

| Commande | Contrôle |
| --- | --- |
| `npm run lint` | Règles ESLint et hooks React |
| `npm run build` | Typage et compilation de l'application |
| `npm run format:check` | Conformité au format Prettier |
| `npm run test:e2e` | Parcours d'interface avec Playwright |

Les scénarios couvrent la consultation, la navigation, les filtres, les méthodes REST, les contributions locales et le thème clair.

## 7. Limites techniques

L'API locale conserve ses ressources dans le processus Node.js. La durée de vie des données correspond donc à celle du serveur. Les endpoints de mutation de DummyJSON n'assurent pas de persistance.

Un déploiement avec conservation durable des comptes et publications nécessiterait une base de données et un backend autonome, ainsi que des protections adaptées à une exposition sur Internet. Ces évolutions sont distinctes des objectifs du TD.

## Documentation associée

- [README](../README.md) — présentation et démarrage.
- [Architecture](ARCHITECTURE.md) — organisation et flux de données.
- [Présentation technique](PRESENTATION.md) — parcours d'explication des fonctionnalités.
