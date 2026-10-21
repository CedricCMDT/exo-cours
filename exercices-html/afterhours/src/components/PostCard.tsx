import { Link } from 'react-router'
import type { Member, Post } from '../types'
import { useNetwork } from '../context/NetworkContext'

export function PostCard({ post, member }: { post: Post; member?: Member }) {
  const { savedIds, toggleSaved } = useNetwork()
  const saved = savedIds.includes(post.id)
  return <article className="post-card">
    <div className="post-head">
      <img className="post-avatar" src={member?.image || '/avatar.svg'} alt={'Avatar de ' + (member?.username || 'Anonymous')} loading="lazy" />
      <div><strong>@{member?.username || 'anonymous_' + post.userId}</strong><small> · #{post.id} · /{post.tags[0] || 'random'}/</small></div>
      <span className="post-date">COMMUNITY</span>
    </div>
    <h3><Link to={'/posts/' + post.id}>{post.title}</Link></h3>
    <p>{post.body}</p>
    <div className="post-actions">
      <span>♡ {post.reactions?.likes ?? 0}</span><span>◌ {post.views ?? 0} vues</span>
      <button type="button" onClick={() => toggleSaved(post.id)} aria-pressed={saved}>
        {saved ? '★ Retirer' : '☆ Sauvegarder'}
      </button>
      <Link to={'/posts/' + post.id}>Voir le fil →</Link>
    </div>
  </article>
}
