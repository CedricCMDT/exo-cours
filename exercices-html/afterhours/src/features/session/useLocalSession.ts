import { useCallback, useEffect, useState } from 'react'
import { sessionRequest } from '../../services/api'
import type { Creation, Member, Post } from '../../types'
import type { Reply } from '../../types/reply'

/** Réponse du serveur local en mémoire vive. */
export type SessionState = {
  bootId: string
  user: Member | null
  members: Member[]
  posts: Post[]
  comments: Reply[]
}

/**
 * Toutes les mutations passent par cette couche, jamais directement depuis
 * les composants. Après une écriture, on relit /state pour synchroniser l'UI.
 */
export function useLocalSession(onServerBoot: (bootId: string) => void) {
  const [user, setUser] = useState<Member | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [replies, setReplies] = useState<Reply[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [revision, setRevision] = useState(0)

  const sync = useCallback(
    (state: SessionState) => {
      onServerBoot(state.bootId)
      setUser(state.user)
      setPosts(state.posts.map((post) => ({ ...post, source: 'session' })))
      setMembers(state.members)
      setReplies(state.comments)
    },
    [onServerBoot],
  )

  const refresh = useCallback(async () => {
    const state = await sessionRequest<SessionState>('/state')
    sync(state)
  }, [sync])

  useEffect(() => {
    let cancelled = false
    sessionRequest<SessionState>('/state')
      .then((state) => {
        if (cancelled) return
        sync(state)
        setError('')
      })
      .catch((reason: unknown) => {
        if (cancelled) return
        setError(reason instanceof Error ? reason.message : 'Serveur local indisponible.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [revision, sync])

  async function mutate<T>(path: string, method: 'POST' | 'PATCH' | 'DELETE', payload?: unknown) {
    const response = await sessionRequest<T>(path, method, payload)
    await refresh()
    return response
  }

  return {
    user, posts, members, replies, loading, error,
    reload: () => { setLoading(true); setRevision((value) => value + 1) },
    register: async (username: string, password: string) => {
      await mutate('/register', 'POST', { username, password })
    },
    login: async (username: string, password: string) => {
      await mutate('/login', 'POST', { username, password })
    },
    logout: async () => { await mutate('/logout', 'POST') },
    updateBio: async (bio: string) => { await mutate('/profile', 'PATCH', { bio }) },
    editPost: async (id: number, title: string, body: string) => {
      await mutate('/posts/' + id, 'PATCH', { title, body })
    },
    deletePost: async (id: number) => { await mutate('/posts/' + id, 'DELETE') },
    editReply: async (id: string, body: string) => {
      await mutate('/comments/' + id, 'PATCH', { body })
    },
    deleteReply: async (id: string) => { await mutate('/comments/' + id, 'DELETE') },
    addReply: async (postId: number, parentId: string | null, body: string) => {
      await mutate('/comments', 'POST', { postId, parentId, body })
    },
    publish: async (draft: Creation): Promise<Post> => {
      const response = await mutate<{ post: Post }>('/posts', 'POST', {
        title: draft.title,
        body: draft.body,
        tag: draft.tags[0],
      })
      return response.post
    },
  }
}
