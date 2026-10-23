import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'
import { gsap } from 'gsap'
import { PostCard } from '../components/feed/PostCard'
import { ControlRoom } from '../components/feed/ControlRoom'
import { FictionAd, NewsWire } from '../components/experience/Experience'
import { ApiPlayground } from '../components/api/ApiPlayground'
import { useNetwork } from '../context/NetworkContext'
import { Button } from '../components/ui/Button'
import { SourceSwitcher } from '../features/feed/components/SourceSwitcher'
import { FeedControls } from '../features/feed/components/FeedControls'
import { FeedHero } from '../features/feed/components/FeedHero'
import { controversy, feedCategories, filterPosts, orderPosts, pageCount, selectSource as selectPostsBySource } from '../features/feed/selectors'
import type { FeedOrder, FeedSource } from '../features/feed/selectors'

/**
 * Page d'assemblage du catalogue.
 * Les sélecteurs de `features/feed` portent la logique de tri et filtrage ;
 * les composants FeedHero, FeedControls et SourceSwitcher portent l'affichage.
 */
const PAGE_SIZE = 10

export function Feed() {
  const {
    posts: allPosts, members, replies, loading, error, reload, query,
    setCriteria, setPage, apiStatus, apiError, apiCounts, reloadApi,
  } = useNetwork()
  // Le flux utilise l'API distante par défaut et sélectionne le catalogue
  // local en secours si le chargement distant échoue.
  const [source, setSource] = useState<FeedSource>('api')
  const activeSource = apiStatus === 'error' && source === 'api' ? 'archive' : source
  const posts = useMemo(() => selectPostsBySource(allPosts, activeSource), [allPosts, activeSource])

  function changeSource(next: FeedSource) {
    setSource(next)
    setCriteria({ tag: '', text: '', popularity: 'all' })
  }
  const root = useRef<HTMLElement>(null)
  const [order, setOrder] = useState<FeedOrder>('recent')

  // Les indicateurs sont calculés à partir de la sélection en cours :
  // ils sont donc recalculés lors d'un changement de source.
  const reactions = useMemo(
    () => posts.reduce((total, p) => total + p.reactions.likes + p.reactions.dislikes, 0),
    [posts],
  )
  const boards = useMemo(() => feedCategories(posts), [posts])
  const headlines = useMemo(
    () => [...posts].sort((a, b) => controversy(b) - controversy(a)).slice(0, 8),
    [posts],
  )

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

  // Le contexte GSAP regroupe les animations de cette page et permet
  // leur nettoyage lorsque le composant n'est plus affiché.
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

    <SourceSwitcher
      source={source}
      status={apiStatus}
      error={apiError}
      counts={apiCounts}
      onReload={reloadApi}
      onSourceChange={changeSource}
    />

    <FeedHero posts={posts} headlines={headlines} reactions={reactions} />

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

        <FeedControls
          query={query}
          order={order}
          categories={boards}
          onCriteriaChange={setCriteria}
          onOrderChange={(next) => { setOrder(next); setPage(1) }}
        />

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
