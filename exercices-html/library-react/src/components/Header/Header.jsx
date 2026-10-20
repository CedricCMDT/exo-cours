import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <nav>
        <ul>
          <li><a href="index.html" aria-current="page">Bibliothèque</a></li>
          <li><a href="index.html" aria-current="page">Contact</a></li>
        </ul>
      </nav>
    </header>
  )
}
