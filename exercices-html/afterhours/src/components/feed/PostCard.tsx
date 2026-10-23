import { Link } from 'react-router'
import { Button } from '../ui/Button'
import type { Member, Post } from '../../types'
import { usePreferences } from '../../context/PreferencesContext'
import { useForum } from '../../context/ForumContext'
import { avatarFor } from '../../utils/avatar'
import { archiveReplyCount } from '../../data/archiveReplies'

// Instance mutualisée pour éviter de recréer un formateur à chaque publication.
const formatDate = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
export function PostCard({ post, member }: { post: Post; member?: Member }) {
  const { savedIds, toggleSaved } = usePreferences()
  const { replies } = useForum()
  const saved = savedIds.includes(post.id)
  const name = member?.username || 'anonymous_' + post.userId
  const date = post.source === 'api'
    ? 'Données DummyJSON'
    : post.createdAt ? formatDate.format(new Date(post.createdAt)) : 'Session'
  // Le total associe les réponses du catalogue et les commentaires chargés
  // depuis les services, sans ajouter de valeur de présentation arbitraire.
  const count = archiveReplyCount(post) + replies.filter(reply => reply.postId === post.id).length
  // La même carte présente les ressources externes, intégrées et locales.
  const likes = post.reactions?.likes ?? 0
  const dislikes = post.reactions?.dislikes ?? 0
  const votes = likes + dislikes
  const positiveShare = votes ? Math.round(likes / votes * 100) : 0
  return <article className="post-card feed-card">
    <div className="post-head">
      <img className="post-avatar" src={post.source === 'community' ? avatarFor(name) : member?.image || avatarFor(name)} alt={'Avatar de ' + name} loading="lazy" />
      <div className="post-identity">
        <strong>@{name}</strong>
        <small><span className="board-chip">/{post.tags[0] || 'random'}/</span> · #{post.id} · {post.source === 'api' ? 'API REST' : post.source === 'community' ? 'Archive fictive' : 'Session locale'}</small>
      </div>
      <time className="post-date" dateTime={post.createdAt || undefined}>{date}</time>
    </div>
    <h3><Link to={'/posts/' + post.id}>{post.title}</Link></h3>
    <p>{post.body}</p>
    {/* La largeur de la barre représente la part des réactions positives
        dans les données de la publication affichée. */}
    {votes > 0 && <div className="post-votes" title={likes + ' likes et ' + dislikes + ' dislikes'}>
      <span style={{ width: positiveShare + '%' }} />
    </div>}
    <div className="post-actions">
      <span aria-label={likes + ' mentions j’aime'}>♥ {likes}</span>
      <span aria-label={dislikes + ' mentions je n’aime pas'}>↓ {dislikes}</span>
      <span>◌ {post.views ?? 0} vues</span>
      {count > 0 && <span>↳ {count} réponses</span>}
      <Button variant="ghost" size="sm" onClick={() => toggleSaved(post.id)} aria-pressed={saved}>
        {saved ? '★ Retirer' : '☆ Sauvegarder'}
      </Button>
      <Link to={'/posts/' + post.id}>Ouvrir le fil <span aria-hidden="true">↗</span></Link>
    </div>
  </article>
}
