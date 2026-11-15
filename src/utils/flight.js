export const profiles={
 light:{name:'Configuración ligera',mass:0,battery:0,fuel:35},
 battery:{name:'Batería auxiliar',mass:42,battery:20,fuel:25}
}
export function beginFlight(profile) {
 return {time:0,oxygen:100,fuel:profile.fuel,battery:profile.battery,circuit:false,seal:false,course:false,support:false}
}
export function advanceFlight(state,seconds) {
 const time=state.time+seconds
 const blackout=Math.max(0,time-Math.max(6,state.time))
 const battery=state.circuit?state.battery:Math.max(0,state.battery-blackout)
 const leak=Math.max(0,time-Math.max(15,state.time))
 const loss=state.circuit||state.support?1.25:3
 const backed=Math.min(leak,Math.max(0,state.battery-Math.max(0,15-Math.max(6,state.time))))
 const oxygen=state.seal?state.oxygen:Math.max(0,state.oxygen-backed*1.25-(leak-backed)*loss)
 return {...state,time,battery,oxygen}
}
export function flightResult(state) {
 if(state.oxygen<=0)return 'Se agotó el oxígeno.'
 if(state.time>=78 && !state.course)return 'Se cerró la ventana de corrección de rumbo.'
 if(state.circuit && state.seal && state.course)return 'success'
 return null
}
