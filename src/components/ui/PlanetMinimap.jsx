import React from 'react'
import {field,rocks} from '../../data/planet'
export default function PlanetMinimap({markers,stock,carrying,zones}) {
 return <aside className="planet-minimap" aria-label="Minimapa del Planeta X">
  <span className="kicker">MINIMAPA <span className="map-north">↑ NORTE</span></span>
  <svg viewBox={[-field.x,-field.z,field.x*2,field.z*2].join(' ')} role="img" aria-label="Campamento, equipo y zonas de recuperación">
   <rect x={-field.x} y={-field.z} width={field.x*2} height={field.z*2} fill="#34272c"/>
   {rocks.map(([x,z,r])=><circle key={x+','+z} cx={x} cy={z} r={r} fill="#64474b"/>)}
   <rect x="-1.7" y="-1.7" width="3.4" height="3.4" rx=".35" fill="#eef5ef"><title>Campamento</title></rect>
   {zones.map(zone=><circle key={zone.id} cx={zone.x} cy={zone.z} r="1.35" fill={stock.includes(zone.id)||carrying===zone.id?'#777078':zone.color}><title>{zone.name} · {zone.part}</title></circle>)}
   {[0,1,2].map(i=><circle key={i} ref={element=>{markers.current[i]=element}} cx={-i*.85} cy={5+i*.8} r={i===0?1.05:.7} fill={['#ff9f69','#71caff','#83ecc2'][i]} stroke="#151219" strokeWidth=".32"><title>{['Ingeniera','Exploradora','Piloto'][i]}</title></circle>)}
  </svg>
  <small>■ Campamento · ● Restos</small>
 </aside>
}




