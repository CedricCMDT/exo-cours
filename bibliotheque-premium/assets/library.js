(function(){
"use strict";
const books=window.LA_MARGE_BOOKS||[];
const byId=id=>books.find(book=>book.id===id);
const key="lamarge-reading-status-v1";
const labels={"a-lire":"À lire","en-cours":"En cours","termine":"Terminé"};
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function load(){try{const raw=JSON.parse(localStorage.getItem(key)||"{}");return raw&&typeof raw==="object"&&!Array.isArray(raw)?raw:{};}catch(_){return {};}}
let shelf=load();
function store(){try{localStorage.setItem(key,JSON.stringify(shelf));return true;}catch(_){return false;}}
function status(id){return labels[shelf[id]]?shelf[id]:"";}
function update(id,newStatus){
 const previous=shelf[id];
 if(labels[newStatus])shelf[id]=newStatus;else delete shelf[id];
 if(!store()){if(previous)shelf[id]=previous;else delete shelf[id];return false;}
 return true;
}
function decorateBook(){
 const id=new URLSearchParams(location.search).get("id")||"moby-dick";
 const book=byId(id),target=document.querySelector(".detail-copy");
 if(!book||!target)return;
 const box=document.createElement("section");box.className="personal-shelf-panel";
 box.innerHTML='<p class="eyebrow">VOTRE BIBLIOTHÈQUE PERSONNELLE</p><h2>Gardez cette histoire <em>près de vous.</em></h2><p>Enregistrez votre progression de lecture. Votre étagère reste privée et disponible dans ce navigateur.</p><label for="shelf-status">MON STATUT DE LECTURE</label><select id="shelf-status"><option value="">Pas encore classé</option><option value="a-lire">À lire</option><option value="en-cours">En cours</option><option value="termine">Terminé</option></select><small id="shelf-feedback" role="status"></small>';
 const actions=target.querySelector(".detail-actions");
 if(actions)actions.after(box);else target.append(box);
 const select=box.querySelector("select");
 select.value=status(id);
 select.addEventListener("change",()=>{
   const desired=select.value;
   if(update(id,desired)){box.querySelector("#shelf-feedback").textContent=desired?"Classé : "+labels[desired]+".":"Statut de lecture effacé.";}
   else{select.value=status(id);box.querySelector("#shelf-feedback").textContent="Stockage local indisponible.";}
 });
}
function decorateFavorites(){
 const area=document.querySelector(".favorite-section");
 if(!area)return;
 const panel=document.createElement("section");panel.className="reading-dashboard";
 area.prepend(panel);
 let currentFilter="Tous";
 function render(){
  const selected=Object.entries(shelf).filter(([id,val])=>byId(id)&&labels[val]).map(([id,val])=>({...byId(id),shelfStatus:val}));
  const counts={"a-lire":0,"en-cours":0,"termine":0};selected.forEach(b=>counts[b.shelfStatus]++);
  const list=currentFilter==="Tous"?selected:selected.filter(b=>b.shelfStatus===currentFilter);
  panel.innerHTML='<div class="reading-dashboard-top"><div><p class="eyebrow">LA BIBLIOTHÈQUE QUE VOUS CONSTRUISEZ</p><h2>Mon journal <em>de lecture.</em></h2></div><span class="reading-total">'+selected.length+' LIVRE'+(selected.length>1?"S":"")+' CLASSÉ'+(selected.length>1?"S":"")+'</span></div>'+
  '<div class="reading-metrics"><button data-filter="Tous" type="button" class="'+(currentFilter==="Tous"?"selected":"")+'"><strong>'+selected.length+'</strong><span>TOUS</span></button>'+
  Object.entries(labels).map(([id,name])=>'<button data-filter="'+id+'" type="button" class="'+(currentFilter===id?"selected":"")+'"><strong>'+counts[id]+'</strong><span>'+esc(name.toUpperCase())+'</span></button>').join("")+'</div>'+
  (list.length?'<div class="reading-entries">'+list.map(b=>'<div class="reading-entry"><div><span class="reading-entry-category">'+esc(b.genre)+' / '+esc(labels[b.shelfStatus])+'</span><a href="livre.html?id='+encodeURIComponent(b.id)+'">'+esc(b.title)+'</a><small>'+esc(b.author)+'</small></div><button type="button" data-remove="'+esc(b.id)+'" aria-label="Retirer '+esc(b.title)+' du journal">RETIRER ×</button></div>').join("")+'</div>':'<p class="reading-empty">Aucun livre dans cette rubrique. Ouvrez la fiche d’un livre et choisissez « À lire », « En cours » ou « Terminé » pour le classer.</p>');
 }
 panel.addEventListener("click",e=>{
 const filter=e.target.closest("[data-filter]");
 if(filter){currentFilter=filter.dataset.filter;render();return;}
 const remove=e.target.closest("[data-remove]");
 if(remove){if(update(remove.dataset.remove,""))render();return;}
 });
 render();
}
function paintCatalog(){
 const grid=document.getElementById("catalogue-grid");
 if(!grid)return;
 const decorate=()=>{
   grid.querySelectorAll(".book-card").forEach(card=>{
     const a=card.querySelector('h3 a[href*="livre.html?id="]');
     if(!a)return;
     const id=new URL(a.href,location.href).searchParams.get("id"),st=status(id);
     let pill=card.querySelector(".shelf-mini-status");
     if(!st){if(pill)pill.remove();return;}
     if(!pill){pill=document.createElement("span");pill.className="shelf-mini-status";card.querySelector(".book-information")?.prepend(pill);}
     pill.textContent=labels[st];
   });
 };
 let scheduled=false;
 const observer=new MutationObserver(()=>{if(scheduled)return;scheduled=true;queueMicrotask(()=>{scheduled=false;observer.disconnect();decorate();observer.observe(grid,{childList:true});});});
 decorate();observer.observe(grid,{childList:true});
}
if(document.body.dataset.page==="livre")decorateBook();
if(document.body.dataset.page==="favoris")decorateFavorites();
if(document.body.dataset.page==="catalogue")paintCatalog();
})();