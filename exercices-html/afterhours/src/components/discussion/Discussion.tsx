import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { useNetwork } from '../../context/NetworkContext'
import type { Reply } from '../../types/reply'
import type { Post } from '../../types'
import { archiveReplies } from '../../data/archiveReplies'

// Les réponses fictives sont désormais calculées par archiveReplies() :
// le total varie de 0 à plus de 150 suivant le sujet, jamais 3 systématiquement.
// Les commentaires des posts API viennent, eux, de GET /comments?limit=0.
// Cette page ne génère les archives que lorsqu'on ouvre une discussion.

function ReplyForm({ postId, parentId, afterSend }: {
  postId: number
  parentId: string | null
  afterSend?: () => void
}) {
  const { addReply, user } = useNetwork()
  const [error,setError] = useState('')
  const [text, setText] = useState('')
  return <form className="reply-form" onSubmit={event => {
    event.preventDefault()
    if (!text.trim()) return
    void addReply(postId, parentId, text).then(()=>{setText('');setError('');afterSend?.()}).catch(e=>setError(String(e)))
  }}>
    {!user && <p>Pour participer : <Link to="/account">connecte-toi ou crée un compte</Link>.</p>}
    <label htmlFor={'reply-' + (parentId || 'root')}>Votre réponse</label>
    <textarea id={'reply-' + (parentId || 'root')} rows={3} minLength={1} maxLength={2000} required
      placeholder="Écrire une réponse…" value={text} onChange={e => setText(e.target.value)} />
    {error&&<p role="alert">{error}</p>}<button type="submit" className="primary" disabled={!text.trim()||!user}>Répondre</button>
  </form>
}
function Comment({ comment, all, postId, depth = 0 }: {
  comment: Reply
  all: Reply[]
  postId: number
  depth?: number
}) {
  const [responding, setResponding] = useState(false)
  const { user, editReply, deleteReply } = useNetwork()
  const [editing,setEditing]=useState(false)
  const [newBody,setNewBody]=useState(comment.body)
  const children = all.filter(item => item.parentId === comment.id)
  return <div className="reply-thread" style={{ marginLeft: Math.min(depth, 3) * 15 }}>
    <article className="reply-card">
      <header><strong>@{comment.author}</strong>
        {comment.automated && <span className="bot-marker">Compte automatisé</span>}
        {/* L'API DummyJSON ne fournit pas de date : on évite d'en inventer. */}
        {typeof comment.createdAt === 'number' &&
          <time dateTime={new Date(comment.createdAt).toISOString()}>
            {new Date(comment.createdAt).toLocaleString('fr-FR')}
          </time>}
      </header>
      <p>{comment.body}</p>
      {user?.username===comment.author && !comment.id.startsWith('archive-') && !comment.id.startsWith('api-') && <div><button onClick={()=>{setNewBody(comment.body);setEditing(!editing)}}>Modifier</button><button onClick={()=>{if(window.confirm('Supprimer ce commentaire ?'))void deleteReply(comment.id)}}>Supprimer</button>{editing&&<form onSubmit={e=>{e.preventDefault();void editReply(comment.id,newBody).then(()=>setEditing(false))}}><textarea value={newBody} maxLength={2000} onChange={e=>setNewBody(e.target.value)}/><button>Enregistrer</button></form>}</div>}
      <button type="button" onClick={() => setResponding(v => !v)}>{responding ? 'Annuler' : '↳ Répondre'}</button>
      {responding && <ReplyForm postId={postId} parentId={comment.id} afterSend={() => setResponding(false)} />}

    </article>
    {children.map(child => <Comment key={child.id} comment={child} all={all} postId={postId} depth={depth + 1} />)}
  </div>
}
export function Discussion({ postId, post }: { postId: number; post?: Post }) {
  const { replies } = useNetwork()
  const [visibleRoots, setVisibleRoots] = useState(12)

  // Les archives se créent une seule fois par sujet ouvert.
  const archive = useMemo(() => post ? archiveReplies(post) : [], [post])
  const all = useMemo(
    () => [...archive, ...replies.filter(comment => comment.postId === postId)],
    [archive, replies, postId],
  )
  // Une réponse « racine » n'est liée à aucun commentaire précédent.
  const roots = useMemo(
    () => all.filter(comment => !comment.parentId || !all.some(parent => parent.id === comment.parentId)),
    [all],
  )

  return <section className="discussion">
    <h2>Discussion <small>({all.length} réponse{all.length > 1 ? 's' : ''})</small></h2>
    <ReplyForm postId={postId} parentId={null} />
    {roots.length === 0 && <p className="notice">Personne n'a encore répondu. Lance la discussion.</p>}

    {/* Afficher 12 conversations au départ évite de charger une page de 150 blocs.
        Les réponses imbriquées sous chaque conversation restent visibles. */}
    {roots.slice(0, visibleRoots).map(comment =>
      <Comment key={comment.id} comment={comment} all={all} postId={postId} />)}

    {visibleRoots < roots.length && <button
      type="button"
      className="discussion-more"
      onClick={() => setVisibleRoots(current => current + 12)}
    >
      Afficher les discussions suivantes ({roots.length - visibleRoots} restantes) ↓
    </button>}
  </section>
}
