import React,{useEffect,useRef} from 'react'
import {Canvas,useFrame} from '@react-three/fiber'
import {CanvasTexture,SRGBColorSpace} from 'three'
const crops={mars:[118,101,158],venus:[447,100,158],moon:[770,102,157]}
function Globe({target}) {
 const planet=useRef()
 useFrame((_,dt)=>{planet.current.rotation.y+=dt*.55})
 useEffect(()=>{
  let active=true,texture
  const material=planet.current.material
  const image=new Image()
  image.onload=()=>{
   if(!active)return
   const [x,y,size]=crops[target.id]
   const source=document.createElement('canvas')
   source.width=source.height=size
   const input=source.getContext('2d')
   input.drawImage(image,x*image.width/1376,y*image.height/768,size*image.width/1376,size*image.height/768,0,0,size,size)
   const sample=input.getImageData(0,0,size,size).data
   const canvas=document.createElement('canvas')
   canvas.width=512
   canvas.height=256
   const ctx=canvas.getContext('2d'), output=ctx.createImageData(512,256)
   for(let v=0;v<256;v++) for(let u=0;u<512;u++){
    const lat=(v/255-.5)*Math.PI, lon=u/512*2*Math.PI
    const a=Math.round((.5+.44*Math.cos(lat)*Math.sin(lon))*(size-1))
    const b=Math.round((.5+.44*Math.sin(lat))*(size-1))
    const src=(b*size+a)*4,dst=(v*512+u)*4
    for(let c=0;c<3;c++) output.data[dst+c]=sample[src+c]
    output.data[dst+3]=255
   }
   ctx.putImageData(output,0,0)
   texture=new CanvasTexture(canvas)
   texture.colorSpace=SRGBColorSpace
   material.map=texture
   material.color.set('white')
   material.needsUpdate=true
  }
  image.src=import.meta.env.BASE_URL+'destinations.jpg'
  return ()=>{active=false;texture?.dispose()}
 },[target])
 return <mesh ref={planet}><sphereGeometry args={[1,48,32]}/><meshStandardMaterial color={target.color}/></mesh>
}
export default function DestinationGlobe({target}) {
 return <div className="destination-globe"><Canvas camera={{position:[0,0,4],fov:40}}><ambientLight intensity={1.2}/><directionalLight position={[-3,2,4]} intensity={2}/><Globe key={target.id} target={target}/></Canvas></div>
}
