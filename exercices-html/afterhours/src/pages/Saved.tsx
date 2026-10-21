import { Link } from 'react-router'
import { PostCard } from '../components/PostCard'
import { useNetwork } from '../context/NetworkContext'

export function Saved() {
  const { savedIds, posts, members, loading, error, reload } = useNetwork()
  const saved = savedIds.map(id => posts.find(p => p.id === id)).filter((p): p is NonNullable<typeof p> => Boolean(p))
  return <main className="narrow-page">
    <div className="section-header"><small>YOUR PERSONAL ARCHIVE</small><h1>Publications sauvegardées</h1><p>Les fils que tu préfères conserver, même les pires.</p></div>
    {loading && <p role="status" className="notice">Chargement…</p>}
    {!loading && error && <div className="notice error" role="alert">{error} <button onClick={reload}>Réessayer</button></div>}
    {!loading && !error && (saved.length ? saved.map(post => <PostCard key={post.id} post={post} member={members.find(u => u.id === post.userId)} />) : <div className="notice">Aucun fil sauvegardé. <Link to="/">Explorer les discussions →</Link></div>)}
  </main>
}
