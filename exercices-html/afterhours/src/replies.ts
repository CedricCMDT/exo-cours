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
export function generateAutoReply(message: string): string {
  const text = message.toLocaleLowerCase('fr')
  if (/fake|faux|mensong|source|preuve|complot|info/.test(text)) {
    return 'T’as une source solide pour ça, ou on doit encore croire un screenshot compressé à mort ? Parce que là, ça sent le grand n’importe quoi.'
  }
  if (/politique|gouvernement|président|élection|vote|ministre/.test(text)) {
    return 'La politique sur ce site, c’est toujours pareil : tout le monde gueule et personne lit plus loin que le titre. Tu proposes quoi concrètement ?'
  }
  if (/jeu|gaming|console|pc|windows|linux|code|typescript|react|bug/.test(text)) {
    return 'OK, mais c’est quoi ton argument technique ? Parce que balancer un avis sans expliquer le pourquoi, c’est un peu léger.'
  }
  if (/amour|couple|relation|ex|rencontre|sentiment/.test(text)) {
    return 'C’est fou le nombre de gens qui donnent des leçons sur les relations ici. T’as essayé d’en parler directement à la personne concernée ?'
  }
  if (/insult|con|abruti|merde|gueule|débile/.test(text)) {
    return 'Tu peux m’insulter encore trois paragraphes, ça ne rendra pas ton argument plus crédible. Explique plutôt ce que tu veux dire.'
  }
  const ideas = [
    'Attends, développe un peu. Pourquoi tu penses ça exactement ? Ça m’intéresse plus qu’un slogan jeté dans le vide.',
    'Mouais. Il manque quand même pas mal de contexte à ton message. T’as un exemple concret ?',
    'Je suis pas convaincu. Tu présentes ça comme une évidence, mais le raisonnement derrière est où ?',
    'Alors là, je veux bien entendre ton point de vue, mais il va falloir argumenter un minimum.',
  ]
  let hash = 0
  for (const char of text) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return ideas[hash % ideas.length]
}
