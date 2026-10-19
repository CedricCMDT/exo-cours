(function salonInit(){
"use strict";
const dataset = window.LA_MARGE_SALON;
if(!dataset || document.body.dataset.page!=="salon")return;
const people = dataset.people;
const original = dataset.threads;
const byPerson = id => people.find(p=>p.id===id) || {id:"vous",name:"Vous",initials:"VO",color:"#a6875c",bio:"Lecteur de La Marge"};
const storagePrefix = "lamarge-salon-v2-";
const read = (name, fallback) => {try{const x=JSON.parse(localStorage.getItem(storagePrefix+name)||"null");return x===null?fallback:x;}catch(_){return fallback;}};
const save=(name,data)=>{try{localStorage.setItem(storagePrefix+name,JSON.stringify(data));return true;}catch(_){return false;}};
let likes = read("likes",[]);
if(!Array.isArray(likes))likes=[];
let own = read("threads",[]);
if(!Array.isArray(own))own=[];
own=own.filter(t=>t && typeof t.title==="string" && typeof t.body==="string").slice(0,30);
let replies=read("replies",{});
if(!replies||typeof replies!=="object"||Array.isArray(replies))replies={};
const all=()=>[...own,...original];
const getThread=id=>all().find(t=>t.id===id);
const esc=(v)=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const avatar=(id,small=false)=>{const p=byPerson(id);return `<span class="salon-avatar ${small?"small":""}" style="background:${esc(p.color)}" aria-hidden="true">${esc(p.initials)}</span>`;};
const friendly=(t)=>t.local?"Votre carnet":t.author==="vous"?"Vous":byPerson(t.author).name;
const totalReplies=t=>(t.replies?.length||0)+(Array.isArray(replies[t.id])?replies[t.id].length:0);
const button=(t)=>`<button class="thread-action ${likes.includes(t.id)?"liked":""}" type="button" data-like="${esc(t.id)}" aria-pressed="${likes.includes(t.id)}" aria-label="${likes.includes(t.id)?"Retirer ma réaction à":"Aimer"} : ${esc(t.title)}"><span class="heart-icon" aria-hidden="true">${likes.includes(t.id)?"♥":"♡"}</span><span>${(t.likes||0)+(likes.includes(t.id)?1:0)}</span></button>`;
const threadCard=t=>{
  const visitors=t.replies?.slice(0,3)||[];
  return `<article class="thread-card ${t.local?"thread-local":""}">
  <div class="thread-card-top"><div class="thread-card-author">${avatar(t.author)}<div><div class="thread-name">${esc(friendly(t))}${t.local?'<span class="thread-local-tag">VISIBLE PAR VOUS UNIQUEMENT</span>':""}</div><div class="thread-time">${esc(t.time)}</div></div></div><span class="thread-category">${esc(t.category)}</span></div>
  <h3><button type="button" data-thread="${esc(t.id)}">${esc(t.title)}</button></h3>
  <p class="thread-excerpt">${esc(t.body)}</p>
  <div class="thread-mini-replies">${visitors.map(r=>avatar(r.author,true)).join("")}<small>${totalReplies(t)} ${totalReplies(t)>1?"réponses":"réponse"} · ${esc(t.topic)}</small></div>
  <div class="thread-actions">${button(t)}<button class="thread-action reply-open" type="button" data-thread="${esc(t.id)}">LIRE LA CONVERSATION <span aria-hidden="true">↗</span></button></div>
  </article>`;
};
const root=document.querySelector("#salon-feed");
const filters=document.querySelector("#salon-filters");
const search=document.querySelector("#salon-search");
const sort=document.querySelector("#salon-sort");
const dialog=document.querySelector("#salon-thread-dialog");
const compose=document.querySelector("#salon-compose-dialog");
const info=document.querySelector("#salon-count");
let genre="Tous", currentThread=null,lastTrigger=null;
const topics=["Tous","Débat","Question","Émotions","Coup de cœur","Journal de lecture","Mon carnet"];
filters.innerHTML=topics.map(x=>`<button type="button" class="salon-filter" data-filter="${esc(x)}" aria-pressed="${x==="Tous"}">${esc(x)}</button>`).join("");
const norm=s=>String(s).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
function render(){
  const term=norm(search.value).trim();
  let threads=all().filter(t=>(genre==="Tous" || t.category===genre) && norm([t.title,t.body,t.topic,byPerson(t.author).name,...(t.replies||[]).map(r=>r.text)].join(" ")).includes(term));
  const mode=sort.value;
  if(mode==="popular")threads.sort((a,b)=>(b.likes||0)+(likes.includes(b.id)?1:0)-(a.likes||0)-(likes.includes(a.id)?1:0));
  else if(mode==="discussion")threads.sort((a,b)=>totalReplies(b)-totalReplies(a));
  else threads.sort((a,b)=>all().indexOf(a)-all().indexOf(b));
  root.innerHTML=threads.map(threadCard).join("");
  if(!threads.length)root.innerHTML='<div class="salon-emptiness"><span>⌕</span><h3>Pas un murmure.</h3><p>Essayez un autre mot ou une autre catégorie.</p></div>';
  info.textContent=threads.length+" CONVERSATION"+(threads.length>1?"S":"");
}
function filterChange(value){
  genre=value;
  filters.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.filter===value)));
  render();
}
filters.addEventListener("click",e=>{const btn=e.target.closest("[data-filter]");if(btn)filterChange(btn.dataset.filter);});
search.addEventListener("input",render);
sort.addEventListener("change",render);
function dismiss(d){if(d.open)d.close(); if(lastTrigger?.isConnected)lastTrigger.focus();lastTrigger=null;}
function popup(d,trigger){lastTrigger=trigger;if(typeof d.showModal==="function")d.showModal();else d.setAttribute("open","");}
function notice(text){const el=document.querySelector("#toast");if(!el)return;el.textContent=text;el.classList.add("visible");clearTimeout(notice.timer);notice.timer=setTimeout(()=>el.classList.remove("visible"),3000);}
function openThread(id,trigger){
  const t=getThread(id);
  if(!t)return;
  currentThread=id;
  const p=byPerson(t.author);
  document.querySelector("#salon-dialog-kicker").textContent=(t.local?"VOTRE CARNET":t.topic.toUpperCase())+" / LE SALON";
  document.querySelector("#salon-dialog-title").textContent=t.title;
  document.querySelector("#salon-dialog-meta").innerHTML=`${avatar(t.author)}<div><strong>${esc(p.name)}</strong><small>${esc(t.time)}</small></div><span class="salon-dialog-topic">${esc(t.category)}</span>`;
  document.querySelector("#salon-dialog-story").textContent=t.body;
  const base=t.replies||[];
  const visitor=(Array.isArray(replies[id])?replies[id]:[]).filter(x=>typeof x.text==="string").slice(0,60);
  document.querySelector("#salon-dialog-replies-title").textContent=base.length+visitor.length+" réponse"+(base.length+visitor.length>1?"s":"");
  document.querySelector("#salon-dialog-replies").innerHTML=[...base.map(r=>({...r,local:false})),...visitor.map(r=>({...r,author:"vous",local:true}))].map(r=>`<div class="salon-reply ${r.local?"mini-local":""}">${avatar(r.author)}<div class="salon-reply-body"><div class="salon-reply-meta">${esc(byPerson(r.author).name)} ${r.local?'<span class="salon-reply-small">· NOTE LOCALE</span>':""}</div><div class="salon-reply-text">${esc(r.text)}</div></div></div>`).join("") || '<p class="salon-reply-text">Soyez la première personne à laisser une note.</p>';
  const form=document.querySelector("#salon-reply-form");
  form.reset();
  document.querySelector("#salon-reply-count").textContent="0 / 500";
  popup(dialog,trigger);
}
document.addEventListener("click",e=>{
  const like=e.target.closest("[data-like]");
  if(like){const id=like.dataset.like;likes=likes.includes(id)?likes.filter(x=>x!==id):[...likes,id];save("likes",likes);render();return;}
  const thread=e.target.closest("[data-thread]");
  if(thread){openThread(thread.dataset.thread,thread);return;}
  const open=e.target.closest("#salon-open-compose");
  if(open){document.querySelector("#salon-compose-form").reset();document.querySelector("#salon-compose-count").textContent="0 / 1000";popup(compose,open);return;}
  const close=e.target.closest("[data-close-dialog]");
  if(close){const d=close.closest("dialog");if(d)dismiss(d);}
});
dialog.addEventListener("close",()=>{if(lastTrigger?.isConnected)lastTrigger.focus();});
compose.addEventListener("close",()=>{if(lastTrigger?.isConnected)lastTrigger.focus();});
const replyArea=document.querySelector("#salon-reply-text");
replyArea.addEventListener("input",()=>document.querySelector("#salon-reply-count").textContent=replyArea.value.length+" / 500");
document.querySelector("#salon-reply-form").addEventListener("submit",e=>{
 e.preventDefault();if(!currentThread)return;
 const text=replyArea.value.trim();
 if(text.length<3||text.length>500){notice("Votre réponse doit contenir entre 3 et 500 caractères.");return;}
 const arr=Array.isArray(replies[currentThread])?replies[currentThread]:[];
 if(arr.length>=60){notice("Limite de notes atteinte sur cette discussion.");return;}
 replies[currentThread]=[...arr,{text,author:"vous"}];
 if(!save("replies",replies)){notice("Le stockage local est indisponible : votre note peut disparaître.");}
 const active=currentThread;
 render();
 openThread(active,document.querySelector(`[data-thread="${CSS.escape(active)}"]`));
 const list=document.querySelector("#salon-dialog-replies");
 list.lastElementChild?.scrollIntoView({block:"nearest",behavior:"smooth"});
 notice("Votre note est visible uniquement sur ce navigateur.");
});
const titleInput=document.querySelector("#salon-compose-title");
const bodyInput=document.querySelector("#salon-compose-body");
bodyInput.addEventListener("input",()=>document.querySelector("#salon-compose-count").textContent=bodyInput.value.length+" / 1000");
document.querySelector("#salon-compose-form").addEventListener("submit",e=>{
 e.preventDefault();
 const title=titleInput.value.trim(),body=bodyInput.value.trim();
 if(title.length<6||title.length>110||body.length<10||body.length>1000){notice("Titre : 6 à 110 caractères. Texte : 10 à 1000.");return;}
 if(own.length>=30){notice("Votre carnet contient déjà 30 discussions.");return;}
 const entry={id:"note-"+Date.now(),author:"vous",local:true,topic:"Entre lecteurs",category:"Mon carnet",title,body,time:"Votre note",likes:0,replies:[]};
 own.unshift(entry);
 if(!save("threads",own)){own.shift();notice("Stockage local indisponible : note non enregistrée.");return;}
 dismiss(compose);filterChange("Tous");search.value="";sort.value="recent";render();
 notice("Note ajoutée à votre carnet privé.");
 document.querySelector("#salon-feed")?.scrollIntoView({behavior:"smooth",block:"start"});
});
const u=new URLSearchParams(location.search).get("thread");
if(u && getThread(u))openThread(u,document.querySelector(`[data-thread="${CSS.escape(u)}"]`));
render();
})();
