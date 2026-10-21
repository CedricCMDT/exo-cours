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
  return <article className="post-card feed-card">
    <div className="post-head">
      <img className="post-avatar" src={post.source === 'community' ? avatarFor(name) : member?.image || avatarFor(name)} alt={'Avatar de ' + name} loading="lazy" />
      <div className="post-identity">
        <strong>@{name}</strong>
        <small><span className="board-chip">/{post.tags[0] || 'random'}/</span> · #{post.id}</small>
      </div>
      <time className="post-date" dateTime={post.createdAt || undefined}>{date}</time>
    </div>
    <h3><Link to={'/posts/' + post.id}>{post.title}</Link></h3>
    <p>{post.body}</p>
    <div className="post-actions">
      <span aria-label={post.reactions?.likes + ' mentions j’aime'}>♥ {post.reactions?.likes ?? 0}</span>
      <span>◌ {post.views ?? 0} vues</span>
      {(count > 0 || post.source === 'community') && <span>↳ {count + (post.source === 'community' ? 3 : 0)} réponses</span>}
      <button type="button" onClick={() => toggleSaved(post.id)} aria-pressed={saved}>
        {saved ? '★ Retirer' : '☆ Sauvegarder'}
      </button>
      <Link to={'/posts/' + post.id}>Ouvrir le fil <span aria-hidden="true">↗</span></Link>
    </div>
  </article>
}
