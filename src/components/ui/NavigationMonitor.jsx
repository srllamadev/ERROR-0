import React,{useState} from 'react'
import {ArrowLeft,ArrowRight,Orbit} from 'lucide-react'
import DestinationGlobe from './DestinationGlobe'
import GameCanvas from './GameCanvas'
import {destinations,formatDistance,horizonsEpoch,horizonsQuery} from '../../data/destinations'
import {zones} from '../../data/planet'

export default function NavigationMonitor({onBack,onConfirm}) {
 const [selected,setSelected]=useState(destinations[0])
 return <section className="navigation-monitor" aria-label="Monitor de navegación">
  <header><span className="kicker"><Orbit size={16}/> NAVEGACIÓN DE EMERGENCIA</span><h1>Elige tu destino</h1>
   <p>La Ares-IV perdió el rumbo de la Luna. Selecciona un destino para iniciar el escenario de recuperación correspondiente.</p></header>
  <div className="navigation-grid">
   <div className="destination-list" aria-label="Destinos por distancia">{[...destinations].sort((a,b)=>a.distance-b.distance).map(target=><button key={target.id} aria-pressed={target===selected} onClick={()=>setSelected(target)}>
    <span className="destination-dot" style={{background:target.color}}/><span><b>{target.name}</b><small>{target.kind}</small></span><strong>{formatDistance(target.distance)}</strong>
   </button>)}</div>
   <div className="navigation-brief cockpit" style={{'--route':selected.color}}><span className="kicker">PLAN DE RECUPERACIÓN</span><h2>{selected.name}</h2><GameCanvas><DestinationGlobe target={selected}/></GameCanvas><dl className="route-data"><div><dt>Distancia desde el centro de la Tierra</dt><dd>{formatDistance(selected.distance)}</dd></div><div><dt>Gravedad</dt><dd>{selected.gravity}</dd></div><div><dt>Temperatura</dt><dd>{selected.temperature}</dd></div><div><dt>Zona de exploración</dt><dd>{selected.terrain}</dd></div></dl><p>Combustible mínimo · <b>{selected.fuel} kg</b></p>
    <ul>{zones.filter(zone=>!zone.scrap && (!zone.extra||selected.extras.includes(zone.id))).map(zone=><li key={zone.id}>{zone.part}</li>)}</ul>
   </div>
  </div>
  <p className="fine">Distancia geométrica al centro de la Tierra · {horizonsEpoch}. {selected.id==='earth'?'La Tierra es el origen de referencia.':<a href={horizonsQuery(selected.id)} target="_blank" rel="noreferrer">Consultar dato en NASA/JPL Horizons</a>} El combustible y los datos ambientales son parámetros del juego.</p>
  <div className="actions"><button className="secondary" onClick={onBack}><ArrowLeft size={16}/> Volver</button><button className="primary" onClick={()=>onConfirm(selected)}>Confirmar destino <ArrowRight size={16}/></button></div>
 </section>
}




