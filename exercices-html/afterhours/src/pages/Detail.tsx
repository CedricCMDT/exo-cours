import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { fetchPost } from '../api'
import { useNetwork } from '../context/NetworkContext'
import type { Post } from '../types'
import { Discussion } from '../components/Discussion'

export function Detail() {
  const { id } = useParams()
  const { posts, members, savedIds, toggleSaved, user, editPost, deletePost } = useNetwork()
  const navigate=useNavigate()
  const [editing,setEditing]=useState(false)
  const [title,setTitle]=useState('')
  const [body,setBody]=useState('')
  const [actionError,setActionError]=useState('')
  const local = posts.find(p => String(p.id) === id)
  const [remote, setRemote] = useState<Post | null>(null)
  const [loading, setLoading] = useState(!local)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)
  useEffect(() => {
    if (local || !id) return
    let active = true
    async function load() {
      setLoading(true); setError('')
      try {
        const data = await fetchPost(Number(id))
        if (active) setRemote(data)
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : 'Publication introuvable.')
      } finally { if (active) setLoading(false) }
    }
    void load()
    return () => { active = false }
  }, [local, id, retry])
  const post = local || remote
  const member = members.find(u => u.id === post?.userId)
  const date = post?.createdAt ? new Date(post.createdAt).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' }) : 'Archive'
  return <main className="narrow-page">
    <div className="breadcrumb"><Link to="/">← Retour au fil</Link> / fil #{id}</div>
    {loading && !local && <p role="status" className="notice">Chargement de la discussion…</p>}
    {error && !post && <div className="notice error" role="alert">{error} <button onClick={() => setRetry(n => n + 1)}>Réessayer</button></div>}
    {!loading && post && <article className="detail-card">
      <small>AFTERHOURS / THREAD #{post.id}</small>
      <h1>{post.title}</h1>
      <p className="byline">Publié par @{member?.username || 'anonymous_' + post.userId} · {date}</p>
      <div className="detail-body">{post.body}</div>
      {user?.id===post.userId && post.local && <div><button onClick={()=>{setTitle(post.title);setBody(post.body);setEditing(!editing)}}>{editing?"Annuler":"Modifier mon post"}</button><button onClick={async()=>{if(window.confirm("Supprimer définitivement ce post ?")){await deletePost(post.id);navigate("/")}}}>Supprimer mon post</button>{editing&&<form onSubmit={async e=>{e.preventDefault();try{await editPost(post.id,title,body);setEditing(false)}catch(e){setActionError(String(e))}}}><input value={title} onChange={e=>setTitle(e.target.value)} minLength={5} maxLength={100} required/><textarea value={body} onChange={e=>setBody(e.target.value)} minLength={15} required/><button type="submit">Enregistrer</button></form>}{actionError&&<p role="alert">{actionError}</p>}</div>}
      <dl className="stats">
        <div><dt>Likes</dt><dd>{post.reactions?.likes ?? 0}</dd></div>
        <div><dt>Dislikes</dt><dd>{post.reactions?.dislikes ?? 0}</dd></div>
        <div><dt>Lectures</dt><dd>{post.views ?? 0}</dd></div>
        <div><dt>Communautés</dt><dd>{post.tags.join(', ') || 'Aucune'}</dd></div>
        <div><dt>Auteur ID</dt><dd>{post.userId}</dd></div>
      </dl>
      <button className="primary" aria-pressed={savedIds.includes(post.id)} onClick={() => toggleSaved(post.id)}>{savedIds.includes(post.id) ? '★ Retirer des sauvegardes' : '☆ Sauvegarder ce fil'}</button>
      <Discussion postId={post.id} post={post} />
    </article>}
  </main>
}
