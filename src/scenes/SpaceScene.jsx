import React,{useEffect,useMemo,useRef} from 'react'
import {Canvas,useFrame} from '@react-three/fiber'
import {Stars,Line} from '@react-three/drei'
import {CanvasTexture,SRGBColorSpace} from 'three'
import Ship from '../components/spaceship/Ship'
import {useGameStore} from '../store/useGameStore'

const orbit=Array.from({length:129},(_,i)=>{
 const angle=i/128*Math.PI*2
 return [Math.cos(angle)*3.5,Math.sin(angle)*.55,Math.sin(angle)*3.5]
})
function worldTexture() {
 const canvas=document.createElement('canvas')
 canvas.width=1024
 canvas.height=512
 const ctx=canvas.getContext('2d')
 const ocean=ctx.createLinearGradient(0,0,0,512)
 ocean.addColorStop(0,'#4c8ca3')
 ocean.addColorStop(.48,'#153870')
 ocean.addColorStop(1,'#588eaa')
 ctx.fillStyle=ocean
 ctx.fillRect(0,0,1024,512)
 const continents=[
  [[.04,.23],[.12,.15],[.21,.16],[.27,.22],[.25,.29],[.21,.33],[.19,.41],[.23,.5],[.18,.47],[.14,.42],[.12,.34],[.07,.31]],
  [[.22,.47],[.27,.49],[.33,.55],[.34,.62],[.29,.69],[.28,.77],[.252,.85],[.23,.74],[.22,.64],[.195,.56]],
  [[.28,.15],[.35,.11],[.39,.13],[.36,.23],[.31,.24]],
  [[.43,.27],[.48,.22],[.56,.18],[.64,.15],[.75,.17],[.87,.2],[.95,.24],[.91,.33],[.85,.37],[.8,.43],[.78,.52],[.73,.47],[.7,.41],[.66,.5],[.62,.41],[.58,.39],[.55,.36],[.48,.4],[.45,.35]],
  [[.48,.39],[.55,.39],[.6,.46],[.575,.51],[.56,.63],[.52,.69],[.49,.62],[.47,.51],[.43,.48],[.44,.43]],
  [[.78,.67],[.83,.62],[.88,.66],[.91,.75],[.84,.79],[.78,.77]]
 ]
 const land=ctx.createLinearGradient(0,65,0,430)
 for (const [offset,color] of [[0,'#a8b7ae'],[.32,'#63815d'],[.51,'#a8a26c'],[.64,'#478463'],[1,'#8d9976']]) land.addColorStop(offset,color)
 ctx.fillStyle=land
 for (const polygon of continents) {
  ctx.beginPath()
  polygon.forEach(([x,y],i)=>ctx[i?'lineTo':'moveTo'](x*1024,y*512))
  ctx.closePath()
  ctx.fill()
 }
 ctx.fillStyle='#cbdfe3'
 ctx.fillRect(0,473,1024,39)
 for (let i=0;i<4800;i++) {
  const x=(i*137.927)%1024, y=(i*i*1.179)%512
  ctx.fillStyle=i%2?'#d8f3ff12':'#08192b13'
  ctx.fillRect(x,y,4+i%6,1+i%3)
 }
 const texture=new CanvasTexture(canvas)
 texture.colorSpace=SRGBColorSpace
 return texture
}
const debris = Array.from({length:34},(_,i)=>[
 Math.cos(i*2.4), Math.sin(i*1.7), Math.sin(i*2.4)
])
function Orbit({ids,risky}) {
 const planet=useRef(), satellite=useRef(), explosion=useRef()
 const texture=useMemo(worldTexture,[])
 useEffect(()=>()=>texture.dispose(),[texture])
 useFrame(()=>{
  const {elapsed}=useGameStore.getState()
  const angle=(risky?Math.min(3,elapsed):elapsed)*.39+.85
  const insertion=Math.min(1,elapsed/3)
  const radius=2.25+insertion*1.25
  planet.current.rotation.y=elapsed*.063
  satellite.current.position.set(Math.cos(angle)*radius,Math.sin(angle)*.55,Math.sin(angle)*radius)
  satellite.current.rotation.set(0,-angle,.25)
  const exploded=risky && elapsed>=3
  satellite.current.visible=!exploded
  explosion.current.visible=exploded && elapsed<5.8
  explosion.current.position.copy(satellite.current.position)
  if (exploded) {
   const age=elapsed-3
   explosion.current.children.forEach((fragment,i)=>{
    const distance=age*(.42+(i%6)*.24)
    fragment.position.set(...debris[i].map(axis=>axis*distance))
    fragment.scale.setScalar(Math.max(.02,1-age/2.8))
   })
  }
 })
 return <>
  <color attach="background" args={['#030916']}/>
  <ambientLight intensity={.76}/>
  <directionalLight position={[-5,4,5]} intensity={3} color="#d9f2ff"/>
  <Stars radius={45} depth={27} count={2100} factor={3} fade/>
  <mesh ref={planet}><sphereGeometry args={[2,56,40]}/><meshStandardMaterial map={texture} roughness={.95}/></mesh>
  <mesh><sphereGeometry args={[2.022,48,32]}/><meshBasicMaterial color="#3eaaff" transparent opacity={.12} depthWrite={false}/></mesh>
  <Line points={orbit} color="#5dd9ff" lineWidth={1} transparent opacity={.5}/>
  <group ref={explosion} visible={false}>{debris.map((_,i)=><mesh key={i}><icosahedronGeometry args={[i%5===0?.23:.09,0]}/><meshBasicMaterial color={['#fff7bc','#ffb647','#ff602c'][i%3]}/></mesh>)}</group>
  <group ref={satellite}><group scale={.31}><Ship ids={ids}/></group></group>
 </>
}
export default function SpaceScene({ids,risky}) {
 return <Canvas camera={{position:[.2,4.3,9.6],fov:46,far:110}} dpr={[1,1.6]}><Orbit ids={ids} risky={risky}/></Canvas>
}

