# LA MARGE — Acte V · Lecture et traduction

LA MARGE rassemble **48 classiques** (32 ajoutés dans cet acte), **48 couvertures SVG locales**, une liseuse avec **10 œuvres intégrales** dans au moins une langue, et le Salon littéraire fictif.

## Démarrage

Dans VS Code : `git pull origin main` puis démarrer Live Server sur `bibliotheque-premium/index.html`.

La liseuse utilise `fetch()` pour charger des fichiers texte locaux. Elle nécessite un serveur HTTP local (Live Server ou équivalent), sinon `file://` peut bloquer les accès.

## Choix des éditions : VO / FR / EN

Chaque fiche de livre présente systématiquement :
- **Version originale**, dans la langue d'écriture de l'œuvre.
- **Version française**.
- **Version anglaise**.

Il n'y a **pas de traduction automatique** ni de texte inventé. Pour chaque choix, le site indique honnêtement l'une des trois possibilités :

| Statut | Ce qui se passe |
| --- | --- |
| Texte intégral dans LA MARGE | Ouvre la liseuse locale à la langue correspondante |
| Édition Gutenberg vérifiée | Ouvre la fiche de l'édition identifiée sur Project Gutenberg |
| Traduction non vérifiée | Ouvre **une recherche Gutenberg**, sans garantir qu'une traduction existe |

Pour une œuvre originellement française, les choix « Originale » et « Française » concernent naturellement la même langue (idem pour « Originale » et « Anglaise » pour les livres anglais).

## Textes intégraux hébergés dans `lectures/`

**13 fichiers d'éditions complètes, correspondant à 10 œuvres distinctes** :

| Œuvre | Langue | Fichier local | Gutenberg |
| --- | --- | --- | --- |
| Candide | Français | `lectures/candide.txt` | #59859 |
| Le Tour du monde en 80 jours | Français | `lectures/tour-du-monde.txt` | #46541 |
| Le Horla et autres nouvelles | Français | `lectures/le-horla.txt` | #10775 |
| Arsène Lupin, gentleman-cambrioleur | Français | `lectures/arsene-lupin.txt` | #32854 |
| Voyage au centre de la Terre | Français | `lectures/voyage-centre-terre.txt` | #4791 |
| Alice au pays des merveilles | Anglais | `lectures/alice-en.txt` | #11 |
| Alice au pays des merveilles | Français, traduction d'Henri Bué | `lectures/alice-fr.txt` | #55456 |
| Le Portrait de Dorian Gray | Anglais | `lectures/dorian-en.txt` | #174 |
| Le Portrait de Dorian Gray | Français, traduction d'Albert Savine | `lectures/dorian-fr.txt` | #14192 |
| Dr Jekyll et Mr Hyde | Anglais | `lectures/jekyll-en.txt` | #42 |
| La Machine à explorer le temps | Anglais | `lectures/time-machine-en.txt` | #35 |
| La Guerre des mondes | Anglais | `lectures/war-worlds-en.txt` | #36 |
| La Guerre des mondes | Français, traduction d'Henry-D. Davray | `lectures/war-worlds-fr.txt` | #60656 |

Les fichiers ont été repris de GITenberg/Project Gutenberg, avec les notices et crédits conservés dans le texte. Liens : `https://www.gutenberg.org/ebooks/<numéro>`.

La mention « domaine public » vise les œuvres historiques et les éditions anciennes sélectionnées ; les règles de droit peuvent varier selon les pays, et toutes les traductions d'une même œuvre ne sont pas nécessairement libres. Le catalogue distingue donc les versions effectivement confirmées de celles qui restent à rechercher.

## Contenu et fonctions

- Accueil éditorial animé, bibliomancie et sélection de livres.
- Catalogue de **48 titres**, recherche texte, filtre « À lire ici », genres et tri par auteur, titre ou année.
- Fiches avec choix **Originale / Française / Anglaise**, description, favoris et source vérifiée.
- Liseuse avec pagination par feuillets, thèmes papier / clair / nuit, taille de police, recherche, retour au dernier feuillet et accès aux éditions locales multilingues.
- Salon fictif : 12 lecteurs imaginaires, 12 conversations et 107 messages préécrits. Notes et likes locaux.
- Couvertures SVG propres au projet. Aucun backend, compte ou paiement.

