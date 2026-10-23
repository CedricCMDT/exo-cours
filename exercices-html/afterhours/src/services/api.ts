import type { Member, Post } from '../types'
import type { Reply } from '../types/reply'

/**
 * Couche d'accès aux données.
 *
 * Deux services sont utilisés : DummyJSON pour la consultation du catalogue
 * et /session-api pour les actions associées à la session courante.
 * Les composants n'ont pas à construire eux-mêmes les requêtes HTTP.
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

/** Centralise le contrôle des statuts HTTP et le décodage des réponses JSON. */
async function getJson<T>(endpoint: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(API_URL + endpoint, { signal })
  if (!response.ok) throw new Error(`API DummyJSON : HTTP ${response.status}`)
  return response.json() as Promise<T>
}

/**
 * Récupère le catalogue distant en parallèle.
 * Promise.all rejette l'ensemble du chargement si l'une des trois requêtes
 * échoue ; le hook appelant se charge alors de l'état d'erreur.
 */
export async function fetchApiDataset(signal?: AbortSignal): Promise<ApiDataset> {
  const [postResult, userResult, commentResult] = await Promise.all([
    getJson<ApiList<ApiPost, 'posts'>>('/posts?limit=0', signal),
    getJson<ApiList<ApiMember, 'users'>>('/users?limit=0&select=id,username,firstName,lastName,image', signal),
    getJson<ApiList<ApiComment, 'comments'>>('/comments?limit=0', signal),
  ])

  // La provenance est ajoutée au modèle commun pour les filtres de l'interface.
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

  // Aucun champ de date n'est ajouté : l'endpoint /comments n'en fournit pas.
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
