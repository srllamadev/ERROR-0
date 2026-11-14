import React,{useEffect,useRef,useState} from 'react'
import {Canvas,useFrame} from '@react-three/fiber'
import {OrbitControls} from '@react-three/drei'
import {ArrowRight,Orbit,MoveUpRight,X,Radio,Satellite,Zap,FlaskConical,Check,LockKeyhole,Rocket} from 'lucide-react'
import LaboratoryScene from './scenes/LaboratoryScene'
import SpaceScene from './scenes/SpaceScene'
import MissionProfile from './components/ui/MissionProfile'
import NavigationMonitor from './components/ui/NavigationMonitor'
import PlanetScene from './scenes/PlanetScene'
import Ship from './components/spaceship/Ship'
import GameCanvas from './components/ui/GameCanvas'
import {stations} from './components/environment/stations'
import {useGameStore} from './store/useGameStore'
import {parts,limits,categories} from './data/components'
import {missions} from './data/missions'
import {evaluate} from './utils/missionLogic'

const duration=22
function PreviewShip({ids}) {
 const model=useRef()
 useFrame((_,delta)=>{model.current.rotation.y+=delta*.36})
 return <group ref={model}><Ship ids={ids}/></group>
}
function ShipPreview({ids}) {
 return <div className="ship-preview"><GameCanvas><Canvas camera={{position:[3,2,4.7],fov:42}} dpr={[1,1.5]}>
  <hemisphereLight args={['#d0f1ff','#203a65',2.4]}/>
  <directionalLight position={[3,5,4]} intensity={3}/>
  <PreviewShip ids={ids}/>
  <OrbitControls enablePan={false} enableZoom={false}/>
 </Canvas></GameCanvas><span>VISTA DE ENSAMBLAJE</span></div>
}
function Resources({totals}) {
 return <div className="resources">
  <div className={totals.cost>limits.cost?'bad':''}><span>PRESUPUESTO</span><b>{totals.cost} / {limits.cost} M</b></div>
  <div className={totals.mass>totals.capacity?'bad':''}><span>MASA</span><b>{totals.mass} / {totals.capacity} kg</b></div>
  <div className={totals.power<0?'bad':''}><span>BALANCE ELÉCTRICO</span><b>{totals.power>0?'+':''}{totals.power} W</b></div>
 </div>
}
function Modal({title,label,close,children,wide}) {
 return <div className="veil" onMouseDown={e=>{if(e.target===e.currentTarget) close()}}>
  <section className={'modal '+(wide?'wide':'')} role="dialog" aria-modal="true" aria-label={title}>
   <header><div><span className="kicker">{label}</span><h2>{title}</h2></div><button className="icon" onClick={close} aria-label="Cerrar"><X size={19}/></button></header>
   {children}
  </section>
 </div>
}
function LabPanel({s,totals}) {
 const [checked,setChecked]=useState(false)
 const station=stations.find(item=>item.id===s.panel)
 const close=()=>s.set({panel:null})
 const ready=s.selected && s.validated && !totals.blockers.length
 return <Modal title={station.name} label={'ESTACIÓN '+station.number} close={close} wide={s.panel==='build'}>
  {s.panel==='mission' && <>
   <p>Selecciona un objetivo para la próxima expedición del laboratorio.</p>
   {missions.map((name,i)=><div className="mission-row" key={name}><strong>0{i+1}</strong><span>{name}</span>{i?<LockKeyhole size={16} aria-label="Bloqueada"/>:<button onClick={()=>s.set({selected:true,panel:null})}>{s.selected?'Seleccionada':'Seleccionar'}</button>}</div>)}
  </>}
  {s.panel==='science' && <>
   <h3>Observación de la Tierra</h3>
   <p>Obtén imágenes de la superficie terrestre y transmítelas al centro de control. El eclipse interrumpe la generación solar, así que necesitarás una reserva de energía.</p>
   <ul className="notes"><li>Cámara científica para captar imágenes.</li><li>Antena para transmitir datos.</li><li>Batería para operar durante el eclipse.</li></ul>
  </>}
  {s.panel==='build' && <>
   <div className="builder"><ShipPreview ids={s.ids}/><div className="parts catalog">
    {categories.map(([group,label])=><section key={group}><h3>{label}</h3>{parts.filter(p=>p.group===group).map(p=><button key={p.id} className={'part '+(s.ids.includes(p.id)?'installed':'')} aria-pressed={s.ids.includes(p.id)} onClick={()=>{s.toggle(p.id);setChecked(false)}}>
     <span><b>{p.name}</b><small>{p.role}</small></span><small>{p.cost} M · {p.mass} kg · {p.power>0?'+':''}{p.power} W</small>{s.ids.includes(p.id)?<Check size={16}/>:<span className="part-add">+</span>}
    </button>)}</section>)}
   </div></div>
   <Resources totals={totals}/><p className="fine">Enlace: {totals.downlink} / {totals.dataRequired} kb/s · Valor científico: {totals.science} puntos</p>
   <p className="fine">Cifras ficticias. Los totales incluyen el módulo base. La masa del lanzador se excluye de la carga útil.</p>
   {checked && <div className="feedback" role="status">{totals.blockers.length?totals.blockers.map(issue=><div className="bad" key={issue}>{issue}</div>):<><strong>Diseño validado para el lanzamiento.</strong>{totals.issues.map(issue=><div key={issue}>{issue}</div>)}</>}</div>}
   <button className="primary" onClick={()=>{setChecked(true);s.set({validated:!totals.blockers.length,reviewed:true})}}>Validar diseño <Check size={16}/></button>
  </>}
  {s.panel==='launch' && <>
   <Resources totals={totals}/>
   <ul className="notes">
    <li>{s.selected?'Misión 01 asignada.':'Selecciona una misión en Control de misión.'}</li>
    <li>{s.validated?'Diseño validado.':'Valida el diseño en la mesa de ensamblaje.'}</li>
    {totals.blockers.map(issue=><li key={issue}>{issue}</li>)}
   </ul>
   <button className="primary" disabled={!ready} onClick={()=>s.set({screen:'space',near:null,panel:null,elapsed:0,risky:false})}>Iniciar lanzamiento <Rocket size={16}/></button>{s.selected && s.reviewed && totals.canRisk && <button className="secondary risk" onClick={()=>s.set({screen:'space',near:null,panel:null,elapsed:0,risky:true})}>Simular lanzamiento con sobrecarga</button>}
  </>}
 </Modal>
}

