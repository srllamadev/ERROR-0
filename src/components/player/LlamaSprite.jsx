import React,{useMemo,useRef} from 'react'
import {useFrame} from '@react-three/fiber'
import {useTexture} from '@react-three/drei'
import {CanvasTexture,SRGBColorSpace} from 'three'
import {SalvagePart} from '../spaceship/PlanetRocket'

const columns=[60,168,275,382,491,597,722,830,937,1044,1151,1258]
const rows={idle:[82,[0,1,2,3]],right:[199,[0,1,2,3,4,5,6,7,8,9,10,11]],left:[199,[0,1,2,3,4,5,6,7,8,9,10,11]],front:[646,[0,2]],back:[646,[1,3,4,5]]}
const cache=new WeakMap()
export function frames(image,index) {
 const variants=cache.get(image) ?? []
 if(variants[index]) return variants[index]
 const result=Object.fromEntries(Object.entries(rows).map(([name,[y,indices]])=>[name,indices.map(i=>{
  const canvas=document.createElement('canvas')
  const w=89,h=name==='idle'?91:87
  canvas.width=w
  canvas.height=h
  const ctx=canvas.getContext('2d')
  if(name==='left'){ctx.translate(w,0);ctx.scale(-1,1)}
  ctx.drawImage(image,(columns[i]+1)*image.width/1408,(y+1)*image.height/768,w*image.width/1408,h*image.height/768,0,0,w,h)
  const pixels=ctx.getImageData(0,0,w,h)
  const {data}=pixels
  for(let p=0;p<data.length;p+=4) {
   const [r,g,b]=[data[p],data[p+1],data[p+2]]
   if(g-r>17 && b-r>30 && b-g<48) data[p+3]=0
   else if(p/(4*w)>h*.54 && Math.max(r,g,b)-Math.min(r,g,b)<64) {
    const light=(r+g+b)/765
    const color=[[255,152,75],[74,171,255],[86,226,152]][index]
    for(let c=0;c<3;c++) data[p+c]=color[c]*(.38+.62*light)
   }
  }
  ctx.putImageData(pixels,0,0)
  const texture=new CanvasTexture(canvas)
  texture.colorSpace=SRGBColorSpace
  return texture
 })]))
 variants[index]=result
 cache.set(image,variants)
 return result
}
const accents=['#ff9f69','#71caff','#83ecc2']
export default function LlamaSprite({body,index=0,carrying,spawn}) {
 const sheet=useTexture(import.meta.env.BASE_URL+'llama-sheet.jpeg')
 const textures=useMemo(()=>frames(sheet.image,index),[sheet,index])
 const sprite=useRef()
 useFrame(({clock})=>{
  const {horizontal=0,vertical=0,moving=false}=body.current.userData
  const side=Math.abs(horizontal)>=Math.abs(vertical)*.7
  const mode=moving?(side?(horizontal<0?'left':'right'):vertical<0?'back':'front'):'idle'
  const list=textures[mode]
  sprite.current.material.map=list[Math.floor(clock.elapsedTime*(moving?12:3)+index)%list.length]
 })
 return <group ref={body} position={spawn??[-index*.85,0,5+index*.8]}>
  <sprite ref={sprite} position={[0,1.23,0]} scale={[2.42,2.42,1]}>
   <spriteMaterial map={textures.idle[0]} transparent alphaTest={.18} depthWrite={false} toneMapped={false}/>
  </sprite>
  <mesh position={[0,.035,0]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.35,.43,24]}/><meshBasicMaterial color={accents[index]}/></mesh>
  {carrying && <group position={[0,1.12,-.52]} renderOrder={-1}><SalvagePart id={carrying}/></group>}
 </group>
}




