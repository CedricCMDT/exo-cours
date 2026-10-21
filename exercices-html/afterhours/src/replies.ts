export type Reply = {
  id: string
  postId: number
  parentId: string | null
  author: string
  body: string
  createdAt: number
  automated: boolean
}
export type PendingReply = {
  id: string
  postId: number
  parentId: string
  originalBody: string
  dueAt: number
  author?: string
}
const KEY = 'afterhours-replies-v1'
const PENDING_KEY = 'afterhours-reply-queue-v1'

export function loadReplies(): Reply[] {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(KEY) || '[]')
    if (!Array.isArray(raw)) return []
    return raw.filter((v): v is Reply => typeof v === 'object' && v !== null &&
      typeof v.id === 'string' && typeof v.postId === 'number' &&
      (v.parentId === null || typeof v.parentId === 'string') &&
      typeof v.body === 'string' && typeof v.author === 'string' &&
      typeof v.createdAt === 'number' && typeof v.automated === 'boolean')
  } catch { return [] }
}
export function loadPending(): PendingReply[] {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(PENDING_KEY) || '[]')
    if (!Array.isArray(raw)) return []
    return raw.filter((v): v is PendingReply => typeof v === 'object' && v !== null &&
      typeof v.id === 'string' && typeof v.postId === 'number' &&
      typeof v.parentId === 'string' && typeof v.originalBody === 'string' &&
      typeof v.dueAt === 'number')
  } catch { return [] }
}
export function saveReplies(replies: Reply[]) {
  try { localStorage.setItem(KEY, JSON.stringify(replies)) } catch { /* stockage indisponible */ }
}
export function savePending(pending: PendingReply[]) {
  try { localStorage.setItem(PENDING_KEY, JSON.stringify(pending)) } catch { /* stockage indisponible */ }
}
export const botAccounts = [
  { name: 'NuitBlanche.exe', categories: ['societe', 'relations', 'nostalgie'], attitude: 'sceptique' },
  { name: 'KernelPanic', categories: ['tech', 'science', 'internet'], attitude: 'analytique' },
  { name: 'RageQuit_404', categories: ['gaming', 'sport'], attitude: 'provocateur' },
  { name: 'TontonSurLeNet', categories: ['politique', 'economie', 'travail'], attitude: 'cynique' },
  { name: 'PastaPolice', categories: ['cuisine'], attitude: 'taquin' },
  { name: 'VHS_dream', categories: ['cinema', 'musique', 'nostalgie'], attitude: 'nostalgique' },
  { name: 'AstraNoctis', categories: ['paranormal', 'science'], attitude: 'curieux' },
  { name: 'LectureFroide', categories: ['culture', 'etudes'], attitude: 'argumentatif' },
  { name: 'MemeArchiviste', categories: ['random', 'internet'], attitude: 'absurde' },
  { name: 'CafeSansFiltre', categories: ['travail', 'societe', 'politique'], attitude: 'ironique' },
  { name: 'VeloursBrutal', categories: ['relations', 'culture', 'musique'], attitude: 'direct' },
  { name: 'PixelPoubelle', categories: ['gaming', 'tech', 'random'], attitude: 'caustique' },
  { name: 'SceptiqueDuCoin', categories: ['economie', 'politique', 'paranormal'], attitude: 'sceptique' },
  { name: 'Cassette2007', categories: ['nostalgie', 'internet', 'cinema'], attitude: 'nostalgique' },
  { name: 'SansSommeil', categories: ['etudes', 'travail', 'random'], attitude: 'ironique' },
  { name: 'PasTonPote', categories: ['societe', 'sport', 'relations'], attitude: 'provocateur' },
] as const

function checksum(text: string) {
  let value = 2166136261
  for (let i = 0; i < text.length; i++) value = Math.imul(value ^ text.charCodeAt(i), 16777619)
  return value >>> 0
}
export function chooseBotAuthor(message: string, category: string, postId: number): string {
  const related = botAccounts.filter(account => (account.categories as readonly string[]).includes(category))
  const pool = related.length > 0 ? related : botAccounts
  return pool[checksum(message + category + postId) % pool.length].name
}

