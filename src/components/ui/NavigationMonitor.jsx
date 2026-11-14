import React,{useState} from 'react'
import {ArrowLeft,ArrowRight,Orbit} from 'lucide-react'
import DestinationGlobe from './DestinationGlobe'
import GameCanvas from './GameCanvas'
import {destinations,formatDistance} from '../../data/destinations'
import {zones} from '../../data/planet'

export default function NavigationMonitor({onBack,onConfirm}) {
 const [selected,setSelected]=useState(destinations[0])
 return <section className="navigation-monitor" aria-label="Monitor de navegación">
  <header><span className="kicker"><Orbit size={16}/> NAVEGACIÓN DE EMERGENCIA</span><h1>Elige tu destino</h1>
   <p>Íbamos rumbo a la Luna cuando la nave cayó en Planeta X. Elige un destino y recupera los módulos necesarios para preparar la nueva nave.</p></header>
  <div className="navigation-grid">
   <div className="destination-list" aria-label="Destinos por distancia">{destinations.map(target=><button key={target.id} aria-pressed={target===selected} onClick={()=>setSelected(target)}>
    <span className="destination-dot" style={{background:target.color}}/><span><b>{target.name}</b><small>{target.kind}</small></span><strong>{formatDistance(target.distance)}</strong>
   </button>)}</div>
   <div className="navigation-brief"><span className="kicker">PLAN DE RECUPERACIÓN</span><h2>{selected.name}</h2><GameCanvas><DestinationGlobe target={selected}/></GameCanvas><p>{({moon:'0,16 g · −20 °C · Sin atmósfera',mars:'0,38 g · −63 °C · CO₂',venus:'0,90 g · 465 °C · Atmósfera densa'})[selected.id]}</p><p>Combustible mínimo · <b>{selected.fuel} kg</b></p>
    <ul>{zones.filter(zone=>!zone.extra||selected.extras.includes(zone.id)).map(zone=><li key={zone.id}>{zone.part}</li>)}</ul>
   </div>
  </div>
  <p className="fine">Distancias y consumos ficticios desde Planeta X para esta partida.</p>
  <div className="actions"><button className="secondary" onClick={onBack}><ArrowLeft size={16}/> Volver</button><button className="primary" onClick={()=>onConfirm(selected)}>Confirmar destino <ArrowRight size={16}/></button></div>
 </section>
}

