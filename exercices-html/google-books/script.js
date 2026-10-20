const bouton = document.getElementById("click-me");
const listeLivres = document.getElementById("liste-livres");
const loader = document.getElementById("loader");
const erreur = document.getElementById("erreur");

const cleApi = "AIzaSyAAU-Fg7X8gopwftnbTfpLvCPxjQIgHzk0";
const livresParPage = 10;
let indexDepart = 0;
let chargementEnCours = false;
let finDesLivres = false;

// Une erreur 503 peut être temporaire : on attend avant de réessayer.
function attendre(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}

async function demanderLivres(url) {
  for (let tentative = 1; tentative <= 3; tentative++) {
    const reponse = await fetch(url);
    const donnees = await reponse.json();

    console.log("Réponse Google Books :", reponse.status, donnees);

    if (reponse.ok) {
      return donnees;
    }

    // Les erreurs 429, 500, 502, 503 et 504 peuvent être temporaires.
    const temporaire = [429, 500, 502, 503, 504].includes(reponse.status);
    if (temporaire && tentative < 3) {
      loader.textContent = "Service indisponible, nouvel essai (" + tentative + "/2)...";
      await attendre(tentative * 1500);
      continue;
    }

    const message = donnees.error?.message || "Erreur HTTP " + reponse.status;
    throw new Error("HTTP " + reponse.status + " : " + message);
  }
}

async function chargerLivres() {
  if (chargementEnCours || finDesLivres) return;

  chargementEnCours = true;
  bouton.disabled = true;
  loader.textContent = "Chargement...";
  loader.hidden = false;
  erreur.hidden = true;
  erreur.textContent = "";

  try {
    const url = new URL("https://www.googleapis.com/books/v1/volumes");
    url.searchParams.set("q", "javascript");
    url.searchParams.set("key", cleApi);
    url.searchParams.set("startIndex", String(indexDepart));
    url.searchParams.set("maxResults", String(livresParPage));

    const donnees = await demanderLivres(url.toString());
    const livres = donnees.items || [];

    livres.forEach(function (livre) {
      const ligne = document.createElement("li");
      ligne.textContent = livre.volumeInfo?.title || "Livre sans titre";
      listeLivres.appendChild(ligne);
    });

    // Ne changer la page que si l'appel a réussi.
    indexDepart += livres.length;

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

// Charger les premiers livres sans attendre un clic.
chargerLivres();
