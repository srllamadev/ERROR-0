import React,{useEffect,useMemo,useRef} from 'react'
import {Canvas,useFrame} from '@react-three/fiber'
import {Html,Stars} from '@react-three/drei'
import {Vector3} from 'three'
import GameCanvas from '../components/ui/GameCanvas'
import LlamaSprite from '../components/player/LlamaSprite'
import {Box} from '../components/spaceship/Ship'

const stations=[
 {id:'engineering',name:'Ingeniería',x:-5.4},
 {id:'oxygen',name:'Brecha del casco',x:0},
 {id:'navigation',name:'Cabina',x:5.4}
]

const pilotSpawn=[0,0,2.7]
function Pilot({paused,onNear}) {
 const body=useRef(),keys=useRef(new Set()),near=useRef(null)
 const vectors=useMemo(()=>({move:new Vector3(),up:new Vector3(0,1,0)}),[])
 useEffect(()=>{
  const down=e=>{if(!paused&&['w','a','s','d'].includes(e.key.toLowerCase()))keys.current.add(e.key.toLowerCase())}
  const up=e=>keys.current.delete(e.key.toLowerCase())
  const clear=()=>keys.current.clear()
  window.addEventListener('keydown',down)
  window.addEventListener('keyup',up)
  window.addEventListener('blur',clear)
  return ()=>{clear();window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',clear)}
 },[paused])
 useFrame(()=>{
  const p=body.current.position
  const id=stations.find(s=>Math.hypot(p.x-s.x,p.z+2.05)<2)?.id??null
  if(id!==near.current){near.current=id;onNear(id)}
 })
 useFrame((_,dt)=>{
  const p=body.current.position
  const x=Number(keys.current.has('d'))-Number(keys.current.has('a'))
  const z=Number(keys.current.has('s'))-Number(keys.current.has('w'))
  Object.assign(body.current.userData,{horizontal:x,vertical:z,moving:!paused&&Boolean(x||z)})
  if(paused)return
  const move=vectors.move.set(x,0,z).normalize().applyAxisAngle(vectors.up,Math.atan2(9,14))
  const step=Math.min(dt,.05)*5.7
  const nx=Math.max(-7.1,Math.min(7.1,p.x+move.x*step))
  const nz=Math.max(-3.08,Math.min(3.3,p.z+move.z*step))
  const clear=(a,b)=>stations.every(s=>Math.abs(a-s.x)>1.25||b> -1.34)
  if(clear(nx,p.z))p.x=nx
  if(clear(p.x,nz))p.z=nz
 })
 return <LlamaSprite body={body} spawn={pilotSpawn}/>
}

function Impact({time}) {
 const rock=useRef()
 useFrame(()=>{
  rock.current.position.set(-2+(6-time)*1.8,2.2+(6-time)*.72,-3.55-(6-time)*1.5)
  rock.current.rotation.y=time*1.8
 })
 return <mesh ref={rock} visible={time>=2&&time<6}><dodecahedronGeometry args={[.75,0]}/><meshStandardMaterial color="#957b72" flatShading/></mesh>
}

function Interior({paused,onNear,time,alarms}) {
 useFrame(({camera,size})=>{
  const impact=time>=6&&time<6.8?Math.sin(time*85)*.22:0
  camera.zoom=Math.min(size.width/17.9,size.height/12.1)
  camera.updateProjectionMatrix()
  camera.position.set(9+impact,12+impact,14)
  camera.lookAt(0,.55,0)
 })
 return <>
  <color attach="background" args={['#07101e']}/>
  <Stars radius={55} depth={20} count={950} factor={2}/>
  <hemisphereLight args={['#d9eeff','#283047',2]}/>
  <directionalLight position={[3,8,5]} intensity={2.3} color="#fff0db"/>
  <Box size={[15.8,.38,8]} at={[0,-.21,0]} color="#282624"/>
  {Array.from({length:64},(_,i)=><Box key={i} size={[1.91,.06,.94]} at={[(i%8-3.5)*1.95,0,(Math.floor(i/8)-3.5)*.98]} color={i%3?'#978777':'#ada08d'}/>)}
  <Box size={[.28,2.75,8]} at={[-7.8,1.35,0]} color="#54483e"/>
  <Box size={[15.8,2.75,.25]} at={[0,1.35,-4]} color="#685446"/>
  <Box size={[15.6,.045,.09]} at={[0,.047,3.92]} color="#67d9f2" glow={1.2}/>
  {Array.from({length:8},(_,i)=><Box key={i} size={[1.45,.075,.08]} at={[(i-3.5)*1.94,2.49,-3.82]} color={alarms.engineering?'#ff7763':'#86dfff'} glow={1.25}/>)}
  {Array.from({length:8},(_,i)=><group key={i} position={[(i-3.5)*1.95,0,-3.82]}>
   {[.48,1.13,1.78].map(y=><Box key={y} size={[1.78,.54,.16]} at={[0,y,0]} color={i%2?'#b0a08c':'#c8b6a0'}/>)}
   <Box size={[.14,2.34,.27]} at={[-.94,1.2,.02]} color="#a86b45"/>
  </group>)}
  {[-2.75,2.75].map(x=><group key={x} position={[x,.04,0]}>
   <Box size={[.12,.05,7.62]} color="#593d31"/>
   {[-2.8,2.8].map(z=><Box key={z} size={[.26,.055,1.1]} at={[0,0,z]} color="#daa264"/>)}
  </group>)}
  <group position={[-5.4,1.86,-3.46]} rotation={[0,0,Math.PI/2]}>
   <mesh><cylinderGeometry args={[.34,.34,2.1,18]}/><meshStandardMaterial color="#aaa092" metalness={.65} roughness={.37}/></mesh>
   {[-.77,0,.77].map(y=><mesh key={y} position={[0,y,0]}><cylinderGeometry args={[.42,.42,.13,18]}/><meshStandardMaterial color="#8f5c40" metalness={.5}/></mesh>)}
  </group>
  <group position={[0,1,-3.39]}>
   {[-.86,.86].map(x=><mesh key={x} position={[x,0,0]}><capsuleGeometry args={[.25,1.05,4,12]}/><meshStandardMaterial color="#587c75" metalness={.5} roughness={.36}/></mesh>)}
  </group>
  <Box size={[2.65,.9,.12]} at={[5.4,1.99,-3.53]} color="#182c38"/>
  <Box size={[2.35,.66,.06]} at={[5.4,1.99,-3.45]} color={alarms.navigation?'#834039':'#285b66'} glow={.5}/>
  {stations.map((station,i)=><group key={station.id} position={[station.x,0,-2.22]}>
   <Box size={[2.05,.28,1.13]} at={[0,.18,0]} color="#263746"/>
   <Box size={[1.55,.67,.79]} at={[0,.62,0]} color="#807466"/>
   <Box size={[1.9,.16,1.04]} at={[0,.98,0]} color="#dfcbb5"/>
   <Box size={[1.4,.72,.13]} at={[0,1.36,-.27]} color="#162831"/>
   <Box size={[1.22,.49,.045]} at={[0,1.37,-.19]} color={alarms[station.id]?'#d94336':'#45afba'} glow={.85}/>
   {[0,1,2].map(j=><Box key={j} size={[.19,.035,.13]} at={[(j-1)*.31,1.08,.28]} color={j===i?'#ffb575':'#3d5768'} glow={.4}/>)}
   <Html center position={[0,2.04,0]} zIndexRange={[4,0]} style={{pointerEvents:'none'}}>
    <div className="station-tag" style={{'--signal':alarms[station.id]?'#ff8d7b':'#82ecdf'}}><b>{String(i+1).padStart(2,'0')}</b>{station.name}{alarms[station.id]?' · AVERÍA':''}</div>
   </Html>
  </group>)}
  {time>=6 && <group position={[0,1.4,-3.82]} rotation={[0,0,.44]}>
   <Box size={[.18,1.05,.1]} color={alarms.oxygen?'#140b17':'#6bb4ba'}/>
   <Box size={[.7,.12,.13]} at={[.12,.15,.052]} color={alarms.oxygen?'#e76049':'#89dfcb'} glow={.7}/>
  </group>}
  <Impact time={time}/>
  <Pilot paused={paused} onNear={onNear}/>
 </>
}

export default function FlightInterior(props) {
 return <div className="flight-interior"><GameCanvas><Canvas orthographic camera={{zoom:54,position:[9,12,14],far:120}} dpr={[1,1.5]}><Interior {...props}/></Canvas></GameCanvas></div>
}


