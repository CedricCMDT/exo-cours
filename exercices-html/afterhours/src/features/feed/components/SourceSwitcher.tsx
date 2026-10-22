import { Button } from '../../../components/ui/Button'
import type { FeedSource } from '../selectors'

type SourceSwitcherProps = {
  source: FeedSource
  status: 'loading' | 'ready' | 'error'
  error: string
  counts: { posts: number; members: number; comments: number }
  onReload: () => void
  onSourceChange: (source: FeedSource) => void
}

/** Contrôle explicite des sources : API distante, archives fictives et session. */
export function SourceSwitcher({
  source,
  status,
  error,
  counts,
  onReload,
  onSourceChange,
}: SourceSwitcherProps) {
  const sources: { id: FeedSource; title: string }[] = [
    { id: 'api', title: 'API EN PRIORITÉ' },
    { id: 'archive', title: 'ARCHIVES FR' },
    { id: 'all', title: 'TOUT AFFICHER' },
  ]

  return (
    <section className="api-source-panel" aria-label="Source des données du forum">
      <div className="api-source-heading">
        <div>
          <strong>◆ API REST / DUMMYJSON</strong>
          <span>
            {status === 'loading'
              ? 'Connexion HTTP en cours…'
              : status === 'ready'
                ? 'Données reçues par 3 requêtes GET'
                : 'API distante indisponible'}
          </span>
        </div>
        <Button variant="primary" size="sm" onClick={onReload} disabled={status === 'loading'}>
          ↻ ACTUALISER API
        </Button>
      </div>

      <div className="api-endpoints">
        <code>GET /posts?limit=0</code>
        <code>GET /users?limit=0</code>
        <code>GET /comments?limit=0</code>
      </div>

      <div className="api-source-bottom">
        <div className="api-source-counts">
          <span>{counts.posts} posts API</span>
          <span>{counts.members} utilisateurs API</span>
          <span>{counts.comments} commentaires API</span>
        </div>
        <div className="api-source-buttons" role="group" aria-label="Choisir la source des publications">
          {sources.map((option) => (
            <Button
              key={option.id}
              variant="ghost"
              size="sm"
              aria-pressed={source === option.id}
              onClick={() => onSourceChange(option.id)}
            >
              {option.title}
            </Button>
          ))}
        </div>
      </div>

      {status === 'error' && (
        <p className="api-source-error" role="alert">
          Impossible de joindre DummyJSON : {error}. Les archives fictives restent disponibles.
        </p>
      )}
      {status === 'ready' && (
        <p className="api-source-note">
          DummyJSON fournit des textes anglais de démonstration. Les archives françaises sont fictives,
          et tes publications personnelles restent sur le serveur local.
        </p>
      )}
    </section>
  )
}
