import { Link } from 'react-router'
import styles from './BookCard.module.css'

export default function BookCard({ book }) {
  return (
    <li className={styles.item}>
      <Link className={styles.bookCard} to={'/books/' + encodeURIComponent(book.id)}>
        <img className={styles.bookCover} src={book.cover} alt="" loading="lazy" />
        <div className={styles.bookContent}>
          <h3 className={styles.bookTitle}>{book.title}</h3>
          <p className={styles.bookMeta}>
            <span className={styles.bookAuthor}>{book.authors.join(', ')}</span>
            <time dateTime={/^\d{4}/.test(book.publishedDate) ? book.publishedDate : undefined}>
              {book.publishedDate}
            </time>
          </p>
        </div>
      </Link>
    </li>
  )
}
