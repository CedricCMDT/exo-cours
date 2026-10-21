# AFTERHOURS — Community Network (TP React + TypeScript)

Réseau social fictif inspiré du Web 2005–2012 : Skyblog, MSN, Twitter et imageboards. Le style est volontairement accueillant, tandis que les archives satiriques inventées abordent la conflictualité en ligne. **Les posts du catalogue et leurs auteurs viennent de DummyJSON** ; le panneau « Archives du Web » contient des textes fictifs distincts.

## Démarrer
Prérequis : Node.js 20.19+ (ou 22+).

```bash
npm install
npm run dev
```

Aucune clé API ni variable d'environnement n'est nécessaire.

## Fonctionnalités
- Accueil avec fil de publications, cartes et pages de détail sur `/posts/:id`.
- Recherche texte et **deux filtres combinables** (communauté/tag + nombre de likes).
- Filtrage et pagination côté client sur **l'ensemble** des publications obtenues via `GET /posts?limit=0`. Retour à la première page dès qu'un filtre change. Les critères vivent dans un contexte React et survivent à un aller-retour sur une fiche.
- Sauvegardes accessibles depuis `/saved`, persistées dans `localStorage`, sans doublons.
- Création de publication via `POST /posts/add`, formulaire validé, états d'envoi, confirmation et ajout local en mémoire.
- Bonus : thème sombre via contexte et `localStorage`; TypeScript.
- États de chargement, erreur avec réessai et liste vide. Navigation React Router et affichage responsive.

DummyJSON **simule** les créations : les nouvelles publications disparaissent après une actualisation (conforme au sujet). Les utilisateurs et les publications de l’API sont fictifs.

## Scripts
```bash
npm run lint
npm run format:check
npm run build
npm run test:e2e
```
Tests E2E : `npx playwright install chromium` (première fois), puis `npm run test:e2e`.

## Architecture
- `src/api.ts` : accès HTTP GET/POST.
- `src/types.ts` : interfaces de l'API et des filtres.
- `src/context/NetworkContext.tsx` : données partagées, filtres, pagination, favoris, thème.
- `src/pages/` : fil, détail, sauvegardes, création.
- `src/components/` : carte réutilisable.
- `src/styles.css` : direction visuelle rétro.

## Choix et limites
La pagination côté client est choisie pour combiner recherche partielle et filtres multi-critères sur **tout** le catalogue, sans limiter la recherche à la page courante. DummyJSON n'enregistre pas les POST. Les favoris conservent des IDs ; ceux de publications uniquement locales ne sont plus disponibles après rechargement. Les archives satiriques sont des textes de démonstration distincts du catalogue API. Les médias externes sont évités pour l'affichage fiable.

## Usage de l'IA
ChatGPT a été utilisé pour discuter de la direction artistique, expliquer la structure React/TypeScript et assister à la rédaction et à la révision du code. Les choix techniques et leur fonctionnement doivent être compris et défendus à l'oral.

## Discussions et réponses
Sur une fiche, il est possible de répondre au fil ou de répondre directement à un commentaire (réponses imbriquées). Les messages sont conservés dans le `localStorage` **du navigateur utilisé**, y compris après rechargement. Ce n’est **pas** un système multi-utilisateur partagé : il faut une base de données et une API côté serveur pour permettre des échanges entre appareils et visiteurs.

Une réponse automatique locale est planifiée **10 à 30 secondes** après chaque commentaire. Le compte est explicitement marqué « Compte automatisé ». Le générateur est un moteur de règles contextuelles basé sur des mots-clés, **pas un modèle d’IA**. Les tâches planifiées sont persistées ; lorsque l’utilisateur rouvre la page après l’heure prévue, la réponse apparaît.

Aucune clé externe n’est nécessaire. Pour une véritable génération par IA, prévoir un backend qui appelle un modèle, protège sa clé API et enregistre les messages et tâches différées côté serveur.

## Catalogue éditorial et animation
- **1 260 publications en français**, issues de 252 situations et cinq angles éditoriaux par situation, réparties en **18 communautés**. Les titres, corps, pseudonymes, dates et métriques sont générés de façon déterministe dans `src/data/community.ts`. Cette collection est visible même sans connexion API.
- **3 commentaires d'archives** par publication éditoriale, dont une réponse imbriquée ; les réponses de l'utilisateur restent enregistrées localement.
- Les publications réelles de l'API DummyJSON sont récupérées puis ajoutées au catalogue et peuvent être recherchées simultanément.
- **GSAP 3.15** : timeline d'entrée du bandeau, fenêtre terminal, cascade des cartes lors du chargement et des changements de filtre. Animations CSS supplémentaires pour les orbes, curseurs et points lumineux. Les animations sont désactivées lorsque le système demande moins de mouvement.
- **16 personnalités automatisées** pour les réponses temporisées, choisies en fonction de la communauté. Le moteur reste basé sur des règles et non sur un appel à un service d'intelligence artificielle.
- L'esthétique mêle un navigateur des années 2000 à une interface moderne, adaptée au mobile.

**Limite du jeu de données :** les 1 260 publications sont des variantes écrites autour de 252 situations ; elles ne sont pas 1 260 histoires indépendantes. Les dates d'archives sont construites entre 2025 et 2026 pour créer un fil historiquement stable. Comme auparavant, aucun commentaire n'est partagé entre plusieurs navigateurs.
