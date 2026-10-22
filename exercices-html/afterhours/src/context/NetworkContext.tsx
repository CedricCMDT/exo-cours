import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { fetchApiDataset, sessionRequest } from '../api'
import type { ApiDataset } from '../api'
import type { Creation, Member, Post, Query } from '../types'
import type { Reply } from '../replies'
import { communityMembers, communityPosts } from '../data/community'

/**
 * CONTEXTE : rassemble trois sources sans jamais les confondre.
 *  - remote   : les vrais GET de DummyJSON (priorité de l'interface)
 *  - session  : les publications que l'utilisateur crée localement
 *  - archive  : les anciennes publications françaises fictives
 */
type SessionState = {
  bootId: string
  user: Member | null
  members: Member[]
  posts: Post[]
  comments: Reply[]
}

type PendingReply = {
  id: string
  postId: number
  parentId: string
  originalBody: string
  dueAt: number
  author?: string
}

type ApiStatus = 'loading' | 'ready' | 'error'

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
  apiStatus: ApiStatus
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
  pendingReplies: PendingReply[]
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const NetworkContext = createContext<ContextValue | null>(null)
const EMPTY_API: ApiDataset = { posts: [], members: [], comments: [] }

function readArray(): number[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem('afterhours-saved') || '[]')
    return Array.isArray(value)
      ? [...new Set(value.filter((id): id is number => typeof id === 'number' && Number.isFinite(id)))]
      : []
  } catch { return [] }
}

