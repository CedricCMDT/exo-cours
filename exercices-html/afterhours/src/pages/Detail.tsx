import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { Button } from '../components/ui/Button'
import { InputField, TextareaField } from '../components/ui/Fields'
import { Discussion } from '../components/discussion/Discussion'
import { useForum } from '../context/ForumContext'
import { useSession } from '../context/SessionContext'
import { usePreferences } from '../context/PreferencesContext'

/**
 * Page d'un sujet : aucune requête externe.
 * Les publications proviennent soit des archives fictives du projet,
 * soit de la mémoire du petit serveur local, soit de l'API DummyJSON.
 */
export function Detail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { posts, members } = useForum()
  const { loading, user, editPost, deletePost } = useSession()
  const { savedIds, toggleSaved } = usePreferences()
  const post = posts.find(item => String(item.id) === id)

  // Ces champs n'apparaissent que si l'utilisateur est l'auteur du sujet.
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [error, setError] = useState('')

  if (loading) return <main className="narrow-page"><p className="notice">Chargement du fil…</p></main>
  if (!post) return <main className="narrow-page"><div className="notice">
    <h1>Ce fil n'existe plus.</h1><Link to="/">Retour aux discussions →</Link>
  </div></main>

  const member = members.find(item => item.id === post.userId)
  const isOwner = Boolean(user && user.id === post.userId && post.local)
  const date = post.source === 'api'
    ? 'Jeu de données DummyJSON · date de publication non fournie'
    : post.createdAt
      ? new Date(post.createdAt).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })
      : 'Date inconnue'

  async function saveChanges(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!post) return
    try {
      await editPost(post.id, title, body)
      setEditing(false)
      setError('')
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Modification impossible.')
    }
  }

  async function remove() {
    if (!post || !window.confirm('Supprimer définitivement cette publication ?')) return
    try {
      await deletePost(post.id)
      navigate('/')
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Suppression impossible.')
    }
  }

  return <main className="narrow-page">
    <div className="breadcrumb"><Link to="/">← Retour au fil</Link> / sujet #{post.id}</div>
    <article className="detail-card">
      <small>AFTERHOURS / {post.source === 'api' ? 'DUMMYJSON / API' : post.source === 'community' ? 'ARCHIVE FICTIVE' : 'SESSION LOCALE'} #{post.id}</small>
      <h1>{post.title}</h1>
      <p className="byline">Publié par @{member?.username || 'anonymous_' + post.userId} · {date}</p>
      <div className="detail-body">{post.body}</div>

      {/* Les autorisations sont aussi vérifiées côté serveur, pas seulement ici. */}
      {isOwner && <div className="detail-owner-tools">
        <Button variant="secondary" onClick={() => {
          setTitle(post.title)
          setBody(post.body)
          setEditing(!editing)
          setError('')
        }}>{editing ? 'Annuler' : 'Modifier mon post'}</Button>
        <Button variant="danger" onClick={() => void remove()}>Supprimer mon post</Button>

        {editing && <form className="post-edit-form" onSubmit={saveChanges}>
          <InputField label="Titre" required minLength={5} maxLength={100} value={title} onChange={e => setTitle(e.target.value)} />
          <TextareaField label="Texte" required minLength={15} maxLength={10000} rows={6} value={body} onChange={e => setBody(e.target.value)} />
          <Button type="submit" variant="primary">Enregistrer</Button>
        </form>}
      </div>}
      {error && <p role="alert" className="notice error">{error}</p>}

      <dl className="stats">
        <div><dt>Likes</dt><dd>{post.reactions.likes}</dd></div>
        <div><dt>Dislikes</dt><dd>{post.reactions.dislikes}</dd></div>
        <div><dt>Lectures</dt><dd>{post.views}</dd></div>
        <div><dt>Communauté</dt><dd>/{post.tags[0] || 'random'}/</dd></div>
      </dl>

      <Button variant="primary" aria-pressed={savedIds.includes(post.id)} onClick={() => toggleSaved(post.id)}>
        {savedIds.includes(post.id) ? '★ Retirer des sauvegardes' : '☆ Sauvegarder ce fil'}
      </Button>
      <Discussion key={post.id} postId={post.id} post={post} />
    </article>
  </main>
}
