# Architecture d'Afterhours

## Objectif de cette refonte

L'application doit être **complexe visuellement mais simple à expliquer**. Les responsabilités sont désormais séparées selon trois niveaux :

1. **UI générique** : des composants réutilisables sans connaissance du forum ;
2. **features** : la logique métier (API, session, recherche, filtres, tris) ;
3. **pages** : assemblage des composants dans les routes React.

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
│   │           ├── SourceSwitcher.tsx
│   │           └── FeedControls.tsx
│   ├── context/
│   │   └── NetworkContext.tsx      # Réunit données distantes et locales
│   ├── data/                      # Archives françaises fictives
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
                        NetworkContext.tsx
                  (+ archives françaises fictives)
                                   │
                   Pages et composants de l'interface
                                   │
                     FeedControls, PostCard, Discussion…
```

**API-first :** DummyJSON reste la source affichée par défaut. Les écritures sur DummyJSON sont simulées et ne modifient pas sa base. Les créations personnelles sont enregistrées dans la mémoire temporaire de Node.js : elles persistent après actualisation mais disparaissent lors du redémarrage du serveur.

## Un bouton, toutes les pages

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

## Des formulaires réutilisables

```tsx
<InputField
  label="Pseudo"
  value={username}
  onChange={(event) => setUsername(event.target.value)}
/>
<TextareaField label="Message" rows={5} value={message} onChange={handleChange} />
```

Les `label` et `input` sont automatiquement liés grâce à `useId()`. La couleur, les erreurs et les espacements sont définis une seule fois.

## Présentation séparée de la logique métier

Dans `features/feed/selectors.ts` :

- `selectSource(posts, source)` choisit la provenance ;
- `filterPosts(posts, query)` applique les critères ;
- `orderPosts(posts, mode)` trie **une copie** du tableau ;
- `feedCategories(posts)` calcule les sections visibles ;
- `pageCount(total, size)` calcule le nombre de pages.

La page `Feed.tsx` appelle ces fonctions et affiche les résultats. Les contrôles de recherche vivent dans `FeedControls.tsx` ; le choix de l'API ou des archives vit dans `SourceSwitcher.tsx`.

## Thèmes et accessibilité

Les variables `--ui-text`, `--ui-surface`, `--ui-input-bg`, `--ui-primary-bg`, etc. définissent le design system. Les composants utilisent ces variables plutôt que de copier des codes hexadécimaux.

L'ancien thème clair changeait simplement quelques fonds en blanc, laissant certains textes blancs. `ui.css` fournit des adaptations pour les cartes, panneaux, textes, formulaires, liens et interactions. Certaines parties (bannière néon, popup, publicités fictives) restent volontairement sombres parce qu'elles disposent de leur propre contraste.

Les nouvelles vérifications Playwright incluent le contraste du texte des cartes en thème clair (ratio 4,5:1 minimum dans ce test).

## Pourquoi ne pas tout mettre dans les composants ?

Cela empêcherait la réutilisation. Un `Button` ne doit pas connaître DummyJSON ; un `FeedControls` ne doit pas connaître `fetch()` ; `orderPosts` ne doit pas connaître React. Cette séparation rend les éléments testables et compréhensibles indépendamment.

## Outils de qualité

- **Prettier** : mise en forme automatique (`npm run format`, `npm run format:css`).
- **VS Code** : formatage à l'enregistrement avec l'extension Prettier.
- **ESLint** : `npm run lint`.
- **TypeScript + Vite** : `npm run build`.
- **Playwright** : `npm run test:e2e` (navigateur Chromium nécessaire).

Pour bénéficier des réglages VS Code, ouvrir directement le dossier **`exercices-html/afterhours`** en tant que workspace.
