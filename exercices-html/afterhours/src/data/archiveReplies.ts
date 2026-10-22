import type { Post } from '../types'
import type { Reply } from '../types/reply'
import { communityMembers } from './community'

/**
 * ARCHIVES FICTIVES — discussion dynamique, mais reproductible.
 *
 * Le même post garde les mêmes réponses (pseudos, dates et fils) à chaque
 * rechargement. Pas de Math.random() : tout dépend uniquement de l'ID du post.
 *
 * Ce sont des personnages inventés pour la démo, jamais de vrais utilisateurs.
 * Les commentaires ajoutés par le joueur sont stockés séparément côté serveur.
 */

// Trois premières réponses écrites à la main pour les 18 sujets éditoriaux.
const spotlightArguments: Record<string, [string, string, string]> = {
  societe: [
    "J'ai le droit d'avoir des convictions et de ne pas approuver l'homosexualité. Maintenant, si le moindre désaccord vous choque, c'est votre problème.",
    "Non mais t'as vu la différence entre avoir une conviction et rabaisser des gens qui t'ont rien demandé ? Tu veux ouvrir ta gueule, assume qu'on te réponde que tu dis de la merde.",
    "Le gars réclame la liberté de parler et veut empêcher les autres de lui répondre. C'est quand même le niveau zéro de la logique."
  ],
  politique: [
    "Le candidat en question sait exactement ce qu'il fait. Une vidéo anxiogène, zéro donnée, puis un discours sur l'apaisement. C'est du calcul.",
    "Tu parles de manipulation mais t'as même pas lu son programme. On peut discuter du fond au lieu de crier au fascisme à chaque campagne ?",
    "L'un de vous parle de communication, l'autre d'idéologie. Mais personne ne poste la source des chiffres. Sérieusement les gars ?"
  ],
  tech: [
    "C'est une humiliation numérique, pas une prouesse technique. Les mecs qui repartagent un deepfake intime sont des lâches.",
    "La plateforme peut pas tout filtrer en dix secondes non plus. Le vrai problème, c'est surtout ceux qui fabriquent et diffusent ces trucs.",
    "D'accord, mais la suppression doit être rapide. Derrière vos débats de responsabilité il y a quelqu'un dont la vie peut exploser."
  ],
  gaming: [
    "Tu peux jouer des heures, mais dès qu'une fille parle dans le vocal ça devient la cour de récréation des types les plus cons du serveur.",
    "Des abrutis sur un vocal, il y en a partout. J'aimerais bien voir la sanction plutôt qu'un clip sorti de son contexte.",
    "Toujours le fameux « c'est juste un jeu ». Étrangement, c'est jamais juste un jeu quand c'est eux qui se font insulter."
  ],
  musique: [
    "Le label veut ses droits, ses pourcentages et le dernier mot. Après ça vend un discours sur la liberté artistique, quel foutage de gueule.",
    "Un contrat se négocie avant de signer. Cela dit, si une chanteuse débute à dix-huit ans contre une équipe d'avocats, la négociation est pas exactement équitable.",
    "Vous mélangez validité juridique et rapport de force. On peut respecter un contrat et reconnaître qu'il est complètement abusif."
  ],
  cinema: [
    "Couper les scènes d'un couple gay pour faire plaisir à certains marchés, c'est pas un choix neutre. C'est de la lâcheté.",
    "Vous ne savez même pas pourquoi la scène a été retirée. Vous avez déjà choisi les coupables avant de lire les explications.",
    "Si les autres scènes romantiques sont restées, faudra une explication sacrément solide pour celle-là."
  ],
  sport: [
    "Ils appellent ça du folklore et exigent que les joueurs encaissent. Non, insulter quelqu'un pour sa couleur de peau c'est pas une tradition.",
    "Il faut sanctionner les responsables, pas un stade entier. Et le club devrait arrêter de communiquer comme si rien ne s'était passé.",
    "On est arrivés au stade où demander de regarder les vidéos passe pour une prise de position politique. Incroyable."
  ],
  travail: [
    "Promotion annoncée depuis trois mois, puis silence juste après le coming out ? Il faudrait un sacré concours de circonstances.",
    "Attention aux conclusions sur une seule histoire. Les RH doivent publier les critères, pas juste un message corporate de merde.",
    "L'emoji diversité sur LinkedIn ne remplace pas une procédure équitable. Qu'ils expliquent leurs décisions."
  ],
  etudes: [
    "Partager des images privées pour humilier une élève, ça s'appelle pas de l'humour. Ceux qui défendent ça sont vraiment à côté de la plaque.",
    "Et le « elle avait qu'à pas envoyer » dans les commentaires, vous l'avez trouvé où ce raisonnement pourri ? La responsabilité c'est celle des gens qui diffusent.",
    "Il faut surtout faire retirer les images et aider la personne visée. Le concours d'indignation ne suffit pas."
  ],
  relations: [
    "Demander tous les mots de passe pour prouver l'amour ? Ça ressemble plus à un contrôle technique qu'à une relation.",
    "Il y a des couples qui partagent volontairement leurs accès, faut pas transformer chaque situation en accusation.",
    "Volontairement, oui. Sous pression avec menace de rupture, c'est plus un choix. C'est exactement le point du fil."
  ],
  random: [
    "C'est ahurissant de voir des gens chercher l'adresse d'un inconnu parce qu'il a gagné une dispute sur Internet.",
    "Vous êtes tellement obsédés par vos petites guerres de forum que vous oubliez les conséquences dans la vraie vie.",
    "Le premier qui dit « c'est juste du troll » devrait aller expliquer ça à la personne menacée. Bande de génies."
  ],
  internet: [
    "Une fausse info qui accuse tout un groupe, dix mille partages. La correction ? Quarante likes. Voilà où on en est.",
    "La plateforme a une responsabilité, mais ceux qui repartagent sans lire aussi. On ne peut pas tout mettre sur l'algorithme.",
    "Bizarrement les comptes qui criaient le plus fort sont introuvables quand il faut corriger leurs accusations."
  ],
  paranormal: [
    "Faire payer une famille endeuillée pour des messages venus de l'au-delà, c'est carrément dégueulasse.",
    "Certaines personnes trouvent du réconfort dans ces pratiques, mais prétendre avoir une certitude et soutirer de l'argent, c'est autre chose.",
    "Le problème n'est pas de croire aux fantômes. C'est de vendre une réponse inventée à quelqu'un qui souffre."
  ],
  cuisine: [
    "On est en 2026 et un restaurateur choisit encore les clients selon qui ils aiment ? C'est honteux.",
    "Le patron parle de convictions et s'étonne que les clients aient, eux aussi, des convictions. Qu'il assume le boycott.",
    "Être contre les insultes ne veut pas dire excuser la discrimination. Il aurait pu juste servir les gens."
  ],
  culture: [
    "Un roman LGBT devient dangereux pour la jeunesse mais les livres qui racontent des guerres restent tranquillement en rayon. Drôle de logique.",
    "On peut discuter de l'âge auquel présenter certains textes, mais retirer des livres uniquement pour leurs personnages, c'est autre chose.",
    "La bibliothèque devrait expliquer sa décision publiquement. Pour l'instant, ça ressemble surtout à une opération politique."
  ],
  economie: [
    "Les dirigeants posent pour les bénéfices pendant que deux cents personnes perdent leur poste. C'est d'une indécence hallucinante.",
    "Une entreprise peut dégager des bénéfices et devoir restructurer. Ça n'empêche pas de regarder ce qui est versé aux dirigeants.",
    "Vous cherchez une explication juridique à chaque scandale humain. Légal ne veut pas automatiquement dire respectable."
  ],
  science: [
    "Ce mec balance des mensonges médicaux, fait peur aux gens puis vend sa petite solution. C'est du business sur l'angoisse.",
    "La critique d'une étude est normale. Inventer des résultats et refuser les corrections, c'est pas de la science.",
    "Les chercheurs publient leurs données, l'influenceur publie un lien d'affiliation. À un moment, faut voir la différence."
  ],
  nostalgie: [
    "Oui les GIFs et les blogs c'était cool, mais les raids de harcèlement existaient déjà. Arrêtez de présenter 2008 comme un paradis.",
    "Vous allez pas me faire croire que tout était horrible. Il y avait aussi de vraies communautés, pas seulement des abrutis.",
    "Personne n'a dit le contraire. On peut regretter MSN et reconnaître que certains forums étaient des décharges toxiques."
  ],
}


