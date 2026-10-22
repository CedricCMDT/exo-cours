import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { PageHeader } from '../components/ui/PageHeader'
import { useNetwork } from '../context/NetworkContext'
export function Account(){
 const {user,login,register,logout,updateBio,posts,replies}=useNetwork()
 const [mode,setMode]=useState<'login'|'register'>('login')
 const [username,setUsername]=useState(''),[password,setPassword]=useState(''),[bio,setBio]=useState(''),[error,setError]=useState(''),[notice,setNotice]=useState('')
 useEffect(()=>{setBio(user?.bio||'')},[user?.id,user?.bio])
 async function action(event:React.FormEvent){event.preventDefault();setError('');try{if(mode==='login')await login(username,password);else await register(username,password);setPassword('')}catch(e){setError(e instanceof Error?e.message:'Erreur')}}
 return <main className="narrow-page"><PageHeader eyebrow="AFTERHOURS / ACCOUNT" title={user ? 'Mon profil' : 'Mon compte'} />
 {!user?<div className="composer"><div className="form-row"><button onClick={()=>setMode('login')}>Connexion</button><button onClick={()=>setMode('register')}>Inscription</button></div><form onSubmit={action}><label>Pseudo<input required minLength={3} maxLength={24} value={username} onChange={e=>setUsername(e.target.value)}/></label><label>Mot de passe<input required type="password" minLength={8} value={password} onChange={e=>setPassword(e.target.value)}/></label>{error&&<p role="alert" className="notice error">{error}</p>}<button className="primary">{mode==='login'?'Se connecter':'Créer mon compte'}</button></form></div>:
 <section className="composer"><h2>@{user.username}</h2><small>Compte temporaire · ID {user.id}</small><form onSubmit={async e=>{e.preventDefault();try{await updateBio(bio);setNotice('Biographie mise à jour')}catch(e){setError(String(e))}}}><label>Ma biographie<textarea maxLength={240} rows={3} value={bio} onChange={e=>setBio(e.target.value)} /></label><button>Mettre à jour</button></form>{notice&&<p>{notice}</p>}<button type="button" onClick={()=>void logout()}>Se déconnecter</button><h2>Mes publications ({posts.filter(p=>p.userId===user.id).length})</h2>{posts.filter(p=>p.userId===user.id).map(p=><p key={p.id}><Link to={'/posts/'+p.id}>{p.title}</Link></p>)}<h2>Mes commentaires ({replies.filter(r=>r.author===user.username&&!r.id.startsWith('api-')).length})</h2>{replies.filter(r=>r.author===user.username).map(r=><p key={r.id}><Link to={'/posts/'+r.postId}>{r.body.slice(0,140)}</Link></p>)}</section>}
 </main>
}
