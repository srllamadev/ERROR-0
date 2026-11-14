export const modules={
 frame:{mass:210},engine:{mass:120,thrust:2850},tank:{mass:175,fuel:110},
 power:{mass:55,watts:180},navigation:{mass:35,watts:-105},reserve:{mass:76,fuel:65},shield:{mass:58}
}
export function reviewDesign(ids,destination) {
 const selected=Object.keys(modules).filter(id=>ids.includes(id))
 const mass=selected.reduce((sum,id)=>sum+modules[id].mass,0)
 const thrust=selected.includes('engine')?modules.engine.thrust:0
 const fuel=selected.reduce((sum,id)=>sum+(modules[id].fuel??0),0)
 const watts=selected.reduce((sum,id)=>sum+(modules[id].watts??0),0)-40
 const checks=[
  ['Estructura integrada',selected.includes('frame')],
  ['Motor integrado',thrust>0],
  ['Combustible para ascenso',fuel>=(destination?.fuel??90)],
  ['Empuje superior al peso local',mass>0 && thrust>mass*3.4],
  ['Margen eléctrico suficiente',watts>=0],
  ['Navegación integrada',selected.includes('navigation')],
  ...(destination?.extras.includes('reserve')?[['Tanque auxiliar integrado',selected.includes('reserve')]]:[]),
  ...(destination?.extras.includes('shield')?[['Escudo térmico integrado',selected.includes('shield')]]:[])
 ]
 return {mass,thrust,fuel,watts,checks,ready:checks.every(([,ok])=>ok)}
}

