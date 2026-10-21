import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { createPost, fetchMembers, fetchPosts } from '../api'
import type { Creation, Member, Post, Query } from '../types'

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
  const [posts, setPosts] = useState<Post[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [revision, setRevision] = useState(0)
  const [query, setQuery] = useState<Query>({ text: '', tag: '', popularity: 'all', page: 1 })
  const [savedIds, setSavedIds] = useState<number[]>(readArray)
  const [theme, setTheme] = useState<'light' | 'dark'>(readTheme)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [nextPosts, nextMembers] = await Promise.all([fetchPosts(), fetchMembers()])
        if (!cancelled) {
          setPosts(old => [...old.filter(p => p.local), ...nextPosts])
          setMembers(nextMembers)
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

  function setCriteria(changes: Partial<Omit<Query, 'page'>>) {
    setQuery(q => ({ ...q, ...changes, page: 1 }))
  }
  function toggleSaved(id: number) {
    setSavedIds(current => current.includes(id) ? current.filter(v => v !== id) : [...current, id])
  }
  async function publish(draft: Creation) {
    const post = await createPost(draft)
    setPosts(old => [post, ...old.filter(p => p.id !== post.id)])
    return post
  }
  return (
    <NetworkContext.Provider value={{
      posts, members, loading, error, query, setCriteria,
      setPage: page => setQuery(q => ({ ...q, page })),
      savedIds, toggleSaved, publish,
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
