# AFTERHOURS — PRÉSENTATION TECHNIQUE (API EN PRIORITÉ)

## 1. Le fonctionnement à expliquer au professeur

L'accueil futuriste est toujours là, mais la **source principale des données est l'API REST DummyJSON**.

Au chargement, le navigateur lance **trois requêtes HTTP GET réelles en parallèle** :

| Requête | Résultat |
|---|---|
| `GET https://dummyjson.com/posts?limit=0` | Publications de la base de démonstration de DummyJSON. |
| `GET https://dummyjson.com/users?limit=0&select=id,username,firstName,lastName,image` | Profils associés aux `userId` des publications. |
| `GET https://dummyjson.com/comments?limit=0` | Commentaires associés à chaque `postId`. |

Les résultats JSON sont transformés en `Post[]`, `Member[]`, `Reply[]` dans `src/api.ts`, puis fournis aux composants React par `NetworkContext`.

**À montrer dans Chrome :** F12 → onglet **Réseau / Network** → filtre **Fetch/XHR** → recharger la page. Tu verras les GET de DummyJSON et le GET local `/session-api/state`.

L'affichage par défaut est **« API EN PRIORITÉ »**. Les anciennes publications françaises fictives sont accessibles par **« ARCHIVES FR »**. Le mode « TOUT AFFICHER » combine les sources.

Si DummyJSON ne répond pas, les archives locales apparaissent comme source de secours avec un message d'erreur clairement indiqué. Le bouton « Actualiser API » relance les GET.

## 2. Quels fichiers comprendre ?

| Fichier | Rôle |
|---|---|
| `src/api.ts` | Trois GET HTTP et conversion des réponses JSON en données React. |
| `src/context/NetworkContext.tsx` | Gère séparément les résultats distants, la session locale et les archives. |
| `src/pages/Feed.tsx` | Source API sélectionnée par défaut, recherche, filtres, tris et présentation. |
| `src/components/ApiPlayground.tsx` | Laboratoire GET / POST / PATCH / DELETE, avec résultat JSON. |
| `src/components/PostCard.tsx` | Identification de la source (API, archive ou session). |
| `src/components/Discussion.tsx` | Commentaires importés depuis DummyJSON et réponses locales. |
| `sessionApi.ts` | Petit serveur Node/Vite en mémoire vive pour tes propres comptes et messages. |
| `src/components/ControlRoom.tsx` | Catégories et statistiques calculées sur la source sélectionnée. |
| `src/future.css` | Mise en page futuriste, animations, responsive et panneaux API. |

## 3. Pourquoi deux API ?

### API externe : DummyJSON

Elle fournit **des données JSON distantes**. C'est le cas classique d'un client HTTP en JavaScript :

```ts
const response = await fetch('https://dummyjson.com/posts?limit=0')
const data = await response.json()
console.log(data.posts)
```

Le site utilise `Promise.all` pour récupérer simultanément les posts, les utilisateurs et les commentaires. Un `AbortController` évite de mettre à jour React avec une requête devenue inutile.

### API locale : `/session-api`

Elle sert seulement à conserver les **comptes personnels, nouveaux posts et nouveaux commentaires** en mémoire vive du serveur Vite. Elle ne remplace pas DummyJSON.

```text
Navigateur React
   ├─ GET https://dummyjson.com/posts     → publications distantes
   ├─ GET https://dummyjson.com/users     → auteurs de la base distante
   ├─ GET https://dummyjson.com/comments  → commentaires de la base distante
   └─ /session-api
       ├─ POST /register                  → inscription locale
       ├─ POST /login                     → connexion locale
       ├─ GET /state                      → session et messages locaux
       ├─ POST /posts                      → nouveau post local
       └─ POST /comments                   → nouvelle réponse locale
```

Les commentaires personnels peuvent aussi être ajoutés à un sujet importé de DummyJSON : ils sont affichés à côté des réponses importées.

À chaque redémarrage de Node, ces comptes et messages locaux sont effacés. En revanche, les ressources distantes restent consultables quand l'API répond.

## 4. Les quatre méthodes REST

Le composant `ApiPlayground.tsx` permet de tester :

- **GET /posts/1** : récupérer un post.
- **POST /posts/add** : simuler une création.
- **PATCH /posts/1** : simuler une modification.
- **DELETE /posts/1** : simuler une suppression.

Le serveur DummyJSON **ne sauvegarde pas** les créations, modifications ni suppressions simulées. Le panneau affiche la réponse retournée ; il ne prétend pas modifier définitivement les données. C'est un point important à expliquer honnêtement.

## 5. La partie visuelle, sans complexité cachée

Le site utilise React + TypeScript, du CSS et GSAP.

- `map()` fabrique les listes et les cartes.
- `filter()` garde uniquement les posts de la source sélectionnée.
- `sort()` classe les débats.
- `useState()` garde l'onglet actif ou l'état d'une fenêtre.
- CSS Grid organise les trois colonnes et les panneaux.
- GSAP anime l'apparition des cartes et titres.

Les fausses publicités et la popup sont des éléments purement visuels, sans collecte ni régie extérieure. Les anciennes archives françaises sont clairement affichées comme des **fictions**, et les textes DummyJSON comme **données de démonstration en anglais**.

## 6. Démonstration de 2 minutes

1. Exécuter `npm install`, `npm run build`, `npm run dev`.
2. Ouvrir F12 → Réseau, recharger et montrer **les trois GET DummyJSON**.
3. Pointer le compteur de posts, utilisateurs et commentaires récupérés.
4. Choisir « API EN PRIORITÉ », ouvrir un sujet et afficher ses commentaires distants.
5. Cliquer sur GET, POST, PATCH puis DELETE dans le laboratoire REST et montrer le code HTTP.
6. Basculer sur « ARCHIVES FR » pour montrer le jeu de données de secours.
7. Créer un compte, publier et commenter ; montrer que les contenus de session survivent à l'actualisation mais disparaissent au redémarrage.

## 7. Limites importantes

L'API DummyJSON est une **API de test**, pas un vrai réseau social en direct. Les posts API sont essentiellement en anglais et les commentaires peuvent être peu nombreux : le site n'invente pas de nouveaux commentaires sur ces posts. Les archives françaises ont leur propre génération fictive, séparée.

Les identifiants locaux et les publications de session ne sont pas stockés dans DummyJSON, car ses endpoints d'écriture simulent les opérations sans persister les données.

Le projet est prévu pour `npm run dev` sur une machine. Un déploiement purement statique ne fournira pas le serveur `/session-api`.

**Vérification recommandée :**

```powershell
git pull origin main
npm install
npm run build
npm run dev
```
