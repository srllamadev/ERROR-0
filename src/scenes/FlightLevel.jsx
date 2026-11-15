import React,{useEffect,useRef,useState} from 'react'
import {advanceFlight,beginFlight,courseDeadline,flightResult} from '../utils/flight'

import CourseChart from '../components/ui/CourseChart'
import HullPatch from '../components/ui/HullPatch'
import WirePanel from '../components/ui/WirePanel'
import {deck,flightStations} from '../data/flightDeck'
import FlightInterior from './FlightInterior'
const roomNames={engineering:"Ingeniería",oxygen:"Brecha del casco",navigation:"Cabina"}
export default function FlightLevel({profile,pilot,onExit,testMode=false}) {
 const mapMarker=useRef(null)
 const [state,setState]=useState(()=>beginFlight(profile))
 const [room,setRoom]=useState(null)
 const [attempt,setAttempt]=useState(0)
 const [panel,setPanel]=useState(null)
 const [isolated,setIsolated]=useState(false)
 const [links,setLinks]=useState([])

 const result=flightResult(state)

 useEffect(()=>{
  if(result)return
  const timer=setInterval(()=>{
   setState(current=>flightResult(current)?current:advanceFlight(current,.25))
  },250)
  return ()=>clearInterval(timer)
 },[result])
 useEffect(()=>{
  const down=e=>{
   const key=e.key.toLowerCase()

   if(key==='escape')setPanel(null)
   if(key==='e' && room && !panel && !result && !e.repeat){setPanel(room)}
  }
  window.addEventListener('keydown',down)
  return ()=>window.removeEventListener('keydown',down)
 },[room,result,panel])
 const restart=()=>{setAttempt(current=>current+1);setState(beginFlight(profile));setRoom(null);setPanel(null);setIsolated(false);setLinks([])}
 const blackout=state.time>=6&&!state.circuit
 const leaking=state.time>=15&&!state.seal
 const drift=state.time>=23&&!state.course
 const systems=[
  ['engineering','Energía',blackout,state.circuit,'Circuito principal'],
  ['oxygen','Soporte vital',leaking,state.seal,'Presión del casco'],
  ['navigation','Navegación',drift,state.course,'Rumbo terrestre']
 ]
 const canSteer=(!blackout||state.battery>0)&&!state.support
 return <section className="flight-level">
  <header><span className="kicker">NIVEL 2 · VIAJE A LA TIERRA</span><h2>Emergencia a bordo</h2><p>{pilot} · {profile.name}</p>{testMode && <button className="secondary flight-test-exit" onClick={onExit}>Volver al menú</button>}</header>
  <div className="flight-meters"><b>Reserva eléctrica {Math.ceil(state.battery)} s</b><b>Combustible {state.fuel} kg</b><b>Ventana de rumbo {Math.max(0,Math.ceil(courseDeadline-state.time))} s</b></div>
  <div className="flight-layout">
   <aside className="flight-map" aria-label="Minimapa de la cubierta">
    <h3>Minimapa</h3>
    <svg viewBox={[-deck.halfWidth-.4,deck.back-.5,deck.halfWidth*2+.8,deck.front-deck.back+1].join(' ')} role="img" aria-label="Cubierta y posición de la tripulación">
     <rect x={-deck.halfWidth} y={deck.back} width={deck.halfWidth*2} height={deck.front-deck.back} rx=".5" fill="#182c59"/>
     {[-deck.divider,deck.divider].map(x=><path key={x} d={`M${x} ${deck.back}V${deck.doorCenter-deck.doorWidth/2} M${x} ${deck.doorCenter+deck.doorWidth/2}V3.15`} stroke="#98acd0" strokeWidth=".23"/>)}
     {flightStations.map(station=><circle key={station.id} cx={station.x} cy={station.z} r=".55" fill={systems.find(item=>item[0]===station.id)[2]?'#f89a74':'#97d696'}><title>{station.name}</title></circle>)}
     <circle ref={mapMarker} cx="0" cy="3.85" r=".52" fill="#ffdc8e" stroke="#fff8eb" strokeWidth=".15"/>
    </svg>
    <small>Amarillo · Tu posición</small>
   </aside>
   <FlightInterior mapMarker={mapMarker} key={attempt} paused={Boolean(panel||result)} time={state.time} onNear={setRoom}
   alarms={{engineering:blackout,oxygen:leaking,navigation:drift}}/>
   <aside className="flight-diagnostics" aria-label="Monitor de sistemas">
    <div className="flight-oxygen" data-critical={state.oxygen<=25}><b>Oxígeno <span>{Math.ceil(state.oxygen)}%</span></b><progress aria-label="Oxígeno" max="100" value={state.oxygen}/></div><h3>Estado de sistemas</h3>
    {systems.map(([id,name,fault,repaired,detail])=><div key={id} className={'flight-monitor '+(fault?'fault':'normal')} aria-live="polite">
     <span>{name}</span><strong><i/>{fault?'AVERÍA':repaired?'REPARADO':'OPERATIVO'}</strong><small>{detail}</small>
    </div>)}
   </aside>
  </div>
  <p className="flight-impact" role="status">{state.time<2?'Rumbo a la Tierra':state.time<6?'Alerta · Asteroide en trayectoria de impacto':blackout||leaking||drift||!state.seal?'Impacto de asteroide · Repara los sistemas de la ERROR - O':'Sistemas estabilizados'}</p>
  <p>{room?'E · '+roomNames[room]:'Acércate a una estación'} · WASD para moverte</p>
  {panel&&!result&&<div className="flight-console" role="dialog" aria-label="Terminal de reparación">
   <button className="secondary" onClick={()=>setPanel(null)}>Cerrar</button>
   {panel==='engineering'&&<><h3>Distribución eléctrica</h3><p>{state.circuit?'Circuito restaurado.':blackout?'Protección de distribución activada.':'Circuito estable.'}</p>
    {blackout&&<><WirePanel isolated={isolated} links={links} onIsolate={()=>setIsolated(true)}
      onConnect={id=>setLinks(current=>current.includes(id)?current:[...current,id])}
      onRestore={()=>setState(current=>({...current,circuit:true,support:false}))}/>
      <button className="secondary" onClick={()=>setState(current=>({...current,support:!current.support}))}>{state.support?'Devolver energía a navegación':'Priorizar soporte vital'}</button></>}   </>}
   {panel==='oxygen'&&<><h3>Brecha del casco</h3><p>{leaking?'El impacto abrió una brecha. Coloca el parche de emergencia para detener la fuga.':state.seal?'Casco sellado.':'La fuga todavía no se ha activado.'}</p>{leaking && <HullPatch onSeal={()=>setState(current=>({...current,seal:true}))}/>}</>}
   {panel==='navigation'&&<><h3>Corrección de rumbo</h3>
    {state.course?<p>Rumbo a la Tierra recuperado.</p>:!canSteer?<p>Navegación sin alimentación. Revisa ingeniería.</p>:!drift?<p>Rumbo estable.</p>:<CourseChart canConfirm={state.fuel>=20}
     onConfirm={()=>setState(current=>current.course||current.fuel<20?current:{...current,course:true,fuel:current.fuel-20})}/>}
   </>}
   
  </div>}
  {result&&<div className="veil"><section className="modal"><h2>{result==='success'?'Nivel 2 completado':'Viaje interrumpido'}</h2><p>{result==='success'?'Rumbo a la Tierra recuperado. Próxima etapa: llegada a la Tierra.':result}</p><p>Oxígeno {Math.ceil(state.oxygen)}% · Combustible {state.fuel} kg · Averías resueltas {[state.circuit,state.seal,state.course].filter(Boolean).length}/3</p><button className="primary" onClick={result==='success'?onExit:restart}>{result==='success'?'Volver al menú':'Reintentar nivel'}</button></section></div>}
 </section>
}









