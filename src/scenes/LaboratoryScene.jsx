import React,{useEffect,useMemo,useRef} from 'react'
import {Canvas,useFrame} from '@react-three/fiber'
import {Billboard, Html} from '@react-three/drei'
import {MathUtils,Vector3} from 'three'
import {useGameStore} from '../store/useGameStore'
import Astronaut from '../components/player/Astronaut'
import Ship,{Box} from '../components/spaceship/Ship'
import {stations} from '../components/environment/stations'

function Player() {
 const body=useRef(), limbs=useRef([]), keys=useRef(new Set())
 const tracking=useMemo(()=>({target:new Vector3(0,0,3.2), offset:new Vector3(8,9,12), direction:new Vector3(), up:new Vector3(0,1,0)}),[])
 useEffect(()=>{
  const keydown=e=>{
   const key=e.key.toLowerCase()
   if (['w','a','s','d'].includes(key) && !useGameStore.getState().panel) keys.current.add(key)
  }
  const keyup=e=>keys.current.delete(e.key.toLowerCase())
  const clear=()=>keys.current.clear()
  const unsubscribe=useGameStore.subscribe((state,previous)=>{if (state.panel!==previous.panel) clear()})
  window.addEventListener('keydown',keydown)
  window.addEventListener('keyup',keyup)
  window.addEventListener('blur',clear)
  return ()=>{unsubscribe(); window.removeEventListener('keydown',keydown); window.removeEventListener('keyup',keyup); window.removeEventListener('blur',clear)}
 },[])
 useFrame(({camera,clock},dt)=>{
  const state=useGameStore.getState()
  const p=body.current.position
  const x=Number(keys.current.has('d'))-Number(keys.current.has('a'))
  const z=Number(keys.current.has('s'))-Number(keys.current.has('w'))
  const moving=!state.panel && (x!==0 || z!==0)
  const delta=Math.min(dt,.05)
  if (moving) {
   tracking.direction.set(x,0,z).normalize().applyAxisAngle(tracking.up,Math.atan2(8,12))
   const nextX=MathUtils.clamp(p.x+tracking.direction.x*delta*4.8,-6.7,6.7)
   const nextZ=MathUtils.clamp(p.z+tracking.direction.z*delta*4.8,-3.52,4.5)
   const open=(a,b)=>stations.every(s=>Math.abs(s.x-a)>s.rx+.34 || Math.abs(s.z-b)>s.rz+.32)
   if (open(nextX,p.z)) p.x=nextX
   if (open(p.x,nextZ)) p.z=nextZ
   const angle=Math.atan2(tracking.direction.x,tracking.direction.z)
   const difference=Math.atan2(Math.sin(angle-body.current.rotation.y),Math.cos(angle-body.current.rotation.y))
   body.current.rotation.y+=difference*(1-Math.exp(-15*delta))
  }
  limbs.current.forEach((limb,i)=>{
   const swing=moving?Math.sin(clock.elapsedTime*12)*.48*[1,-1,-1,1][i]:0
   limb.rotation.x=MathUtils.damp(limb.rotation.x,swing,13,delta)
  })
  const near=stations.map(s=>({id:s.id,d:Math.hypot(Math.max(0,Math.abs(s.x-p.x)-s.rx),Math.max(0,Math.abs(s.z-p.z)-s.rz))})).sort((a,b)=>a.d-b.d)[0]
  const id=near.d<1.1?near.id:null
  if (state.near!==id) state.set({near:id})
  tracking.target.x=MathUtils.damp(tracking.target.x,p.x*.45,4,delta)
  tracking.target.z=MathUtils.damp(tracking.target.z,p.z*.42,4,delta)
  camera.position.copy(tracking.target).add(tracking.offset)
  camera.lookAt(tracking.target.x,.65,tracking.target.z)
 })
 return <Astronaut body={body} limbs={limbs}/>
}

