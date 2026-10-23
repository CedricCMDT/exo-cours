import { createContext, useContext, useMemo } from 'react'
import type { ReactNode } from 'react'
import { communityMembers, communityPosts } from '../data/community'
import { useRemoteDataset } from '../features/api/useRemoteDataset'
import type { ApiStatus } from '../features/api/useRemoteDataset'
import type { Member, Post } from '../types'
import type { Reply } from '../types/reply'
import { useSession } from './SessionContext'

type ForumValue = {
  posts: Post[]
  members: Member[]
  replies: Reply[]
  apiStatus: ApiStatus
  apiError: string
  apiCounts: { posts: number; members: number; comments: number }
  reloadApi: () => void
}

const ForumContext = createContext<ForumValue | null>(null)

/**
 * Catalogue consultable : associe les ressources de DummyJSON, celles
 * de la session locale et le contenu éditorial intégré au projet.
 * Les opérations d'authentification restent dans SessionContext.
 */
export function ForumProvider({ children }: { children: ReactNode }) {
  const remote = useRemoteDataset()
  const session = useSession()

  const posts = useMemo(
    () => [...session.posts, ...remote.data.posts, ...communityPosts],
    [session.posts, remote.data.posts],
  )
  const members = useMemo(
    () => [...session.members, ...remote.data.members, ...communityMembers],
    [session.members, remote.data.members],
  )
  const replies = useMemo(
    () => [...session.replies, ...remote.data.comments],
    [session.replies, remote.data.comments],
  )

  const value = useMemo<ForumValue>(
    () => ({
      posts,
      members,
      replies,
      apiStatus: remote.status,
      apiError: remote.error,
      apiCounts: remote.counts,
      reloadApi: remote.reload,
    }),
    [posts, members, replies, remote.status, remote.error, remote.counts, remote.reload],
  )

  return <ForumContext.Provider value={value}>{children}</ForumContext.Provider>
}

export function useForum() {
  const value = useContext(ForumContext)
  if (!value) throw new Error('ForumProvider manquant')
  return value
}
