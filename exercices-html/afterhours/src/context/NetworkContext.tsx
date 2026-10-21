import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { createPost, fetchMembers, fetchPosts } from '../api'
import type { Creation, Member, Post, Query } from '../types'
import { generateAutoReply, loadPending, loadReplies, savePending, saveReplies } from '../replies'
import type { PendingReply, Reply } from '../replies'
import { chooseBotAuthor } from '../replies'
import { communityMembers, communityPosts } from '../data/community'

type ContextValue = {
  posts: Post[]
  members: Member[]
  loading: boolean
  error: string
  query: Query
  setCriteria: (changes: Partial<Omit<Query, 'page'>>) => void
  setPage: (page: number) => void
  savedIds: number[]
  toggleSaved: (id: number) => void
  publish: (draft: Creation) => Promise<Post>
  reload: () => void
  replies: Reply[]
  addReply: (postId: number, parentId: string | null, body: string) => void
  pendingReplies: PendingReply[]
  theme: 'light' | 'dark'
  toggleTheme: () => void
}
const NetworkContext = createContext<ContextValue | null>(null)
function readArray(): number[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem('afterhours-saved') || '[]')
    return Array.isArray(value) ? [...new Set(value.filter((id): id is number => typeof id === 'number' && Number.isFinite(id)))] : []
  } catch { return [] }
}
function readTheme(): 'light' | 'dark' {
  try { return localStorage.getItem('afterhours-theme') === 'dark' ? 'dark' : 'light' }
  catch { return 'light' }
}
export function NetworkProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(() => communityPosts)
  const [members, setMembers] = useState<Member[]>(() => communityMembers)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [revision, setRevision] = useState(0)
  const [query, setQuery] = useState<Query>({ text: '', tag: '', popularity: 'all', page: 1 })
  const [savedIds, setSavedIds] = useState<number[]>(readArray)
  const [replies, setReplies] = useState<Reply[]>(loadReplies)
  const [pendingReplies, setPendingReplies] = useState<PendingReply[]>(loadPending)
  const [theme, setTheme] = useState<'light' | 'dark'>(readTheme)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [nextPosts, nextMembers] = await Promise.all([fetchPosts(), fetchMembers()])
        if (!cancelled) {
          setPosts(old => [
            ...old.filter(p => p.local),
            ...communityPosts,
            ...nextPosts.map(p => ({ ...p, source: 'api' as const })),
          ].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')))
          setMembers([...communityMembers, ...nextMembers])
          setError('')
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Erreur réseau.')
      } finally { if (!cancelled) setLoading(false) }
    }
    void load()
    return () => { cancelled = true }
  }, [revision])

  useEffect(() => {
    try { localStorage.setItem('afterhours-saved', JSON.stringify(savedIds)) } catch { /* stockage indisponible */ }
  }, [savedIds])
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('afterhours-theme', theme) } catch { /* stockage indisponible */ }
  }, [theme])

  useEffect(() => { saveReplies(replies) }, [replies])
  useEffect(() => { savePending(pendingReplies) }, [pendingReplies])

  // Les réponses déjà planifiées sont conservées lors de la navigation ou du rechargement.
  useEffect(() => {
    const timers = pendingReplies.map(job => {
      const remaining = Math.max(0, job.dueAt - Date.now())
      return window.setTimeout(() => {
        setReplies(current => current.some(r => r.id === job.id) ? current : [...current, {
          id: job.id, postId: job.postId, parentId: job.parentId,
          body: generateAutoReply(job.originalBody, posts.find(p => p.id === job.postId)?.tags[0], job.author), author: job.author ?? 'oldschool_bot',
          automated: true, createdAt: Date.now(),
        }])
        setPendingReplies(current => current.filter(item => item.id !== job.id))
      }, remaining)
    })
    return () => timers.forEach(window.clearTimeout)
  }, [pendingReplies, posts])

  function addReply(postId: number, parentId: string | null, body: string) {
    const clean = body.trim()
    if (!clean || clean.length > 2000) return
    const id = crypto.randomUUID()
    setReplies(current => [...current, {
      id, postId, parentId, body: clean, author: 'you', automated: false, createdAt: Date.now(),
    }])
    // Réponse automatique entre 10 et 30 secondes, sans service externe.
    const dueAt = Date.now() + 10000 + Math.floor(Math.random() * 20001)
    const category = posts.find(post => post.id === postId)?.tags[0] || 'random'
    const author = chooseBotAuthor(clean, category, postId)
    setPendingReplies(current => [...current, {
      id: crypto.randomUUID(), postId, parentId: id, originalBody: clean, dueAt, author,
    }])
  }

  function setCriteria(changes: Partial<Omit<Query, 'page'>>) {
    setQuery(q => ({ ...q, ...changes, page: 1 }))
  }
  function toggleSaved(id: number) {
    setSavedIds(current => current.includes(id) ? current.filter(v => v !== id) : [...current, id])
  }
  async function publish(draft: Creation) {
    const post = await createPost(draft)
    const dated = { ...post, createdAt: new Date().toISOString() }
    setPosts(old => [dated, ...old.filter(p => p.id !== dated.id)])
    return dated
  }
  return (
    <NetworkContext.Provider value={{
      posts, members, loading, error, query, setCriteria,
      setPage: page => setQuery(q => ({ ...q, page })),
      savedIds, toggleSaved, publish, replies, addReply, pendingReplies,
      reload: () => { setLoading(true); setRevision(n => n + 1) },
      theme, toggleTheme: () => setTheme(t => t === 'dark' ? 'light' : 'dark'),
    }}>
      {children}
    </NetworkContext.Provider>
  )
}
export function useNetwork() {
  const value = useContext(NetworkContext)
  if (!value) throw new Error('NetworkProvider manquant')
  return value
}
