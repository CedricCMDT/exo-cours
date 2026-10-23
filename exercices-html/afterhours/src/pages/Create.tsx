import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { InputField, TextareaField } from '../components/ui/Fields'
import { useSession } from '../context/SessionContext'
import type { Post } from '../types'

/**
 * Formulaire de publication vers /session-api/posts.
 * Le serveur déduit l'auteur du cookie de connexion : aucun userId
 * n'est fourni par le navigateur.
 */
export function Create() {
  const { publish, user } = useSession()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [tag, setTag] = useState('social')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [created, setCreated] = useState<Post | null>(null)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (title.trim().length < 5) {
      setError('Le titre doit contenir au moins 5 caractères.')
      return
    }
    if (body.trim().length < 15) {
      setError('Le message doit contenir au moins 15 caractères.')
      return
    }
    if (!/^[a-z0-9-]{2,20}$/i.test(tag.trim())) {
      setError('La communauté doit contenir 2 à 20 lettres, chiffres ou tirets.')
      return
    }
    if (!user) {
      setError('Connecte-toi pour publier.')
      return
    }

    setSubmitting(true)
    try {
      // La même validation est réalisée côté serveur (ne jamais se fier au client).
      const post = await publish({
        title: title.trim(),
        body: body.trim(),
        tags: [tag.trim().toLowerCase()],
      })
      setCreated(post)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Publication impossible.')
    } finally {
      setSubmitting(false)
    }
  }

  function resetForm() {
    setTitle('')
    setBody('')
    setError('')
    setCreated(null)
  }

  return <main className="narrow-page">
    <PageHeader
      eyebrow="AFTERHOURS / COMPOSE"
      title="Nouveau fil"
      description="Écris dans ta communauté et retrouve ton post pendant cette session."
    />

    {created ? (
      <section className="notice success" role="status">
        <h2>Publication envoyée</h2>
        <p>« {created.title} » — ID #{created.id}</p>
        <p>{created.body}</p>
        <Link to={'/posts/' + created.id}>Voir la publication ↗</Link>
        <Button variant="secondary" onClick={resetForm}>Créer un autre sujet</Button>
        <small>Ce contenu sera effacé au redémarrage du serveur.</small>
      </section>
    ) : !user ? (
      <div className="notice">
        Connecte-toi pour publier. <Link to="/account">Connexion / inscription ↗</Link>
      </div>
    ) : (
      <form className="composer" onSubmit={submit} noValidate>
        <InputField label="Titre du fil" required minLength={5} maxLength={100} value={title} onChange={event => setTitle(event.target.value)} placeholder="De quoi veux-tu parler ?" />
        <TextareaField label="Message" required minLength={15} rows={7} value={body} onChange={event => setBody(event.target.value)} placeholder="Écris ton message…" />
        <InputField label="Communauté" required maxLength={20} value={tag} onChange={event => setTag(event.target.value)} placeholder="social, tech, gaming…" />
        {error && <p role="alert" className="notice error">{error}</p>}
        <Button variant="primary" type="submit" loading={submitting}>
          {submitting ? 'Publication en cours…' : 'Publier le fil'}
        </Button>
      </form>
    )}
  </main>
}
