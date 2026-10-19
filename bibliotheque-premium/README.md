# LA MARGE — Acte II

Une expérience littéraire interactive : direction artistique éditoriale, six couvertures SVG originales, catalogue, sélection personnelle et **Le Salon**, une communauté **entièrement fictive**.

## Démarrage

Ouvrir `index.html` ou utiliser l'extension **Live Server** de VS Code. Le site ne nécessite pas de compilation, de framework ou de compte.

## Pages

| Page | Contenu |
| --- | --- |
| `index.html` | Accueil cinématographique, sélection, aperçu du Salon et bibliomancie |
| `catalogue.html` | Recherche, genres, tri et six livres |
| `livre.html?id=moby-dick` | Fiche détaillée, favoris et réservation **simulée** |
| `favoris.html` | Votre sélection sur cet appareil |
| `salon.html` | 12 profils fictifs, 12 fils de discussion, 107 messages, filtre, recherche, réactions, notes |
| `a-propos.html` | Le manifeste littéraire |

## Fonctionnalités de l'Acte II

- Micro-interactions, animations au défilement, transitions de pages, ambiance lumineuse et progression de lecture.
- **Bibliomancie** : sélection aléatoire d'un prochain livre avec résultat animé.
- Le Salon : conversations fictives écrites pour la démo, **pas de vraies publications de lecteurs**.
- Possibilité de liker, de laisser une note personnelle dans un fil et de créer une discussion locale. Vos textes ne sont pas envoyés à un serveur. Les personnages **ne répondent pas** à vos messages.
- Sauvegarde des favoris et notes en `localStorage`. Aucune synchronisation multi-appareils.
- Support du clavier et de `prefers-reduced-motion`.
- CSS, JavaScript natif, SVG locaux. Google Fonts est optionnel : polices de secours prévues.

## Structure

```text
bibliotheque-premium/
├── index.html
├── catalogue.html
├── livre.html
├── favoris.html
├── salon.html
├── a-propos.html
├── assets/
│   ├── app.js / books.js
│   ├── salon.js / salon-data.js / salon.css
│   ├── experience.js / experience.css
│   ├── style.css
│   └── covers/ (6 SVG)
└── README.md
```

**Important :** Ce projet enrichi est distinct du devoir HTML sans CSS/JS qui reste dans `exercices-html/ma-bibliotheque/`. Pour des conversations multijoueurs réelles ou des réponses par IA, il faudrait développer un backend, des comptes, une modération et une API sécurisée.
