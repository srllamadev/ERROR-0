import React,{useState} from 'react'
export default function MissionProfile({onBack,onConfirm}) {
 const [name,setName]=useState('')
 return <form className="navigation-monitor" onSubmit={e=>{e.preventDefault();onConfirm(name.trim()||'Alfa')}}>
 <span className="kicker">ARES-IV · TRIPULACIÓN</span><h1>Prepara el equipo</h1>
 <div className="crew-cards">{[name.trim()||'Alfa','Beta','Gamma'].map((member,i)=><article key={i}><div className="crew-sprite"/><b>{member}</b><small>{['Ingeniería','Exploración','Pilotaje'][i]}</small></article>)}</div>
 <label className="profile-field">Nombre de tu personaje<input maxLength={24} value={name} onChange={e=>setName(e.target.value)} placeholder="Alfa"/></label>
 <div className="actions"><button type="button" className="secondary" onClick={onBack}>Volver</button><button className="primary">Abrir navegación</button></div>
 </form>
}