/** Mini banque d'avis par communauté : de vrais tons différents. */
const byCategory: Record<string, string[]> = {
  societe: [
    "Je suis concerné par le sujet et j'en ai un peu marre qu'on en parle comme d'une expérience de pensée.",
    "Les réactions sous la publication initiale font quand même peur.",
    "Vous confondez constamment désaccord et droit de rabaisser les autres.",
    "Ce genre de truc finit toujours par retomber sur les mêmes personnes.",
    "Ce qui me choque, c'est l'absence totale de réaction des responsables.",
    "On peut demander du respect sans vouloir censurer tout le monde.",
    "J'aimerais entendre la version des personnes concernées, pas uniquement des spectateurs.",
    "Le débat est mal posé dès le départ, voilà pourquoi ça part en vrille.",
    "Dans mon entourage on a vécu une situation similaire. Ça ne se règle pas avec une punchline.",
    "C'est une question de conséquences concrètes, pas de gagner un débat sur Internet.",
    "Pourquoi personne ne parle de ce qui s'est passé après ?",
    "Le fameux « je donne juste mon avis » a bon dos.",
  ],
  politique: [
    "On pourrait commencer par lire le texte exact avant de s'écharper.",
    "J'ai cherché la source de cette annonce, elle n'est pas aussi claire que le titre.",
    "Le problème, c'est l'écart entre le discours officiel et l'application réelle.",
    "Ce qui m'inquiète c'est surtout le précédent que ça crée.",
    "Je suis pas du même bord politique, mais sur ce point la critique tient.",
    "Les conséquences ne seront pas les mêmes pour tout le monde.",
    "Faut arrêter d'applaudir une mesure juste parce qu'elle vient de son camp.",
    "Je veux bien les chiffres, pas le résumé d'un tweet.",
    "Il faudrait regarder la version intégrale de la proposition.",
    "Les promesses et le budget disponible, c'est souvent deux histoires différentes.",
    "Étonnant comme tout le monde a déjà son verdict.",
    "Les opposants aussi devraient présenter une alternative crédible.",
  ],
  tech: [
    "Techniquement faisable ne veut pas dire socialement acceptable.",
    "La question des données personnelles passe encore à la trappe.",
    "Je développe des applis et la promesse marketing me paraît très optimiste.",
    "Le problème est autant dans l'usage que dans l'outil.",
    "Il faudrait une preuve reproductible au lieu de captures sorties du contexte.",
    "La sécurité ajoutée après coup, on connaît la chanson.",
    "Vous avez regardé les permissions demandées par l'application ?",
    "Le plus dingue c'est que personne ne semble avoir prévu de procédure de retrait.",
    "À mon avis, ils vont corriger uniquement après le scandale.",
    "Le modèle économique explique peut-être plus de choses que leur communiqué.",
    "Il y a une différence entre une démonstration et une version utilisable.",
    "Quelqu'un a le dépôt, le changelog ou une analyse indépendante ?",
  ],
  gaming: [
    "C'est toujours le même cirque dans les vocaux classés.",
    "Le patch a peut-être corrigé un truc mais en a cassé deux autres.",
    "Vous avez essayé sans regarder les vidéos des streamers ?",
    "J'ai passé trop d'heures sur ce jeu pour prétendre qu'il est équilibré.",
    "La commu peut être adorable une minute et insupportable la suivante.",
    "Le fameux « skill issue » arrive dans trois, deux, un...",
    "Ce n'est pas parce que ça arrive souvent que c'est acceptable.",
    "Montrez le replay complet, je veux voir le contexte.",
    "Perso j'ai arrêté le matchmaking pour cette raison.",
    "Les modos font quoi exactement pendant ce temps ?",
    "Le jeu serait mieux si les gens savaient perdre.",
    "Un système de signalement qui marche serait déjà un progrès.",
  ],
  musique: [
    "Le communiqué du label est presque plus gênant que l'affaire.",
    "Je veux entendre la version de l'artiste, pas seulement celle de son équipe.",
    "On parle beaucoup de l'image, très peu des droits sur les morceaux.",
    "Le marketing de l'authenticité, ça a ses limites.",
    "Le contrat peut être légal et quand même franchement déséquilibré.",
    "Ça me rappelle des histoires dans les années 2000.",
    "Je me demande ce que les autres artistes du label en pensent.",
    "Le silence des proches collaborateurs est assez parlant.",
    "On peut aimer sa musique et critiquer ses choix.",
    "Un extrait de dix secondes ne suffit pas à juger une carrière.",
    "Les fans se déchirent et l'équipe de communication compte les vues.",
    "Le débat serait différent si on connaissait les clauses exactes.",
  ],
  cinema: [
    "J'attends de voir la version complète avant de trancher.",
    "La décision du montage raconte aussi quelque chose sur la production.",
    "Vous parlez des intentions du réalisateur sans l'avoir interrogé.",
    "Le film peut être bon et certains choix franchement discutables.",
    "C'est dingue comme un détail peut changer le sens d'une scène.",
    "J'avais pas remarqué ça au premier visionnage.",
    "Les distributeurs prennent parfois des décisions très politiques.",
    "Je suis allé revoir la séquence, l'écart est visible.",
    "On peut défendre une œuvre sans défendre toute sa promo.",
    "Le public étranger n'a peut-être même pas eu accès au même montage.",
    "Le problème n'est pas la coupe, mais la raison de la coupe.",
    "Ce débat me donne surtout envie de revoir le film en VO.",
  ],
  sport: [
    "Les images sont assez parlantes, même sans commentaire autour.",
    "On nous ressort encore l'excuse de la passion des supporters.",
    "Une sanction collective n'est pas automatiquement une bonne idée.",
    "Le club doit assumer ce qui se passe dans ses tribunes.",
    "Les joueurs n'ont pas à tout encaisser au nom de l'ambiance.",
    "J'étais au stade, l'atmosphère était tendue bien avant l'incident.",
    "La ligue devrait publier les raisons exactes de sa décision.",
    "Un sport reste un sport, certaines limites devraient être évidentes.",
    "Ça n'empêche pas de soutenir l'équipe, justement.",
    "Le résultat du match passe presque au second plan.",
    "Tout le monde veut des sanctions, mais lesquelles concrètement ?",
    "La vidéo complète aiderait à départager certaines versions.",
  ],
  travail: [
    "Ceux qui disent « va voir les RH » n'ont jamais essayé, je crois.",
    "Il faudrait connaître les critères de décision, noir sur blanc.",
    "Une entreprise ne peut pas se cacher éternellement derrière la communication.",
    "J'ai déjà vu ce décalage entre discours interne et pratiques réelles.",
    "Une procédure transparente réglerait une partie du problème.",
    "Ça donne pas franchement envie de postuler chez eux.",
    "Le manager direct a aussi une responsabilité dans l'histoire.",
    "Le contexte économique peut expliquer une décision, pas tout justifier.",
    "Un syndicat pourrait demander des explications formelles.",
    "On a une date précise pour le changement de décision ?",
    "Certains commentaires n'ont visiblement jamais travaillé en équipe.",
    "Les belles valeurs sur le site carrière, c'est pas une preuve.",
  ],
  etudes: [
    "Quand ça tourne dans un groupe de classe, c'est impossible de l'ignorer.",
    "Les adultes interviennent souvent trop tard dans ces histoires.",
    "Je comprends pas comment des élèves peuvent trouver ça drôle.",
    "Ce n'est pas aux victimes de gérer seules le problème.",
    "Un règlement ne sert à rien s'il n'est jamais appliqué.",
    "J'ai connu un cas similaire au lycée, ça laisse des traces.",
    "Il faudrait une vraie procédure de signalement.",
    "Les parents sont au courant au moins ?",
    "On parle de jeunes, mais les conséquences sont bien réelles.",
    "Le pire c'est les spectateurs qui partagent pour « voir ».",
    "Un établissement doit pouvoir agir sans attendre que ça dégénère.",
    "La prévention c'est bien, protéger immédiatement c'est mieux.",
  ],
  relations: [
    "La confiance, ça ne se vérifie pas en donnant son mot de passe.",
    "Il y a vraiment des gens qui trouvent ça romantique ?",
    "Les limites ne sont pas les mêmes dans tous les couples, mais elles doivent être librement choisies.",
    "Ça sent surtout le problème de communication entre les deux.",
    "J'ai déjà vécu un truc de ce genre, plus jamais.",
    "Il manque clairement la version de l'autre personne.",
    "Je trouve que les commentaires vont trop vite pour décider à leur place.",
    "On peut aimer quelqu'un et vouloir garder un jardin secret.",
    "La pression n'est pas du consentement.",
    "Tout le monde projette ses propres histoires dans ce fil.",
    "Le conseil « quitte-le » en trois mots, c'est devenu automatique ici.",
    "Il faudrait peut-être parler des limites avant des accusations.",
  ],
  random: [
    "Internet est vraiment un endroit bizarre.",
    "J'ai ouvert ce fil par curiosité, je repars avec vingt questions.",
    "On est loin du sujet de départ là.",
    "Je pensais que c'était une blague, mauvaise pioche.",
    "Qui a eu l'idée de lancer cette discussion à cette heure ?",
    "J'ai presque peur de lire la suite.",
    "Le deuxième commentaire est déjà une œuvre d'art.",
    "Vous arrivez à vous prendre au sérieux avec ce débat ?",
    "J'étais venu pour rigoler, l'ambiance a changé vite.",
    "On va retrouver des captures de ce thread pendant dix ans.",
    "C'est officiellement mon fil préféré pour de mauvaises raisons.",
    "Je suis tombé ici par accident et je reste.",
  ],
  internet: [
    "Une capture sans date ni source, ça devrait pas suffire.",
    "C'est toujours la même mécanique : une rumeur, puis une correction invisible.",
    "Le contexte manque énormément dans les partages.",
    "Les algos récompensent visiblement le message le plus énervé.",
    "J'aimerais bien que les gens relaient aussi le démenti.",
    "Supprimer le post après mille partages, c'est un peu tard.",
    "Les vieux forums avaient d'autres défauts, mais au moins on gardait parfois le fil entier.",
    "Le problème c'est aussi nous qui partageons sans lire.",
    "Quelqu'un a une archive fiable de la publication originale ?",
    "Ça ressemble à un montage, regardez l'image.",
    "Le droit à l'oubli devrait exister même après un bad buzz.",
    "Il y a une vraie différence entre vérifier et enquêter sur la vie privée des gens.",
  ],
  paranormal: [
    "Je suis sceptique mais j'adore lire ce genre de témoignage.",
    "Il y a peut-être une explication beaucoup plus banale.",
    "L'heure et les conditions de la photo peuvent tout changer.",
    "J'aimerais voir un autre angle avant de crier au phénomène.",
    "On peut croire à l'inexpliqué sans vendre de fausses certitudes.",
    "Ça me rappelle une histoire arrivée à ma grand-mère.",
    "Les reflets et les bruits de maison sont souvent sous-estimés.",
    "Dès qu'il y a de l'argent à gagner, je me méfie.",
    "Le récit est intriguant, mais une anecdote ne prouve rien.",
    "Quelqu'un a déjà testé une explication rationnelle ?",
    "J'aime l'ambiance, moins les gens qui en profitent.",
    "Je serais curieux de voir les données brutes.",
  ],
  cuisine: [
    "Je suis venu pour une recette et je tombe sur une guerre idéologique.",
    "C'est fou comme un restaurateur peut se mettre tout seul dans la sauce.",
    "Le service et l'accueil font partie du restaurant, pas seulement l'assiette.",
    "Un boycott, c'est aussi un choix de consommateur.",
    "J'aimerais entendre les employés, pas uniquement le patron.",
    "Le communiqué est plus salé que leur carte.",
    "Ça me donne envie de cuisiner chez moi ce soir.",
    "On peut discuter de cuisine sans traiter les clients comme ça.",
    "Il y a d'autres restaurants dans le quartier, heureusement.",
    "La réputation d'un établissement tient parfois à une seule décision.",
    "Quelqu'un connaît la suite de cette affaire ?",
    "Les avis en ligne vont être impossibles à lire maintenant.",
  ],
  culture: [
    "Un livre ne devient pas dangereux juste parce qu'il dérange.",
    "Je comprends qu'on parle de l'âge des lecteurs, mais pas de supprimer les œuvres.",
    "On pourrait demander leur avis aux bibliothécaires.",
    "La censure a rarement rendu un texte moins populaire.",
    "Vous avez lu le livre dont vous parlez ?",
    "C'est triste qu'on résume la culture à une polémique.",
    "Je voudrais bien connaître la liste exacte des ouvrages retirés.",
    "Les classiques aussi contiennent des sujets difficiles.",
    "Il y a une différence entre conseiller et interdire.",
    "Le public a le droit de débattre des choix de programmation.",
    "J'irai l'emprunter juste pour me faire une idée.",
    "Il manque un point de vue : celui des lecteurs.",
  ],
  economie: [
    "Les résultats financiers ne racontent pas toute l'histoire.",
    "Il faudrait regarder les investissements et pas juste le bénéfice.",
    "Légalement possible et socialement acceptable, c'est différent.",
    "Les chiffres sans contexte, ça fait toujours de beaux slogans.",
    "Ce qui me choque c'est surtout le calendrier des annonces.",
    "Les salariés ont reçu les mêmes informations que les actionnaires ?",
    "J'aimerais voir les comptes plutôt que la déclaration du PDG.",
    "Une restructuration peut être nécessaire, mais il faut l'expliquer.",
    "À qui profite réellement cette décision ?",
    "On oublie les familles derrière les colonnes Excel.",
    "Ce n'est pas le même risque pour les dirigeants et pour les employés.",
    "Il y a sûrement un arbitrage plus compliqué qu'un titre de presse.",
  ],
  science: [
    "Une vidéo virale n'est pas une étude scientifique.",
    "Je voudrais vraiment lire le protocole avant de conclure.",
    "La taille de l'échantillon change complètement l'interprétation.",
    "On peut critiquer une étude sans inventer ses résultats.",
    "Le problème c'est que le correctif n'atteindra pas les mêmes personnes.",
    "Il faut distinguer une hypothèse d'un résultat démontré.",
    "Il y a une publication évaluée par les pairs quelque part ?",
    "Le mot « preuve » est utilisé un peu vite dans cette histoire.",
    "Je bosse dans le domaine et je serais prudent avec cette conclusion.",
    "Ce n'est pas parce qu'une question est ouverte que toutes les réponses se valent.",
    "Une incertitude bien présentée vaut mieux qu'une certitude fabriquée.",
    "Quelqu'un a les données originales plutôt que l'infographie ?",
  ],
  nostalgie: [
    "MSN qui clignote, les statuts à rallonge, quel enfer magnifique.",
    "On oublie vite les forums qui mettaient cinq minutes à charger.",
    "Les signatures avec quatre GIFs étaient quand même incroyables.",
    "Je regrette les petites communautés, pas les drames qui allaient avec.",
    "Les blogs perso avaient un charme qu'on a un peu perdu.",
    "Je viens de retrouver une capture de mon ancien pseudo. Quelle honte.",
    "C'était moins lisse, mais pas forcément plus gentil.",
    "Les salons de discussion avaient leur propre chaos.",
    "C'est fou comme une simple interface peut rappeler une époque entière.",
    "On passait des heures à personnaliser des profils illisibles.",
    "La nostalgie choisit les bons souvenirs, elle triche un peu.",
    "J'ai encore les vieux sons de connexion en tête.",
  ],
}

