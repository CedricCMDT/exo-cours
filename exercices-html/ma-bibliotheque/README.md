# Ma bibliothèque — Exercices HTML + CSS

**Dossier du rendu :** `exercices-html/ma-bibliotheque/` — ne pas confondre avec `bibliotheque-premium/`, qui est un autre projet.

## Ouvrir le site

Ouvrir `index.html` avec Live Server dans VS Code, puis cliquer sur une carte pour consulter `book.html`. Aucun outil de compilation nécessaire : HTML, CSS natif et JavaScript classique.

## Les fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | Catalogue de 7 livres avec titres, auteurs, dates, recherche maquette |
| `book.html` | Fiche de Moby-Dick, métadonnées, résumé, `dialog` de commande fictive |
| `style.css` | Reset, variables `:root`, typographies, header sticky, cartes, Grid et responsive |
| `book.css` | Styles spécifiques à la fiche, chargés **après** `style.css` |
| `motion.js` | Animation continue et **horizontale** de la mention « MA BIBLIOTHÈQUE » |
| `assets/images/*.svg` | 7 couvertures locales, sans dépendance à un serveur d'images externe |

Les styles utilisent **l'imbrication CSS native** et le sélecteur `&`. La recherche n'est **pas fonctionnelle** volontairement : les consignes indiquent qu'elle reste une maquette. Chaque carte mène à la fiche de Moby-Dick, conformément à l'exercice.

## Vérification des 5 exercices obligatoires

- **1 — Styles communs :** reset fourni, variables de couleur dans `:root`, styles partagés.
- **2 — Typographie et structure :** Playfair Display + DM Sans avec polices de repli ; `body` en Flexbox avec `min-height:100vh` et `main {flex:1}` pour positionner correctement le footer.
- **3 — Catalogue :** navigation Flexbox, en-tête sticky, recherche accessible, Grid responsive, couvertures `aspect-ratio` / `object-fit`, auteur tronqué, date visible, transitions et focus.
- **4 — Fiche :** couverture et boutons à gauche, texte à droite ; fil d'Ariane, métadonnées Flexbox, résumé, styles séparés dans `book.css`.
- **5 — Mobile :** media queries à 900 / 800 / 680 / 520 / 365 px selon les composants ; grille à deux puis une colonne, fiche à une colonne, largeur fluide, pas de défilement horizontal voulu.

## Les bonus réalisés

- 7 cartes, dont des titres longs ; bas de carte aligné par `display:flex`, `flex-direction:column`, `margin-top:auto`.
- Styles `:hover`, `:focus-visible`, `:focus-within` et `prefers-reduced-motion:reduce`.
- Exemples d'imbrication CSS avec `&`; cascade normale sans `!important` dans la présentation.
- Styles `@media print` pour une impression sobre : recherche et actions masquées, cartes non coupées (`break-inside:avoid`).
- Fenêtre de commande `<dialog>`, `::backdrop` et bouton de fermeture via commandes HTML natives (sur navigateurs compatibles).
- **Bonus demandé à part :** `motion.js` anime le titre « MA BIBLIOTHÈQUE » de gauche à droite en rebondissant aux extrémités. Le reste de la page ne bouge pas. L'animation se suspend en arrière-plan et respecte la préférence de mouvement réduit.

## Réponses aux questions de rappel

### 1. Reset / variables / imbrication

- **`box-sizing:border-box` :** les dimensions incluent le contenu, le padding et la bordure, ce qui simplifie les calculs de largeur.
- **`margin` / `padding` :** `margin` est l'espace **extérieur** à la bordure ; `padding` est l'espace **intérieur**.
- **`&` :** représente le sélecteur parent dans une règle CSS imbriquée. Exemple : `.book-link { &:hover {...} }` équivaut à `.book-link:hover {...}`.

### 2. Mise en page

- **`height` / `min-height` :** `height` fixe la hauteur désirée ; `min-height` impose seulement un minimum, puis laisse grandir le contenu.
- **`px` / `rem` / `%` :** `px` est une unité CSS fixe ; `rem` dépend de la taille de police racine ; `%` dépend d'une dimension de référence (souvent le parent).

### 3. Navigation et cartes

- **`sticky` / `fixed` :** `sticky` conserve l'élément dans le flux puis le colle pendant le défilement ; `fixed` le sort du flux et le positionne par rapport à la fenêtre. `top:0` indique où il reste collé.
- **`:hover` / `:focus-visible` :** survol du pointeur / focus visible au clavier ou selon le navigateur.
- **Flexbox / Grid :** Flexbox aligne surtout sur un axe ; Grid organise lignes et colonnes en deux dimensions.
- **Ellipse :** `overflow:hidden`, `white-space:nowrap`, `text-overflow:ellipsis` et une largeur réellement limitée.
- **`transform` au survol :** il déplace ou agrandit visuellement sans recalculer le placement des éléments voisins.

### 4. Fiche de livre

- **`gap` / `margin` / `padding` :** espace entre éléments d'un conteneur flex/grid / espace extérieur d'un élément / espace intérieur.
- **Conflits CSS :** priorité à la cascade : origine, importance, couches, spécificité, proximité ; à priorité comparable, l'ordre d'apparition décide.

### 5. Responsive

- **Media query :** applique des règles selon des caractéristiques d'affichage (largeur, préférence d'animation, impression, etc.).
- **`width` / `max-width` :** `width` fixe la largeur cible ; `max-width` lui donne une limite supérieure.
- **Éviter le débordement mobile :** `max-width:100%`, conteneurs fluides, `min-width:0` dans Flex/Grid, media queries et images adaptatives.

### Questions des bonus

- **Pourquoi `flex:1` sur le contenu ne suffit pas ?** La carte doit elle-même occuper toute la hauteur disponible pour que les alignements de bas de carte soient cohérents.
- **`:focus-within` :** cible un parent dès qu'un de ses descendants détient le focus ; utile pour souligner la recherche.
- **Règle avec `&` :** `.book-card { &:hover {...} }` devient `.book-card:hover` ; sans `&`, un sélecteur imbriqué représentant un descendant donnerait par exemple `.book-card .titre`.
- **Pseudo-classe / pseudo-élément :** une pseudo-classe décrit un état (`:hover`) ; un pseudo-élément cible une partie spéciale (`::before`, `::backdrop`).
- **Ne pas couper une carte imprimée :** `break-inside:avoid`, avec `page-break-inside:avoid` comme repli.

## Tests manuels à faire avant remise

1. Tester **320 px, 768 px et 1280 px** dans les outils du navigateur.
2. Parcourir les deux pages avec **Tab / Maj+Tab / Entrée** : le focus doit rester visible.
3. Vérifier le menu sticky, le formulaire et les cartes à nom très long.
4. Ouvrir le résumé, tester la fenêtre de commande dans un navigateur récent.
5. Activer la réduction des animations et vérifier que le mouvement s'arrête.
6. Vérifier l'aperçu **Imprimer**.

**Remarque sur la recherche :** ce projet ne crée pas de moteur de recherche, car le sujet précise explicitement qu'aucun JavaScript n'est demandé pour elle. Le seul script anime le titre.
