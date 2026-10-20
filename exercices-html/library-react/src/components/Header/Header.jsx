import { useContext } from 'react'
import { Link, useLocation } from 'react-router'
import { FavoritesContext } from '../../contexts/FavoritesContext.js'
import styles from './Header.module.css'

export default function Header() {
  const { favorites } = useContext(FavoritesContext)
  const { pathname } = useLocation()

  return (
    <header className={styles.header}>
      <nav aria-label="Navigation principale">
        <ul>
          <li><Link to="/" aria-current={pathname === '/' ? 'page' : undefined}>Bibliothèque</Link></li>
          <li><a href="mailto:">Contact</a></li>
          <li><span>Favoris : {favorites.length}</span></li>
        </ul>
      </nav>
    </header>
  )
}
