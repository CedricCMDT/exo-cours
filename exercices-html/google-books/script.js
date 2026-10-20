const bouton = document.getElementById("click-me");
const listeLivres = document.getElementById("liste-livres");
const loader = document.getElementById("loader");
const erreur = document.getElementById("erreur");

const cleApi = "AIzaSyAAU-Fg7X8gopwftnbTfpLvCPxjQIgHzk0";
const livresParPage = 10;
let indexDepart = 0;
let chargementEnCours = false;
let finDesLivres = false;

async function chargerLivres() {
  if (chargementEnCours || finDesLivres) return;

  chargementEnCours = true;
  bouton.disabled = true;
  loader.hidden = false;
  erreur.hidden = true;
  erreur.textContent = "";

  try {
    const url = new URL("https://www.googleapis.com/books/v1/volumes");
    url.searchParams.set("q", "javascript");
    url.searchParams.set("key", cleApi);
    url.searchParams.set("startIndex", String(indexDepart));
    url.searchParams.set("maxResults", String(livresParPage));

    const reponse = await fetch(url.toString());
    const donnees = await reponse.json();

    console.log("Réponse Google Books :", donnees);

    if (!reponse.ok) {
      const message = donnees.error?.message || "Erreur HTTP " + reponse.status;
      throw new Error(message);
    }

    const livres = donnees.items || [];

    livres.forEach(function (livre) {
      const ligne = document.createElement("li");
      ligne.textContent = livre.volumeInfo?.title || "Livre sans titre";
      listeLivres.appendChild(ligne);
    });

    // On avance uniquement après un chargement réussi.
    indexDepart += livres.length;

    // Si Google ne renvoie plus de livres, on arrête la pagination.
    if (livres.length === 0 || indexDepart >= (donnees.totalItems || 0)) {
      finDesLivres = true;
      bouton.textContent = "Tous les livres sont chargés";
    }
  } catch (e) {
    console.error("Échec du chargement :", e);
    erreur.textContent = "Erreur lors du chargement : " + e.message;
    erreur.hidden = false;
  } finally {
    chargementEnCours = false;
    loader.hidden = true;
    bouton.disabled = finDesLivres;
  }
}

bouton.addEventListener("click", function () {
  console.log("Hello world");
  alert("Hello world");
  chargerLivres();
});

// Première page chargée automatiquement.
chargerLivres();