/** Réactions plus courtes, parfois sèches, parfois ironiques. */
const shortLines = [
  "Ah ouais quand même.", "Mouais.", "C'est chaud.", "Bof, pas convaincu.",
  "C'est exactement ça.", "J'aurais pas dit mieux.", "T'es sérieux là ?",
  "Pas sûr du tout.", "Merci, enfin quelqu'un le dit.", "Ça part loin ici.",
  "Source ?", "Hein ?", "Mauvais bail.", "C'était prévisible.",
  "Tu vas vite en conclusion.", "Je vois pas le rapport.", "Pas faux.",
  "Lisez jusqu'au bout.", "C'est gênant.", "Faut arrêter deux minutes.",
  "Attends quoi ?", "Ça mérite un vrai débat.", "On a la suite ?",
  "Dur à défendre, ça.", "Pas le même avis.", "Je préfère attendre.",
  "Je comprends les deux côtés.", "Très mauvais argument.",
  "Là vous exagérez.", "Ça me dépasse.", "Ça se discute.",
  "J'ai ri, désolé.", "Un peu facile.", "Le contexte compte.",
]

/** Avis transversaux ; ils s'emploient sur différents sujets sans forcer le thème. */
const generalLines = [
  "J'ai lu l'article cité, le titre est beaucoup plus catégorique que le contenu.",
  "Ça discute depuis des heures et personne ne s'est mis d'accord sur les faits.",
  "Vous avez remarqué que les commentaires répondent à des questions différentes ?",
  "Je suis d'accord avec le constat, pas forcément avec la solution proposée.",
  "Ça manque d'une réponse de la personne directement concernée.",
  "Le problème avec ces histoires, c'est ce qu'on ne sait pas encore.",
  "J'ai plutôt changé d'avis en lisant les réponses, et c'est rare.",
  "On devrait distinguer ce qui est confirmé de ce qui est supposé.",
  "Il y a des réactions très fortes pour une information pas vraiment vérifiée.",
  "Ce fil est un bon exemple de gens qui se parlent sans s'écouter.",
  "Je suis venu lire des arguments, j'ai trouvé un concours de sarcasmes.",
  "Les premiers messages étaient intéressants. Ensuite ça a dérapé.",
  "Je pensais être seul à me poser cette question.",
  "Je pense qu'on peut être en désaccord sans se prêter des intentions.",
  "Tout dépend du contexte, et ça n'excuse pas tout pour autant.",
  "J'aimerais bien avoir un témoignage concret.",
  "D'accord, mais qu'est-ce qu'on fait de cette information maintenant ?",
  "Il faudrait regarder comment des situations similaires ont été traitées.",
  "Le sujet mérite plus qu'un avis envoyé entre deux stations de métro.",
  "Les réponses binaires sur un problème compliqué, c'est fatigant.",
  "Difficile de conclure avec juste une capture d'écran.",
  "Je trouve la réaction disproportionnée mais je peux comprendre la colère.",
  "J'ai un avis assez différent et je suis curieux de lire vos objections.",
  "Tout le monde commente le titre, presque personne ne cite le texte.",
  "Ce serait bien de séparer l'émotion des éléments vérifiables.",
  "Je suis partagé. C'est peut-être ça le plus frustrant.",
  "Ce qui me dérange, c'est le double discours dans cette affaire.",
  "Vous partez du principe qu'il n'y a que deux options.",
  "Je pense qu'on sera fixés quand la suite sera connue.",
  "Les gens concernés vont vivre avec cette histoire bien plus longtemps que ce fil.",
  "Une nuance, ça n'a jamais tué personne.",
  "Je trouve la question légitime, même si sa formulation me gêne.",
  "Je viens de tomber sur ce forum, l'ambiance est spéciale ici.",
  "Qui peut résumer ce qui est vraiment confirmé ?",
  "Les scénarios inventés dans les réponses n'aident pas.",
  "C'est une vraie question, dommage qu'elle soit noyée dans les attaques.",
  "Mon avis n'est pas très populaire, tant pis.",
  "Le silence des personnes impliquées peut aussi avoir des raisons simples.",
  "Je vais attendre avant d'accuser quelqu'un sur la foi d'un extrait.",
  "Il y a de quoi débattre sans transformer ça en tribunal.",
  "J'espère qu'il y aura une mise à jour du fil.",
  "Ce n'est pas parce qu'on trouve la situation absurde qu'elle est inventée.",
  "Je cherche encore où commence le fait et où finit le commentaire.",
  "Si quelqu'un a une source sérieuse, qu'il la poste.",
  "La réponse la plus nuancée est tout en bas, évidemment.",
  "Le rapport entre la première publication et les dernières réponses est fascinant.",
  "Les gens qui vivent la situation ne doivent pas disparaître derrière la polémique.",
  "On ne peut pas résumer une histoire entière avec un slogan.",
  "J'ai vu passer une autre version, mais je préfère la vérifier.",
  "L'argument principal mérite d'être reformulé, là personne ne comprend pareil.",
]

