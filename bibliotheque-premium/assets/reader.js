(function readerApp() {
"use strict";
const $ = selector => document.querySelector(selector);
const books = window.LA_MARGE_BOOKS || [];
const params = new URLSearchParams(location.search);
const bookId = params.get("id") || "candide";
const book = books.find(b => b.id === bookId);
const slot = ["original","fr","en"].includes(params.get("lang")) ? params.get("lang") : "original";
const edition = book?.editions?.[slot] || null;
const sourceEdition = book ? [book.editions?.original,book.editions?.fr,book.editions?.en].find(x => x?.file && x.lang !== edition?.lang) : null;
const translationRequested = params.get("translate") === "1";
const sourceLang = sourceEdition?.lang;
const targetLang = edition?.lang;
const translationMode = Boolean(book && edition && !edition.file && translationRequested && sourceEdition && sourceLang !== targetLang);
const fileToRead = translationMode ? sourceEdition.file : edition?.file || null;
const canAutoTranslate = lang => ["fr","en","de","es","ru","it"].includes(lang);
const pageEl = $("#reader-text");
const storage = key => {try {return JSON.parse(localStorage.getItem(key)||"null");}catch(_) {return null;}};
const save = (key,value) => {try {localStorage.setItem(key,JSON.stringify(value));}catch(_) {}};
let settings = storage("lamarge-reader-settings") || {theme:"sepia",font:19};
if(typeof settings!=="object" || !settings)settings={theme:"sepia",font:19};
settings.font=Math.max(15,Math.min(26,Number(settings.font)||19));
if(!["sepia","light","dark"].includes(settings.theme))settings.theme="sepia";
let pages=[],index=0,query="",model=null,job=0,loadState="loading";
const cache=new Map();
const lastPageKey="lamarge-reader-v2-"+bookId+"-"+slot+"-"+(translationMode?"machine":"edition");
const filename=translationMode ? null:fileToRead;
if(!book || !edition || !fileToRead) {
  $("#reader-title").textContent="Édition indisponible";
  pageEl.textContent="Cette édition complète n'est pas encore hébergée ici. Choisissez une édition vérifiée ou revenez à la fiche du livre.";
  $("#reader-sidebar-title").textContent="Pas de livre chargé";
  for(const s of ["#reader-prev","#reader-next","#reader-jump","#reader-search","#reader-font-minus","#reader-font-plus"])$(s).disabled=true;
  if(book){const a=document.createElement("a");a.href="livre.html?id="+encodeURIComponent(book.id);a.textContent="Voir les trois éditions possibles →";a.className="reader-error-link";pageEl.append(a);}
  return;
}
document.title = (edition.title||book.title)+" — "+(edition.language||"")+" | LA MARGE";
$("#reader-title").textContent=edition.title||book.title;
$("#reader-author").textContent=book.author+" · "+(Number.isFinite(book.year)?book.year:"édition libre");
$("#reader-sidebar-title").textContent=book.title;
$("#reader-sidebar-author").textContent=book.author+" · "+(Number.isFinite(book.year)?book.year:"édition libre")+" · "+(edition.language||"");
$("#reader-cover").src=book.cover;
$("#reader-cover").alt="Couverture de "+book.title;
$("#reader-download").href=translationMode ? sourceEdition.file : filename;
$("#reader-download").download=book.id+"-"+(translationMode?sourceLang:targetLang)+".txt";
$("#reader-download").textContent=translationMode ? "TÉLÉCHARGER LE TEXTE ORIGINAL ↓" : "TÉLÉCHARGER LE TEXTE INTÉGRAL ↓";
$("#reader-source-link").href="https://www.gutenberg.org/ebooks/"+(translationMode?sourceEdition.gutenberg:edition.gutenberg);
const languageBox=document.createElement("div");
languageBox.className="reader-language-box";
languageBox.innerHTML='<p class="reader-language-title">CHOISIR UNE ÉDITION</p>';
for(const choice of ["original","fr","en"]){
 const e=book.editions[choice];if(!e)continue;
 const a=document.createElement("a");
 a.className="reader-language-link"+(slot===choice?" selected":"");
 a.textContent=(choice==="original"?"ORIGINAL":choice==="fr"?"FRANÇAIS":"ANGLAIS")+" · "+(e.file?"SUR LE SITE":e.gutenberg?"GUTENBERG":"NON VÉRIFIÉ");
 if(e.file)a.href="lire.html?id="+encodeURIComponent(book.id)+"&lang="+choice;
 else if(e.gutenberg){a.href="https://www.gutenberg.org/ebooks/"+e.gutenberg;a.target="_blank";a.rel="noopener noreferrer";}
 else if(sourceEdition && sourceEdition.lang!==e.lang && canAutoTranslate(sourceEdition.lang)&&canAutoTranslate(e.lang))a.href="lire.html?id="+encodeURIComponent(book.id)+"&lang="+choice+"&translate=1";
 else {a.href="livre.html?id="+encodeURIComponent(book.id);a.title="Revenir à la fiche pour chercher une édition";}
 if(choice===slot)a.setAttribute("aria-current","page");
 languageBox.appendChild(a);
}
document.querySelector(".reader-aside-top").after(languageBox);
if(translationMode){
 const tag=document.createElement("div");tag.className="machine-disclaimer";
 tag.innerHTML='<strong>TRADUCTION IA À LA DEMANDE</strong><p>Cette traduction est générée par le navigateur, feuillet après feuillet. Elle n’est pas une édition littéraire relue, et peut comporter des erreurs. Un modèle de langue pourra être téléchargé sur cet appareil.</p>';
 document.querySelector(".reader-options").after(tag);
 $("#reader-search").placeholder="Chercher dans les feuillets déjà traduits…";
}
function applySettings(){
 document.documentElement.style.setProperty("--book-font",settings.font+"px");
 document.body.dataset.theme=settings.theme;
 document.querySelectorAll("[data-theme]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.theme===settings.theme)));
 save("lamarge-reader-settings",settings);
}
$("#reader-font-minus").addEventListener("click",()=>{settings.font=Math.max(15,settings.font-1);applySettings();});
$("#reader-font-plus").addEventListener("click",()=>{settings.font=Math.min(26,settings.font+1);applySettings();});
document.querySelectorAll("[data-theme]").forEach(b=>b.addEventListener("click",()=>{settings.theme=b.dataset.theme;applySettings();}));
applySettings();
function stripGutenberg(raw){
 const normalized=raw.replace(/^\uFEFF/,"").replace(/\r\n?/g,"\n");
 const start=/\*\*\*\s*START OF (?:THIS |THE )?PROJECT GUTENBERG EBOOK[^\n]*\*\*\*/i.exec(normalized);
 const end=/\*\*\*\s*END OF (?:THIS |THE )?PROJECT GUTENBERG EBOOK[^\n]*\*\*\*/i.exec(normalized);
 if(!start||!end||end.index<=start.index)throw new Error("Le début ou la fin du texte Gutenberg est introuvable.");
 return normalized.slice(start.index+start[0].length,end.index).trim();
}
function paginate(raw){
 const blocks=raw.split(/\n[ \t]*\n+/).map(p=>p.trim().replace(/(?<!\n)\n(?!\n)/g," ").replace(/[ \t]{2,}/g," ")).filter(Boolean);
 const output=[];let page=[],size=0;const limit=translationMode?2300:4300;
 function flush(){if(page.length){output.push(page);page=[];size=0;}}
 for(const block of blocks){
   if(block.length>limit*1.7){
     flush();let rest=block;
     while(rest.length>limit*1.7){
       let cut=rest.lastIndexOf(". ",limit);
       if(cut<limit*.45)cut=rest.lastIndexOf(" ",limit);
       if(cut<limit*.45)cut=limit;else cut++;
       output.push([rest.slice(0,cut).trim()]);rest=rest.slice(cut).trim();
     }
     if(rest){page.push(rest);size=rest.length;}
     continue;
   }
   if(size+block.length>limit && page.length)flush();
   page.push(block);size+=block.length;
 }
 flush();return output;
}
function splitForModel(text){
 const parts=[];let remain=text;
 while(remain.length>750){
   let cut=remain.lastIndexOf(". ",690);
   if(cut<240)cut=remain.lastIndexOf(" ",690);
   if(cut<240)cut=690;else cut++;
   parts.push(remain.slice(0,cut).trim());remain=remain.slice(cut).trim();
 }
 if(remain)parts.push(remain);
 return parts;
}
function paragraph(text){
 if(text.length<100 && /^(?:CHAPITRE|Chapitre|LIVRE|[IVXLCDM]{1,10}(?:\.|\b)|[A-ZÀ-Ÿ][A-ZÀ-Ÿ \-’,.]{7,})/.test(text)){
 const h=document.createElement("h2");h.textContent=text;return h;
 }
 const p=document.createElement("p");
 if(query){
   const idx=text.toLocaleLowerCase("fr").indexOf(query.toLocaleLowerCase("fr"));
   if(idx>=0){
     p.append(document.createTextNode(text.slice(0,idx)));
     const mark=document.createElement("mark");mark.textContent=text.slice(idx,idx+query.length);
     p.append(mark,document.createTextNode(text.slice(idx+query.length)));
     return p;
   }
 }
 p.textContent=text;return p;
}
function uiProgress(){
 $("#reader-current").textContent=String(index+1).padStart(3,"0");
 $("#reader-total").textContent=String(pages.length).padStart(3,"0");
 $("#reader-overline").textContent=(translationMode?"TRADUCTION IA / ":"TEXTE INTÉGRAL / ")+"FEUILLET "+String(index+1).padStart(3,"0");
 $("#reader-jump").value=String(index);
 $("#reader-sidebar-progress").textContent=Math.round((index+1)/pages.length*100)+" % de l'œuvre parcourue";
 $("#reader-prev").disabled=index===0;
 $("#reader-next").disabled=index===pages.length-1;
 $("#reader-progress").style.width=((index+1)/pages.length*100).toFixed(2)+"%";
 save(lastPageKey,index);
}
function showPage(lines){pageEl.replaceChildren(...lines.map(paragraph));}
function showMessage(heading,text,buttonText,handler){
 pageEl.replaceChildren();
 const box=document.createElement("div");box.className="translation-status";
 const h=document.createElement("h2");h.textContent=heading;
 const p=document.createElement("p");p.textContent=text;
 box.append(h,p);
 if(buttonText){
   const btn=document.createElement("button");btn.type="button";btn.className="reader-translate-button";btn.textContent=buttonText;btn.addEventListener("click",handler);
   box.append(btn);
 }
 pageEl.append(box);
}
let actionSerial=0;
async function translatePage(number){
 if(cache.has(number))return cache.get(number);
 const result=[];
 for(const block of pages[number]){
   if(block.trim().length<2){result.push(block);continue;}
   const fragments=splitForModel(block);
   let translated="";
   for(const fragment of fragments){
     const translatedPiece=await model.translate(fragment);
     translated+=(translated?" ":"")+translatedPiece;
   }
   result.push(translated);
 }
 cache.set(number,result);return result;
}
async function go(next,focus=false){
 if(!pages.length)return;
 index=Math.max(0,Math.min(pages.length-1,Math.round(next)));
 const serial=++actionSerial;
 uiProgress();
 if(translationMode){
   if(!model){
     showMessage("Une traduction à faire naître","Le texte source est prêt. Pour le lire en "+(edition.language||"français")+", activez la traduction IA de votre navigateur. Elle fonctionne progressivement, un feuillet à la fois.","ACTIVER LA TRADUCTION ↗",activateModel);
   }else{
     showMessage("Les mots traversent la frontière…","Traduction du feuillet "+(index+1)+" en cours. La première page peut prendre du temps.");
     try{
       const lines=await translatePage(index);
       if(serial!==actionSerial)return;
       showPage(lines);
     }catch(err){
       if(serial!==actionSerial)return;
       showMessage("Traduction interrompue",err.message||"Une erreur s'est produite.","RÉESSAYER CE FEUILLET",()=>go(index,true));
     }
   }
 }else showPage(pages[index]);
 window.scrollTo({top:0,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});
 if(focus)$("#reader-paper").focus({preventScroll:true});
}
const compatibleModels={
 "en-fr":"Xenova/opus-mt-en-fr",
 "fr-en":"Xenova/opus-mt-fr-en",
 "de-fr":"Xenova/opus-mt-de-fr",
 "de-en":"Xenova/opus-mt-de-en"
};
async function activateFallback(){
 const modelId=compatibleModels[sourceLang+"-"+targetLang];
 if(!modelId){showMessage("Modèle indisponible","Aucun modèle de repli ne prend en charge ces deux langues.");return;}
 showMessage("Téléchargement du traducteur libre…","Le chargement peut représenter plusieurs centaines de mégaoctets. Il est lancé uniquement avec votre accord et peut prendre plusieurs minutes.");
 try {
   const module=await import("https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1");
   const pipe=await module.pipeline("translation",modelId,{dtype:"q8",progress_callback(event){
     const p=document.querySelector(".translation-status p");
     if(p && typeof event.progress==="number")p.textContent="Modèle de traduction : "+Math.round(event.progress)+" % de l'élément en cours de chargement.";
   }});
   model={translate:async text=>{
     const result=await pipe(text);
     const output=Array.isArray(result)?result[0]:result;
     if(!output || typeof output.translation_text!=="string")throw Error("Aucune traduction n'a été générée.");
     return output.translation_text;
   }};
   go(index,true);
 }catch(err){
   showMessage("Modèle de repli indisponible","Le traducteur libre n'a pas pu démarrer : "+(err?.message||"erreur inconnue")+". Vous pouvez essayer Chrome récent ou une édition Project Gutenberg.");
 }
}
function unsupportedTranslation(message){
 if(compatibleModels[sourceLang+"-"+targetLang]){
  showMessage("Traduction native indisponible",message+" Vous pouvez tenter le modèle open source pour cette combinaison de langues ; son téléchargement est volumineux.","ESSAYER LE MODÈLE LIBRE ↗",activateFallback);
 }else showMessage("Traduction non disponible ici",message+" Cette combinaison n'a pas encore de modèle de repli configuré.");
}
function activateModel(){
 if(!("Translator" in window)||!window.isSecureContext){
   unsupportedTranslation("L'API de traduction locale n'est pas accessible dans ce navigateur ou hors contexte sécurisé.");
   return;
 }
 if(!canAutoTranslate(sourceLang)||!canAutoTranslate(targetLang)){
   showMessage("Paire de langues indisponible","Cette combinaison de langues n'est pas encore gérée par notre mode de traduction automatique.");
   return;
 }
 const options={sourceLanguage:sourceLang,targetLanguage:targetLang};
 showMessage("Préparation du traducteur…","Le navigateur vérifie les modèles nécessaires et peut télécharger des packs de langues. La durée dépend de votre appareil et de votre connexion.");
 // Translator.create() est appelé dans le gestionnaire de clic pour préserver l'activation utilisateur.
 let ready;
 try{
   ready=window.Translator.create({...options,monitor(monitor){
     monitor.addEventListener("downloadprogress",event=>{
       if(model)return;
       const done=Math.round(event.loaded*100);
       const p=document.querySelector(".translation-status p");
       if(p)p.textContent="Téléchargement du modèle de traduction : "+done+" %.";
     });
   }});
 }catch(err){unsupportedTranslation(err.message||"Échec du chargement.");return;}
 Promise.resolve(ready).then(t=>{model=t;go(index,true);}).catch(err=>{
   unsupportedTranslation("Le navigateur a refusé de charger son traducteur ("+(err.message||"erreur inconnue")+").");
 });
}
$("#reader-prev").addEventListener("click",()=>go(index-1,true));
$("#reader-next").addEventListener("click",()=>go(index+1,true));
$("#reader-jump").addEventListener("change",e=>go(Number(e.target.value),true));
document.addEventListener("keydown",e=>{
 if(e.target.closest("input,select,textarea,button")||e.metaKey||e.ctrlKey||e.altKey)return;
 if(e.key==="ArrowRight"){e.preventDefault();go(index+1,true);}
 if(e.key==="ArrowLeft"){e.preventDefault();go(index-1,true);}
});
$("#reader-search-form").addEventListener("submit",e=>{
 e.preventDefault();
 const term=$("#reader-search").value.trim(),result=$("#reader-search-result");
 if(term.length<2){result.textContent="Saisissez au moins deux caractères.";return;}
 query=term;
 let found=-1;
 if(translationMode){
   const indices=[...cache.keys()].sort((a,b)=>a-b);
   found=indices.find(i=>i>=index&&cache.get(i).some(t=>t.toLocaleLowerCase("fr").includes(term.toLocaleLowerCase("fr"))))??-1;
   if(found<0)found=indices.find(i=>cache.get(i).some(t=>t.toLocaleLowerCase("fr").includes(term.toLocaleLowerCase("fr"))))??-1;
   if(found<0){result.textContent="Pas trouvé parmi les "+indices.length+" feuillets traduits. Le texte restant n'a pas encore été traduit.";return;}
 }else{
   found=pages.findIndex((p,i)=>i>=index&&p.some(t=>t.toLocaleLowerCase("fr").includes(term.toLocaleLowerCase("fr"))));
   if(found<0)found=pages.findIndex(p=>p.some(t=>t.toLocaleLowerCase("fr").includes(term.toLocaleLowerCase("fr"))));
   if(found<0){result.textContent="Aucun passage trouvé.";return;}
 }
 go(found,true);
 result.textContent="Passage trouvé au feuillet "+(found+1)+".";
});
fetch(fileToRead).then(r=>{if(!r.ok)throw new Error("HTTP "+r.status);return r.text();}).then(raw=>{
 if(raw.length<20000)throw new Error("Fichier trop court pour être un livre entier.");
 const fullText=stripGutenberg(raw);
 pages=paginate(fullText);
 if(!pages.length)throw new Error("Texte introuvable.");
 const options=pages.map((_,i)=>{const option=document.createElement("option");option.value=String(i);option.textContent="Feuillet "+String(i+1).padStart(3,"0");return option;});
 $("#reader-jump").replaceChildren(...options);
 loadState="ready";
 const stored=Number(storage(lastPageKey)||0);
 go(Number.isFinite(stored)?stored:0);
}).catch(err=>{
 loadState="failed";
 showMessage("Impossible de charger ce texte",location.protocol==="file:"?"Lancez ce site avec Live Server dans VS Code : le protocole file:// peut bloquer la lecture.":err.message);
 $("#reader-sidebar-progress").textContent="Chargement impossible";
});
})();