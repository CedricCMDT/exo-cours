import { useState } from 'react'
import { useNetwork } from '../context/NetworkContext'
import type { Reply } from '../replies'
import type { Post } from '../types'
import { communityMembers } from '../data/community'

function historicalReplies(post: Post): Reply[] {
  if (post.source !== 'community') return []
  const start = new Date(post.createdAt || '2026-10-20T00:00:00Z').getTime()
  const names = communityMembers
  const topic = post.title.replace(/^(Opinion impopulaire : |Retour de terrain — |Avocat du diable : |Encore une polémique : )/, '')
  const answers = [
    `J'ai vu passer le même débat à propos de « ${topic} ». Tout le monde prend position, mais on connaît à peine le contexte. Sérieusement, ça fatigue.`,
    `Vous êtes marrants. On demande un avis, et la moitié du fil répond à une phrase que personne n'a écrite. Relisez le message avant de partir au quart de tour.`,
    `Je suis plutôt d'accord sur le fond, mais il faut nuancer. Si quelqu'un a un témoignage concret plutôt qu'un slogan, je prends.`,
    `Oh putain, les commentaires ont déjà tourné au concours de certitudes. Ça n'aura vraiment pas pris longtemps.`,
    `Je ne suis pas convaincu. On dirait que chacun invente la partie de l'histoire qui lui manque. On peut revenir aux faits ?`,
    `Le sujet mérite mieux que ça. Vous confondez une anecdote avec une règle générale et après vous vous étonnez de vous engueuler.`,
  ]
  const first = (post.id * 7) % answers.length
  const second = (post.id * 11 + 3) % answers.length
  return [
    { id: `archive-${post.id}-a`, postId: post.id, parentId: null, author: names[(post.id * 3) % names.length].username, body: answers[first], createdAt: start + 22 * 60000, automated: false },
    { id: `archive-${post.id}-b`, postId: post.id, parentId: null, author: names[(post.id * 5 + 7) % names.length].username, body: answers[(first + 2) % answers.length], createdAt: start + 47 * 60000, automated: false },
    { id: `archive-${post.id}-c`, postId: post.id, parentId: `archive-${post.id}-a`, author: names[(post.id * 13 + 11) % names.length].username, body: answers[second], createdAt: start + 61 * 60000, automated: false },
  ]
}

function ReplyForm({ postId, parentId, afterSend }: {
  postId: number
  parentId: string | null
  afterSend?: () => void
}) {
  const { addReply } = useNetwork()
  const [text, setText] = useState('')
  return <form className="reply-form" onSubmit={event => {
    event.preventDefault()
    if (!text.trim()) return
    addReply(postId, parentId, text)
    setText('')
    afterSend?.()
  }}>
    <label htmlFor={'reply-' + (parentId || 'root')}>Votre réponse</label>
    <textarea id={'reply-' + (parentId || 'root')} rows={3} minLength={1} maxLength={2000} required
      placeholder="Écrire une réponse…" value={text} onChange={e => setText(e.target.value)} />
    <button type="submit" className="primary" disabled={!text.trim()}>Répondre</button>
  </form>
}
function Comment({ comment, all, postId, depth = 0 }: {
  comment: Reply
  all: Reply[]
  postId: number
  depth?: number
}) {
  const [responding, setResponding] = useState(false)
  const { pendingReplies } = useNetwork()
  const children = all.filter(item => item.parentId === comment.id)
  return <div className="reply-thread" style={{ marginLeft: Math.min(depth, 3) * 15 }}>
    <article className="reply-card">
      <header><strong>@{comment.author}</strong>
        {comment.automated && <span className="bot-marker">Compte automatisé</span>}
        <time dateTime={new Date(comment.createdAt).toISOString()}>{new Date(comment.createdAt).toLocaleString('fr-FR')}</time>
      </header>
      <p>{comment.body}</p>
      <button type="button" onClick={() => setResponding(v => !v)}>{responding ? 'Annuler' : '↳ Répondre'}</button>
      {responding && <ReplyForm postId={postId} parentId={comment.id} afterSend={() => setResponding(false)} />}
      {pendingReplies.filter(item => item.parentId === comment.id).map(item =>
        <small key={item.id} className="typing">{item.author ?? 'Un membre'} prépare une réponse…</small>)}
    </article>
    {children.map(child => <Comment key={child.id} comment={child} all={all} postId={postId} depth={depth + 1} />)}
  </div>
}
export function Discussion({ postId, post }: { postId: number; post?: Post }) {
  const { replies } = useNetwork()
  const all = [ ...(post ? historicalReplies(post) : []), ...replies.filter(comment => comment.postId === postId) ]
  const roots = all.filter(comment => !comment.parentId || !all.some(parent => parent.id === comment.parentId))
  return <section className="discussion">
    <h2>Discussion <small>({all.length} réponse{all.length > 1 ? 's' : ''})</small></h2>
    <ReplyForm postId={postId} parentId={null} />
    {roots.length === 0 && <p className="notice">Personne n'a encore répondu. Lance la discussion.</p>}
    {roots.map(comment => <Comment key={comment.id} comment={comment} all={all} postId={postId} />)}
  </section>
}
