import { Link } from 'react-router'
import { PostCard } from '../components/feed/PostCard'
import { PageHeader } from '../components/ui/PageHeader'
import { usePreferences } from '../context/PreferencesContext'
import { useForum } from '../context/ForumContext'
import { useSession } from '../context/SessionContext'

export function Saved() {
  const { savedIds } = usePreferences()
  const { posts, members } = useForum()
  const { loading, error, reload } = useSession()
  const saved = savedIds.map(id => posts.find(p => p.id === id)).filter((p): p is NonNullable<typeof p> => Boolean(p))
  return <main className="narrow-page">
    <PageHeader eyebrow="FAVORIS / SESSION" title="Publications sauvegardées" description="Les discussions que tu veux retrouver." />
    {loading && <p role="status" className="notice">Chargement…</p>}
    {!loading && error && <div className="notice error" role="alert">{error} <button onClick={reload}>Réessayer</button></div>}
    {!loading && !error && (saved.length ? saved.map(post => <PostCard key={post.id} post={post} member={members.find(u => u.id === post.userId)} />) : <div className="notice">Aucun fil sauvegardé. <Link to="/">Explorer les discussions →</Link></div>)}
  </main>
}
