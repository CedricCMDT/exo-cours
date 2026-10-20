import { useEffect, useRef, useState } from 'react'
import { searchBooks } from '../../api/books.js'
import BookCard from '../../components/BookCard/BookCard.jsx'
import styles from './Home.module.css'

export default function Home() {
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('subject:fiction')
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  function handleSubmit(event) {
    event.preventDefault()
    const nextQuery = search.trim() || 'subject:fiction'
    setQuery(nextQuery)
  }

  function handleClear() {
    setSearch('')
    inputRef.current?.focus()
  }

  useEffect(() => {
    let ignored = false
    async function load() {
      setLoading(true)
      setError('')
      try {
        const results = await searchBooks(query)
        if (!ignored) setBooks(results)
      } catch (e) {
        if (!ignored) {
          setBooks([])
          setError(e.message || 'Impossible de charger les livres.')
        }
      } finally {
        if (!ignored) setLoading(false)
      }
    }
    load()
    return () => { ignored = true }
  }, [query])

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Bibliothèque</h1>
      <p className={styles.description}>
        Bienvenue dans notre bibliothèque. Découvrez notre{' '}
        <strong>sélection de romans d’aventure</strong> et consultez la fiche
        d’un livre pour en savoir plus. Cette sélection vous invite à explorer
        des récits d’aventure et des univers imaginaires.{' '}
        <em>Quel sera votre prochain voyage ?</em>
      </p>

      <form onSubmit={handleSubmit}>
        <div className={styles.searchField}>
          <input
            ref={inputRef}
            type="search"
            name="q"
            id="book-name"
            aria-label="Rechercher un livre"
            placeholder="Rechercher un titre, un auteur..."
            value={search}
            onChange={event => setSearch(event.target.value)}
          />
          <button type="submit" aria-label="Rechercher">
            <span className="material-symbols-outlined" aria-hidden="true">search</span>
          </button>
          <button type="button" onClick={handleClear} className={styles.clearButton}>Effacer</button>
        </div>
      </form>
      <p className={styles.currentQuery}>Recherche validée : {query}</p>

      <section className={styles.catalogue} aria-live="polite">
        <h2>Les livres de la bibliothèque</h2>
        {loading && <p role="status">Chargement des livres...</p>}
        {!loading && error && <p role="alert">Erreur : {error}</p>}
        {!loading && !error && (
          <>
            <p>{books.length} livre{books.length > 1 ? 's' : ''} affiché{books.length > 1 ? 's' : ''}</p>
            {books.length === 0 ? <p>Aucun résultat.</p> : (
              <ul className={styles.bookList}>
                {books.map(book => <BookCard key={book.id} book={book} />)}
              </ul>
            )}
          </>
        )}
      </section>
    </main>
  )
}
