import React,{useEffect,useRef,useState} from 'react'
import {frames} from '../player/LlamaSprite'
function CrewPortrait({index}) {
 const canvas=useRef()
 useEffect(()=>{
  let timer
  const image=new Image()
  image.onload=()=>{
   const pictures=frames(image,index).idle
   let frame=index
   const draw=()=>{
    const ctx=canvas.current.getContext('2d')
    ctx.clearRect(0,0,89,91)
    ctx.drawImage(pictures[frame++%pictures.length].image,0,0)
   }
   draw()
   timer=setInterval(draw,370)
  }
  image.src=import.meta.env.BASE_URL+'llama-sheet.jpeg'
  return ()=>{image.onload=null;clearInterval(timer)}
 },[index])
 return <canvas ref={canvas} width={89} height={91} aria-hidden="true"/>
}
export default function MissionProfile({onBack,onConfirm,pilot}) {
 const [name,setName]=useState(pilot==='Alfa'?'':pilot)
 return <form className="mission-profile" onSubmit={e=>{e.preventDefault();onConfirm(name.trim()||'Alfa')}}>
 <header><span className="kicker">ERROR - O · TRIPULACIÓN</span><h1>Prepara el equipo</h1></header>
 <div className="crew-cards">{[name.trim()||'Alfa','Beta','Gamma'].map((member,i)=><article key={i} className={i===0?'player-card':undefined}><CrewPortrait index={i}/><b>{member}</b><small>{['Ingeniería','Exploración','Pilotaje'][i]}</small></article>)}</div>
 <label className="profile-field">Nombre de tu personaje<input maxLength={24} value={name} onChange={e=>setName(e.target.value)} placeholder="Alfa"/></label>
 <div className="profile-actions"><button type="button" className="secondary" onClick={onBack}>Volver</button><button className="primary">Abrir navegación</button></div>
 </form>
}




