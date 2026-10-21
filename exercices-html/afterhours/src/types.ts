export type Post = {
  id: number
  title: string
  body: string
  tags: string[]
  reactions: { likes: number; dislikes: number }
  views: number
  userId: number
  local?: boolean
  createdAt?: string
  source?: 'community' | 'api'
}
export type Member = { id: number; username: string; firstName: string; lastName: string; image?: string; bio?: string; joinedAt?: string }
export type Query = { text: string; tag: string; popularity: string; page: number }
export type Creation = { title: string; body: string; tags: string[]; userId: number }
export type ApiList<T> = { posts: T[]; total: number }
