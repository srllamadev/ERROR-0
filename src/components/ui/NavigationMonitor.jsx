import React,{useEffect,useState} from 'react'
import {ArrowLeft,ArrowRight,Orbit} from 'lucide-react'
import DestinationGlobe from './DestinationGlobe'
import GameCanvas from './GameCanvas'
import {destinations,formatDistance,horizonsEpoch,horizonsQuery} from '../../data/destinations'
import {zones} from '../../data/planet'

export default function NavigationMonitor({onBack,onConfirm}) {
 const [selected,setSelected]=useState(destinations[0])
 const [live,setLive]=useState(null)
 const current=live?.id===selected.id?live:null
 useEffect(()=>{
  const controller=new AbortController()
  fetch(import.meta.env.BASE_URL+'api/horizons-distance?planet='+encodeURIComponent(selected.id),{signal:controller.signal})
   .then(response=>{if(!response.ok)throw new Error('Horizons no disponible');return response.json()})
   .then(data=>{if(!controller.signal.aborted)setLive({...data,id:selected.id})})
   .catch(()=>{if(!controller.signal.aborted)setLive({id:selected.id,unavailable:true})})
  return ()=>controller.abort()
 },[selected.id])
 return <section className="navigation-monitor" aria-label="Monitor de navegación">
  <header><span className="kicker"><Orbit size={16}/> NAVEGACIÓN DE EMERGENCIA</span><h1>Elige dónde aterrizar</h1>
   <p>La ERROR - O se desvió de su ruta a la Luna. Elige dónde aterrizar de emergencia, recupera las piezas y prepara la nave para volver a la Tierra.</p></header>
  <div className="navigation-grid">
   <div className="destination-list" aria-label="Destinos por distancia">{[...destinations].sort((a,b)=>a.distance-b.distance).map(target=><button key={target.id} aria-pressed={target===selected} onClick={()=>setSelected(target)}>
    <span className="destination-dot" style={{background:target.color}}/><span><b>{target.name}</b><small>{target.kind}</small></span><strong>{formatDistance(target.id===selected.id?(current?.distance??target.distance):target.distance)}</strong>
   </button>)}</div>
   <div className="navigation-brief cockpit" style={{'--route':selected.color}}><span className="kicker">PLAN DE RECUPERACIÓN</span><h2>{selected.name}</h2><GameCanvas><DestinationGlobe target={selected}/></GameCanvas><dl className="route-data"><div><dt>Distancia desde el centro de la Tierra</dt><dd>{formatDistance(current?.distance??selected.distance)}</dd></div><div><dt>Gravedad</dt><dd>{selected.gravity}</dd></div><div><dt>Temperatura</dt><dd>{selected.temperature}</dd></div><div><dt>Zona de exploración</dt><dd>{selected.terrain}</dd></div></dl><p>Combustible mínimo · <b>{selected.fuel} kg</b></p>
    <ul>{zones.filter(zone=>!zone.scrap && (!zone.extra||selected.extras.includes(zone.id))).map(zone=><li key={zone.id}>{zone.part}</li>)}</ul>
   </div>
  </div>
  <p className="fine">{current?.epoch?'Horizons · Consulta del '+new Date(current.epoch).toLocaleString('es-BO'):current?.unavailable?'Horizons no disponible · Dato guardado del '+horizonsEpoch:'Consultando Horizons · Dato guardado del '+horizonsEpoch}. <a href={current?.query??horizonsQuery(selected.id)} target="_blank" rel="noreferrer">Ver consulta en NASA/JPL Horizons</a>. El combustible y los datos ambientales son parámetros del juego.</p>
  <div className="actions"><button className="secondary" onClick={onBack}><ArrowLeft size={16}/> Volver</button><button className="primary" onClick={()=>onConfirm(selected)}>Confirmar destino <ArrowRight size={16}/></button></div>
 </section>
}










