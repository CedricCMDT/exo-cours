import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { sessionRequest } from '../api'
import type { Creation, Member, Post, Query } from '../types'

import type { Reply } from '../replies'
type PendingReply = { id:string; postId:number; parentId:string; originalBody:string; dueAt:number; author?:string }
import { communityMembers, communityPosts } from '../data/community'

type ContextValue = {
  user: Member | null
  register: (username:string,password:string) => Promise<void>
  login: (username:string,password:string) => Promise<void>
  logout: () => Promise<void>
  updateBio: (bio:string) => Promise<void>
  editPost: (id:number,title:string,body:string) => Promise<void>
  deletePost: (id:number) => Promise<void>
  editReply: (id:string,body:string) => Promise<void>
  deleteReply: (id:string) => Promise<void>
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
  addReply: (postId: number, parentId: string | null, body: string) => Promise<void>
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
  const [user, setUser] = useState<Member | null>(null)
  const [posts, setPosts] = useState<Post[]>(() => communityPosts)
  const [members, setMembers] = useState<Member[]>(() => communityMembers)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [revision, setRevision] = useState(0)
  const [query, setQuery] = useState<Query>({ text: '', tag: '', popularity: 'all', page: 1 })
  const [savedIds, setSavedIds] = useState<number[]>(readArray)
  const [replies, setReplies] = useState<Reply[]>([])
  const [pendingReplies, setPendingReplies] = useState<PendingReply[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>(readTheme)

  useEffect(() => {
    let cancelled=false
    sessionRequest<{user:Member|null;members:Member[];posts:Post[];comments:Reply[]}>('/state')
      .then(data=>{if(cancelled)return;setUser(data.user);setMembers([...communityMembers,...data.members]);setPosts([...data.posts,...communityPosts].sort((a,b)=>(b.createdAt||'').localeCompare(a.createdAt||'')));setReplies(data.comments);setError('')})
      .catch(e=>{if(!cancelled)setError(e instanceof Error?e.message:'Serveur indisponible.')})
      .finally(()=>{if(!cancelled)setLoading(false)})
    return ()=>{cancelled=true}
  },[revision])
  async function refreshSession(){
    const data=await sessionRequest<{user:Member|null;members:Member[];posts:Post[];comments:Reply[]}>('/state')
    setUser(data.user);setMembers([...communityMembers,...data.members]);setPosts([...data.posts,...communityPosts].sort((a,b)=>(b.createdAt||'').localeCompare(a.createdAt||'')));setReplies(data.comments)
  }
  async function register(username:string,password:string){await sessionRequest('/register','POST',{username,password});await refreshSession()}
  async function login(username:string,password:string){await sessionRequest('/login','POST',{username,password});await refreshSession()}
  async function logout(){await sessionRequest('/logout','POST');await refreshSession()}
  async function updateBio(bio:string){await sessionRequest('/profile','PATCH',{bio});await refreshSession()}
  async function editPost(id:number,title:string,body:string){await sessionRequest('/posts/'+id,'PATCH',{title,body});await refreshSession()}
  async function deletePost(id:number){await sessionRequest('/posts/'+id,'DELETE');await refreshSession()}
  async function editReply(id:string,body:string){await sessionRequest('/comments/'+id,'PATCH',{body});await refreshSession()}
  async function deleteReply(id:string){await sessionRequest('/comments/'+id,'DELETE');await refreshSession()}
  useEffect(() => {
    try { localStorage.setItem('afterhours-saved', JSON.stringify(savedIds)) } catch { /* stockage indisponible */ }
  }, [savedIds])
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('afterhours-theme', theme) } catch { /* stockage indisponible */ }
  }, [theme])

  async function addReply(postId:number,parentId:string|null,body:string) {
    await sessionRequest('/comments','POST',{postId,parentId,body})
    await refreshSession()
  }

  function setCriteria(changes: Partial<Omit<Query, 'page'>>) {
    setQuery(q => ({ ...q, ...changes, page: 1 }))
  }
  function toggleSaved(id: number) {
    setSavedIds(current => current.includes(id) ? current.filter(v => v !== id) : [...current, id])
  }
  async function publish(draft: Creation) {
    const result=await sessionRequest<{post:Post}>('/posts','POST',{title:draft.title,body:draft.body,tag:draft.tags[0]})
    await refreshSession()
    return result.post
  }
  return (
    <NetworkContext.Provider value={{
      user, register, login, logout, updateBio, editPost, deletePost, editReply, deleteReply,
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
