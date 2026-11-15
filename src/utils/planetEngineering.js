import {zones} from '../data/planet.js'

export const modules={
 frame:{mass:210},engine:{mass:120,thrust:2850},tank:{mass:175,fuel:110},
 power:{mass:55,watts:180},navigation:{mass:35,watts:-105},reserve:{mass:76,fuel:65},shield:{mass:58},antenna:{mass:15,watts:-12},cooling:{mass:19,watts:-10},backup:{mass:23},burnt:{mass:42,fault:"La batería quemada provocó un cortocircuito."},ruptured:{mass:95,fault:"El depósito agrietado perdió presión durante la ignición."}
}
export function reviewDesign(ids,destination) {
 const selected=Object.keys(modules).filter(id=>ids.includes(id))
 const mass=selected.reduce((sum,id)=>sum+modules[id].mass,0)
 const thrust=selected.includes('engine')?modules.engine.thrust:0
 const fuel=selected.reduce((sum,id)=>sum+(modules[id].fuel??0),0)
 const watts=selected.reduce((sum,id)=>sum+(modules[id].watts??0),0)-40
 const checks=[
  ['Tanque principal integrado',selected.includes('tank')],
  ['Estructura integrada',selected.includes('frame')],
  ['Motor integrado',thrust>0],
  ['Combustible para ascenso',fuel>=(destination?.fuel??90)],
  ['Empuje superior al peso local',mass>0 && thrust>mass*3.4],
  ['Margen eléctrico suficiente',watts>=0],
  ['Navegación integrada',selected.includes('navigation')],
  ...(destination?.extras??[]).map(id=>[zones.find(zone=>zone.id===id).part,selected.includes(id)])
 ]
 const faults=selected.flatMap(id=>modules[id].fault?[modules[id].fault]:[])
 return {mass,thrust,fuel,watts,checks,faults,ready:faults.length===0 && checks.every(([,ok])=>ok)}
}



