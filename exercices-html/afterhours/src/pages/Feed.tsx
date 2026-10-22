import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'
import { gsap } from 'gsap'
import { useNetwork } from '../context/NetworkContext'
import { PostCard } from '../components/PostCard'
import { ControlRoom } from '../components/ControlRoom'
import { archives } from '../content'
import { communities } from '../data/community'

// 9 messages par page : navigation lisible sur ordinateur et sur mobile.
const SIZE = 9

type ViewMode = 'recent' | 'debate' | 'forgotten'
export function Feed() {
  const { posts, members, loading, error, reload, query, setCriteria, setPage } = useNetwork()
  const container = useRef<HTMLElement>(null)
  const [spotlightIndex, setSpotlightIndex] = useState(0)
  // Une seule variable pilote les trois façons d'explorer le même tableau de posts.
  const [viewMode, setViewMode] = useState<ViewMode>('recent')
  const debated = useMemo(() => [...posts].sort((a,b) => ((b.reactions?.likes||0)+(b.reactions?.dislikes||0)*3) - ((a.reactions?.likes||0)+(a.reactions?.dislikes||0)*3)).slice(0,8), [posts])
  const spotlight = debated[spotlightIndex % Math.max(1, debated.length)]
  const tags = useMemo(() => [...new Set(posts.flatMap(p => p.tags))].sort(), [posts])
  const filtered = useMemo(() => posts.filter(post => {
    const text = (post.title + ' ' + post.body).toLocaleLowerCase('fr')
    const matchText = text.includes(query.text.trim().toLocaleLowerCase('fr'))
    const matchTag = !query.tag || post.tags.includes(query.tag)
    const likes = post.reactions?.likes ?? 0
    const matchPopularity = query.popularity === 'all' || (query.popularity === 'popular' ? likes >= 100 : likes < 100)
    return matchText && matchTag && matchPopularity
  }), [posts, query.text, query.tag, query.popularity])
  // Aucun appel réseau pour les tris : filter() puis sort() sur les posts existants.
  const ordered = useMemo(() => {
    const result = [...filtered] // Copie : ne pas modifier le tableau d'origine.
    if (viewMode === 'debate') {
      // Plus les deux camps ont reçu de réactions, plus le sujet remonte.
      return result.sort((a, b) => Math.min(b.reactions.likes, b.reactions.dislikes) - Math.min(a.reactions.likes, a.reactions.dislikes))
    }
    if (viewMode === 'forgotten') {
      // Faire remonter les sujets peu consultés, même ceux qui viennent d'être créés.
      return result.sort((a, b) => (a.views - b.views) || (b.createdAt || '').localeCompare(a.createdAt || ''))
    }
    return result.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
  }, [filtered, viewMode])
  const pages = Math.max(1, Math.ceil(ordered.length / SIZE))
  const page = Math.min(query.page, pages)
  const visible = ordered.slice((page - 1) * SIZE, page * SIZE)
  const categoryStats = useMemo(() => communities.map(c => ({
    ...c, count: posts.filter(post => post.tags.includes(c.slug)).length,
  })).sort((a, b) => b.count - a.count), [posts])

  // Centraliser la navigation : carte et barre latérale ont le même comportement.
  function exploreCommunity(tag: string) {
    setCriteria({ tag })
    document.getElementById('feed-results')?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    })
  }

  useEffect(() => {
    if (!container.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const context = gsap.context(() => {
      gsap.fromTo('.hero-copy > *', { autoAlpha: 0, y: 20 }, {
        autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out', stagger: 0.09, clearProps: 'all',
      })
      gsap.fromTo('.hero-terminal', { autoAlpha: 0, x: 24, rotate: 2 }, {
        autoAlpha: 1, x: 0, rotate: 0, duration: 0.95, delay: 0.25, ease: 'power3.out', clearProps: 'all',
      })
    }, container)
    return () => context.revert()
  }, [])

  useEffect(() => {
    if (!container.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const context = gsap.context(() => {
      gsap.fromTo('.feed-card', { autoAlpha: 0, y: 28, scale: 0.987 }, {
        autoAlpha: 1, y: 0, scale: 1, duration: 0.62, stagger: 0.075,
        ease: 'power3.out', clearProps: 'all',
      })
    }, container)
    return () => context.revert()
  }, [page, query.text, query.tag, query.popularity, loading, posts, viewMode])

  return <main className="feed-shell" ref={container}>
    <section className="hero-banner" aria-label="Bienvenue sur Afterhours">
      <span className="hero-orb orb-a" aria-hidden="true" />
      <span className="hero-orb orb-b" aria-hidden="true" />
      <div className="hero-copy">
        <div className="eyebrow"><span className="pulse-light" /> LE WEB APRÈS MINUIT <span className="hero-year">EST. 2008</span></div>
        <h1>T'avais dit<br /><em>« cinq minutes ».</em></h1>
        <p>Un sujet, puis un autre. Tu lis les réponses, tu ouvres un onglet. Et te voilà encore ici.</p>
        <div className="hero-cta"><Link to="/new">Lancer un sujet ↗</Link><button type="button" onClick={() => setSpotlightIndex(v => v + 1)}>Sujet suivant ↻</button></div>
        <div className="hero-numbers"><div><strong>{posts.length.toLocaleString('fr-FR')}</strong><small>publications</small></div><div><strong>{communities.length}</strong><small>communautés</small></div><div><strong>{posts.filter(p => p.source === 'community').length.toLocaleString('fr-FR')}</strong><small>discussions FR</small></div></div>
      </div>
      <div className="hero-terminal">
        <div className="terminal-top"><span className="terminal-dots">● ● ●</span><span>afterhours / terminal</span><span>□ ×</span></div>
        <div className="terminal-screen"><small>LE SUJET QUI DIVISE</small>{spotlight ? <><p className="terminal-accent">/{spotlight.tags[0]}/ · {spotlight.reactions.likes} réactions positives</p><p className="terminal-headline">{spotlight.title}</p><Link className="terminal-link" to={'/posts/'+spotlight.id}>Lire le débat ↗</Link></> : <p>Des discussions arrivent…</p>}</div>
        <div className="terminal-sticker">ENCORE UN DÉBAT ↗</div>
      </div>
    </section>
    <ControlRoom posts={posts} onCommunity={exploreCommunity} />
    <div className="hot-strip"><span>ÇA FAIT PARLER</span><div>{debated.slice(0,4).map(p=><Link key={p.id} to={'/posts/'+p.id}>{p.title} ↗</Link>)}</div></div>
    <div className="layout">
      <section className="main-column">
        <div className="section-header feed-section-title"><div><small>COMMUNITY / TIMELINE</small><h2>Les discussions <span className="spark">✳</span></h2><p>De tout, surtout de n'importe quoi. Entre dans le fil.</p></div><span className="live-label"><span className="pulse-light" /> EN LOCAL</span></div>
        <form className="filter-panel" onSubmit={e => e.preventDefault()}>
          <label>Rechercher une publication<input type="search" placeholder="Un mot, une polémique…" value={query.text} onChange={e => setCriteria({ text: e.target.value })} /></label>
          <label>Communauté<select value={query.tag} onChange={e => setCriteria({ tag: e.target.value })}><option value="">Toutes les communautés</option>{tags.map(tag => <option key={tag} value={tag}>/{tag}/</option>)}</select></label>
          <label>Popularité<select value={query.popularity} onChange={e => setCriteria({ popularity: e.target.value })}><option value="all">Toutes</option><option value="popular">100 likes et +</option><option value="quiet">Moins de 100 likes</option></select></label>
        </form>
        <div className="feed-deck" role="group" aria-label="Choisir l'ordre du fil">
          <button type="button" aria-pressed={viewMode === 'recent'} onClick={() => { setViewMode('recent'); setPage(1) }}>↘ Les récents<small>Par date</small></button>
          <button type="button" aria-pressed={viewMode === 'debate'} onClick={() => { setViewMode('debate'); setPage(1) }}>↯ Ça divise<small>Réactions opposées</small></button>
          <button type="button" aria-pressed={viewMode === 'forgotten'} onClick={() => { setViewMode('forgotten'); setPage(1) }}>◌ Les oubliés<small>Peu de lectures</small></button>
        </div>
        <p className="feed-deck-description">{viewMode === 'recent' ? 'Les derniers messages et les archives, du plus récent au plus ancien.' : viewMode === 'debate' ? 'Les sujets qui ont reçu des réactions de plusieurs côtés.' : 'Des publications passées sous le radar, classées par nombre de lectures.'}</p>
        <div className="results" id="feed-results"><h2>Fil public <span className="results-line" /></h2><span>{ordered.length} publication(s) · page {page}/{pages}</span></div>
        {loading && <p role="status" className="notice">Chargement du forum…</p>}
        {!loading && error && <div className="notice error" role="alert">{error} <button type="button" onClick={reload}>Réessayer</button><span> Les archives du réseau restent disponibles.</span></div>}
        {!loading && (visible.length ? visible.map(post => <PostCard key={post.id} post={post} member={members.find(u => u.id === post.userId)} />) : <p className="notice">Aucun résultat. Même ici, ça arrive.</p>)}
        {!loading && <nav aria-label="Pagination" className="pagination"><button disabled={page === 1} onClick={() => setPage(page - 1)}>← Précédent</button><span>Page {page} sur {pages}</span><button disabled={page === pages} onClick={() => setPage(page + 1)}>Suivant →</button></nav>}
      </section>
      <aside className="sidebar">
        <div className="widget community-widget"><h2>EXPLORER LES COMMUNAUTÉS</h2><div className="community-list">{categoryStats.map(item => <button type="button" key={item.slug} onClick={() => exploreCommunity(item.slug)} className={query.tag === item.slug ? 'chosen' : ''}><span>/{item.slug}/</span><b>{item.count}</b></button>)}</div></div>
        <div className="widget status-widget"><h2>STATUT DU RÉSEAU</h2><p><span className="online">●</span> Forum local en ligne</p><p>Archives fictives du Web · session locale</p><small>Nous ne garantissons ni le bon goût ni la véracité des opinions.</small></div>
        <div className="widget"><h2>ARCHIVES DU WEB</h2><p className="widget-note">Discussions populaires</p>{archives.map(item => <div className="archive" key={item.author}><small>{item.author} · {item.board}</small><p>{item.text}</p><small>↳ {item.replies} réponses</small></div>)}</div>
      </aside>
    </div>
  </main>
}
