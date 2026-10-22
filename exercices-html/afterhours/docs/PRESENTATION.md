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
- `NetworkContext` rend les posts et commentaires accessibles aux pages.
- `filter()`, `map()` et `sort()` construisent le fil, les communautés et les tris.
- `useState()` conserve le mode de tri, les saisies et les fenêtres ouvertes.
- `PostCard`, `Discussion` et `PageHeader` sont réutilisables.

**Exemple à citer :** `PageHeader` reçoit `eyebrow`, `title` et `description` : le composant conserve un vrai titre `h1`, mais ses styles utilisent les classes `.page-heading__*`. On peut le réutiliser sur plusieurs pages sans copier le HTML.

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

## Avant l'oral

```powershell
git pull origin main
npm install
npm run build
npm run dev
```

Vérifier la console, les requêtes réseau, les cinq pages, le responsive, les formulaires et les commentaires. Si l'API externe est indisponible, expliquer le basculement vers les archives fictives au lieu de masquer l'erreur.
