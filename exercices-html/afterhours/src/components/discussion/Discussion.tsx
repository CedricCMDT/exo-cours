import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router'
import { Button } from '../ui/Button'
import { TextareaField } from '../ui/Fields'
import { useNetwork } from '../../context/NetworkContext'
import { archiveReplies } from '../../data/archiveReplies'
import type { Reply } from '../../types/reply'
import type { Post } from '../../types'

type ReplyFormProps = {
  postId: number
  parentId: string | null
  afterSend?: () => void
}

/**
 * Un seul formulaire pour répondre à un sujet ou à un commentaire.
 * Seul parentId change : null = réponse au sujet, ID = réponse imbriquée.
 */
function ReplyForm({ postId, parentId, afterSend }: ReplyFormProps) {
  const { addReply, user } = useNetwork()
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user || !text.trim() || busy) return

    setBusy(true)
    setError('')
    try {
      await addReply(postId, parentId, text.trim())
      setText('')
      afterSend?.()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Réponse impossible.')
    } finally {
      setBusy(false)
    }
  }

  return <form className="reply-form" onSubmit={submit}>
    {!user && <p>Pour participer, <Link to="/account">connecte-toi ou crée un compte</Link>.</p>}
    <TextareaField id={'reply-' + (parentId || 'root')} label="Ta réponse" rows={3} minLength={1} maxLength={2000} required value={text} onChange={event => setText(event.target.value)} placeholder="Écris une réponse…" />
    {error && <p role="alert" className="notice error">{error}</p>}
    <Button variant="primary" type="submit" disabled={!text.trim() || !user} loading={busy}>{busy ? 'Publication…' : 'Répondre'}</Button>
  </form>
}

type CommentProps = {
  comment: Reply
  all: Reply[]
  postId: number
  depth?: number
}

/**
 * Composant récursif : un commentaire affiche ses propres réponses.
 * La marge visuelle est limitée à 3 niveaux pour préserver la largeur mobile.
 */
function Comment({ comment, all, postId, depth = 0 }: CommentProps) {
  const { user, editReply, deleteReply } = useNetwork()
  const [responding, setResponding] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(comment.body)
  const [error, setError] = useState('')

  const children = all.filter(reply => reply.parentId === comment.id)
  // Le serveur vérifie aussi les droits : ce test masque seulement les boutons.
  const canEdit = Boolean(user && comment.userId === user.id)

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    try {
      await editReply(comment.id, draft.trim())
      setEditing(false)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Modification impossible.')
    }
  }

  async function remove() {
    if (!window.confirm('Supprimer ce commentaire ?')) return
    setError('')
    try {
      await deleteReply(comment.id)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Suppression impossible.')
    }
  }

  return <div className="reply-thread" style={{ marginLeft: Math.min(depth, 3) * 15 }}>
    <article className="reply-card">
      <div className="reply-card__meta">
        <strong>@{comment.author}</strong>
        {comment.automated && <span className="bot-marker">Compte automatisé</span>}
        {/* DummyJSON ne donne pas de date pour ses commentaires. */}
        {typeof comment.createdAt === 'number' && (
          <time dateTime={new Date(comment.createdAt).toISOString()}>
            {new Date(comment.createdAt).toLocaleString('fr-FR')}
          </time>
        )}
      </div>
      <p>{comment.body}</p>

      {canEdit && <div className="reply-card__actions">
        <Button variant="ghost" size="sm" onClick={() => {
          setDraft(comment.body)
          setEditing(value => !value)
        }}>{editing ? 'Annuler' : 'Modifier'}</Button>
        <Button variant="danger" size="sm" onClick={() => void remove()}>Supprimer</Button>
        {editing && <form className="reply-card__edit" onSubmit={save}>
          <textarea required value={draft} maxLength={2000} rows={3}
            onChange={event => setDraft(event.target.value)} />
          <Button variant="primary" size="sm" type="submit">Enregistrer</Button>
        </form>}
      </div>}

      {error && <p className="notice error" role="alert">{error}</p>}
      <Button variant="ghost" size="sm" aria-expanded={responding}
        onClick={() => setResponding(value => !value)}>
        {responding ? 'Annuler' : '↳ Répondre'}
      </Button>
      {responding && <ReplyForm postId={postId} parentId={comment.id}
        afterSend={() => setResponding(false)} />}
    </article>
    {children.map(reply => <Comment key={reply.id}
      comment={reply} all={all} postId={postId} depth={depth + 1} />)}
  </div>
}

/**
 * Une archive génère ses réponses de démonstration de manière déterministe.
 * Un post DummyJSON affiche au contraire les commentaires réellement reçus
 * dans GET /comments ; les créations utilisateur viennent du serveur local.
 */
export function Discussion({ postId, post }: { postId: number; post?: Post }) {
  const { replies } = useNetwork()
  const [visibleRoots, setVisibleRoots] = useState(12)
  const archive = useMemo(() => post ? archiveReplies(post) : [], [post])

  const all = useMemo(
    () => [...archive, ...replies.filter(reply => reply.postId === postId)],
    [archive, replies, postId],
  )

  const roots = useMemo(() => {
    const ids = new Set(all.map(reply => reply.id))
    return all.filter(reply => !reply.parentId || !ids.has(reply.parentId))
  }, [all])

  return <section className="discussion">
    <h2 className="discussion__title">
      Discussion <small>({all.length} réponse{all.length > 1 ? 's' : ''})</small>
    </h2>

    <ReplyForm postId={postId} parentId={null} />
    {roots.length === 0 && <p className="notice">Personne n'a encore répondu.</p>}

    {/* La pagination porte sur les conversations principales. */}
    {roots.slice(0, visibleRoots).map(reply =>
      <Comment key={reply.id} comment={reply} all={all} postId={postId} />)}

    {visibleRoots < roots.length && <Button variant="secondary" className="discussion-more"
      onClick={() => setVisibleRoots(value => value + 12)}>
      Afficher les discussions suivantes ({roots.length - visibleRoots} restantes) ↓
    </Button>}
  </section>
}
