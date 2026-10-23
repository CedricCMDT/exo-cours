# Architecture technique — Afterhours

## Principes d'organisation

L'application applique une séparation des responsabilités afin de faciliter la maintenance, la réutilisation du code et l'évolution des fonctionnalités. Les modules sont organisés sur trois niveaux :

1. **Composants UI** : éléments visuels réutilisables, indépendants des ressources métier ;
2. **Fonctionnalités** : logique métier, chargement des données, gestion de session, filtres et tris ;
3. **Pages** : composition des vues associées aux routes React.

```text
afterhours/
├── .vscode/
│   ├── settings.json               # Format à l'enregistrement dans VS Code
│   └── extensions.json             # Extensions Prettier et ESLint conseillées
├── .editorconfig                   # Indentation et fins de ligne cohérentes
├── .prettierrc.json                # Configuration partagée de Prettier
├── docs/
│   ├── ARCHITECTURE.md
│   ├── PRESENTATION.md
│   └── REVUE_CODE.md
├── server/
│   └── sessionApi.ts               # API locale, données en mémoire vive
├── src/
│   ├── main.tsx                    # Initialisation de React et CSS
│   ├── App.tsx                     # Navigation et routes
│   ├── components/
│   │   ├── ui/                      # Design system générique
│   │   │   ├── Button.tsx           # Button + ButtonLink (4 variantes)
│   │   │   ├── Fields.tsx           # InputField, TextareaField, SelectField
│   │   │   ├── Panel.tsx            # Panneau de présentation réutilisable
│   │   │   └── PageHeader.tsx       # En-tête réutilisable
│   │   ├── api/ApiPlayground.tsx    # Démonstration REST
│   │   ├── discussion/Discussion.tsx
│   │   ├── feed/                    # PostCard, ControlRoom
│   │   └── experience/Experience.tsx
│   ├── features/
│   │   ├── api/useRemoteDataset.ts # GET externes + chargement/erreurs
│   │   ├── session/useLocalSession.ts
│   │   └── feed/
│   │       ├── selectors.ts        # Filtrage, tri et pagination
│   │       └── components/
│   │           ├── FeedHero.tsx
│   │           ├── SourceSwitcher.tsx
│   │           └── FeedControls.tsx
│   ├── context/
│   │   ├── NetworkContext.tsx      # Compose uniquement les Providers
│   │   ├── ForumContext.tsx        # Catalogue et état API
│   │   ├── SessionContext.tsx      # Utilisateur et mutations locales
│   │   ├── PreferencesContext.tsx  # Favoris, thème et stockage navigateur
│   │   └── FeedQueryContext.tsx    # Recherche, filtres et pagination
│   ├── data/                      # Catalogue complémentaire et réponses
│   ├── pages/                     # Feed, Detail, Saved, Create, Account
│   ├── services/
│   │   ├── api.ts                  # Client HTTP partagé
│   │   └── demoApi.ts              # Méthodes GET/POST/PATCH/DELETE
│   ├── styles/
│   │   ├── foundation.css          # Structure globale
│   │   ├── dashboard.css           # Accueil, radar et cartes
│   │   ├── feed.css                # Colonnes et fils
│   │   ├── pages.css               # Compte, formulaire, discussion
│   │   ├── overlays.css            # Notifications et popup
│   │   ├── theme.css               # Variables clair/sombre
│   │   ├── responsive.css          # Breakpoints
│   │   ├── effects.css             # Animations
│   │   ├── api.css                 # Panneaux API
│   │   └── ui.css                  # Design tokens + composants + contraste
│   ├── types/                      # Post, Member, Reply, Query…
│   └── utils/avatar.ts
├── tests/network.spec.ts           # Tests Playwright du fonctionnement et thème
├── vite.config.ts
└── package.json
```

## Circulation des données

```text
          HTTP GET DummyJSON                 API locale Vite
          posts / users / comments           comptes / posts / commentaires
                    │                                  │
        services/api.ts                       services/api.ts
                    │                                  │
      features/api/useRemoteDataset     features/session/useLocalSession
                    │                                  │
                    └──────────────┬───────────────────┘
                                   │
                        ForumContext.tsx
                  (+ catalogue complémentaire local)
                                   │
                   Pages et composants de l'interface
                                   │
                     FeedControls, PostCard, Discussion…
```

