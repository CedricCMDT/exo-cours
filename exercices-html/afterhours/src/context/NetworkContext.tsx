import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { communityMembers, communityPosts } from '../data/community'
import { useRemoteDataset } from '../features/api/useRemoteDataset'
import { useLocalSession } from '../features/session/useLocalSession'
import type { Creation, Member, Post, Query } from '../types'
import type { Reply } from '../types/reply'

type ContextValue = {
  user: Member | null
  register: (username: string, password: string) => Promise<void>
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateBio: (bio: string) => Promise<void>
  editPost: (id: number, title: string, body: string) => Promise<void>
  deletePost: (id: number) => Promise<void>
  editReply: (id: string, body: string) => Promise<void>
  deleteReply: (id: string) => Promise<void>
  posts: Post[]
  members: Member[]
  replies: Reply[]
  apiStatus: 'loading' | 'ready' | 'error'
  apiError: string
  apiCounts: { posts: number; members: number; comments: number }
  reloadApi: () => void
  loading: boolean
  error: string
  query: Query
  setCriteria: (changes: Partial<Omit<Query, 'page'>>) => void
  setPage: (page: number) => void
  savedIds: number[]
  toggleSaved: (id: number) => void
  publish: (draft: Creation) => Promise<Post>
  reload: () => void
  addReply: (postId: number, parentId: string | null, body: string) => Promise<void>
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const NetworkContext = createContext<ContextValue | null>(null)

function readBookmarks() {
  try {
    const value: unknown = JSON.parse(localStorage.getItem('afterhours-saved') || '[]')
    return Array.isArray(value)
      ? [...new Set(value.filter((item): item is number => typeof item === 'number'))]
      : []
  } catch {
    return []
  }
}

function readTheme(): 'light' | 'dark' {
  try {
    return localStorage.getItem('afterhours-future-theme') === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

/**
 * Le contexte assemble les données : il ne contient plus les requêtes HTTP
 * et ne gère plus lui-même les formulaires ni les opérations CRUD.
 *
 * API externe → useRemoteDataset()
 * API locale → useLocalSession()
 * Résultat   → contexte utilisé par les pages.
 */
export function NetworkProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState<Query>({
    text: '',
    tag: '',
    popularity: 'all',
    page: 1,
  })
  const [savedIds, setSavedIds] = useState<number[]>(readBookmarks)
  const [theme, setTheme] = useState<'light' | 'dark'>(readTheme)

  const handleServerBoot = useCallback((bootId: string) => {
    try {
      const previousBoot = localStorage.getItem('afterhours-boot-id')
      if (previousBoot !== bootId) {
        localStorage.removeItem('afterhours-saved')
        localStorage.setItem('afterhours-boot-id', bootId)
        setSavedIds([])
      }
    } catch {
      // Le site reste utilisable si localStorage est indisponible.
    }
  }, [])

  const remote = useRemoteDataset()
  const session = useLocalSession(handleServerBoot)

  // Un seul tableau combiné pour les routes, avec les sources distinctes.
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

  function setCriteria(changes: Partial<Omit<Query, 'page'>>) {
    setQuery((current) => ({ ...current, ...changes, page: 1 }))
  }
  function toggleSaved(id: number) {
    setSavedIds((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    )
  }

  useEffect(() => {
    try {
      localStorage.setItem('afterhours-saved', JSON.stringify(savedIds))
    } catch {
      // Favoris désactivés si le stockage navigateur est bloqué.
    }
  }, [savedIds])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('afterhours-future-theme', theme)
    } catch {
      // Le thème reste actif jusqu'à l'actualisation du navigateur.
    }
  }, [theme])

  return (
    <NetworkContext.Provider
      value={{
        user: session.user,
        register: session.register,
        login: session.login,
        logout: session.logout,
        updateBio: session.updateBio,
        editPost: session.editPost,
        deletePost: session.deletePost,
        editReply: session.editReply,
        deleteReply: session.deleteReply,
        posts,
        members,
        replies,
        apiStatus: remote.status,
        apiError: remote.error,
        apiCounts: remote.counts,
        reloadApi: remote.reload,
        loading: session.loading,
        error: session.error,
        query,
        setCriteria,
        setPage: (page) => setQuery((current) => ({ ...current, page })),
        savedIds,
        toggleSaved,
        publish: session.publish,
        reload: session.reload,
        addReply: session.addReply,
        theme,
        toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
      }}
    >
      {children}
    </NetworkContext.Provider>
  )
}

export function useNetwork() {
  const value = useContext(NetworkContext)
  if (!value) throw new Error('NetworkProvider manquant')
  return value
}
