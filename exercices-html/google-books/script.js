const bouton = document.querySelector("#click-me");
const listeLivres = document.querySelector("#liste-livres");
const loader = document.querySelector("#loader");
const erreur = document.querySelector("#erreur");

const cleApi = "AIzaSyAAU-Fg7X8gopwftnbTfpLvCPxjQIgHzk0";
const nombreParPage = 10;
let indexDepart = 0;

async function chargerLivres() {
  bouton.disabled = true;
  loader.hidden = false;
  erreur.hidden = true;

  try {
    // Le paramètre q est obligatoire pour chercher des livres.
    const url = new URL("https://www.googleapis.com/books/v1/volumes");
    url.searchParams.set("q", "javascript");
    url.searchParams.set("key", cleApi);
    url.searchParams.set("startIndex", indexDepart);
    url.searchParams.set("maxResults", nombreParPage);

    const reponse = await fetch(url);

    if (!reponse.ok) {
      throw new Error("Erreur HTTP : " + reponse.status);
    }

    const donnees = await reponse.json();
    console.log(donnees);

    const livres = donnees.items || [];

    for (const livre of livres) {
      const element = document.createElement("li");
      element.textContent = livre.volumeInfo?.title || "Sans titre";
      listeLivres.appendChild(element);
    }

    indexDepart += livres.length;
    if (livres.length === 0) {
      bouton.disabled = true;
      return;
    }
  } catch (e) {
    console.error(e);
    erreur.textContent = "Impossible de charger les livres. Réessaie.";
    erreur.hidden = false;
  } finally {
    loader.hidden = true;
    if (erreur.hidden) {
      bouton.disabled = false;
    } else {
      bouton.disabled = false; // Permet de réessayer.
    }
  }
}

bouton.addEventListener("click", () => {
  console.log("Hello world");
  alert("Hello world");
  chargerLivres();
});

// Chargement dès l'ouverture de la page.
chargerLivres();
