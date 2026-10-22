import { useState } from 'react'
import { Link } from 'react-router'
import { Button, ButtonLink } from '../../../components/ui/Button'
import type { Post } from '../../../types'

type FeedHeroProps = {
  posts: Post[]
  headlines: Post[]
  reactions: number
}

/** Grande bannière : l'état du sujet en vedette appartient au composant. */
export function FeedHero({ posts, headlines, reactions }: FeedHeroProps) {
  const [focus, setFocus] = useState(0)
  const selected = headlines[focus % Math.max(1, headlines.length)]

  return (
    <section className="future-hero" aria-label="Accueil Afterhours">
          <div className="future-hero-decoration" aria-hidden="true"><span>AH</span><i/><i/><i/></div>
          <div className="future-hero-content">
            <p className="future-kicker"><span className="future-live-dot"/> / LE BRUIT NE S'ARRÊTE JAMAIS / FORUM LOCAL</p>
            <h1>INTERNET<br/><span>SANS</span> <em>FREIN.</em></h1>
            <p className="future-intro">Des avis tranchés, des discussions qui dérapent et beaucoup trop d'onglets ouverts. C'est un forum, pas une conférence de presse.</p>
            <div className="future-hero-actions">
              <ButtonLink to="/new" className="future-hero-publish" variant="primary">+ LANCER UN SUJET <b>↗</b></ButtonLink>
              <Button variant="ghost" onClick={() => setFocus(v => v + 1)}>↻ CHANGER DE DÉBAT</Button>
            </div>
            <div className="future-stats">
              <div><strong>{posts.length.toLocaleString('fr-FR')}</strong><small>THREADS AFFICHÉS</small></div>
              <div><strong>{new Set(posts.flatMap(post => post.tags)).size}</strong><small>CANAUX VISIBLES</small></div>
              <div><strong>{reactions.toLocaleString('fr-FR')}</strong><small>RÉACTIONS DES POSTS AFFICHÉS</small></div>
            </div>
          </div>
          <div className="future-hero-feature">
            <div className="future-feature-bar"><span>◆ CONTENTION / {String(focus % Math.max(1, headlines.length) + 1).padStart(2,'0')}</span><span>✳ SÉLECTION</span></div>
            {selected ? <>
              <span className="future-feature-tag">/{selected.tags[0]}/</span>
              <h2>{selected.title}</h2>
              <p>{selected.body}</p>
              <div className="future-feature-meter"><span style={{width: `${Math.round(selected.reactions.likes / Math.max(1,selected.reactions.likes + selected.reactions.dislikes)*100)}%`}}/></div>
              <div className="future-feature-foot"><span>♥ {selected.reactions.likes} / ↓ {selected.reactions.dislikes}</span><Link to={'/posts/' + selected.id}>ENTRER DANS LE FIL ↗</Link></div>
            </> : <p>Chargement des fils disponibles…</p>}
          </div>
          <span className="future-hero-vertical" aria-hidden="true">CONTENTS MAY CAUSE DISAGREEMENT // AH-26</span>
        </section>
  )
}
