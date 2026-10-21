import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router'
import { useNetwork } from '../context/NetworkContext'
import type { Post } from '../types'

export function Create() {
  const { publish } = useNetwork()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [tag, setTag] = useState('social')
  const [userId, setUserId] = useState('1')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [created, setCreated] = useState<Post | null>(null)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    if (title.trim().length < 5) return setError('Le titre doit contenir au moins 5 caractères.')
    if (body.trim().length < 15) return setError('Le message doit contenir au moins 15 caractères.')
    if (!/^[a-z0-9-]{2,20}$/i.test(tag.trim())) return setError('La communauté doit contenir 2 à 20 lettres, chiffres ou tirets.')
    if (!Number.isInteger(Number(userId)) || Number(userId) < 1) return setError('Identifiant utilisateur invalide.')
    setSubmitting(true)
    try {
      const result = await publish({ title: title.trim(), body: body.trim(), tags: [tag.trim().toLowerCase()], userId: Number(userId) })
      setCreated(result)
    } catch (e) { setError(e instanceof Error ? e.message : 'Publication impossible.') }
    finally { setSubmitting(false) }
  }
  return <main className="narrow-page">
    <div className="section-header"><small>AFTERHOURS / COMPOSE</small><h1>Nouveau fil</h1><p>Publier, c’est facile. Assumer, c’est autre chose.</p></div>
    {created ? <div className="notice success" role="status"><h2>Publication envoyée</h2><p>« {created.title} » — ID #{created.id}</p><p>{created.body}</p><Link to={'/posts/' + created.id}>Voir la publication →</Link><button onClick={() => { setCreated(null); setTitle(''); setBody('') }}>Créer une autre publication</button><small>DummyJSON simule le POST : l’ajout n’est conservé que dans cette session.</small></div> :
    <form className="composer" onSubmit={submit} noValidate>
      <label>Titre du fil <span>*</span><input required minLength={5} maxLength={100} value={title} onChange={e => setTitle(e.target.value)} placeholder="Le sujet de ton message" /></label>
      <label>Message <span>*</span><textarea required minLength={15} rows={7} value={body} onChange={e => setBody(e.target.value)} placeholder="Qu'as-tu à dire ?" /></label>
      <div className="form-row">
        <label>Communauté <span>*</span><input required value={tag} maxLength={20} onChange={e => setTag(e.target.value)} /></label>
        <label>Identifiant utilisateur <span>*</span><input required type="number" min={1} value={userId} onChange={e => setUserId(e.target.value)} /></label>
      </div>
      {error && <p role="alert" className="notice error">{error}</p>}
      <button type="submit" className="primary" disabled={submitting}>{submitting ? 'Publication en cours…' : 'Publier le fil'}</button>
    </form>}
  </main>
}
