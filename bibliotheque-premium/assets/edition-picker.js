(function(){
"use strict";
if(document.body.dataset.page!=="livre")return;
const id=new URLSearchParams(location.search).get("id")||"moby-dick";
const book=(window.LA_MARGE_BOOKS||[]).find(b=>b.id===id);
const anchor=document.querySelector(".detail-actions");
if(!book||!anchor||!book.editions)return;
const outer=document.createElement("section");outer.className="edition-selector";outer.setAttribute("aria-labelledby","edition-heading");
outer.innerHTML='<p class="eyebrow">ÉDITIONS & TRADUCTIONS</p><h2 id="edition-heading">Une histoire, <em>trois façons de la découvrir.</em></h2><p class="edition-lead">Choisissez le texte original, la version française ou la version anglaise. Si une édition n’a pas été vérifiée, nous vous proposons une recherche clairement indiquée.</p><div class="edition-tabs" role="group" aria-label="Choisir la version du livre"></div><div class="edition-result" aria-live="polite"></div>';
anchor.before(outer);
const tabs=outer.querySelector(".edition-tabs"),result=outer.querySelector(".edition-result");
let current="original";
const escape=s=>String(s).replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[x]));
const tabsNames={original:"ORIGINAL",fr:"FRANÇAIS",en:"ANGLAIS"};
for(const slot of ["original","fr","en"]){const edition=book.editions[slot];const btn=document.createElement("button");btn.type="button";btn.className="edition-tab";btn.dataset.edition=slot;btn.setAttribute("aria-pressed",String(slot===current));btn.innerHTML='<span class="edition-tab-icon" aria-hidden="true">'+(slot==="original"?"✳":slot==="fr"?"FR":"EN")+'</span><span><strong>'+tabsNames[slot]+'</strong><small>'+escape(edition.language)+'</small></span>';tabs.appendChild(btn);}
function render(slot){
current=slot;const e=book.editions[slot];
tabs.querySelectorAll(".edition-tab").forEach(x=>x.setAttribute("aria-pressed",String(x.dataset.edition===slot)));
let link,status,explanation;
if(e.file){link="lire.html?id="+encodeURIComponent(book.id)+"&lang="+slot;status="Texte intégral dans LA MARGE";explanation="Cette édition est intégrée à notre liseuse, avec marque-page, thèmes et lecture sans compte.";}
else if(e.gutenberg){link="https://www.gutenberg.org/ebooks/"+e.gutenberg;status="Édition vérifiée chez Project Gutenberg";explanation="Le texte est disponible auprès de la bibliothèque libre Project Gutenberg. Il s'ouvrira sur leur site.";}
else{link="https://www.gutenberg.org/ebooks/search/?query="+encodeURIComponent(book.originalTitle+" "+book.author+" "+e.language);status="Traduction non vérifiée";explanation="Nous n'avons pas identifié de texte intégral pour cette version. Ce lien lance une recherche, sans garantie de disponibilité.";}
const target=e.file?"":' target="_blank" rel="noopener noreferrer"';
const action=e.file?"OUVRIR LA LISEUSE ↗":e.gutenberg?"CONSULTER CETTE ÉDITION ↗":"CHERCHER UNE ÉDITION ↗";
const dup=(slot!=="original"&&book.originalLanguage===e.lang)?" C'est la même langue que le texte original.":"";
const note=e.note?'<p class="edition-extra">'+escape(e.note)+'</p>':"";
result.innerHTML='<div><span class="edition-status">'+(e.file?"●":e.gutenberg?"◉":"○")+' '+escape(status)+'</span><h3>'+escape(e.title||book.title)+'</h3><p>'+escape(explanation+dup)+'</p>'+note+'</div><a class="btn '+(e.file?"btn-primary":"btn-outline")+'" href="'+escape(link)+'"'+target+'>'+action+'</a>';
}
tabs.addEventListener("click",ev=>{const btn=ev.target.closest("[data-edition]");if(btn)render(btn.dataset.edition);});
render(current);
})();
