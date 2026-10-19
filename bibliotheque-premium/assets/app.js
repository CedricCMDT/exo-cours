(function site() {
"use strict";
const books = window.LA_MARGE_BOOKS || [];
const byId = id => books.find(book => book.id === id);
const page = document.body.dataset.page || "home";
const key = "lamarge-favorites-v1";
let favorites = [];
try { const stored = JSON.parse(localStorage.getItem(key) || "[]"); if(Array.isArray(stored)) favorites = stored.filter(id => !!byId(id)); } catch (_) {}
const bookUrl = book => "livre.html?id=" + encodeURIComponent(book.id);
const cover = (book, cls="") => `<img class="${cls}" src="${book.cover}" alt="Couverture illustrée de ${book.title}" loading="lazy" width="440" height="640">`;
const nav = () => `<header class="site-header"><div class="shell nav-container">
<a class="brand" href="index.html" aria-label="La Marge, accueil"><span class="brand-glyph" aria-hidden="true">✳</span><span>LA MARGE<span class="gold-dot">.</span></span></a>
<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" aria-label="Ouvrir la navigation"><span></span><span></span></button>
<nav id="primary-nav" class="primary-nav" aria-label="Navigation principale">
<a href="index.html" ${page==="home"?'aria-current="page"':""}>Accueil</a>
<a href="catalogue.html" ${page==="catalogue"?'aria-current="page"':""}>Collection</a>
<a href="a-propos.html" ${page==="about"?'aria-current="page"':""}>Notre histoire</a>
<a class="nav-favorites" href="favoris.html" ${page==="favoris"?'aria-current="page"':""}>Ma sélection <span class="fav-count" data-fav-count>0</span></a>
</nav></div></header>`;
const footer = () => `<footer class="site-footer"><div class="shell footer-inner"><div class="footer-brand-col">
<a class="brand" href="index.html"><span class="brand-glyph" aria-hidden="true">✳</span>LA MARGE<span class="gold-dot">.</span></a>
<p>Une bibliothèque imaginée pour ceux<br>qui aiment se perdre entre les lignes.</p></div>
<nav class="footer-links" aria-label="Liens de pied de page"><a href="catalogue.html">La collection</a><a href="favoris.html">Mes favoris</a><a href="a-propos.html">Notre histoire</a></nav>
<div class="footer-poem">ÉCRIT AVEC PASSION.<br>LU SANS MODÉRATION.</div></div>
<div class="shell footer-base"><span>© <span id="copyright-year">2026</span> LA MARGE — PROJET CRÉATIF</span><span>DES LIVRES, PAS DES ALGORITHMES.</span><a href="#contenu">REMONTER ↑</a></div></footer>
<div id="toast" class="toast" role="status" aria-live="polite"></div>`;
const heartButton = b => `<button class="favorite-button ${favorites.includes(b.id)?"is-active":""}" type="button" data-favorite="${b.id}" aria-pressed="${favorites.includes(b.id)}" aria-label="${favorites.includes(b.id)?"Retirer":"Ajouter"} ${b.title} ${favorites.includes(b.id)?"des":"à mes"} favoris"><span aria-hidden="true">${favorites.includes(b.id)?"♥":"♡"}</span></button>`;
const card = b => `<article class="book-card"><div class="book-cover-wrap">
<a class="book-cover-link" href="${bookUrl(b)}">${cover(b)}</a>
<span class="book-badge">${b.badge}</span>${heartButton(b)}</div>
<div class="book-information"><span class="book-index">${b.number} / ${b.genre.toUpperCase()} · ${b.year}</span>
<h3><a href="${bookUrl(b)}">${b.title}</a></h3><p class="book-author">${b.author}</p><a class="book-explore" href="${bookUrl(b)}" aria-label="Découvrir ${b.title}">DÉCOUVRIR <span aria-hidden="true">↗</span></a></div></article>`;
const sectionTitle = (code,title,link) => `<div class="section-title"><div><p class="eyebrow">${code}</p><h2>${title}</h2></div>${link?'<a href="catalogue.html" class="text-link">VOIR TOUTE LA COLLECTION ↗</a>':""}</div>`;
const pageContent = {
home: () => `<main id="contenu"><section class="hero shell"><div class="hero-copy">
<p class="eyebrow eyebrow-with-rule">LA BIBLIOTHÈQUE QUI PREND SON TEMPS</p>
<h1>Les histoires<br><em>restent.</em> Le monde<br><span class="outline">passe.</span></h1>
<p class="hero-subtitle">Six classiques. Une infinité de voyages. Redécouvrez le plaisir des livres qui nous habitent longtemps après la dernière page.</p>
<div class="hero-actions"><a href="catalogue.html" class="btn btn-primary">EXPLORER LA COLLECTION <span>↗</span></a><a href="#selection" class="text-link">NOS COUPS DE CŒUR ↓</a></div>
<div class="hero-foot"><div class="avatar-stack"><span>LM</span><span>HG</span><span>GO</span></div><p><strong>Une sélection à part.</strong><br>Des œuvres qui traversent les siècles.</p></div></div>
<div class="hero-visual"><div class="hero-ring"></div><p class="orbit-label">ÉDITION Nº 001 &nbsp; ✳ &nbsp; L'ART DE LIRE</p>
${cover(byId("le-petit-prince"),"hero-book hero-book-back")}
${cover(byId("1984"),"hero-book hero-book-right")}
${cover(byId("moby-dick"),"hero-book hero-book-main")}
<div class="hero-seal"><span>✳</span><small>LECTURES<br>CHOISIES</small></div><p class="hero-visual-note">01 <span>/</span> DES HISTOIRES À EMPORTER</p></div></section>
<div class="ticker" aria-hidden="true"><div class="ticker-words">LES MOTS COMPTENT <span>✳</span> LES HISTOIRES RESTENT <span>✳</span> LA CURIOSITÉ N'A PAS D'ÂGE <span>✳</span> LES MOTS COMPTENT <span>✳</span> LES HISTOIRES RESTENT <span>✳</span></div></div>
<section class="shell section" id="selection">${sectionTitle("01 — CHOISIS POUR VOUS","À lire <em>absolument.</em>",true)}
<div class="book-grid" id="home-books">${books.slice(0,4).map(card).join("")}</div></section>
<section class="spotlight"><div class="shell spotlight-layout"><div class="spotlight-display"><div class="spotlight-arch"></div>${cover(byId("frankenstein"),"spotlight-cover")}<small>MARY SHELLEY — 1818</small></div><div class="spotlight-copy"><p class="eyebrow">02 — SOUS LES PROJECTEURS</p><div class="spotlight-star" aria-hidden="true">✳</div><h2>Et si le monstre <em>n'était pas</em> celui qu'on croit&nbsp;?</h2><p>Une créature qui cherche sa place. Un créateur qui fuit sa responsabilité. Deux siècles plus tard, <strong>Frankenstein</strong> nous pose encore les bonnes questions.</p><a href="livre.html?id=frankenstein" class="btn btn-outline">DÉCOUVRIR CE LIVRE <span>↗</span></a></div></div></section>
<section class="quote-section shell"><p class="eyebrow">03 — UNE PHRASE À GARDER</p><div class="quote-mark" aria-hidden="true">“</div><blockquote>Chaque livre est une porte.<br><em>À vous de l'ouvrir.</em></blockquote><p class="quote-signature">LA MARGE — MANIFESTE DE LECTURE</p></section>
<section class="shell cta-section"><div class="cta-panel"><div><p class="eyebrow">VOTRE PROCHAINE HISTOIRE COMMENCE ICI</p><h2>Faites de la place<br><em>aux livres.</em></h2><p>Constituez votre sélection personnelle et retrouvez vos livres préférés à tout moment.</p></div><a class="btn btn-ink" href="catalogue.html">COMMENCER À EXPLORER ↗</a><span class="cta-ornament" aria-hidden="true">✳</span></div></section></main>`,
catalogue: () => `<main id="contenu"><section class="shell page-intro"><p class="eyebrow">TOUT COMMENCE PAR UNE PAGE</p><div class="intro-headline"><h1>La <em>collection.</em></h1><span>INDEX / 001—006</span></div><p>Des histoires fascinantes, des univers singuliers.<br>Trouvez le livre qui vous attendait.</p></section>
<section class="shell catalogue-section"><div class="tools-row"><label class="search-box"><span class="search-symbol" aria-hidden="true">⌕</span><span class="sr-only">Rechercher un titre ou un auteur</span><input id="book-search" type="search" placeholder="Un titre, un auteur, une envie…" autocomplete="off"></label><label class="sort-box">TRIER PAR <select id="book-sort" aria-label="Trier la collection"><option value="curated">Notre sélection</option><option value="title">Titre A–Z</option><option value="author">Auteur A–Z</option><option value="oldest">Les plus anciens</option><option value="newest">Les plus récents</option></select></label></div>
<div class="filter-row"><div id="genre-filters" class="filter-buttons" role="group" aria-label="Filtrer par genre"></div><span id="result-count" class="result-count" role="status"></span></div>
<div id="catalogue-grid" class="book-grid"></div><div id="catalogue-empty" class="empty-state" hidden><span class="empty-symbol">⌕</span><h2>Aucune histoire trouvée.</h2><p>Essayez un autre titre, auteur ou genre.</p><button id="clear-filters" class="btn btn-outline" type="button">EFFACER LES FILTRES</button></div></section></main>`,
favoris: () => `<main id="contenu"><section class="shell page-intro"><p class="eyebrow">VOTRE PETIT COIN DE BIBLIOTHÈQUE</p><h1>Ma <em>sélection.</em></h1><p>Les livres que vous gardez près de vous.<br>Votre liste est sauvegardée dans ce navigateur.</p></section><section class="shell section favorite-section"><div id="favorites-grid" class="book-grid"></div><div id="favorites-empty" class="empty-state" hidden><span class="empty-symbol">♡</span><h2>Cette étagère attend ses livres.</h2><p>Explorez notre sélection et ajoutez vos premiers favoris.</p><a href="catalogue.html" class="btn btn-primary">DÉCOUVRIR LES LIVRES ↗</a></div></section></main>`,
about: () => `<main id="contenu"><section class="shell page-intro about-intro"><p class="eyebrow">CE QU'ON CROIT</p><h1>On n'a jamais <em>trop de livres.</em><br>Seulement trop peu de temps.</h1><p>La Marge est un hommage aux grandes histoires : celles qu'on relit, qu'on prête, qu'on annote, et dont on ressort différent.</p></section><section class="shell about-layout"><div class="about-poster"><span>001 / LA MARGE</span><div class="about-poster-star" aria-hidden="true">✳</div><strong>TOUS LES<br><em>MONDES</em><br>TIENNENT<br>ENTRE DEUX<br>COUVERTURES.</strong><small>MANIFESTE DES LECTEURS CURIEUX</small></div><div class="about-copy"><p class="eyebrow">NOTRE PETIT MANIFESTE</p><h2>Moins de bruit.<br><em>Plus d'histoires.</em></h2><p>Internet va vite. Les bons romans, eux, nous invitent à ralentir. Nous avons imaginé un endroit où la littérature n'a pas besoin de crier pour être remarquée.</p><p>Pas de palmarès compliqué, pas de promesse grandiose : juste des classiques que l'on est heureux de retrouver, dans une interface pensée pour le plaisir des yeux.</p><div class="about-numbers"><div><strong>06</strong><small>œuvres choisies</small></div><div><strong>05</strong><small>pages à explorer</small></div><div><strong>∞</strong><small>raisons de lire</small></div></div><a href="catalogue.html" class="btn btn-primary">FEUILLETER LA COLLECTION ↗</a></div></section><section class="shell quote-section"><p class="eyebrow">DERNIER MOT</p><div class="quote-mark" aria-hidden="true">“</div><blockquote>Le meilleur endroit pour se perdre<br>est parfois <em>une page.</em></blockquote></section></main>`,
livre: () => `<main id="contenu"><div id="book-detail" class="shell"></div><section class="shell section related-section" id="related-section">${sectionTitle("POUR CONTINUER LE VOYAGE","Encore <em>une page.</em>",true)}<div class="book-grid" id="related-grid"></div></section></main>`
};
document.getElementById("app").innerHTML = nav() + pageContent[page]() + footer();
const $ = selector => document.querySelector(selector);
$("#copyright-year").textContent = new Date().getFullYear();
function updateCount(){document.querySelectorAll("[data-fav-count]").forEach(el=>el.textContent=favorites.length);}
function notice(message){const el=$("#toast");el.textContent=message;el.classList.add("visible");clearTimeout(notice.timer);notice.timer=setTimeout(()=>el.classList.remove("visible"),2800);}
function updateButtons(){document.querySelectorAll("[data-favorite]").forEach(button=>{const book=byId(button.dataset.favorite);const liked=favorites.includes(book.id);button.classList.toggle("is-active",liked);button.setAttribute("aria-pressed",String(liked));button.setAttribute("aria-label",(liked?"Retirer ":"Ajouter ")+book.title+(liked?" des favoris":" aux favoris"));button.querySelector("span").textContent=liked?"♥":"♡";});}
function renderFavorites(){const grid=$("#favorites-grid");if(!grid)return;const saved=favorites.map(byId).filter(Boolean);grid.innerHTML=saved.map(card).join("");$("#favorites-empty").hidden=saved.length>0;updateButtons();}
function toggleFavorite(id){const book=byId(id);if(!book)return;if(favorites.includes(id)){favorites=favorites.filter(f=>f!==id);notice(book.title+" retiré de votre sélection.");}else{favorites.push(id);notice(book.title+" ajouté à votre sélection.");}try{localStorage.setItem(key,JSON.stringify(favorites));}catch(_){notice("Favori modifié pour cette session uniquement.");}updateCount();if(page==="favoris")renderFavorites();else updateButtons();}
document.addEventListener("click",event=>{
  const fav=event.target.closest("[data-favorite]");
  if(fav){toggleFavorite(fav.dataset.favorite);return;}
  const menu=event.target.closest(".menu-toggle");
  if(menu){const open=menu.getAttribute("aria-expanded")!=="true";menu.setAttribute("aria-expanded",String(open));$("#primary-nav").classList.toggle("is-open",open);return;}
  const dialogOpen=event.target.closest("[data-open-dialog]");
  if(dialogOpen){const dlg=$("#reserve-dialog");if(dlg && typeof dlg.showModal==="function")dlg.showModal();return;}
  const share=event.target.closest("#share-book");
  if(share){if(navigator.clipboard && navigator.clipboard.writeText){navigator.clipboard.writeText(location.href).then(()=>notice("Lien copié !")).catch(()=>notice("Copiez l'adresse du navigateur pour partager."));}else notice("Copiez l'adresse du navigateur pour partager.");}
});
function fold(text){return String(text).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("fr").trim();}
function setupCatalogue(){
  const search=$("#book-search"),sort=$("#book-sort"),filters=$("#genre-filters"),grid=$("#catalogue-grid");
  let genre="Tous";
  const genres=["Tous",...new Set(books.map(book=>book.genre))];
  function render(){
    const term=fold(search.value);
    let matching=books.filter(b=>(genre==="Tous"||b.genre===genre)&&fold(b.title+" "+b.author+" "+b.genre+" "+b.short).includes(term));
    const sorting=sort.value;
    if(sorting==="title")matching.sort((a,b)=>a.title.localeCompare(b.title,"fr"));
    if(sorting==="author")matching.sort((a,b)=>a.author.localeCompare(b.author,"fr"));
    if(sorting==="oldest")matching.sort((a,b)=>a.year-b.year);
    if(sorting==="newest")matching.sort((a,b)=>b.year-a.year);
    grid.innerHTML=matching.map(card).join("");
    $("#result-count").textContent=matching.length+" LIVRE"+(matching.length>1?"S":"");
    $("#catalogue-empty").hidden=matching.length!==0;
    updateButtons();
  }
  filters.innerHTML=genres.map(g=>'<button class="filter-pill '+(g==="Tous"?"selected":"")+'" type="button" data-genre="'+g+'" aria-pressed="'+(g==="Tous")+'">'+g+'</button>').join("");
  filters.addEventListener("click",e=>{const btn=e.target.closest("[data-genre]");if(!btn)return;genre=btn.dataset.genre;filters.querySelectorAll("button").forEach(b=>{b.classList.toggle("selected",b.dataset.genre===genre);b.setAttribute("aria-pressed",String(b.dataset.genre===genre));});render();});
  search.addEventListener("input",render);sort.addEventListener("change",render);
  $("#clear-filters").addEventListener("click",()=>{search.value="";sort.value="curated";filters.querySelector('[data-genre="Tous"]').click();search.focus();});
  const initial=new URLSearchParams(location.search).get("q");if(initial)search.value=initial;render();
}
function setupBook(){
  const id=new URLSearchParams(location.search).get("id") || "moby-dick";
  const book=byId(id);
  if(!book){$("#book-detail").innerHTML='<div class="empty-state"><span class="empty-symbol">?</span><h1>Ce livre reste introuvable.</h1><p>Il a peut-être changé d\'étagère.</p><a class="btn btn-primary" href="catalogue.html">RETOUR À LA COLLECTION ↗</a></div>';$("#related-section").hidden=true;return;}
  document.title=book.title+" — LA MARGE";
  $("#book-detail").innerHTML=`<nav class="breadcrumbs" aria-label="Fil d'Ariane"><a href="index.html">ACCUEIL</a><span>/</span><a href="catalogue.html">COLLECTION</a><span>/</span><span aria-current="page">${book.title.toUpperCase()}</span></nav>
  <article class="detail-layout"><div class="detail-image-panel"><div class="detail-cover">${cover(book)}</div><p>ÉDITION LA MARGE <span>✳</span> COLLECTION 001</p></div>
  <div class="detail-copy"><p class="eyebrow">${book.genre.toUpperCase()} / ${book.year}</p><h1>${book.title}</h1><p class="detail-author">PAR ${book.author.toUpperCase()}</p><div class="detail-rule"></div>
  <h2>${book.tagline}</h2><p class="detail-description">${book.description}</p>
  <dl class="book-specs"><div><dt>PREMIÈRE PARUTION</dt><dd><time datetime="${book.year}">${book.year}</time></dd></div><div><dt>LANGUE ORIGINALE</dt><dd>${book.language}</dd></div><div><dt>ORIGINE</dt><dd>${book.origin}</dd></div><div><dt>POUR QUELLE ENVIE ?</dt><dd>${book.mood}</dd></div></dl>
  <div class="detail-actions"><button type="button" class="btn btn-primary" data-open-dialog>RÉSERVER CE LIVRE <span>↗</span></button><div class="detail-heart">${heartButton(book)}</div><button id="share-book" type="button" class="share-button" aria-label="Copier le lien de la fiche">PARTAGER ↗</button></div>
  <p class="sim-note">Réservation fictive : aucune commande ni donnée bancaire ne sera collectée.</p>
  </div></article>
  <dialog id="reserve-dialog" aria-labelledby="dialog-heading"><div class="dialog-decoration" aria-hidden="true">✳</div><p class="eyebrow">VOTRE PROCHAINE LECTURE</p><h2 id="dialog-heading">Une belle idée<br><em>de lecture.</em></h2><p>Vous avez choisi <strong>${book.title}</strong>. Cette interface est une démonstration : aucune réservation n'est enregistrée.</p><form method="dialog"><button class="btn btn-primary" type="submit">FERMER LA FENÊTRE ↗</button></form></dialog>`;
  const related=books.filter(b=>b.id!==book.id).slice(0,3);
  $("#related-grid").innerHTML=related.map(card).join("");
  updateButtons();
}
const menu=$("#primary-nav");
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&menu?.classList.contains("is-open")){menu.classList.remove("is-open");$(".menu-toggle").setAttribute("aria-expanded","false");$(".menu-toggle").focus();}});
if(page==="catalogue")setupCatalogue();
if(page==="favoris")renderFavorites();
if(page==="livre")setupBook();
updateCount();
if(window.matchMedia("(prefers-reduced-motion: reduce)").matches===false && "IntersectionObserver" in window){
const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("revealed");observer.unobserve(entry.target);}});},{threshold:0.06});
document.querySelectorAll(".book-card,.section-title,.spotlight-copy,.about-copy").forEach(el=>{el.classList.add("reveal");observer.observe(el);});
}
})();
