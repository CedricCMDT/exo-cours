import bookCover from '../../assets/moby-dick.png'
import styles from './Home.module.css'

export default function Home() {
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

      <form action="index.html" method="get">
        <div className={styles.searchField}>
          <input
            type="search"
            name="q"
            id="book-name"
            aria-label="Rechercher un livre"
            placeholder="Rechercher un titre, un auteur..."
          />
          <button type="submit" aria-label="Rechercher">
            <span className="material-symbols-outlined" aria-hidden="true">
              search
            </span>
          </button>
        </div>
      </form>

      <section className={styles.catalogue}>
        <h2>Les livres de la bibliothèque</h2>

        <ul className={styles.bookList}>
          <li>
            <a className={styles.bookCard} href="book.html">
              <img className={styles.bookCover} src={bookCover} alt="" />
              <div className={styles.bookContent}>
                <h3 className={styles.bookTitle}>Moby-Dick</h3>
                <p className={styles.bookMeta}>
                  <span className={styles.bookAuthor}>Herman Melville</span>
                  <time dateTime="1851">1851</time>
                </p>
              </div>
            </a>
          </li>
          <li>
            <a className={styles.bookCard} href="book.html">
              <img className={styles.bookCover} src={bookCover} alt="" />
              <div className={styles.bookContent}>
                <h3 className={styles.bookTitle}>Vingt mille lieues sous les mers</h3>
                <p className={styles.bookMeta}>
                  <span className={styles.bookAuthor}>Jules Verne</span>
                  <time dateTime="1870">1870</time>
                </p>
              </div>
            </a>
          </li>
          <li>
            <a className={styles.bookCard} href="book.html">
              <img className={styles.bookCover} src={bookCover} alt="" />
              <div className={styles.bookContent}>
                <h3 className={styles.bookTitle}>L’Île au trésor</h3>
                <p className={styles.bookMeta}>
                  <span className={styles.bookAuthor}>Robert Louis Stevenson</span>
                  <time dateTime="1883">1883</time>
                </p>
              </div>
            </a>
          </li>
        </ul>
      </section>
    </main>
  )
}
