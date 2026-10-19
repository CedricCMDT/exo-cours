(function site() {
"use strict";
const books = window.LA_MARGE_BOOKS || [];
const byId = id => books.find(book => book.id === id);
const page = document.body.dataset.page || "home";
const key = "lamarge-favorites-v1";
let favorites = [];
try { const stored = JSON.parse(localStorage.getItem(key) || "[]"); if(Array.isArray(stored)) favorites = stored.filter(id => !!byId(id)); } catch (_) {}
const bookUrl = book => "livre.html?id=" + encodeURIComponent(book.id);
const readUrl = book => "lire.html?id=" + encodeURIComponent(book.id);
const escapeHtml = value => String(value??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const cover = (book, cls="") => {
 if(book?.artwork==="typographic"){
  const seed=String(book.id).split("").reduce((acc,char)=>acc+char.charCodeAt(0),0)%12;
  return `<div class="generated-cover generated-cover-${seed} ${cls}" role="img" aria-label="Couverture typographique créée pour ${escapeHtml(book.title)}"><span class="generated-cover-edition">LA MARGE / COLLECTION</span><span class="generated-cover-ornament" aria-hidden="true">✳</span><span class="generated-cover-title">${escapeHtml(book.title)}</span><span class="generated-cover-author">${escapeHtml(book.author)}</span><span class="generated-cover-serial">COLLECTION — ${escapeHtml(book.number||"500")}</span></div>`;
 }
 return `<img class="${cls}" src="${escapeHtml(book.cover)}" alt="Couverture illustrée de ${escapeHtml(book.title)}" loading="lazy" width="440" height="640">`;
};
const nav = () => `<header class="site-header"><div class="shell nav-container">
<a class="brand" href="index.html" aria-label="La Marge, accueil"><span class="brand-glyph" aria-hidden="true">✳</span><span>LA MARGE<span class="gold-dot">.</span></span></a>
<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" aria-label="Ouvrir la navigation"><span></span><span></span></button>
<nav id="primary-nav" class="primary-nav" aria-label="Navigation principale">
<a href="index.html" ${page==="home"?'aria-current="page"':""}>Accueil</a>
<a href="catalogue.html" ${page==="catalogue"?'aria-current="page"':""}>Collection</a>
<a href="lire.html?id=candide">Lire en ligne <span class="nav-new">GRATUIT</span></a>
<a href="salon.html" ${page==="salon"?'aria-current="page"':""}>Le Salon <span class="nav-new">NOUVEAU</span></a>
<a href="a-propos.html" ${page==="about"?'aria-current="page"':""}>Notre histoire</a>
<a class="nav-favorites" href="favoris.html" ${page==="favoris"?'aria-current="page"':""}>Ma sélection <span class="fav-count" data-fav-count>0</span></a>
</nav></div></header>`;
const footer = () => `<footer class="site-footer"><div class="shell footer-inner"><div class="footer-brand-col">
<a class="brand" href="index.html"><span class="brand-glyph" aria-hidden="true">✳</span>LA MARGE<span class="gold-dot">.</span></a>
<p>Une bibliothèque imaginée pour ceux<br>qui aiment se perdre entre les lignes.</p></div>
<nav class="footer-links" aria-label="Liens de pied de page"><a href="catalogue.html">La collection</a><a href="lire.html?id=candide">La liseuse</a><a href="salon.html">Le Salon</a><a href="favoris.html">Mes favoris</a><a href="a-propos.html">Notre histoire</a></nav>
<div class="footer-poem">ÉCRIT AVEC PASSION.<br>LU SANS MODÉRATION.</div></div>
<div class="shell footer-base"><span>© <span id="copyright-year">2026</span> LA MARGE — PROJET CRÉATIF</span><span>DES LIVRES, PAS DES ALGORITHMES.</span><a href="#contenu">REMONTER ↑</a></div></footer>
<div id="toast" class="toast" role="status" aria-live="polite"></div>`;
const heartButton = b => `<button class="favorite-button ${favorites.includes(b.id)?"is-active":""}" type="button" data-favorite="${b.id}" aria-pressed="${favorites.includes(b.id)}" aria-label="${favorites.includes(b.id)?"Retirer":"Ajouter"} ${b.title} ${favorites.includes(b.id)?"des":"à mes"} favoris"><span aria-hidden="true">${favorites.includes(b.id)?"♥":"♡"}</span></button>`;
const card = b => `<article class="book-card"><div class="book-cover-wrap">
<a class="book-cover-link" href="${bookUrl(b)}">${cover(b)}</a>
<span class="book-badge ${b.copyrighted?"badge-protected":""}">${escapeHtml(b.badge)}</span>${heartButton(b)}</div>
<div class="book-information"><span class="book-index">${escapeHtml(b.number)} / ${escapeHtml(b.genre.toUpperCase())}${Number.isFinite(b.year)?" · "+b.year:""}</span>
<h3><a href="${bookUrl(b)}">${escapeHtml(b.title)}</a></h3><p class="book-author">${escapeHtml(b.author)}</p><a class="book-explore" href="${bookUrl(b)}" aria-label="Découvrir ${escapeHtml(b.title)}">${b.copyrighted?"VOIR LA FICHE":b.fullText?"LIRE / ÉDITIONS":"DÉCOUVRIR"} <span aria-hidden="true">↗</span></a></div></article>`;
const sectionTitle = (code,title,link) => `<div class="section-title"><div><p class="eyebrow">${code}</p><h2>${title}</h2></div>${link?'<a href="catalogue.html" class="text-link">VOIR TOUTE LA COLLECTION ↗</a>':""}</div>`;
const pageContent = {
home: () => `<main id="contenu"><section class="hero shell"><div class="hero-copy">
<p class="eyebrow eyebrow-with-rule">LA BIBLIOTHÈQUE QUI PREND SON TEMPS</p>
<h1>Les histoires<br><em>restent.</em> Le monde<br><span class="outline">passe.</span></h1>
<p class="hero-subtitle">500 œuvres à explorer. Romans, poésie, théâtre, sciences, philosophie et textes qui ont changé le monde. 44 œuvres intégrales sont déjà hébergées, avec la traduction à la demande. Redécouvrez le plaisir des livres qui nous habitent longtemps après la dernière page.</p>
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
<section class="shell reading-showcase" aria-labelledby="reading-showcase-title">
<div class="reading-showcase-header"><p class="eyebrow">04 — LA BIBLIOTHÈQUE OUVERTE</p><span>44 TEXTES INTÉGRAUX LOCAUX / 500 ŒUVRES AU CATALOGUE</span></div>
<div class="reading-showcase-grid">
<div class="reading-showcase-copy"><h2 id="reading-showcase-title">Tournez la page.<br><em>Pour de vrai.</em></h2><p>Plus que des couvertures, des livres entiers. Notre liseuse vous attend avec quarante-quatre classiques dans leur intégralité, des thèmes papier, nuit et clair, une recherche et un marque-page automatique.</p><a class="btn btn-primary" href="lire.html?id=candide">OUVRIR LA LISEUSE <span aria-hidden="true">↗</span></a></div>
<div class="reading-showcase-gallery" aria-label="Cinq livres à lire gratuitement">
<a href="lire.html?id=candide" aria-label="Lire Candide">${cover(byId("candide"))}</a><a href="lire.html?id=tour-du-monde" aria-label="Lire Le Tour du monde en quatre-vingts jours">${cover(byId("tour-du-monde"))}</a><a href="lire.html?id=arsene-lupin" aria-label="Lire Arsène Lupin">${cover(byId("arsene-lupin"))}</a><span class="reading-showcase-stamp" aria-hidden="true">44<br><small>LIVRES ENTIERS</small></span></div>
</div></section>
<section class="shell salon-feature" aria-labelledby="salon-home-heading">
<div class="salon-feature-frame"><div class="salon-feature-copy"><p class="eyebrow">04 — DERRIÈRE LES COUVERTURES</p>
<h2 id="salon-home-heading">Les belles histoires <em>font parler.</em></h2>
<p>Une bibliothèque silencieuse ? Pas chez nous. Entrez dans Le Salon : plus de trente pseudonymes fictifs et plusieurs centaines de messages, des avis tranchés et des conversations qui respirent.</p>
<a class="btn btn-outline" href="salon.html">ENTRER DANS LE SALON <span aria-hidden="true">↗</span></a></div>
<a href="salon.html?thread=monstre" class="salon-feature-sample" aria-label="Lire la conversation sur Frankenstein">
<div class="sample-top"><span>LE SALON / EXTRAIT Nº 01</span><span>✳</span></div>
<h3>« Je crois que j'ai détesté le mauvais personnage pendant 200 pages. »</h3>
<p>Victor crée quelqu'un, le regarde deux secondes et décide que, finalement, la paternité c'est pas son truc…</p>
<div class="sample-bottom"><span class="sample-heart">♥</span><span>MARGE_NOIRE — FRANKENSTEIN</span></div></a></div></section>
<section class="quote-section shell"><p class="eyebrow">03 — UNE PHRASE À GARDER</p><div class="quote-mark" aria-hidden="true">“</div><blockquote>Chaque livre est une porte.<br><em>À vous de l'ouvrir.</em></blockquote><p class="quote-signature">LA MARGE — MANIFESTE DE LECTURE</p></section>
<section class="shell fate-section" aria-labelledby="fate-heading"><div class="fate-panel"><div class="fate-copy"><p class="eyebrow">05 — LA BIBLIOMANCIE</p><h2 id="fate-heading">Laissez le hasard<br><em>tourner la page.</em></h2>
<p>Parfois, le meilleur livre est celui qu'on n'avait pas prévu d'ouvrir. Confiez-nous votre prochaine lecture.</p>
<button class="fate-button" type="button" id="fate-pick">CHOISISSEZ POUR MOI ✳</button></div>
<div class="fate-result" id="fate-result"><div class="fate-placeholder"><span class="fate-glyph" aria-hidden="true">✳</span><span class="fate-caption">UNE HISTOIRE VOUS ATTEND</span><h3>Vous laissez faire le destin ?</h3><p>Six classiques, un seul prochain voyage.</p></div><div class="fate-output" aria-live="polite"></div></div></div></section>
<section class="shell cta-section"><div class="cta-panel"><div><p class="eyebrow">VOTRE PROCHAINE HISTOIRE COMMENCE ICI</p><h2>Faites de la place<br><em>aux livres.</em></h2><p>Constituez votre sélection personnelle et retrouvez vos livres préférés à tout moment.</p></div><a class="btn btn-ink" href="catalogue.html">COMMENCER À EXPLORER ↗</a><span class="cta-ornament" aria-hidden="true">✳</span></div></section></main>`,
catalogue: () => `<main id="contenu"><section class="shell page-intro"><p class="eyebrow">TOUT COMMENCE PAR UNE PAGE</p><div class="intro-headline"><h1>La <em>collection.</em></h1><span>INDEX / 001—500</span></div><p>Des histoires fascinantes, des univers singuliers.<br>Trouvez le livre qui vous attendait.</p></section>
<section class="shell catalogue-section"><div class="tools-row"><label class="search-box"><span class="search-symbol" aria-hidden="true">⌕</span><span class="sr-only">Rechercher un titre ou un auteur</span><input id="book-search" type="search" placeholder="Un titre, un auteur, une envie…" autocomplete="off"></label><label class="sort-box">TRIER PAR <select id="book-sort" aria-label="Trier la collection"><option value="curated">Notre sélection</option><option value="title">Titre A–Z</option><option value="author">Auteur A–Z</option><option value="oldest">Les plus anciens</option><option value="newest">Les plus récents</option></select></label></div>
<div class="filter-row"><div id="genre-filters" class="filter-buttons" role="group" aria-label="Filtrer par genre"></div><span id="result-count" class="result-count" role="status"></span></div>
<div id="catalogue-grid" class="book-grid"></div><div id="catalogue-empty" class="empty-state" hidden><span class="empty-symbol">⌕</span><h2>Aucune histoire trouvée.</h2><p>Essayez un autre titre, auteur ou genre.</p><button id="clear-filters" class="btn btn-outline" type="button">EFFACER LES FILTRES</button></div></section></main>`,
favoris: () => `<main id="contenu"><section class="shell page-intro"><p class="eyebrow">VOTRE PETIT COIN DE BIBLIOTHÈQUE</p><h1>Ma <em>sélection.</em></h1><p>Les livres que vous gardez près de vous.<br>Votre liste est sauvegardée dans ce navigateur.</p></section><section class="shell section favorite-section"><div id="favorites-grid" class="book-grid"></div><div id="favorites-empty" class="empty-state" hidden><span class="empty-symbol">♡</span><h2>Cette étagère attend ses livres.</h2><p>Explorez notre sélection et ajoutez vos premiers favoris.</p><a href="catalogue.html" class="btn btn-primary">DÉCOUVRIR LES LIVRES ↗</a></div></section></main>`,
about: () => `<main id="contenu"><section class="shell page-intro about-intro"><p class="eyebrow">CE QU'ON CROIT</p><h1>On n'a jamais <em>trop de livres.</em><br>Seulement trop peu de temps.</h1><p>La Marge est un hommage aux grandes histoires : celles qu'on relit, qu'on prête, qu'on annote, et dont on ressort différent.</p></section><section class="shell about-layout"><div class="about-poster"><span>001 / LA MARGE</span><div class="about-poster-star" aria-hidden="true">✳</div><strong>TOUS LES<br><em>MONDES</em><br>TIENNENT<br>ENTRE DEUX<br>COUVERTURES.</strong><small>MANIFESTE DES LECTEURS CURIEUX</small></div><div class="about-copy"><p class="eyebrow">NOTRE PETIT MANIFESTE</p><h2>Moins de bruit.<br><em>Plus d'histoires.</em></h2><p>Internet va vite. Les bons romans, eux, nous invitent à ralentir. Nous avons imaginé un endroit où la littérature n'a pas besoin de crier pour être remarquée.</p><p>Pas de palmarès compliqué, pas de promesse grandiose : juste des classiques que l'on est heureux de retrouver, dans une interface pensée pour le plaisir des yeux.</p><div class="about-numbers"><div><strong>500</strong><small>œuvres choisies</small></div><div><strong>44</strong><small>livres complets</small></div><div><strong>∞</strong><small>raisons de lire</small></div></div><a href="catalogue.html" class="btn btn-primary">FEUILLETER LA COLLECTION ↗</a></div></section><section class="shell quote-section"><p class="eyebrow">DERNIER MOT</p><div class="quote-mark" aria-hidden="true">“</div><blockquote>Le meilleur endroit pour se perdre<br>est parfois <em>une page.</em></blockquote></section></main>`,
salon: () => "<main id=\"contenu\">\n<section class=\"shell salon-intro\" aria-labelledby=\"salon-headline\">\n<div><p class=\"salon-eyebrow\">LE CERCLE DES LECTEURS</p><h1 id=\"salon-headline\">Les livres <em>parlent.</em><br>Nous <span class=\"salon-stroke\">aussi.</span></h1>\n<p class=\"salon-intro-desc\">Il y a les livres qu'on lit. Et ceux dont on ne finit jamais de parler. Entrez dans un salon où les pages deviennent des conversations et les opinions des rencontres.</p>\n<div class=\"salon-intro-actions\"><a href=\"#discussions\" class=\"btn btn-primary\">ENTRER DANS LE SALON <span aria-hidden=\"true\">↗</span></a><a class=\"text-link\" href=\"#salon-manifeste\">NOTRE ESPRIT ↓</a></div>\n<div class=\"salon-intro-note\"><span class=\"salon-red-dot\"></span><span>Une fiction interactive. Plus de 30 profils imaginaires, plus de 700 messages à explorer.</span></div></div>\n<div class=\"salon-stage\" aria-hidden=\"true\">\n<div class=\"letter-card\"><div class=\"letter-top\"><span>LA MARGE / NOTE Nº 04</span><span class=\"letter-icon\">✳</span></div><h2>Les gens parlent des livres. Les livres parlent des gens.</h2><p>Une conversation qui commence sur Frankenstein peut finir par une amitié.</p><div class=\"letter-sign\">— MATHILDE.L</div></div>\n<div class=\"letter-card\"><div class=\"letter-top\"><span>EXTRAIT DE SALON</span><span>♡</span></div><h2>« Je retire 12 % de mes plaintes. »</h2><p>— Nicolas, à propos de Moby-Dick</p><div class=\"letter-sign\">JOURNAL DE LECTURE</div></div>\n<div class=\"letter-card\"><div class=\"letter-top\"><span>ÉDITION / 001</span><span>✳</span></div><h2>Un lieu pour débattre. Pas pour avoir raison.</h2><p>Le meilleur avis est peut-être celui qui vous fait changer d'idée.</p><div class=\"letter-sign\">LE MANIFESTE DU SALON</div></div>\n</div></section>\n<div class=\"salon-diagonal\" aria-hidden=\"true\"><div class=\"salon-diagonal-track\">ENTRE LES LIGNES <span>✳</span> ENTRE NOUS <span>✳</span> LES LIVRES NOUS RELIENT <span>✳</span> ENTRE LES LIGNES <span>✳</span> ENTRE NOUS <span>✳</span> LES LIVRES NOUS RELIENT <span>✳</span></div></div>\n<section class=\"shell salon-manifesto\" id=\"salon-manifeste\"><div><p class=\"eyebrow\">001 / UN AUTRE GENRE DE CONVERSATION</p><h2>Une bibliothèque pour les pages.<br><em>Un salon pour tout ce qu'elles provoquent.</em></h2></div>\n<p>Pas d'avis parfaits ici. Des lecteurs fictifs qui s'interrompent, doutent, rigolent et parfois ne sont pas d'accord. Chaque échange est une scène écrite pour cet univers.</p></section>\n<div class=\"shell salon-workspace\" id=\"discussions\">\n<aside class=\"salon-aside\" aria-label=\"À propos du Salon\">\n<div class=\"salon-aside-box\"><p class=\"eyebrow\">UNIVERS ÉDITORIAL</p><h2>Bienvenue au Salon.</h2><p>Plus de trente pseudonymes récurrents. Des habitudes, des désaccords, des petites histoires qui se croisent.</p>\n<div class=\"salon-highlight\"><h4>Le principe</h4><p>Une communauté entièrement fictive, créée pour cette démonstration. Aucun message n'est présenté comme venant d'un vrai lecteur.</p></div>\n<div class=\"salon-cast\" id=\"salon-cast\"></div><p class=\"disclaimer\">Vos likes et vos notes sont stockés uniquement sur cet appareil. Il n'y a pas de serveur ni de réponses IA.</p></div>\n<div class=\"salon-aside-poem\"><span aria-hidden=\"true\">“</span><p>Parler d'un livre, c'est parfois raconter ce qu'il a changé en nous.</p></div>\n</aside>\n<section class=\"salon-main\" aria-labelledby=\"salon-conversations-heading\">\n<div class=\"salon-feed-head\"><div><p class=\"eyebrow\">002 / AUTOUR DES LIVRES</p><h2 id=\"salon-conversations-heading\">Le fil des <em>histoires.</em></h2></div><span class=\"salon-count\" id=\"salon-count\">95 CONVERSATIONS</span></div>\n<div class=\"salon-write\"><div><h3>Et vous, qu'est-ce que vous lisez ?</h3><p>Une note dans votre carnet privé, à retrouver ici quand vous revenez.</p></div><button type=\"button\" id=\"salon-open-compose\">ÉCRIRE UNE NOTE ↗</button></div>\n<div class=\"salon-tools\"><label class=\"salon-search\"><span aria-hidden=\"true\">⌕</span><span class=\"sr-only\">Rechercher dans les conversations</span><input type=\"search\" id=\"salon-search\" placeholder=\"Une discussion, un livre, une idée…\" autocomplete=\"off\"></label><select id=\"salon-sort\" class=\"salon-sort\" aria-label=\"Trier les conversations\"><option value=\"recent\">Dans l'ordre du Salon</option><option value=\"popular\">Les plus aimées</option><option value=\"discussion\">Les plus discutées</option></select></div>\n<p class=\"salon-filters-title\">EXPLORER PAR THÈME</p><div id=\"salon-filters\" class=\"salon-filters\" role=\"group\" aria-label=\"Filtrer les discussions\"></div>\n<div class=\"thread-list\" id=\"salon-feed\" aria-live=\"polite\"></div>\n</section></div>\n<div class=\"salon-end-note\" aria-hidden=\"true\"><span>✳</span><p>Les conversations continuent<br>après la dernière page.</p></div>\n<dialog id=\"salon-thread-dialog\" class=\"salon-dialog\" aria-labelledby=\"salon-dialog-title\">\n<div class=\"salon-dialog-header\"><p class=\"salon-dialog-kicker\" id=\"salon-dialog-kicker\">LE SALON / CONVERSATION</p><button type=\"button\" class=\"salon-close\" data-close-dialog aria-label=\"Fermer la discussion\">×</button></div>\n<div class=\"salon-dialog-body\"><h2 id=\"salon-dialog-title\"></h2><div class=\"salon-dialog-meta\" id=\"salon-dialog-meta\"></div><p class=\"salon-story\" id=\"salon-dialog-story\"></p>\n<div class=\"salon-dialog-replies\"><h3 id=\"salon-dialog-replies-title\">Réponses</h3><div id=\"salon-dialog-replies\"></div></div>\n<form id=\"salon-reply-form\" class=\"salon-reply-form\"><h4>Écrire dans la marge</h4><p>Votre note restera visible seulement sur ce navigateur. Les personnages ne répondent pas automatiquement.</p>\n<label class=\"sr-only\" for=\"salon-reply-text\">Votre réponse</label><textarea id=\"salon-reply-text\" rows=\"3\" maxlength=\"500\" required placeholder=\"Votre avis, une nuance, une réflexion…\"></textarea><span id=\"salon-reply-count\" class=\"salon-charcount\">0 / 500</span><button type=\"submit\" class=\"btn\">AJOUTER MA NOTE ↗</button></form></div></dialog>\n<dialog id=\"salon-compose-dialog\" class=\"salon-dialog\" aria-labelledby=\"salon-compose-title\">\n<div class=\"salon-dialog-header\"><p class=\"salon-dialog-kicker\">VOTRE CARNET / NOUVELLE PAGE</p><button type=\"button\" class=\"salon-close\" data-close-dialog aria-label=\"Fermer la rédaction\">×</button></div>\n<form id=\"salon-compose-form\" class=\"salon-compose-form\"><h2 id=\"salon-compose-title\">Écrire <em>sa propre page.</em></h2><p class=\"salon-compose-notice\">Votre texte ne sera pas publié sur Internet. Il reste sur votre appareil, pour cette démonstration.</p>\n<label for=\"salon-compose-name\">TITRE DE VOTRE NOTE</label><input type=\"text\" id=\"salon-compose-title-input\" name=\"title\" minlength=\"6\" maxlength=\"110\" required placeholder=\"Ce livre que je n'arrive pas à oublier…\">\n<label for=\"salon-compose-body\">CE QUE VOUS AVEZ ENVIE DE DIRE</label><textarea id=\"salon-compose-body\" rows=\"6\" maxlength=\"1000\" minlength=\"10\" required placeholder=\"Racontez votre lecture, votre désaccord ou ce qui vous reste en tête…\"></textarea><span class=\"salon-charcount\" id=\"salon-compose-count\">0 / 1000</span>\n<button type=\"submit\" class=\"btn\">GARDER CETTE NOTE ↗</button></form></dialog>\n</main>",
livre: () => `<main id="contenu"><div id="book-detail" class="shell"></div><section class="shell section related-section" id="related-section">${sectionTitle("POUR CONTINUER LE VOYAGE","Encore <em>une page.</em>",true)}<div class="book-grid" id="related-grid"></div></section></main>`
};
document.getElementById("app").innerHTML = nav() + pageContent[page]() + footer();
const $ = selector => document.querySelector(selector);
$("#copyright-year").textContent = new Date().getFullYear();
function updateCount(){document.querySelectorAll("[data-fav-count]").forEach(el=>el.textContent=favorites.length);}
function notice(message){const el=$("#toast");el.textContent=message;el.classList.add("visible");clearTimeout(notice.timer);notice.timer=setTimeout(()=>el.classList.remove("visible"),2800);}
function updateButtons(){document.querySelectorAll("[data-favorite]").forEach(button=>{const book=byId(button.dataset.favorite);const liked=favorites.includes(book.id);button.classList.toggle("is-active",liked);button.setAttribute("aria-pressed",String(liked));button.setAttribute("aria-label",(liked?"Retirer ":"Ajouter ")+book.title+(liked?" des favoris":" aux favoris"));button.querySelector("span").textContent=liked?"♥":"♡";});}
function renderFavorites(){const grid=$("#favorites-grid");if(!grid)return;const saved=favorites.map(byId).filter(Boolean);grid.innerHTML=saved.map(card).join("");$("#favorites-empty").hidden=saved.length>0;updateButtons();}
function toggleFavorite(id){const book=byId(id);if(!book)return;if(favorites.includes(id)){favorites=favorites.filter(f=>f!==id);notice(book.title+" retiré de votre sélection.");}else{favorites.push(id);notice(book.title+" ajouté à votre sélection.");}try{localStorage.setItem(key,JSON.stringify(favorites));}catch(_){notice("Favori modifié pour cette session uniquement.");}updateCount();if(page==="favoris")renderFavorites();else updateButtons();if(page==="catalogue"&&typeof window.LA_MARGE_REFRESH_CATALOGUE==="function")window.LA_MARGE_REFRESH_CATALOGUE();}
document.addEventListener("click",event=>{
  const fav=event.target.closest("[data-favorite]");
  if(fav){toggleFavorite(fav.dataset.favorite);return;}
  const menu=event.target.closest(".menu-toggle");
  if(menu){const open=menu.getAttribute("aria-expanded")!=="true";menu.setAttribute("aria-expanded",String(open));$("#primary-nav").classList.toggle("is-open",open);return;}
  const share=event.target.closest("#share-book");
  if(share){if(navigator.clipboard && navigator.clipboard.writeText){navigator.clipboard.writeText(location.href).then(()=>notice("Lien copié !")).catch(()=>notice("Copiez l'adresse du navigateur pour partager."));}else notice("Copiez l'adresse du navigateur pour partager.");}
});
function fold(text){return String(text).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("fr").trim();}
function setupCatalogue(){
 const search=$("#book-search"),sort=$("#book-sort"),filters=$("#genre-filters"),grid=$("#catalogue-grid");
 let access="Tous",category="Toutes les catégories",pageNo=1;
 const pageSize=24;
 const genres=[...new Set(books.map(b=>b.genre))].sort((a,b)=>a.localeCompare(b,"fr"));
 const quick=["Tous","À lire ici","Éditions libres","Sous droits","Documents","Mes favoris","Mon journal"];
 filters.innerHTML='<div class="library-fast-filters">'+quick.map(g=>'<button class="filter-pill'+(g==="Tous"?" selected":"")+'" type="button" data-access="'+g+'" aria-pressed="'+(g==="Tous")+'">'+g+'</button>').join("")+'</div><label class="library-category">CATÉGORIE <select id="genre-category" aria-label="Choisir une catégorie"><option>Toutes les catégories</option>'+genres.map(g=>'<option>'+escapeHtml(g)+'</option>').join("")+'</select></label>';
 const categorySelect=$("#genre-category");
 const existingGridParent=grid.parentElement;
 const controls=document.createElement("nav");controls.className="catalogue-pages";controls.id="catalogue-pages";controls.setAttribute("aria-label","Pages du catalogue");
 grid.after(controls);
 const isLocal=b=>Object.values(b.editions||{}).some(e=>e.file);
 const getReadingStatus=id=>{try{const statuses=JSON.parse(localStorage.getItem("lamarge-reading-status-v1")||"{}");return ["a-lire","en-cours","termine"].includes(statuses[id])?statuses[id]:"";}catch(_){return "";}};
 const matchesAccess=b=>access==="Tous"||access==="À lire ici"&&isLocal(b)||access==="Éditions libres"&&!b.copyrighted||access==="Sous droits"&&b.copyrighted||access==="Documents"&&b.id==="ddhc-1789"||access==="Mes favoris"&&favorites.includes(b.id)||access==="Mon journal"&&Boolean(getReadingStatus(b.id));
 function render(){
  const term=fold(search.value);
  const matching=books.filter(b=>matchesAccess(b)&&(category==="Toutes les catégories"||b.genre===category)&&fold(b.title+" "+b.author+" "+b.genre+" "+(b.short||"")+" "+(b.originalTitle||"")).includes(term));
  const sorting=sort.value;
  if(sorting==="title")matching.sort((a,b)=>a.title.localeCompare(b.title,"fr"));
  if(sorting==="author")matching.sort((a,b)=>a.author.localeCompare(b.author,"fr"));
  if(sorting==="oldest")matching.sort((a,b)=>(Number.isFinite(a.year)?a.year:Infinity)-(Number.isFinite(b.year)?b.year:Infinity));
  if(sorting==="newest")matching.sort((a,b)=>(Number.isFinite(b.year)?b.year:-Infinity)-(Number.isFinite(a.year)?a.year:-Infinity));
  const totalPages=Math.max(1,Math.ceil(matching.length/pageSize));pageNo=Math.min(pageNo,totalPages);
  const offset=(pageNo-1)*pageSize;
  grid.innerHTML=matching.slice(offset,offset+pageSize).map(card).join("");
  $("#result-count").textContent=matching.length+" ŒUVRE"+(matching.length>1?"S":"")+" · PAGE "+pageNo+"/"+totalPages;
  $("#catalogue-empty").hidden=matching.length!==0;
  const visible=[];
  if(totalPages>1){
    visible.push(1);
    for(let n=Math.max(2,pageNo-2);n<=Math.min(totalPages-1,pageNo+2);n++)visible.push(n);
    if(totalPages>1)visible.push(totalPages);
  }
  const numbers=visible.filter((n,i)=>i===0||n!==visible[i-1]).map((n,i)=>'<button type="button" data-page="'+n+'" '+(n===pageNo?'aria-current="page"':'')+'>'+n+'</button>').join("");
  controls.innerHTML=totalPages>1?'<button type="button" data-page="'+(pageNo-1)+'" '+(pageNo===1?"disabled":"")+' aria-label="Page précédente">←</button>'+numbers+'<button type="button" data-page="'+(pageNo+1)+'" '+(pageNo===totalPages?"disabled":"")+' aria-label="Page suivante">→</button>':"";
  updateButtons();
 }
 function changed(){pageNo=1;render();}
 filters.addEventListener("click",event=>{const btn=event.target.closest("[data-access]");if(!btn)return;access=btn.dataset.access;filters.querySelectorAll("[data-access]").forEach(b=>{b.classList.toggle("selected",b.dataset.access===access);b.setAttribute("aria-pressed",String(b.dataset.access===access));});changed();});
 categorySelect.addEventListener("change",()=>{category=categorySelect.value;changed();});
 controls.addEventListener("click",event=>{const btn=event.target.closest("[data-page]");if(!btn)return;pageNo=Math.max(1,Number(btn.dataset.page));render();document.querySelector(".catalogue-section").scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});});
 search.addEventListener("input",changed);sort.addEventListener("change",changed);
 $("#clear-filters").addEventListener("click",()=>{search.value="";sort.value="curated";categorySelect.value="Toutes les catégories";category="Toutes les catégories";filters.querySelector('[data-access="Tous"]').click();search.focus();});
 const initial=new URLSearchParams(location.search).get("q");if(initial)search.value=initial;
 window.LA_MARGE_REFRESH_CATALOGUE=render;
 render();
}
function setupBook(){
  const id=new URLSearchParams(location.search).get("id") || "moby-dick";
  const book=byId(id);
  if(!book){$("#book-detail").innerHTML='<div class="empty-state"><span class="empty-symbol">?</span><h1>Ce livre reste introuvable.</h1><p>Il a peut-être changé d\'étagère.</p><a class="btn btn-primary" href="catalogue.html">RETOUR À LA COLLECTION ↗</a></div>';$("#related-section").hidden=true;return;}
  document.title=book.title+" — LA MARGE";
  const yearLabel=Number.isFinite(book.year)?String(book.year):"Date non renseignée";
  const originalLang=book.editions?.original?.language||book.language||"Non renseignée";
  const available=Object.values(book.editions||{}).filter(e=>e.file);
  const originText=book.origin||"Référence bibliographique";
  const source=book.sourceUrl||(book.gutenberg?"https://www.gutenberg.org/ebooks/"+book.gutenberg:null);
  $("#book-detail").innerHTML=`<nav class="breadcrumbs" aria-label="Fil d'Ariane"><a href="index.html">ACCUEIL</a><span>/</span><a href="catalogue.html">COLLECTION</a><span>/</span><span aria-current="page">${escapeHtml(book.title.toUpperCase())}</span></nav>
  <article class="detail-layout"><div class="detail-image-panel"><div class="detail-cover">${cover(book)}</div><p>LA MARGE <span>✳</span> BIBLIOTHÈQUE / 500</p></div>
  <div class="detail-copy"><p class="eyebrow">${escapeHtml(book.genre.toUpperCase())}${Number.isFinite(book.year)?" / "+book.year:""}</p><h1>${escapeHtml(book.title)}</h1><p class="detail-author">PAR ${escapeHtml(book.author.toUpperCase())}</p><div class="detail-rule"></div>
  <h2>${escapeHtml(book.tagline||"Une œuvre à découvrir.")}</h2><p class="detail-description">${escapeHtml(book.description||"Explorez les éditions disponibles et retrouvez cette œuvre dans votre sélection personnelle.")}</p>
  <dl class="book-specs"><div><dt>DATE DE PUBLICATION</dt><dd>${Number.isFinite(book.year)?'<time datetime="'+book.year+'">'+book.year+'</time>':"Non renseignée dans la source"}</dd></div><div><dt>LANGUE ORIGINALE</dt><dd>${escapeHtml(originalLang)}</dd></div><div><dt>PROVENANCE</dt><dd>${escapeHtml(originText)}</dd></div><div><dt>STATUT</dt><dd>${book.copyrighted?"Œuvre sous droits":book.id==="ddhc-1789"?"Texte juridique officiel":available.length?"Texte intégral dans LA MARGE":"Édition libre référencée"}</dd></div></dl>
  <div class="detail-actions"><a class="btn btn-primary" href="#edition-heading">CHOISIR UNE ÉDITION <span>↗</span></a><div class="detail-heart">${heartButton(book)}</div><button id="share-book" type="button" class="share-button" aria-label="Copier le lien de la fiche">PARTAGER ↗</button></div>
  <p class="sim-note">${book.copyrighted?"Fiche bibliographique uniquement : aucun texte intégral protégé n'est reproduit.":book.id==="ddhc-1789"?"Le texte juridique est consultable sur la source officielle.":available.length?"Les éditions intégrales disponibles sont accessibles dans la liseuse.":"Consultez l'édition libre externe pour lire le texte entier."}</p>
  ${source&&!book.copyrighted?'<p><a class="detail-gutenberg" href="'+escapeHtml(source)+'" target="_blank" rel="noopener noreferrer">CONSULTER LA SOURCE OFFICIELLE ↗</a></p>':""}
  </div></article>`;
  const matches=books.filter(b=>b.id!==book.id&&b.genre===book.genre);
  const related=[...matches.slice(0,3),...books.filter(b=>b.id!==book.id&&!matches.includes(b)).slice(0,Math.max(0,3-matches.length))];
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
