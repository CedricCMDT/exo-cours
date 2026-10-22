import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'
import { gsap } from 'gsap'
import { PostCard } from '../components/PostCard'
import { ControlRoom } from '../components/ControlRoom'
import { FictionAd, NewsWire } from '../components/Experience'
import { ApiPlayground } from '../components/ApiPlayground'
import { useNetwork } from '../context/NetworkContext'
import { communities } from '../data/community'

// L'accueil semble complexe, mais il se construit autour d'un seul tableau : posts.
const PAGE_SIZE = 10
type Order = 'recent' | 'clash' | 'ignored' | 'popular'

function controversy(likes: number, dislikes: number) {
  // Un débat reçoit des réactions des deux côtés, pas seulement beaucoup de likes.
  return Math.min(likes, dislikes)
}

export function Feed() {
  const {
    posts: allPosts, members, replies, loading, error, reload, query,
    setCriteria, setPage, apiStatus, apiError, apiCounts, reloadApi,
  } = useNetwork()
  // Mode de départ = les données VRAIMENT récupérées depuis DummyJSON.
  // Les archives françaises sont accessibles mais ne remplacent plus l'API.
  const [source, setSource] = useState<'api' | 'archive' | 'all'>('api')
  const activeSource = apiStatus === 'error' && source === 'api' ? 'archive' : source
  const posts = useMemo(() => allPosts.filter(post =>
    post.local ||
    (activeSource === 'all') ||
    (activeSource === 'api' && post.source === 'api') ||
    (activeSource === 'archive' && post.source === 'community'),
  ), [allPosts, activeSource])

  function selectSource(next: 'api' | 'archive' | 'all') {
    setSource(next)
    setCriteria({ tag: '', text: '', popularity: 'all' })
  }
  const root = useRef<HTMLElement>(null)
  const [order, setOrder] = useState<Order>('recent')
  const [focus, setFocus] = useState(0)

  // Les chiffres sont calculés sur les archives fictives + les vrais posts de la session.
  const reactions = useMemo(
    () => posts.reduce((total, p) => total + p.reactions.likes + p.reactions.dislikes, 0),
    [posts],
  )
  // Tags réels de l'API en mode API, catégories françaises en mode archives.
  const boards = useMemo(() => [...new Set(posts.flatMap(post => post.tags))]
    .map(slug => ({
      slug,
      label: communities.find(board => board.slug === slug)?.label || slug,
      count: posts.filter(post => post.tags.includes(slug)).length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 24), [posts])
  const headlines = useMemo(() => [...posts].sort((a, b) =>
    controversy(b.reactions.likes, b.reactions.dislikes) -
    controversy(a.reactions.likes, a.reactions.dislikes)).slice(0, 8), [posts])
  const selected = headlines[focus % Math.max(1, headlines.length)]

  const filtered = useMemo(() => posts.filter(post => {
    const phrase = (post.title + ' ' + post.body).toLocaleLowerCase('fr')
    const matchText = phrase.includes(query.text.toLocaleLowerCase('fr').trim())
    const matchTag = !query.tag || post.tags.includes(query.tag)
    const matchPopularity = query.popularity === 'all' ||
      (query.popularity === 'popular' ? post.reactions.likes >= 100 : post.reactions.likes < 100)
    return matchText && matchTag && matchPopularity
  }), [posts, query])

  // Array.sort modifie son tableau ; on le copie pour ne jamais modifier le contexte React.
  const sorted = useMemo(() => {
    const next = [...filtered]
    if (order === 'clash') return next.sort((a, b) =>
      controversy(b.reactions.likes, b.reactions.dislikes) -
      controversy(a.reactions.likes, a.reactions.dislikes))
    if (order === 'ignored') return next.sort((a, b) => a.views - b.views)
    if (order === 'popular') return next.sort((a, b) =>
      (b.reactions.likes + b.reactions.dislikes) - (a.reactions.likes + a.reactions.dislikes))
    return next.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
  }, [filtered, order])

  const pages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const page = Math.min(query.page, pages)
  const visible = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function exploreBoard(tag: string) {
    setCriteria({ tag })
    document.getElementById('feed-results')?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
  }

  // GSAP n'anime que des propriétés faciles à expliquer : opacité, position, échelle.
  useEffect(() => {
    if (!root.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const scene = gsap.context(() => {
      gsap.fromTo('.future-hero-content > *', { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: .9, stagger: .10, ease: 'power3.out', clearProps: 'all' })
      gsap.fromTo('.future-hero-feature', { opacity: 0, x: 60, rotate: 4 },
        { opacity: 1, x: 0, rotate: 0, duration: 1.15, ease: 'power3.out', clearProps: 'all' })
    }, root)
    return () => scene.revert()
  }, [])

  useEffect(() => {
    if (!root.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const scene = gsap.context(() => {
      gsap.fromTo('.post-card', { opacity: 0, y: 26, scale: .985 },
        { opacity: 1, y: 0, scale: 1, duration: .54, stagger: .055, ease: 'power2.out', clearProps: 'all' })
    }, root)
    return () => scene.revert()
  }, [page, order, query, loading])

  return <main className="feed-shell future-home" ref={root}>
    <NewsWire posts={posts} />

    {/* Ce bandeau prouve à l'oral que les contenus principaux viennent de l'API.
        Bouton « Actualiser » => nouveaux GET visibles dans F12 > Réseau. */}
    <section className="api-source-panel" aria-label="Source des données du forum">
      <div className="api-source-heading">
        <div><strong>◆ API REST / DUMMYJSON</strong>
          <span>{apiStatus === 'loading' ? 'Connexion HTTP en cours…' :
            apiStatus === 'ready' ? 'Données reçues par 3 requêtes GET' : 'API distante indisponible'}</span>
        </div>
        <button type="button" onClick={reloadApi} disabled={apiStatus === 'loading'}>↻ ACTUALISER API</button>
      </div>
      <div className="api-endpoints">
        <code>GET /posts?limit=0</code>
        <code>GET /users?limit=0</code>
        <code>GET /comments?limit=0</code>
      </div>
      <div className="api-source-bottom">
        <div className="api-source-counts">
          <span>{apiCounts.posts} posts API</span>
          <span>{apiCounts.members} utilisateurs API</span>
          <span>{apiCounts.comments} commentaires API</span>
        </div>
        <div className="api-source-buttons" role="group" aria-label="Choisir la source des publications">
          <button type="button" aria-pressed={source === 'api'} onClick={() => selectSource('api')}>API EN PRIORITÉ</button>
          <button type="button" aria-pressed={source === 'archive'} onClick={() => selectSource('archive')}>ARCHIVES FR</button>
          <button type="button" aria-pressed={source === 'all'} onClick={() => selectSource('all')}>TOUT AFFICHER</button>
        </div>
      </div>
      {apiStatus === 'error' && <p className="api-source-error">Impossible de joindre DummyJSON : {apiError}. Affichage de secours des archives fictives. Réessaie « Actualiser API ».</p>}
      {apiStatus === 'ready' && <p className="api-source-note">Les textes DummyJSON sont en anglais et proviennent d'un jeu de données de démonstration. Les archives françaises sont fictives ; tes propres publications restent locales.</p>}
    </section>

    <section className="future-hero" aria-label="Accueil Afterhours">
      <div className="future-hero-decoration" aria-hidden="true"><span>AH</span><i/><i/><i/></div>
      <div className="future-hero-content">
        <p className="future-kicker"><span className="future-live-dot"/> / LE BRUIT NE S'ARRÊTE JAMAIS / FORUM LOCAL</p>
        <h1>INTERNET<br/><span>SANS</span> <em>FREIN.</em></h1>
        <p className="future-intro">Des avis tranchés, des discussions qui dérapent et beaucoup trop d'onglets ouverts. C'est un forum, pas une conférence de presse.</p>
        <div className="future-hero-actions">
          <Link to="/new" className="future-hero-publish">+ LANCER UN SUJET <b>↗</b></Link>
          <button type="button" onClick={() => setFocus(v => v + 1)}>↻ CHANGER DE DÉBAT</button>
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

    <div className="future-data-strip" aria-label="Informations sur la démonstration">
      <span>◇ {activeSource === 'api' ? 'SOURCE : REST API DUMMYJSON' : activeSource === 'archive' ? 'SOURCE : ARCHIVES FICTIVES' : 'SOURCE : API + ARCHIVES'}</span><span>◆ ARCHIVES FICTIVES DISPONIBLES</span>
      <span>◇ MEMOIRE SERVEUR TEMPORAIRE</span><span>◆ PAS DE PUBLICITÉ RÉELLE</span>
    </div>

    {/* Le ControlRoom n'a pas sa propre source de données : il reçoit le même posts. */}
    <ControlRoom posts={posts} onCommunity={exploreBoard} />

    <div className="future-workspace">
      <aside className="future-left-rail" aria-label="Explorer le réseau">
        <div className="future-rail-caption"><span>01 / NAVIGATION</span><span>◈</span></div>
        <div className="future-rail-heading">LES ZONES</div>
        <div className="future-board-list">
          <button type="button" className={!query.tag ? 'active' : ''} onClick={() => exploreBoard('')}>
            <span>◉ Tout le réseau</span><b>{posts.length}</b>
          </button>
          {boards.map(board => <button
            type="button" className={query.tag === board.slug ? 'active' : ''}
            key={board.slug} onClick={() => exploreBoard(board.slug)}>
            <span>/{board.slug}/</span><b>{board.count}</b>
          </button>)}
        </div>
        <FictionAd number={0}/>
        <div className="future-side-note"><strong>◉ PAS DE FILTRE MORAL.</strong><p>Des opinions qui s'affrontent. Les archives de ce projet sont inventées.</p></div>
      </aside>

      <section className="future-feed-main" id="feed-results">
        <div className="future-feed-top">
          <p>02 / FLUX PRINCIPAL</p><span className="future-ping">◉ SESSION ACTIVE SUR CETTE MACHINE</span>
        </div>
        <div className="future-feed-title"><h2>LE <em>FIL.</em></h2><span>{sorted.length.toLocaleString('fr-FR')} THREADS FILTRÉS</span></div>

        <form className="filter-panel future-filter" onSubmit={event => event.preventDefault()}>
          <label>RECHERCHER<input type="search" value={query.text} onChange={event => setCriteria({ text: event.target.value })} placeholder="Une polémique, un pseudo, un sujet…" /></label>
          <label>CATÉGORIE<select value={query.tag} onChange={event => setCriteria({ tag: event.target.value })}><option value="">Toutes</option>{boards.map(board => <option value={board.slug} key={board.slug}>/{board.slug}/</option>)}</select></label>
          <label>POPULARITÉ<select value={query.popularity} onChange={event => setCriteria({ popularity: event.target.value })}><option value="all">Toutes</option><option value="popular">100+ likes</option><option value="quiet">Moins de 100</option></select></label>
        </form>

        <div className="future-sort-tabs" role="group" aria-label="Trier les discussions">
          {([
            ['recent', 'LES DERNIERS'],
            ['clash', 'ÇA DIVISE'],
            ['popular', 'SURCHAUFFE'],
            ['ignored', 'LES OUBLIÉS'],
          ] as const).map(([id, label]) =>
            <button key={id} type="button" aria-pressed={order === id} onClick={() => { setOrder(id); setPage(1) }}>{label}</button>)}
        </div>

        {(loading || (apiStatus === 'loading' && source === 'api')) &&
          <p className="notice" role="status">Chargement des données API et du serveur local…</p>}
        {error && <p className="notice error" role="alert">{error} <button type="button" onClick={reload}>Réessayer</button></p>}
        {!loading && !(apiStatus === 'loading' && source === 'api') && (visible.length
          ? visible.map(post => <PostCard key={post.id} post={post} member={members.find(member => member.id === post.userId)} />)
          : <div className="future-empty"><h3>RIEN DANS LE RADAR.</h3><p>Essaie une autre recherche ou retire un filtre.</p></div>)}

        <div className="pagination future-pages"><button type="button" disabled={page === 1} onClick={() => { setPage(page - 1); document.getElementById('feed-results')?.scrollIntoView() }}>← PRÉCÉDENT</button><span>{page.toString().padStart(2, '0')} / {pages.toString().padStart(2, '0')}</span><button type="button" disabled={page === pages} onClick={() => { setPage(page + 1); document.getElementById('feed-results')?.scrollIntoView() }}>SUIVANT →</button></div>
      </section>

      <aside className="future-right-rail" aria-label="Tendances et publicités fictives">
        <div className="future-rail-caption"><span>03 / SURCHARGE</span><span>▣</span></div>
        <div className="future-trend-card">
          <p>▲ RADAR DE CONTROVERSE</p>
          <h3>LES SUJETS QUI <em>CHAUFFENT.</em></h3>
          {headlines.slice(0, 5).map((post, index) => <Link key={post.id} to={'/posts/' + post.id}>
            <span>{String(index + 1).padStart(2,'0')}</span><strong>{post.title}</strong><small>↗</small>
          </Link>)}
        </div>
        <ApiPlayground />
        <FictionAd number={1}/>
        <div className="future-pulse-card">
          <span>◆ ANALYSE LOCALE</span><strong>{replies.filter(reply => !reply.id.startsWith('api-')).length}</strong><p>COMMENTAIRES CRÉÉS PENDANT CETTE SESSION</p>
          <div className="future-pulse-bars" aria-hidden="true">{[25,68,43,88,54,100,39,75,45,82,56,70].map((height,i)=><i key={i} style={{height:height+'%'}}/>)}</div>
        </div>
        <FictionAd number={2}/>
        <p className="future-rail-disclaimer">Toutes les publicités et les archives de démonstration sont fictives. Aucun annonceur externe.</p>
      </aside>
    </div>
  </main>
}