export default function App() {
 const s=useGameStore()
 const [pilot,setPilot]=useState('Alfa')
 const [destination,setDestination]=useState(null)
 const [help,setHelp]=useState(false)
 const totals=evaluate(s.ids)
 useEffect(()=>{
  const keyboard=e=>{
   const state=useGameStore.getState()
   if (e.key==='Escape') {setHelp(false);state.set({panel:null})}
   if (e.key.toLowerCase()==='e' && !e.repeat && state.screen==='lab' && state.near && !state.panel) state.set({panel:state.near})
  }
  window.addEventListener('keydown',keyboard)
  return ()=>window.removeEventListener('keydown',keyboard)
 },[])
 useEffect(()=>{
  if (s.screen!=='space') return
  const start=performance.now()
  const timer=window.setInterval(()=>{
   const elapsed=Math.min(s.risky?6:duration,(performance.now()-start)/1000)
   s.set({elapsed})
   if(elapsed===(s.risky?6:duration)) window.clearInterval(timer)
  },45)
  return ()=>window.clearInterval(timer)
 },[s.screen,s.set,s.risky])
 const near=stations.find(item=>item.id===s.near)
 const eclipse=s.elapsed>=10 && s.elapsed<15
 const powered=!eclipse || totals.reserve
 const transmitted=totals.downlink>0 && s.ids.includes('camera')
 const observationTime=Math.max(0,s.elapsed-3)-(totals.reserve?0:Math.max(0,Math.min(15,s.elapsed)-10))
 const progress=!s.risky && transmitted?Math.floor(observationTime/(duration-3)*100*totals.dataRatio):0
 const returnToLab=()=>s.set({screen:'lab',panel:null,near:null,elapsed:0,risky:false})
 const goal=!s.selected?'Selecciona la misión en el puesto 01':!s.validated?'Ensambla y valida el satélite en el puesto 02':'Dirígete a la plataforma de lanzamiento 04'
 return <main className={'game '+s.screen}>
  <div className="stage">
   {(s.screen==='home'||s.screen==='space'||s.screen==='results') && <GameCanvas><SpaceScene ids={s.screen==='home'?['solar_std','xband']:s.ids} risky={s.risky}/></GameCanvas>}
   {s.screen==='lab' && <GameCanvas><LaboratoryScene/></GameCanvas>}
  </div>
  <header className="topbar">
   <div className="brand"><span className="brand-icon"><Orbit size={23}/></span><span>SPACEBOUND<small>INGENIERÍA ORBITAL</small></span></div>
   <div className="top-status"><i/> {s.screen==='lab'?'LABORATORIO ACTIVO':s.screen==='navigation'?'MONITOR DE RUTA':s.screen==='planet'?'EXPEDICIÓN · PLANETA X':s.screen==='home'?'PROGRAMA DE OBSERVACIÓN':'MISIÓN 01 · TIERRA'}</div>
  </header>
  {s.screen==='profile' && <MissionProfile onBack={()=>s.set({screen:'home'})} onConfirm={name=>{setPilot(name);s.set({screen:'navigation'})}}/>}
  {s.screen==='navigation' && <NavigationMonitor onBack={()=>s.set({screen:'profile'})} onConfirm={target=>{setDestination(target);s.set({screen:'planet'})}}/>}
  {s.screen==='planet' && <PlanetScene pilot={pilot} destination={destination} onExit={()=>s.set({screen:'home'})}/>}
  {s.screen==='home' && <section className="hero">
   <div className="kicker"><span/> SIMULADOR DE MISIONES ESPACIALES</div>
   <h1>SPACE<span>BOUND</span></h1>
   <p>Explora el Planeta X y recupera piezas entre los restos de antiguas expediciones.</p>
   <div className="actions"><button className="primary" onClick={()=>s.set({screen:'profile'})}>Preparar misión <ArrowRight size={18}/></button><button className="secondary" onClick={returnToLab}>Laboratorio orbital</button><button className="secondary" onClick={()=>setHelp(true)}>Cómo jugar <MoveUpRight size={16}/></button></div>
  </section>}
  {s.screen==='lab' && <>
   <section className="objective"><span className="kicker">UBICACIÓN 01</span><h2>Laboratorio orbital</h2><p>{goal}</p></section>
   <aside className="lab-resources"><Resources totals={totals}/></aside>
   {near && !s.panel && <button className="interact" onClick={()=>s.set({panel:near.id})}><kbd>E</kbd><span><b>{near.name}</b><small>Presiona E para interactuar</small></span></button>}
   <footer className="controls"><span><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> Mover</span><span><kbd>E</kbd> Interactuar</span><span><kbd>ESC</kbd> Cerrar</span></footer>
   {s.panel && <LabPanel key={s.panel} s={s} totals={totals}/>}
  </>}
  {s.screen==='space' && <>
   <section className="objective"><span className="kicker">MISIÓN 01</span><h2>Observación de la Tierra</h2><p>{s.risky?(s.elapsed<3?'Ascenso con sobrecarga':'Pérdida del vehículo'):s.elapsed<3?'Inserción orbital':eclipse?'Paso por la sombra terrestre':'Órbita de observación'}</p></section>
   <aside className="telemetry">
    <span className="kicker">TELEMETRÍA</span>
    <div><Satellite size={17}/> Nave <b>{s.risky?(s.elapsed<3?'Ascenso':'Destruida'):s.elapsed<3?'Ascenso':'En órbita'}</b></div>
    <div><Zap size={17}/> Energía <b>{!powered || (s.risky && s.elapsed>=3)?'Interrumpida':s.ids.includes('rtg')?'Radioisótopos':eclipse?'Batería':'Solar'}</b></div>
    <div><Radio size={17}/> Enlace <b>{!totals.downlink?'Sin antena':powered && (!s.risky || s.elapsed<3)?'Disponible':'Sin enlace'}</b></div>
    <div><FlaskConical size={17}/> Datos enviados <b>{progress}%</b></div>
    <progress max="100" value={progress}/>
    <p className="fine">Órbita y eclipse simplificados.</p>
    <button className="primary" disabled={s.elapsed<(s.risky?6:duration)} onClick={()=>s.set({screen:'results'})}>Ver resultados <ArrowRight size={16}/></button>
   </aside>
  </>}
  {s.screen==='results' && <Modal title={s.risky||totals.issues.length?'Misión fallida':'Misión completada'} label="INFORME · MISIÓN 01" close={returnToLab}>
   <div className="score">{s.risky?0:totals.score}<small> / 100 PUNTOS</small></div>
   {s.risky?<p>La carga útil excedió en {totals.mass-totals.capacity} kg la capacidad del lanzador. Reduce la masa o selecciona un lanzador de mayor capacidad.</p>:totals.issues.length?<ul className="notes">{totals.issues.map(issue=><li key={issue}>{issue}</li>)}</ul>:<p>El satélite observó la superficie terrestre y transmitió todas las imágenes. El sistema eléctrico mantuvo los instrumentos y el enlace durante toda la observación.</p>}
   {!s.risky && totals.issues.length>0 && <p>Revisa los instrumentos y la reserva eléctrica en la terminal científica antes del próximo lanzamiento.</p>}
   <button className="primary" onClick={returnToLab}>Volver al laboratorio <ArrowRight size={16}/></button>
  </Modal>}
  {help && <Modal title="Cómo jugar" label="MANUAL DE OPERACIONES" close={()=>setHelp(false)}>
   <p>Muévete con <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd>. Acércate a una estación y pulsa <kbd>E</kbd> para usarla. Pulsa <kbd>ESC</kbd> para cerrar sus controles.</p>
   <p>En Planeta X, recupera una pieza con <kbd>E</kbd> y pulsa <kbd>E</kbd> de nuevo al regresar a la plataforma para depositarla.</p><h3>Laboratorio orbital</h3><ol className="notes"><li>Selecciona la misión de observación terrestre.</li><li>Consulta los objetivos en la terminal científica.</li><li>Instala componentes y valida el diseño en ensamblaje.</li><li>Lanza el satélite desde la plataforma y revisa los resultados.</li></ol>
   <button className="primary" onClick={()=>{setHelp(false);returnToLab()}}>Entrar al laboratorio <ArrowRight size={16}/></button>
  </Modal>}
 </main>
}