**Flux principal :** DummyJSON fournit les données de consultation initiales. Les endpoints d'écriture du fournisseur ne conservent pas durablement les modifications. Les contributions utilisateur sont donc traitées par l'API locale et enregistrées en mémoire du processus Node.js pendant son exécution.

## Contextes spécialisés

Le composant `NetworkProvider` conserve uniquement la composition des Providers, dans cet ordre :

```text
PreferencesProvider
└── SessionProvider
    └── ForumProvider
        └── FeedQueryProvider
            └── Application
```

Les pages importent les hooks adaptés à leurs besoins :

- `useForum()` : publications, utilisateurs, commentaires et état de l'API ;
- `useSession()` : authentification et opérations CRUD sur les contributions ;
- `usePreferences()` : thème et favoris ;
- `useFeedQuery()` : critères de recherche et numéro de page.

Cette séparation évite un contexte unique contenant toutes les actions et préférences. Modifier un filtre n'oblige plus les composants qui lisent uniquement la session à s'abonner au même objet de contexte. Le lien entre session et favoris est limité à `onServerBoot`, appelé lors de la synchronisation du serveur local.

## Composants de navigation et d'action

Le composant `src/components/ui/Button.tsx` accepte les propriétés natives d'un bouton plus :

- `variant="primary" | "secondary" | "ghost" | "danger"` ;
- `size="sm" | "md" | "lg"` ;
- `loading`, `disabled` et `fullWidth`.

```tsx
<Button variant="primary" type="submit" loading={saving}>
  Enregistrer
</Button>
<Button variant="danger" onClick={removePost}>
  Supprimer
</Button>
<ButtonLink to="/new" variant="primary">
  Publier un sujet
</ButtonLink>
```

La classe commune `.ui-button` est gérée dans `styles/ui.css`. `ButtonLink` reste un **vrai lien HTML**, donc utilisable au clavier ou dans un nouvel onglet.

## Composants de formulaire

```tsx
<InputField
  label="Pseudo"
  value={username}
  onChange={(event) => setUsername(event.target.value)}
/>
<TextareaField label="Message" rows={5} value={message} onChange={handleChange} />
```

Les `label` et `input` sont automatiquement liés grâce à `useId()`. La couleur, les erreurs et les espacements sont définis une seule fois.

## Séparation de la logique métier

Dans `features/feed/selectors.ts` :

- `selectSource(posts, source)` choisit la provenance ;
- `filterPosts(posts, query)` applique les critères ;
- `orderPosts(posts, mode)` trie **une copie** du tableau ;
- `feedCategories(posts)` calcule les sections visibles ;
- `pageCount(total, size)` calcule le nombre de pages.

La page `Feed.tsx` appelle ces fonctions et affiche les résultats. Les contrôles de recherche vivent dans `FeedControls.tsx` ; le choix de l'API ou des archives vit dans `SourceSwitcher.tsx`.

## Gestion des thèmes et accessibilité

Les variables `--ui-text`, `--ui-surface`, `--ui-input-bg`, `--ui-primary-bg`, etc. définissent le design system. Les composants utilisent ces variables plutôt que de copier des codes hexadécimaux.

Le fichier `ui.css` définit les adaptations des cartes, panneaux, textes, formulaires, liens et états interactifs pour les deux thèmes. Les zones possédant une identité visuelle propre, comme la bannière principale et les fenêtres superposées, conservent une palette spécifique.

Les tests Playwright incluent des contrôles de contraste pour les textes des cartes et les libellés des formulaires en thème clair.

## Dépendances entre modules

La séparation limite les dépendances de chaque couche : `Button` ne connaît pas DummyJSON, `FeedControls` n'exécute pas de requêtes HTTP et `orderPosts` ne dépend pas de React. Les traitements peuvent ainsi être testés indépendamment de leur rendu.

## Outils de qualité

- **Prettier** : mise en forme automatique (`npm run format`, `npm run format:css`).
- **VS Code** : formatage à l'enregistrement avec l'extension Prettier.
- **ESLint** : `npm run lint`.
- **TypeScript + Vite** : `npm run build`.
- **Playwright** : `npm run test:e2e` (navigateur Chromium nécessaire).

Pour bénéficier des réglages VS Code, ouvrir directement le dossier **`exercices-html/afterhours`** en tant que workspace.
