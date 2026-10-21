import { useState } from 'react'
import { Link } from 'react-router'
import { useNetwork } from '../context/NetworkContext'
import type { Reply } from '../replies'
import type { Post } from '../types'
import { communityMembers } from '../data/community'

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

function historicalReplies(post: Post): Reply[] {
  if (post.source !== 'community') return []
  const start = new Date(post.createdAt || '2026-10-20T00:00:00Z').getTime()
  const names = communityMembers
  const topic = post.title.replace(/^(\[DÉBAT\] |C'est donc ça, votre liberté \? — |Vous allez encore vous déchirer sur : |Qui assume vraiment son avis sur « )/, '')
  const answers = [
    `J'ai vu passer le même débat à propos de « ${topic} ». Tout le monde prend position, mais on connaît à peine le contexte. Sérieusement, ça fatigue.`,
    `Vous êtes marrants. On demande un avis, et la moitié du fil répond à une phrase que personne n'a écrite. Relisez le message avant de partir au quart de tour.`,
    `Je suis plutôt d'accord sur le fond, mais il faut nuancer. Si quelqu'un a un témoignage concret plutôt qu'un slogan, je prends.`,
    `Oh putain, les commentaires ont déjà tourné au concours de certitudes. Ça n'aura vraiment pas pris longtemps.`,
    `Je ne suis pas convaincu. On dirait que chacun invente la partie de l'histoire qui lui manque. On peut revenir aux faits ?`,
    `Le sujet mérite mieux que ça. Vous confondez une anecdote avec une règle générale et après vous vous étonnez de vous engueuler.`,
  ]
  const heated = post.id >= 20000 && (post.id - 20000) % 70 === 0 ? spotlightArguments[post.tags[0]] : undefined
  const first = (post.id * 7) % answers.length
  const second = (post.id * 11 + 3) % answers.length
  return [
    { id: `archive-${post.id}-a`, postId: post.id, parentId: null, author: names[(post.id * 3) % names.length].username, body: heated?.[0] ?? answers[first], createdAt: start + 22 * 60000, automated: false },
    { id: `archive-${post.id}-b`, postId: post.id, parentId: null, author: names[(post.id * 5 + 7) % names.length].username, body: heated?.[1] ?? answers[(first + 2) % answers.length], createdAt: start + 47 * 60000, automated: false },
    { id: `archive-${post.id}-c`, postId: post.id, parentId: `archive-${post.id}-a`, author: names[(post.id * 13 + 11) % names.length].username, body: heated?.[2] ?? answers[second], createdAt: start + 61 * 60000, automated: false },
  ]
}

function ReplyForm({ postId, parentId, afterSend }: {
  postId: number
  parentId: string | null
  afterSend?: () => void
}) {
  const { addReply, user } = useNetwork()
  const [error,setError] = useState('')
  const [text, setText] = useState('')
  return <form className="reply-form" onSubmit={event => {
    event.preventDefault()
    if (!text.trim()) return
    void addReply(postId, parentId, text).then(()=>{setText('');setError('');afterSend?.()}).catch(e=>setError(String(e)))
  }}>
    {!user && <p>Pour participer : <Link to="/account">connecte-toi ou crée un compte</Link>.</p>}
    <label htmlFor={'reply-' + (parentId || 'root')}>Votre réponse</label>
    <textarea id={'reply-' + (parentId || 'root')} rows={3} minLength={1} maxLength={2000} required
      placeholder="Écrire une réponse…" value={text} onChange={e => setText(e.target.value)} />
    {error&&<p role="alert">{error}</p>}<button type="submit" className="primary" disabled={!text.trim()||!user}>Répondre</button>
  </form>
}
function Comment({ comment, all, postId, depth = 0 }: {
  comment: Reply
  all: Reply[]
  postId: number
  depth?: number
}) {
  const [responding, setResponding] = useState(false)
  const { pendingReplies,user,editReply,deleteReply } = useNetwork()
  const [editing,setEditing]=useState(false)
  const [newBody,setNewBody]=useState(comment.body)
  const children = all.filter(item => item.parentId === comment.id)
  return <div className="reply-thread" style={{ marginLeft: Math.min(depth, 3) * 15 }}>
    <article className="reply-card">
      <header><strong>@{comment.author}</strong>
        {comment.automated && <span className="bot-marker">Compte automatisé</span>}
        <time dateTime={new Date(comment.createdAt).toISOString()}>{new Date(comment.createdAt).toLocaleString('fr-FR')}</time>
      </header>
      <p>{comment.body}</p>
      {user?.username===comment.author && !comment.id.startsWith('archive-') && <div><button onClick={()=>{setNewBody(comment.body);setEditing(!editing)}}>Modifier</button><button onClick={()=>{if(window.confirm('Supprimer ce commentaire ?'))void deleteReply(comment.id)}}>Supprimer</button>{editing&&<form onSubmit={e=>{e.preventDefault();void editReply(comment.id,newBody).then(()=>setEditing(false))}}><textarea value={newBody} maxLength={2000} onChange={e=>setNewBody(e.target.value)}/><button>Enregistrer</button></form>}</div>}
      <button type="button" onClick={() => setResponding(v => !v)}>{responding ? 'Annuler' : '↳ Répondre'}</button>
      {responding && <ReplyForm postId={postId} parentId={comment.id} afterSend={() => setResponding(false)} />}
      {pendingReplies.filter(item => item.parentId === comment.id).map(item =>
        <small key={item.id} className="typing">{item.author ?? 'Un membre'} prépare une réponse…</small>)}
    </article>
    {children.map(child => <Comment key={child.id} comment={child} all={all} postId={postId} depth={depth + 1} />)}
  </div>
}
export function Discussion({ postId, post }: { postId: number; post?: Post }) {
  const { replies } = useNetwork()
  const all = [ ...(post ? historicalReplies(post) : []), ...replies.filter(comment => comment.postId === postId) ]
  const roots = all.filter(comment => !comment.parentId || !all.some(parent => parent.id === comment.parentId))
  return <section className="discussion">
    <h2>Discussion <small>({all.length} réponse{all.length > 1 ? 's' : ''})</small></h2>
    <ReplyForm postId={postId} parentId={null} />
    {roots.length === 0 && <p className="notice">Personne n'a encore répondu. Lance la discussion.</p>}
    {roots.map(comment => <Comment key={comment.id} comment={comment} all={all} postId={postId} />)}
  </section>
}
