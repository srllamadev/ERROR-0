import React,{useEffect,useMemo,useRef} from 'react'
import {Canvas,useFrame} from '@react-three/fiber'
import {Html,Stars} from '@react-three/drei'
import {Vector3} from 'three'
import GameCanvas from '../components/ui/GameCanvas'
import LlamaSprite from '../components/player/LlamaSprite'
import {Box} from '../components/spaceship/Ship'

import {canWalkDeck,deck,flightStations as stations} from '../data/flightDeck'

const pilotSpawn=[0,0,3.85]
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
  const id=stations.find(s=>Math.hypot(p.x-s.x,p.z-s.z)<2)?.id??null
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
  const nx=p.x+move.x*step
  const nz=p.z+move.z*step
  if(canWalkDeck(nx,p.z))p.x=nx
  if(canWalkDeck(p.x,nz))p.z=nz
 })
 return <LlamaSprite body={body} spawn={pilotSpawn}/>
}

function Impact({time}) {
 const rock=useRef()
 useFrame(()=>{
  rock.current.position.set(-2+(6-time)*1.8,2.2+(6-time)*.72,-5.55-(6-time)*1.5)
  rock.current.rotation.y=time*1.8
 })
 return <mesh ref={rock} visible={time>=2&&time<6}><dodecahedronGeometry args={[.75,0]}/><meshStandardMaterial color="#957b72" flatShading/></mesh>
}

function Interior({paused,onNear,time,alarms}) {
 useFrame(({camera,size})=>{
  const impact=time>=6&&time<6.8?Math.sin(time*85)*.22:0
  camera.zoom=Math.min(size.width/29.5,size.height/16.5)
  camera.updateProjectionMatrix()
  camera.position.set(9+impact,12+impact,14)
  camera.lookAt(0,.55,0)
 })
 return <>
  <color attach="background" args={['#07101e']}/>
  <Stars radius={55} depth={20} count={950} factor={2}/>
  <hemisphereLight args={['#d9eeff','#283047',2]}/>
  <directionalLight position={[3,8,5]} intensity={2.3} color="#fff0db"/>
  <Box size={[25.5,.38,11.2]} at={[0,-.21,-.5]} color="#282624"/>
  {Array.from({length:88},(_,i)=><Box key={i} size={[2.24,.06,.96]} at={[(i%11-5)*2.29,0,Math.floor(i/11)*1.38-5.3]} color={i%3?'#a59681':'#b6a58e'}/>)}
  <Box size={[.28,2.55,11]} at={[-deck.halfWidth,1.25,-.5]} color="#675044"/>
  <Box size={[25.4,2.55,.25]} at={[0,1.25,deck.back]} color="#685446"/>
  <Box size={[25.3,.045,.09]} at={[0,.055,4.92]} color="#67d9f2" glow={1.2}/>
  <Box size={[25,.018,1.35]} at={[0,.047,4.02]} color="#655749"/>
  {Array.from({length:13},(_,i)=><group key={i} position={[(i-6)*1.94,0,-5.81]}>
   {[.48,1.13,1.78].map(y=><Box key={y} size={[1.78,.54,.16]} at={[0,y,0]} color={i%2?'#b0a08c':'#c8b6a0'}/>)}
   <Box size={[.14,2.24,.27]} at={[-.94,1.14,.02]} color="#a86b45"/>
   <Box size={[1.43,.075,.08]} at={[0,2.25,.15]} color={alarms.engineering?'#ff7763':'#ffddaf'} glow={1.25}/>
  </group>)}
  {[-deck.divider,deck.divider].map(x=>{
   const start=deck.doorCenter-deck.doorWidth/2,end=deck.doorCenter+deck.doorWidth/2
   return <group key={x} position={[x,0,0]}>
    <Box size={[.28,.86,start-deck.back]} at={[0,.43,(start+deck.back)/2]} color="#a68168"/>
    <Box size={[.28,.86,3.15-end]} at={[0,.43,(end+3.15)/2]} color="#a68168"/>
    {[start,end].map(z=><Box key={z} size={[.42,2.18,.22]} at={[0,1.09,z]} color="#a86b45"/>)}
    <Box size={[.42,.21,deck.doorWidth+.22]} at={[0,2.18,deck.doorCenter]} color="#a86b45"/>
    <Box size={[.48,.04,deck.doorWidth]} at={[0,.055,deck.doorCenter]} color="#85e4d7" glow={.75}/>
   </group>
  })}
  <group position={[0,0,-4.98]}>
   {[-2.5,2.36].map(x=><group key={x} position={[x,0,0]}>
    <Box size={[1.04,1.57,.61]} at={[0,.81,0]} color="#b4a28e"/>
    <Box size={[.071,.32,.06]} at={[.26,1,.34]} color="#544c42"/>
   </group>)}
  </group>
  <group position={[8.4,0,-1.76]}>
   <Box size={[.91,.25,.77]} at={[0,.51,0]} color="#a66943"/>
   <Box size={[.89,.76,.18]} at={[0,.83,.32]} color="#ba8052"/>
  </group>
  <group position={[-8.4,1.86,-5.23]} rotation={[0,0,Math.PI/2]}>
   <mesh><cylinderGeometry args={[.34,.34,2.1,18]}/><meshStandardMaterial color="#aaa092" metalness={.65} roughness={.37}/></mesh>
   {[-.77,0,.77].map(y=><mesh key={y} position={[0,y,0]}><cylinderGeometry args={[.42,.42,.13,18]}/><meshStandardMaterial color="#8f5c40" metalness={.5}/></mesh>)}
  </group>
  <group position={[0,1,-5.11]}>
   {[-.86,.86].map(x=><mesh key={x} position={[x,0,0]}><capsuleGeometry args={[.25,1.05,4,12]}/><meshStandardMaterial color="#587c75" metalness={.5} roughness={.36}/></mesh>)}
  </group>
  <Box size={[2.65,.9,.12]} at={[8.4,1.99,-5.55]} color="#182c38"/>
  <Box size={[2.35,.66,.06]} at={[8.4,1.99,-5.47]} color={alarms.navigation?'#834039':'#285b66'} glow={.5}/>
  {stations.map((station,i)=><group key={station.id} position={[station.x,0,station.z]}>
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
  {time>=6 && <group position={[0,1.4,-5.8]} rotation={[0,0,.44]}>
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




