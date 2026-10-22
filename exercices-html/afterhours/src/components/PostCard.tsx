import { Link } from 'react-router'
import type { Member, Post } from '../types'
import { useNetwork } from '../context/NetworkContext'
import { avatarFor } from '../avatar'

const formatDate = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
export function PostCard({ post, member }: { post: Post; member?: Member }) {
  const { savedIds, toggleSaved, replies } = useNetwork()
  const saved = savedIds.includes(post.id)
  const name = member?.username || 'anonymous_' + post.userId
  const date = post.createdAt ? formatDate.format(new Date(post.createdAt)) : 'Archive'
  const count = replies.filter(reply => reply.postId === post.id).length
  // Même carte pour les anciennes archives et les posts créés pendant la session.
  const likes = post.reactions?.likes ?? 0
  const dislikes = post.reactions?.dislikes ?? 0
  const votes = likes + dislikes
  const positiveShare = votes ? Math.round(likes / votes * 100) : 0
  return <article className="post-card feed-card">
    <div className="post-head">
      <img className="post-avatar" src={post.source === 'community' ? avatarFor(name) : member?.image || avatarFor(name)} alt={'Avatar de ' + name} loading="lazy" />
      <div className="post-identity">
        <strong>@{name}</strong>
        <small><span className="board-chip">/{post.tags[0] || 'random'}/</span> · #{post.id} · {post.source === 'community' ? 'Archive' : 'Session'}</small>
      </div>
      <time className="post-date" dateTime={post.createdAt || undefined}>{date}</time>
    </div>
    <h3><Link to={'/posts/' + post.id}>{post.title}</Link></h3>
    <p>{post.body}</p>
    {/* Une barre de réaction, purement visuelle : aucune valeur n'est inventée.
        Sa longueur correspond au pourcentage réel de likes enregistrés. */}
    {votes > 0 && <div className="post-votes" title={likes + ' likes et ' + dislikes + ' dislikes'}>
      <span style={{ width: positiveShare + '%' }} />
    </div>}
    <div className="post-actions">
      <span aria-label={likes + ' mentions j’aime'}>♥ {likes}</span>
      <span aria-label={dislikes + ' mentions je n’aime pas'}>↓ {dislikes}</span>
      <span>◌ {post.views ?? 0} vues</span>
      {(count > 0 || post.source === 'community') && <span>↳ {count + (post.source === 'community' ? 3 : 0)} réponses</span>}
      <button type="button" onClick={() => toggleSaved(post.id)} aria-pressed={saved}>
        {saved ? '★ Retirer' : '☆ Sauvegarder'}
      </button>
      <Link to={'/posts/' + post.id}>Ouvrir le fil <span aria-hidden="true">↗</span></Link>
    </div>
  </article>
}
