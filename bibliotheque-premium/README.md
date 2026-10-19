# LA MARGE — La Grande Bibliothèque · 500 œuvres

**LA MARGE** est une bibliothèque littéraire statique (HTML / CSS / JavaScript natif) avec catalogue paginé, favoris, journal de lecture, Salon fictif et liseuse.

## Démarrage

Depuis VS Code, exécuter `git pull origin main`, puis lancer **Live Server** sur `bibliotheque-premium/index.html`.

La liseuse charge les fichiers locaux avec `fetch()` ; le protocole `file://` peut donc bloquer l’ouverture des textes complets.

## Le catalogue : exactement 500 œuvres

- **48 œuvres** héritées du catalogue précédent.
- **431 nouvelles notices bibliographiques réelles** extraites d’un catalogue de métadonnées Project Gutenberg (identifiant, titre, auteur, langue et catégorie).
- **20 titres contemporains protégés**, notamment *Harry Potter*, *Le Hobbit*, *Le Seigneur des anneaux*, *Dune*, *Fondation*, *Fahrenheit 451* : fiches et favoris seulement, **aucun texte intégral reproduit**.
- **1 document historique**, la Déclaration des droits de l'homme et du citoyen de 1789, avec renvoi au [texte officiel sur Légifrance](https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000697056).

Les notices Gutenberg couvrent français, anglais, allemand, espagnol, italien, russe et latin. Les catégories rassemblent littérature, théâtre, poésie, sciences, histoire, droits, philosophie, jeunesse, aventure, fantastique, science-fiction, enquêtes, etc.

**Provenance des métadonnées :** [Project Gutenberg metadata CSV](https://github.com/sehgalvibhor/gutenberg-metadata/blob/main/gutenberg_metadata.csv), qui reprend les identifiants Project Gutenberg. Les notices pointent vers leur page `https://www.gutenberg.org/ebooks/ID`. L'attribution d'une catégorie est une classification pratique dérivée des rayons et titres, et peut être affinée.

L'année de première publication est inconnue pour les 431 notices supplémentaires (le CSV ne la fournit pas) : aucune date n'a été inventée.

## Fonctionnalités

- **Catalogue paginé :** 24 ouvrages affichés à la fois, recherche en direct, tris et catégories ; filtres « À lire ici », « Éditions libres », « Sous droits » et « Documents ».
- **Couvertures :** 48 couvertures SVG individuelles conservées pour la première sélection et nouvelles couvertures typographiques originales générées par CSS pour les autres références.
- **Favoris :** cœur sur les vignettes et sur chaque fiche ; retrouve-les dans `favoris.html`.
- **Journal personnel :** statut « À lire », « En cours » ou « Terminé » depuis chaque fiche ; tableau de suivi dans `favoris.html`.
- **Liseuse locale :** **44 œuvres distinctes**, disponibles dans **47 éditions linguistiques intégrales** enregistrées dans `lectures/`. Feuillets, thèmes, typographie et reprise automatique.
- **Langues :** original / français / anglais sur les fiches. Une édition publiée et vérifiée est privilégiée. La traduction automatique à la demande, lorsqu'elle est proposée, est expérimentale et non relue ; elle nécessite un navigateur/modèle compatible.
- **Salon :** 12 personnages fictifs et 107 messages préécrits, réactions et notes privées sur le navigateur.
- **Partage :** lien direct vers chaque fiche.

Les favoris, notes et états de lecture sont conservés **dans le navigateur** avec `localStorage`. Il n'y a pas de compte ni de synchronisation entre appareils.

### Lecture des œuvres libres

| Cas | Action |
| --- | --- |
| Édition complète intégrée | **Lire dans LA MARGE**, avec les outils de la liseuse |
| Autre édition libre référencée | Ouvrir sa fiche vérifiable chez **Project Gutenberg**, sans prétendre que le texte est hébergé localement |
| Traduction absente, source locale disponible | Possibilité d'essayer une **traduction automatique feuillet par feuillet**, avec mention de ses limites |
| Œuvre encore protégée | **Fiche documentaire et favoris uniquement**, lien vers une recherche en bibliothèque |
| DDHC 1789 | Accéder au **texte officiel** sur Légifrance |

**Important :** les droits de reproduction varient selon les pays, éditions et traductions. L'étiquette « Gutenberg » indique une édition disponible dans leur collection, **pas une garantie universelle de domaine public dans tous les territoires**. Les notices contemporaines n'ont pas de lien de lecture intégrale gratuite.

## Principales pages

`index.html` — Accueil, sélection éditoriale et expérience visuelle.

`catalogue.html` — 500 entrées, recherche, filtres, pagination et couverture typographique.

`livre.html?id=...` — Fiche de l'ouvrage, éditions, favoris, journal de lecture, sources.

`lire.html?id=...` — Liseuse pour les textes complets locaux.

`favoris.html` — Ma sélection et le journal des livres lus/en cours/à lire.

`salon.html` — Discussions fictives et carnet local.

`a-propos.html` — Le manifeste de La Marge.

## Structure et intégrité

`assets/books.js` contient les 500 métadonnées. `assets/app.js` génère les pages. `assets/library.js` gère le suivi de lecture. Les fichiers `lectures/*.txt` conservent les notices et crédits des transcriptions Project Gutenberg.

Aucune simulation de commande ou de réservation n'est présente dans l'interface. **Le TP original en HTML pur** reste dans `exercices-html/ma-bibliotheque/`.

La navigation du site peut être testée avec Live Server ; les scripts ont fait l'objet de contrôles de syntaxe et les ressources GitHub ont été vérifiées, mais un audit visuel/navigateur complet reste utile.
