import React,{useMemo} from 'react'
import {useTexture} from '@react-three/drei'
import {CanvasTexture,SRGBColorSpace} from 'three'
import {cuts,mounts,shipSheet,sheetSize} from './shipSprites'

const cache=new WeakMap()
function partTexture(image,id) {
 let textures=cache.get(image)
 if(!textures){textures=new Map();cache.set(image,textures)}
 if(textures.has(id)) return textures.get(id)
 const [x,y,w,h]=cuts[id]
 const sx=image.width/sheetSize[0],sy=image.height/sheetSize[1]
 const canvas=document.createElement('canvas')
 canvas.width=w
 canvas.height=h
 canvas.getContext('2d').drawImage(image,x*sx,y*sy,w*sx,h*sy,0,0,w,h)
 const texture=new CanvasTexture(canvas)
 texture.colorSpace=SRGBColorSpace
 textures.set(id,texture)
 return texture
}
export function SalvagePart({id,width=.75,position=[0,0,0],order=0}) {
 const sheet=useTexture(shipSheet)
 const map=useMemo(()=>partTexture(sheet.image,id),[sheet,id])
 const [,,w,h]=cuts[id]
 return <sprite position={position} scale={[width,width*h/w,1]} renderOrder={order}>
  <spriteMaterial map={map} transparent alphaTest={.04} depthWrite={false} toneMapped={false}/>
 </sprite>
}
export default function PlanetRocket({ids}) {
 return <group position={[0,1.35,0]}>
  {!ids.includes('frame') && <>
   <group position={[-.62,-.55,0]} rotation={[0,0,.32]}><SalvagePart id="frame" width={1.35}/></group>
   <group position={[.73,-.67,-.12]} rotation={[0,0,-.48]}><SalvagePart id="wing" width={1.32}/></group>
   <group position={[.12,-.91,.24]} rotation={[0,0,.22]}><SalvagePart id="engine" width={.84}/></group>
   <pointLight position={[0,-.48,.25]} intensity={2.1} distance={3} color="#ff563a"/>
  </>}
  {mounts.map(([module,id,x,y,w],index)=>{
   if(!ids.includes(module)) return null
   const [,,sw,sh]=cuts[id]
   return <SalvagePart key={id} id={id} width={w*.011} order={index+1}
    position={[(x+w/2-200)*.011,(130-y-w*sh/sw/2)*.013,0]}/>
  })}
 </group>
}

