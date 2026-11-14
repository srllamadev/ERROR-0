import React from 'react'
export function Box({size, at=[0,0,0], color='#b0c4cd', glow=0}) {
  return <mesh position={at} castShadow receiveShadow><boxGeometry args={size}/><meshStandardMaterial color={color} metalness={.46} roughness={.42} emissive={color} emissiveIntensity={glow}/></mesh>
}
export default function Ship({ids}) {
  const has = id=>ids.includes(id)
  return <group>
    <Box size={[1.05,1.22,1.05]} color="#c4d8df"/>
    <Box size={[1.12,.16,1.12]} at={[0,.49,0]} color="#435872"/>
    <Box size={[1.12,.14,1.12]} at={[0,-.49,0]} color="#435872"/>
    <Box size={[.62,.07,.04]} at={[0,.2,.55]} color="#37e6ff" glow={1}/>
    {has('heavy') && <Box size={[1.18,.42,1.18]} color="#617994"/>}
    {ids.some(id=>['small','medium','heavy'].includes(id)) && <mesh position={[0,-.08,-.65]}><capsuleGeometry args={[.26,.55,6,16]}/><meshStandardMaterial color="#e5af70" metalness={.5} roughness={.35}/></mesh>}
    {ids.some(id=>['small','medium','heavy'].includes(id)) && <mesh position={[0,-.78,0]}><cylinderGeometry args={[.21,.39,.42,20]}/><meshStandardMaterial color="#26485d" metalness={.7} roughness={.35}/></mesh>}
    {(has('solar_std')||has('solar_adv')) && [-1,1].map(side=><group key={side} position={[side*(has("solar_adv")?1.52:1.32),0,0]} scale={has("solar_adv")?1.22:1}>
      <Box size={[1.64,.1,1.04]} color="#345a93"/>
      {Array.from({length:5},(_,i)=><Box key={i} size={[.016,.025,1.03]} at={[(i-2)*.28,.06,0]} color="#67bde6" glow={.25}/>)}
      <Box size={[1.6,.025,.016]} at={[0,.06,0]} color="#67bde6"/>
    </group>)}
    {ids.some(id=>['sband','xband','optical'].includes(id)) && <group position={[0,.88,0]} scale={has("sband")?.65:has("optical")?1.2:1}><Box size={[.09,.65,.09]} color="#e3eaf0"/><mesh position={[0,.18,0]}><cylinderGeometry args={[.42,.15,.15,24]}/><meshStandardMaterial color="#d1e6eb" metalness={.55} roughness={.34}/></mesh></group>}
    {has('camera') && <group position={[0,-.09,.64]}><Box size={[.43,.34,.25]} color="#27374d"/><mesh rotation={[Math.PI/2,0,0]} position={[0,0,.15]}><cylinderGeometry args={[.12,.12,.07,20]}/><meshStandardMaterial color="#56d8ff" emissive="#117995"/></mesh></group>}
    {has('rtg') && <Box size={[.46,.71,.44]} at={[.66,0,0]} color="#dea963"/>}
    {['radar','atmo','magnetometer','laser','drill'].map((id,i)=>has(id) && <Box key={id} size={i===2?[.08,.08,.8]:[.23,.19,.26]} at={[(i%2)*.52-.25,.33-Math.floor(i/2)*.29,.62]} color={['#ffac62','#b0ebdc','#92b0fa','#df80ef','#ffe096'][i]}/>)}
    {has('battery') && <Box size={[.22,.48,.55]} at={[-.55,-.28,0]} color="#c9984c"/>}
  </group>
}

