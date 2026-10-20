# Ma bibliothèque — exercices React

Projet Vite + React : recherche Google Books, fiches dynamiques, navigation React Router et favoris.

## Démarrage

1. `npm install`
2. Créer `.env.local` à la racine du projet en copiant `.env.example`.
3. Renseigner `VITE_GOOGLE_BOOKS_API_KEY=...` avec la clé fournie en cours.
4. `npm run dev`

La clé côté `VITE_` est envoyée au navigateur : restreindre son usage et ne pas committer `.env.local`.

## Exercices

- **1** : `BookCard` réutilisable, props et liste avec `key`.
- **2** : recherche contrôlée `search` et recherche validée `query`.
- **3** : `useRef` pour redonner le focus après « Effacer ».
- **4** : API `searchBooks`, `useEffect`, chargement, erreurs, nettoyage.
- **5** : `BrowserRouter`, routes `/` et `/books/:id`.
- **6** : API `getBook` et fiche dynamique depuis l’URL.
- **7** : `FavoritesContext`, ajout/retrait et compteur dans l’en-tête.
- **Bonus** : favoris dans `localStorage` (données invalides tolérées), hook `useBook(id)`.

Les appels transitoirement refusés (HTTP 429/5xx) sont retentés jusqu’à 3 fois.

## Vérifications

`npm run lint` puis `npm run build`.

## Tests end-to-end (Playwright)

```bash
npm install
npx playwright install chromium
npm run test:e2e
```

Les requêtes Google Books sont simulées : pas besoin de clé Google valide ni de réseau vers l'API pendant les tests. Les tests couvrent la recherche, les fiches, la navigation, les favoris, les erreurs et une largeur mobile. Pour visualiser les tests : `npm run test:e2e:ui`.

Le workflow GitHub Actions `react-e2e.yml` lance automatiquement ces tests sur les pushs ou pull requests modifiant `library-react`.
