import type { Member, Post } from '../types'
/**
 * Catalogue éditorial déterministe.
 * 18 communautés × 14 situations × 5 angles = 1260 publications.
 * Les posts DummyJSON restent chargés séparément depuis l'API.
 */
export const communities = [
  {
    "slug": "societe",
    "label": "Société"
  },
  {
    "slug": "politique",
    "label": "Politique"
  },
  {
    "slug": "tech",
    "label": "Tech"
  },
  {
    "slug": "gaming",
    "label": "Gaming"
  },
  {
    "slug": "musique",
    "label": "Musique"
  },
  {
    "slug": "cinema",
    "label": "Cinéma & séries"
  },
  {
    "slug": "sport",
    "label": "Sport"
  },
  {
    "slug": "travail",
    "label": "Travail"
  },
  {
    "slug": "etudes",
    "label": "Études"
  },
  {
    "slug": "relations",
    "label": "Relations"
  },
  {
    "slug": "random",
    "label": "/b/ Random"
  },
  {
    "slug": "internet",
    "label": "Internet"
  },
  {
    "slug": "paranormal",
    "label": "Paranormal"
  },
  {
    "slug": "cuisine",
    "label": "Cuisine"
  },
  {
    "slug": "culture",
    "label": "Culture"
  },
  {
    "slug": "economie",
    "label": "Économie"
  },
  {
    "slug": "science",
    "label": "Science"
  },
  {
    "slug": "nostalgie",
    "label": "Nostalgie Web"
  }
] as const
const topics: Record<string, [string, string][]> = {
  "societe": [
    [
      "Le voisin se prend pour le syndic",
      "Il distribue des avertissements pour un paillasson de travers"
    ],
    [
      "Débattre sans lire l'article",
      "Les réactions arrivent avant la publication du reportage complet"
    ],
    [
      "L'enfer des groupes de quartier",
      "Une dispute sur les poubelles finit en réunion de copropriété"
    ],
    [
      "Les gens qui filment tout",
      "Un inconnu filme une simple altercation dans le métro"
    ],
    [
      "Le civisme à géométrie variable",
      "Tout le monde exige du respect mais personne ne laisse passer"
    ],
    [
      "Faut-il répondre aux trolls ?",
      "Une question banale attire des comptes qui veulent provoquer"
    ],
    [
      "Le tribunal du groupe WhatsApp",
      "Un message tronqué circule depuis trois jours"
    ],
    [
      "Les files d'attente rendent fous",
      "Deux adultes se disputent pour trente secondes"
    ],
    [
      "La liberté de tout dire",
      "Certains bloquent ceux qui les contredisent"
    ],
    [
      "La bienveillance obligatoire",
      "Une entreprise affiche des valeurs puis humilie ses salariés"
    ],
    [
      "Les micro-scandales du quotidien",
      "Un banc repeint provoque deux cents commentaires"
    ],
    [
      "Les excuses publiques",
      "Une personne s'excuse sans reconnaître ce qu'elle a fait"
    ],
    [
      "Quand un forum devient un tribunal",
      "Un pseudo est condamné sans aucune preuve"
    ],
    [
      "L'avis de ceux qui n'étaient pas là",
      "Les témoignages les plus fermes viennent de nouveaux comptes"
    ]
  ],
  "politique": [
    [
      "Le débat municipal est ridicule",
      "Le conseil local discute de la couleur des abribus pendant trois heures"
    ],
    [
      "Les promesses de campagne",
      "Un candidat promet cinq choses qui ne dépendent pas de lui"
    ],
    [
      "Une réforme résumée en trois tweets",
      "Les slogans circulent mais personne ne lit les articles"
    ],
    [
      "La politique des commentaires",
      "Deux camps s'insultent sans citer une mesure"
    ],
    [
      "La pétition miracle",
      "Mille signatures en ligne mais douze personnes devant la mairie"
    ],
    [
      "Le porte-parole et ses pirouettes",
      "Le communiqué contredit la déclaration de la veille"
    ],
    [
      "Les sondages à la carte",
      "Chaque camp publie le chiffre qui l'arrange"
    ],
    [
      "La petite phrase virale",
      "Sept secondes de vidéo éclipsent deux heures de débat"
    ],
    [
      "La transparence sélective",
      "Un élu promet de publier uniquement les dossiers adverses"
    ],
    [
      "Les transports oubliés",
      "Un trajet mal desservi devient une guerre de slogans"
    ],
    [
      "Le budget sans légende",
      "Un graphique recadré sert de preuve définitive"
    ],
    [
      "Les réunions citoyennes",
      "Les habitués monopolisent la parole puis déplorent l'absence des autres"
    ],
    [
      "Le vote comme concours de popularité",
      "Le programme tient en moins de mots qu'un mème"
    ],
    [
      "La colère comme programme",
      "On veut tout supprimer mais personne n'explique quoi construire"
    ]
  ],
  "tech": [
    [
      "Le framework miracle",
      "Un outil nouveau promet de remplacer une architecture complète"
    ],
    [
      "Windows contre Linux, saison 46",
      "Une discussion sur les raccourcis devient une guerre de distributions"
    ],
    [
      "Le développeur sans documentation",
      "Quatre heures perdues sur une fonction de six lignes"
    ],
    [
      "Le post-it des mots de passe",
      "Tous les accès sont écrits à côté du moniteur"
    ],
    [
      "L'IA et les développeurs juniors",
      "On demande cinq ans d'expérience sur un outil récent"
    ],
    [
      "Le CSS ne serait pas sérieux",
      "Un critique du front-end ne sait pas centrer sa fenêtre"
    ],
    [
      "L'API du vendredi soir",
      "Le service critique renvoie des erreurs avant le week-end"
    ],
    [
      "Réunion pour choisir un framework",
      "Huit développeurs débattent au lieu de coder"
    ],
    [
      "Le dark mode partout",
      "L'application propose sept thèmes mais oublie sa fonction"
    ],
    [
      "La dette technique éternelle",
      "Chaque sprint promet de nettoyer et ajoute des dépendances"
    ],
    [
      "Le commentaire TEMPORAIRE de 2012",
      "Une solution provisoire n'a jamais été remplacée"
    ],
    [
      "Le PC de bureau surpuissant",
      "Un ordinateur haut de gamme met quinze minutes à ouvrir un CSV"
    ],
    [
      "Le bug qui se cache",
      "L'erreur disparaît dès qu'un collègue regarde"
    ],
    [
      "Les mises à jour obligatoires",
      "Le logiciel redémarre pendant une démonstration"
    ]
  ],
  "gaming": [
    [
      "Le matchmaking est une punition",
      "Des débutants affrontent trois équipes de vétérans"
    ],
    [
      "Le jeu sorti à moitié fini",
      "Le patch du premier jour pèse plus que le jeu"
    ],
    [
      "Le micro du coéquipier",
      "Un joueur donne des ordres au milieu du bruit d'aspirateur"
    ],
    [
      "Le classement comme identité",
      "Certains parlent plus de leur rang qu'ils ne jouent"
    ],
    [
      "Les jeux rétro ont mieux vieilli ?",
      "Une soirée sur une vieille console devient philosophique"
    ],
    [
      "Le prix des skins",
      "Un costume coûte autant que trois jeux indépendants"
    ],
    [
      "Les moddeurs sauvent le jeu",
      "Un mod gratuit corrige un bug oublié"
    ],
    [
      "Le speedrun absurde",
      "Un joueur traverse un mur et termine une quête"
    ],
    [
      "Le boss soi-disant impossible",
      "Trois heures de rage pour découvrir la touche esquive"
    ],
    [
      "Les spoilers dans le chat",
      "Quelqu'un raconte la fin avant la sortie"
    ],
    [
      "Le retour des LAN",
      "Des amis ressortent des câbles réseau et du matériel de 2006"
    ],
    [
      "C'est forcément le lag",
      "Le joueur accuse sa connexion après chaque défaite"
    ],
    [
      "Accès anticipé éternel",
      "La roadmap promet la lune mais le menu options plante"
    ],
    [
      "Clavier contre manette",
      "Un tournoi amical devient un conflit de périphériques"
    ]
  ],
  "musique": [
    [
      "Les concerts vus à travers un téléphone",
      "Tout un rang filme la scène au lieu de la regarder"
    ],
    [
      "Les playlists en boucle",
      "L'algorithme propose les mêmes titres depuis des mois"
    ],
    [
      "Le retour du MP3",
      "Des gens ressortent leurs lecteurs pour éviter les abonnements"
    ],
    [
      "Le playback en festival",
      "La voix continue quand le micro est sur la table"
    ],
    [
      "Les guerres de fandoms",
      "Deux groupes comparent les streams au lieu d'écouter"
    ],
    [
      "Les pochettes générées",
      "Une image d'album devient le centre d'une polémique"
    ],
    [
      "Les reprises qui divisent",
      "Un morceau énergique est transformé en ballade"
    ],
    [
      "Le prix des places",
      "Un billet coûte autant qu'un week-end de vacances"
    ],
    [
      "Les pépites d'une vieille clé USB",
      "Un titre oublié devient le morceau de la semaine"
    ],
    [
      "Les festivals sponsorisés",
      "Les marques sont plus visibles que les artistes"
    ],
    [
      "Le retour des blogs musicaux",
      "Des passionnés publient à nouveau des critiques écrites"
    ],
    [
      "Le DJ et son bouton play",
      "Une performance de deux heures semble tenir sur une touche"
    ],
    [
      "Les recommandations interminables",
      "Un ami envoie cent chansons sans en choisir une"
    ],
    [
      "La chanson qu'on déteste aimer",
      "Le titre le plus ringard fait danser tout le monde"
    ]
  ],
  "cinema": [
    [
      "Le trailer raconte toute la fin",
      "La bande-annonce révèle le retournement final"
    ],
    [
      "La suite inutile",
      "Un studio annonce un quatrième film après une conclusion parfaite"
    ],
    [
      "Les notes avant la sortie",
      "Une série reçoit des critiques sans avoir été diffusée"
    ],
    [
      "La fin ouverte obligatoire",
      "Le scénario s'arrête quand il devient intéressant"
    ],
    [
      "Les adaptations de jeux",
      "La série change ce qui faisait l'originalité du jeu"
    ],
    [
      "VO contre VF",
      "Une séance tourne en conflit de sous-titres"
    ],
    [
      "Il faut quatre plateformes",
      "Une saga se trouve éparpillée entre abonnements"
    ],
    [
      "Spoilers en miniature",
      "Une vidéo révèle une mort majeure dans son titre"
    ],
    [
      "Les films de trois heures",
      "Une histoire aurait pu tenir sans vingt scènes en trop"
    ],
    [
      "L'acteur toujours pareil",
      "Un comédien change de costume mais garde le même rôle"
    ],
    [
      "Le retour des DVD",
      "Un collectionneur ne veut plus dépendre des catalogues"
    ],
    [
      "Les scènes post-générique",
      "Des spectateurs restent pour huit secondes de teaser"
    ],
    [
      "Le remake sans personnalité",
      "Un classique revient plus spectaculaire et moins touchant"
    ],
    [
      "La série annulée au pire moment",
      "La saison se termine sans conclusion"
    ]
  ],
  "sport": [
    [
      "L'arbitre responsable de tout",
      "Chaque équipe prétend que les décisions la désavantagent"
    ],
    [
      "Les experts de canapé",
      "Les commentaires expliquent aux professionnels comment courir"
    ],
    [
      "La salle et ses suppléments",
      "Un abonnement cache quinze options payantes"
    ],
    [
      "La course du dimanche",
      "Un footing tranquille devient une compétition de montres"
    ],
    [
      "Le match trop préparé",
      "Deux heures de tactique pour vingt minutes de jeu"
    ],
    [
      "Le record complètement absurde",
      "Une performance insolite fait plus de bruit qu'un championnat"
    ],
    [
      "Les sportifs sur les réseaux",
      "Une phrase postée la nuit fait plus de réactions que le match"
    ],
    [
      "Les chaussures miracles",
      "Un produit promet de transformer le niveau d'un amateur"
    ],
    [
      "Les transferts imaginaires",
      "Une rumeur anonyme est annoncée comme officielle"
    ],
    [
      "La caméra à la salle",
      "Un influenceur filme et bloque les machines"
    ],
    [
      "Les sports invisibles",
      "Une discipline passionnante n'est presque jamais diffusée"
    ],
    [
      "Le match entre amis",
      "Personne n'accepte de perdre malgré l'absence de score"
    ],
    [
      "Les pronostics supprimés",
      "Un compte efface ses erreurs chaque semaine"
    ],
    [
      "Le repos oublié",
      "Des amateurs enchaînent des séances sans récupérer"
    ]
  ],
  "travail": [
    [
      "La réunion qui devait être un mail",
      "Une équipe bloque une heure pour lire un tableau"
    ],
    [
      "Le manager aux buzzwords",
      "Personne ne comprend les nouvelles synergies"
    ],
    [
      "Le télétravail sous surveillance",
      "Un outil mesure les clics au lieu des résultats"
    ],
    [
      "Le stagiaire censé tout savoir",
      "Une personne venue apprendre doit former les autres"
    ],
    [
      "Le mail urgent du vendredi soir",
      "Une demande vitale peut en réalité attendre lundi"
    ],
    [
      "La crise des capsules de café",
      "Une panne de machine crée plus de débats qu'un incident client"
    ],
    [
      "L'open space invivable",
      "Un appel en haut-parleur bloque la concentration"
    ],
    [
      "Les entretiens lunaires",
      "Un recruteur pose des questions sans lien avec le poste"
    ],
    [
      "La cohésion obligatoire",
      "Une animation collective devient officieusement obligatoire"
    ],
    [
      "La priorité qui change tout le temps",
      "Une équipe reçoit un nouvel objectif chaque matin"
    ],
    [
      "Les indicateurs au vert",
      "Le tableau rassure alors que le service est saturé"
    ],
    [
      "Le collègue qui disparaît",
      "Quelqu'un revient uniquement quand tout est terminé"
    ],
    [
      "Les signatures de mail géantes",
      "Trois lignes de réponse et quarante lignes de logos"
    ],
    [
      "Le droit à la déconnexion",
      "Un message « sans urgence » demande une réponse immédiate"
    ]
  ],
  "etudes": [
    [
      "Le groupe de projet fantôme",
      "Quatre étudiants inscrits mais un seul connaît le sujet"
    ],
    [
      "« C'est simple »",
      "Un petit exercice nécessite deux heures de documentation"
    ],
    [
      "La veille du rendu",
      "La classe découvre les consignes à vingt-trois heures"
    ],
    [
      "Trente slides pour six phrases",
      "Une présentation énorme ne raconte presque rien"
    ],
    [
      "L'oral de code",
      "Le programme fonctionne jusqu'à la demande de modification"
    ],
    [
      "Les travaux de groupe",
      "La répartition équitable tourne en dispute"
    ],
    [
      "Le Wi-Fi en démonstration",
      "Le réseau tombe quand le professeur regarde"
    ],
    [
      "Réviser avec une IA",
      "Certains retiennent les réponses sans comprendre"
    ],
    [
      "La guerre des filières",
      "Chaque formation se prétend la plus difficile"
    ],
    [
      "Le tutoriel infini",
      "Une vidéo de cinq heures oublie une étape"
    ],
    [
      "Cours à huit heures",
      "La moitié de la classe survit grâce au café"
    ],
    [
      "La participation notée",
      "Les plus bavards ne sont pas toujours les plus investis"
    ],
    [
      "Le commit de dernière minute",
      "Un étudiant pousse son code trois secondes avant la limite"
    ],
    [
      "Les notes trop organisées",
      "Mettre le cours en page prend plus de temps que l'apprendre"
    ]
  ],
  "relations": [
    [
      "Le vu sans réponse",
      "Deux coches deviennent une enquête sur les intentions"
    ],
    [
      "Les conseils amoureux du forum",
      "Des inconnus donnent leur avis sans connaître les intéressés"
    ],
    [
      "Le groupe d'amis absent",
      "Personne ne propose de sortie et tout le monde se plaint"
    ],
    [
      "Les vocaux de dix minutes",
      "Une question simple arrive sous forme de documentaire"
    ],
    [
      "Les conversations après minuit",
      "Un petit sujet devient une crise existentielle"
    ],
    [
      "Les anniversaires automatiques",
      "Une notification remplace parfois une discussion"
    ],
    [
      "Le couple et les abonnements",
      "Un mot de passe partagé provoque une dispute"
    ],
    [
      "Les amitiés à distance",
      "Des amis se parlent tous les jours sans se voir"
    ],
    [
      "Le rendez-vous désastreux",
      "Un date tourne en entretien d'embauche"
    ],
    [
      "Les conseils non sollicités",
      "Un ami explique quoi faire avant d'écouter"
    ],
    [
      "Les messages effacés",
      "Quelqu'un supprime sa réponse puis réclame la confiance"
    ],
    [
      "Le groupe aux cent notifications",
      "Une décision exige soixante messages"
    ],
    [
      "Le retour d'un ex",
      "Un « salut ça va ? » bouleverse une semaine"
    ],
    [
      "Les excuses par emoji",
      "Trois pictogrammes essaient de réparer dix mois de silence"
    ]
  ],
  "random": [
    [
      "J'ai perdu contre mon grille-pain",
      "La machine brûle tout quand je suis pressé"
    ],
    [
      "Pourquoi les pigeons marchent comme ça ?",
      "Une observation absurde devient une enquête"
    ],
    [
      "Le voisin joue de la flûte à 3 h",
      "On dirait une alarme de voiture triste"
    ],
    [
      "Le pire conseil du forum",
      "Une astuce a rendu un problème deux fois pire"
    ],
    [
      "Le distributeur m'a insulté",
      "L'écran affiche une erreur personnellement offensante"
    ],
    [
      "La photo la plus floue",
      "Huit pixels deviennent une preuve judiciaire"
    ],
    [
      "Mon frigo imite un modem",
      "Un appareil semble essayer de se connecter"
    ],
    [
      "Mon pseudo de 2007",
      "Une vieille signature révèle une personnalité dramatique"
    ],
    [
      "Je hais les imprimantes",
      "La machine marche pour tout le monde sauf moi"
    ],
    [
      "Les rêves idiots",
      "Une file d'attente devient une finale sportive"
    ],
    [
      "Le procès des céréales",
      "L'ordre du lait déclenche une guerre"
    ],
    [
      "Mon clavier est possédé",
      "Une touche grince comme une porte de cave"
    ],
    [
      "Banni du forum de chats",
      "J'ai posté un chien sous une photo de chat"
    ],
    [
      "L'avis inutile du lundi",
      "Quelqu'un débat de la texture des serviettes en papier"
    ]
  ],
  "internet": [
    [
      "L'algorithme ne me connaît pas",
      "Il recommande exactement le contraire de mes recherches"
    ],
    [
      "Les abonnés achetés",
      "Dix mille nouveaux comptes écrivent tous le même commentaire"
    ],
    [
      "Le drama sans contexte",
      "Une capture sans date déclenche une polémique"
    ],
    [
      "Les avis cinq étoiles",
      "Cent commentaires identiques parlent d'un produit inconnu"
    ],
    [
      "Les excuses sponsorisées",
      "Une vidéo d'excuses contient quatre publicités"
    ],
    [
      "Le forum ressuscité",
      "Des habitués de 2008 reviennent quinze ans plus tard"
    ],
    [
      "Les pseudos impossibles",
      "Un compte change de nom chaque semaine"
    ],
    [
      "La capture recadrée",
      "Une conversation tronquée devient une accusation"
    ],
    [
      "Le fil technique qui déraille",
      "Une question sur un câble finit en insultes"
    ],
    [
      "Le bot qui ne comprend rien",
      "Il écrit « excellent article » sous une photo de sandwich"
    ],
    [
      "Les notifications absurdes",
      "Une application signale un changement de biographie"
    ],
    [
      "La disparition des blogs",
      "Les pages personnelles ferment les unes après les autres"
    ],
    [
      "Deux communautés en guerre",
      "Des forums se disputent la propriété d'un mème"
    ],
    [
      "L'anonymat oublié",
      "Un vieux pseudo ressurgit dans un débat sur la vie privée"
    ]
  ],
  "paranormal": [
    [
      "La radio qui capte une voix",
      "Un vieux poste grésille à la même heure"
    ],
    [
      "Des pas à l'étage vide",
      "Les voisins entendent marcher dans un couloir fermé"
    ],
    [
      "Une ombre sur la photo",
      "Une silhouette apparaît sur un cliché nocturne"
    ],
    [
      "Le rêve partagé",
      "Deux personnes racontent le même endroit imaginaire"
    ],
    [
      "Le miroir de brocante",
      "Un objet acheté cinq euros rend son propriétaire nerveux"
    ],
    [
      "Les lumières de la colline",
      "Des points brillants apparaissent sans explication"
    ],
    [
      "La maison abandonnée",
      "Une sonnerie retentit dans un bâtiment sans électricité"
    ],
    [
      "Le coup de fil silencieux",
      "Une ligne fixe reçoit des appels sans voix"
    ],
    [
      "Le forum des fantômes",
      "Un fil de 2009 reçoit soudain une réponse"
    ],
    [
      "Le reflet du bus",
      "Une silhouette apparaît uniquement dans la vitre"
    ],
    [
      "Les histoires des grands-parents",
      "Une anecdote devient une légende de quartier"
    ],
    [
      "L'enregistrement étrange",
      "Un micro capte un bruit impossible à identifier"
    ],
    [
      "Le couloir condamné",
      "D'anciens plans montrent un passage fermé"
    ],
    [
      "Les balises dans la forêt",
      "Des marques au sol lancent des théories"
    ]
  ],
  "cuisine": [
    [
      "Le procès de la pizza à l'ananas",
      "Un dîner amical tourne en bataille de garnitures"
    ],
    [
      "Cuisson des pâtes",
      "Le nombre de minutes devient une affaire d'État"
    ],
    [
      "Trois ingrédients, douze ustensiles",
      "Une recette facile demande tout un placard"
    ],
    [
      "L'avis une étoile absurde",
      "Un client reproche à un café de ne pas servir de sushis"
    ],
    [
      "Le gâteau raté mais délicieux",
      "Une pâtisserie effondrée disparaît du plat"
    ],
    [
      "Le sandwich hors de prix",
      "Un pain garni coûte aussi cher qu'un restaurant"
    ],
    [
      "Les plats de cantine",
      "Un ancien élève défend un dessert détesté par tous"
    ],
    [
      "Tout faire à l'air fryer",
      "Un appareil devient la réponse à toutes les recettes"
    ],
    [
      "La dose « au pif »",
      "Une recette de famille ne contient aucune mesure"
    ],
    [
      "Le burger impossible à manger",
      "Une tour de viande doit être démontée"
    ],
    [
      "La carbonara interdite",
      "Une photo de crème déclenche un débat"
    ],
    [
      "Les critiques sans goûter",
      "Un influenceur donne une note sans finir l'assiette"
    ],
    [
      "Cuisiner avec un petit budget",
      "Des recettes simples coûtent moins qu'un café"
    ],
    [
      "Le petit-déjeuner en guerre",
      "Le salé et le sucré divisent les habitués"
    ]
  ],
  "culture": [
    [
      "Les livres qu'on prétend avoir lus",
      "Un débat littéraire révèle des lecteurs imaginaires"
    ],
    [
      "La petite bibliothèque municipale",
      "Une soirée de lecture attire une foule inattendue"
    ],
    [
      "Les œuvres libres",
      "Des textes anciens sont redécouverts en lecture en ligne"
    ],
    [
      "Le musée ignoré",
      "Une exposition méconnue mérite plus d'attention"
    ],
    [
      "La critique creuse",
      "Un chroniqueur dit « génial » sans donner de raison"
    ],
    [
      "Les classiques imposés",
      "Un ancien élève relit enfin un livre détesté"
    ],
    [
      "Les traductions qui changent tout",
      "Deux versions d'une phrase n'ont pas le même ton"
    ],
    [
      "Le théâtre revisité",
      "Une mise en scène contemporaine divise la salle"
    ],
    [
      "Le retour du fanzine",
      "Un collectif imprime cinquante exemplaires"
    ],
    [
      "Les archives perdues",
      "Un vieux site contient des textes presque introuvables"
    ],
    [
      "La file pour une dédicace",
      "On attend deux heures pour trente secondes"
    ],
    [
      "Quatre cents recommandations",
      "Un ami propose une bibliothèque au lieu d'un roman"
    ],
    [
      "Les œuvres surestimées",
      "Un club découvre qu'il n'aime pas le même chef-d'œuvre"
    ],
    [
      "La poésie sur les forums",
      "Des textes personnels côtoient des commentaires sarcastiques"
    ]
  ],
  "economie": [
    [
      "Le café à cinq euros",
      "Une terrasse augmente ses prix et indigne le quartier"
    ],
    [
      "Le panier de courses comparé",
      "Les tickets circulent sans prendre en compte les quantités"
    ],
    [
      "Les abonnements oubliés",
      "Une famille paie trois services inutilisés"
    ],
    [
      "La promotion permanente",
      "Une remise suit une hausse de prix"
    ],
    [
      "Les applis de budget",
      "Classer les dépenses prend plus de temps que les réduire"
    ],
    [
      "La facture qui explose",
      "Des voisins proposent des astuces contradictoires"
    ],
    [
      "Les pourboires des livreurs",
      "Le débat sur le service tourne en dispute salariale"
    ],
    [
      "L'argent de poche numérique",
      "Une application transforme la gestion en jeu"
    ],
    [
      "Les conseils financiers magiques",
      "Un compte promet des gains sans jamais évoquer le risque"
    ],
    [
      "Le studio « cosy »",
      "Une annonce vend un couloir comme un appartement"
    ],
    [
      "Le prix du transport",
      "L'abonnement monte mais les bus se raréfient"
    ],
    [
      "Le défi repas pas chers",
      "Une semaine de recettes devient une compétition"
    ],
    [
      "Les frais cachés",
      "La facture finale dépasse le prix affiché"
    ],
    [
      "Les comparateurs de prix",
      "Deux sites annoncent des rabais incompatibles"
    ]
  ],
  "science": [
    [
      "La vidéo scientifique truquée",
      "Une expérience spectaculaire oublie le montage"
    ],
    [
      "Les trous noirs aspirateurs",
      "Une animation confond gravitation et machine à vide"
    ],
    [
      "Les robots vont tout prendre",
      "Un prototype hésitant prédit déjà la fin du travail"
    ],
    [
      "Le volcan d'hier",
      "Une ancienne vidéo d'éruption circule comme une actualité"
    ],
    [
      "Les étoiles d'octobre",
      "Des passionnés observent le ciel depuis un parking"
    ],
    [
      "Dormir trois heures ?",
      "Un influenceur promet d'être reposé sans sommeil"
    ],
    [
      "Les expériences virales",
      "Une vidéo coupe toutes les précautions de sécurité"
    ],
    [
      "Les images spatiales",
      "Une photo de télescope déclenche des conclusions absurdes"
    ],
    [
      "La météo est une probabilité",
      "Des gens lisent les prévisions comme une promesse"
    ],
    [
      "L'ordinateur quantique magique",
      "Une publicité prétend résoudre tous les problèmes"
    ],
    [
      "Les dinosaures colorés",
      "Une illustration lance un débat sur les plumes"
    ],
    [
      "L'expérience qui mousse",
      "Un bricolage censé être scientifique déborde partout"
    ],
    [
      "Le graphique recadré",
      "Une courbe sans axes se propage plus vite que l'étude"
    ],
    [
      "Les animaux improbables",
      "Une espèce marine ressemble à un personnage inventé"
    ]
  ],
  "nostalgie": [
    [
      "Mon premier Skyblog",
      "Un billet de 2007 rempli de GIFs refait surface"
    ],
    [
      "Le son du modem",
      "Un bruit de connexion ramène quinze ans en arrière"
    ],
    [
      "Les pseudos MSN interminables",
      "Une biographie tenait entre deux caractères spéciaux"
    ],
    [
      "Les signatures de forum",
      "Les bannières animées dépassaient les messages"
    ],
    [
      "La musique automatique",
      "Un blog lance une chanson au volume maximal"
    ],
    [
      "Les émoticônes volées",
      "Des petits GIFs circulaient entre conversations"
    ],
    [
      "Les blogs de jeux vidéo",
      "De vieilles captures pixelisées racontent une époque"
    ],
    [
      "Les salons de discussion",
      "Deux anonymes parlent toute la nuit sans se connaître"
    ],
    [
      "Les pages HTML personnelles",
      "Un fond étoilé et un compteur de visites suffisaient"
    ],
    [
      "Les chaînes de mails",
      "Un message promettait le malheur sans dix transferts"
    ],
    [
      "Le lecteur MP3 rose",
      "Un appareil rayé possède toujours sa playlist"
    ],
    [
      "Les forums de fans",
      "Des fils de mille pages survivent à leur série"
    ],
    [
      "La webcam MSN",
      "Elle coupait toujours au mauvais moment"
    ],
    [
      "Les thèmes Windows XP",
      "Changer un curseur ressemblait à un projet artistique"
    ]
  ]
}
const handles = ["xX_ToxicMood_Xx","rainbow.exe","tradition_1984","admin_partiel","noctambule92","PixelMiette","Nostalgeek","sceptique75","carte_graphique","VieuxRouteur","BrouteurDuWeb","PaniqueManique","CassetteBleue","tonton_fibre","biscuitradio","pas_une_source","z3r0_404","NuitBlanche","ceci_est_mon_avis","la_marmotte","SodaClavier","SainteFlemme","ecran_cathodique","ContreSens","VeloursNoir","MauvaisEsprit","le_vrai_random","ChatDuForum","ClicDroit","ParanoLundi","BulleMSN","SaucisseQuantique","TheorieDuBanc","MademoiselleBug","PapierCarbone","ZenEnColere","retrofan_2006","mauvais_joueur","liseur_fou","source_pls"]
export const communityMembers: Member[] = handles.map((username, i) => ({
  id: 3000 + i, username, firstName: username, lastName: '', image: '/avatar.svg',
}))
const angles = [
  { title: (t: string) => t, body: (_t: string, s: string) => `Je lance le sujet parce que je viens de tomber sur ça : ${s}. Franchement, entre ceux qui hurlent sans réfléchir et ceux qui font semblant d'être au-dessus, on n'a toujours pas parlé du fond. Votre avis, mais avec des arguments si possible.` },
  { title: (t: string) => `Opinion impopulaire : ${t}`, body: (_t: string, s: string) => `Opinion impopulaire du jour : ${s}. Ça fait deux jours que je lis des réponses péremptoires et pas une personne ne prend la peine de poser le contexte. Vous voyez le problème ou je suis le seul ?` },
  { title: (t: string) => `Retour de terrain — ${t}`, body: (_t: string, s: string) => `Petit retour de terrain : ${s}. J'étais persuadé que le débat serait simple, mais les réactions sont complètement contradictoires. J'aimerais comprendre le point de vue de ceux qui ne sont pas d'accord.` },
  { title: (t: string) => `Avocat du diable : ${t}`, body: (_t: string, s: string) => `Je vais jouer l'avocat du diable. ${s}. Et si, pour une fois, on arrêtait de traiter les autres d'idiots et qu'on regardait ce qui a réellement provoqué la situation ? Je sens que les commentaires vont être sympathiques.` },
  { title: (t: string) => `Encore une polémique : ${t}`, body: (_t: string, s: string) => `Encore un épisode qui résume bien Internet : ${s}. Les premiers messages sont déjà une bataille de mauvaise foi. Je ne sais même plus si les gens croient à ce qu'ils écrivent. Des exemples similaires chez vous ?` },
]
const epoch = Date.parse('2026-10-20T17:55:00Z')
function buildPost(category: string, categoryIndex: number, topic: number, angle: number): Post {
  const [title, scenario] = topics[category][topic]
  const n = ((categoryIndex * 14 + topic) * angles.length) + angle
  const authorIndex = (n * 17 + categoryIndex * 11 + topic) % communityMembers.length
  // Répartition stable sur 580 jours. Les archives récentes remontent en tête.
  const dayOffset = (n * 73 + Math.floor(n / 13) * 11) % 580
  const minuteOffset = (n * 131) % 1260
  return {
    id: 20000 + n,
    title: angles[angle].title(title),
    body: angles[angle].body(title, scenario),
    tags: [category],
    reactions: { likes: (n * 37 + 15) % 680, dislikes: (n * 11 + 2) % 93 },
    views: 80 + (n * 79) % 12000,
    userId: communityMembers[authorIndex].id,
    createdAt: new Date(epoch - (dayOffset * 1440 + minuteOffset) * 60000).toISOString(),
    source: 'community',
  }
}
// Premier écran : textes éditoriaux plus incarnés, un pour chaque communauté.
const spotlights: Record<string, { title: string; body: string }> = {
  societe: {
    title: 'Vous êtes tous devenus les flics de votre propre palier',
    body: "Un mec a pris une photo du paillasson de son voisin pour la balancer au groupe de l'immeuble. Dans les réponses, certains demandent carrément une sanction. C'est un paillasson, bordel. Vous avez plus urgent dans votre vie ou on organise un procès avec témoins ?",
  },
  politique: {
    title: 'Le conseil municipal a débattu TROIS HEURES des abribus',
    body: "La réunion publique était censée parler de transports. Résultat : trois heures pour choisir entre deux nuances de bleu sur un abribus. Les vrais horaires ? Reportés. Et les militants des deux camps sont déjà en train de se traiter de vendus sur les réseaux. Impressionnant.",
  },
  tech: {
    title: 'Prod cassée à 17 h 58 : qui a poussé ça ?',
    body: "Le déploiement a fait tomber les connexions, le pipeline était vert et le commentaire de commit disait « petit fix ». Maintenant tout le monde cherche un coupable au lieu d'ouvrir les logs. Le code était peut-être nul, mais la chasse aux sorcières l'est encore plus.",
  },
  gaming: {
    title: 'Le type qui crie « skill issue » a fini dernier de sa team',
    body: "Quatre manches à insulter tout le monde au micro, zéro call utile, et monsieur termine avec deux éliminations. Il a quand même trouvé le moyen d'accuser le matchmaking. J'adore les jeux compétitifs, mais franchement cette faune mérite une série documentaire.",
  },
  musique: {
    title: 'Arrêtez de calculer des streams, écoutez les albums',
    body: "Sous la sortie d'un disque, les commentaires ne parlent que de records, de classements et de chiffres. Personne n'est capable de citer trois morceaux sans ouvrir une application. Vous êtes des fans ou le service comptabilité d'une maison de disques ?",
  },
  cinema: {
    title: 'Merci pour le spoiler dans le titre, bande de génies',
    body: "La série est sortie hier et une chaîne a déjà mis le nom du personnage mort EN MAJUSCULES dans sa miniature. Même pas un avertissement. Après ça vient pleurer sur l'algorithme qui pénalise les créateurs. Non, vous avez juste ruiné la surprise pour des clics.",
  },
  sport: {
    title: 'Les experts de canapé ont encore gagné la Ligue des commentaires',
    body: "Un match serré, deux erreurs d'arbitrage, et les mêmes comptes qui n'ont jamais mis les pieds sur un terrain expliquent comment tout refaire. Le pire ? Ils se contredisent d'un message à l'autre mais gardent leur ton de sélectionneur national.",
  },
  travail: {
    title: 'La réunion de 8 h pour décider… une autre réunion',
    body: "On s'est pointés à huit heures, caméra allumée, café brûlant. Trente-cinq minutes de « synergie » et de « mise en perspective » pour décider qu'on se reverra jeudi. J'ai perdu la moitié de ma matinée et gagné un nouveau rendez-vous. Magnifique civilisation.",
  },
  etudes: {
    title: 'Le groupe qui découvre GitHub la veille du rendu',
    body: "Quatre personnes sur le projet, une seule qui a fait un commit. Maintenant ça panique parce que « push » et « pull » seraient des mots obscurs. Le prof va demander une modif à l'oral et je donne cinq minutes avant la catastrophe industrielle.",
  },
  relations: {
    title: 'Les détectives du « vu à 22:14 » sont de sortie',
    body: "Quelqu'un a mis une capture d'un message lu sans réponse et les commentaires ont déjà inventé une rupture, une trahison et deux vies secrètes. Vous pouvez aussi envisager que la personne était sous la douche, hein. Concept révolutionnaire.",
  },
  random: {
    title: '[IMPORTANT] Mon imprimante me déteste personnellement',
    body: "Elle imprime la fiche de paie du voisin, les trois cents pages de la tante et un smiley débile trouvé sur Internet. Moi je demande UNE page en noir et blanc et j'ai « erreur inconnue ». Si quelqu'un connaît un exorciste pour périphériques USB, je prends.",
  },
  internet: {
    title: 'Les bots discutent entre eux et personne ne remarque rien',
    body: "Sous une photo de sandwich, trois comptes ont répondu « analyse passionnante, merci pour votre travail ». Le quatrième les a félicités pour leur objectivité. Je crois que la moitié du Web est devenue un dîner entre robots qui se passent le sel.",
  },
  paranormal: {
    title: 'J’ai entendu des pas dans le couloir condamné',
    body: "L'étage au-dessus est fermé depuis les travaux. Hier vers minuit, trois séries de pas, très distinctes. Je ne dis pas que c'est un fantôme, je dis que ça m'a foutu la trouille. Si quelqu'un a une explication moins dramatique qu'un film d'horreur, je prends.",
  },
  cuisine: {
    title: 'Les puristes des pâtes vont me tomber dessus',
    body: "J'ai mis de la crème dans une sauce. Oui. De la crème. Et j'ai osé manger l'assiette en entier. Les commentaires Instagram me réclament déjà un procès à Rome. Détendez-vous deux secondes, ça reste un dîner, pas un traité de paix.",
  },
  culture: {
    title: 'Le mec qui traite tout le monde d’inculte n’a pas lu le livre',
    body: "Il a passé quarante minutes à expliquer pourquoi ce roman était « indispensable ». Quand on lui demande ce qu'il pense du chapitre final, silence radio. Deux minutes plus tard il partage une citation qui n'existe même pas dans le texte. On est bien.",
  },
  economie: {
    title: 'Le « studio cosy » est littéralement un couloir',
    body: "Annonce immobilière du jour : neuf mètres carrés, lit collé au lavabo, « charme atypique », prix digne d'un palais. Dans les commentaires, un type défend le tarif au nom du marché. Le marché peut donc avoir honte à notre place ?",
  },
  science: {
    title: 'Une vidéo de trente secondes ne remplace pas une étude',
    body: "Un extrait sans méthode ni données circule avec le titre « LES SCIENTIFIQUES PANIQUENT ». Les scientifiques en question demandent juste qu'on arrête de découper leurs phrases. Mais bon, vérifier prend plus de temps que partager, apparemment.",
  },
  nostalgie: {
    title: 'J’ai rouvert mon Skyblog. J’aurais dû m’abstenir.',
    body: "Fond violet à étoiles, curseur pailleté, musique qui démarre toute seule et pseudo xX_Tenebres_Du_Coeur_Xx. J'avais écrit « personne me comprend » sous une photo de Naruto. Je veux disparaître, mais au fond ça me manque un peu.",
  },
}

export const communityPosts: Post[] = communities.flatMap((community, i) =>
  topics[community.slug].flatMap((_, topic) =>
    angles.map((_, angle) => {
      const base = buildPost(community.slug, i, topic, angle)
      if (topic !== 0 || angle !== 0) return base
      const spotlight = spotlights[community.slug]
      return { ...base, ...spotlight, createdAt: new Date(epoch - i * 19 * 60000).toISOString() }
    })),
).sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))

export const communityCount = communityPosts.length
