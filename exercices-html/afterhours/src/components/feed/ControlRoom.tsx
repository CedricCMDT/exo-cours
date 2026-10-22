import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import type { Post } from '../../types'

/**
 * RADAR FUTURISTE
 *
 * Cette page paraît complexe, mais elle repose sur trois opérations simples :
 * 1. map()    : transformer les publications en statistiques par communauté.
 * 2. sort()   : classer les sujets d'après leurs réactions.
 * 3. useState : retenir le numéro du sujet affiché.
 *
 * Les données viennent du forum déjà chargé, sans API supplémentaire.
 * Les chiffres décrivent uniquement la source choisie (API de démo ou archives).
 */

type RoomProps = {
  posts: Post[]
  onCommunity: (tag: string) => void
}

/** Une réaction négative ne prouve pas qu'un sujet est polémique.
 * Ce score sert uniquement à repérer les fils qui ont reçu des avis opposés.
 */
function disagreement(post: Post): number {
  const { likes, dislikes } = post.reactions
  const total = likes + dislikes

  // Éviter qu'un fil avec deux réactions soit présenté comme un grand débat.
  if (total < 12) return 0

  // Le minimum des deux groupes indique qu'il existe des réponses des deux côtés.
  return Math.min(likes, dislikes)
}

export function ControlRoom({ posts, onCommunity }: RoomProps) {
  const [channel, setChannel] = useState(0)

  // Les 12 catégories générant le plus de réactions : calculées, jamais codées en dur.
  const boards = useMemo(() => {
    // On déduit les communautés des tags de la source actuellement affichée.
    // Ainsi, ce sont les catégories DummyJSON en mode API, et les rubriques
    // françaises lorsque l'utilisateur passe volontairement aux archives.
    return [...new Set(posts.flatMap(post => post.tags))]
      .map(slug => {
        const belonging = posts.filter(post => post.tags.includes(slug))
        const reactions = belonging.reduce(
          (sum, post) => sum + post.reactions.likes + post.reactions.dislikes,
          0,
        )
        return { slug, label: slug, count: belonging.length, reactions }
      })
      .sort((a, b) => b.reactions - a.reactions)
      .slice(0, 12)
  }, [posts])

  // Un classement dérivé des likes/dislikes du jeu de données (archives fictives incluses).
  const debated = useMemo(() => {
    return [...posts]
      .filter(post => disagreement(post) > 0)
      .sort((a, b) => disagreement(b) - disagreement(a))
      .slice(0, 9)
  }, [posts])

  const maxActivity = Math.max(1, ...boards.map(board => board.reactions))
  const featured = debated.length ? debated[channel % debated.length] : undefined
  const negativeShare = featured
    ? Math.round(100 * featured.reactions.dislikes /
        Math.max(1, featured.reactions.likes + featured.reactions.dislikes))
    : 0

  return (
    <section className="control-room" aria-labelledby="control-room-title">
      <div className="room-intro">
        <div>
          <small>◆ MODULE / SIGNAL MATRIX / 01</small>
          <h2 id="control-room-title">LA <em>CHAMBRE D'ÉCHO.</em></h2>
        </div>
        <p>Les zones évoluent selon la source choisie : API DummyJSON ou archives fictives. Clique pour filtrer.</p>
      </div>

      <div className="room-grid">
        <article className="room-panel room-map">
          <div className="room-panel-heading">
            <div><span className="room-led" /> <strong>CARTOGRAPHIE DES DÉSACCORDS</strong></div>
            <small>SÉLECTIONNE UN CANAL</small>
          </div>

          {/* Chaque case est un vrai filtre. Plus la ligne est longue,
              plus cette communauté a cumulé de réactions dans l'archive. */}
          <div className="room-map-grid">
            {boards.map((board, index) => (
              <button
                key={board.slug}
                type="button"
                className={'room-board room-board-' + (index % 4)}
                onClick={() => onCommunity(board.slug)}
                title={'Afficher les publications de ' + board.label}
              >
                <span className="room-board-number">{String(index + 1).padStart(2, '0')}</span>
                <strong>/{board.slug}/</strong>
                <span className="room-board-count">{board.count} fils</span>
                <span className="room-board-meter" aria-hidden="true">
                  <span style={{ width: Math.max(4, Math.round(board.reactions / maxActivity * 100)) + '%' }} />
                </span>
              </button>
            ))}
          </div>
          <p className="room-explain">Longueur des barres = total de réactions enregistrées dans chaque communauté.</p>
        </article>

        <article className="room-panel room-radio">
          <div className="room-panel-heading">
            <div><span className="room-led room-led-pink" /> <strong>FRÉQUENCE CONFLICTUELLE</strong></div>
            <small>{debated.length ? String(channel % debated.length + 1).padStart(2, '0') + ' / ' + debated.length : '00 / 00'}</small>
          </div>

          {/* Les cercles, antennes et repères sont de simples formes CSS. */}
          <div className="room-disc" aria-hidden="true"><span>AH</span></div>

          {featured ? (
            <>
              <div className="room-radio-body" key={featured.id}>
                <small>/{featured.tags[0]}/ · {featured.reactions.likes + featured.reactions.dislikes} réactions</small>
                <h3>{featured.title}</h3>
                <p>{featured.body}</p>
              </div>
              <div className="room-opinions">
                <div className="room-opinions-labels">
                  <span>♥ {featured.reactions.likes}</span>
                  <span>↘ {negativeShare}% de réactions négatives</span>
                </div>
                <div className="room-opinions-bar" aria-label={negativeShare + '% de réactions négatives'}>
                  <span style={{ width: (100 - negativeShare) + '%' }} />
                </div>
              </div>
              <div className="room-radio-actions">
                <button type="button" onClick={() => setChannel(index => (index + 1) % debated.length)}>
                  DÉRÉGLER LE SIGNAL <span aria-hidden="true">↻</span>
                </button>
                <Link to={'/posts/' + featured.id}>VOIR L'INCIDENT ↗</Link>
              </div>
            </>
          ) : (
            <p className="room-radio-empty">Pas encore assez de réactions pour sélectionner un débat.</p>
          )}
        </article>
      </div>
      <p className="room-disclaimer">Archives fictives et contributions de la session · les statistiques sont calculées sur ces données, pas sur un réseau en direct.</p>
    </section>
  )
}