function Station({station}) {
 const {id,number,name,x,z,color,rx,rz}=station
 const ids=useGameStore(s=>s.ids)
 const near=useGameStore(s=>s.near===id)
 return <group position={[x,0,z]}>
  <Box size={[rx*2,.13,rz*2]} at={[0,.07,0]} color="#273d52"/>
  <Box size={[rx*1.9,.028,.045]} at={[0,.15,rz-.03]} color={color} glow={1.5}/>
  {id==='launch'?<>
   <mesh position={[0,.23,0]} receiveShadow><cylinderGeometry args={[.98,1.08,.23,32]}/><meshStandardMaterial color="#45586b" metalness={.6} roughness={.38}/></mesh>
   <mesh position={[0,.36,0]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.68,.75,40]}/><meshBasicMaterial color={color}/></mesh>
   {[-1,1].map(side=><Box key={side} size={[.14,.95,.14]} at={[side*.94,.66,-.36]} color={color} glow={.6}/>)}
  </>:<>
   <Box size={[rx*1.85,.16,rz*1.78]} at={[0,.89,0]} color="#728ba1"/>
   {[-1,1].map(side=><Box key={side} size={[.26,.74,rz*1.4]} at={[side*rx*.69,.45,0]} color="#364f65"/>)}
   {id==='build'?<group position={[0,1.49,0]} scale={.61}><Ship ids={ids}/></group>:<>
    <Box size={[1.29,.71,.13]} at={[0,1.36,-.19]} color="#1b354f"/>
    <Box size={[1.17,.59,.024]} at={[0,1.36,-.113]} color="#236080" glow={.6}/>
    {Array.from({length:6},(_,i)=><Box key={i} size={[.09,.12+(i%3)*.08,.02]} at={[(i-2.5)*.15,1.24+(i%3)*.04,-.09]} color={color} glow={1}/>)}
   </>}
  </>}
  <Billboard position={[0,id==='launch'?1.52:2.17,0]}>
   <Html center style={{pointerEvents:'none'}}>
    <div className={'station-tag '+(near?'active':'')} style={{'--signal':color}}><b>{number}</b> {name}</div>
   </Html>
  </Billboard>
 </group>
}

function Lab() {
 return <>
  <color attach="background" args={['#0b1727']}/>
  <fog attach="fog" args={['#0b1727',22,45]}/>
  <hemisphereLight args={['#c0e7ff','#273048',2.1]}/>
  <directionalLight position={[2,10,6]} intensity={3} color="#d8eaff" castShadow shadow-mapSize={[1024,1024]} shadow-camera-left={-10} shadow-camera-right={10} shadow-camera-top={9} shadow-camera-bottom={-9} shadow-normalBias={.035} shadow-radius={3}/>
  <Box size={[15,.52,10]} at={[0,-.27,.3]} color="#24364c"/>
  {Array.from({length:60},(_,i)=><Box key={i} size={[1.45,.05,1.6]} at={[(i%10-4.5)*1.49,-.028,(Math.floor(i/10)-2.5)*1.647+.3]} color={i%4===0?'#4b6074':'#384e64'}/>)}
  <Box size={[15,.06,.045]} at={[0,.014,5.1]} color="#60ceff" glow={1}/>
  <Box size={[.045,.06,9.8]} at={[7.32,.014,.24]} color="#60ceff" glow={1}/>
  <Box size={[15,2.8,.32]} at={[0,1.4,-4.65]} color="#22374d"/>
  <Box size={[.32,2.8,9.9]} at={[-7.45,1.4,.25]} color="#22374d"/>
  {Array.from({length:9},(_,i)=><group key={i} position={[(i-4)*1.63,0,-4.45]}>
   <Box size={[1.48,1.96,.09]} at={[0,1.27,0]} color={i%3===1?'#163456':'#3f596d'}/>
   <Box size={[1.25,.038,.035]} at={[0,2.22,.065]} color="#56d6ff" glow={1.5}/>
   <Box size={[1.3,.13,.09]} at={[0,.36,.06]} color="#1c2e43"/>
  </group>)}
  {[-2.9,-.8,1.32,3.48].map(z=><group key={z} position={[-7.24,0,z]}>
   <Box size={[.13,1.92,1.87]} at={[0,1.35,0]} color="#354e66"/>
   <Box size={[.08,.035,1.62]} at={[.08,2.17,0]} color="#75dfff" glow={1}/>
  </group>)}
  <Box size={[.5,.72,1.28]} at={[-7.05,.37,3.24]} color="#648295"/>
  <Box size={[.5,.57,1.24]} at={[7.11,.31,-3.69]} color="#648295"/>
  <Box size={[2.8,.022,.06]} at={[-3.5,.015,3.56]} color="#93aabc"/>
  <Box size={[2.8,.022,.06]} at={[-3.5,.015,3.77]} color="#93aabc"/>
  <gridHelper args={[52,52,'#20334b','#15243b']} position={[0,-.57,0]}/>
  {stations.map(station=><Station key={station.id} station={station}/>)}
  <Player/>
 </>
}
export default function LaboratoryScene() {
 return <Canvas shadows orthographic camera={{zoom:57,position:[8,9,12],far:90}} dpr={[1,1.5]}><Lab/></Canvas>
}

