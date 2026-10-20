import { useContext } from 'react'
import { Link, useParams } from 'react-router'
import { FavoritesContext } from '../../contexts/FavoritesContext.js'
import useBook from '../../hooks/useBook.js'
import styles from './Book.module.css'

export default function Book() {
  const { id } = useParams()
  const { book, loading, error } = useBook(id)
  const { favorites, toggleFavorite } = useContext(FavoritesContext)
  const isFavorite = book ? favorites.includes(book.id) : false

  if (loading) return <main className={styles.page}><p className={styles.message}>Chargement du livre...</p></main>
  if (error || !book) return (
    <main className={styles.page}>
      <div className={styles.message}>
        <p role="alert">{error || 'Livre introuvable.'}</p>
        <Link to="/">Retour à la bibliothèque</Link>
      </div>
    </main>
  )

  return (
    <main className={styles.page}>
      <article className={styles.bookDetail}>
        <div className={styles.bookSidebar}>
          <img
            className={styles.detailCover}
            src={book.cover}
            alt={'Couverture de ' + book.title}
            width="667"
            height="1000"
          />
          <div className={styles.bookActions}>
            <button
              className={[styles.bookAction, styles.primary].join(' ')}
              type="button"
              onClick={() => toggleFavorite(book.id)}
              aria-pressed={isFavorite}
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                {isFavorite ? 'remove_circle' : 'add_circle'}
              </span>
              {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            </button>
            <a className={styles.bookAction} href="#resume">
              <span className="material-symbols-outlined" aria-hidden="true">menu_book</span>
              Lire le résumé
            </a>
          </div>
        </div>

        <div className={styles.bookInformation}>
          <nav className={styles.breadcrumb} aria-label="Fil d’Ariane">
            <ol>
              <li><Link to="/">Bibliothèque</Link></li>
              <li aria-current="page">{book.title}</li>
            </ol>
          </nav>
          <h1>{book.title}</h1>
          <p className={styles.detailAuthor}>{book.authors.join(', ')}</p>

          <dl className={styles.detailMetadata}>
            <div>
              <dt><span className="material-symbols-outlined" aria-hidden="true">calendar_today</span><span className={styles.visuallyHidden}>Publication</span></dt>
              <dd><time dateTime={/^\d{4}/.test(book.publishedDate) ? book.publishedDate : undefined}>{book.publishedDate}</time></dd>
            </div>
            <div>
              <dt><span className="material-symbols-outlined" aria-hidden="true">translate</span><span className={styles.visuallyHidden}>Langue</span></dt>
              <dd>{book.language}</dd>
            </div>
            <div>
              <dt><span className="material-symbols-outlined" aria-hidden="true">auto_stories</span><span className={styles.visuallyHidden}>Genre</span></dt>
              <dd>{book.categories.join(', ') || 'Non précisé'}</dd>
            </div>
          </dl>

          <section className={styles.bookSummary} id="resume">
            <h2 className={styles.visuallyHidden}>Résumé</h2>
            <p>{book.description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()}</p>
          </section>
        </div>
      </article>
    </main>
  )
}
