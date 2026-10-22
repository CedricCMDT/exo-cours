import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'
import { gsap } from 'gsap'
import { useNetwork } from '../context/NetworkContext'
import { PostCard } from '../components/PostCard'
import { archives } from '../content'
import { communities } from '../data/community'

const SIZE = 9
export function Feed() {
  const { posts, members, loading, error, reload, query, setCriteria, setPage } = useNetwork()
  const container = useRef<HTMLElement>(null)
  const [spotlightIndex, setSpotlightIndex] = useState(0)
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
  const pages = Math.max(1, Math.ceil(filtered.length / SIZE))
  const page = Math.min(query.page, pages)
  const visible = filtered.slice((page - 1) * SIZE, page * SIZE)
  const categoryStats = useMemo(() => communities.map(c => ({
    ...c, count: posts.filter(post => post.tags.includes(c.slug)).length,
  })).sort((a, b) => b.count - a.count), [posts])

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
  }, [page, query.text, query.tag, query.popularity, loading, posts])

  return <main className="feed-shell" ref={container}>
    <section className="hero-banner" aria-label="Bienvenue sur Afterhours">
      <span className="hero-orb orb-a" aria-hidden="true" />
      <span className="hero-orb orb-b" aria-hidden="true" />
      <div className="hero-copy">
        <div className="eyebrow"><span className="pulse-light" /> LE WEB APRÈS MINUIT <span className="hero-year">EST. 2008</span></div>
        <h1>Ça commence<br /><em>à discuter fort.</em></h1>
        <p>Une remarque qui dérape, un débat qui n'en finit plus, un inconnu qui a peut-être raison. Bienvenue dans les commentaires.</p>
        <div className="hero-cta"><Link to="/new">Lancer un sujet ↗</Link><button type="button" onClick={() => setSpotlightIndex(v => v + 1)}>Surprends-moi ↻</button></div>
        <div className="hero-numbers"><div><strong>{posts.length.toLocaleString('fr-FR')}</strong><small>publications</small></div><div><strong>{communities.length}</strong><small>communautés</small></div><div><strong>{posts.filter(p => p.source === 'community').length.toLocaleString('fr-FR')}</strong><small>discussions FR</small></div></div>
      </div>
      <div className="hero-terminal" aria-hidden="true">
        <div className="terminal-top"><span className="terminal-dots">● ● ●</span><span>afterhours / terminal</span><span>□ ×</span></div>
        <div className="terminal-screen"><small>LE SUJET QUI DIVISE</small>{spotlight ? <><p className="terminal-accent">/{spotlight.tags[0]}/ · {spotlight.reactions.likes} réactions positives</p><p className="terminal-headline">{spotlight.title}</p><Link className="terminal-link" to={'/posts/'+spotlight.id}>Lire le débat ↗</Link></> : <p>Des discussions arrivent…</p>}</div>
        <div className="terminal-sticker">ENCORE UN DÉBAT ↗</div>
      </div>
    </section>
    <div className="hot-strip"><span>ÇA FAIT PARLER</span><div>{debated.slice(0,4).map(p=><Link key={p.id} to={'/posts/'+p.id}>{p.title} ↗</Link>)}</div></div>
    <div className="layout">
      <section className="main-column">
        <div className="section-header feed-section-title"><div><small>COMMUNITY / TIMELINE</small><h2>Les discussions <span className="spark">✳</span></h2><p>De tout, surtout de n'importe quoi. Entre dans le fil.</p></div><span className="live-label"><span className="pulse-light" /> EN LIGNE</span></div>
        <form className="filter-panel" onSubmit={e => e.preventDefault()}>
          <label>Rechercher une publication<input type="search" placeholder="Un mot, une polémique…" value={query.text} onChange={e => setCriteria({ text: e.target.value })} /></label>
          <label>Communauté<select value={query.tag} onChange={e => setCriteria({ tag: e.target.value })}><option value="">Toutes les communautés</option>{tags.map(tag => <option key={tag} value={tag}>/{tag}/</option>)}</select></label>
          <label>Popularité<select value={query.popularity} onChange={e => setCriteria({ popularity: e.target.value })}><option value="all">Toutes</option><option value="popular">100 likes et +</option><option value="quiet">Moins de 100 likes</option></select></label>
        </form>
        <div className="results"><h2>Fil public <span className="results-line" /></h2><span>{filtered.length} publication(s) · page {page}/{pages}</span></div>
        {loading && <p role="status" className="notice">Chargement du forum…</p>}
        {!loading && error && <div className="notice error" role="alert">{error} <button type="button" onClick={reload}>Réessayer</button><span> Les archives du réseau restent disponibles.</span></div>}
        {!loading && (visible.length ? visible.map(post => <PostCard key={post.id} post={post} member={members.find(u => u.id === post.userId)} />) : <p className="notice">Aucun résultat. Même ici, ça arrive.</p>)}
        {!loading && <nav aria-label="Pagination" className="pagination"><button disabled={page === 1} onClick={() => setPage(page - 1)}>← Précédent</button><span>Page {page} sur {pages}</span><button disabled={page === pages} onClick={() => setPage(page + 1)}>Suivant →</button></nav>}
      </section>
      <aside className="sidebar">
        <div className="widget community-widget"><h2>EXPLORER LES COMMUNAUTÉS</h2><div className="community-list">{categoryStats.map(item => <button type="button" key={item.slug} onClick={() => { setCriteria({ tag: item.slug }); window.scrollTo({ top: 470, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }) }} className={query.tag === item.slug ? 'chosen' : ''}><span>/{item.slug}/</span><b>{item.count}</b></button>)}</div></div>
        <div className="widget status-widget"><h2>STATUT DU RÉSEAU</h2><p><span className="online">●</span> Forum local en ligne</p><p>Archives fictives du Web · session locale</p><small>Nous ne garantissons ni le bon goût ni la véracité des opinions.</small></div>
        <div className="widget"><h2>ARCHIVES DU WEB</h2><p className="widget-note">Discussions populaires</p>{archives.map(item => <div className="archive" key={item.author}><small>{item.author} · {item.board}</small><p>{item.text}</p><small>↳ {item.replies} réponses</small></div>)}</div>
      </aside>
    </div>
  </main>
}
