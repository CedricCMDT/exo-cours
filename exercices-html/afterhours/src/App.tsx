import { NavLink, Route, Routes } from 'react-router'
import { useNetwork } from './context/NetworkContext'
import { Feed } from './pages/Feed'
import { Saved } from './pages/Saved'
import { Detail } from './pages/Detail'
import { Create } from './pages/Create'

export function App() {
  const { savedIds, theme, toggleTheme } = useNetwork()
  return <>
    <header className="site-header">
      <div className="header-inner">
        <div><NavLink to="/" className="brand">afterhours<span>.net</span></NavLink><small>COMMUNITY NETWORK · EST. 2008</small></div>
        <button className="theme-toggle" onClick={toggleTheme} aria-label={theme === 'light' ? 'Activer le mode sombre' : 'Activer le mode clair'}>{theme === 'light' ? '☾' : '☀'} Thème</button>
      </div>
      <nav className="navbar" aria-label="Navigation principale"><NavLink end to="/">Fil public</NavLink><NavLink to="/saved">Sauvegardes ({savedIds.length})</NavLink><NavLink to="/new">Créer un fil +</NavLink></nav>
    </header>
    <Routes><Route path="/" element={<Feed />} /><Route path="/posts/:id" element={<Detail />} /><Route path="/saved" element={<Saved />} /><Route path="/new" element={<Create />} /><Route path="*" element={<main className="narrow-page"><h1>404 — Fil introuvable</h1><NavLink to="/">Retour à l’accueil</NavLink></main>} /></Routes>
    <footer className="site-footer">© AFTERHOURS 2008–2026 · Un projet React + TypeScript.</footer>
  </>
}
