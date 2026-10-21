import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'

type User = { id:number; username:string; salt:string; hash:string; bio:string; joinedAt:string }
type SessionPost = { id:number; title:string; body:string; tags:string[]; userId:number; createdAt:string; reactions:{likes:number;dislikes:number}; views:number; local:true }
type Comment = { id:string; postId:number; parentId:string|null; author:string; userId:number; body:string; createdAt:number; automated:false }
const users:User[]=[]
const posts:SessionPost[]=[]
const comments:Comment[]=[]
const sessions=new Map<string,number>()
let nextUser=100000, nextPost=1000000
const publicUser=(u:User)=>({id:u.id,username:u.username,firstName:'',lastName:'',bio:u.bio,joinedAt:u.joinedAt})
function json(res:ServerResponse,status:number,data:unknown){res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store'});res.end(JSON.stringify(data))}
async function body(req:IncomingMessage){let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>30000) throw Error('Requête trop longue')}return JSON.parse(raw||'{}') as Record<string,unknown>}
function current(req:IncomingMessage){const token=(req.headers.cookie||'').split(';').map(v=>v.trim()).find(v=>v.startsWith('afterhours_session='))?.split('=')[1];return users.find(u=>u.id===sessions.get(token||''))}
function secret(pass:string,salt:string){return scryptSync(pass,salt,64).toString('hex')}
export function sessionApi():Plugin {return {name:'afterhours-memory-api',configureServer(server){server.middlewares.use('/session-api',async(req,res)=>{try{
 const path=(req.url||'/').split('?')[0], method=req.method||'GET', user=current(req)
 if(path==='/state'&&method==='GET')return json(res,200,{user:user?publicUser(user):null,members:users.map(publicUser),posts,comments})
 if(path==='/register'&&method==='POST'){const b=await body(req), username=String(b.username||'').trim(),password=String(b.password||'')
 if(!/^[\p{L}\p{N}_-]{3,24}$/u.test(username))return json(res,400,{error:'Pseudo : 3 à 24 caractères, sans espace.'})
 if(password.length<8)return json(res,400,{error:'Mot de passe : 8 caractères minimum.'})
 if(users.some(u=>u.username.toLowerCase()===username.toLowerCase()))return json(res,409,{error:'Ce pseudo est déjà pris.'})
 const salt=randomBytes(16).toString('hex'),u={id:nextUser++,username,salt,hash:secret(password,salt),bio:'',joinedAt:new Date().toISOString()};users.push(u);return login(res,u)}
 if(path==='/login'&&method==='POST'){const b=await body(req),u=users.find(u=>u.username.toLowerCase()===String(b.username||'').trim().toLowerCase()),password=String(b.password||'')
 const actual=Buffer.from(secret(password,u?.salt||randomBytes(16).toString('hex')),'hex'),expected=Buffer.from(u?.hash||'0'.repeat(128),'hex')
 if(!u||!timingSafeEqual(actual,expected))return json(res,401,{error:'Pseudo ou mot de passe incorrect.'})
 return login(res,u)}
 if(path==='/logout'&&method==='POST'){const token=(req.headers.cookie||'').split(';').map(v=>v.trim()).find(v=>v.startsWith('afterhours_session='))?.split('=')[1];if(token)sessions.delete(token);res.setHeader('Set-Cookie','afterhours_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0');return json(res,200,{ok:true})}
 if(!user)return json(res,401,{error:'Connecte-toi pour continuer.'})
 if(path==='/profile'&&method==='PATCH'){const b=await body(req);user.bio=String(b.bio||'').trim().slice(0,240);return json(res,200,{user:publicUser(user)})}
 if(path==='/posts'&&method==='POST'){const b=await body(req),title=String(b.title||'').trim(),text=String(b.body||'').trim(),tag=String(b.tag||'social').trim().toLowerCase();if(title.length<5||title.length>100||text.length<15||text.length>10000||!/^[a-z0-9-]{2,20}$/.test(tag))return json(res,400,{error:'Titre, message ou communauté invalide.'});const post={id:nextPost++,title,body:text,tags:[tag],userId:user.id,createdAt:new Date().toISOString(),reactions:{likes:0,dislikes:0},views:0,local:true as const};posts.unshift(post);return json(res,201,{post})}
 const matchPost=path.match(/^\/posts\/(\d+)$/)
 if(matchPost&&(method==='PATCH'||method==='DELETE')){const idx=posts.findIndex(p=>p.id===Number(matchPost[1]));if(idx<0)return json(res,404,{error:'Publication introuvable.'});if(posts[idx].userId!==user.id)return json(res,403,{error:'Cette publication ne t’appartient pas.'});if(method==='DELETE'){posts.splice(idx,1);for(let i=comments.length-1;i>=0;i--)if(comments[i].postId===Number(matchPost[1]))comments.splice(i,1);return json(res,200,{ok:true})}const b=await body(req),title=String(b.title||'').trim(),text=String(b.body||'').trim();if(title.length<5||title.length>100||text.length<15||text.length>10000)return json(res,400,{error:'Contenu invalide.'});posts[idx].title=title;posts[idx].body=text;return json(res,200,{post:posts[idx]})}
 if(path==='/comments'&&method==='POST'){const b=await body(req),postId=Number(b.postId),parentId=b.parentId===null?null:String(b.parentId||''),text=String(b.body||'').trim();if(!Number.isInteger(postId)||text.length<1||text.length>2000||(parentId&&!comments.some(c=>c.id===parentId&&c.postId===postId)))return json(res,400,{error:'Commentaire invalide.'});const c={id:randomUUID(),postId,parentId,body:text,author:user.username,userId:user.id,createdAt:Date.now(),automated:false as const};comments.push(c);return json(res,201,{comment:c})}
 const matchComment=path.match(/^\/comments\/([a-z\d-]+)$/i)
 if(matchComment&&(method==='PATCH'||method==='DELETE')){const idx=comments.findIndex(c=>c.id===matchComment[1]);if(idx<0)return json(res,404,{error:'Commentaire introuvable.'});if(comments[idx].userId!==user.id)return json(res,403,{error:'Ce commentaire ne t’appartient pas.'});if(method==='DELETE'){comments.splice(idx,1);return json(res,200,{ok:true})}const b=await body(req),text=String(b.body||'').trim();if(!text||text.length>2000)return json(res,400,{error:'Commentaire invalide.'});comments[idx].body=text;return json(res,200,{comment:comments[idx]})}
 return json(res,404,{error:'Route introuvable.'})
 }catch(e){json(res,400,{error:e instanceof Error?e.message:'Erreur.'})}
 function login(res:ServerResponse,u:User){const token=randomBytes(32).toString('hex');sessions.set(token,u.id);res.setHeader('Set-Cookie',`afterhours_session=${token}; HttpOnly; SameSite=Lax; Path=/`);return json(res,200,{user:publicUser(u)})}
 })}}}
