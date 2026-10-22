import { NavLink, Route, Routes } from 'react-router'
import { useNetwork } from './context/NetworkContext'
import { IntrusionLayer } from './components/experience/Experience'
import { Feed } from './pages/Feed'
import { Saved } from './pages/Saved'
import { Detail } from './pages/Detail'
import { Create } from './pages/Create'
import { Account } from './pages/Account'

/**
 * Application principale : navigation unique sur toutes les pages.
 * Le thème change une classe CSS, il ne recharge jamais le site.
 */
export function App() {
  const { savedIds, theme, toggleTheme, user, posts } = useNetwork()

  return <>
    <div className="future-topline">
      <span>▰ AH / 26</span>
      <span>◆ UNE EXPÉRIENCE DE FORUM VOLONTAIREMENT EXCESSIVE</span>
      <span>SIMULATION LOCALE — PAS DE LIVE EXTERNE</span>
    </div>
    <header className="site-header">
      <div className="header-inner">
        <NavLink to="/" className="brand" aria-label="Afterhours, accueil">
          <span className="future-mark">A<span>✳</span></span>
          <span className="future-brand-word">AFTER<span>HOURS</span><small>NOISE NETWORK / 2026</small></span>
        </NavLink>
        <div className="future-header-status"><i/> DÉMO LOCALE <b>↗</b></div>
        <button className="theme-toggle" type="button" onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Activer le thème clair' : 'Activer le thème sombre'}>
          ◐ {theme === 'dark' ? 'MODE CLAIR' : 'MODE SOMBRE'}
        </button>
      </div>
      <nav className="navbar" aria-label="Navigation principale">
        <NavLink to="/" end>◈ EXPLORER</NavLink>
        <NavLink to="/saved">★ FAVORIS <span>{savedIds.length}</span></NavLink>
        <NavLink to="/new" className="future-new-thread">✚ POSTER</NavLink>
        <NavLink to="/account">◎ {user ? user.username.toUpperCase() : 'CONNEXION / INSCRIPTION'}</NavLink>
        <span className="future-nav-spacer"/>
        <span className="future-nav-signal"><i/> CONNECTÉ AU SERVEUR LOCAL</span>
      </nav>
    </header>

    <Routes>
      <Route path="/" element={<Feed />} />
      <Route path="/posts/:id" element={<Detail />} />
      <Route path="/saved" element={<Saved />} />
      <Route path="/new" element={<Create />} />
      <Route path="/account" element={<Account />} />
      <Route path="*" element={<main className="narrow-page"><h1>404 / SIGNAL PERDU.</h1><NavLink to="/">← REVENIR AU RÉSEAU</NavLink></main>} />
    </Routes>

    <footer className="site-footer">
      <strong>AFTERHOURS<span> // </span> NOISE NETWORK</strong>
      <span>Interface expérimentale · discussions fictives + contributions locales</span>
      <span>© 2026 · FAIT POUR FAIRE TROP DE BRUIT.</span>
    </footer>
    <IntrusionLayer posts={posts} />
  </>
}
