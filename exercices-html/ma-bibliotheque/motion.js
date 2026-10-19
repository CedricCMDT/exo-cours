// Déplacement horizontal simple du titre, uniquement sur la page d'accueil.
const titre = document.querySelector("h1");
if (titre) {
  let x = 0;
  let sens = 1;
  setInterval(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const max = Math.max(0, (titre.parentElement?.clientWidth || 0) - titre.offsetWidth);
    x += sens;
    if (x >= max || x <= 0) sens = -sens;
    x = Math.max(0, Math.min(max, x));
    titre.style.transform = `translateX(${x}px)`;
  }, 30);
}