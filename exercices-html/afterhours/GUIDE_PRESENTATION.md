# AFTERHOURS // FUTURE OVERLOAD

## Objectif du projet

Créer un forum de démonstration **volontairement dense et futuriste** : néons, panneaux, publicité parodique, popup, flux de sujets et données de discussion. L'apparence est compliquée, mais l'essentiel du fonctionnement tient dans des tableaux JavaScript et des états React.

Le rétro a été abandonné : `neo.css` et `control-room.css` ne sont plus importés. Seuls `styles.css` (base) et `future.css` (nouveau design) sont chargés dans `main.tsx`.

## Les modules à présenter

| Fichier | Fonctionnement |
| --- | --- |
| `src/App.tsx` | Barre de navigation futuriste, navigation React Router, popup globale. |
| `src/pages/Feed.tsx` | Trois colonnes, recherche, quatre tris, fil, radar de discussions et animations GSAP. |
| `src/components/ControlRoom.tsx` | Carte des communautés et sujet à réactions contradictoires. |
| `src/components/Experience.tsx` | Bandeau défilant, trois publicités fictives, deux notifications et popup d'accueil. |
| `src/future.css` | Tous les effets visuels, formes, couleurs, animation CSS et responsive. |
| `src/components/PostCard.tsx` | Cartes de publications, barres de réaction et compteur de réponses. |
| `src/data/community.ts` | Archives fictives réparties dans les catégories. |
| `src/data/archiveReplies.ts` | Nombre de réponses variable et fils de discussions imbriqués, reproductibles. |
| `src/context/NetworkContext.tsx` | Données partagées, connexion et rafraîchissement après les actions. |
| `sessionApi.ts` | API en mémoire vive (utilisateurs, posts, commentaires, sessions). |

## À expliquer à l'oral

### 1. On part d'un seul tableau

`posts` est transmis aux composants. Les chiffres de la page sont calculés avec `filter`, `map`, `reduce` et `sort` : les mêmes données sont affichées sous plusieurs formes.

Exemples : une liste de sujets, un total de réactions, un radar des débats les plus contradictoires et un nombre de fils dans chaque communauté.

### 2. Les boutons ne changent qu'une variable

```tsx
const [order, setOrder] = useState('recent')
```

Changer `order` suffit pour réorganiser le tableau affiché. React met l'écran à jour. Aucun appel réseau supplémentaire.

### 3. Les animations sont simples

`future.css` contient des `@keyframes` qui déplacent ou font tourner de petits éléments. Le bandeau de titres défile grâce à `transform: translateX(...)`. Les barres pulsent grâce à `opacity` et `scaleY`.

GSAP est utilisé **uniquement** pour l'entrée du grand écran et l'arrivée des cartes de posts : `opacity`, `x`, `y` et `scale`. Un paramètre système `prefers-reduced-motion` coupe les effets continus.

### 4. Les pop-ups sont contrôlés avec React

Dans `Experience.tsx` :

```tsx
const [open, setOpen] = useState(false)
```

`setOpen(true)` ouvre la fenêtre, `setOpen(false)` la ferme. Elle apparaît une fois par onglet grâce à `sessionStorage`, et peut être fermée par le bouton, en cliquant à l'extérieur ou avec la touche Échap.

Les deux petites notifications peuvent être fermées séparément.

### 5. Les publicités ne sont pas réelles

`FictionAd` lit simplement une fiche prédéfinie dans un tableau : nom, titre, phrase et couleur. Le bouton ouvre un texte explicatif **sur la même page**. Aucun paiement, tracker ni lien vers une vraie régie. On les présente toujours comme « PUBLICITÉ FICTIVE ».

### 6. Comptes et messages temporaires

Le serveur Vite intercepte `/session-api/*` grâce à `sessionApi.ts`. Les comptes, nouveaux messages et commentaires sont gardés dans des tableaux **en mémoire RAM**. Après l'arrêt et le redémarrage de Node.js, ils sont effacés. Les archives fictives sont dans les sources et reviennent à chaque lancement.

Les mots de passe sont hachés, les droits de suppression/modification sont vérifiés côté serveur.

## Démonstration recommandée

1. Exécuter `npm install`, puis `npm run build` et `npm run dev`.
2. Montrer le thème sombre et le flux de titres qui défile.
3. Fermer la popup d'accueil et les deux notifications.
4. Cliquer sur une publicité fictive : c'est un panneau interactif local.
5. Utiliser le radar de débats, les catégories, puis les quatre tris du flux.
6. Créer un compte, écrire une publication et répondre dans un fil existant.
7. Actualiser : les données de session existent toujours ; redémarrer le serveur les efface.

**Important :** le projet est pensé pour une démo locale `npm run dev` et n'est pas un service Internet prêt à accueillir de vrais utilisateurs. La compilation et le rendu sont à vérifier sur la machine du projet.
