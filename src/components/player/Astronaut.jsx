import React from 'react'
import {Box} from '../spaceship/Ship'
function Suit({color='#d9e6ec'}) {
 return <meshStandardMaterial color={color} roughness={.49} metalness={.24}/>
}
export default function Astronaut({body, limbs}) {
 return <group ref={body} position={[0,0,3.2]}>
  <Box size={[.47,.62,.31]} at={[0,1.02,0]} color="#d9e6ec"/>
  <Box size={[.23,.15,.04]} at={[0,1.08,.17]} color="#1f4564"/>
  <Box size={[.4,.56,.23]} at={[0,1.1,-.25]} color="#7996a7"/>
  <mesh position={[0,1.55,0]} castShadow><sphereGeometry args={[.28,24,16]}/><Suit/></mesh>
  <mesh position={[0,1.56,.137]} scale={[1,.78,.55]}><sphereGeometry args={[.248,24,16]}/><meshStandardMaterial color="#163951" metalness={.7} roughness={.2} emissive="#123d58" emissiveIntensity={.35}/></mesh>
  {[-1,1].map((side,i)=><React.Fragment key={side}>
   <group position={[side*.32,1.24,0]} ref={el=>{limbs.current[i]=el}}>
    <mesh position={[0,-.21,0]} castShadow><capsuleGeometry args={[.093,.32,4,10]}/><Suit/></mesh>
    <Box size={[.16,.14,.16]} at={[0,-.43,0]} color="#566f85"/>
   </group>
   <group position={[side*.128,.74,0]} ref={el=>{limbs.current[i+2]=el}}>
    <mesh position={[0,-.32,0]} castShadow><capsuleGeometry args={[.103,.39,4,10]}/><Suit/></mesh>
    <Box size={[.21,.16,.29]} at={[0,-.64,.051]} color="#4c6377"/>
   </group>
  </React.Fragment>)}
 </group>
}
