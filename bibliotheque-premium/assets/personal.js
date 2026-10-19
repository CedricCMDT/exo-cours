(function personalLibrary(){
"use strict";
const books=window.LA_MARGE_BOOKS||[];
const ids=new Set(books.map(book=>book.id));
const page=document.body.dataset.page;
if(!["livre","favoris"].includes(page))return;
const KEYS={favorites:"lamarge-favorites-v1",reading:"lamarge-reading-status-v1",notes:"lamarge-notes-v1",ratings:"lamarge-ratings-v1"};
const labels={"a-lire":"À lire","en-cours":"En cours","termine":"Terminé"};
function read(key,fallback){try{const value=JSON.parse(localStorage.getItem(key)||"null");return value===null?fallback:value;}catch(_){return fallback;}}
function write(key,value){localStorage.setItem(key,JSON.stringify(value));}
function safe(text){return String(text||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function validObject(value){return value&&typeof value==="object"&&!Array.isArray(value)?value:{};}
function usableNotes(obj){return Object.fromEntries(Object.entries(validObject(obj)).filter(([id,n])=>ids.has(id)&&typeof n==="string").map(([id,n])=>[id,n.slice(0,5000)]));}
function usableRatings(obj){return Object.fromEntries(Object.entries(validObject(obj)).filter(([id,n])=>ids.has(id)&&Number.isInteger(n)&&n>=1&&n<=5));}
const getNotes=()=>usableNotes(read(KEYS.notes,{}));
const getRatings=()=>usableRatings(read(KEYS.ratings,{}));
function bookDetail(){
 const id=new URLSearchParams(location.search).get("id")||"moby-dick",book=books.find(b=>b.id===id);
 const destination=document.querySelector(".detail-copy");
 if(!book||!destination)return;
 const root=document.createElement("section");root.className="personal-book-journal";
 root.innerHTML='<p class="eyebrow">VOTRE CARNET PRIVÉ</p><h2>Ma lecture, <em>mes impressions.</em></h2><p>Attribuez une note et écrivez ce que ce livre vous inspire. Tout reste sur cet appareil.</p><div class="personal-rating" role="group" aria-label="Ma note sur cinq étoiles"><span>MON ÉVALUATION</span><div class="personal-stars"></div><button type="button" class="personal-clear-rating">Effacer</button></div><label class="personal-note-label" for="personal-book-note">MA NOTE PERSONNELLE</label><textarea id="personal-book-note" maxlength="5000" rows="5" placeholder="Une citation, un ressenti, une analyse, un souvenir de lecture…"></textarea><div class="personal-note-actions"><span id="personal-note-status" role="status"></span><button type="button" class="personal-save-note">ENREGISTRER MA NOTE ↗</button></div>';
 destination.append(root);
 const field=root.querySelector("textarea"),stars=root.querySelector(".personal-stars"),status=root.querySelector("#personal-note-status");
 field.value=getNotes()[id]||"";
 let rating=getRatings()[id]||0;
 function renderStars(){
  stars.replaceChildren();
  for(let n=1;n<=5;n++){
   const star=document.createElement("button");star.type="button";star.dataset.rating=String(n);
   star.textContent=n<=rating?"★":"☆";star.title=n+" étoile"+(n>1?"s":"");
   star.setAttribute("aria-label",n+" étoile"+(n>1?"s":"")+" sur 5");
   star.setAttribute("aria-pressed",String(n===rating));
   stars.append(star);
  }
 }
 stars.addEventListener("click",event=>{
  const button=event.target.closest("button[data-rating]");if(!button)return;
  rating=Number(button.dataset.rating);
  try{const saved=getRatings();saved[id]=rating;write(KEYS.ratings,saved);renderStars();status.textContent="Évaluation enregistrée.";}
  catch(_){status.textContent="Le navigateur n’autorise pas l’enregistrement.";rating=getRatings()[id]||0;renderStars();}
 });
 root.querySelector(".personal-clear-rating").addEventListener("click",()=>{
  try{const saved=getRatings();delete saved[id];write(KEYS.ratings,saved);rating=0;renderStars();status.textContent="Évaluation effacée.";}
  catch(_){status.textContent="Enregistrement impossible.";}
 });
 root.querySelector(".personal-save-note").addEventListener("click",()=>{
  try{const saved=getNotes(),value=field.value.trim();if(value)saved[id]=value;else delete saved[id];write(KEYS.notes,saved);status.textContent=value?"Note sauvegardée sur cet appareil.":"Note personnelle effacée.";}
  catch(_){status.textContent="Le stockage local est indisponible.";}
 });
 renderStars();
}
function collectionTools(){
 const main=document.querySelector(".favorite-section");
 if(!main)return;
 const root=document.createElement("section");root.className="personal-collection-tools";
 root.innerHTML='<div class="personal-tools-title"><div><p class="eyebrow">SAUVEGARDE DE VOTRE BIBLIOTHÈQUE</p><h2>Votre carnet, <em>à votre image.</em></h2><p>Retrouvez vos évaluations et annotations, et sauvegardez vos favoris et votre progression dans un fichier JSON.</p></div><div class="personal-backup-actions"><button type="button" id="personal-export">EXPORTER MA BIBLIOTHÈQUE ↓</button><label class="personal-import-label" for="personal-import">IMPORTER UNE SAUVEGARDE ↑</label><input id="personal-import" type="file" accept=".json,application/json"></div></div><p class="personal-file-status" id="personal-file-status" role="status"></p><div class="personal-entries" id="personal-entries"></div>';
 main.prepend(root);
 const status=root.querySelector("#personal-file-status");
 function entries(){
  const notes=getNotes(),ratings=getRatings(),selected=books.filter(b=>notes[b.id]||ratings[b.id]);
  const target=root.querySelector("#personal-entries");
  if(!selected.length){target.innerHTML='<p class="personal-entry-empty">Aucune note ou évaluation pour le moment. Ouvrez la fiche d’un livre pour commencer votre carnet.</p>';return;}
  target.innerHTML='<h3>NOTES ET ÉVALUATIONS <span>'+selected.length+' OUVRAGE'+(selected.length>1?"S":"")+'</span></h3><div class="personal-entry-list">'+selected.map(b=>'<article class="personal-entry"><div><a href="livre.html?id='+encodeURIComponent(b.id)+'">'+safe(b.title)+'</a><small>'+safe(b.author)+'</small></div><span class="personal-entry-stars" aria-label="'+(ratings[b.id]||0)+' étoiles sur 5">'+(ratings[b.id]?"★".repeat(ratings[b.id])+"☆".repeat(5-ratings[b.id]):"NON NOTÉ")+'</span>'+(notes[b.id]?'<p>'+safe(notes[b.id].slice(0,240))+(notes[b.id].length>240?"…":"")+'</p>':"")+'</article>').join("")+'</div>';
 }
 entries();
 root.querySelector("#personal-export").addEventListener("click",()=>{
  const payload={application:"LA MARGE",version:1,exportedAt:new Date().toISOString(),
   favorites:(Array.isArray(read(KEYS.favorites,[]))?read(KEYS.favorites,[]):[]).filter(id=>ids.has(id)),
   reading:Object.fromEntries(Object.entries(validObject(read(KEYS.reading,{}))).filter(([id,v])=>ids.has(id)&&labels[v])),
   notes:getNotes(),ratings:getRatings()};
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json;charset=utf-8"});
  const url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download="la-marge-sauvegarde.json";document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  status.textContent="Sauvegarde générée. Conservez ce fichier en lieu sûr.";
 });
 root.querySelector("#personal-import").addEventListener("change",async event=>{
  const file=event.target.files[0];if(!file)return;
  try{
   if(file.size>2_000_000)throw Error("Le fichier est trop volumineux (limite : 2 Mo).");
   const data=JSON.parse(await file.text());
   if(data.application!=="LA MARGE"||data.version!==1)throw Error("Ce fichier n'est pas une sauvegarde LA MARGE compatible.");
   const favorites=[...new Set((Array.isArray(data.favorites)?data.favorites:[]).filter(id=>ids.has(id)))];
   const reading=Object.fromEntries(Object.entries(validObject(data.reading)).filter(([id,v])=>ids.has(id)&&labels[v]));
   const notes=usableNotes(data.notes),ratings=usableRatings(data.ratings);
   if(!confirm("Importer cette sauvegarde remplacera vos favoris, lectures, notes et évaluations actuels sur ce navigateur. Continuer ?")){status.textContent="Importation annulée.";return;}
   write(KEYS.favorites,favorites);write(KEYS.reading,reading);write(KEYS.notes,notes);write(KEYS.ratings,ratings);
   location.reload();
  }catch(err){status.textContent=err.message||"Impossible de lire la sauvegarde.";}
  finally{event.target.value="";}
 });
}
if(page==="livre")bookDetail();
if(page==="favoris")collectionTools();
})();
