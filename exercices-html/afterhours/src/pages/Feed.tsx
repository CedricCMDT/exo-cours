import { useMemo } from 'react'
import { useNetwork } from '../context/NetworkContext'
import { PostCard } from '../components/PostCard'
import { archives } from '../content'

const SIZE = 9
export function Feed() {
  const { posts, members, loading, error, reload, query, setCriteria, setPage } = useNetwork()
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
  return <main className="layout">
    <section className="main-column">
      <header className="section-header"><small>COMMUNITY / TIMELINE</small><h1>Les discussions</h1><p>Bienvenue. Faites comme chez vous. Personne ne fait vraiment attention.</p></header>
      <form className="filter-panel" onSubmit={e => e.preventDefault()}>
        <label>Rechercher une publication<input type="search" placeholder="Un mot, une polémique…" value={query.text} onChange={e => setCriteria({ text: e.target.value })} /></label>
        <label>Communauté<select value={query.tag} onChange={e => setCriteria({ tag: e.target.value })}><option value="">Toutes les communautés</option>{tags.map(tag => <option key={tag} value={tag}>/{tag}/</option>)}</select></label>
        <label>Popularité<select value={query.popularity} onChange={e => setCriteria({ popularity: e.target.value })}><option value="all">Toutes</option><option value="popular">100 likes et +</option><option value="quiet">Moins de 100 likes</option></select></label>
      </form>
      <div className="results"><h2>Fil public</h2><span>{filtered.length} publication(s) · page {page}/{pages}</span></div>
      {loading && <p role="status" className="notice">Connexion aux serveurs…</p>}
      {!loading && error && <div className="notice error" role="alert">{error} <button onClick={reload}>Réessayer</button></div>}
      {!loading && !error && (visible.length ? visible.map(post => <PostCard key={post.id} post={post} member={members.find(u => u.id === post.userId)} />) : <p className="notice">Aucun résultat. Même ici, ça arrive.</p>)}
      {!loading && !error && <nav aria-label="Pagination" className="pagination"><button disabled={page === 1} onClick={() => setPage(page - 1)}>← Précédent</button><span>Page {page} sur {pages}</span><button disabled={page === pages} onClick={() => setPage(page + 1)}>Suivant →</button></nav>}
    </section>
    <aside className="sidebar">
      <div className="widget"><h2>STATUT DU RÉSEAU</h2><p><span className="online">●</span> Serveurs en ligne</p><p>Depuis 2008 · communauté active</p><small>Nous ne garantissons ni le bon goût ni la véracité des opinions.</small></div>
      <div className="widget"><h2>ARCHIVES DU WEB</h2><p className="widget-note">Discussions populaires</p>{archives.map(item => <div className="archive" key={item.author}><small>{item.author} · {item.board}</small><p>{item.text}</p><small>↳ {item.replies} réponses</small></div>)}</div>
      <div className="widget"><h2>ANNONCE</h2><p>Personne ne lit les conditions d’utilisation. Nous non plus.</p></div>
    </aside>
  </main>
}