/** Pour répondre À quelqu'un, pas lancer à chaque fois une discussion indépendante. */
const replyLines = [
  "Je comprends ton idée, mais tu vas un peu vite sur la conclusion.",
  "C'est là qu'on n'est pas d'accord, en fait.",
  "Tu peux préciser ce que tu veux dire ?",
  "Ouais, vu comme ça je comprends mieux.",
  "Je pensais plutôt au cas général, pas à cette personne en particulier.",
  "Je ne dis pas que c'est faux. Je dis qu'il manque des éléments.",
  "On parle bien du même passage ?",
  "Merci pour la précision, j'avais raté ça.",
  "Ça ne répond pas vraiment à la question de départ.",
  "Attends, tu mélanges deux situations différentes.",
  "Je suis à moitié d'accord avec toi.",
  "Tu peux être sceptique sans nier ce qu'on sait déjà.",
  "J'avais compris l'inverse en lisant le message initial.",
  "Tout à fait, mais ça ne règle pas le fond du problème.",
  "On peut le voir comme ça aussi, effectivement.",
  "J'aimerais une source avant d'aller plus loin.",
  "T'as raison sur un point, pas sur le reste.",
  "C'est plus complexe que cette seule phrase.",
  "Ok, ça change un peu la donne.",
  "Pas besoin de me prêter un avis que j'ai pas exprimé.",
  "Là-dessus, je te rejoins.",
  "Je crois qu'on rate tous les deux le point central.",
  "J'ai relu et effectivement, c'était ambigu.",
  "C'est pas parce que tu cries plus fort que tu as raison.",
  "Tu mets le doigt sur quelque chose d'important.",
  "Oui, mais qui assume les conséquences derrière ?",
  "Dans ce cas, explique pourquoi tu arrives à cette conclusion.",
  "Je vois ce que tu veux dire, mais je reste pas convaincu.",
  "La comparaison me paraît un peu bancale.",
  "On peut se mettre d'accord sur les faits, au moins ?",
  "Je ne m'attendais pas à être d'accord avec toi.",
  "J'ai peut-être mal formulé mon premier message.",
  "Il faut distinguer les intentions des résultats.",
  "Tu soulèves un vrai point, et personne n'y répond.",
  "C'est précisément la nuance qui manque dans le fil.",
  "Pas de souci pour discuter, mais reste sur ce qui est écrit.",
  "Je pensais que c'était évident, visiblement pas.",
  "Il y a une vraie différence entre ces deux choses.",
  "C'est un raccourci assez énorme quand même.",
  "Je vais regarder avant de te répondre sur ce point.",
]

