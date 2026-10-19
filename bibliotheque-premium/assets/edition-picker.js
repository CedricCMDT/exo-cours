(function editionPicker(){
"use strict";
if(document.body.dataset.page!=="livre")return;
const id=new URLSearchParams(location.search).get("id")||"moby-dick";
const book=(window.LA_MARGE_BOOKS||[]).find(b=>b.id===id);
const anchor=document.querySelector(".detail-actions");
if(!book||!anchor||!book.editions)return;
const root=document.createElement("section");
root.className="edition-selector";root.setAttribute("aria-labelledby","edition-heading");
root.innerHTML='<p class="eyebrow">ÉDITIONS, TRADUCTIONS ET LECTURE</p><h2 id="edition-heading">Une histoire, <em>trois langues à explorer.</em></h2><p class="edition-lead">Original, français ou anglais : choisissez votre édition. Si aucun texte publié n’est disponible mais que nous hébergeons une version source, vous pouvez essayer une traduction automatique directement dans la liseuse.</p><div class="edition-tabs" role="group" aria-label="Choisir la version du livre"></div><div class="edition-result" aria-live="polite"></div>';
anchor.before(root);
const tabs=root.querySelector(".edition-tabs"),result=root.querySelector(".edition-result");
const names={original:"ORIGINAL",fr:"FRANÇAIS",en:"ANGLAIS"};
const safe=v=>String(v??"").replace(/[&<>"']/g,s=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[s]));
const viable=["fr","en","es","de","it","ru"];
const findSource=e=>[book.editions.original,book.editions.fr,book.editions.en].find(s=>s?.file&&s.lang!==e.lang&&viable.includes(s.lang)&&viable.includes(e.lang));
for(const slot of ["original","fr","en"]){
 const e=book.editions[slot],button=document.createElement("button");
 button.className="edition-tab";button.dataset.edition=slot;button.type="button";
 button.setAttribute("aria-pressed",String(slot==="original"));
 button.innerHTML='<span class="edition-tab-icon" aria-hidden="true">'+(slot==="original"?"✳":slot.toUpperCase())+'</span><span><strong>'+names[slot]+'</strong><small>'+safe(e.language)+'</small></span>';
 tabs.append(button);
}
function render(slot){
 const e=book.editions[slot],source=findSource(e);
 tabs.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.edition===slot))); 
 if(book.copyrighted){
   const query=encodeURIComponent((slot==="original"?book.originalTitle:book.title)+" "+book.author);
   result.innerHTML='<div class="edition-protected"><strong>ŒUVRE SOUS DROITS — FICHE DE DÉCOUVERTE</strong><p>Cette œuvre n’est pas librement reproductible. LA MARGE conserve sa notice et ses favoris, sans proposer son texte intégral ni de traduction illégale. Pour lire dans cette langue, cherchez une édition publiée en librairie ou en bibliothèque.</p></div><div><span class="edition-status">VERSION '+safe(e.language.toUpperCase())+'</span><h3>'+safe(slot==="original"?book.originalTitle:book.title)+'</h3><p>Pas de lecture intégrale gratuite sur ce site pour ce titre.</p></div><div class="edition-choices"><a class="btn btn-outline" href="https://openlibrary.org/search?q='+query+'" target="_blank" rel="noopener noreferrer">RECHERCHER EN BIBLIOTHÈQUE ↗</a></div>';
   return;
 }
 if(book.id==="ddhc-1789"){
   const original=slot!=="en",status=original?"Document officiel français":"Traduction anglaise non intégrée";
   result.innerHTML='<div><span class="edition-status">✳ '+safe(status)+'</span><h3>'+safe(book.title)+'</h3><p>La Déclaration est consultable intégralement sur Légifrance. LA MARGE donne priorité à cette source officielle plutôt qu’à une copie non vérifiée.</p></div><div class="edition-choices"><a class="btn btn-primary" href="'+safe(book.sourceUrl)+'" target="_blank" rel="noopener noreferrer">VOIR LE TEXTE OFFICIEL ↗</a></div>';
   return;
 }

 const local=Boolean(e.file),external=Boolean(e.gutenberg);
 const duplicate=slot!=="original"&&book.originalLanguage===e.lang?" Cette version correspond à la langue originale.":"";
 const note=e.note?'<p class="edition-extra">'+safe(e.note)+'</p>':"";
 let status,explanation,buttons;
 if(local){
   status="Texte intégral dans LA MARGE";
   explanation="Cette édition complète est déjà disponible dans notre liseuse."+duplicate;
   buttons='<a class="btn btn-primary" href="lire.html?id='+encodeURIComponent(book.id)+'&lang='+slot+'">LIRE CETTE ÉDITION ↗</a>';
 }else{
   status=external?"Édition publiée sur Project Gutenberg":"Aucune traduction publiée vérifiée";
   explanation=external?"Une édition libre est répertoriée par Project Gutenberg. Téléchargez un fichier .txt depuis sa page pour le lire dans LA MARGE avec la liseuse et votre marque-page. Une traduction automatique expérimentale est également possible dans certains cas.":"Nous n’avons pas d’édition complète vérifiée dans cette langue. Nous pouvons tenter une traduction automatique du texte source lorsqu’il est hébergé localement.";
   buttons="";
   if(source){
     const link="lire.html?id="+encodeURIComponent(book.id)+"&lang="+slot+"&translate=1";
     buttons+='<a class="btn btn-primary" href="'+safe(link)+'">TRADUIRE ET LIRE ICI ↗</a>';
     explanation+=" Traduction IA expérimentale, effectuée feuillet par feuillet, nécessitant un navigateur compatible et un modèle de langue local.";
   }
   if(external){
     buttons+='<a class="btn btn-primary" href="lire.html?id='+encodeURIComponent(book.id)+'&lang='+slot+'">OUVRIR DANS LA LISEUSE (.TXT) ↗</a><a class="btn btn-outline" href="https://www.gutenberg.org/ebooks/'+encodeURIComponent(e.gutenberg)+'" target="_blank" rel="noopener noreferrer">RÉCUPÉRER L’ÉDITION LIBRE ↗</a>';
   }else{
     const q=encodeURIComponent((book.originalTitle||book.title)+" "+book.author+" "+e.language);
     buttons+='<a class="edition-search-link" href="https://www.gutenberg.org/ebooks/search/?query='+q+'" target="_blank" rel="noopener noreferrer">RECHERCHER UNE ÉDITION ↗</a>';
   }
 }
 if(!source&&!local&&!external)explanation+=" La traduction par IA n'est pas encore possible ici : la version source complète doit d'abord être intégrée.";
 result.innerHTML='<div><span class="edition-status">✳ '+safe(status)+'</span><h3>'+safe(e.title||book.title)+'</h3><p>'+safe(explanation+duplicate)+'</p>'+note+'</div><div class="edition-choices">'+buttons+'</div>';
}
tabs.addEventListener("click",event=>{const button=event.target.closest("[data-edition]");if(button)render(button.dataset.edition);});
render("original");
})();