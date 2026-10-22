import type { Member, Post } from '../types'
import type { Reply } from '../types/reply'

/**
 * DEUX SOURCES DE DONNÉES, DEUX RÔLES DIFFÉRENTS
 *
 * 1. DummyJSON : API REST externe, source PRINCIPALE du forum.
 *    Trois vrais GET HTTP chargent les posts, les utilisateurs et les commentaires.
 * 2. /session-api : notre petite API locale, qui gère les comptes et posts
 *    créés pendant l'exécution de Vite. Ils disparaissent au redémarrage.
 *
 * Ouvrir F12 > Réseau pour voir les requêtes de la première partie.
 */

const API_URL = 'https://dummyjson.com'

type ApiList<T, K extends string> = Record<K, T[]> & { total: number }
type ApiPost = Omit<Post, 'source' | 'local'>
type ApiMember = Pick<Member, 'id' | 'username' | 'firstName' | 'lastName' | 'image'>
type ApiComment = {
  id: number
  postId: number
  body: string
  likes: number
  user: { id: number; username: string; fullName: string }
}

export type ApiDataset = {
  posts: Post[]
  members: Member[]
  comments: Reply[]
}

/** fetch + contrôle du statut HTTP. Une seule fonction pour les trois GET. */
async function getJson<T>(endpoint: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(API_URL + endpoint, { signal })
  if (!response.ok) throw new Error(`API DummyJSON : HTTP ${response.status}`)
  return response.json() as Promise<T>
}

/** Charge d'abord l'API. Les archives fictives ne sont pas utilisées ici. */
export async function fetchApiDataset(signal?: AbortSignal): Promise<ApiDataset> {
  const [postResult, userResult, commentResult] = await Promise.all([
    getJson<ApiList<ApiPost, 'posts'>>('/posts?limit=0', signal),
    getJson<ApiList<ApiMember, 'users'>>('/users?limit=0&select=id,username,firstName,lastName,image', signal),
    getJson<ApiList<ApiComment, 'comments'>>('/comments?limit=0', signal),
  ])

  // On ajoute source:'api' pour différencier visuellement les données distantes.
  const posts: Post[] = postResult.posts.map(post => ({
    ...post,
    source: 'api',
    local: false,
  }))

  const members: Member[] = userResult.users.map(member => ({
    ...member,
    firstName: member.firstName || '',
    lastName: member.lastName || '',
  }))

  // DummyJSON n'envoie PAS de dates pour ses commentaires : on n'en invente pas.
  const comments: Reply[] = commentResult.comments.map(comment => ({
    id: 'api-' + comment.id,
    postId: comment.postId,
    parentId: null,
    author: comment.user.username,
    body: comment.body,
    automated: false,
  }))

  return { posts, members, comments }
}

/** Appels vers le serveur Vite : vraies modifications temporaires. */
export async function sessionRequest<T>(
  path: string,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET',
  data?: unknown,
): Promise<T> {
  const response = await fetch('/session-api' + path, {
    method,
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: data === undefined ? undefined : JSON.stringify(data),
  })
  const result = await response.json()
  if (!response.ok) throw new Error(result.error || 'Serveur local indisponible.')
  return result as T
}
