import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router'
import { PageHeader } from '../components/ui/PageHeader'
import { useNetwork } from '../context/NetworkContext'

type AuthMode = 'login' | 'register'

/**
 * Compte temporaire : les formulaires appellent l'API locale.
 * L'API DummyJSON sert uniquement à afficher des auteurs de démonstration.
 */
export function Account() {
  const { user, login, register, logout, updateBio, posts, replies } = useNetwork()
  const [mode, setMode] = useState<AuthMode>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [bio, setBio] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => { setBio(user?.bio || '') }, [user?.id, user?.bio])

  // Ne montrer dans « mon compte » que les créations de la session.
  const myPosts = useMemo(
    () => posts.filter(post => post.local && post.userId === user?.id),
    [posts, user?.id],
  )
  const myReplies = useMemo(
    () => replies.filter(reply =>
      Boolean(user) &&
      reply.userId === user?.id),
    [replies, user],
  )

  async function authenticate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setBusy(true)

    try {
      if (mode === 'login') await login(username.trim(), password)
      else await register(username.trim(), password)
      setPassword('')
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Authentification impossible.')
    } finally {
      setBusy(false)
    }
  }

  async function saveBio(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    try {
      await updateBio(bio)
      setNotice('Biographie mise à jour.')
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Modification impossible.')
    }
  }

  async function signOut() {
    try {
      await logout()
      setNotice('')
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Déconnexion impossible.')
    }
  }

  return <main className="narrow-page">
    <PageHeader eyebrow="AFTERHOURS / ACCOUNT" title={user ? 'Mon profil' : 'Mon compte'} />

    {!user ? (
      <section className="composer" aria-label="Authentification">
        <div className="account-tabs" role="group" aria-label="Choix du formulaire">
          <button type="button" aria-pressed={mode === 'login'} onClick={() => { setMode('login'); setError('') }}>Connexion</button>
          <button type="button" aria-pressed={mode === 'register'} onClick={() => { setMode('register'); setError('') }}>Inscription</button>
        </div>

        <form onSubmit={authenticate}>
          <label>Pseudo
            <input required minLength={3} maxLength={24} autoComplete="username"
              value={username} onChange={event => setUsername(event.target.value)} />
          </label>
          <label>Mot de passe
            <input required type="password" minLength={8}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={password} onChange={event => setPassword(event.target.value)} />
          </label>
          {error && <p role="alert" className="notice error">{error}</p>}
          <button className="primary" type="submit" disabled={busy}>
            {busy ? 'Envoi…' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
          </button>
        </form>
      </section>
    ) : (
      <section className="composer account-profile">
        <div className="account-profile__identity">
          <h2>@{user.username}</h2>
          <small>Compte local · ID #{user.id} · effacé au redémarrage du serveur</small>
        </div>

        <form onSubmit={saveBio}>
          <label>Ma biographie
            <textarea maxLength={240} rows={3} value={bio}
              onChange={event => setBio(event.target.value)} />
          </label>
          <button type="submit" className="primary">Enregistrer le profil</button>
        </form>

        {notice && <p role="status" className="notice success">{notice}</p>}
        {error && <p role="alert" className="notice error">{error}</p>}
        <button type="button" className="account-profile__logout" onClick={() => void signOut()}>
          Se déconnecter
        </button>

        <section className="account-entries" aria-label="Mes publications">
          <h2>Mes publications <span>{myPosts.length}</span></h2>
          {myPosts.length === 0 ? <p>Tu n'as pas encore publié.</p> :
            myPosts.map(post =>
              <Link key={post.id} to={'/posts/' + post.id}>{post.title} ↗</Link>)}
        </section>

        <section className="account-entries" aria-label="Mes commentaires">
          <h2>Mes commentaires <span>{myReplies.length}</span></h2>
          {myReplies.length === 0 ? <p>Pas encore de réponse publiée.</p> :
            myReplies.map(reply =>
              <Link key={reply.id} to={'/posts/' + reply.postId}>
                {reply.body.slice(0, 140)} ↗
              </Link>)}
        </section>
      </section>
    )}
  </main>
}
