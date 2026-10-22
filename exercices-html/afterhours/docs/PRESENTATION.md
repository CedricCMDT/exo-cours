# Présentation d'Afterhours

**Objectif :** montrer une application React futuriste **dont le contenu principal provient d'une API REST**, tout en conservant des interactions locales temporaires.

## Déroulé conseillé — environ 5 minutes

### 1. Montrer l'interface (45 secondes)

Présenter l'accueil futuriste : navigation, modules, filtres, fil de publications et page d'un sujet. Les publicités et notifications sont des éléments **fictifs et locaux**, pas une vraie régie. Le design reste indépendant des données.

### 2. Prouver que l'API travaille (1 minute)

1. Ouvrir les outils de développement avec **F12**.
2. Aller dans l'onglet **Réseau / Network**, filtre **Fetch/XHR**.
3. Cliquer sur **« Actualiser API »**.
4. Montrer trois appels `GET` vers `dummyjson.com` :
   - `/posts?limit=0`
   - `/users?limit=0&select=id,username,firstName,lastName,image`
   - `/comments?limit=0`
5. Montrer la réponse JSON, puis les posts qui utilisent ces données.

Les résultats DummyJSON sont des **données de test**, pas des utilisateurs en direct.

### 3. Montrer les méthodes REST (45 secondes)

Dans le **laboratoire HTTP** à droite, essayer successivement :

| Méthode | Endpoint | Sens |
| --- | --- | --- |
| GET | `/posts/1` | Lire un post |
| POST | `/posts/add` | Simuler une création |
| PATCH | `/posts/1` | Simuler une modification |
| DELETE | `/posts/1` | Simuler une suppression |

Afficher la réponse HTTP et le JSON. Préciser : **DummyJSON ne persiste pas les écritures simulées**.

### 4. Expliquer React et les composants (1 minute)

- `fetch()` récupère les données HTTP dans `services/api.ts`.
- `Promise.all()` lance les trois téléchargements en parallèle.
- `useRemoteDataset` récupère les données DummyJSON (avec gestion des erreurs).
- `useLocalSession` centralise les comptes et les écritures temporaires.
- `NetworkContext` assemble ces sources sans dupliquer le code HTTP.
- `selectors.ts` contient `filterPosts()`, `orderPosts()` et le calcul des catégories.
- `FeedHero`, `SourceSwitcher` et `FeedControls` rendent l'accueil modulaire.
- `Button`, `ButtonLink`, `InputField`, `TextareaField`, `SelectField`, `Panel`, `PageHeader` sont des composants UI réutilisables.

**Exemple à citer :** `Button` reçoit `variant="primary"`, `variant="danger"` ou `variant="ghost"`. Les pages passent seulement un texte et une action, tandis que le fichier `styles/ui.css` gère automatiquement les couleurs et le contraste. `PageHeader` fournit lui aussi un en-tête accessible, réutilisé sur plusieurs pages.

### 5. Montrer le serveur temporaire (1 minute)

1. Créer un compte local.
2. Publier un sujet et lui répondre.
3. Actualiser la page : tout est encore là.
4. Arrêter `npm run dev` avec **Ctrl+C**, puis relancer.
5. Le compte et les publications créés ont disparu : ils étaient gardés en **mémoire vive**, pas en base de données.

Il y a donc **deux APIs** : DummyJSON pour récupérer le contenu principal et la mini API locale pour les actions du visiteur.

### 6. Donner une limite et un choix technique (30 secondes)

> « J'ai choisi une API REST externe pour les données de démonstration, puis une mini API en mémoire pour les actions personnelles. C'est volontairement temporaire, puisque c'est un TP local. Pour un vrai réseau social, il faudrait une base de données, une authentification renforcée et un backend déployé. »

## Questions fréquentes du professeur

**Pourquoi React ?** Pour réutiliser les composants et actualiser seulement les parties nécessaires de l'écran.

**Pourquoi TypeScript ?** Pour préciser le format attendu de `Post`, `Member` et `Reply`, et détecter des incohérences à la compilation.

**Pourquoi un contexte ?** Pour éviter de transmettre les mêmes données de page en page à travers de nombreux composants intermédiaires.

**Pourquoi ne pas tout sauvegarder chez DummyJSON ?** Son CRUD est simulé ; les changements ne sont pas enregistrés durablement.

**Pourquoi conserver du contenu fictif en français ?** Pour proposer un mode archives et un secours visuel lorsque l'API est indisponible, sans présenter ces textes comme des données réellement récupérées.

**Pourquoi des classes CSS ?** Les classes sont réutilisables et ne dépendent pas du type de balise. Les titres `h1`, `h2` restent nécessaires à la structure HTML.

**Que fait GSAP ?** Il anime l'apparition des titres et des cartes. Les formes néon et mouvements permanents simples sont animés en CSS.

## Montrer la qualité du code

Pour montrer la factorisation au professeur, ouvre directement :

1. `src/components/ui/Button.tsx` : bouton réutilisable et quatre variantes.
2. `src/components/ui/Fields.tsx` : formulaires accessibles, sans dupliquer les labels.
3. `src/features/feed/selectors.ts` : logique de filtres/tri indépendante des composants.
4. `src/features/api/useRemoteDataset.ts` : récupération API externe.
5. `src/features/session/useLocalSession.ts` : API locale et mutations temporaires.
6. `src/styles/ui.css` : variables sémantiques, thème sombre/clair et contrastes.

**Formateur :** le projet utilise Prettier ; `.vscode/settings.json` active le formatage automatique à chaque enregistrement dans VS Code. Ouvre **le dossier `afterhours`** en tant que workspace, accepte l'extension recommandée puis exécute `npm run format` pour harmoniser les fichiers existants.

**Tests :** `npm run build` vérifie TypeScript et Vite, `npm run lint` vérifie les erreurs de code, et `npm run test:e2e` teste la navigation et les contrastes du mode clair (Chromium requis).

## Avant l'oral

```powershell
git pull origin main
npm install
npm run format
npm run lint
npm run build
npm run dev
```

Vérifier la console, les requêtes réseau, les cinq pages, le responsive, les formulaires et les commentaires. Si l'API externe est indisponible, expliquer le basculement vers les archives fictives au lieu de masquer l'erreur.
