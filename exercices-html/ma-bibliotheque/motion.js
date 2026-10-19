/* Bonus demandé : le titre "Ma bibliothèque" se déplace en continu de
   gauche à droite et rebondit sur les bords. Aucun JS pour le formulaire. */
(() => {
  "use strict";
  const title = document.getElementById("moving-library-title");
  const track = document.querySelector(".moving-title-track");
  if (!title || !track) return;

  const prefersLessMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let position = 0;
  let direction = 1;
  const speed = 44; // pixels par seconde, mouvement doux
  let previousTime = 0;
  let frame = 0;

  function draw() {
    title.style.transform = "translate3d(" + position + "px,-50%,0)";
  }
  function maxPosition() {
    return Math.max(0, track.clientWidth - title.offsetWidth - 1);
  }
  function tick(time) {
    if (prefersLessMotion.matches || document.hidden) {
      previousTime = 0;
      frame = requestAnimationFrame(tick);
      return;
    }
    const delta = previousTime ? Math.min((time - previousTime) / 1000, .06) : 0;
    previousTime = time;
    const max = maxPosition();
    if (max > 0) {
      position += direction * speed * delta;
      if (position >= max) {
        position = max;
        direction = -1;
      } else if (position <= 0) {
        position = 0;
        direction = 1;
      }
    } else {
      position = 0;
    }
    draw();
    frame = requestAnimationFrame(tick);
  }
  window.addEventListener("resize", () => {
    position = Math.min(position, maxPosition());
    draw();
  }, {passive:true});
  window.addEventListener("pagehide", () => cancelAnimationFrame(frame), {once:true});
  draw();
  frame = requestAnimationFrame(tick);
})();
