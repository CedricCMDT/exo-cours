# Revue technique — Afterhours

## Travaux effectués

### Factorisation

- Composants génériques `Button`, `ButtonLink`, `InputField`, `TextareaField`, `SelectField`, `Panel` et `PageHeader`.
- Extraction des filtres et tris purs vers `features/feed/selectors.ts`.
- Extraction du panneau source/API et des contrôles de recherche hors du grand composant `Feed`.
- Extraction des méthodes HTTP de démonstration vers `services/demoApi.ts`.
- Extraction des appels externes vers `features/api/useRemoteDataset.ts`.
- Extraction des actions et de la synchronisation locale vers `features/session/useLocalSession.ts`.
- `NetworkContext` se concentre sur l'assemblage des sources et les préférences du navigateur.

### CSS et thème clair

- Les anciens blocs CSS en une seule ligne ont été réindentés en règles lisibles.
- `styles/ui.css` contient les variables sémantiques communes aux boutons, champs, panneaux et thème clair/sombre.
- Le thème clair comporte des styles dédiés pour les textes, cartes, formulaires et contrôles, plutôt que de remplacer uniquement la couleur du fond.
- La bannière futuriste et certaines publicités fictives restent volontairement sombres et gardent leurs propres couleurs de texte.

### Qualité du code

- Prettier est une dépendance du projet et possède un fichier de configuration.
- Ajout de `.editorconfig`, `.vscode/settings.json`, `.vscode/extensions.json` pour déclencher Prettier automatiquement à l'enregistrement.
- Scripts `format`, `format:css`, `format:check`, `lint`, `build` et `check`.
- Tests Playwright mis à jour : appels API simulés de manière déterministe, filtres, laboratoire HTTP, compte local, réponses, persistance et contraste en mode clair.

## Régressions explicitement ciblées

1. Ancienne API remplacée par un faux tableau : l'accueil utilise toujours DummyJSON en priorité.
2. Écritures de DummyJSON non persistantes : création et réponses personnelles continuent de passer par `/session-api`.
3. Trois commentaires fixes partout : seules les archives fictives sont générées en quantité variable.
4. Texte blanc invisible en mode clair : adaptations de contraste et vérification automatisée.
5. Duplication des boutons et formulaires : composants UI communs.
6. CSS compact impossible à lire : reformatage et formatage automatique.

## Les limites qui restent

Le projet est un **TP local**, pas une plateforme de production : pas de base de données persistante, pas de modération à grande échelle, pas de limitation de débit ni de protections déployées côté serveur public.

Les animations ne sont pas désactivées par défaut, mais la préférence `prefers-reduced-motion` est respectée.

## Contrôles à lancer

```powershell
npm install
npm run format
npm run lint
npm run build
npx playwright install chromium
npm run test:e2e
```

**Attention :** `npm run format` réécrit les fichiers non conformes à Prettier. Le contrôle `npm run format:check` ne fait que signaler les écarts. Pour utiliser le formatage à l'enregistrement, ouvrir le dossier `afterhours` directement dans VS Code et installer l'extension Prettier recommandée.

Les scripts GitHub Actions effectuent des contrôles automatiques ; leur résultat doit être consulté après le dernier commit, car une réussite antérieure ne valide pas les modifications ultérieures.
