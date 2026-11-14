import React from 'react'
import {Box} from './Ship'
export function SalvagePart({id}) {
 if(id==='shield') return <Box size={[.73,.12,.73]} color="#b070b9"/>
 if(id==='reserve') return <Box size={[.42,.52,.42]} color="#ed9862"/>
 if(id==='frame') return <Box size={[.55,.38,.56]} color="#e8ad78"/>
 if(id==='power') return <><Box size={[.59,.12,.46]} color="#334a80"/><Box size={[.025,.035,.44]} at={[0,.07,0]} color="#8de4ff" glow={1}/></>
 if(id==='navigation') return <><Box size={[.44,.3,.48]} color="#43596b"/><Box size={[.26,.12,.035]} at={[0,.04,.25]} color="#9df5ba" glow={1}/></>
 return <mesh><cylinderGeometry args={id==='tank'?[.23,.23,.49,14]:[.14,.31,.38,16]}/><meshStandardMaterial color={id==='tank'?'#e5b263':'#e67459'} metalness={.58} roughness={.36}/></mesh>
}
const mounts={engine:[0,.32,0],tank:[.71,1.02,0],power:[-.7,1.38,0],navigation:[0,1.7,0],reserve:[-.62,.77,0],shield:[0,1.45,0]}
export default function PlanetRocket({ids}) {
 return <group position={[0,.16,0]}>
  <Box size={[.98,.13,.98]} color="#3e5966"/>
  {ids.includes('frame') && <>
   <mesh position={[0,1.06,0]}><cylinderGeometry args={[.54,.88,.91,32]}/><meshStandardMaterial color="#dde6ec" metalness={.48} roughness={.36}/></mesh>
   <mesh position={[0,.65,0]}><cylinderGeometry args={[.9,.83,.16,32]}/><meshStandardMaterial color="#db813f" metalness={.48} roughness={.34}/></mesh><mesh position={[0,1.21,.61]} rotation={[-.31,0,0]} scale={[.46,.25,.12]}><sphereGeometry args={[1,24,16]}/><meshStandardMaterial color="#13283f" metalness={.5} roughness={.22}/></mesh>
  </>}
  {Object.entries(mounts).map(([id,position])=>ids.includes(id)&&<group key={id} position={position} scale={id==='engine'?1.5:1}><SalvagePart id={id}/></group>)}
 </group>
}


