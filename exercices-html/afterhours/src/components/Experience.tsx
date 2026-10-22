import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import type { Post } from '../types'

/**
 * Les « publicités » sont de la fiction.
 * Aucune régie, aucun pixel de suivi, aucun clic sortant.
 * Ce sont juste trois objets affichés avec map().
 */
const campaigns = [
  {
    brand: 'NOISE™',
    title: 'LE SILENCE EST UNE OPTION PAYANTE.',
    body: 'Coupe le bruit du monde. Ou augmente-le à 200 %.',
    action: 'Voir la simulation',
    code: '01',
    style: 'acid',
  },
  {
    brand: 'EGO++',
    title: 'TOUJOURS RAISON. MÊME QUAND NON.',
    body: 'L’abonnement imaginaire des experts en commentaire.',
    action: 'Tester le concept',
    code: '02',
    style: 'violet',
  },
  {
    brand: 'DATA / ME',
    title: 'TES DONNÉES VALENT PLUS QUE TON AVIS.',
    body: 'Heureusement, ici personne ne les achète.',
    action: 'Ouvrir la fiche',
    code: '03',
    style: 'orange',
  },
] as const

export function FictionAd({ number }: { number: 0 | 1 | 2 }) {
  const ad = campaigns[number]
  const [expanded, setExpanded] = useState(false)

  return <aside className={`future-ad future-ad-${ad.style}`} aria-label="Publicité fictive">
    <div className="future-ad-head">
      <span>PUBLICITÉ FICTIVE · {ad.code}</span><span>×××</span>
    </div>
    <div className="future-ad-brand">{ad.brand}</div>
    <h3>{ad.title}</h3>
    <p>{ad.body}</p>
    <button type="button" onClick={() => setExpanded(v => !v)}>
      {expanded ? 'Masquer le détail −' : ad.action + ' ↗'}
    </button>
    {expanded && <p className="future-ad-disclaimer">
      Projet de démonstration : aucune publicité commerciale, aucun achat, aucun suivi.
    </p>}
    <span className="future-ad-orbit" aria-hidden="true" />
  </aside>
}

/** La bande défilante n'utilise aucune API : elle tourne sur les vrais titres du forum. */
export function NewsWire({ posts }: { posts: Post[] }) {
  const items = posts.slice(0, 8)
  if (items.length === 0) return null

  return <div className="future-wire" aria-label="Titres du forum">
    <span className="future-wire-label">AH//FEED</span>
    <div className="future-wire-track">
      <div className="future-wire-scroll">
        {[...items, ...items].map((post, index) =>
          <Link key={post.id + '-' + index} to={'/posts/' + post.id}>
            <b>◆</b> {post.title}
          </Link>)}
      </div>
    </div>
    <span className="future-wire-end">ARCHIVES + SESSION</span>
  </div>
}

/**
 * Popup volontairement théâtrale, mais entièrement contrôlable :
 * - s'ouvre une seule fois par onglet ;
 * - bouton de fermeture évident, touche Échap ;
 * - le bouton « surprise » pointe vers un vrai sujet ;
 * - aucune publicité ne lance de lien externe.
 */
export function IntrusionLayer({ posts }: { posts: Post[] }) {
  const [open, setOpen] = useState(false)
  const [alerts, setAlerts] = useState([true, true])

  useEffect(() => {
    if (sessionStorage.getItem('ah-intro-seen') === '1') return
    // Même si l'utilisateur ne clique sur rien, la fenêtre arrive une fois.
    const timeout = window.setTimeout(() => setOpen(true), 2400)
    return () => window.clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (!open) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  function dismiss() {
    setOpen(false)
    sessionStorage.setItem('ah-intro-seen', '1')
  }

  return <>
    {/* Deux notifications de démonstration. Elles sont indépendantes et fermables. */}
    <div className="future-alert-stack" aria-label="Notifications de démonstration">
      {alerts[0] && <div className="future-alert future-alert-one">
        <span>◆ SYSTÈME / 001</span>
        <button type="button" aria-label="Fermer la première notification" onClick={() => setAlerts(a => [false, a[1]])}>×</button>
        <strong>PERSONNE N'EST NEUTRE.</strong>
        <small>Interface expérimentale · contenus fictifs.</small>
      </div>}
      {alerts[1] && <div className="future-alert future-alert-two">
        <span>▣ SIGNAL / 002</span>
        <button type="button" aria-label="Fermer la seconde notification" onClick={() => setAlerts(a => [a[0], false])}>×</button>
        <strong>LE FIL NE S'ARRÊTE PAS.</strong>
        <small>Tu peux toujours fermer cette notification.</small>
      </div>}
    </div>

    {open && <div className="future-overlay" onMouseDown={event => {
      if (event.target === event.currentTarget) dismiss()
    }}>
      <section className="future-modal" role="dialog" aria-modal="true" aria-labelledby="future-modal-title">
        <div className="future-modal-bar">
          <span>AFTERHOURS / INTERRUPTION CONTRÔLÉE</span>
          <button type="button" autoFocus onClick={dismiss} aria-label="Fermer la fenêtre">×</button>
        </div>
        <div className="future-modal-inner">
          <p>TRANSMISSION EXPÉRIMENTALE · 100 % LOCAL</p>
          <h2 id="future-modal-title">TU PENSAIS<br/><em>JUSTE REGARDER ?</em></h2>
          <span>Des sujets partout, des opinions contradictoires et une interface qui en fait beaucoup trop. Oui, c'est volontaire.</span>
          <div className="future-modal-actions">
            <button type="button" onClick={dismiss}>J'AI COMPRIS →</button>
            {posts[0] && <Link to={'/posts/' + posts[0].id} onClick={dismiss}>PLONGER DANS LE FIL ↗</Link>}
          </div>
          <small>Fenêtre fictive. Fermeture : bouton ×, clic à l'extérieur ou Échap.</small>
        </div>
      </section>
    </div>}
  </>
}