/** Petites secondes phrases optionnelles : les messages n'ont pas tous la même longueur. */
const additions = [
  "Je demande vraiment, c'est pas une attaque.",
  "Si quelqu'un connaît le dossier, qu'il nous éclaire.",
  "On verra bien comment ça évolue.",
  "Je m'arrête là, j'ai assez passé de temps sur ce fil.",
  "Je suis ouvert à d'autres arguments.",
  "Je ne pense pas qu'on aura la réponse ce soir.",
  "C'est le genre de détail qui change tout.",
  "Je me trompe peut-être, hein.",
  "En tout cas ça fait réfléchir.",
  "Faut voir ce qui a été coupé dans le résumé.",
  "Je dis ça, mais j'ai pas toutes les infos.",
  "J'espère au moins qu'on aura une suite.",
  "Je vais relire calmement avant de m'emballer.",
  "Après, je suis pas expert du sujet.",
  "Ce serait déjà un début.",
  "Fin bref.",
]

/** Petit générateur pseudo-aléatoire PRÉVISIBLE : même graine → même résultat. */
function seeded(seed: number) {
  // Mélange des bits : des IDs voisins n'obtiennent pas une suite de chiffres
  // croissante de façon visible (défaut classique des générateurs très simples).
  let state = seed >>> 0
  state ^= state >>> 16
  state = Math.imul(state, 0x7feb352d)
  state ^= state >>> 15
  state = Math.imul(state, 0x846ca68b)
  state ^= state >>> 16
  state >>>= 0
  return () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0
    return state / 4294967296
  }
}

