(function readerApp(){
"use strict";
const $=s=>document.querySelector(s);
const books=window.LA_MARGE_BOOKS||[];
const currentId=new URLSearchParams(location.search).get("id")||"candide";
const book=books.find(b=>b.id===currentId);
const node=$("#reader-text");
if(!book || !book.fullText){
 $("#reader-title").textContent="Cette histoire n'est pas encore sur nos rayons.";
 node.textContent="Cette édition n'est pas disponible dans la liseuse intégrée. Retournez au catalogue pour découvrir les cinq textes intégraux proposés.";
 $("#reader-sidebar-title").textContent="Livre indisponible";
 for(const s of ["#reader-font-minus","#reader-font-plus","#reader-prev","#reader-next","#reader-jump","#reader-search"])$(s).disabled=true;
 return;
}
const storeKey="lamarge-reader-v1-"+book.id;
const setKey="lamarge-reader-settings";
const pref=(key,def)=>{try{const parsed=JSON.parse(localStorage.getItem(key)||"null");return parsed===null?def:parsed;}catch(_){return def;}};
const save=(key,val)=>{try{localStorage.setItem(key,JSON.stringify(val));}catch(_){}};
let settings=pref(setKey,{theme:"sepia",font:19});
if(!settings||typeof settings!=="object")settings={theme:"sepia",font:19};
settings.font=Math.max(15,Math.min(26,Number(settings.font)||19));
if(!["sepia","light","dark"].includes(settings.theme))settings.theme="sepia";
let pages=[],current=0,lastQuery="";
$("#reader-title").textContent=book.title;
$("#reader-author").textContent=book.author+" · "+book.year;
$("#reader-sidebar-title").textContent=book.title;
$("#reader-sidebar-author").textContent=book.author+" · "+book.year;
$("#reader-cover").src=book.cover;
$("#reader-cover").alt="Couverture de "+book.title;
$("#reader-download").href=book.fullText;
$("#reader-download").setAttribute("download",book.id+".txt");
$("#reader-source-link").href="https://www.gutenberg.org/ebooks/"+book.gutenberg;
document.title=book.title+" — Lire en ligne | LA MARGE";
function applySettings(){
document.documentElement.style.setProperty("--book-font",settings.font+"px");
document.body.dataset.theme=settings.theme;
document.querySelectorAll("[data-theme]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.theme===settings.theme)));
save(setKey,settings);
}
$("#reader-font-minus").addEventListener("click",()=>{settings.font=Math.max(15,settings.font-1);applySettings();});
$("#reader-font-plus").addEventListener("click",()=>{settings.font=Math.min(26,settings.font+1);applySettings();});
document.querySelectorAll("[data-theme]").forEach(b=>b.addEventListener("click",()=>{settings.theme=b.dataset.theme;applySettings();}));
applySettings();
function removeGutenbergFraming(raw){
 const normalized=raw.replace(/^\uFEFF/,"").replace(/\r\n?/g,"\n");
 const start=/\*\*\*\s*START OF (?:THIS |THE )?PROJECT GUTENBERG EBOOK[^\n]*\*\*\*/i.exec(normalized);
 const end=/\*\*\*\s*END OF (?:THIS |THE )?PROJECT GUTENBERG EBOOK[^\n]*\*\*\*/i.exec(normalized);
 if(!start || !end || end.index<=start.index)throw new Error("Marqueurs de texte intégral introuvables");
 return normalized.slice(start.index+start[0].length,end.index).trim();
}
function paginate(raw){
 const blocks=raw.split(/\n[ \t]*\n+/).map(p=>p.trim().replace(/(?<!\n)\n(?!\n)/g," ").replace(/[ \t]{2,}/g," ")).filter(Boolean);
 const result=[];
 let slice=[],length=0;
 const target=4300;
 function flush(){if(slice.length){result.push(slice);slice=[];length=0;}}
 for(const block of blocks){
  if(block.length>target*1.8){
    flush();
    let remaining=block;
    while(remaining.length>target*1.8){
      let cut=remaining.lastIndexOf(". ",target);
      if(cut<target*.45)cut=remaining.lastIndexOf(" ",target);
      if(cut<target*.45)cut=target;
      else cut+=1;
      result.push([remaining.slice(0,cut).trim()]);
      remaining=remaining.slice(cut).trim();
    }
    if(remaining){slice.push(remaining);length=remaining.length;}
    continue;
  }
  if(length+block.length>target&&slice.length)flush();
  slice.push(block);length+=block.length;
 }
 flush();
 return result;
}
function matches(paragraph,query){
 const term=query.trim();
 if(!term)return null;
 const i=paragraph.toLocaleLowerCase("fr").indexOf(term.toLocaleLowerCase("fr"));
 return i<0?null:i;
}
function paragraph(block){
 const p=document.createElement("p");
 if(block.length<90&&/^(?:(?:CHAPITRE|Chapitre|LIVRE)\b|[IVXLCDM]{1,10}(?:\.|\b)|[A-ZÀ-Ÿ][A-ZÀ-Ÿ \-’,.]{6,})/.test(block)){
 const h=document.createElement("h2");h.textContent=block;return h;
 }
 if(lastQuery){
  const index=matches(block,lastQuery);
  if(index!==null){
    p.append(document.createTextNode(block.slice(0,index)));
    const mark=document.createElement("mark");mark.textContent=block.slice(index,index+lastQuery.length);p.append(mark,document.createTextNode(block.slice(index+lastQuery.length)));
    return p;
  }
 }
 p.textContent=block;return p;
}
function go(index,focus=false){
 if(!pages.length)return;
 current=Math.max(0,Math.min(pages.length-1,Math.round(index)));
 const page=pages[current];
 node.replaceChildren(...page.map(paragraph));
 $("#reader-current").textContent=String(current+1).padStart(3,"0");
 $("#reader-total").textContent=String(pages.length).padStart(3,"0");
 $("#reader-overline").textContent="TEXTE INTÉGRAL / FEUILLET "+String(current+1).padStart(3,"0");
 $("#reader-jump").value=String(current);
 $("#reader-sidebar-progress").textContent=Math.round((current+1)/pages.length*100)+" % du texte parcouru";
 $("#reader-prev").disabled=current===0;
 $("#reader-next").disabled=current===pages.length-1;
 $("#reader-progress").style.width=((current+1)/pages.length*100).toFixed(2)+"%";
 save(storeKey,current);
 window.scrollTo({top:0,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});
 if(focus){$("#reader-paper").focus({preventScroll:true});}
}
$("#reader-prev").addEventListener("click",()=>go(current-1,true));
$("#reader-next").addEventListener("click",()=>go(current+1,true));
$("#reader-jump").addEventListener("change",e=>go(Number(e.target.value),true));
document.addEventListener("keydown",e=>{
 if(e.target.closest("input,select,textarea,button")||e.altKey||e.ctrlKey||e.metaKey)return;
 if(e.key==="ArrowRight"){e.preventDefault();go(current+1,true);}
 if(e.key==="ArrowLeft"){e.preventDefault();go(current-1,true);}
});
$("#reader-search-form").addEventListener("submit",e=>{
e.preventDefault();
const q=$("#reader-search").value.trim();const msg=$("#reader-search-result");
if(q.length<2){msg.textContent="Saisissez au moins deux caractères.";return;}
lastQuery=q;
let found=pages.findIndex((p,i)=>i>=current&&p.some(t=>t.toLocaleLowerCase("fr").includes(q.toLocaleLowerCase("fr"))));
if(found<0)found=pages.findIndex(p=>p.some(t=>t.toLocaleLowerCase("fr").includes(q.toLocaleLowerCase("fr"))));
if(found<0){msg.textContent="Aucun passage trouvé.";return;}
go(found,true);
msg.textContent="Passage trouvé au feuillet "+(found+1)+".";
});
fetch(book.fullText).then(res=>{if(!res.ok)throw new Error("Réponse HTTP "+res.status);return res.text();}).then(raw=>{
 if(raw.length<20000)throw new Error("Le fichier semble incomplet");
 const text=removeGutenbergFraming(raw);
 pages=paginate(text);
 if(!pages.length)throw new Error("Texte vide");
 const options=pages.map((_,i)=>{const o=document.createElement("option");o.value=String(i);o.textContent="Feuillet "+String(i+1).padStart(3,"0");return o;});
 $("#reader-jump").replaceChildren(...options);
 const stored=Number(pref(storeKey,0));
 go(Number.isFinite(stored)?stored:0);
}).catch(err=>{
 const offline=location.protocol==="file:";
 $("#reader-title").textContent="La lecture n'a pas pu s'ouvrir.";
 node.replaceChildren();
 const p=document.createElement("p");
 p.textContent=offline?"Pour lire les textes intégraux, lancez le site avec Live Server dans VS Code : les navigateurs bloquent souvent la lecture des fichiers voisins depuis file://.":"Impossible de charger ce texte pour le moment : "+err.message;
 const link=document.createElement("a");link.href=book.fullText;link.textContent="Ouvrir le texte brut directement →";link.className="reader-error-link";
 node.append(p,link);
 $("#reader-sidebar-progress").textContent="Lecture indisponible";
});
})();
