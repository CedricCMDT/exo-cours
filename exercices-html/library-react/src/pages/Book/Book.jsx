import bookCover from '../../assets/moby-dick.png'
import styles from './Book.module.css'

export default function Book() {
  return (
    <main className={styles.page}>
      <article className={styles.bookDetail}>
        <div className={styles.bookSidebar}>
          <img
            className={styles.detailCover}
            src={bookCover}
            alt="Couverture du roman Moby-Dick"
            width="667"
            height="1000"
          />
          <div className={styles.bookActions}>
            <button
              className={[styles.bookAction, styles.primary].join(' ')}
              type="button"
              command="show-modal"
              commandFor="command-dialog"
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                add_circle
              </span>
              Commander le livre
            </button>
            <a className={styles.bookAction} href="#resume">
              <span className="material-symbols-outlined" aria-hidden="true">
                menu_book
              </span>
              Lire le résumé
            </a>
          </div>
        </div>

        <div className={styles.bookInformation}>
          <nav className={styles.breadcrumb} aria-label="Fil d’Ariane">
            <ol>
              <li><a href="index.html">Bibliothèque</a></li>
              <li aria-current="page">Moby-Dick</li>
            </ol>
          </nav>

          <h1>Moby-<span>Dick</span></h1>
          <p className={styles.detailAuthor}>Herman Melville</p>

          <dl className={styles.detailMetadata}>
            <div>
              <dt>
                <span className="material-symbols-outlined" aria-hidden="true">
                calendar_today
              </span><span className={styles.visuallyHidden}>Première publication</span>
              </dt>
              <dd><time dateTime="1851">1851</time></dd>
            </div>
            <div>
              <dt>
                <span className="material-symbols-outlined" aria-hidden="true">
                translate
              </span><span className={styles.visuallyHidden}>Langue originale</span>
              </dt>
              <dd>Anglais</dd>
            </div>
            <div>
              <dt>
                <span className="material-symbols-outlined" aria-hidden="true">
                auto_stories
              </span><span className={styles.visuallyHidden}>Genre</span>
              </dt>
              <dd>Aventure</dd>
            </div>
          </dl>

          <section className={styles.bookSummary} id="resume">
            <h2 className={styles.visuallyHidden}>Présentation du roman</h2>
            <p>
              Ismaël embarque à bord du Pequod, un navire baleinier commandé par
              le capitaine Achab. Au fil de la traversée, il découvre la vie en
              mer, le travail des marins et les liens qui unissent les membres
              de cet équipage venu de tous horizons.
            </p>
            <p>
              Mais Achab ne poursuit qu’un seul but : retrouver Moby Dick, le
              cachalot blanc qui lui a arraché une jambe. Pour le capitaine,
              cette chasse dépasse bientôt les limites d’une simple expédition.
              Son obsession entraîne le navire et ses hommes dans une aventure
              périlleuse.
            </p>
            <p>
              Entre récit d’aventure et réflexion sur la condition humaine, le
              roman explore la vengeance, la démesure et la relation entre
              l’être humain et la nature. L’océan devient le théâtre d’un
              affrontement où se mêlent fascination, peur et désir de tout
              maîtriser.
            </p>
          </section>
        </div>
      </article>

      <dialog
        className={styles.orderDialog}
        id="command-dialog"
        aria-labelledby="dialog-title"
      >
        <h2 id="dialog-title">Commande enregistrée</h2>
        <p>Merci pour votre intérêt pour Moby-Dick.</p>
        <form method="dialog">
          <button className={[styles.bookAction, styles.primary].join(' ')} type="submit">Fermer</button>
        </form>
      </dialog>
    </main>
  )
}