function one<T>(list: readonly T[], random: () => number): T {
  return list[Math.floor(random() * list.length)]
}

/** Répartition irrégulière : un fil désert n'a pas 60 messages, un gros débat oui. */
export function archiveReplyCount(post: Post): number {
  if (post.source !== 'community') return 0
  const roll = seeded(post.id * 41 + 771)() * 100
  let count: number
  const random = seeded(post.id * 317 + 19)
  if (roll < 8) count = Math.floor(random() * 3) // 0 à 2
  else if (roll < 28) count = 3 + Math.floor(random() * 9) // 3 à 11
  else if (roll < 67) count = 12 + Math.floor(random() * 24) // 12 à 35
  else if (roll < 91) count = 36 + Math.floor(random() * 42) // 36 à 77
  else count = 78 + Math.floor(random() * 76) // 78 à 153

  // Quelques réactions supplémentaires quand le sujet a beaucoup circulé.
  const activity = post.reactions.likes + post.reactions.dislikes
  count += Math.min(9, Math.floor(Math.sqrt(activity) / 3))
  // Les sujets d'ouverture de catégorie sont un peu plus suivis.
  if ((post.id - 20000) % 70 === 0) count = Math.max(35, count)
  return count
}

/** Les trois premiers IDs « a/b/c » restent compatibles avec les anciennes archives. */
function archiveId(postId: number, index: number): string {
  return `archive-${postId}-${index < 3 ? 'abc'[index] : index}`
}

