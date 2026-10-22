# Afterhours — Guide pour présenter le projet

> **Idée générale :** une interface qui a l'air riche (un poste d'observation d'un forum),
> mais un fonctionnement composé de quelques mécanismes simples en React et JavaScript.

## 1. L'expérience à montrer

L'accueil ne se contente pas de lister des messages.

- **Carte du réseau** : 12 communautés sont affichées sous forme de cases colorées.
  Chaque case est un bouton. Le nombre de fils et la barre d'activité sont calculés sur les données.
- **Un fil à ouvrir** : une sélection de publications avec réactions des deux côtés.
  Le bouton « Autre fréquence » affiche la suivante ; le lien ouvre le fil.
- **Trois vues du fil** : « Les récents », « Ça divise » et « Les oubliés ».
  On change l'ordre d'affichage sans recharger la page ni appeler une autre API.
- **Comptes temporaires** : on peut s'inscrire, se connecter, publier, répondre et gérer ses messages.
  Actualiser la page conserve les données ; redémarrer le serveur les efface.
- **Archives fictives** : plus de 1 000 messages de démonstration dans 18 communautés,
  avec différentes dates, réactions et auteurs. Ils ne sont pas de vraies données Internet.

## 2. Quels fichiers regarder ?

| Fichier | Rôle |
| --- | --- |
| `src/pages/Feed.tsx` | Affichage du fil, recherche, pagination et trois modes de classement. |
| `src/components/ControlRoom.tsx` | Carte des communautés et sélection du sujet en vedette. |
| `src/control-room.css` | Grille, couleurs, formes décoratives, animations et responsive. |
| `src/components/PostCard.tsx` | Présentation d'une publication et équilibre likes/dislikes. |
| `src/data/community.ts` | Contenu de démonstration et distribution des publications. |
| `src/context/NetworkContext.tsx` | État React partagé par les pages, fonctions de connexion et chargement. |
| `src/api.ts` | Une fonction `fetch()` commune à toutes les requêtes locales. |
| `sessionApi.ts` | Petit serveur temporaire : utilisateurs, posts, commentaires, sessions. |
| `vite.config.ts` | Branche la mini-API au serveur Vite de développement. |

Les parties nouvelles portent des commentaires directement dans le code.

## 3. Quatre notions suffisent pour expliquer le « tableau de bord »

### A — `useState` : retenir un choix

Dans `ControlRoom.tsx`, `channel` mémorise le numéro du sujet mis en avant :

```tsx
const [channel, setChannel] = useState(0)
```

Cliquer sur « Autre fréquence » change juste ce nombre. React met l'affichage à jour.

### B — `map` et `filter` : fabriquer les 12 cases

```tsx
communities.map(community => {
  const belonging = posts.filter(post => post.tags.includes(community.slug))
  return { ...community, count: belonging.length }
})
```

On ne dessine **pas** les cases une par une. React répète un bouton à partir d'un tableau.

### C — `sort` : changer l'ordre

- Récent : dates décroissantes.
- Ça divise : nombre de réactions de chaque côté (`Math.min(likes, dislikes)`).
- Oubliés : peu de vues d'abord.

On fait une copie du tableau avec `[...filtered]` avant de le trier, pour ne pas modifier les données partagées.

### D — CSS Grid : donner une apparence complexe

```css
.room-map-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}
```

Une seule règle place les douze cases sur quatre colonnes. Les autres règles ajoutent
couleurs, reliefs, petites barres et effets de survol. Le « disque radio » est simplement
un cercle CSS avec une animation de rotation ; ce n'est pas une vidéo ou un canvas.

## 4. Comment expliquer les comptes temporaires

```text
React (dans le navigateur)
    |
    |  fetch('/session-api/posts')
    v
Vite + sessionApi.ts (sur ta machine)
    |
    |  newPosts.push(...) ou newPosts.unshift(...)
    v
Tableau JavaScript en mémoire RAM
```

Le serveur garde quatre choses en mémoire : les comptes, les nouveaux posts, les commentaires
et les tokens de session. Les mots de passe sont hachés avec `scrypt`; le navigateur reçoit
seulement un cookie de connexion `HttpOnly`, jamais le hash.

Un `bootId` différent est créé à chaque redémarrage de Node.js. Le navigateur le compare
à la valeur précédente pour vider les anciens favoris. Le thème clair/sombre peut rester
dans les préférences du navigateur.

**Limite importante :** il s'agit d'une application de démonstration locale, pas d'une plateforme
prête à recevoir des utilisateurs sur Internet. L'API n'existe que lorsque Vite tourne en mode
développement (`npm run dev`). Un simple hébergement statique n'exécutera pas cette API.

## 5. Démonstration en classe (ordre conseillé)

1. Lancer `npm install`, puis `npm run dev`.
2. Ouvrir une communauté depuis la carte, montrer que le fil se filtre et qu'il défile.
3. Basculer entre « Les récents », « Ça divise » et « Les oubliés ».
4. Cliquer sur « Autre fréquence » puis ouvrir le sujet choisi.
5. Créer un compte, publier un sujet et lui répondre.
6. Actualiser la page : les contenus de la session restent là.
7. Couper le serveur avec `Ctrl+C`, le relancer : compte et contenus de session disparus,
   tandis que les archives fictives réapparaissent.

## 6. Pour vérifier avant l'oral

```powershell
npm install
npm run build
npm run dev
```

Teste aussi les boutons sur un écran de téléphone (outils développeur du navigateur)
et le thème sombre. Le projet n'a pas été compilé dans l'environnement local de
l'assistant : ce contrôle reste nécessaire sur la machine qui héberge Afterhours.