function readTheme(): 'light' | 'dark' {
  try { return localStorage.getItem('afterhours-future-theme') === 'light' ? 'light' : 'dark' }
  catch { return 'dark' }
}

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Member | null>(null)
  const [sessionPosts, setSessionPosts] = useState<Post[]>([])
  const [sessionMembers, setSessionMembers] = useState<Member[]>([])
  const [sessionReplies, setSessionReplies] = useState<Reply[]>([])
  const [remote, setRemote] = useState<ApiDataset>(EMPTY_API)
  const [apiStatus, setApiStatus] = useState<ApiStatus>('loading')
  const [apiError, setApiError] = useState('')
  const [apiRevision, setApiRevision] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [revision, setRevision] = useState(0)
  const [query, setQuery] = useState<Query>({ text: '', tag: '', popularity: 'all', page: 1 })
  const [savedIds, setSavedIds] = useState<number[]>(readArray)
  const pendingReplies: PendingReply[] = []
  const [theme, setTheme] = useState<'light' | 'dark'>(readTheme)

  // API distante : les trois vrais GET sont la PREMIÈRE source du fil.
  // AbortController annule l'ancienne requête si React démonte le composant.
  useEffect(() => {
    const controller = new AbortController()
    setApiStatus('loading')
    setApiError('')
    fetchApiDataset(controller.signal)
      .then(data => {
        if (controller.signal.aborted) return
        setRemote(data)
        setApiStatus('ready')
      })
      .catch(reason => {
        if (controller.signal.aborted) return
        setApiStatus('error')
        setApiError(reason instanceof Error ? reason.message : 'Échec de l’API externe.')
      })
    return () => controller.abort()
  }, [apiRevision])

  const syncSession = useCallback((data: SessionState) => {
    // Quand Vite redémarre, le bootId change et les favoris de l'ancienne
    // session ne sont plus conservés. Le thème peut rester en mémoire navigateur.
    try {
      const previous = localStorage.getItem('afterhours-boot-id')
      if (previous !== data.bootId) {
        localStorage.removeItem('afterhours-saved')
        localStorage.setItem('afterhours-boot-id', data.bootId)
        setSavedIds([])
      }
    } catch { /* Stockage facultatif. */ }

    setUser(data.user)
    setSessionMembers(data.members)
    setSessionPosts(data.posts)
    setSessionReplies(data.comments)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    // La mini API locale ne remplace PAS DummyJSON : elle conserve uniquement
    // nos propres créations et notre système de connexion.
    sessionRequest<SessionState>('/state')
      .then(data => {
        if (controller.signal.aborted) return
        syncSession(data)
        setError('')
      })
      .catch(reason => {
        if (!controller.signal.aborted) {
          setError(reason instanceof Error ? reason.message : 'Serveur local indisponible.')
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [revision, syncSession])

  // Le même tableau final nourrit l'accueil, les profils et les fiches de sujet.
  // Les IDs ne se croisent pas : API 1+, archives 20000+, session 1000000+.
  const posts = useMemo(() =>
    [...sessionPosts, ...remote.posts, ...communityPosts],
    [sessionPosts, remote.posts],
  )
  const members = useMemo(() =>
    [...sessionMembers, ...remote.members, ...communityMembers],
    [sessionMembers, remote.members],
  )
  const replies = useMemo(() =>
    [...sessionReplies, ...remote.comments],
    [sessionReplies, remote.comments],
  )
  const apiCounts = useMemo(() => ({
    posts: remote.posts.length,
    members: remote.members.length,
    comments: remote.comments.length,
  }), [remote])

  async function refreshSession() {
    const data = await sessionRequest<SessionState>('/state')
    syncSession(data)
  }
  async function register(username: string, password: string) {
    await sessionRequest('/register', 'POST', { username, password })
    await refreshSession()
  }
  async function login(username: string, password: string) {
    await sessionRequest('/login', 'POST', { username, password })
    await refreshSession()
  }
  async function logout() {
    await sessionRequest('/logout', 'POST')
    await refreshSession()
  }
  async function updateBio(bio: string) {
    await sessionRequest('/profile', 'PATCH', { bio })
    await refreshSession()
  }
  async function editPost(id: number, title: string, body: string) {
    await sessionRequest('/posts/' + id, 'PATCH', { title, body })
    await refreshSession()
  }
  async function deletePost(id: number) {
    await sessionRequest('/posts/' + id, 'DELETE')
    await refreshSession()
  }
  async function editReply(id: string, body: string) {
    await sessionRequest('/comments/' + id, 'PATCH', { body })
    await refreshSession()
  }
  async function deleteReply(id: string) {
    await sessionRequest('/comments/' + id, 'DELETE')
    await refreshSession()
  }
  async function addReply(postId: number, parentId: string | null, body: string) {
    await sessionRequest('/comments', 'POST', { postId, parentId, body })
    await refreshSession()
  }
  async function publish(draft: Creation) {
    const response = await sessionRequest<{ post: Post }>('/posts', 'POST', {
      title: draft.title,
      body: draft.body,
      tag: draft.tags[0],
    })
    await refreshSession()
    return response.post
  }

  function setCriteria(changes: Partial<Omit<Query, 'page'>>) {
    setQuery(current => ({ ...current, ...changes, page: 1 }))
  }
  function toggleSaved(id: number) {
    setSavedIds(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id])
  }
  useEffect(() => {
    try { localStorage.setItem('afterhours-saved', JSON.stringify(savedIds)) }
    catch { /* Stockage facultatif. */ }
  }, [savedIds])
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('afterhours-future-theme', theme) }
    catch { /* Stockage facultatif. */ }
  }, [theme])

  return <NetworkContext.Provider value={{
    user, register, login, logout, updateBio, editPost, deletePost,
    editReply, deleteReply, posts, members, replies, apiStatus, apiError,
    apiCounts, reloadApi: () => setApiRevision(value => value + 1),
    loading, error, query, setCriteria,
    setPage: page => setQuery(current => ({ ...current, page })),
    savedIds, toggleSaved, publish, addReply, pendingReplies,
    reload: () => { setLoading(true); setRevision(value => value + 1) },
    theme, toggleTheme: () => setTheme(current => current === 'dark' ? 'light' : 'dark'),
  }}>{children}</NetworkContext.Provider>
}

export function useNetwork() {
  const context = useContext(NetworkContext)
  if (!context) throw new Error('NetworkProvider manquant')
  return context
}
