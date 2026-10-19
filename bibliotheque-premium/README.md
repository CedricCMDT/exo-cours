# LA MARGE — Bibliothèque littéraire

Un mini-site éditorial et interactif conçu comme une démo graphique premium, **séparé du TP HTML d'origine**.

## Démarrer

Ouvrez `index.html` dans le navigateur ou lancez **Live Server** depuis VS Code.

## Pages

- `index.html` : page d'accueil, sélection, mise en avant et manifeste
- `catalogue.html` : recherche instantanée, filtre par genre et tri
- `livre.html?id=moby-dick` : six fiches accessibles via leur identifiant
- `favoris.html` : sélection personnelle conservée sur ce navigateur
- `a-propos.html` : page éditoriale et présentation du projet

## Technique

HTML5, CSS responsive et JavaScript natif (sans framework, compilation ni backend). Les **six couvertures vectorielles SVG** sont incluses dans `assets/covers`, et les polices disposent de solutions de repli hors ligne.

Les favoris utilisent le `localStorage` du navigateur et ne sont pas synchronisés entre appareils. Le bouton *Réserver* ouvre **une simulation** sans enregistrement de commande.

Le devoir sans CSS ni JavaScript reste dans `../exercices-html/ma-bibliotheque/`.