export function generateAutoReply(message: string, category = 'random', author = 'NuitBlanche.exe'): string {
  const value = message.toLocaleLowerCase('fr')
  const mood = botAccounts.find(account => account.name === author)?.attitude ?? 'direct'
  const phrase = message.trim().slice(0, 85).replace(/[\n\r]/g, ' ')
  const lead = phrase ? `Tu dis « ${phrase}${message.trim().length > 85 ? '…' : ''} ».` : ''
  const picks: Record<string, string[]> = {
    tech: [
      "C'est quoi ta config, la version exacte et le message d'erreur ? Les grandes théories c'est joli, les logs c'est mieux.",
      "Si ton raisonnement tient, montre un exemple reproductible. Sinon on va encore se disputer sur trois captures d'écran.",
      "Entre la documentation et les avis du forum, je vais miser sur la documentation. Mais développe ton point."
    ],
    gaming: [
      "Ça sent la discussion d'après-défaite. Donne le jeu, le rang et la situation exacte, qu'on rigole utilement.",
      "Les gens vont crier au skill issue dans dix secondes, mais la mécanique en question mérite un vrai débat.",
      "Si tu défends ce patch, va falloir m'expliquer ce qu'il améliore concrètement."
    ],
    politique: [
      "Tu peux détester une décision, mais c'est laquelle exactement ? Les slogans ne servent à rien sans les faits.",
      "Tout le monde a déjà choisi son camp. Moi je veux voir le texte et les conséquences, pas la guerre des hashtags.",
      "Encore une certitude énorme sur un extrait de communiqué. On a la version complète ?"
    ],
    societe: [
      "Le plus fou c'est qu'on pourrait parler du problème sans passer directement aux insultes. Mais bon, regarde où on est.",
      "Tu racontes une situation précise, alors pourquoi les commentaires en font-ils une guerre de civilisation ?",
      "Je ne défends personne, mais j'aimerais entendre l'autre version avant de juger."
    ],
    relations: [
      "Je vais être direct : demander l'avis de cent inconnus ne remplace pas une conversation avec la personne concernée.",
      "On n'a qu'un côté de l'histoire. C'est important, même si ça ruine l'ambiance du thread.",
      "Les captures et les sous-entendus, ça ne règle rien. Tu veux obtenir quoi au juste ?"
    ],
    science: [
      "La question est intéressante, mais j'aimerais une source ou un protocole avant d'en tirer une conclusion.",
      "Un schéma viral n'est pas une étude. Tu as vu les données originales ?",
      "Il y a une vraie explication possible, mais pas celle du titre sensationnaliste."
    ],
    paranormal: [
      "J'adore ce genre d'histoire, mais avant de parler de fantôme, on vérifie la lumière et les reflets ?",
      "Si tu as le contexte, l'heure et un autre angle, poste-les. La photo seule ne prouve pas grand-chose.",
      "C'est inquiétant à raconter, mais il y a peut-être une explication bien moins surnaturelle."
    ],
    cuisine: [
      "La police des recettes va débarquer. Moi je veux juste savoir si c'était bon.",
      "T'as les quantités et la cuisson ? C'est plus intéressant que la guerre des puristes.",
      "On se dispute pour une assiette alors que la moitié du forum ne sait pas cuire du riz."
    ],
    nostalgie: [
      "Ce truc m'a renvoyé direct en 2008. Le design était hideux et pourtant on y passait nos soirées.",
      "Le plus drôle, c'est que personne ne regrettait les bugs à l'époque. Maintenant on en fait des souvenirs.",
      "Je garde encore une archive de mon ancien profil. Je refuse de la montrer à qui que ce soit."
    ],
  }
  const generic = [
    "Je ne suis pas d'accord, mais au moins il y a un vrai sujet derrière. Quelqu'un a un exemple concret ?",
    "Tu vas te faire démolir dans les réponses, mais la question mérite mieux que trois insultes.",
    "C'est un peu facile de balancer ça comme une évidence. Tu peux expliquer ton raisonnement ?",
    "L'argument mérite d'être développé. Pour l'instant on a surtout de l'indignation au kilomètre.",
    "Ce fil va mal finir. Pourtant il y avait moyen d'avoir une discussion intéressante.",
    "J'ai lu les quinze premières réponses et personne ne répond à la question de départ. Classique.",
  ]
  const pool = picks[category] ?? generic
  const chosen = pool[checksum(message + author + mood) % pool.length]
  if (/source|preuve|fake|faux|mensong|complot/.test(value)) {
    return `${lead} Une source vérifiable serait déjà un bon début. Et non, « fais tes propres recherches » n'en est pas une.`
  }
  if (/con|abruti|merde|débile|ferme ta gueule|connard/.test(value)) {
    return `${lead} Tu peux être en colère, mais les insultes ne transforment pas ça en argument. ${chosen}`
  }
  return `${lead} ${chosen}`
}
