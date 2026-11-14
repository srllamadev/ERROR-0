import {parts, limits} from '../data/components.js'

export function evaluate(ids) {
  const installed = parts.filter(part => ids.includes(part.id))
  const launcher = installed.find(part => part.group === 'launcher')
  const instruments = installed.filter(part => part.group === 'instrument')
  const totals = installed.reduce((sum, part) => ({
    cost:sum.cost+part.cost, mass:sum.mass+(part.mass ?? 0), power:sum.power+(part.power ?? 0)
  }), {cost:90,mass:420,power:-120})
  const capacity = launcher?.capacity ?? limits.mass
  const overloaded = Boolean(launcher && totals.mass > capacity)
  const dataRequired = instruments.reduce((sum, part) => sum+part.data,0)
  const downlink = installed.find(part => part.group === 'comms')?.data ?? 0
  const dataRatio = dataRequired ? Math.min(1,downlink/dataRequired) : 0
  const reserve = ids.includes('battery') || ids.includes('rtg')
  const science = Math.round(instruments.reduce((sum, part) =>
    sum+part.science*(part.id==='camera'||part.id==='radar'?1.25:1),0)*dataRatio)
  const blockers = []
  if (totals.cost > limits.cost) blockers.push('Reduce el costo retirando componentes.')
  if (totals.power < 0) blockers.push('Añade generación para cubrir el consumo.')
  if (!launcher) blockers.push('Selecciona un lanzador.')
  const canRisk = overloaded && blockers.length===0
  if (overloaded) blockers.push('La masa supera la capacidad del lanzador. El ascenso de prueba terminará en una explosión.')
  const issues = []
  if (!ids.includes('camera')) issues.push('Instala una cámara para observar la superficie.')
  if (!downlink) issues.push('Instala un sistema de comunicaciones para enviar imágenes.')
  else if (dataRatio<1) issues.push('El enlace no puede enviar todos los datos. Mejora la antena o reduce los instrumentos.')
  if (!reserve) issues.push('Instala una batería para mantener la observación durante el eclipse.')
  return {...totals, capacity, canRisk, dataRequired, downlink, dataRatio, reserve, science, blockers, issues,
    score:Math.max(0,100-30*issues.length)}
}
