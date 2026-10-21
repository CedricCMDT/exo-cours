import type { ApiList, Creation, Member, Post } from './types'

const BASE = 'https://dummyjson.com'
async function read<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(BASE + url, init)
  if (!response.ok) {
    throw new Error('Le serveur ne répond pas correctement (HTTP ' + response.status + ').')
  }
  return response.json() as Promise<T>
}
export async function fetchPosts(): Promise<Post[]> {
  const data = await read<ApiList<Post>>('/posts?limit=0')
  return data.posts
}
export async function fetchMembers(): Promise<Member[]> {
  const data = await read<{ users: Member[] }>('/users?limit=0')
  return data.users
}
export function fetchPost(id: number) { return read<Post>('/posts/' + id) }
export async function createPost(data: Creation): Promise<Post> {
  const created = await read<Post>('/posts/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return { ...created, reactions: created.reactions ?? { likes: 0, dislikes: 0 }, views: created.views ?? 0, tags: created.tags ?? data.tags, local: true }
}

export async function sessionRequest<T>(path: string, method = 'GET', data?: unknown): Promise<T> {
 const response = await fetch('/session-api'+path, { method, headers: {'Content-Type':'application/json'}, body: data === undefined ? undefined : JSON.stringify(data), credentials:'same-origin' })
 const result = await response.json()
 if (!response.ok) throw new Error(result.error || 'Erreur de session.')
 return result as T
}