**Remarque :** les feuillets sont des portions numériques, pas les pages imprimées ; la typographie peut différer des éditions originales. Le roman ou recueil complet est conservé dans le fichier source de chaque édition intégrée.

L'exercice HTML sans CSS ni JavaScript est préservé dans `exercices-html/ma-bibliotheque/`.


## Acte V — Traduction à la demande

**Les éditions qui n'existent pas encore en traduction littéraire identifiée ne sont pas remplacées par une fausse édition.** Nous proposons une traduction automatique progressive lorsque le livre original complet est hébergé localement :

1. Ouvrir une fiche, puis choisir « Original », « Français » ou « Anglais ».
2. Si la traduction choisie manque mais qu'un fichier source existe, cliquer sur **« Traduire et lire ici »**.
3. La liseuse explique le procédé et demande de cliquer sur **« Activer la traduction »**.
4. Le moteur traduit **feuillet par feuillet** et non le roman entier à l'avance.

### Moteurs utilisés

- **API native du navigateur** (`Translator`) quand elle est disponible sur un navigateur compatible, en contexte sécurisé (`localhost` ou HTTPS). Le modèle de langue peut être téléchargé lors de la première utilisation. La compatibilité n'est pas universelle.
- Si elle n'est pas accessible, un bouton de secours permet d'essayer **Transformers.js** avec des modèles ONNX open source *Opus-MT* pour `en→fr`, `fr→en`, `de→fr` et `de→en`. Les modèles peuvent faire plusieurs centaines de mégaoctets ; ils ne sont téléchargés qu'après consentement explicite. La disponibilité dépend de la mémoire du navigateur, du réseau et des fichiers hébergés par Hugging Face.
- L'ancienne fonction « édition publiée sur Gutenberg » reste disponible lorsqu'une traduction littéraire existante a été vérifiée.

**Limites :** il s'agit de traduction automatique à la demande, non relue, avec de possibles erreurs de style ou de sens. Elle n'est **pas** enregistrée comme une traduction intégrale publiée dans GitHub. La recherche dans la langue traduite couvre uniquement les feuillets déjà générés pendant la session.

### Textes originaux ajoutés pour préparer la traduction

Sept nouvelles transcriptions intégrales libres dans `lectures/`, conservant leurs notices Project Gutenberg :

| Ouvrage | Langue originale | Source |
|---|---|---|
| *La Métamorphose* de Franz Kafka | Allemand | Gutenberg #22367 |
| *L'Île au trésor* de R. L. Stevenson | Anglais | Gutenberg #120 |
| *Une étude en rouge* d'Arthur Conan Doyle | Anglais | Gutenberg #244 |
| *Les Aventures de Sherlock Holmes* d'Arthur Conan Doyle | Anglais | Gutenberg #1661 |
| *Eugénie Grandet* d'Honoré de Balzac | Français | Gutenberg #11049 |
| *Poil de Carotte* de Jules Renard | Français | Gutenberg #4559 |
| *Les Fleurs du mal* de Charles Baudelaire | Français | Gutenberg #6099 |

En tout : **17 œuvres complètes disponibles au moins dans une langue**, avec leurs traductions éventuellement générables à la lecture dans un navigateur compatible. Les 31 autres fiches nécessitent encore d'intégrer une transcription originale complète avant de permettre une traduction propre à LA MARGE.

Documentations des moteurs :
- https://developer.mozilla.org/en-US/docs/Web/API/Translator
- https://huggingface.co/docs/transformers.js
- https://huggingface.co/Xenova/opus-mt-en-fr

Cette fonction est expérimentale : à tester sur Chrome ou Opera avec **Live Server**, notamment le premier téléchargement d'un modèle.
