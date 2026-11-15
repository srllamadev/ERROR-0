import React,{useEffect,useMemo,useRef,useState} from 'react'
import {Canvas,useFrame} from '@react-three/fiber'
import {Html} from '@react-three/drei'
import {MathUtils,Vector3} from 'three'
import {ArrowLeft,Droplet,Mountain,Package,Rocket,Zap} from 'lucide-react'
import PlanetRocket,{SalvagePart} from '../components/spaceship/PlanetRocket'
import {reviewDesign} from '../utils/planetEngineering'
import LlamaSprite from '../components/player/LlamaSprite'
import PlanetMinimap from '../components/ui/PlanetMinimap'
import FlightLevel from './FlightLevel'
import {profiles} from '../utils/flight'
import {PartArt,AssemblyArt,PlanetLaunch} from '../components/ui/AresArt'
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

function World({carrying,installed,stock,onNear,paused,markers,zones,destination}) {
 const orbital=['jupiter','saturn','uranus'].includes(destination.id)
 const spires=['cristalia','uranus','venus'].includes(destination.id)
 return <>
  <color attach="background" args={[destination.sky]}/>
  <fog attach="fog" args={[destination.sky,26,73]}/>
  <hemisphereLight args={['#ffe0bf','#896576',2.25]}/>
  <directionalLight position={[-11,18,9]} intensity={3.1} color={destination.color}/>
  <mesh rotation={[-Math.PI/2,0,0]}><planeGeometry args={orbital?[58,48]:[220,220]}/><meshStandardMaterial color={destination.ground} roughness={1}/></mesh>
  {orbital && <gridHelper args={[48,24,destination.color,destination.sky]} position={[0,.022,0]}/>}
  {rocks.map(([x,z,r],i)=><group key={i} position={[x,0,z]}>
   <mesh position={[0,r*.41,0]} rotation={[.12,i*.83,.17]} scale={[r*.94,r*(spires?1.65:.94),r*.78]}>{spires?<octahedronGeometry args={[1,0]}/>:<dodecahedronGeometry args={[1,0]}/>}<meshStandardMaterial color={i%2?destination.ground:destination.sky} flatShading/></mesh>
   <mesh position={[r*.5,.44,-r*.37]} rotation={[0,i,0]} scale={[r*.39,r*.38,r*.43]}><icosahedronGeometry args={[1,0]}/><meshStandardMaterial color={destination.ground} flatShading/></mesh>
  </group>)}
  {Array.from({length:92},(_,i)=>{
   const x=Math.sin(i*45.72)*(field.x+6),z=Math.cos(i*19.37)*(field.z+4)
   return <mesh key={i} position={[x,.018,z]} rotation={[-Math.PI/2,0,i]} scale={[.37+i%5*.14,.13+i%4*.11,1]}><circleGeometry args={[1,6]}/><meshBasicMaterial color={i%2?destination.sky:destination.ground}/></mesh>
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
  <Html center position={[0,1.35,0]} style={{pointerEvents:'none'}}><div className="station-tag">{installed.includes('frame')?'Campamento · Plataforma':'ERROR - O · Dañada'}</div></Html>
  <Crew onNear={onNear} carrying={carrying} installed={stock} paused={paused} markers={markers} zones={zones}/>
 </>
}

export default function PlanetScene({onExit,destination,pilot}) {
 const [near,setNear]=useState(null),[carrying,setCarrying]=useState(null),[installed,setInstalled]=useState([])
 const [stock,setStock]=useState([]),[design,setDesign]=useState(false)
 const [boarding,setBoarding]=useState(false)
 const greeted=useRef(false)
 const [profile,setProfile]=useState(profiles.light)
 const [inFlight,setInFlight]=useState(false)
 const [launch,setLaunch]=useState(false)
 const [oxygen,setOxygen]=useState(100)
 const dead=oxygen===0
 const atBase=near==='base'
 useEffect(()=>{
  if(boarding||design||dead||launch)return
  const timer=setInterval(()=>setOxygen(value=>atBase?Math.min(100,value+5):Math.max(0,value-1)),1000)
  return ()=>clearInterval(timer)
 },[atBase,boarding,design,dead,launch])
 useEffect(()=>{
  if(!atBase){greeted.current=false;return}
  if(greeted.current||carrying||dead||design||launch)return
  greeted.current=true
  setBoarding(true)
 },[atBase,carrying,dead,design,launch])
 useEffect(()=>{
  if(!boarding)return
  const timer=setTimeout(()=>{setBoarding(false);setDesign(true)},2600)
  return ()=>clearTimeout(timer)
 },[boarding])
 const markers=useRef([])
 const zones=allZones.filter(zone=>!zone.extra||destination.extras.includes(zone.id))
 const required=zones.filter(zone=>!zone.scrap)
 const recovered=required.filter(zone=>stock.includes(zone.id)).length
 const assembled=required.filter(zone=>installed.includes(zone.id)).length
 const toggleModule=id=>{
  if(stock.includes(id)) setInstalled(current=>current.includes(id)?current.filter(item=>item!==id):[...current,id])
 }
 const review=reviewDesign(installed,destination)
 const item=zones.find(zone=>zone.id===near)
 const cargo=zones.find(zone=>zone.id===carrying)
 const action=near==='base'&&cargo?'Depositar '+cargo.part:near==='base'?'Entrar en la nave':item&&!cargo?'Recuperar '+item.part:null
 useEffect(()=>{
  function interact(event) {
   if(event.key==='Escape'){setDesign(false);setBoarding(false)}
   if(dead||design||boarding||launch||event.key.toLowerCase()!=='e'||event.repeat||!action) return
   if(near==='base' && carrying){setStock(previous=>[...previous,carrying]);setCarrying(null);greeted.current=true;setBoarding(true)}
   else if(near==='base') setBoarding(true)
   else setCarrying(near)
  }
  window.addEventListener('keydown',interact)
  return ()=>window.removeEventListener('keydown',interact)
 },[action,near,carrying,design,dead,boarding,launch])
 if(inFlight)return <FlightLevel profile={profile} pilot={pilot} onExit={onExit}/>
 if(launch) return <PlanetLaunch destination={destination} onContinue={()=>setInFlight(true)} failure={launch===true?null:launch} onRetry={()=>setLaunch(false)} onExit={onExit}/>
 return <>
  <div className="stage"><GameCanvas><Canvas orthographic camera={{position:[10,13,20],zoom:43,far:130}} dpr={[1,1.5]}><World onNear={setNear} carrying={carrying} installed={installed} stock={stock} paused={design||dead||boarding} markers={markers} zones={zones} destination={destination}/></Canvas></GameCanvas></div>
  <div className="planet-nav-hud"><section className="objective planet-objective"><span className="kicker"><Mountain size={14}/> RUTA · {destination.name.toUpperCase()}</span><h2>{destination.name} · {destination.terrain}</h2><p>{review.ready?'Nave validada':recovered===required.length?'Completa el ensamblaje en la plataforma':cargo?'Regresa al campamento para depositar la pieza':'Explora los restos y recupera componentes'}</p></section><PlanetMinimap markers={markers} zones={zones} stock={stock} carrying={carrying}/></div>
  <div className="survival-hud" aria-label="Soporte vital">{[['Oxígeno',oxygen,Droplet],['Energía',Math.min(100,Math.max(0,Math.round((review.watts+40)/1.8))),Zap],['Nave',Math.round(assembled/required.length*100),Rocket]].map(([label,value,Icon])=><label key={label} data-critical={label==='Oxígeno' && value<=25}><span><Icon size={15} aria-hidden="true"/>{label}</span> <b>{value}%</b><progress aria-label={label} max="100" value={value}/></label>)}</div>

  <aside className="planet-inventory"><span className="kicker"><Package size={14}/> {pilot}</span><b>{recovered} / {required.length} piezas obligatorias</b><p>{cargo?'Transportando: '+cargo.part:'Carga disponible'}</p></aside>
  {action && !design && !dead && !boarding && <div className="interact"><kbd>E</kbd><span><b>{action}</b><small>Presiona E para interactuar</small></span></div>}
  <footer className="controls"><span><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> Mover</span><span><kbd>E</kbd> Interactuar</span></footer>
  {dead && <div className="veil"><section className="modal"><h2>Oxígeno agotado</h2><p>La expedición terminó. El campamento repone oxígeno durante la exploración.</p><button className="primary" onClick={onExit}>Volver al menú</button></section></div>}
  {boarding && <div className="boarding-film" role="status">
   <div className="boarding-frame">
    <div className="boarding-opening">
     <div className="boarding-console"><span className="kicker">ERROR - O</span><b>Entrando a la nave</b><small>Iniciando diagnóstico de sistemas</small></div>
     <div className="boarding-door boarding-left" aria-hidden="true"><i/></div>
     <div className="boarding-door boarding-right" aria-hidden="true"><i/></div>
    </div>
    <div className="boarding-beacon" aria-hidden="true"/>
   </div>
  </div>}
  {design && <div className="veil"><section className="modal wide planet-workshop" role="dialog" aria-modal="true" aria-label="Diseño de la nave">
   <header><div><span className="kicker">PLATAFORMA · {destination.name.toUpperCase()}</span><h2>Diagnóstico de la ERROR - O</h2></div><button className="secondary" onClick={()=>setDesign(false)}>Cerrar</button></header>
   <p aria-live="polite">{assembled===required.length?'Todos los módulos obligatorios están instalados.':`Faltan ${required.length-assembled} módulos obligatorios. Revisa cuáles quedan por recuperar o instalar.`}</p>
   <div className="builder"><AssemblyArt ids={installed} labels={zones} stock={stock} onToggle={toggleModule}/>
    <div className="parts">{zones.map(zone=><button className={'part '+(installed.includes(zone.id)?'installed':'')} key={zone.id} disabled={!stock.includes(zone.id)} aria-pressed={installed.includes(zone.id)} onClick={()=>toggleModule(zone.id)}><PartArt id={zone.id}/><b>{zone.part}<small>{zone.scrap?'Chatarra defectuosa':'Obligatoria para esta ruta'}</small></b><span>{installed.includes(zone.id)?'Retirar':stock.includes(zone.id)?'Instalar':'Por recuperar'}</span></button>)}</div>
   </div>
   <p>Masa {review.mass} kg · Empuje {review.thrust} N · Combustible {review.fuel} kg · Margen eléctrico {review.watts} W</p>
   <fieldset className="flight-options"><legend>Configuración para el viaje a la Tierra</legend>{Object.values(profiles).map(option=><label key={option.name}><input type="radio" name="flight-profile" checked={profile===option} disabled={review.thrust>0 && review.thrust<=(review.mass+option.mass)*3.4} onChange={()=>setProfile(option)}/>{option.name} · +{option.mass} kg · {option.battery} s de reserva · {option.fuel} kg para maniobrar</label>)}</fieldset>
   {review.ready && review.thrust>(review.mass+profile.mass)*3.4 && <button className="primary" onClick={()=>setLaunch(true)}>Iniciar despegue</button>}
   {!review.ready && installed.length>0 && <button className="secondary risk" onClick={()=>setLaunch(review.faults[0]??('Falló la prueba de vuelo: '+review.checks.filter(([,ok])=>!ok).map(([label])=>label).join(', ')+'.'))}>Simular despegue defectuoso</button>}
   {review.faults.map(fault=><p key={fault} className="bad">{fault}</p>)}
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






















