import React,{useEffect,useMemo,useRef,useState} from 'react'
import {Canvas,useFrame} from '@react-three/fiber'
import {Html} from '@react-three/drei'
import {MathUtils,Vector3} from 'three'
import {ArrowLeft,Mountain,Package} from 'lucide-react'
import PlanetRocket,{SalvagePart} from '../components/spaceship/PlanetRocket'
import {reviewDesign} from '../utils/planetEngineering'
import LlamaSprite from '../components/player/LlamaSprite'
import PlanetMinimap from '../components/ui/PlanetMinimap'
import GameCanvas from '../components/ui/GameCanvas'
import {Box} from '../components/spaceship/Ship'
import {canWalk,field,pickupPosition,rocks,zones as allZones} from '../data/planet'

const start=[0,5]
function Crew({onNear,carrying,installed,paused,markers,zones}) {
 const leader=useRef(), first=useRef(), second=useRef(), keys=useRef(new Set()), near=useRef(null)
 const vectors=useMemo(()=>({target:new Vector3(start[0],0,start[1]),move:new Vector3(),up:new Vector3(0,1,0), offset:new Vector3(10,13,15)}),[])
 useEffect(()=>{
  const down=e=>{const key=e.key.toLowerCase();if(!paused && 'wasd'.includes(key)&&key.length===1) keys.current.add(key)}
  const up=e=>keys.current.delete(e.key.toLowerCase())
  const clear=()=>keys.current.clear()
  window.addEventListener('keydown',down)
  window.addEventListener('keyup',up)
  window.addEventListener('blur',clear)
  return ()=>{window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',clear)}
 },[paused])
 useFrame(({camera,clock},dt)=>{
  const delta=Math.min(dt,.05), p=leader.current.position
  const x=Number(keys.current.has('d'))-Number(keys.current.has('a'))
  const z=Number(keys.current.has('s'))-Number(keys.current.has('w'))
  if (!paused && (x||z)) {
   const move=vectors.move.set(x,0,z).normalize().applyAxisAngle(vectors.up,Math.atan2(10,15))
   const nx=p.x+move.x*delta*7.2, nz=p.z+move.z*delta*7.2
   if(canWalk(nx,p.z)) p.x=nx
   if(canWalk(p.x,nz)) p.z=nz

  }
  Object.assign(leader.current.userData,{horizontal:x,vertical:z,moving:!paused && Boolean(x||z)})
  p.y=!paused && (x||z)?Math.abs(Math.sin(clock.elapsedTime*11))*.075:0
  ;[first,second].forEach((ref,i)=>{
   const follower=ref.current.position
   const nx=MathUtils.damp(follower.x,p.x+(i===0?-1.4:1.4),3,delta)
   const nz=MathUtils.damp(follower.z,p.z+1.55+i*.37,3,delta)
   const dx=nx-follower.x, dz=nz-follower.z
   if(canWalk(nx,follower.z)) follower.x=nx
   if(canWalk(follower.x,nz)) follower.z=nz
   Object.assign(ref.current.userData,{horizontal:(dx*15-dz*10)/18,vertical:(dx*10+dz*15)/18,moving:!paused && Math.hypot(dx,dz)>.025})
  })
  ;[leader,first,second].forEach((ref,i)=>{
   markers.current[i]?.setAttribute('cx',ref.current.position.x)
   markers.current[i]?.setAttribute('cy',ref.current.position.z)
  })
  const zone=zones.find(item=>!installed.includes(item.id) && Math.hypot(p.x-item.x,p.z-item.z-2.85)<1.85)
  const next=Math.hypot(p.x,p.z)<3.25?'base':!carrying&&zone?zone.id:null
  if(near.current!==next) {near.current=next;onNear(next)}
  vectors.target.x=MathUtils.damp(vectors.target.x,p.x,4,delta)
  vectors.target.z=MathUtils.damp(vectors.target.z,p.z,4,delta)
  camera.position.copy(vectors.target).add(vectors.offset)
  camera.lookAt(vectors.target)
 })
 return <><LlamaSprite body={leader} carrying={carrying}/><LlamaSprite body={first} index={1}/><LlamaSprite body={second} index={2}/></>
}

function World({carrying,installed,stock,onNear,paused,markers,zones}) {
 return <>
  <color attach="background" args={['#6d505b']}/>
  <fog attach="fog" args={['#805b60',28,73]}/>
  <hemisphereLight args={['#ffe0bf','#896576',2.25]}/>
  <directionalLight position={[-11,18,9]} intensity={3.1} color="#ffd3a0"/>
  <mesh rotation={[-Math.PI/2,0,0]}><planeGeometry args={[220,220]}/><meshStandardMaterial color="#a55748" roughness={1}/></mesh>
  {rocks.map(([x,z,r],i)=><group key={i} position={[x,0,z]}>
   <mesh position={[0,r*.41,0]} rotation={[.12,i*.83,.17]} scale={[r*.94,r*.94,r*.78]}><dodecahedronGeometry args={[1,0]}/><meshStandardMaterial color={['#633a43','#8a504c','#77414a'][i%3]} flatShading/></mesh>
   <mesh position={[r*.5,.44,-r*.37]} rotation={[0,i,0]} scale={[r*.39,r*.38,r*.43]}><icosahedronGeometry args={[1,0]}/><meshStandardMaterial color="#9c6354" flatShading/></mesh>
  </group>)}
  {Array.from({length:92},(_,i)=>{
   const x=Math.sin(i*45.72)*(field.x+6),z=Math.cos(i*19.37)*(field.z+4)
   return <mesh key={i} position={[x,.018,z]} rotation={[-Math.PI/2,0,i]} scale={[.37+i%5*.14,.13+i%4*.11,1]}><circleGeometry args={[1,6]}/><meshBasicMaterial color={i%2?'#b76951':'#965346'}/></mesh>
  })}
  {zones.map((zone,i)=>{
   const [x,z]=pickupPosition(zone)
   return <React.Fragment key={zone.id}>
    <group position={[zone.x,.84,zone.z]} rotation={[0,(i-2)*.55,0]}>
     <mesh rotation={[0,0,1.39]}><cylinderGeometry args={[.8,.95,3.3,10,1,true]}/><meshStandardMaterial color="#667784" side={2} metalness={.55} roughness={.58}/></mesh>
     <mesh position={[-1.47,-.22,0]} rotation={[0,0,1.39]}><torusGeometry args={[.91,.11,8,14]}/><meshStandardMaterial color="#211f26"/></mesh>
     <Box size={[.85,.15,.12]} at={[.24,.38,.84]} color={zone.color} glow={1.5}/>
    </group>
    {!stock.includes(zone.id)&&carrying!==zone.id && <group position={[x,.33,z]}><SalvagePart id={zone.id}/></group>}
    <Html center position={[zone.x,2.22,zone.z]} style={{pointerEvents:'none'}}><div className="station-tag" style={{'--signal':zone.color}}><b>0{i+1}</b>{zone.name}</div></Html>
   </React.Fragment>
  })}
  <mesh position={[0,.07,0]}><cylinderGeometry args={[2.24,2.39,.14,32]}/><meshStandardMaterial color="#38474f" metalness={.54}/></mesh>
  <mesh position={[0,.15,0]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[1.91,1.98,40]}/><meshBasicMaterial color="#84eac9"/></mesh>
  <PlanetRocket ids={installed}/>
  <Html center position={[0,1.35,0]} style={{pointerEvents:'none'}}><div className="station-tag">Campamento · Plataforma</div></Html>
  <Crew onNear={onNear} carrying={carrying} installed={stock} paused={paused} markers={markers} zones={zones}/>
 </>
}

export default function PlanetScene({onExit,destination,pilot}) {
 const [near,setNear]=useState(null),[carrying,setCarrying]=useState(null),[installed,setInstalled]=useState([])
 const [stock,setStock]=useState([]),[design,setDesign]=useState(false)
 const [oxygen,setOxygen]=useState(100)
 const dead=oxygen===0
 const atBase=near==='base'
 useEffect(()=>{
  if(design||dead)return
  const timer=setInterval(()=>setOxygen(value=>atBase?Math.min(100,value+5):Math.max(0,value-1)),1000)
  return ()=>clearInterval(timer)
 },[atBase,design,dead])
 const markers=useRef([])
 const zones=allZones.filter(zone=>!zone.extra||destination.extras.includes(zone.id))
 const review=reviewDesign(installed,destination)
 const item=zones.find(zone=>zone.id===near)
 const cargo=zones.find(zone=>zone.id===carrying)
 const action=near==='base'&&cargo?'Depositar '+cargo.part:near==='base'?'Diseñar nave':item&&!cargo?'Recuperar '+item.part:null
 useEffect(()=>{
  function interact(event) {
   if(event.key==='Escape') setDesign(false)
   if(dead||design||event.key.toLowerCase()!=='e'||event.repeat||!action) return
   if(near==='base' && carrying){setStock(previous=>[...previous,carrying]);setCarrying(null);setDesign(true)}
   else if(near==='base') setDesign(true)
   else setCarrying(near)
  }
  window.addEventListener('keydown',interact)
  return ()=>window.removeEventListener('keydown',interact)
 },[action,near,carrying,design,dead])
 return <>
  <div className="stage"><GameCanvas><Canvas orthographic camera={{position:[10,13,20],zoom:43,far:130}} dpr={[1,1.5]}><World onNear={setNear} carrying={carrying} installed={installed} stock={stock} paused={design||dead} markers={markers} zones={zones}/></Canvas></GameCanvas></div>
  <section className="objective planet-objective"><span className="kicker"><Mountain size={14}/> RUTA · {destination.name.toUpperCase()}</span><h2>Cuenca del impacto</h2><p>{review.ready?'Nave validada':stock.length===zones.length?'Completa el ensamblaje en la plataforma':cargo?'Regresa al campamento para depositar la pieza':'Explora los restos y recupera componentes'}</p></section>
  <div className="survival-hud" aria-label="Soporte vital">{[['Energía',Math.min(100,Math.max(0,Math.round((review.watts+40)/1.8)))],['Oxígeno',oxygen],['Nave',Math.round(installed.length/zones.length*100)]].map(([label,value])=><label key={label}>{label} <b>{value}%</b><progress max="100" value={value}/></label>)}</div>
  <PlanetMinimap markers={markers} zones={zones} stock={stock} carrying={carrying}/>
  <aside className="planet-inventory"><span className="kicker"><Package size={14}/> {pilot}</span><b>{stock.length} / {zones.length} piezas recuperadas</b><p>{cargo?'Transportando: '+cargo.part:'Carga disponible'}</p></aside>
  {action && !design && !dead && <div className="interact"><kbd>E</kbd><span><b>{action}</b><small>Presiona E para interactuar</small></span></div>}
  <footer className="controls"><span><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> Mover</span><span><kbd>E</kbd> Interactuar</span></footer>
  {dead && <div className="veil"><section className="modal"><h2>Oxígeno agotado</h2><p>La expedición terminó. El campamento repone oxígeno durante la exploración.</p><button className="primary" onClick={onExit}>Volver al menú</button></section></div>}
  {design && <div className="veil"><section className="modal wide planet-workshop" role="dialog" aria-modal="true" aria-label="Diseño de la nave">
   <header><div><span className="kicker">PLATAFORMA · {destination.name.toUpperCase()}</span><h2>Diseño de la Ares-IV</h2></div><button className="secondary" onClick={()=>setDesign(false)}>Cerrar</button></header>
   <div className="builder"><div className="ship-preview"><GameCanvas><Canvas camera={{position:[3,2.5,4],fov:40}}><hemisphereLight intensity={2.6}/><directionalLight position={[2,4,3]} intensity={2}/><group position={[0,-.85,0]}><PlanetRocket ids={installed}/></group></Canvas></GameCanvas></div>
    <div className="parts">{zones.map(zone=><button className={'part '+(installed.includes(zone.id)?'installed':'')} key={zone.id} disabled={!stock.includes(zone.id)} aria-pressed={installed.includes(zone.id)} onClick={()=>setInstalled(current=>current.includes(zone.id)?current.filter(id=>id!==zone.id):[...current,zone.id])}><b>{zone.part}</b><span>{installed.includes(zone.id)?'Retirar':stock.includes(zone.id)?'Instalar':'Por recuperar'}</span></button>)}</div>
   </div>
   <details><summary>Planos de la cápsula y sus piezas</summary><div className="ares-blueprints"><img src={import.meta.env.BASE_URL+'ares.png'} alt="Vistas de la cápsula Ares-IV"/><img src={import.meta.env.BASE_URL+'ares-parts.png'} alt="Fuselaje, propulsores y electrónica de la Ares-IV"/></div></details>
   <p>Masa {review.mass} kg · Empuje {review.thrust} N · Combustible {review.fuel} kg · Margen eléctrico {review.watts} W</p>
   <h3>{review.ready?'Nave validada':'Revisión técnica'}</h3>
   <ul className="engineering-checks">{review.checks.map(([label,ok])=><li key={label} className={ok?'passed':'bad'}>{ok?'✓':'○'} {label}</li>)}</ul>
   <p className="fine">Valores ficticios. El ascenso requiere empuje superior a masa × 3,4 m/s².</p>
   <details><summary>Referencias de ingeniería y planificación</summary><ul className="notes">
    <li><a href="https://science.nasa.gov/wp-content/uploads/2023/06/nasa_csli_cubesat_101_508.pdf" target="_blank" rel="noreferrer">NASA CubeSat 101</a> · Subsistemas, integración y revisión.</li>
    <li><a href="https://software.nasa.gov/software/GSC-19640-1" target="_blank" rel="noreferrer">NASA GMAT</a> · Diseño de trayectorias y navegación.</li>
    <li><a href="https://ssd.jpl.nasa.gov/horizons/app.html" target="_blank" rel="noreferrer">JPL Horizons</a> · Efemérides de la Tierra y Marte.</li>
    <li><a href="https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=101955" target="_blank" rel="noreferrer">JPL SBDB</a> · Ficha orbital del asteroide Bennu.</li>
   </ul></details>
  </section></div>}
  <button className="secondary planet-exit" onClick={onExit}><ArrowLeft size={15}/> Menú</button>
 </>
}






