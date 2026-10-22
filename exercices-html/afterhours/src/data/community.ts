import type { Member, Post } from '../types'
/**
 * Catalogue éditorial déterministe.
 * 18 communautés × 14 situations × 5 angles = 1260 publications.
 * Les nouveaux posts des membres viennent uniquement du serveur local en mémoire.
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
      "Le droit d'être homophobe, vraiment ?",
      "Un compte exige de pouvoir insulter les couples gays sans subir la moindre réponse, puis crie à la censure quand on lui dit de la fermer"
    ],
    [
      "Une étudiante voilée refusée à l'entrée",
      "Un organisateur de soirée invoque un vague dress code et publie ensuite un communiqué sur la diversité"
    ],
    [
      "La vidéo de l'agression a fait dix millions de vues",
      "Tout le monde repartage la scène en prétendant aider la victime mais personne n'a demandé son accord"
    ],
    [
      "Le quartier réclame des caméras partout",
      "Un collectif veut filmer chaque entrée d'immeuble, même les enfants qui rentrent chez eux"
    ],
    [
      "L'accusé a été viré avant toute enquête",
      "Une capture d'écran anonyme suffit à faire perdre son emploi à une personne et les commentaires réclament encore pire"
    ],
    [
      "Les toilettes inclusives provoquent une guerre",
      "Une mairie installe des sanitaires accessibles à tous et le fil se transforme en campagne de panique morale"
    ],
    [
      "Le propriétaire refuse les familles monoparentales",
      "Un bailleur dit préférer les dossiers stables, puis découvre que son annonce circule partout"
    ],
    [
      "La pauvreté serait un choix ?",
      "Un influenceur explique que les sans-abri manquent de volonté depuis une voiture de luxe"
    ],
    [
      "Le harcèlement scolaire filmé pour rire",
      "Des élèves repartagent une humiliation en boucle en se cachant derrière la blague"
    ],
    [
      "La police contrôle toujours le même adolescent",
      "Une famille dénonce des contrôles répétés et le forum se divise avant même de connaître les faits"
    ],
    [
      "Une soirée refuse les plus de trente ans",
      "Le patron défend sa sélection au nom de l'ambiance et s'étonne de recevoir des accusations de discrimination"
    ],
    [
      "Un compte exige de publier les noms des suspects",
      "Les commentaires veulent livrer des identités à la foule malgré une enquête encore en cours"
    ],
    [
      "La liberté d'expression à sens unique",
      "Un chroniqueur réclame un débat sans limite puis demande le licenciement de son contradicteur"
    ],
    [
      "Faut-il séparer l'artiste de ses actes ?",
      "Un festival invite un artiste accusé de comportements graves et traite toute critique de morale puritaine"
    ]
  ],
  "politique": [
    [
      "La surveillance de masse au nom de la sécurité",
      "Un projet de loi permettrait d'analyser les images des rues et les élus parlent d'une mesure provisoire"
    ],
    [
      "Un élu veut couper les aides sociales après trois refus",
      "Le responsable promet de punir les profiteurs sans expliquer comment seront traitées les personnes handicapées"
    ],
    [
      "Une campagne joue sur la peur des étrangers",
      "Un candidat diffuse une vidéo dramatique sans statistiques ni contexte et son équipe parle de communication efficace"
    ],
    [
      "Un parti veut interdire les manifestations non déclarées",
      "Le texte vise les rassemblements spontanés et chacun prétend défendre la démocratie"
    ],
    [
      "La réforme des retraites votée pendant la nuit",
      "Les débats sont clos avant que les syndicats puissent répondre aux derniers amendements"
    ],
    [
      "La mairie rachète un journal local",
      "Un maire présente l'opération comme un soutien à la presse et les journalistes s'inquiètent de leur indépendance"
    ],
    [
      "Un député propose de noter les citoyens",
      "Un système de points récompenserait les comportements jugés civiques sans contrôle indépendant"
    ],
    [
      "La promesse de transparence a disparu",
      "Des documents promis pendant la campagne deviennent soudain confidentiels après l'élection"
    ],
    [
      "Référendum sur un sujet incompréhensible",
      "Les affiches opposent deux slogans mais aucun ne décrit les conséquences du texte"
    ],
    [
      "Le ministre conseille de travailler plus pour vivre mieux",
      "Sa déclaration arrive le jour où un rapport décrit l'épuisement des travailleurs précaires"
    ],
    [
      "Interdire les réseaux aux mineurs ?",
      "Un projet imposerait une identification obligatoire à tout le monde pour vérifier les âges"
    ],
    [
      "Les élus devraient-ils être anonymes en ligne ?",
      "Un responsable gère plusieurs comptes d'opinion sans déclarer ses liens avec la campagne"
    ],
    [
      "Le débat sur le droit de manifester",
      "Une mobilisation pacifique est interdite à cause d'incidents commis lors d'un autre événement"
    ],
    [
      "Le gouvernement appelle à l'unité après avoir insulté l'opposition",
      "Un porte-parole réclame du respect quelques heures après une attaque personnelle en direct"
    ]
  ],
  "tech": [
    [
      "Le patron surveille les webcams des télétravailleurs",
      "Une entreprise utilise un logiciel qui prend des captures régulières sans prévenir clairement les salariés"
    ],
    [
      "Une application vend les données de ses utilisateurs",
      "Un service gratuit partage les habitudes de navigation avec des courtiers en publicité"
    ],
    [
      "Les deepfakes détruisent une réputation en une journée",
      "Une fausse vidéo intime circule massivement avant que la personne visée puisse réagir"
    ],
    [
      "L'IA refuse de dire qui a entraîné le modèle",
      "Une start-up vend un outil créatif et élude les questions sur les œuvres utilisées"
    ],
    [
      "Un développeur publie une faille pour forcer une correction",
      "L'entreprise menace de poursuites au lieu de répondre aux signalements antérieurs"
    ],
    [
      "Des comptes supprimés restent dans les sauvegardes",
      "Le service prétend effacer toutes les données mais une archive ressort six mois après"
    ],
    [
      "Le recrutement automatique rejette certains profils",
      "Un algorithme écarte systématiquement des candidatures comparables et personne ne connaît le critère"
    ],
    [
      "La reconnaissance faciale dans les transports",
      "Un opérateur installe des caméras intelligentes pour lutter contre la fraude"
    ],
    [
      "Les enfants surveillés par leurs montres",
      "Une famille partage les déplacements en direct et découvre que l'application conserve l'historique"
    ],
    [
      "Le jeu vidéo qui écoute le micro en permanence",
      "Une fonctionnalité marketing exige une permission qui dépasse largement son usage"
    ],
    [
      "La modération automatique suspend un compte de victime",
      "Un témoignage de harcèlement est effacé pendant que les provocations restent accessibles"
    ],
    [
      "Un fournisseur coupe le service d'un collectif militant",
      "L'hébergeur invoque ses conditions générales et refuse de préciser la violation"
    ],
    [
      "Les assistants IA inventent des sources",
      "Une réponse totalement fausse cite de vrais titres d'articles qui n'ont jamais dit ça"
    ],
    [
      "Le logiciel obligatoire dans les écoles collecte trop de données",
      "Les parents découvrent que les statistiques sont revendues à des partenaires"
    ]
  ],
  "gaming": [
    [
      "Un streamer insulte ses viewers puis vend la bienveillance",
      "Les extraits de ses directs ressortent le jour de sa campagne anti-harcèlement"
    ],
    [
      "Une joueuse se fait exclure du vocal dès qu'elle parle",
      "Ses coéquipiers prétendent que ce n'est que de l'humour alors qu'elle reçoit des messages agressifs"
    ],
    [
      "Le studio vend des coffres aléatoires à des mineurs",
      "Des joueurs dépensent sans comprendre les probabilités et l'éditeur parle de surprise"
    ],
    [
      "Le tournoi couvre un joueur accusé de triche",
      "Les organisateurs refusent de publier les vérifications au nom de la confidentialité"
    ],
    [
      "Les modérateurs protègent le gros donateur",
      "Un abonné payant menace d'autres joueurs et ses messages restent visibles"
    ],
    [
      "Une communauté organise le harcèlement d'un développeur",
      "Les critiques d'un patch deviennent des attaques personnelles massives"
    ],
    [
      "Un créateur de mods fait payer le travail des autres",
      "Des fichiers communautaires se retrouvent dans une offre premium sans autorisation"
    ],
    [
      "La streameuse doit prouver qu'elle joue vraiment",
      "Le forum épluche chaque extrait pour lui trouver un prétendu coach caché"
    ],
    [
      "Un jeu supprime du contenu payé",
      "La licence change et les achats de plusieurs années deviennent inutilisables"
    ],
    [
      "Une équipe organise des paris sur ses propres matchs",
      "Des joueurs sont soupçonnés de manipuler des rencontres et le public réclame des preuves"
    ],
    [
      "Les jeux bannissent les insultes mais récompensent la provocation",
      "Les sanctions tombent sur les réponses tandis que les provocateurs restent célèbres"
    ],
    [
      "Un classement public révèle des données personnelles",
      "Des pseudos sont reliés à des comptes privés après une mise à jour"
    ],
    [
      "Le studio exploite des stagiaires non payés",
      "Les crédits du jeu remercient une passion bénévole ayant travaillé plusieurs mois"
    ],
    [
      "Les mineurs sur les serveurs vocaux",
      "Un serveur communautaire refuse d'expliquer comment il protège ses plus jeunes membres"
    ]
  ],
  "musique": [
    [
      "Un festival maintient un artiste malgré des accusations graves",
      "L'organisation invoque la présomption d'innocence mais ignore les témoignages qui circulent"
    ],
    [
      "Les maisons de disques achètent-elles les tendances ?",
      "Des playlists officielles favorisent des titres liés à leurs propres partenaires"
    ],
    [
      "Un rappeur insulte son public puis exige du respect",
      "Une séquence de concert divise fans et organisateurs"
    ],
    [
      "La tournée annonce des billets hors de prix",
      "Les places accessibles disparaissent avant l'ouverture au grand public"
    ],
    [
      "Un label retire un clip après une controverse",
      "Le morceau est présenté comme une œuvre censurée tandis que d'autres parlent de provocation calculée"
    ],
    [
      "Le producteur garde tous les droits d'une jeune chanteuse",
      "Un contrat déséquilibré ressort au moment de son premier succès"
    ],
    [
      "L'artiste joue la révolution avec une marque de luxe",
      "Une chanson anticapitaliste sert à vendre des vêtements hors de prix"
    ],
    [
      "Une chanteuse reçoit des menaces pour une prise de position",
      "Des fans organisent des appels au boycott après un message politique"
    ],
    [
      "Le playback vendu comme un concert exceptionnel",
      "Des spectateurs découvrent que plusieurs passages sont préenregistrés"
    ],
    [
      "Des samples pris sans crédit",
      "Un producteur s'attribue une boucle retrouvée chez un musicien indépendant"
    ],
    [
      "La presse attaque le physique des artistes",
      "Un critique analyse une performance en ne parlant que de l'apparence de la chanteuse"
    ],
    [
      "L'album posthume que personne n'a autorisé",
      "Un catalogue sort des morceaux inachevés pour profiter de la disparition d'un musicien"
    ],
    [
      "L'industrie maquille ses chiffres de streams",
      "Des comptes de diffusion artificielle feraient grimper certains artistes"
    ],
    [
      "Une chanson politique interdite d'antenne",
      "Une radio invoque l'apaisement alors qu'elle diffuse régulièrement des éditoriaux provocateurs"
    ]
  ],
  "cinema": [
    [
      "Une série supprime un personnage gay pour vendre à l'étranger",
      "La production parle de contraintes de montage tandis que l'équipe accuse la direction de céder"
    ],
    [
      "Un acteur accusé reste en tête d'affiche",
      "Le studio mise sur le silence et les fans s'écharpent autour des témoignages"
    ],
    [
      "Les scènes d'intimité tournées sans protections",
      "Une comédienne raconte une pression sur le plateau que la production minimise"
    ],
    [
      "Le film historique réécrit une répression",
      "Une fiction présente des victimes comme responsables des violences subies"
    ],
    [
      "Un réalisateur appelle les critiques des idiots",
      "Après un flop, l'équipe accuse le public au lieu d'écouter les retours"
    ],
    [
      "Les enfants stars abandonnés après le succès",
      "Une enquête révèle des tournages épuisants et un accompagnement insuffisant"
    ],
    [
      "La plateforme coupe un épisode controversé",
      "Le diffuseur invoque les risques tandis que des abonnés réclament un avertissement plutôt qu'un retrait"
    ],
    [
      "Une campagne de harcèlement contre une actrice",
      "Une partie du fandom lui attribue la responsabilité d'un scénario qu'elle n'a pas écrit"
    ],
    [
      "Le film financé par un groupe d'influence",
      "Des liens financiers apparaissent après la sortie d'un documentaire présenté comme indépendant"
    ],
    [
      "Les critiques achetées avec des invitations",
      "Des chroniqueurs ne signalent pas leurs voyages offerts par le distributeur"
    ],
    [
      "Les figurants traités comme jetables",
      "Une production impose des journées interminables sans pause suffisante"
    ],
    [
      "Un personnage raciste présenté comme modèle",
      "Le film laisse le spectateur dans l'ambiguïté et les débats s'enflamment"
    ],
    [
      "Faut-il censurer les vieux films ?",
      "Des scènes datées soulèvent un débat entre contextualisation et suppression"
    ],
    [
      "Le studio accuse le piratage de tous ses problèmes",
      "Les salariés décrivent une production mal gérée et des coupes budgétaires"
    ]
  ],
  "sport": [
    [
      "Un club couvre des insultes racistes dans les tribunes",
      "La direction parle d'un incident isolé tandis que les supporters publient plusieurs vidéos"
    ],
    [
      "Une athlète harcelée sur son identité",
      "Des commentaires lui demandent des preuves intimes pour justifier sa place en compétition"
    ],
    [
      "L'entraîneur humiliant filmé en cachette",
      "Une vidéo montre des propos dégradants envers des adolescents"
    ],
    [
      "Le sponsor interdit les prises de position des joueurs",
      "Un contrat sanctionne un athlète après une déclaration politique"
    ],
    [
      "Un club ferme les yeux sur une agression",
      "La direction protège sa vedette et demande aux victimes de se taire"
    ],
    [
      "Les paris sportifs ciblent les adolescents",
      "Des créateurs très jeunes diffusent des promotions pour des plateformes de jeu"
    ],
    [
      "L'égalité de traitement entre équipes féminines et masculines",
      "Les primes et infrastructures sont très différentes au sein d'un même club"
    ],
    [
      "L'arbitre menacé après une décision",
      "Un match amateur se termine par des messages d'intimidation"
    ],
    [
      "La fédération empêche des sportifs de parler",
      "Une clause contractuelle limiterait les témoignages sur les conditions d'entraînement"
    ],
    [
      "Le contrôle antidopage réservé aux inconnus",
      "Les vedettes semblent bénéficier d'une procédure plus discrète"
    ],
    [
      "Une marque utilise une tragédie pour vendre des maillots",
      "Une campagne de communication choque les supporters concernés"
    ],
    [
      "Les supporters interdits de déplacement",
      "Une sanction collective frappe des familles sans lien avec les incidents"
    ],
    [
      "Un jeune joueur sacrifié pour les résultats",
      "Une blessure connue est ignorée avant une rencontre importante"
    ],
    [
      "Les journalistes expulsés d'une conférence",
      "Le club refuse les questions sur ses finances et ferme le point presse"
    ]
  ],
  "travail": [
    [
      "Un manager refuse une promotion après un coming out",
      "Le salarié décrit un changement brutal d'attitude depuis qu'il a parlé de sa vie privée"
    ],
    [
      "Le chef menace de virer ceux qui se syndiquent",
      "Une note interne décourage l'adhésion à une représentation du personnel"
    ],
    [
      "Une entreprise exige le téléphone personnel des salariés",
      "Un outil de surveillance doit être installé sur les appareils privés"
    ],
    [
      "Le patron affiche des valeurs féministes et paie moins les femmes",
      "Des grilles de salaires internes contredisent la communication officielle"
    ],
    [
      "Un stagiaire non payé fait tourner le service",
      "Les tâches confiées dépassent largement la formation promise"
    ],
    [
      "La RH demande un justificatif pour chaque minute d'absence",
      "Les salariés doivent expliquer leurs passages aux toilettes"
    ],
    [
      "Les heures supplémentaires disparaissent des fiches",
      "Plusieurs collègues comparent leurs relevés et signalent des écarts"
    ],
    [
      "Le collègue accusé sans enquête",
      "Une rumeur suffit à justifier une mise à l'écart publique"
    ],
    [
      "Le licenciement annoncé par un message automatique",
      "Des employés découvrent la fin de leur contrat dans une notification"
    ],
    [
      "Le patron appelle sa boîte une famille",
      "Le même dirigeant refuse un congé pour une urgence personnelle"
    ],
    [
      "La discrimination à l'embauche filmée",
      "Un recruteur commente ouvertement le nom et l'origine supposée d'un candidat"
    ],
    [
      "Une prime réservée aux amis de la direction",
      "Les critères changent chaque fois qu'un salarié demande des explications"
    ],
    [
      "Le burnout utilisé comme argument marketing",
      "Une entreprise lance une semaine du bien-être après une vague de départs"
    ],
    [
      "Un accord de confidentialité pour cacher les abus",
      "Des salariés disent avoir été poussés à signer avant de raconter leur expérience"
    ]
  ],
  "etudes": [
    [
      "Le prof note plus sévèrement les filles en informatique",
      "Des copies anonymisées obtiennent de meilleures notes que les mêmes travaux signés"
    ],
    [
      "Un groupe partage les photos intimes d'une élève",
      "Des captures privées circulent dans un chat de classe et certains appellent ça une blague"
    ],
    [
      "Le harcèlement scolaire ignoré par la direction",
      "Des signalements répétés n'ont déclenché aucune mesure"
    ],
    [
      "Une école vend un diplôme hors de prix",
      "Des étudiants découvrent que la certification annoncée n'est pas reconnue"
    ],
    [
      "L'IA rédige tout le mémoire",
      "Un étudiant défend son diplôme alors qu'il ne peut expliquer aucun paragraphe"
    ],
    [
      "Un professeur humilie un étudiant à l'oral",
      "Des élèves enregistrent la scène et hésitent à la rendre publique"
    ],
    [
      "Des parents veulent supprimer un livre du programme",
      "Une œuvre qui parle de sexualité et d'identité provoque une campagne de pression"
    ],
    [
      "Le stage obligatoire sans indemnité",
      "L'établissement impose des semaines de travail à des étudiants précaires"
    ],
    [
      "Un étudiant sanctionné pour avoir dénoncé des violences",
      "La procédure disciplinaire cible la personne qui a alerté"
    ],
    [
      "Le classement public des mauvais élèves",
      "Une école affiche les noms et les notes sur un écran accessible"
    ],
    [
      "La fraude aux examens couverte pour préserver les résultats",
      "Une filière refuse de revoir des copies suspectes"
    ],
    [
      "Une conférence militante interdite sur le campus",
      "L'administration évoque le calme alors que l'événement était déclaré"
    ],
    [
      "Des caméras dans les salles de cours",
      "Une école veut surveiller les élèves en permanence au nom de la sécurité"
    ],
    [
      "Le favoritisme sur les projets d'alternance",
      "Les meilleures offres seraient réservées aux proches d'un responsable"
    ]
  ],
  "relations": [
    [
      "Mon ex a publié nos conversations privées",
      "Des messages sortis de leur contexte circulent pour humilier l'autre personne"
    ],
    [
      "Le compte qui surveille chaque abonné",
      "Une relation impose de partager ses mots de passe et ses déplacements"
    ],
    [
      "La jalousie présentée comme une preuve d'amour",
      "Des conseils viraux normalisent le contrôle du téléphone de son partenaire"
    ],
    [
      "Un influenceur humilie son ex en direct",
      "Les abonnés choisissent un camp sans entendre l'autre version"
    ],
    [
      "Un groupe d'amis couvre des comportements toxiques",
      "Tout le monde sait qu'une personne intimide les autres mais personne n'ose lui dire"
    ],
    [
      "Le consentement traité comme un détail",
      "Un témoignage décrit des limites ignorées et les commentaires cherchent des excuses"
    ],
    [
      "Les applications de rencontre et les mensonges",
      "Un profil cache des informations essentielles pour obtenir des rendez-vous"
    ],
    [
      "Le harcèlement déguisé en reconquête romantique",
      "Une personne reçoit des messages incessants malgré un refus clair"
    ],
    [
      "La rupture transformée en tribunal public",
      "Des proches sont invités à voter sur qui a tort"
    ],
    [
      "Une personne menace de diffuser des photos privées",
      "Un ancien partenaire utilise des fichiers intimes comme moyen de pression"
    ],
    [
      "Les amis qui exposent les confidences",
      "Une confidence sur la santé mentale se retrouve racontée devant tout le monde"
    ],
    [
      "Un coach amoureux vend la domination comme conseil",
      "Une formation promet de manipuler émotionnellement les rencontres"
    ],
    [
      "Les faux témoignages qui détruisent la réputation",
      "Un compte anonyme publie une accusation sans élément vérifiable"
    ],
    [
      "Un parent espionne les messages d'un adulte",
      "Une famille exige l'accès aux conversations d'un enfant devenu majeur"
    ]
  ],
  "random": [
    [
      "Un anonyme veut publier les coordonnées de son ennemi",
      "Un fil encourage à retrouver un utilisateur après une dispute absurde"
    ],
    [
      "Les trolls fabriquent une fausse disparition",
      "Un groupe lance une rumeur sordide pour tester la crédulité des internautes"
    ],
    [
      "Un faux compte d'urgence affole une ville",
      "Une capture annonçant un danger inexistant circule toute la nuit"
    ],
    [
      "Le défi viral qui humilie des inconnus",
      "Des vidéos montrent des passants piégés pour des vues"
    ],
    [
      "Une campagne de signalements contre un ado",
      "Des comptes veulent faire bannir un jeune utilisateur après une dispute"
    ],
    [
      "Un modérateur revend des archives privées",
      "Des captures de conversations effacées réapparaissent sur un autre forum"
    ],
    [
      "Une personne poste une confession anonyme inquiétante",
      "Le fil hésite entre un troll, un appel à l'aide et une invention"
    ],
    [
      "Le forum célèbre un piratage de compte",
      "Des messages privés volés circulent au prétexte que la victime est insupportable"
    ],
    [
      "La fausse collecte pour une catastrophe",
      "Un compte récupère de l'argent avec une histoire impossible à confirmer"
    ],
    [
      "Le concours de la pire opinion du jour",
      "Des utilisateurs cherchent volontairement la formulation la plus choquante"
    ],
    [
      "Un thread prétend identifier un suspect sur une photo",
      "Des internautes mettent en danger un inconnu à partir d'une image floue"
    ],
    [
      "Une menace présentée comme une blague",
      "L'auteur explique qu'il trollait pendant que la personne visée a peur"
    ],
    [
      "Le serveur découvre un salon caché",
      "Des archives prouvent que certains habitués échangeaient des humiliations privées"
    ],
    [
      "Les admins bannissent les victimes de raids",
      "Des utilisateurs sanctionnés racontent que les provocateurs restent actifs"
    ]
  ],
  "internet": [
    [
      "Le forum refuse de supprimer des propos homophobes",
      "Les modérateurs invoquent la liberté d'expression tandis que les membres visés quittent la plateforme"
    ],
    [
      "Une campagne coordonnée harcèle une journaliste",
      "Des centaines de comptes publient le même montage dégradant"
    ],
    [
      "Un faux article accuse une association de crimes",
      "La publication circule sans source et la correction reste invisible"
    ],
    [
      "Des deepfakes pornographiques circulent",
      "Une plateforme tarde à retirer des montages intimes non consentis"
    ],
    [
      "Les recommandations poussent les discours extrêmes",
      "Un utilisateur part d'une vidéo anodine et reçoit des contenus de plus en plus agressifs"
    ],
    [
      "Le compte vérifié invente une statistique",
      "Une donnée fabriquée est relayée par des milliers d'abonnés"
    ],
    [
      "Un groupe privé organise des raids de commentaires",
      "Des inconnus arrivent en masse pour faire taire un témoignage"
    ],
    [
      "La modération vend sa neutralité à des annonceurs",
      "Les contenus d'une marque échappent aux règles appliquées aux autres"
    ],
    [
      "Une rumeur raciste devient tendance",
      "Des captures hors contexte accusent une communauté entière après un incident isolé"
    ],
    [
      "Un site refuse de supprimer des données personnelles",
      "Une personne demande le retrait d'une ancienne adresse exposée"
    ],
    [
      "Les faux profils imitent des militants opposés",
      "Des comptes créent de fausses disputes pour attiser la colère"
    ],
    [
      "Une vidéo coupée transforme une victime en agresseur",
      "Les premières réactions persistent même après publication du contexte"
    ],
    [
      "L'application récompense la haine par des vues",
      "Les messages les plus insultants sont mis en avant dans les tendances"
    ],
    [
      "Un anonyme exige le droit d'insulter les autres",
      "Il se plaint d'être censuré quand on lui répond sur le même ton"
    ]
  ],
  "paranormal": [
    [
      "Un gourou réclame l'argent de familles endeuillées",
      "Un collectif vend de prétendus messages de proches décédés"
    ],
    [
      "Une chaîne annonce une catastrophe sans preuve",
      "Des vidéos alarmistes provoquent une panique bien réelle"
    ],
    [
      "Un influenceur invente une possession pour des vues",
      "Des proches s'inquiètent pendant qu'une équipe tourne des épisodes"
    ],
    [
      "Une communauté prétend soigner sans médecins",
      "Un groupe déconseille les soins sérieux au profit de rituels payants"
    ],
    [
      "Une fausse séance spirite vise des mineurs",
      "Des organisateurs récoltent des secrets personnels sous couvert de jeu"
    ],
    [
      "Le forum accusé de lancer une chasse aux sorcières",
      "Des rumeurs désignent une voisine comme responsable de tous les malheurs"
    ],
    [
      "Une vidéo d'OVNI devient une théorie politique",
      "Des comptes y voient un complot mondial sans autre élément"
    ],
    [
      "Des témoignages retouchés vendus comme preuves",
      "Des images recyclées circulent pour attirer des dons"
    ],
    [
      "Un faux médium menace de malédiction",
      "Des personnes vulnérables paient pour faire disparaître une peur fabriquée"
    ],
    [
      "Un site exploite une disparition non résolue",
      "Des créateurs de contenu utilisent le drame d'une famille pour leurs vidéos"
    ],
    [
      "La paranoïa nourrie par un groupe de discussion",
      "Chaque hasard est présenté comme la preuve d'une surveillance secrète"
    ],
    [
      "Un salon privé collecte les cauchemars des membres",
      "Les confidences servent ensuite à impressionner les nouveaux arrivants"
    ],
    [
      "Une secte numérique impose le silence",
      "Des participants craignent de partir après avoir donné trop d'informations"
    ],
    [
      "Le témoignage qui sent le canular",
      "Un récit spectaculaire divise ceux qui veulent croire et ceux qui demandent des preuves"
    ]
  ],
  "cuisine": [
    [
      "Un chef star insulte ses employés en cuisine",
      "Une vidéo de service montre des humiliations qu'on justifie par l'exigence"
    ],
    [
      "La restauration cache des heures non payées",
      "D'anciens salariés comparent des plannings impossibles à tenir"
    ],
    [
      "Un restaurant ment sur les allergènes",
      "Une personne explique avoir été mise en danger malgré ses questions"
    ],
    [
      "Les livreurs privés de pause",
      "Une plateforme impose des délais sans tenir compte des conditions de travail"
    ],
    [
      "Un influenceur accuse un restaurant sans preuve",
      "Un établissement subit des centaines d'avis négatifs après une vidéo virale"
    ],
    [
      "La cuisine végétale devient une guerre culturelle",
      "Une proposition de menu alternatif provoque des insultes contre les deux camps"
    ],
    [
      "Des cuisines sales couvertes par de faux avis",
      "Une entreprise affiche des évaluations parfaites alors que des employés témoignent"
    ],
    [
      "Un patron refuse de servir un couple gay",
      "Le restaurant invoque ses convictions et les clients organisent un boycott"
    ],
    [
      "Les menus sans prix pour certains clients",
      "Un établissement pratique une sélection discrète selon l'apparence des visiteurs"
    ],
    [
      "Une chaîne prétend vendre du local",
      "Des cartons importés apparaissent dans une vidéo tournée en réserve"
    ],
    [
      "Un concours culinaire exploite ses candidats",
      "Les participants travaillent gratuitement pendant plusieurs semaines"
    ],
    [
      "Les intoxications minimisées par la direction",
      "Plusieurs clients signalent un problème et le responsable accuse la concurrence"
    ],
    [
      "Les invendus détruits devant des personnes affamées",
      "Une enseigne défend ses procédures et les associations dénoncent le gaspillage"
    ],
    [
      "Une publicité diabolise les corps gros",
      "Une campagne de produits minceur choque après ses messages humiliants"
    ]
  ],
  "culture": [
    [
      "Une bibliothèque retire les livres LGBT des rayons",
      "Des élus exigent que des romans disparaissent de la section jeunesse"
    ],
    [
      "Un musée conserve des œuvres issues de pillages",
      "Les demandes de restitution sont ignorées depuis des années"
    ],
    [
      "Un éditeur censure un roman pour calmer une polémique",
      "Des passages sur les discriminations disparaissent sans accord de l'auteur"
    ],
    [
      "Un festival invite un polémiste connu pour ses insultes",
      "Les organisateurs parlent de débat pluraliste malgré les protestations"
    ],
    [
      "Un auteur accusé de violences reçoit un prix",
      "Le jury refuse d'aborder les accusations et le public se fracture"
    ],
    [
      "Les œuvres coloniales sans contexte dans une exposition",
      "Une scénographie présente des conquêtes violentes comme de simples aventures"
    ],
    [
      "Le financement public d'une œuvre controversée",
      "Une pièce provocatrice déclenche une campagne pour retirer les subventions"
    ],
    [
      "Un théâtre licencie après une prise de position",
      "Une comédienne perd un rôle pour avoir critiqué la direction"
    ],
    [
      "Des œuvres d'art vendues avec de faux certificats",
      "Une galerie nie toute responsabilité après plusieurs contestations"
    ],
    [
      "Un critique traite des lecteurs de sous-culture",
      "Un chroniqueur dit que certains goûts prouvent l'ignorance du public"
    ],
    [
      "Un roman interdit dans un établissement scolaire",
      "Une scène difficile sert de prétexte pour supprimer l'ensemble du livre"
    ],
    [
      "Des artistes utilisent des archives privées sans accord",
      "Une exposition affiche des lettres personnelles appartenant à des familles"
    ],
    [
      "La modération des commentaires littéraires",
      "Des discussions sur la religion et l'identité deviennent des attaques personnelles"
    ],
    [
      "Un musée sponsorisé par une entreprise accusée d'abus",
      "L'institution défend le mécénat tandis que des visiteurs dénoncent le partenariat"
    ]
  ],
  "economie": [
    [
      "Le propriétaire augmente le loyer après une rénovation minime",
      "Des locataires reçoivent une hausse énorme pour un simple coup de peinture"
    ],
    [
      "Une grande entreprise licencie puis annonce des bénéfices records",
      "La direction célèbre ses résultats pendant que des équipes ferment"
    ],
    [
      "Les frais bancaires frappent les clients les plus pauvres",
      "Un rapport interne révèle que les pénalités touchent surtout les comptes fragiles"
    ],
    [
      "Un patron demande aux salariés de renoncer aux primes",
      "La direction invoque la solidarité mais conserve ses avantages"
    ],
    [
      "Les influenceurs vendent des investissements miracles",
      "Une promotion annonce des gains sans présenter les risques"
    ],
    [
      "Un bailleur refuse les dossiers portant certains noms",
      "Des candidats comparent leurs réponses et soupçonnent une discrimination"
    ],
    [
      "Les restaurants facturent des frais cachés",
      "Le prix final apparaît seulement au paiement"
    ],
    [
      "La publicité cible les personnes endettées",
      "Un service de crédit propose des emprunts faciles à des foyers en difficulté"
    ],
    [
      "Une marque gonfle ses prix avant le Black Friday",
      "Des historiques de prix contredisent les remises annoncées"
    ],
    [
      "Les livreurs paient leur propre équipement",
      "Une plateforme impose du matériel coûteux sans compensation"
    ],
    [
      "Une chaîne détruit des stocks pour maintenir les prix",
      "Des employés dénoncent le gaspillage pendant une période de pénurie"
    ],
    [
      "Une collecte de dons finance les dirigeants",
      "Des comptes internes montrent des dépenses sans lien avec la cause affichée"
    ],
    [
      "Des stages deviennent du travail gratuit",
      "Une entreprise remplace des postes par des rotations de stagiaires"
    ],
    [
      "Le discours « si tu es pauvre c'est ta faute »",
      "Un millionnaire explique la précarité par la paresse sans parler des salaires"
    ]
  ],
  "science": [
    [
      "Un laboratoire cache les effets indésirables d'un essai",
      "Une équipe demande que toutes les données soient publiées avant toute conclusion"
    ],
    [
      "Un influenceur diffuse des mensonges sur les vaccins",
      "Une vidéo affirme des dangers sans preuves et décourage des soins utiles"
    ],
    [
      "Le débat climatique détourné par un faux graphique",
      "Une courbe manipulée devient virale avant son démenti"
    ],
    [
      "Un programme de recherche utilise des données sans consentement",
      "Des participants découvrent que leurs informations ont été partagées"
    ],
    [
      "Une entreprise vend des tests génétiques douteux",
      "Des clients reçoivent des prédictions médicales contradictoires"
    ],
    [
      "L'eugénisme déguisé en innovation",
      "Une conférence propose de classer les personnes selon une prétendue valeur biologique"
    ],
    [
      "Une étude payée par l'industrie sans transparence",
      "Le financement principal n'apparaît pas dans la communication"
    ],
    [
      "Des expériences sur des animaux sans contrôle suffisant",
      "Des chercheurs réclament la publication des protocoles"
    ],
    [
      "Une publicité promet de guérir la dépression avec un gadget",
      "Le marketing exploite une détresse réelle sans essai sérieux"
    ],
    [
      "Un journaliste transforme une hypothèse en certitude",
      "Un résultat préliminaire devient une annonce définitive"
    ],
    [
      "Des données personnelles publiées dans un article",
      "Des participants à une étude sont identifiables malgré les promesses"
    ],
    [
      "Une alerte sanitaire inventée se répand en quelques heures",
      "Un faux document attribué à un hôpital provoque des appels paniqués"
    ],
    [
      "Le scientifique harcelé après avoir corrigé une erreur",
      "Un chercheur reçoit des menaces pour avoir démenti une vidéo virale"
    ],
    [
      "Un classement de QI utilisé pour humilier des groupes",
      "Des chiffres douteux deviennent le prétexte à des attaques discriminatoires"
    ]
  ],
  "nostalgie": [
    [
      "Les vieux forums protégeaient-ils vraiment les jeunes ?",
      "D'anciens membres évoquent les humiliations banalisées sous prétexte d'humour"
    ],
    [
      "Une archive de Skyblog détruit une réputation",
      "Des messages écrits à quinze ans sont utilisés pour harceler un adulte"
    ],
    [
      "MSN et les adultes qui contactaient des mineurs",
      "Des témoignages rappellent que les salons n'étaient pas seulement innocents"
    ],
    [
      "L'époque des raids entre forums",
      "Des utilisateurs organisaient des campagnes pour faire tomber des sites rivaux"
    ],
    [
      "Les chaînes de mails anxiogènes",
      "De faux messages menaçaient les adolescents qui ne transféraient pas une histoire"
    ],
    [
      "Une signature de forum remplie d'insultes racistes",
      "D'anciens messages remontent et divisent ceux qui parlent de contexte et les autres"
    ],
    [
      "Des profils supprimés restent archivés",
      "Des années après la fermeture d'un site, des informations privées réapparaissent"
    ],
    [
      "Le pseudonyme devenu une arme",
      "Une vieille identité en ligne est reliée à la vie actuelle d'un utilisateur"
    ],
    [
      "Les webcams MSN et la vie privée",
      "Des captures d'anciennes conversations circulent sans accord"
    ],
    [
      "Le cyberharcèlement avant les réseaux modernes",
      "Les victimes racontent des campagnes d'humiliation déjà organisées en 2007"
    ],
    [
      "Le mot « troll » comme excuse universelle",
      "Certains justifiaient des menaces derrière un « c'était pour rire »"
    ],
    [
      "Les modérateurs arbitraires des forums",
      "Un administrateur bannissait ses contradicteurs et protégeait ses amis"
    ],
    [
      "La nostalgie efface les mauvais souvenirs",
      "Des anciens défendent une époque dont d'autres gardent une expérience terrible"
    ],
    [
      "Les blogs personnels et les fausses confidences",
      "Des comptes anonymes recueillaient des secrets puis les publiaient ailleurs"
    ]
  ]
}
const handles = ["xX_ToxicMood_Xx","rainbow.exe","tradition_1984","admin_partiel","noctambule92","PixelMiette","Nostalgeek","sceptique75","carte_graphique","VieuxRouteur","BrouteurDuWeb","PaniqueManique","CassetteBleue","tonton_fibre","biscuitradio","pas_une_source","z3r0_404","NuitBlanche","ceci_est_mon_avis","la_marmotte","SodaClavier","SainteFlemme","ecran_cathodique","ContreSens","VeloursNoir","MauvaisEsprit","le_vrai_random","ChatDuForum","ClicDroit","ParanoLundi","BulleMSN","SaucisseQuantique","TheorieDuBanc","MademoiselleBug","PapierCarbone","ZenEnColere","retrofan_2006","mauvais_joueur","liseur_fou","source_pls"]
export const communityMembers: Member[] = handles.map((username, i) => ({
  id: 3000 + i, username, firstName: username, lastName: '', image: '/avatar.svg',
}))
const angles = [
  {
    title: (title: string) => title,
    body: (_title: string, caseText: string) => `Ça me dégoûte de voir ça passer pour une anecdote : ${caseText}. Et il y a déjà des gens pour justifier le truc comme si c'était normal. On va en parler ou continuer à faire semblant ?`,
  },
  {
    title: (title: string) => `[DÉBAT] ${title}`,
    body: (_title: string, caseText: string) => `Attendez deux secondes. ${caseText}. Tous ceux qui hurlent dans les réponses sont persuadés d'avoir raison, mais il y a clairement un truc qu'on ne sait pas. Qui a une source, un témoignage, quelque chose ?`,
  },
  {
    title: (title: string) => `C'est donc ça, votre liberté ? — ${title}`,
    body: (_title: string, caseText: string) => `Je vois déjà arriver les « on peut plus rien dire ». Désolé mais ${caseText.toLocaleLowerCase('fr')}. Défendre une opinion, c'est une chose. Faire comme si personne n'avait le droit de te répondre que tu racontes de la merde, c'en est une autre.`,
  },
  {
    title: (title: string) => `Vous allez encore vous déchirer sur : ${title}`,
    body: (_title: string, caseText: string) => `Je prends les paris : vingt messages avant la première insulte. Pour rappel, ${caseText.toLocaleLowerCase('fr')}. Les uns vont hurler à la censure, les autres au scandale absolu. Quelqu'un peut discuter sans jouer les victimes ?`,
  },
  {
    title: (title: string) => `Qui assume vraiment son avis sur « ${title} » ?`,
    body: (_title: string, caseText: string) => `Bon, j'en ai marre des sous-entendus. ${caseText}. Si vous trouvez ça acceptable, dites pourquoi. Si vous trouvez ça ignoble, expliquez aussi. Les réponses en trois insultes et les comptes qui disparaissent dès qu'on pose une question, ça suffit.`,
  },
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
    reactions: { likes: Math.floor(Math.pow(((n * 31337 + 7919) % 1009) / 1009, 3.8) * (24 + ((n * 17) % 2300))), dislikes: Math.floor(Math.pow(((n * 6701 + 431) % 997) / 997, 3.2) * (3 + ((n * 23) % 280))) },
    views: 14 + Math.floor(Math.pow(((n * 15331 + 97) % 1013) / 1013, 2.5) * (110 + ((n * 97) % 35000))),
    userId: communityMembers[authorIndex].id,
    createdAt: new Date(epoch - (dayOffset * 1440 + minuteOffset) * 60000).toISOString(),
    source: 'community',
  }
}
// Premier écran : textes éditoriaux plus incarnés, un pour chaque communauté.
const spotlights: Record<string, { title: string; body: string }> = {
  "societe": {
    "title": "« J'ai le droit d'être homophobe » — le pire argument du fil",
    "body": "Le compte @tradition_1984 affirme qu'il devrait pouvoir rabaisser les couples gays sans que personne l'emmerde. @rainbow.exe lui répond : « T'as surtout le droit d'entendre que ton avis est à chier. » Et depuis, 400 messages de mauvaise foi. Ce qui me choque, c'est ceux qui confondent contradiction et censure."
  },
  "politique": {
    "title": "Le candidat qui attise la peur puis réclame l'unité",
    "body": "Le type publie une vidéo anxiogène sur l'immigration sans un seul chiffre vérifiable. Le lendemain il demande que le débat « reste apaisé ». Sérieusement ? Tu balances de l'essence sur le feu puis tu joues les pompiers. Les électeurs méritent mieux que ce cinéma."
  },
  "tech": {
    "title": "Une fausse vidéo intime, des milliers de partages et zéro conséquence",
    "body": "Une étudiante se retrouve dans un deepfake humiliant. La plateforme « examine le signalement » pendant que les captures explosent. Les petits génies qui repartagent ça pour rire : vous avez conscience qu'il y a une personne derrière l'écran ou pas ?"
  },
  "gaming": {
    "title": "Une joueuse parle dans le vocal, les insultes commencent",
    "body": "Elle fait un call normal, deux types se mettent à l'humilier pendant toute la partie. Et les mêmes viennent ensuite chialer sur les sanctions « injustes ». Non, c'est pas de l'humour corrosif, c'est juste être des cons en équipe."
  },
  "musique": {
    "title": "Le label prêche la liberté et étouffe sa chanteuse",
    "body": "Le contrat aurait donné au producteur le contrôle des masters pendant dix ans. Quand elle le raconte, le label publie une citation sur la liberté des artistes. J'ai rarement vu un foutage de gueule aussi proprement emballé."
  },
  "cinema": {
    "title": "Le personnage gay a disparu du montage international",
    "body": "Dans une version de la série, deux scènes sont coupées. La production dit que ça ne change rien à l'histoire. Les spectateurs concernés n'ont pas l'air d'accord. On peut parler de distribution sans faire semblant que les choix éditoriaux sont neutres ?"
  },
  "sport": {
    "title": "Insultes racistes en tribunes : « juste deux idiots », vraiment ?",
    "body": "Le club assure qu'il s'agit d'un incident isolé. Problème : plusieurs vidéos montrent des épisodes similaires sur des semaines. Les défenseurs du « folklore des supporters » vont encore débarquer. Franchement, quel folklore de merde."
  },
  "travail": {
    "title": "Un coming out et une promotion qui disparaît",
    "body": "Avant d'annoncer son homosexualité, il avait tous les retours positifs. Depuis, soudain, plus le bon profil. Les RH parlent de coïncidence et la direction vend un joli post diversité. Il va falloir expliquer cette coïncidence autrement qu'avec un emoji arc-en-ciel."
  },
  "etudes": {
    "title": "La classe partage des photos privées d'une élève et appelle ça une blague",
    "body": "Des captures circulent dans un groupe de classe, la personne visée supplie qu'on arrête et un génie répond « fallait pas faire confiance ». Vous êtes incapables d'entendre le mot consentement ou vous faites exprès ?"
  },
  "relations": {
    "title": "« Je connais tous ses mots de passe » n'est pas romantique",
    "body": "Un influenceur explique fièrement qu'un vrai couple ne devrait rien cacher, donc téléphone, localisation et comptes doivent être partagés. Une relation, ce n'est pas une prison avec authentification à deux facteurs. Sérieux, réveillez-vous."
  },
  "random": {
    "title": "Un troll veut publier l'adresse d'un type parce qu'il a perdu un débat",
    "body": "On est vraiment au point où trois messages de désaccord suffisent à lancer une chasse à l'identité ? Les commentaires encouragent ça comme un jeu. Vous êtes malades ou vous avez juste oublié qu'Internet touche des gens réels ?"
  },
  "internet": {
    "title": "Une rumeur raciste devient tendance avant le premier démenti",
    "body": "Un compte invente une histoire, lui colle une photo prise ailleurs et tout le monde accuse déjà une communauté entière. Quand la correction arrive, silence. Les comptes qui ont partagé la merde initiale sont passés au scandale suivant."
  },
  "paranormal": {
    "title": "Le médium vend un dernier message à des familles endeuillées",
    "body": "Un type exige plusieurs centaines d'euros pour parler soi-disant à un proche disparu. Des gens fragiles le croient, et dans les commentaires certains défendent son « don ». On peut aimer les histoires étranges sans accepter les charlatans qui se gavent sur le chagrin des autres."
  },
  "cuisine": {
    "title": "Le restaurant refuse de servir un couple gay au nom de ses convictions",
    "body": "Le patron annonce qu'il choisit ses clients selon ses croyances. Quand les gens répondent avec des avis et un boycott, il parle de persécution. Tu peux pas réclamer la liberté d'agir et faire une crise quand les clients exercent la leur."
  },
  "culture": {
    "title": "Une bibliothèque retire des romans LGBT des étagères",
    "body": "Des élus appellent ça protéger la jeunesse. On parle de livres, pas d'armes chimiques. Si ton projet éducatif consiste à rendre certaines vies invisibles, au moins assume ce que tu fais au lieu de te planquer derrière le mot protection."
  },
  "economie": {
    "title": "Une boîte licencie 200 salariés puis annonce des bénéfices records",
    "body": "La direction parle d'optimisation et publie fièrement ses résultats. Les employés viennent d'apprendre la fermeture de leur site. Les commentaires se disputent sur la légalité ; moi je veux savoir comment les dirigeants osent sourire sur la photo."
  },
  "science": {
    "title": "La vidéo antivaccin mensongère qui fait plus de vues que la correction",
    "body": "Un influenceur balance des affirmations médicales invérifiables, déclenche des peurs puis vend une solution miracle. Quand des chercheurs démontent sa vidéo, il crie au complot. Les gens peuvent tomber malades pendant que lui récolte les clics."
  },
  "nostalgie": {
    "title": "« C'était mieux avant » — vous avez oublié les raids et le harcèlement ?",
    "body": "Oui, les blogs, les pseudos MSN et les GIFs étaient marrants. Mais les anciens forums savaient aussi détruire un ado à coups de captures, de raids et de menaces. La nostalgie est jolie jusqu'au moment où ceux qui l'ont subie ouvrent la bouche."
  }
}

// Chaque communauté a sa propre taille : les archives n'ont pas toutes la même activité.
// On garde plus de 1 000 fils au total, mais certaines sections sont beaucoup plus petites.
const categoryLimits = [68, 65, 69, 64, 55, 63, 57, 70, 68, 59, 62, 67, 33, 46, 45, 69, 34, 46]

export const communityPosts: Post[] = communities.flatMap((community, i) =>
  topics[community.slug].flatMap((_, topic) =>
    angles.map((_, angle) => {
      const base = buildPost(community.slug, i, topic, angle)
      if (topic !== 0 || angle !== 0) return base
      const spotlight = spotlights[community.slug]
      return { ...base, ...spotlight, createdAt: new Date(epoch - i * 19 * 60000).toISOString() }
    })).slice(0, categoryLimits[i]),
).sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))

export const communityCount = communityPosts.length
