import { useState } from 'react'
import { useNetwork } from '../context/NetworkContext'
import type { Reply } from '../replies'

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
      {pendingReplies.some(item => item.parentId === comment.id) &&
        <small className="typing">oldschool_bot écrit une réponse…</small>}
    </article>
    {children.map(child => <Comment key={child.id} comment={child} all={all} postId={postId} depth={depth + 1} />)}
  </div>
}
export function Discussion({ postId }: { postId: number }) {
  const { replies } = useNetwork()
  const all = replies.filter(comment => comment.postId === postId)
  const roots = all.filter(comment => !comment.parentId || !all.some(parent => parent.id === comment.parentId))
  return <section className="discussion">
    <h2>Discussion <small>({all.length} réponse{all.length > 1 ? 's' : ''})</small></h2>
    <ReplyForm postId={postId} parentId={null} />
    {roots.length === 0 && <p className="notice">Personne n'a encore répondu. Lance la discussion.</p>}
    {roots.map(comment => <Comment key={comment.id} comment={comment} all={all} postId={postId} />)}
  </section>
}