/** Fabrique le texte selon le ton, sans appeler d'IA ou d'API. */
function writeReply(category: string, _index: number, post: Post, random: () => number, nested: boolean): string {
  const byTopic = byCategory[category] || generalLines
  const roll = random()
  let base: string

  if (nested) {
    base = roll < .75 ? one(replyLines, random)
      : roll < .89 ? one(shortLines, random) : one(byTopic, random)
  } else {
    base = roll < .49 ? one(byTopic, random)
      : roll < .78 ? one(generalLines, random)
        : roll < .92 ? one(shortLines, random)
          : `Sur « ${post.title.slice(0, 75)} », je crois qu'il manque un morceau du contexte.`
  }

  // Certains posts sont une phrase, d'autres un vrai petit paragraphe.
  const lengthRoll = random()
  if (lengthRoll < .31) return base
  if (lengthRoll < .81) return `${base} ${one(additions, random)}`
  return `${base} ${one(additions, random)} ${one(additions, random)}`
}

/**
 * À utiliser uniquement lorsqu'on ouvre une archive.
 * Les IDs sont stables et les réponses forment des branches de 0 à 3 niveaux.
 */
export function archiveReplies(post: Post): Reply[] {
  const count = archiveReplyCount(post)
  if (!count) return []

  const random = seeded(post.id * 1103515245 + 12345)
  const category = post.tags[0] || 'random'
  const start = new Date(post.createdAt || '2026-10-20T00:00:00Z').getTime()
  const firstThree = (post.id - 20000) % 70 === 0 ? spotlightArguments[category] : undefined
  const result: Reply[] = []
  const depths: number[] = []
  const used = new Set<string>()
  const authorStart = Math.floor(random() * communityMembers.length)

  for (let i = 0; i < count; i++) {
    // Beaucoup de messages racines ; environ un tiers des messages se répondent.
    let parentIndex = -1
    if (i === 2) parentIndex = 0
    else if (i > 2 && random() < .42) {
      const candidate = Math.max(0, i - 1 - Math.floor(random() * 17))
      if ((depths[candidate] || 0) < 3) parentIndex = candidate
    }
    const nested = parentIndex !== -1
    const depth = nested ? depths[parentIndex] + 1 : 0
    depths.push(depth)

    // Les auteurs reviennent parfois répondre dans la même discussion.
    const authorIndex = i > 4 && random() < .26
      ? Math.floor(random() * Math.min(i, 7))
      : (authorStart + Math.floor(random() * communityMembers.length)) % communityMembers.length
    const previousAuthor = result[authorIndex]?.author
    const author = previousAuthor || communityMembers[authorIndex % communityMembers.length].username

    let body = firstThree && i < 3 ? firstThree[i] : writeReply(category, i, post, random, nested)
    // Évite les répétitions littérales dans un même fil sans boucle illimitée.
    for (let retry = 0; retry < 8 && used.has(body); retry++) {
      body = writeReply(category, i + retry, post, random, nested)
    }
    if (used.has(body)) body += ` ${one(additions, random)}`
    used.add(body)

    result.push({
      id: archiveId(post.id, i),
      postId: post.id,
      parentId: nested ? archiveId(post.id, parentIndex) : null,
      author,
      body,
      createdAt: start + 4 * 60000 + Math.floor((i / Math.max(1, count)) * 26 * 60 * 60000)
        + Math.floor(random() * 180000),
      automated: false,
    })
  }
  return result
}
