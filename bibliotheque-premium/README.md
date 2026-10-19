# LA MARGE — Acte III · La bibliothèque ouverte

Une expérience littéraire gratuite, pensée comme un site de maison d'édition : **16 classiques**, **6 pages de navigation + une liseuse**, **16 couvertures SVG originales**, un Salon entièrement fictif, et **5 livres complets** à lire sur place.

## Démarrer

Dans VS Code, lancer **Live Server** (extension recommandée) sur `index.html`.

> **Important :** la liseuse charge les fichiers texte via `fetch()`. Les navigateurs bloquent souvent les requêtes entre fichiers ouverts directement avec une URL `file://`. Utilisez Live Server ou un serveur HTTP local. Aucune compilation n'est nécessaire.

## Pages

- `index.html` — accueil, sélections, aperçu du Salon, bibliomancie, vitrine des textes intégraux.
- `catalogue.html` — recherche et filtrage parmi 16 œuvres, dont 5 lisibles intégralement.
- `livre.html?id=candide` — fiches, informations, lien vers liseuse ou édition Project Gutenberg.
- `lire.html?id=candide` — **liseuse** : feuillets reconstitués, recherche dans le texte, taille réglable, thèmes papier/clair/nuit, navigation au clavier et marque-page conservé.
- `salon.html` — 12 personnages **fictifs**, 12 discussions scénarisées, 107 messages. Notes et réactions privées (stockage navigateur).
- `favoris.html` — favoris enregistrés localement.
- `a-propos.html` — manifeste littéraire.

## Livres en texte intégral dans le dépôt

Les fichiers de `lectures/` reproduisent les **transcriptions Project Gutenberg avec leur texte et leur licence**. Le composant `reader.js` n'affiche pas les notices Gutenberg au milieu du roman : il les conserve cependant dans chaque fichier téléchargé.

| Livre | Fichier local complet | Source et édition |
|---|---|---|
| *Candide* — Voltaire | `lectures/candide.txt` | Project Gutenberg #59859 — https://www.gutenberg.org/ebooks/59859 |
| *Le Tour du monde en quatre-vingts jours* — Jules Verne | `lectures/tour-du-monde.txt` | Project Gutenberg #46541 — https://www.gutenberg.org/ebooks/46541 |
| *Le Horla et autres nouvelles* — Guy de Maupassant | `lectures/le-horla.txt` | Project Gutenberg #10775 — https://www.gutenberg.org/ebooks/10775 |
| *Arsène Lupin, gentleman-cambrioleur* — Maurice Leblanc | `lectures/arsene-lupin.txt` | Project Gutenberg #32854 — https://www.gutenberg.org/ebooks/32854 |
| *Voyage au centre de la Terre* — Jules Verne | `lectures/voyage-centre-terre.txt` | Project Gutenberg #4791 — https://www.gutenberg.org/ebooks/4791 |

Les fichiers ont été importés depuis les dépôts **GITenberg**, miroirs publics de transcriptions Gutenberg. La licence Project Gutenberg et les crédits sont conservés dans les fichiers intégraux. Le droit d'auteur dépend des pays ; ces textes originaux français d'auteurs morts avant 1956 appartiennent au domaine public en France en 2026, sous réserve des particularités des éditions et contributions annexes. Pour d'autres juridictions, vérifier les conditions locales.

Les **11 autres livres** sont des fiches et ne sont **pas** disponibles intégralement dans la liseuse locale ; certaines fiches donnent un lien externe vers Project Gutenberg. Pas de faux « lire » qui afficherait uniquement un extrait.

## Navigation dans la liseuse

- Flèches gauche/droite pour changer de feuillet hors des champs de saisie.
- Boutons A− / A+ pour régler la police.
- Icônes papier / clair / nuit pour changer d'ambiance.
- Recherche d'un passage à travers le texte intégral, saut au feuillet trouvé.
- Reprise de la lecture depuis le dernier feuillet sur cet appareil.

**Note :** un feuillet n'est pas une page imprimée : c'est une portion de texte d'environ 4 300 caractères découpée à des frontières de paragraphes. Toutes les parties du texte situées entre les balises Project Gutenberg `START` et `END` sont conservées dans l'ordre.

## Architecture

```text
bibliotheque-premium/
  index.html
  catalogue.html
  livre.html
  lire.html
  salon.html
  favoris.html
  a-propos.html
  assets/
    app.js books.js style.css
    reader.js reader.css
    salon.js salon-data.js salon.css
    experience.js experience.css
    covers/ (16 couvertures SVG)
  lectures/
    candide.txt
    tour-du-monde.txt
    le-horla.txt
    arsene-lupin.txt
    voyage-centre-terre.txt
  README.md
```

**Aucun compte, aucun paiement, aucun serveur applicatif.** Les favoris et le marque-page utilisent `localStorage` et ne se synchronisent pas entre navigateurs. Le bouton de réservation reste une simulation. Le Salon ne génère aucune réponse IA.

L'exercice de cours original en HTML pur est préservé séparément dans `exercices-html/ma-bibliotheque/`.
