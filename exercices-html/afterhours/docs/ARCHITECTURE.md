# Architecture technique d'Afterhours

## Circulation des données

```text
                        Navigateur / React
                                 │
                    NetworkContext.tsx
                     ┌───────────┼───────────┐
                     │           │           │
              API externe    API locale   Archives fictives
               DummyJSON     Vite/Node     data/
                     │           │           │
           services/api.ts   server/       community.ts
                     │       sessionApi.ts archiveReplies.ts
              GET posts       │              │
              GET users       │              │
              GET comments    │              │
                     └───────────┼───────────┘
                                 │
                     Post[], Member[], Reply[]
                                 │
                 Feed / Detail / Account / Saved
```

Le mode d'accueil par défaut est **API EN PRIORITÉ**. Le sélecteur d'accueil peut afficher les archives fictives ou les deux sources. Les créations locales restent consultables pendant la session.

## Responsabilités des dossiers

- **`src/pages/` :** définit les écrans liés aux routes : fil, détail, favoris, création et profil.
- **`src/components/feed/` :** carte d'un post et tableau de bord des communautés.
- **`src/components/discussion/` :** formulaire et arbre de réponses, imbriqués de manière récursive.
- **`src/components/experience/` :** publicités fictives, bande de titres et pop-up.
- **`src/components/api/` :** démonstrateur des quatre verbes HTTP.
- **`src/components/ui/` :** blocs génériques indépendants du métier, par exemple `PageHeader`.
- **`src/services/` :** fonctions qui dialoguent avec des API.
- **`src/context/` :** états partagés et actions des pages.
- **`src/types/` :** contrats TypeScript.
- **`src/utils/` :** petites fonctions réutilisables sans interface, par exemple les avatars.
- **`src/data/` :** données françaises fictives, stables et indépendantes de DummyJSON.
- **`src/styles/` :** styles classés par zone : structure, tableau de bord, fil, formulaires, overlays, responsive, panneau API.
- **`server/` :** mini API Node/Vite et données en mémoire vive.

## Trois catégories de contenus

| Catégorie | Origine | Droits |
| --- | --- | --- |
| Post `source: 'api'` | DummyJSON, HTTP GET | Lecture ; réponses locales autorisées |
| Post `source: 'community'` | Archive fictive du projet | Lecture ; réponses locales autorisées |
| Post `source: 'session'` | Utilisateur connecté à l'API locale | Auteur : modification / suppression |

Les ID des posts proviennent de plages différentes pour limiter les conflits (API, archives, nouvelles créations). Les commentaires distants portent le préfixe `api-`, ceux des archives `archive-`, et les commentaires locaux reçoivent un UUID.

## API locale et sécurité

`server/sessionApi.ts` est branché au serveur **de développement** par `vite.config.ts`.

- Les comptes, tokens de session, posts et commentaires sont gardés dans des tableaux / une `Map` JS.
- Le mot de passe est haché via `scrypt` ; le cookie de session est `HttpOnly` et `SameSite=Lax`.
- Le serveur vérifie qu'un auteur peut réellement modifier ou supprimer son contenu.
- Les données sont **réinitialisées au redémarrage** ; aucune base de données n'est installée.

Ce n'est pas une authentification de production : il manque notamment persistance, politique de sessions adaptée à un déploiement, contrôle des abus et protections supplémentaires.

## Pourquoi des classes CSS plutôt que des sélecteurs HTML ?

```tsx
<PageHeader eyebrow="MON ESPACE" title="Mon profil" />
```

Le composant rend un titre `h1` accessible. Sa présentation utilise `.page-heading`, `.page-heading__title`, etc., et n'est donc pas attachée à un sélecteur fragile comme `header h1`.

Les styles sont répartis entre `foundation.css`, `dashboard.css`, `feed.css`, `pages.css`, `overlays.css`, `theme.css`, `responsive.css`, `effects.css` et `api.css`.

## Où commencer pour lire le code ?

1. `src/main.tsx` — point d'entrée.
2. `src/App.tsx` — routes et navigation.
3. `src/services/api.ts` — appels REST.
4. `src/context/NetworkContext.tsx` — chargement et combinaison des sources.
5. `src/pages/Feed.tsx` — filtres et tris.
6. `src/components/feed/PostCard.tsx` — carte réutilisée dans le fil et les favoris.
7. `server/sessionApi.ts` — actions utilisateur temporaires.
