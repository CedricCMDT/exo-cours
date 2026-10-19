(function experience(){
"use strict";
const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const pointer=window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const progress=document.createElement("div");progress.id="reading-progress";progress.setAttribute("aria-hidden","true");document.body.appendChild(progress);
let scrollPending=false;
function progressUpdate(){scrollPending=false;const max=document.documentElement.scrollHeight-innerHeight;const percent=max<=0?0:Math.max(0,Math.min(100,(scrollY/max)*100));document.documentElement.style.setProperty("--page-progress",percent.toFixed(2)+"%");}
addEventListener("scroll",()=>{if(scrollPending)return;scrollPending=true;requestAnimationFrame(progressUpdate);},{passive:true});
addEventListener("resize",progressUpdate,{passive:true});progressUpdate();
if(pointer && !reduce){
const aura=document.createElement("div");aura.id="cursor-aura";aura.setAttribute("aria-hidden","true");document.body.appendChild(aura);document.body.classList.add("pointer-rich");
let pX=innerWidth/2,pY=innerHeight/2,frame=false;
addEventListener("pointermove",e=>{pX=e.clientX;pY=e.clientY;if(!frame){frame=true;requestAnimationFrame(()=>{document.documentElement.style.setProperty("--cursor-x",pX+"px");document.documentElement.style.setProperty("--cursor-y",pY+"px");frame=false;});}},{passive:true});
}
if(!reduce){
let navigating=false;
document.addEventListener("click",e=>{
  const a=e.target.closest("a[href]");
  if(!a||navigating||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.hasAttribute("download")||a.target==="_blank")return;
  const url=new URL(a.href,location.href);
  if(url.origin!==location.origin||url.pathname===location.pathname&&url.search===location.search&&url.hash)return;
  if(!url.pathname.endsWith(".html")||!location.pathname.endsWith(".html"))return;
  e.preventDefault();navigating=true;document.body.classList.add("is-exiting");setTimeout(()=>{location.href=url.href;},220);
});
addEventListener("pageshow",()=>{document.body.classList.remove("is-exiting");navigating=false;});
}
const fateBtn=document.getElementById("fate-pick");
const fate=document.getElementById("fate-result");
if(fateBtn && fate && Array.isArray(window.LA_MARGE_BOOKS)){
const historyKey="lamarge-last-pick";
fateBtn.addEventListener("click",()=>{
 const all=window.LA_MARGE_BOOKS;
 let last;try{last=localStorage.getItem(historyKey);}catch(_){}
 const available=all.filter(b=>b.id!==last);
 const list=available.length?available:all;
 const picked=list[Math.floor(Math.random()*list.length)];
 if(!picked)return;
 fate.querySelector(".fate-output").innerHTML=`<img class="fate-cover" src="${picked.cover}" alt="Couverture de ${picked.title}" width="93" height="135"><span class="fate-caption">VOTRE PROCHAINE AVENTURE</span><h3>${picked.title}</h3><p>${picked.author} · ${picked.year}</p><a href="livre.html?id=${encodeURIComponent(picked.id)}">DÉCOUVRIR CETTE HISTOIRE ↗</a>`;
 fate.classList.add("revealed-fate");
 fateBtn.textContent="TENTER UN AUTRE VOYAGE ↗";
 try{localStorage.setItem(historyKey,picked.id);}catch(_){}
});
}
})();
