# Bibliothèque — React + Vite

Reprise statique de `library-css`, dans un nouveau projet créé avec le modèle
React de Vite. Les deux pages conservent leurs textes, images, styles et liens.
Aucun appel à une API ni aucune variable d'environnement ne sont nécessaires.

## Lancement

Avec Node.js 22.12+ ou 24+ et npm :

```sh
cd library-react
npm install
npm run dev
```

L'accueil est accessible sur `/` et la fiche Moby-Dick sur `/book.html`.
La recherche et la boîte de dialogue conservent le comportement HTML d'origine.

```sh
npm run lint
npm run build
npm run preview
```

## Architecture

```text
index.html                   Entrée HTML de l'accueil
book.html                    Entrée HTML de la fiche
src/
  main.jsx                   Montage React de l'accueil
  book.jsx                   Montage React de la fiche
  App.jsx                    Structure commune des pages
  assets/
    moby-dick.png
  components/
    Header/
      Header.jsx
      Header.module.css
    Footer/
      Footer.jsx
      Footer.module.css
  pages/
    Home/
      Home.jsx
      Home.module.css
    Book/
      Book.jsx
      Book.module.css
  styles/
    global.css               Variables, reset et styles de base communs
```

Les styles des pages et des composants sont isolés dans des modules CSS.
Les classes des icônes Google Fonts restent globales.
Vite construit les deux pages HTML pour conserver les liens existants et
l'accès direct à la fiche, sans ajouter de bibliothèque de routage.
