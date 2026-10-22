import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'
import { gsap } from 'gsap'
import { PostCard } from '../components/feed/PostCard'
import { ControlRoom } from '../components/feed/ControlRoom'
import { FictionAd, NewsWire } from '../components/experience/Experience'
import { ApiPlayground } from '../components/api/ApiPlayground'
import { useNetwork } from '../context/NetworkContext'
import { Button, ButtonLink } from '../components/ui/Button'
import { InputField, SelectField } from '../components/ui/Fields'
import { controversy, feedCategories, filterPosts, orderPosts, pageCount, selectSource as selectPostsBySource } from '../features/feed/selectors'
import type { FeedOrder, FeedSource } from '../features/feed/selectors'

// Présentation du flux : les règles de filtrage et de tri vivent dans features/feed/selectors.ts.
const PAGE_SIZE = 10

export function Feed() {
  const {
    posts: allPosts, members, replies, loading, error, reload, query,
    setCriteria, setPage, apiStatus, apiError, apiCounts, reloadApi,
  } = useNetwork()
  // Mode de départ = les données VRAIMENT récupérées depuis DummyJSON.
  // Les archives françaises sont accessibles mais ne remplacent plus l'API.
  const [source, setSource] = useState<FeedSource>('api')
  const activeSource = apiStatus === 'error' && source === 'api' ? 'archive' : source
  const posts = useMemo(() => selectPostsBySource(allPosts, activeSource), [allPosts, activeSource])

  function changeSource(next: FeedSource) {
    setSource(next)
    setCriteria({ tag: '', text: '', popularity: 'all' })
  }
  const root = useRef<HTMLElement>(null)
  const [order, setOrder] = useState<FeedOrder>('recent')
  const [focus, setFocus] = useState(0)

  // Les chiffres sont calculés sur les archives fictives + les vrais posts de la session.
  const reactions = useMemo(
    () => posts.reduce((total, p) => total + p.reactions.likes + p.reactions.dislikes, 0),
    [posts],
  )
  const boards = useMemo(() => feedCategories(posts), [posts])
  const headlines = useMemo(
    () => [...posts].sort((a, b) => controversy(b) - controversy(a)).slice(0, 8),
    [posts],
  )
  const selected = headlines[focus % Math.max(1, headlines.length)]

  const filtered = useMemo(() => filterPosts(posts, query), [posts, query])
  const sorted = useMemo(() => orderPosts(filtered, order), [filtered, order])
  const pages = pageCount(sorted.length, PAGE_SIZE)
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
        <Button onClick={reloadApi} disabled={apiStatus === 'loading'} variant="primary" size="sm">↻ ACTUALISER API</Button>
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
          <Button variant="ghost" size="sm" aria-pressed={source === 'api'} onClick={() => changeSource('api')}>API EN PRIORITÉ</Button>
          <Button variant="ghost" size="sm" aria-pressed={source === 'archive'} onClick={() => changeSource('archive')}>ARCHIVES FR</Button>
          <Button variant="ghost" size="sm" aria-pressed={source === 'all'} onClick={() => changeSource('all')}>TOUT AFFICHER</Button>
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
          <InputField label="RECHERCHER" type="search" value={query.text} onChange={event => setCriteria({ text: event.target.value })} placeholder="Une polémique, un pseudo, un sujet…" />
          <SelectField label="CATÉGORIE" value={query.tag} onChange={event => setCriteria({ tag: event.target.value })}><option value="">Toutes</option>{boards.map(board => <option value={board.slug} key={board.slug}>/{board.slug}/</option>)}</SelectField>
          <SelectField label="POPULARITÉ" value={query.popularity} onChange={event => setCriteria({ popularity: event.target.value })}><option value="all">Toutes</option><option value="popular">100+ likes</option><option value="quiet">Moins de 100</option></SelectField>
        </form>

        <div className="future-sort-tabs" role="group" aria-label="Trier les discussions">
          {([
            ['recent', 'LES DERNIERS'],
            ['clash', 'ÇA DIVISE'],
            ['popular', 'SURCHAUFFE'],
            ['ignored', 'LES OUBLIÉS'],
          ] as const).map(([id, label]) =>
            <Button key={id} variant="ghost" size="sm" aria-pressed={order === id} onClick={() => { setOrder(id); setPage(1) }}>{label}</Button>)}
        </div>

        {(loading || (apiStatus === 'loading' && source === 'api')) &&
          <p className="notice" role="status">Chargement des données API et du serveur local…</p>}
        {error && <p className="notice error" role="alert">{error} <Button variant="secondary" onClick={reload}>Réessayer</Button></p>}
        {!loading && !(apiStatus === 'loading' && source === 'api') && (visible.length
          ? visible.map(post => <PostCard key={post.id} post={post} member={members.find(member => member.id === post.userId)} />)
          : <div className="future-empty"><h3>RIEN DANS LE RADAR.</h3><p>Essaie une autre recherche ou retire un filtre.</p></div>)}

        <div className="pagination future-pages"><Button variant="secondary" disabled={page === 1} onClick={() => { setPage(page - 1); document.getElementById('feed-results')?.scrollIntoView() }}>← PRÉCÉDENT</Button><span>{page.toString().padStart(2, '0')} / {pages.toString().padStart(2, '0')}</span><Button variant="secondary" disabled={page === pages} onClick={() => { setPage(page + 1); document.getElementById('feed-results')?.scrollIntoView() }}>SUIVANT →</Button></div>
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
